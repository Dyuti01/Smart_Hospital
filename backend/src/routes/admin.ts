import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";

const app = express();

export const adminRouter = express.Router();

adminRouter.post("/addNewUser", async (req: Request, res: Response) => {
  try {
	console.log(req.body);
    const prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });
    const {
      firstName,
      lastName,
      email,
      password,
      userType,
      role,
      phone,
	  department
    } = req.body;
    const already = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (already) {
      res.status(409).json({ message: "User with this email already exists!" });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 11);
    const user = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        password: passwordHash,
        email: email,
        userType: role,
        phone: phone,
      },
    });
    if (role === "Doctor") {
      const {
        title,
        availability,
        experience,
        about,
        bookingFee,
        rating,
        reviewCount,
        education,
        certifications,
        specializations,
        languages,
        registrationNumber,
		department
      } = req.body;
	  
      const doctor = await prisma.doctor.create({
        data: {
          registrationNumber: registrationNumber,
		      department:department,
          availability: {connectOrCreate:{
            where:{doctorId:user.userId},
            create:{
              monday:{
                create:availability.monday
              },
              tuesday:{
                create:availability.tuesday
              },
              wednesday:{
                create:availability.wednesday
              },
              thursday:{
                create:availability.thursday
              },
              friday:{
                create:availability.friday
              },
              saturday:{
                create:availability.saturday
              },
              sunday:{
                create:availability.sunday
              }
            }
            }
          },
          experience: experience || "",
          doctorId: user.userId,
          about: about || "",
          bookingFee: bookingFee || 150,
          rating: rating || 0,
          reviewCount: reviewCount||0,
          title: department.slice(0, department.length-1)+"ist",
          certifications: certifications||[],
          education: { createMany: { data: education } },
          
          languages: languages||[],
          specializations: specializations||[]
        },
      });
	  res.json({userDetails:doctor})
    }
	else{
		const {
			salary,
		  } = req.body;
		const staff = await prisma.staff.create({data:{
			department:department,
			salary:salary||10000,
			staffId:user.userId
		}})
		res.json({userDetails:staff})
	}
  await prisma.$disconnect()
	return;
  } catch (err: any) {
    const message = err.message;
    res.status(400).json({ error: message });
  }
});

adminRouter.get("/getAllStaffData", async (req:Request, res:Response)=>{
  try{
	const prisma = new PrismaClient({
		datasourceUrl: process.env.DATABASE_URL,
	});

	let allDoctors = await prisma.doctor.findMany({include:{doctor:true, availability:true, education:true}})
	const allOtherStaff = await prisma.staff.findMany({include:{staff:true}})
	
	const allStaffReqData:any = []
	allDoctors.map((doctor)=>{
		const requiredData = {
			id:doctor.doctorId,
			firstName: doctor.doctor.firstName,
			lastName: doctor.doctor.lastName,
			email: doctor.doctor.email,
			role: doctor.doctor.userType,
			department: doctor.department,
			status: doctor.status,
			registrationNumber: doctor.registrationNumber,
			avatar: doctor.doctor.avatarUrl,
      phone:doctor.doctor.phone,
		}
		allStaffReqData.push(requiredData)
	})

	allOtherStaff.map((staff)=>{
		const requiredData = {
			id:staff.staffId,
			firstName: staff.staff.firstName,
			lastName: staff.staff.lastName,
			email: staff.staff.email,
			role: staff.staff.userType,
			department: staff.department,
			status: staff.status,
			avatar: staff.staff.avatarUrl,
      phone:staff.staff.phone
		}

		allStaffReqData.push(requiredData)
	})
	
	res.json({allStaff:allStaffReqData})
  await prisma.$disconnect()
	return;
}
 catch (err: any) {
    const message = err.message;
    res.status(400).json({ error: message });
  }
	  
})
