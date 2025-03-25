import { PrismaClient } from "@prisma/client";
import express, { application, Request, Response } from "express";
import { userAuth } from "../middlewares/auth";
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const app = express();

export const doctorRouter = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

doctorRouter.get(
  "/getDoctorData/:doctorId",
  userAuth,
  async (req: Request, res: Response) => {
    try {
      const prisma = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
      });

      const doctorId = req.params.doctorId;

      const doctor = await prisma.doctor.findUnique({
        where: { doctorId: doctorId },
        select: {
          doctorId: true,
          about: true,
          availability: true,
          bookingFee: true,
          certifications: true,
          doctor: true,
          education: true,
          experience: true,
          languages: true,
          patientAppointments: true,
          prescriptions: true,
          rating: true,
          reviewCount: true,
          specializations: true,
          testReports: true,
          title: true,
          department: true,
          registrationNumber: true,
          status: true,
        },
      });

      const availability = await prisma.availability.findUnique({
        where: {
          doctorId: doctorId,
        },
        select: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        },
      });

      if (!doctor) {
        throw new Error("No such doctor exists!");
      }

      const safeData = {
        doctorId: doctor?.doctorId,
        availability: availability,
        education: doctor.education,
        bookingFee: doctor.bookingFee,
        certifications: doctor.certifications,
        languages: doctor.languages,
        experience: doctor?.experience,
        patientAppointments: doctor?.patientAppointments,
        prescriptions: doctor?.prescriptions,
        titile: doctor?.title,
        testReports: doctor?.testReports,
        rating: doctor.rating,
        reviewCount: doctor.reviewCount,
        specializations: doctor.specializations,
        department: doctor.department,
        registrationNumber: doctor.registrationNumber,
        status: doctor.status,
        doctor: {
          city: doctor?.doctor.city,
          dateOfBirth: doctor?.doctor.dateOfBirth,
          email: doctor?.doctor.email,
          firstName: doctor?.doctor.firstName,
          lastName: doctor?.doctor.lastName,
          gender: doctor?.doctor.gender,
          pin: doctor?.doctor.pin,
          state: doctor?.doctor.state,
        },
      };
      const doctorData = {
        id: doctor.doctorId,
        firstName: doctor.doctor.firstName,
        lastName: doctor.doctor.lastName,
        email: doctor.doctor.email,
        phone: doctor.doctor.phone,
        specialty: doctor.department,
        department: doctor.department,
        licenseNumber: doctor.registrationNumber,
        education: doctor.education,
        experience: doctor.experience,
        bio: doctor.about,
        avatarUrl: doctor.doctor.avatarUrl || "/avatar.svg",
        availability: availability || {},
        appointments: doctor.patientAppointments || [],
        specializations: doctor.specializations || [],
        languages: doctor.languages,
        bookingFee: doctor.bookingFee,
      };
      res.json({ userDetails: doctorData });
      await prisma.$disconnect();
      return;
    } catch (err: any) {
      const message = err.message;
      res.status(400).json({ error: message });
    }
  }
);
doctorRouter.get(
  "/getDoctorPublicData/:doctorId",
  async (req: Request, res: Response) => {
    try {
      const prisma = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
      });

      const doctorId = req.params.doctorId;

      const doctor = await prisma.doctor.findUnique({
        where: { doctorId: doctorId },
        select: {
          doctorId: true,
          about: true,
          availability: true,
          bookingFee: true,
          certifications: true,
          doctor: true,
          education: true,
          experience: true,
          languages: true,
          patientAppointments: true,
          prescriptions: true,
          rating: true,
          reviewCount: true,
          specializations: true,
          testReports: true,
          title: true,
          department: true,
          registrationNumber: true,
          status: true,
        },
      });

      const availability = await prisma.availability.findUnique({
        where: {
          doctorId: doctorId,
        },
        select: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        },
      });

      if (!doctor) {
        throw new Error("No such doctor exists!");
      }

      const safeData = {
        doctorId: doctor?.doctorId,
        availability: availability,
        education: doctor.education,
        bookingFee: doctor.bookingFee,
        certifications: doctor.certifications,
        languages: doctor.languages,
        experience: doctor?.experience,
        patientAppointments: doctor?.patientAppointments,
        prescriptions: doctor?.prescriptions,
        titile: doctor?.title,
        testReports: doctor?.testReports,
        rating: doctor.rating,
        reviewCount: doctor.reviewCount,
        specializations: doctor.specializations,
        department: doctor.department,
        registrationNumber: doctor.registrationNumber,
        status: doctor.status,
        doctor: {
          city: doctor?.doctor.city,
          dateOfBirth: doctor?.doctor.dateOfBirth,
          email: doctor?.doctor.email,
          firstName: doctor?.doctor.firstName,
          lastName: doctor?.doctor.lastName,
          gender: doctor?.doctor.gender,
          pin: doctor?.doctor.pin,
          state: doctor?.doctor.state,
        },
      };
      const doctorData = {
        id: doctor.doctorId,
        firstName: doctor.doctor.firstName,
        lastName: doctor.doctor.lastName,
        email: doctor.doctor.email,
        phone: doctor.doctor.phone,
        specialty: doctor.department,
        department: doctor.department,
        licenseNumber: doctor.registrationNumber,
        education: doctor.education,
        experience: doctor.experience,
        bio: doctor.about,
        avatarUrl: doctor.doctor.avatarUrl || "/avatar.svg",
        availability: availability || {},
        appointments: doctor.patientAppointments || [],
        specializations: doctor.specializations || [],
        languages: doctor.languages,
        bookingFee: doctor.bookingFee,
      };
      res.json({ userDetails: doctorData });
      await prisma.$disconnect();
      return;
    } catch (err: any) {
      const message = err.message;
      res.status(400).json({ error: message });
    }
  }
);

