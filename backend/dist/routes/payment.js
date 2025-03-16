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
exports.fetchpayments = exports.fetchuserByUsername = exports.fetchuser = exports.paymentRouter = void 0;
const client_1 = require("@prisma/client");
const razorpay_1 = __importDefault(require("razorpay"));
const express_1 = __importDefault(require("express"));
const razorpay_utils_1 = require("razorpay/dist/utils/razorpay-utils");
const patient_1 = require("./patient");
const app = (0, express_1.default)();
exports.paymentRouter = express_1.default.Router();
exports.paymentRouter.post("/initiatePayment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        console.log(req.body);
        const { amount, customerId, appointmentDetails } = req.body;
        res.cookie("appointmentDetails", appointmentDetails, { maxAge: 120000, path: "/", httpOnly: true, secure: true });
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
        console.log(customer);
        yield prisma.payment.create({
            data: {
                paymentId: order.id,
                amount: Number(amount) / 100,
                customerId: customer === null || customer === void 0 ? void 0 : customer.userId,
                done: false,
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
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
}));
exports.paymentRouter.post("/verifyPayment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        const body = req.body;
        console.log(req.body);
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
        console.log("pmt: " + pmt);
        if (pmt) {
            const update = yield prisma.payment.update({
                where: { paymentId: body.razorpay_order_id },
                data: { done: true },
            });
            const cookies = req.cookies;
            const { appointmentDetails } = cookies;
            console.log(appointmentDetails);
            const appointment = (0, patient_1.makeAppointment)(appointmentDetails);
            console.log(appointment);
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
const fetchuser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
    });
    let u = yield prisma.user.findUnique({ where: { email: email } });
    return JSON.parse(JSON.stringify(u));
});
exports.fetchuser = fetchuser;
const fetchuserByUsername = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
    });
    let u = yield prisma.user.findUnique({ where: { userId: userId } });
    return JSON.parse(JSON.stringify(u));
});
exports.fetchuserByUsername = fetchuserByUsername;
const fetchpayments = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
    });
    const user = yield prisma.patient.findUnique({
        where: { patientId: userId },
        select: { patientId: true, appointments: true, paymentHistoryIds: true },
    });
    let payments = user === null || user === void 0 ? void 0 : user.paymentHistoryIds;
    return payments;
});
exports.fetchpayments = fetchpayments;
