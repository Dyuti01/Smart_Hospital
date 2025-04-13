import { Prisma, PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";
import express, { NextFunction, Request, Response } from "express";
import {
  validatePaymentVerification,
  validateWebhookSignature,
} from "razorpay/dist/utils/razorpay-utils";
import { makeAppointment } from "./patient";
import { userAuth } from "../middlewares/auth";

const app = express();

export const paymentRouter = express.Router();

// export const initiate = async (amount:any, to_user:string, paymentform:any) => {
paymentRouter.post(
  "/initiatePayment",
  userAuth,
  async (req: Request, res: Response) => {
    try {
      const prisma = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
      });
      const { amount, customerId, appointmentDetails } = req.body;

      // res.cookie("appointmentDetails", appointmentDetails, { maxAge: 120000, path:"/", httpOnly:true, secure:true, sameSite:"none" });

      let customer = await prisma.user.findUnique({
        where: {
          userId: customerId,
        },
      });
      let instance = new Razorpay({
        key_id: process.env.PAYMENT_KEY_ID || "",
        key_secret: process.env.PAYMENT_KEY_SECRET,
      });

      let options = {
        amount: amount,
        currency: "INR",
      };

      let order = await instance.orders.create(options);

      // Creating a payemnt object
      await prisma.payment.create({
        data: {
          paymentId: order.id,
          amount: Number(amount) / 100,
          customerId: customer?.userId,
          done: false,
          description: "Appointment",
          toId: "hospital_100_DHN",
          appointmentDetails: appointmentDetails,
          status:"INITIATED"
        },
      });

      const safeCustomerInfo = {
        customerName: customer?.firstName + " " + customer?.lastName,
        phone: customer?.phone,
        email: customer?.email,
      };

      res.json({
        order: order,
        currenct: order.currency,
        amount: order.amount,
        customerInfo: safeCustomerInfo,
      });
      return;
    } catch (err: any) {
      const message = err.message;
      res.status(400).json({ error: message });
    }
  }
);

paymentRouter.post("/webhook", async (req: Request, res: Response) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });
    const secret = process.env.PAYMENT_WEBHOOK_SECRET || "";

    const webhookSignature = req.headers["x-razorpay-signature"] as string;
    const isValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      secret
    );

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
      // Step 1: Store the authorized payment in the database
      await prisma.payment.update({where:{paymentId},
        data: {
          status: "PENDING",
        },
      });

      res.status(200).json({ success: true, paymentStatus:"Pending", message: "Payment authorized and stored" });
      return;
    } 

    else if (event === "payment.captured") {
      const paymentId = payment.order_id;

      const existingPayment = await prisma.payment.findUnique({
        where: { paymentId },
      });

      if (!existingPayment) {
        res
          .status(404)
          .json({ success: false, message: "Payment record not found" });
        return;
      }

      // Mark payment as completed
      await prisma.payment.update({
        where: { paymentId },
        data: { paymentId: payment.id, done: true },
      });

      // Create Appointment
      const appointment = await makeAppointment(
        existingPayment.appointmentDetails
      );
      console.log("From webhook handler");

      res
        .status(200)
        .json({
          success: true,
          message: "Appointment created successfully",
          appointment,
        });

      return;
    } else {
      res.status(400).json({ success: false, message: "Unhandled event type" });
      return;
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
    return;
  }
});

paymentRouter.post("/isDonePayment", async (req: Request, res: Response) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });

    const p = await prisma.payment.findUnique({
      where: { paymentId: req.body.razorpay_payment_id, done:true },
    });

    if (!p) {
      res.json({ success: false, message: "Payment not found" });
      return;
    }

    res.redirect(`${process.env.FRONTEND_URL}/paymentSuccess`);
    return;
  } catch (err: any) {
    const message = err.message;
      res.status(400).json({ error: message });
      return;
  }
});
