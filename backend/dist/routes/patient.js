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
const validation_1 = require("../utils/validation");
const app = (0, express_1.default)();
exports.patientRouter = express_1.default.Router();
exports.patientRouter.get("/getPatientData/:patientId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const patientId = req.params.patientId;
        const patientData = yield prisma.patient.findUnique({ where: { patientId: patientId }, select: {
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
                patient: true
            } });
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
        res.json({ patientDetails: safeData });
        return;
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
exports.patientRouter.post("/isPaymentDone", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const { orderId } = req.body;
        const p = yield prisma.payment.findUnique({ where: { paymentId: orderId } });
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
                patientId: "f55f1ec0-5793-4f4c-8fd6-cb042dd22fc4", doctorId: "8587cc89-76ac-4e31-97aa-f1da23769d82",
                appointmentDateTime: appointmentDetails.date,
                timeSlot: appointmentDetails.timeSlot,
                reasonForAppointment: appointmentDetails.reason
            }
        });
        return appointment;
    }
    catch (err) {
        const message = err.message;
        throw new Error(message);
    }
});
exports.makeAppointment = makeAppointment;
exports.patientRouter.patch("/edit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.patientId;
        const dataObj = req.body.updateData;
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        if (!(0, validation_1.validatePatientProfileUpdateData)(req)) {
            throw new Error("Update not allowed!");
        }
        if (dataObj.skills.length > 10) {
            throw new Error("Can't add more than 10 skills...");
        }
        const user = yield prisma.user.update({ where: { userId: userId }, data: dataObj });
        const patient = yield prisma.patient.update({ where: { patientId: userId }, data: dataObj });
        res.json({ msg: "Updated successfully..." });
    }
    catch (err) {
        res.status(400).json({ msg: "Something went wrong, " + err });
    }
}));
