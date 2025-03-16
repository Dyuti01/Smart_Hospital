"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostInput = exports.postInput = exports.signInInput = exports.signUpInput = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signUpInput = zod_1.default.object({
    email: zod_1.default.string().email({ message: "Invalid email" }).optional(),
    password: zod_1.default.string().min(6, { message: "Password should be atleast 6 characters long" }).optional(),
    phone: zod_1.default.string().length(13, { message: "Wrong Phone number" }).optional(),
    firstName: zod_1.default.string().min(3),
    lastName: zod_1.default.string().min(3),
});
exports.signInInput = zod_1.default.object({
    email: zod_1.default.string().email({ message: "Invalid email" }).optional(),
    password: zod_1.default.string().optional(),
    phone: zod_1.default.string().length(13, { message: "Wrong Phone number" }).optional(),
});
exports.postInput = zod_1.default.object({
    content: zod_1.default.string(),
    title: zod_1.default.string().max(500)
});
exports.updatePostInput = zod_1.default.object({
    content: zod_1.default.string().max(2000).optional(),
    title: zod_1.default.string().max(20).optional(),
    published: zod_1.default.boolean().optional()
});
