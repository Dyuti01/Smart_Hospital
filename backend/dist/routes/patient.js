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
exports.makeAppointment = exports.patientRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const app = (0, express_1.default)();
exports.patientRouter = express_1.default.Router();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = multer({ storage: multer.memoryStorage() });
exports.patientRouter.get("/getPatientData/:patientId", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const patientId = req.params.patientId;
        const patientData = yield prisma.patient.findUnique({
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
        const _l = patientData.patient, { password } = _l, safeUserData = __rest(_l, ["password"]);
        const safeData = {
            allergies: (patientData === null || patientData === void 0 ? void 0 : patientData.allergies) || [],
            appointments: (patientData === null || patientData === void 0 ? void 0 : patientData.appointments) || [],
            bloodType: (patientData === null || patientData === void 0 ? void 0 : patientData.bloodType) || "Unknown",
            chronicConditions: (patientData === null || patientData === void 0 ? void 0 : patientData.chronicConditions) || [],
            emergencyContact: (patientData === null || patientData === void 0 ? void 0 : patientData.emergencyContact) || "N/A",
            patientId: (patientData === null || patientData === void 0 ? void 0 : patientData.patientId) || "",
            paymentHistoryIds: (patientData === null || patientData === void 0 ? void 0 : patientData.paymentHistoryIds) || [],
            prescriptions: (patientData === null || patientData === void 0 ? void 0 : patientData.prescriptions) || [],
            previousAppointmentIds: (patientData === null || patientData === void 0 ? void 0 : patientData.previousAppointmentIds) || [],
            testReports: (patientData === null || patientData === void 0 ? void 0 : patientData.testReports) || [],
            firstName: ((_a = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _a === void 0 ? void 0 : _a.firstName) || "N/A",
            lastName: ((_b = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _b === void 0 ? void 0 : _b.lastName) || "N/A",
            avatarUrl: ((_c = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _c === void 0 ? void 0 : _c.avatarUrl) || "/avatar.png",
            dob: ((_d = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _d === void 0 ? void 0 : _d.dateOfBirth) || "Unknown",
            email: ((_e = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _e === void 0 ? void 0 : _e.email) || "N/A",
            gender: ((_f = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _f === void 0 ? void 0 : _f.gender) || "Unknown",
            phone: ((_g = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _g === void 0 ? void 0 : _g.phone) || "N/A",
            city: ((_h = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _h === void 0 ? void 0 : _h.city) || "N/A",
            state: ((_j = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _j === void 0 ? void 0 : _j.state) || "N/A",
            pin: ((_k = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _k === void 0 ? void 0 : _k.pin) || "N/A",
        };
        res.json({ userDetails: safeData });
        yield prisma.$disconnect();
        return;
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
exports.patientRouter.patch("/edit/:patientId", auth_1.userAuth, upload.single("avatarUrl"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    try {
        const patientId = req.params.patientId;
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const userOld = yield prisma.user.findUnique({
            where: { userId: patientId },
        });
        if (!userOld) {
            throw new Error("No such user exists!");
        }
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
            const user = yield prisma.user.update({
                where: { userId: patientId },
                data: userData,
            });
            const patientData = yield prisma.patient.update({
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
                allergies: (patientData === null || patientData === void 0 ? void 0 : patientData.allergies) || [],
                appointments: (patientData === null || patientData === void 0 ? void 0 : patientData.appointments) || [],
                bloodType: (patientData === null || patientData === void 0 ? void 0 : patientData.bloodType) || "Unknown",
                chronicConditions: (patientData === null || patientData === void 0 ? void 0 : patientData.chronicConditions) || [],
                emergencyContact: (patientData === null || patientData === void 0 ? void 0 : patientData.emergencyContact) || "N/A",
                patientId: (patientData === null || patientData === void 0 ? void 0 : patientData.patientId) || "",
                paymentHistoryIds: (patientData === null || patientData === void 0 ? void 0 : patientData.paymentHistoryIds) || [],
                prescriptions: (patientData === null || patientData === void 0 ? void 0 : patientData.prescriptions) || [],
                previousAppointmentIds: (patientData === null || patientData === void 0 ? void 0 : patientData.previousAppointmentIds) || [],
                testReports: (patientData === null || patientData === void 0 ? void 0 : patientData.testReports) || [],
                firstName: ((_a = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _a === void 0 ? void 0 : _a.firstName) || "N/A",
                lastName: ((_b = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _b === void 0 ? void 0 : _b.lastName) || "N/A",
                avatarUrl: ((_c = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _c === void 0 ? void 0 : _c.avatarUrl) || "/avatar.png",
                dob: ((_d = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _d === void 0 ? void 0 : _d.dateOfBirth) || "Unknown",
                email: ((_e = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _e === void 0 ? void 0 : _e.email) || "N/A",
                gender: ((_f = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _f === void 0 ? void 0 : _f.gender) || "Unknown",
                phone: ((_g = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _g === void 0 ? void 0 : _g.phone) || "N/A",
                city: ((_h = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _h === void 0 ? void 0 : _h.city) || "N/A",
                state: ((_j = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _j === void 0 ? void 0 : _j.state) || "N/A",
                pin: ((_k = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _k === void 0 ? void 0 : _k.pin) || "N/A",
            };
            res.json({ patientDetails: safeData });
            yield prisma.$disconnect();
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
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                if (error)
                    return res.status(500).json({ error: error.message });
                console.log(result.secure_url);
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
                const user = yield prisma.user.update({
                    where: { userId: patientId },
                    data: userData,
                });
                const patientData = yield prisma.patient.update({
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
                    allergies: (patientData === null || patientData === void 0 ? void 0 : patientData.allergies) || [],
                    appointments: (patientData === null || patientData === void 0 ? void 0 : patientData.appointments) || [],
                    bloodType: (patientData === null || patientData === void 0 ? void 0 : patientData.bloodType) || "Unknown",
                    chronicConditions: (patientData === null || patientData === void 0 ? void 0 : patientData.chronicConditions) || [],
                    emergencyContact: (patientData === null || patientData === void 0 ? void 0 : patientData.emergencyContact) || "N/A",
                    patientId: (patientData === null || patientData === void 0 ? void 0 : patientData.patientId) || "",
                    paymentHistoryIds: (patientData === null || patientData === void 0 ? void 0 : patientData.paymentHistoryIds) || [],
                    prescriptions: (patientData === null || patientData === void 0 ? void 0 : patientData.prescriptions) || [],
                    previousAppointmentIds: (patientData === null || patientData === void 0 ? void 0 : patientData.previousAppointmentIds) || [],
                    testReports: (patientData === null || patientData === void 0 ? void 0 : patientData.testReports) || [],
                    firstName: ((_a = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _a === void 0 ? void 0 : _a.firstName) || "N/A",
                    lastName: ((_b = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _b === void 0 ? void 0 : _b.lastName) || "N/A",
                    avatarUrl: ((_c = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _c === void 0 ? void 0 : _c.avatarUrl) || "/avatar.png",
                    dob: ((_d = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _d === void 0 ? void 0 : _d.dateOfBirth) || "Unknown",
                    email: ((_e = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _e === void 0 ? void 0 : _e.email) || "N/A",
                    gender: ((_f = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _f === void 0 ? void 0 : _f.gender) || "Unknown",
                    phone: ((_g = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _g === void 0 ? void 0 : _g.phone) || "N/A",
                    city: ((_h = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _h === void 0 ? void 0 : _h.city) || "N/A",
                    state: ((_j = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _j === void 0 ? void 0 : _j.state) || "N/A",
                    pin: ((_k = patientData === null || patientData === void 0 ? void 0 : patientData.patient) === null || _k === void 0 ? void 0 : _k.pin) || "N/A",
                };
                streamifier.createReadStream(req.file.buffer).pipe(stream);
                res.json({ patientDetails: safeData });
            }));
            streamifier.createReadStream(req.file.buffer).pipe(stream);
            yield prisma.$disconnect();
            return;
        }
    }
    catch (err) {
        res.status(400).json({ error: "Something went wrong, " + err });
    }
}));
exports.patientRouter.post("/isPaymentDone", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const { orderId } = req.body;
        const p = yield prisma.payment.findUnique({
            where: { paymentId: orderId },
        });
        if (!p || !p.done) {
            res.status(402).json({ message: "No" });
            return;
        }
        res.json({ message: "PaymentDone" });
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
const makeAppointment = (appointmentDetails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const appointment = yield prisma.appointment.create({
            data: {
                patientId: appointmentDetails.patientId,
                doctorId: appointmentDetails.doctorId,
                patientPersonName: appointmentDetails.patientPersonName || "",
                patientPersonEmail: appointmentDetails.patientPersonEmail || "",
                patientPersonPhone: appointmentDetails.patientPersonPhone || "",
                appointmentDateTime: appointmentDetails.date,
                timeSlot: appointmentDetails.timeSlot,
                reasonForAppointment: appointmentDetails.patient.reason,
                status: "SCHEDULED",
            },
        });
        yield prisma.$disconnect();
        return appointment;
    }
    catch (err) {
        const message = err.message;
        throw new Error(message);
    }
});
exports.makeAppointment = makeAppointment;
exports.patientRouter.get("/getAllData/:patientId", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const patientId = req.params.patientId;
        const appointments = yield prisma.appointment.findMany({
            where: {
                patientId: patientId,
            },
            include: {
                doctor: { include: { doctor: true } },
                patient: { include: { patient: true } },
                vitals: true,
                prescription: true
            }
        });
        const payments = yield prisma.payment.findMany({ where: { customerId: patientId } });
        const appointmentsData = [];
        const prescriptions = [];
        const patientPayments = [];
        appointments.map((appointment) => {
            const appointmentSafeData = {
                id: appointment.appointmentId,
                date: appointment.appointmentDateTime,
                doctor: "Dr. " +
                    appointment.doctor.doctor.firstName +
                    " " +
                    appointment.doctor.doctor.lastName,
                department: appointment.doctor.department,
                patientPersonName: appointment.patientPersonName,
                patientPersonPhone: appointment.patientPersonPhone,
                patientPersonEmail: appointment.patientPersonEmail,
                status: (appointment.status[0] + appointment.status.slice(1)).toLowerCase(),
                notes: appointment.notes || "",
                location: appointment.location,
                duration: appointment.duration,
                reason: appointment.reasonForAppointment || "",
                followUp: appointment.followUp || "",
                vitals: appointment.vitals || {
                    bloodPressure: "",
                    heartRate: "",
                    temperature: "",
                    oxygenSaturation: "",
                },
            };
            appointmentsData.push(appointmentSafeData);
            const { prescription } = appointment;
            if (prescription) {
                const prescriptionData = {
                    id: prescription.prescriptionId,
                    date: prescription.dateTime,
                    appointmentId: prescription.appointmentId,
                    appointmentDate: appointment.appointmentDateTime,
                    appointmentReason: appointment.reasonForAppointment || "",
                    patientPersonName: appointment.patientPersonName,
                    doctor: "Dr. " + appointment.doctor.doctor.firstName + " " + appointment.doctor.doctor.lastName,
                    department: appointment.doctor.department,
                    medications: prescription.medications || [],
                    tests: prescription.tests || [],
                    notes: prescription.notes,
                    fileType: prescription.prescriptionFileType || "pdf",
                    fileUrl: prescription.prescriptionUrl || "/no-file.pdf",
                };
                prescriptions.push(prescriptionData);
            }
        });
        payments.map((payment) => {
            const paymentData = {
                id: payment.paymentId,
                date: payment.paymentDateTime,
                amount: Number(payment.amount),
                description: payment.description,
                status: payment.done ? "completed" : "cancelled",
            };
            patientPayments.push(paymentData);
        });
        res.json({ appointments: appointmentsData, prescriptions: prescriptions, payments: patientPayments });
        yield prisma.$disconnect();
        return;
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
