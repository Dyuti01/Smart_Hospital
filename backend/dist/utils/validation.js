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
exports.validatePatientProfileUpdateData = exports.validateSignUpData = void 0;
const validator_1 = __importDefault(require("validator"));
const validateSignUpData = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, phone } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name is not valid!");
    }
    else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error("firstName should be 4 to 50 characters! ");
    }
    if (!email && !phone) {
        throw new Error("Atleast one of email or phone is needed!");
    }
    if (phone && !validator_1.default.isMobilePhone(phone, 'en-IN')) {
        throw new Error("Mobile number is not valid!");
    }
    if (email && !validator_1.default.isEmail(email)) {
        throw new Error("Email is not valid!");
    }
    if (password && !validator_1.default.isStrongPassword(password)) {
        throw new Error("Enter strong password!");
    }
});
exports.validateSignUpData = validateSignUpData;
const validatePatientProfileUpdateData = (req) => {
    const data = req.body.updateData;
    const allowedFields = ["firstName", "lastName", "gender", "bloodType", "avatarUrl", "allergies", "chronicConditions", "address"];
    const isUpdateAllowed = Object.keys(data).every((k) => allowedFields.includes(k));
    return isUpdateAllowed;
};
exports.validatePatientProfileUpdateData = validatePatientProfileUpdateData;
