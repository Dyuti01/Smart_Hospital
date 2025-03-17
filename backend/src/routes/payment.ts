import { Prisma, PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";
import express, { NextFunction, Request, Response } from "express";
import { validatePaymentVerification, } from "razorpay/dist/utils/razorpay-utils";
import { makeAppointment } from "./patient";
import { userAuth } from "../middlewares/auth";

const app = express();

export const paymentRouter = express.Router();

// export const initiate = async (amount:any, to_user:string, paymentform:any) => {
paymentRouter.post("/initiatePayment", userAuth, async (req: Request, res: Response) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });
    console.log(req.body)
    const { amount, customerId, appointmentDetails } = req.body;
    console.log("FronInitiatePayment: "+appointmentDetails)
    
    res.cookie("appointmentDetails", appointmentDetails, { maxAge: 120000, path:"/", httpOnly:true, secure:true, sameSite:"none" });


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
    console.log(customer)

    // Creating a payemnt object
    await prisma.payment.create({
      data: {
        paymentId: order.id,
        amount: Number(amount) / 100,
        customerId: customer?.userId,
        done: false,
        description: "Appointment",
        toId:"hospital_100_DHN"
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
});

// export const POST = async (req:Request)=>{
paymentRouter.post("/verifyPayment", userAuth, async (req: Request, res: Response) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });
    const body = req.body
    console.log(req.body)

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
    console.log("pmt: "+pmt);
    if (pmt) {
      const update = await prisma.payment.update({
        where: { paymentId: body.razorpay_order_id },
        data: { paymentId:body.razorpay_payment_id, done: true },
      });

      // make the appointment
      const cookies = req.cookies;
      const { appointmentDetails } = cookies;
      console.log("fromVerifyPayment: " + JSON.stringify(appointmentDetails))
      const appointment = await makeAppointment(appointmentDetails);
      console.log(appointment)
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
// export const verifyPayment = async (req: Request, res: Response, next:NextFunction) => {
//   try {
//     const prisma = new PrismaClient({
//       datasourceUrl: process.env.DATABASE_URL,
//     });
//     const body = req.body
//     console.log(req.body)

//     let p = await prisma.payment.findUnique({
//       where: { paymentId: body.razorpay_order_id },
//     });

//     if (!p) {
//       res.json({ success: false, message: "Order ID not found" });
//       return;
//     }

//     // Verify
//     let user = await prisma.user.findUnique({
//       where: { userId: p.customerId },
//     });

//     let pmt = validatePaymentVerification(
//       {
//         order_id: body.razorpay_order_id,
//         payment_id: body.razorpay_payment_id,
//       },
//       body.razorpay_signature,
//       process.env.PAYMENT_KEY_SECRET||""
//     );
//     console.log("pmt: "+pmt);
//     if (pmt) {
//       const update = await prisma.payment.update({
//         where: { paymentId: body.razorpay_order_id },
//         data: { done: true },
//       });

//       // make the appointment

//       next()
//     } else {
//       res.json({ success: false, message: "Payment verification failed" });
//       return;
//     }
//   } catch (err: any) {
//     const message = err.message;
//     res.status(400).json({ error: message });
//   }
// };

export const fetchuser = async (email: string) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });
  let u = await prisma.user.findUnique({ where: { email: email } });

  return JSON.parse(JSON.stringify(u));
};
export const fetchuserByUsername = async (userId: string) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });
  let u = await prisma.user.findUnique({ where: { userId: userId } });

  return JSON.parse(JSON.stringify(u));
};

// export const saveUser = async () => {
//     const {
//         getUser,
//         isAuthenticated
//     } = getKindeServerSession();

//     await connectDB();
//     let user = await getUser()
//     let u = await User.find({ email: user.email })
//     if (u.length == 0) {
//         await User.create({
//             name: user.given_name + ' ' + user.family_name,
//             email: user.email,
//             username: user.email.split('@')[0],
//             profilePic: user.picture,
//             coverPic: 'https://res.cloudinary.com/dkfd0a8gd/image/upload/v1718430625/BingWallpaper_52_k9hy0x.jpg'
//         })
//     }
// }

// export const fetchAllUsers = async () => {
//     await connectDB()
//     let jsonCreators = []
//     let Creators = (await User.find()).map((creator) => {
//         jsonCreators.push(JSON.parse(JSON.stringify(creator)))
//     })
//     return jsonCreators;
// }
export const fetchpayments = async (userId: string) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });
  const user = await prisma.patient.findUnique({
    where: { patientId: userId },
    select: { patientId: true, appointments: true, paymentHistoryIds: true },
  });
  let payments = user?.paymentHistoryIds;

  return payments;
};

// export const updateProfile = async (data, oldUsername) => {
//     await connectDB()
//     // let newData = Object.fromEntries(data)
//     let newData = data
//     if (oldUsername != newData.username) {
//         let u = await User.findOne({ username: newData.username })
//         if (u) {
//             return { error: "Username already exists!" }
//         }
//         await User.updateOne({ email: newData.email }, newData)
//         await Payment.updateMany({ to_user: oldUsername }, { to_user: newData.username })
//         redirect(`/dashboard/${newData.username}`)
//     }
//     else {
//         await User.updateOne({ email: newData.email }, newData)
//     }
// }