doctorRouter.patch(
  "/editSchedule/:doctorId",
  userAuth,
  async (req: Request, res: Response) => {
    try {
      const prisma = new PrismaClient();

      const doctorId = req.params.doctorId;
      const {userId, user, ...scheduleData} = req.body;

      const availability = await prisma.availability.findUnique({
        where: { doctorId: doctorId },
      });

      if (!availability) {
        console.log("Doctor's availability record not found.");
        res.status(404).json({ error: "Doctor's availability record not found." });
        return;
      }

      // Delete existing time slots
      await prisma.timeSlot.deleteMany({
        where: { availabilityId: availability.id },
      });

      // Ensure `scheduleData` contains valid slot arrays
      const newTimeSlots = Object.entries(scheduleData).flatMap(([day, slots]: any) => {
        return slots.map((slot: any) => ({
          start: slot.start,
          end: slot.end,
          availabilityId: availability.id,
          [day + "AvailabilityId"]: availability.id, // Ensure dynamic key assignment is correct
        }));
      });

      if (newTimeSlots.length > 0) {
        await prisma.timeSlot.createMany({
          data: newTimeSlots,
        });
      }

      await prisma.$disconnect();
      res.json({ success: true, message: "Schedule updated successfully", scheduleData });
      return
    } catch (err: any) {
      console.error("Error updating schedule:", err);
      res.status(400).json({ error: err.message });
      return;
    }
  }
);

