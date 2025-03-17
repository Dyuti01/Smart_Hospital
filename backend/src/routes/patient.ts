import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { userAuth } from "../middlewares/auth";
import { validatePatientProfileUpdateData } from "../utils/validation";
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
import jwt from "jsonwebtoken";

const app = express();

export const patientRouter = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

// patientRouter.post("/makeAppointment", async (req:Request, res:Response)=>{
//   try{
//       const prisma = new PrismaClient({
//       datasourceUrl: process.env.DATABASE_URL,
//     });
//     console.log(req.body)
//   const appointmentDetails:AppointmentDetails = req.body;
//     // console.log(doctorId)

//     // make the payment

//   await prisma.appointment.create({
//   data:{
//     patientId:"f55f1ec0-5793-4f4c-8fd6-cb042dd22fc4", doctorId:"8587cc89-76ac-4e31-97aa-f1da23769d82",
//     appointmentDateTime:appointmentDetails.appointmentDate.startDate||new Date()
//   }})
//   res.json({message:"Appointment created"})
//   } catch (err: any) {
//     const message = err.message;
//     res.status(400).json({ error: message });
//   }
// })

patientRouter.get(
  "/getPatientData/:patientId",
  userAuth,
  async (req: Request, res: Response) => {
    try {
      const prisma = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
      });
      const patientId = req.params.patientId;
      const patientData = await prisma.patient.findUnique({
        where: { patientId: patientId },
        select: {
          allergies: true,
          appointments: true,
          bloodType: true,
          chronicConditions: true,
          emergencyContact: true,
          patientId: true,
          paymentHistoryIds: true,
          prescriptions: true,
          previousAppointmentIds: true,
          testReports: true,
          patient: true,
        },
      });
      if (!patientData) {
        throw new Error("No such user exists!");
      }

      const { password, ...safeUserData } = patientData.patient;
      const safeData = {
        allergies: patientData?.allergies || [],
        appointments: patientData?.appointments || [],
        bloodType: patientData?.bloodType || "Unknown",
        chronicConditions: patientData?.chronicConditions || [],
        // emergencyContact: patientData?.emergencyContact || { name: "", phone: "", relation: "" },
        emergencyContact: patientData?.emergencyContact || "N/A",
        patientId: patientData?.patientId || "",
        paymentHistoryIds: patientData?.paymentHistoryIds || [],
        prescriptions: patientData?.prescriptions || [],
        previousAppointmentIds: patientData?.previousAppointmentIds || [],
        testReports: patientData?.testReports || [],
        firstName: patientData?.patient?.firstName || "N/A",
        lastName: patientData?.patient?.lastName || "N/A",
        avatarUrl: patientData?.patient?.avatarUrl || "/avatar.png", // Default image
        dob: patientData?.patient?.dateOfBirth || "Unknown",
        email: patientData?.patient?.email || "N/A",
        gender: patientData?.patient?.gender || "Unknown",
        phone: patientData?.patient?.phone || "N/A",
        city: patientData?.patient?.city || "N/A",
        state: patientData?.patient?.state || "N/A",
        pin: patientData?.patient?.pin || "N/A",
      };

      res.json({ userDetails: safeData });
      await prisma.$disconnect();
      return;
    } catch (err: any) {
      const message = err.message;
      res.status(400).json({ error: message });
    }
  }
);

