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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
exports.doctorRouter = express_1.default.Router();
exports.doctorRouter.get("/getDetails/:doctorId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const { doctorId } = req.params.doctorId;
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
                title: true
            },
        });
        if (!doctor) {
            throw new Error("No such doctor exists!");
        }
        const safeData = {
            doctorId: doctor === null || doctor === void 0 ? void 0 : doctor.doctorId,
            availability: doctor === null || doctor === void 0 ? void 0 : doctor.availability,
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
        res.json({ doctorInfo: safeData });
        return;
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
