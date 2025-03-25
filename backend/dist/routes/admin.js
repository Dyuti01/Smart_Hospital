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
exports.adminRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../middlewares/auth");
const app = (0, express_1.default)();
exports.adminRouter = express_1.default.Router();
exports.adminRouter.post("/addNewUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const { firstName, lastName, email, password, userType, role, phone, department } = req.body;
        const already = yield prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (already) {
            res.status(409).json({ message: "User with this email already exists!" });
            return;
        }
        const passwordHash = yield bcrypt_1.default.hash(password, 11);
        const user = yield prisma.user.create({
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
            const { title, availability, experience, about, bookingFee, rating, reviewCount, education, certifications, specializations, languages, registrationNumber, department } = req.body;
            const doctor = yield prisma.doctor.create({
                data: {
                    registrationNumber: registrationNumber,
                    department: department,
                    availability: { connectOrCreate: {
                            where: { doctorId: user.userId },
                            create: {
                                monday: {
                                    create: availability.monday
                                },
                                tuesday: {
                                    create: availability.tuesday
                                },
                                wednesday: {
                                    create: availability.wednesday
                                },
                                thursday: {
                                    create: availability.thursday
                                },
                                friday: {
                                    create: availability.friday
                                },
                                saturday: {
                                    create: availability.saturday
                                },
                                sunday: {
                                    create: availability.sunday
                                }
                            }
                        }
                    },
                    experience: experience || "",
                    doctorId: user.userId,
                    about: about || "",
                    bookingFee: bookingFee || 150,
                    rating: rating || 0,
                    reviewCount: reviewCount || 0,
                    title: department.slice(0, department.length - 1) + "ist",
                    certifications: certifications || [],
                    education: { createMany: { data: education } },
                    languages: languages || [],
                    specializations: specializations || []
                },
            });
            res.json({ userDetails: doctor });
        }
        else {
            const { salary, } = req.body;
            const staff = yield prisma.staff.create({ data: {
                    department: department,
                    salary: salary || 10000,
                    staffId: user.userId
                } });
            res.json({ userDetails: staff });
        }
        yield prisma.$disconnect();
        return;
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
exports.adminRouter.get("/getAllStaffData", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        let allDoctors = yield prisma.doctor.findMany({ include: { doctor: true, availability: true, education: true } });
        const allOtherStaff = yield prisma.staff.findMany({ include: { staff: true } });
        const allStaffReqData = [];
        allDoctors.map((doctor) => {
            const requiredData = {
                id: doctor.doctorId,
                firstName: doctor.doctor.firstName,
                lastName: doctor.doctor.lastName,
                email: doctor.doctor.email,
                role: doctor.doctor.userType,
                department: doctor.department,
                status: doctor.status,
                registrationNumber: doctor.registrationNumber,
                avatar: doctor.doctor.avatarUrl,
                phone: doctor.doctor.phone,
            };
            allStaffReqData.push(requiredData);
        });
        allOtherStaff.map((staff) => {
            const requiredData = {
                id: staff.staffId,
                firstName: staff.staff.firstName,
                lastName: staff.staff.lastName,
                email: staff.staff.email,
                role: staff.staff.userType,
                department: staff.department,
                status: staff.status,
                avatar: staff.staff.avatarUrl,
                phone: staff.staff.phone
            };
            allStaffReqData.push(requiredData);
        });
        res.json({ allStaff: allStaffReqData });
        yield prisma.$disconnect();
        return;
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
