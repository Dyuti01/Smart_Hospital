"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const patient_1 = require("./routes/patient");
const authRoutes_1 = require("./routes/authRoutes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const payment_1 = require("./routes/payment");
const admin_1 = require("./routes/admin");
const doctor_1 = require("./routes/doctor");
const fs = require("fs");
const path = require("path");
const https = require("https");
const cors = require("cors");
const bodyParser = require("body-parser");
const ip = "192.168.237.1";
const port = 7778;
const options = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
};
const app = (0, express_1.default)();
app.use(cors({
    origin: ["https://smart-clinic2.vercel.app", "http://localhost:5173", "http://192.168.237.1:5173"],
    credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((0, express_1.urlencoded)({ extended: true }));
app.use(express_1.default.json({ limit: "25mb" }));
app.use((0, cookie_parser_1.default)());
app.use('/api/v1/auth', authRoutes_1.authRouter);
app.use("/api/v1/admin", admin_1.adminRouter);
app.use("/api/v1/doctor", doctor_1.doctorRouter);
app.use("/api/v1/patient", patient_1.patientRouter);
app.use("/api/v1/razorpay", payment_1.paymentRouter);
https.createServer(options, app).listen(port, ip, () => {
    console.log(`HTTPS Server running on https://${ip}:${port}`);
});
