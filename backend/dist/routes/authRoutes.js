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
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const smart_clinic_1 = require("@dyuti_01/smart_clinic");
const client_1 = require("@prisma/client");
exports.authRouter = express_1.default.Router();
exports.authRouter.post("/signupCheck", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const { email, password, phone, userType } = req.body;
        if (!phone) {
            const user = yield prisma.user.findUnique({
                where: {
                    email: email,
                },
            });
            if (user) {
                res.status(409).json({ error: "User with this email already exists!" });
                return;
            }
            res.json({ message: "Go to go for signup." });
            return;
        }
        else {
            const user = yield prisma.user.findUnique({
                where: {
                    phone: phone,
                },
            });
            if (user) {
                res
                    .status(409)
                    .json({ error: "User with this phone number already exists!" });
                return;
            }
            res.json({ message: "Go to go for signup." });
            return;
        }
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
exports.authRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const body = req.body;
        const { success, error } = smart_clinic_1.signUpInput.safeParse(body);
        if (!success) {
            throw new Error(error.message);
        }
        const { firstName, lastName, email, password, userType, role, phone, authenticateMethod, } = req.body;
        if (!email || !password) {
            const already = yield prisma.user.findUnique({
                where: {
                    phone: phone,
                },
            });
            if (already) {
                yield prisma.$disconnect();
                res.status(409).json({ message: "Phone number already exists!" });
                return;
            }
            const user = yield prisma.user.create({
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    password: password,
                    email: email,
                    userType: userType,
                    phone: phone,
                },
            });
            if (userType === "Patient") {
                const { bloodType, allergies, chronicConditions } = req.body;
                yield prisma.patient.create({
                    data: {
                        patientId: user.userId,
                        bloodType: bloodType,
                        allergies: allergies,
                        chronicConditions: chronicConditions,
                    },
                });
            }
        }
        else {
            const already = yield prisma.user.findUnique({
                where: {
                    email: email,
                },
            });
            if (already) {
                res
                    .status(409)
                    .json({ message: "User with this email already exists!" });
                return;
            }
            const passwordHash = yield bcrypt_1.default.hash(password, 11);
            const user = yield prisma.user.create({
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    password: passwordHash,
                    email: email,
                    userType: userType,
                    phone: phone,
                },
            });
            if (userType === "Patient") {
                const { bloodType, allergies, chronicConditions } = req.body;
                yield prisma.patient.create({
                    data: {
                        patientId: user.userId,
                        bloodType: bloodType,
                        allergies: allergies,
                        chronicConditions: chronicConditions,
                    },
                });
            }
        }
        yield prisma.$disconnect();
        res.json({ status: "User created" });
        return;
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
exports.authRouter.post("/loginCheck", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const { email, password, phone, userType } = req.body;
        if (!phone) {
            const user = yield prisma.user.findUnique({
                where: {
                    email: email,
                    userType: userType,
                },
            });
            if (!user) {
                res
                    .status(404)
                    .json({ error: "Invalid credentials! No such user exists." });
                return;
            }
            res.json({ message: "Go to go for login." });
            return;
        }
        else {
            const user = yield prisma.user.findUnique({
                where: {
                    phone: phone,
                    userType: userType,
                },
            });
            if (!user) {
                res
                    .status(404)
                    .json({ error: "Invalid credentials! No such user exists." });
                return;
            }
            yield prisma.$disconnect();
            res.json({ message: "Go to go for login." });
            return;
        }
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
exports.authRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const { email, password, phone, userType } = req.body;
        if (!phone) {
            const user = yield prisma.user.findUnique({
                where: {
                    email: email,
                    userType: userType,
                },
            });
            if (!user) {
                res
                    .status(404)
                    .json({ error: "Invalid credentials! No such user exists." });
                return;
            }
            const actualHash = user.password;
            const isPasswordValid = yield bcrypt_1.default.compare(password, actualHash || "");
            if (isPasswordValid) {
                const secret = process.env.JWT_SECRET || "";
                const token = yield jsonwebtoken_1.default.sign({ userId: user.userId }, secret, {
                    expiresIn: "1h",
                });
                res.cookie("token", token, {
                    maxAge: 24 * 3600000,
                    path: "/",
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                res.json({
                    message: "Successfully logged in!",
                    userId: user.userId,
                    user: {
                        fullName: user.firstName + " " + user.lastName,
                        avatarUrl: user.avatarUrl,
                        role: user.userType,
                    },
                });
                return;
            }
            else {
                res.status(401).json({ message: "Invalid credentials!" });
                return;
            }
        }
        else {
            const user = yield prisma.user.findUnique({
                where: {
                    phone: phone,
                    userType: userType,
                },
            });
            if (!user) {
                res
                    .status(404)
                    .json({ error: "Invalid credentials! No such user exists." });
                return;
            }
            const secret = process.env.JWT_SECRET || "";
            const token = yield jsonwebtoken_1.default.sign({ userId: user.userId }, secret, {
                expiresIn: "1h",
            });
            res.cookie("token", token, {
                maxAge: 24 * 3600000,
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            res.json({
                message: "Successfully logged in!",
                userId: user.userId,
                user: {
                    fullName: user.firstName + " " + user.lastName,
                    avatarUrl: user.avatarUrl,
                    role: user.userType,
                },
            });
            yield prisma.$disconnect();
            return;
        }
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
exports.authRouter.post("/logout", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token", {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.json({ message: "Logout successfully!" });
        return;
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
exports.authRouter.patch("/forgotPassword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userEmail, oldPassword, newPassword } = req.body;
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const user = yield prisma.user.findUnique({
            where: {
                email: userEmail,
            },
        });
        if (!user) {
            throw new Error("Invalid credentials!");
        }
        const hash = user.password;
        const isCorrectPassword = yield bcrypt_1.default.compare(oldPassword, hash || "");
        if (!isCorrectPassword) {
            throw new Error("Invalid credentials!");
        }
        const newHash = yield bcrypt_1.default.hash(newPassword, 11);
        yield prisma.user.update({
            where: {
                userId: user.userId,
            },
            data: { password: newHash },
        });
        res.json({ message: "Your password is changed successfully!" });
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
exports.authRouter.get("/loggedCheck", auth_1.userAuth, (req, res) => {
    try {
        res.json({ userId: req.body.userId, user: req.body.user });
        return;
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
        return;
    }
});
