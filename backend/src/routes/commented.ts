import { Prisma, PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";
import express, { NextFunction, Request, Response } from "express";
import { validatePaymentVerification, validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import { makeAppointment } from "./patient";
import { userAuth } from "../middlewares/auth";

const app = express();

export const unusedRouter = express.Router();

unusedRouter.post("/verifyPayment", userAuth, async (req: Request, res: Response) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });
    const body = req.body
    let p = await prisma.payment.findUnique({
      where: { paymentId: body.razorpay_order_id },
    });

    if (!p) {
      res.json({ success: false, message: "Order ID not found" });
      return;
    }

    // Verify
    let user = await prisma.user.findUnique({
      where: { userId: p.customerId },
    });

    let pmt = validatePaymentVerification(
      {
        order_id: body.razorpay_order_id,
        payment_id: body.razorpay_payment_id,
      },
      body.razorpay_signature,
      process.env.PAYMENT_KEY_SECRET||""
    );

    if (pmt) {
      const update = await prisma.payment.update({
        where: { paymentId: body.razorpay_order_id },
        data: { paymentId:body.razorpay_payment_id, done: true },
      });

      // make the appointment
      const cookies = req.cookies;
      const { appointmentDetails } = cookies;
      // console.log("fromVerifyPayment: " + JSON.stringify(appointmentDetails))
      const appointment = await makeAppointment(appointmentDetails);

      res.redirect(
        // `http://localhost:5173/patinet_profile/${update.customerId}?paymentdone=true`
        `http://localhost:5173/paymentSuccess`
      );
      return;
    } else {
      res.json({ success: false, message: "Payment verification failed" });
      return;
    }
  } catch (err: any) {
    const message = err.message;
    res.status(400).json({ error: message });
  }
});