doctorRouter.patch(
  "/edit/:doctorId",
  userAuth,
  upload.single("avatarUrl"),
  async (req: any, res) => {
    try {
      const doctorId = req.params.doctorId;
      const prisma = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
      });
      const userOld = await prisma.user.findUnique({
        where: { userId: doctorId },
      });
      if (!userOld) {
        throw new Error("No such user exists!");
      }

      const dataObj = req.body;
      if (!req.file) {
        const userData = {
          firstName: dataObj.firstName,
          lastName: dataObj.lastName,
          email: dataObj.email,
          phone: dataObj.phone,
          avatarUrl: dataObj.avatarUrl,
        };

        const user = await prisma.user.update({
          where: { userId: doctorId },
          data: userData,
        });
        const doctor = await prisma.doctor.update({
          where: { doctorId: doctorId },
          data: {
            about: dataObj.bio,
            experience: dataObj.experience,
            registrationNumber: dataObj.licenseNumber,
            department: dataObj.department,
            specializations: dataObj.specializations,
            languages: dataObj.languages,
          },
          select: {
            about: true,
            experience: true,
            registrationNumber: true,
            title: true,
            department: true,
            doctor: true,
            education: true,
            patientAppointments: true,
            specializations: true,
            languages: true,
            bookingFee: true,
          },
        });
        const availability = await prisma.availability.findUnique({
          where: {
            doctorId: doctorId,
          },
          select: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true,
          },
        });
        const safeData = {
          id: doctor.doctor.userId,
          firstName: doctor.doctor.firstName,
          lastName: doctor.doctor.lastName,
          email: doctor.doctor.email,
          phone: doctor.doctor.phone,
          specialty: doctor.department,
          department: doctor.department,
          licenseNumber: doctor.registrationNumber,
          education: doctor.education,
          experience: doctor.experience,
          bio: doctor.about,
          avatarUrl: doctor.doctor.avatarUrl || "/avatar.svg",
          availability: availability || {},
          appointments: doctor.patientAppointments || [],
          specializations: doctor.specializations,
          languages: doctor.languages,
          bookingFee: doctor.bookingFee,
        };
        await prisma.$disconnect();
        res.json({ doctorDetails: safeData });
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
              email: dataObj.email,
              phone: dataObj.phone,
              avatarUrl: result.secure_url,
            };

            const user = await prisma.user.update({
              where: { userId: doctorId },
              data: userData,
            });
            const doctor = await prisma.doctor.update({
              where: { doctorId: doctorId },
              data: {
                about: dataObj.bio,
                experience: dataObj.experience,
                registrationNumber: dataObj.licenseNumber,
                department: dataObj.department,
                specializations: dataObj.specializations,
                languages: dataObj.languages,
              },
              select: {
                about: true,
                experience: true,
                registrationNumber: true,
                title: true,
                department: true,
                doctor: true,
                education: true,
                patientAppointments: true,
                specializations: true,
                languages: true,
                bookingFee: true,
              },
            });
            const availability = await prisma.availability.findUnique({
              where: {
                doctorId: doctorId,
              },
              select: {
                monday: true,
                tuesday: true,
                wednesday: true,
                thursday: true,
                friday: true,
                saturday: true,
                sunday: true,
              },
            });
            const safeData = {
              id: doctor.doctor.userId,
              firstName: doctor.doctor.firstName,
              lastName: doctor.doctor.lastName,
              email: doctor.doctor.email,
              phone: doctor.doctor.phone,
              specialty: doctor.department,
              department: doctor.department,
              licenseNumber: doctor.registrationNumber,
              education: doctor.education,
              experience: doctor.experience,
              bio: doctor.about,
              avatarUrl: doctor.doctor.avatarUrl || "/avatar.svg",
              availability: availability || {},
              appointments: doctor.patientAppointments || [],
              specializations: doctor.specializations,
              languages: doctor.languages,
              bookingFee: doctor.bookingFee,
            };
            streamifier.createReadStream(req.file.buffer).pipe(stream);
            await prisma.$disconnect();

            res.json({ doctorDetails: safeData });
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
        return;
      }
    } catch (err) {
      res.status(400).json({ error: "Something went wrong, " + err });
    }
  }
);

