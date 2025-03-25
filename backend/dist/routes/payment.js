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
exports.paymentRouter = void 0;
const client_1 = require("@prisma/client");
const razorpay_1 = __importDefault(require("razorpay"));
const express_1 = __importDefault(require("express"));
const razorpay_utils_1 = require("razorpay/dist/utils/razorpay-utils");
const patient_1 = require("./patient");
const auth_1 = require("../middlewares/auth");
const app = (0, express_1.default)();
exports.paymentRouter = express_1.default.Router();
exports.paymentRouter.post("/initiatePayment", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const { amount, customerId, appointmentDetails } = req.body;
        let customer = yield prisma.user.findUnique({
            where: {
                userId: customerId,
            },
        });
        let instance = new razorpay_1.default({
            key_id: process.env.PAYMENT_KEY_ID || "",
            key_secret: process.env.PAYMENT_KEY_SECRET,
        });
        let options = {
            amount: amount,
            currency: "INR",
        };
        let order = yield instance.orders.create(options);
        yield prisma.payment.create({
            data: {
                paymentId: order.id,
                amount: Number(amount) / 100,
                customerId: customer === null || customer === void 0 ? void 0 : customer.userId,
                done: false,
                description: "Appointment",
                toId: "hospital_100_DHN",
                appointmentDetails: appointmentDetails,
                status: "INITIATED"
            },
        });
        const safeCustomerInfo = {
            customerName: (customer === null || customer === void 0 ? void 0 : customer.firstName) + " " + (customer === null || customer === void 0 ? void 0 : customer.lastName),
            phone: customer === null || customer === void 0 ? void 0 : customer.phone,
            email: customer === null || customer === void 0 ? void 0 : customer.email,
        };
        res.json({
            order: order,
            currenct: order.currency,
            amount: order.amount,
            customerInfo: safeCustomerInfo,
        });
        return;
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
exports.paymentRouter.post("/webhook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const secret = process.env.PAYMENT_WEBHOOK_SECRET || "";
        const webhookSignature = req.headers["x-razorpay-signature"];
        const isValid = (0, razorpay_utils_1.validateWebhookSignature)(JSON.stringify(req.body), webhookSignature, secret);
        if (!isValid) {
            res
                .status(400)
                .json({ success: false, message: "Invalid webhook signature" });
            return;
        }
        const event = req.body.event;
        const payment = req.body.payload.payment.entity;
        const paymentId = payment.order_id;
        if (event === "payment.authorized") {
            yield prisma.payment.update({ where: { paymentId },
                data: {
                    status: "PENDING",
                },
            });
            res.status(200).json({ success: true, paymentStatus: "Pending", message: "Payment authorized and stored" });
            return;
        }
        if (event === "payment.captured") {
            const paymentId = payment.order_id;
            let existingPayment = yield prisma.payment.findUnique({
                where: { paymentId },
            });
            if (!existingPayment) {
                res
                    .status(404)
                    .json({ success: false, message: "Payment record not found" });
                return;
            }
            yield prisma.payment.update({
                where: { paymentId },
                data: { paymentId: payment.id, done: true },
            });
            const appointment = yield (0, patient_1.makeAppointment)(existingPayment.appointmentDetails);
            console.log("From webhook handler");
            res
                .status(200)
                .json({
                success: true,
                message: "Appointment created successfully",
                appointment,
            });
            return;
        }
        else {
            res.status(400).json({ success: false, message: "Unhandled event type" });
            return;
        }
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
        return;
    }
}));
exports.paymentRouter.post("/isDonePayment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const p = yield prisma.payment.findUnique({
            where: { paymentId: req.body.razorpay_payment_id, done: true },
        });
        if (!p) {
            res.json({ success: false, message: "Payment not found" });
            return;
        }
        res.redirect(`${process.env.FRONTEND_URL}/paymentSuccess`);
        return;
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
        return;
    }
}));