// Update user info
patientRouter.patch(
  "/edit/:patientId",
  userAuth,
  upload.single("avatarUrl"),
  async (req: any, res) => {
    try {
      const patientId = req.params.patientId;
      const prisma = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
      });
      const userOld = await prisma.user.findUnique({
        where: { userId: patientId },
      });
      if (!userOld) {
        throw new Error("No such user exists!");
      }

      console.log(req.file);
      const dataObj = req.body;

      if (!req.file) {
        const userData = {
          firstName: dataObj.firstName,
          lastName: dataObj.lastName,
          gender: dataObj.gender,
          email: dataObj.email,
          password: dataObj.password,
          dateOfBirth: dataObj.dob,
          city: dataObj.city,
          state: dataObj.state,
          pin: dataObj.pin,
          phone: dataObj.phone,
          userType: dataObj.userType,
          avatarUrl: dataObj.avatarUrl,
        };

        const user = await prisma.user.update({
          where: { userId: patientId },
          data: userData,
        });
        const patientData = await prisma.patient.update({
          where: { patientId: patientId },
          data: {
            allergies: dataObj.allergies || [],
            bloodType: dataObj.bloodType || "",
            chronicConditions: dataObj.chronicConditions || [],
            emergencyContact: dataObj.emergencyContact || "",
            previousAppointmentIds: dataObj.previousAppointmentIds || [],
          },
          select: {
            allergies: true,
            appointments: true,
            bloodType: true,
            chronicConditions: true,
            emergencyContact: true,
            patientId: true,
            paymentHistoryIds: true,
            prescriptions: true,
            previousAppointmentIds: true,
            testReports: true,
            patient: true,
          },
        });
        const safeData = {
          allergies: patientData?.allergies || [],
          appointments: patientData?.appointments || [],
          bloodType: patientData?.bloodType || "Unknown",
          chronicConditions: patientData?.chronicConditions || [],
          // emergencyContact: patientData?.emergencyContact || { name: "", phone: "", relation: "" },
          emergencyContact: patientData?.emergencyContact || "N/A",
          patientId: patientData?.patientId || "",
          paymentHistoryIds: patientData?.paymentHistoryIds || [],
          prescriptions: patientData?.prescriptions || [],
          previousAppointmentIds: patientData?.previousAppointmentIds || [],
          testReports: patientData?.testReports || [],
          firstName: patientData?.patient?.firstName || "N/A",
          lastName: patientData?.patient?.lastName || "N/A",
          avatarUrl: patientData?.patient?.avatarUrl || "/avatar.png", // Default image
          dob: patientData?.patient?.dateOfBirth || "Unknown",
          email: patientData?.patient?.email || "N/A",
          gender: patientData?.patient?.gender || "Unknown",
          phone: patientData?.patient?.phone || "N/A",
          city: patientData?.patient?.city || "N/A",
          state: patientData?.patient?.state || "N/A",
          pin: patientData?.patient?.pin || "N/A",
        };

        res.json({ patientDetails: safeData });
        await prisma.$disconnect();
        return;
      } else {
        if (userOld.avatarUrl !== "/avatar.svg") {
          const urlOld = userOld.avatarUrl;
          const public_id =
            "smartHealth/" + urlOld.split("smartHealth/")[1].split(".")[0];
          console.log(public_id);
          cloudinary.uploader.destroy(
            public_id, // Replace with the extracted public_id
            { invalidate: true },
            (error: any, result: any) => {
              if (error) {
                console.error("Error deleting image:", error);
              } else {
                console.log("Image deleted successfully:", result);
              }
            }
          );
        }
        const stream = cloudinary.uploader.upload_stream(
          { folder: "smartHealth" }, // Cloudinary folder name
          async (error: any, result: any) => {
            if (error) return res.status(500).json({ error: error.message });
            console.log(result.secure_url);
            // res.json({ imageUrl: result.secure_url });

            // console.log(dataObj);
            // if (!validatePatientProfileUpdateData(req)) {
            //   throw new Error("Update not allowed!");
            // }

            const userData = {
              firstName: dataObj.firstName,
              lastName: dataObj.lastName,
              gender: dataObj.gender,
              email: dataObj.email,
              password: dataObj.password,
              dateOfBirth: dataObj.dob,
              city: dataObj.city,
              state: dataObj.state,
              pin: dataObj.pin,
              phone: dataObj.phone,
              userType: dataObj.userType,
              avatarUrl: result.secure_url,
            };

            const user = await prisma.user.update({
              where: { userId: patientId },
              data: userData,
            });
            const patientData = await prisma.patient.update({
              where: { patientId: patientId },
              data: {
                allergies: dataObj.allergies || [],
                bloodType: dataObj.bloodType || "",
                chronicConditions: dataObj.chronicConditions || [],
                emergencyContact: dataObj.emergencyContact || "",
                previousAppointmentIds: dataObj.previousAppointmentIds || [],
              },
              select: {
                allergies: true,
                appointments: true,
                bloodType: true,
                chronicConditions: true,
                emergencyContact: true,
                patientId: true,
                paymentHistoryIds: true,
                prescriptions: true,
                previousAppointmentIds: true,
                testReports: true,
                patient: true,
              },
            });
            const safeData = {
              allergies: patientData?.allergies || [],
              appointments: patientData?.appointments || [],
              bloodType: patientData?.bloodType || "Unknown",
              chronicConditions: patientData?.chronicConditions || [],
              // emergencyContact: patientData?.emergencyContact || { name: "", phone: "", relation: "" },
              emergencyContact: patientData?.emergencyContact || "N/A",
              patientId: patientData?.patientId || "",
              paymentHistoryIds: patientData?.paymentHistoryIds || [],
              prescriptions: patientData?.prescriptions || [],
              previousAppointmentIds: patientData?.previousAppointmentIds || [],
              testReports: patientData?.testReports || [],
              firstName: patientData?.patient?.firstName || "N/A",
              lastName: patientData?.patient?.lastName || "N/A",
              avatarUrl: patientData?.patient?.avatarUrl || "/avatar.png", // Default image
              dob: patientData?.patient?.dateOfBirth || "Unknown",
              email: patientData?.patient?.email || "N/A",
              gender: patientData?.patient?.gender || "Unknown",
              phone: patientData?.patient?.phone || "N/A",
              city: patientData?.patient?.city || "N/A",
              state: patientData?.patient?.state || "N/A",
              pin: patientData?.patient?.pin || "N/A",
            };
            streamifier.createReadStream(req.file.buffer).pipe(stream);

            res.json({ patientDetails: safeData });
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
        await prisma.$disconnect();
        return;
      }
    } catch (err) {
      res.status(400).json({ error: "Something went wrong, " + err });
    }
  }
);

