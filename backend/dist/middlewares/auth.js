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
exports.userAuth = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const cookies = req.cookies;
        const { token } = cookies;
        if (!token) {
            throw new Error("Invalid token!");
        }
        const decoded = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        const dataObj = JSON.parse(JSON.stringify(decoded));
        const { userId } = dataObj;
        const user = yield prisma.user.findUnique({ where: { userId: userId } });
        if (!user) {
            throw new Error("User not present!");
        }
        const userContext = { fullName: user.firstName + " " + user.lastName, avatarUrl: user.avatarUrl, role: user.userType };
        req.body = Object.assign({ userId, user: userContext }, req.body);
        yield prisma.$disconnect();
        next();
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: "Invalid credentials!", message });
    }
});
exports.userAuth = userAuth;
