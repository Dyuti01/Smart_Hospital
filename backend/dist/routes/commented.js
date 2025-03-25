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
exports.unusedRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const razorpay_utils_1 = require("razorpay/dist/utils/razorpay-utils");
const patient_1 = require("./patient");
const auth_1 = require("../middlewares/auth");
const app = (0, express_1.default)();
exports.unusedRouter = express_1.default.Router();
exports.unusedRouter.post("/verifyPayment", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const body = req.body;
        let p = yield prisma.payment.findUnique({
            where: { paymentId: body.razorpay_order_id },
        });
        if (!p) {
            res.json({ success: false, message: "Order ID not found" });
            return;
        }
        let user = yield prisma.user.findUnique({
            where: { userId: p.customerId },
        });
        let pmt = (0, razorpay_utils_1.validatePaymentVerification)({
            order_id: body.razorpay_order_id,
            payment_id: body.razorpay_payment_id,
        }, body.razorpay_signature, process.env.PAYMENT_KEY_SECRET || "");
        if (pmt) {
            const update = yield prisma.payment.update({
                where: { paymentId: body.razorpay_order_id },
                data: { paymentId: body.razorpay_payment_id, done: true },
            });
            const cookies = req.cookies;
            const { appointmentDetails } = cookies;
            const appointment = yield (0, patient_1.makeAppointment)(appointmentDetails);
            res.redirect(`http://localhost:5173/paymentSuccess`);
            return;
        }
        else {
            res.json({ success: false, message: "Payment verification failed" });
            return;
        }
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