doctorRouter.get(
  "/getAllData/:doctorId",
  userAuth,
  async (req: Request, res: Response) => {
    try {
      const prisma = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
      });
      const doctorId = req.params.doctorId;

      const appointments = await prisma.appointment.findMany({
        where: {
          doctorId: doctorId,
        },
        include: {
          doctor: { include: { doctor: true } },
          patient: { include: { patient: true } },
          vitals: true,
          prescription: true,
        },
      });

      const appointmentsData: any = [];
      const patientsData: any = [];

      appointments.map((appointment) => {
        const appointmentSafeData = {
          id: appointment.appointmentId,
          patientId: appointment.patientId,
          date: appointment.appointmentDateTime,
          patientPhone: appointment.patient.patient.phone,
          patientName:
            appointment.patient.patient.firstName +
            " " +
            appointment.patient.patient.lastName,
          // nameOfPatient:appointment.patientName,
          patientPersonName: appointment.patientPersonName,
          patientPersonPhone: appointment.patientPersonPhone,
          patientPersonEmail: appointment.patientPersonEmail,
          department: appointment.doctor.department,
          status: (
            appointment.status[0] + appointment.status.slice(1)
          ).toLowerCase(),
          notes: appointment.notes || "",
          location: appointment.location,
          duration: appointment.duration,
          reason: appointment.reasonForAppointment || "",
          followUp: appointment.followUp || "",
          attended: appointment.visited,
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
          prescription: {
            medications: appointment.prescription?.medications || [],
            tests: appointment.prescription?.tests || [],
            notes: appointment.prescription?.notes || "",
            prescriptionUrl: appointment.prescription?.prescriptionUrl,
          },
        };

        const patientSafeData = {
          id: appointment.patientId,
          name: appointment.patientPersonName,
          patientPhone: appointment.patientPersonPhone,
          patientEmail: appointment.patientPersonEmail,
          age:
            new Date().getFullYear() -
            new Date(
              appointment.patient.patient.dateOfBirth || ""
            ).getFullYear(),
          gender: appointment.patient.patient.gender,
          lastVisit: appointment.appointmentDateTime,
          condition: appointment.reasonForAppointment,
          contactInfo: appointment.patient.patient.phone,
          avatarUrl: appointment.patient.patient.avatarUrl,
        };
        patientsData.push(patientSafeData);
        appointmentsData.push(appointmentSafeData);
      });

      res.json({ appointments: appointmentsData, patients: patientsData });
      await prisma.$disconnect();
      return;
    } catch (err: any) {
      const message = err.message;
      res.status(400).json({ error: message });
    }
  }
);

doctorRouter.patch(
  "/markAttendence/:appointmentId",
  userAuth,
  async (req: Request, res: Response) => {
    try {
      const prisma = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
      });

      const { appointmentId }: any = req.params;
      const { isAttended } = req.body;

      const newAppointment = await prisma.appointment.update({
        where: {
          appointmentId: appointmentId,
        },
        data: {
          visited: isAttended,
          status: "COMPLETED",
        },
      });

      res.json({ appointment: newAppointment });
      return;
    } catch (err: any) {
      const message = err.message;
      res.status(400).json({ error: message });
    }
  }
);
doctorRouter.patch(
  "/updateNotes/:appointmentId",
  userAuth,
  async (req: Request, res: Response) => {
    try {
      const prisma = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
      });

      const { appointmentId }: any = req.params;
      const { notes } = req.body;

      const newAppointment = await prisma.appointment.update({
        where: {
          appointmentId: appointmentId,
        },
        data: {
          notes: notes,
        },
      });

      res.json({ appointment: newAppointment });
      return;
    } catch (err: any) {
      const message = err.message;
      res.status(400).json({ error: message });
    }
  }
);