patientRouter.post("/isPaymentDone", userAuth, async (req: Request, res: Response) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });
    const { orderId } = req.body;
    const p = await prisma.payment.findUnique({
      where: { paymentId: orderId },
    });
    if (!p || !p.done) {
      res.status(402).json({ message: "No" });
      return;
    }

    res.json({ message: "PaymentDone" });
  } catch (err: any) {
    const message = err.message;
    res.status(400).json({ error: message });
  }
});

export const makeAppointment = async (appointmentDetails: any) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });
    //   console.log(req.body)
    // const appointmentDetails:AppointmentDetails = req.body;
    // console.log(doctorId)

    // make the payment

    const appointment = await prisma.appointment.create({
      data: {
        patientId: appointmentDetails.patientId,
        doctorId: appointmentDetails.doctorId,
        patientPersonName: appointmentDetails.patientPersonName||"",
        patientPersonEmail: appointmentDetails.patientPersonEmail||"",
        patientPersonPhone: appointmentDetails.patientPersonPhone||"",
        appointmentDateTime: appointmentDetails.date,
        timeSlot: appointmentDetails.timeSlot,
        reasonForAppointment: appointmentDetails.patient.reason,
        status: "SCHEDULED",
        // location: "Ask at the counter."
      },
    });
    await prisma.$disconnect();
    return appointment;
  } catch (err: any) {
    const message = err.message;
    throw new Error(message);
  }
};

patientRouter.get(
  "/getAllData/:patientId",
  userAuth,
  async (req: Request, res: Response) => {
    try {
      const prisma = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
      });
      const patientId = req.params.patientId

      const appointments = await prisma.appointment.findMany({
        where: {
          patientId: patientId,
        },
        include: {
          doctor: { include: { doctor: true } },
          patient: { include: { patient: true } },
          vitals: true,
          prescription:true
        }
      });

      const payments = await prisma.payment.findMany({where:{customerId:patientId}})

      const appointmentsData:any = [];
      const prescriptions:any = [];
      const patientPayments:any = [];

      appointments.map((appointment) => {
        const appointmentSafeData = {
          id: appointment.appointmentId,
          date: appointment.appointmentDateTime,
          doctor: "Dr. "+
            appointment.doctor.doctor.firstName +
            " " +
            appointment.doctor.doctor.lastName,
          department: appointment.doctor.department,
          patientPersonName: appointment.patientPersonName,
          patientPersonPhone: appointment.patientPersonPhone,
          patientPersonEmail: appointment.patientPersonEmail,
          status: (appointment.status[0]+appointment.status.slice(1)).toLowerCase(),
          notes: appointment.notes||"",
          location: appointment.location,
          duration: appointment.duration,
          reason: appointment.reasonForAppointment||"",
          followUp: appointment.followUp||"",
          vitals: appointment.vitals || {
              bloodPressure: "",
              heartRate: "",
              temperature: "",
              oxygenSaturation: "",
            },
          // vitals: {
          //   bloodPressure: "",
          //   heartRate: "72 bpm",
          //   temperature: "98.4°F",
          //   oxygenSaturation: "97%",
          // },
        };
        appointmentsData.push(appointmentSafeData);

        const {prescription} = appointment;
        if (prescription){  
        const prescriptionData = {
          id:prescription.prescriptionId,
          date: prescription.dateTime,
          appointmentId: prescription.appointmentId,
          appointmentDate: appointment.appointmentDateTime,
          appointmentReason: appointment.reasonForAppointment||"",
          patientPersonName: appointment.patientPersonName,
          doctor: "Dr. " + appointment.doctor.doctor.firstName+" "+appointment.doctor.doctor.lastName,
          department: appointment.doctor.department,
          medications: prescription.medications||[],
          tests: prescription.tests||[],
          notes: prescription.notes,
          fileType: prescription.prescriptionFileType||"pdf",
          fileUrl: prescription.prescriptionUrl||"/no-file.pdf", // In a real app, this would be a real PDF URL
        }

        prescriptions.push(prescriptionData);
      }
      });

      payments.map((payment)=>{
        const paymentData = {
          id: payment.paymentId,
          date: payment.paymentDateTime,
          amount: Number(payment.amount),
          description: payment.description,
          status: payment.done?"completed":"cancelled",
        }

        patientPayments.push(paymentData)
      })

      res.json({ appointments: appointmentsData, prescriptions:prescriptions, payments:patientPayments });
      await prisma.$disconnect();
      return;
    } catch (err: any) {
      const message = err.message;
      res.status(400).json({ error: message });
    }
  }
);
