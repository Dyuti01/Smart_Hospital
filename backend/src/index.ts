import express, { urlencoded } from "express";
import { patientRouter } from "./routes/patient";
import { authRouter } from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import { paymentRouter } from "./routes/payment";
import { adminRouter } from "./routes/admin";
import { doctorRouter } from "./routes/doctor";
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express();

app.use(cors({
  origin:["https://smart-clinic2.vercel.app","http://localhost:5173","http://192.168.237.1:5173"],
  credentials:true,
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(urlencoded({extended:true}))
app.use(express.json({limit:"25mb"}));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/patient", patientRouter);
app.use("/api/v1/razorpay", paymentRouter);

app.listen(3000, ()=>{
  console.log("Server started...")
})