doctorRouter.patch(
  "/createPrescription/:appointmentId",
  userAuth,
  upload.single("prescriptionUrl"),
  async (req: Request, res: Response) => {
    try {
      const prisma = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
      });
      const { appointmentId } = req.params;
      const appointment = await prisma.appointment.findUnique({
        where: { appointmentId: appointmentId },
      });
      if (!appointment) {
        throw new Error("No such appointment exists!");
      }
      const { medications, tests, notes, prescriptionUrl, fileType } = req.body;
      if (!req.file) {
        await prisma.prescription.upsert({
          where: { appointmentId: appointment.appointmentId },
          update: {
            medications: medications,
            tests: tests,
            notes: notes,
            prescriptionUrl: prescriptionUrl,
            appointmentId: appointmentId,
            doctorId: appointment.doctorId,
            patientId: appointment.patientId,
          },
          create: {
            medications: medications,
            tests: tests,
            notes: notes,
            prescriptionUrl: prescriptionUrl,
            appointmentId: appointmentId,
            doctorId: appointment.doctorId,
            patientId: appointment.patientId,
          },
        });
        res.json({ message: "Prescription created." });
        await prisma.$disconnect();
        return;
      } else {
        const prevPres = await prisma.prescription.findUnique({where:{appointmentId:appointmentId}});

        if (prevPres && (prevPres.prescriptionUrl !== "/no-file.pdf" && prevPres.prescriptionUrl !== "/no-file.pdf")) {
          const urlOld = prevPres.prescriptionUrl;
          const public_id =
            "smartHealth/" + urlOld?.split("smartHealth/")[1].split(".")[0];
          cloudinary.uploader.destroy(
            public_id, // Replace with the extracted public_id
            { invalidate: true },
            (error: any, result: any) => {
              if (error) {
                console.error("Error deleting file:", error);
              } else {
                console.log("File deleted successfully:", result);
              }
            }
          );
        }
        const stream = cloudinary.uploader.upload_stream(
          { folder: "smartHealth/prescriptions" }, // Cloudinary folder name
          async (error: any, result: any) => {
            if (error) return res.status(500).json({ error: error.message });
            console.log(result.secure_url);
            // res.json({ imageUrl: result.secure_url });
            // if (!validatePatientProfileUpdateData(req)) {
            //   throw new Error("Update not allowed!");
            // }

            const prescription = await prisma.prescription.upsert({
              where: { appointmentId: appointment.appointmentId },
              update: {
                medications: medications,
                tests: tests,
                notes: notes,
                prescriptionUrl: result.secure_url,
                prescriptionFileType: fileType,
                appointmentId: appointmentId,
                doctorId: appointment.doctorId,
                patientId: appointment.patientId,
              },
              create: {
                medications: medications,
                tests: tests,
                notes: notes,
                prescriptionUrl: result.secure_url,
                prescriptionFileType: fileType,
                appointmentId: appointmentId,
                doctorId: appointment.doctorId,
                patientId: appointment.patientId,
              },
            });

          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
        await prisma.$disconnect();
        res.json({ message: "Prescription created." });
        return;
      }
    } catch (err: any) {
      const message = err.message;
      res.status(400).json({ error: message });
    }
  }
);

doctorRouter.get("/getAllDoctors", async (req: Request, res: Response) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });

    const doctors = await prisma.doctor.findMany({
      include: {
        doctor: true,
        availability: {
          include: {
            sunday: true,
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
          },
        },
      },
    });

    const doctorsData:any = [];
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    doctors.map((doctor) => {
      const day = new Date().getDay();
      const { availability }: any = doctor;
      let availableStatus = "";
      for (let i = 2; i < 7; i++) {
        if (availability && availability[days[(day + i) % 7]].length > 0) {
          availableStatus =
            "Next Available: " +
            days[(day + i) % 7][0].toUpperCase() +
            days[(day + i) % 7].slice(1);
          break;
        }
      }
      const doctorData = {
        id: doctor.doctorId,
        name: "Dr. " + doctor.doctor.firstName + " " + doctor.doctor.lastName,
        specialty: doctor.title,
        hospital: "Group_6 Hospitals",
        location: "Dhanbad",
        rating: doctor.rating,
        reviewCount: doctor.reviewCount,
        experience: doctor.experience,
        availability: availableStatus,
        avatar: doctor.doctor.avatarUrl,
        featured: false,
      };

      doctorsData.push(doctorData);
    });

    res.json({doctors:doctorsData});
    return;
  } catch (err: any) {
    const message = err.message;
    res.status(400).json({ error: message });
  }
});
