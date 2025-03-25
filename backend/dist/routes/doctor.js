"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const app = (0, express_1.default)();
exports.doctorRouter = express_1.default.Router();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = multer({ storage: multer.memoryStorage() });
exports.doctorRouter.get("/getDoctorData/:doctorId", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const doctorId = req.params.doctorId;
        const doctor = yield prisma.doctor.findUnique({
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
        const availability = yield prisma.availability.findUnique({
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
            doctorId: doctor === null || doctor === void 0 ? void 0 : doctor.doctorId,
            availability: availability,
            education: doctor.education,
            bookingFee: doctor.bookingFee,
            certifications: doctor.certifications,
            languages: doctor.languages,
            experience: doctor === null || doctor === void 0 ? void 0 : doctor.experience,
            patientAppointments: doctor === null || doctor === void 0 ? void 0 : doctor.patientAppointments,
            prescriptions: doctor === null || doctor === void 0 ? void 0 : doctor.prescriptions,
            titile: doctor === null || doctor === void 0 ? void 0 : doctor.title,
            testReports: doctor === null || doctor === void 0 ? void 0 : doctor.testReports,
            rating: doctor.rating,
            reviewCount: doctor.reviewCount,
            specializations: doctor.specializations,
            department: doctor.department,
            registrationNumber: doctor.registrationNumber,
            status: doctor.status,
            doctor: {
                city: doctor === null || doctor === void 0 ? void 0 : doctor.doctor.city,
                dateOfBirth: doctor === null || doctor === void 0 ? void 0 : doctor.doctor.dateOfBirth,
                email: doctor === null || doctor === void 0 ? void 0 : doctor.doctor.email,
                firstName: doctor === null || doctor === void 0 ? void 0 : doctor.doctor.firstName,
                lastName: doctor === null || doctor === void 0 ? void 0 : doctor.doctor.lastName,
                gender: doctor === null || doctor === void 0 ? void 0 : doctor.doctor.gender,
                pin: doctor === null || doctor === void 0 ? void 0 : doctor.doctor.pin,
                state: doctor === null || doctor === void 0 ? void 0 : doctor.doctor.state,
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
        yield prisma.$disconnect();
        return;
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
exports.doctorRouter.get("/getDoctorPublicData/:doctorId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const doctorId = req.params.doctorId;
        const doctor = yield prisma.doctor.findUnique({
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
        const availability = yield prisma.availability.findUnique({
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
            doctorId: doctor === null || doctor === void 0 ? void 0 : doctor.doctorId,
            availability: availability,
            education: doctor.education,
            bookingFee: doctor.bookingFee,
            certifications: doctor.certifications,
            languages: doctor.languages,
            experience: doctor === null || doctor === void 0 ? void 0 : doctor.experience,
            patientAppointments: doctor === null || doctor === void 0 ? void 0 : doctor.patientAppointments,
            prescriptions: doctor === null || doctor === void 0 ? void 0 : doctor.prescriptions,
            titile: doctor === null || doctor === void 0 ? void 0 : doctor.title,
            testReports: doctor === null || doctor === void 0 ? void 0 : doctor.testReports,
            rating: doctor.rating,
            reviewCount: doctor.reviewCount,
            specializations: doctor.specializations,
            department: doctor.department,
            registrationNumber: doctor.registrationNumber,
            status: doctor.status,
            doctor: {
                city: doctor === null || doctor === void 0 ? void 0 : doctor.doctor.city,
                dateOfBirth: doctor === null || doctor === void 0 ? void 0 : doctor.doctor.dateOfBirth,
                email: doctor === null || doctor === void 0 ? void 0 : doctor.doctor.email,
                firstName: doctor === null || doctor === void 0 ? void 0 : doctor.doctor.firstName,
                lastName: doctor === null || doctor === void 0 ? void 0 : doctor.doctor.lastName,
                gender: doctor === null || doctor === void 0 ? void 0 : doctor.doctor.gender,
                pin: doctor === null || doctor === void 0 ? void 0 : doctor.doctor.pin,
                state: doctor === null || doctor === void 0 ? void 0 : doctor.doctor.state,
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
        yield prisma.$disconnect();
        return;
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
exports.doctorRouter.patch("/editSchedule/:doctorId", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient();
        const doctorId = req.params.doctorId;
        const _a = req.body, { userId, user } = _a, scheduleData = __rest(_a, ["userId", "user"]);
        const availability = yield prisma.availability.findUnique({
            where: { doctorId: doctorId },
        });
        if (!availability) {
            console.log("Doctor's availability record not found.");
            res.status(404).json({ error: "Doctor's availability record not found." });
            return;
        }
        yield prisma.timeSlot.deleteMany({
            where: { availabilityId: availability.id },
        });
        const newTimeSlots = Object.entries(scheduleData).flatMap(([day, slots]) => {
            return slots.map((slot) => ({
                start: slot.start,
                end: slot.end,
                availabilityId: availability.id,
                [day + "AvailabilityId"]: availability.id,
            }));
        });
        if (newTimeSlots.length > 0) {
            yield prisma.timeSlot.createMany({
                data: newTimeSlots,
            });
        }
        yield prisma.$disconnect();
        res.json({ success: true, message: "Schedule updated successfully", scheduleData });
        return;
    }
    catch (err) {
        console.error("Error updating schedule:", err);
        res.status(400).json({ error: err.message });
        return;
    }
}));
exports.doctorRouter.patch("/edit/:doctorId", auth_1.userAuth, upload.single("avatarUrl"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorId = req.params.doctorId;
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const userOld = yield prisma.user.findUnique({
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
            const user = yield prisma.user.update({
                where: { userId: doctorId },
                data: userData,
            });
            const doctor = yield prisma.doctor.update({
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
            const availability = yield prisma.availability.findUnique({
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
            yield prisma.$disconnect();
            res.json({ doctorDetails: safeData });
            return;
        }
        else {
            if (userOld.avatarUrl !== "/avatar.svg") {
                const urlOld = userOld.avatarUrl;
                const public_id = "smartHealth/" + urlOld.split("smartHealth/")[1].split(".")[0];
                console.log(public_id);
                cloudinary.uploader.destroy(public_id, { invalidate: true }, (error, result) => {
                    if (error) {
                        console.error("Error deleting image:", error);
                    }
                    else {
                        console.log("Image deleted successfully:", result);
                    }
                });
            }
            const stream = cloudinary.uploader.upload_stream({ folder: "smartHealth" }, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
                if (error)
                    return res.status(500).json({ error: error.message });
                console.log(result.secure_url);
                const userData = {
                    firstName: dataObj.firstName,
                    lastName: dataObj.lastName,
                    email: dataObj.email,
                    phone: dataObj.phone,
                    avatarUrl: result.secure_url,
                };
                const user = yield prisma.user.update({
                    where: { userId: doctorId },
                    data: userData,
                });
                const doctor = yield prisma.doctor.update({
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
                const availability = yield prisma.availability.findUnique({
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
                yield prisma.$disconnect();
                res.json({ doctorDetails: safeData });
            }));
            streamifier.createReadStream(req.file.buffer).pipe(stream);
            return;
        }
    }
    catch (err) {
        res.status(400).json({ error: "Something went wrong, " + err });
    }
}));
exports.doctorRouter.get("/getAllData/:doctorId", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const doctorId = req.params.doctorId;
        const appointments = yield prisma.appointment.findMany({
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
        const appointmentsData = [];
        const patientsData = [];
        appointments.map((appointment) => {
            var _a, _b, _c, _d;
            const appointmentSafeData = {
                id: appointment.appointmentId,
                patientId: appointment.patientId,
                date: appointment.appointmentDateTime,
                patientPhone: appointment.patient.patient.phone,
                patientName: appointment.patient.patient.firstName +
                    " " +
                    appointment.patient.patient.lastName,
                patientPersonName: appointment.patientPersonName,
                patientPersonPhone: appointment.patientPersonPhone,
                patientPersonEmail: appointment.patientPersonEmail,
                department: appointment.doctor.department,
                status: (appointment.status[0] + appointment.status.slice(1)).toLowerCase(),
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
                prescription: {
                    medications: ((_a = appointment.prescription) === null || _a === void 0 ? void 0 : _a.medications) || [],
                    tests: ((_b = appointment.prescription) === null || _b === void 0 ? void 0 : _b.tests) || [],
                    notes: ((_c = appointment.prescription) === null || _c === void 0 ? void 0 : _c.notes) || "",
                    prescriptionUrl: (_d = appointment.prescription) === null || _d === void 0 ? void 0 : _d.prescriptionUrl,
                },
            };
            const patientSafeData = {
                id: appointment.patientId,
                name: appointment.patientPersonName,
                patientPhone: appointment.patientPersonPhone,
                patientEmail: appointment.patientPersonEmail,
                age: new Date().getFullYear() -
                    new Date(appointment.patient.patient.dateOfBirth || "").getFullYear(),
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
        yield prisma.$disconnect();
        return;
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
exports.doctorRouter.patch("/markAttendence/:appointmentId", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const { appointmentId } = req.params;
        const { isAttended } = req.body;
        const newAppointment = yield prisma.appointment.update({
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
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
exports.doctorRouter.patch("/updateNotes/:appointmentId", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const { appointmentId } = req.params;
        const { notes } = req.body;
        const newAppointment = yield prisma.appointment.update({
            where: {
                appointmentId: appointmentId,
            },
            data: {
                notes: notes,
            },
        });
        res.json({ appointment: newAppointment });
        return;
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
exports.doctorRouter.patch("/createPrescription/:appointmentId", auth_1.userAuth, upload.single("prescriptionUrl"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const { appointmentId } = req.params;
        const appointment = yield prisma.appointment.findUnique({
            where: { appointmentId: appointmentId },
        });
        if (!appointment) {
            throw new Error("No such appointment exists!");
        }
        const { medications, tests, notes, prescriptionUrl, fileType } = req.body;
        if (!req.file) {
            yield prisma.prescription.upsert({
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
            yield prisma.$disconnect();
            return;
        }
        else {
            const prevPres = yield prisma.prescription.findUnique({ where: { appointmentId: appointmentId } });
            if (prevPres && (prevPres.prescriptionUrl !== "/no-file.pdf" && prevPres.prescriptionUrl !== "/no-file.pdf")) {
                const urlOld = prevPres.prescriptionUrl;
                const public_id = "smartHealth/" + (urlOld === null || urlOld === void 0 ? void 0 : urlOld.split("smartHealth/")[1].split(".")[0]);
                cloudinary.uploader.destroy(public_id, { invalidate: true }, (error, result) => {
                    if (error) {
                        console.error("Error deleting file:", error);
                    }
                    else {
                        console.log("File deleted successfully:", result);
                    }
                });
            }
            const stream = cloudinary.uploader.upload_stream({ folder: "smartHealth/prescriptions" }, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
                if (error)
                    return res.status(500).json({ error: error.message });
                console.log(result.secure_url);
                const prescription = yield prisma.prescription.upsert({
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
            }));
            streamifier.createReadStream(req.file.buffer).pipe(stream);
            yield prisma.$disconnect();
            res.json({ message: "Prescription created." });
            return;
        }
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
exports.doctorRouter.get("/getAllDoctors", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const doctors = yield prisma.doctor.findMany({
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
        const doctorsData = [];
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
            const { availability } = doctor;
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
        res.json({ doctors: doctorsData });
        return;
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
