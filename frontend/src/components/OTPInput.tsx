import React, { useState } from "react";
import { Input } from "../ui/patientProfile/input";
import { Button } from "../ui/patientProfile/button";
import { motion } from "framer-motion";
import firebase from "../firebase";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router";
import axios from "axios";

interface SignupInputParams{
  userType: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  authenticateMethod:string;
}

const OTPVerification= ({verificationId, signupFormData}:{verificationId:string, signupFormData:SignupInputParams}) => {
  // const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState<string>("");
  
  // const handleChange = (element: HTMLInputElement, index: number) => {
    // if (isNaN(Number(element.value))) return;
    // let newOtp = [...otp];
    // newOtp[index] = element.value;
    // setOtp(newOtp);
    
    // if (element.nextSibling instanceof HTMLInputElement && element.value) {
    //   element.nextSibling.focus();
    // }
  // };

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
  //   if (e.key === "Backspace") {
  //     let newOtp = [...otp];
  //     if (newOtp[index]) {
  //       newOtp[index] = "";
  //     } else if (index > 0 && e.currentTarget.previousSibling instanceof HTMLInputElement) {
  //       e.currentTarget.previousSibling.focus();
  //     }
  //     setOtp(newOtp);
  //   }
  // };
  const navigate = useNavigate()
  const handleVerify = () => {
    // const verificationCode = otp.join("").toString();
    // const verificationCode = otp;
    console.log(verificationCode)
    const credentials = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
    console.log(credentials)
    firebase.auth().signInWithCredential(credentials).then(async (userCrdential)=>{
      console.log("User logged in: " + userCrdential.user?.toJSON())
      const phoneSignupData = {
        userType: signupFormData.userType,
        firstName: signupFormData.firstName,
        lastName: signupFormData.lastName,
        phone: signupFormData.phone,
      }
      const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, phoneSignupData, { withCredentials: true })
      console.log(response.data)
      const { message }: any = response.data;
      if (message !== "Invalid credentials") {
        // add necessary details to the request
      }
      navigate('/')
    }).catch((error)=>{
      console.error("Error verify otp: " + error)
    })
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-2xl w-80">
      <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
      <div className="flex space-x-2 mb-4">
        {/* {otp.map((_, index) => (
          <Input
            key={index}
            type="text"
            maxLength={1}
            className="w-10 h-10 text-center text-xl border rounded-lg"
            value={otp[index]}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))} */}
      </div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {/* <motion.div whileTap={{ scale: 0.95 }}>
        <Button onClick={handleVerify} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md">
          Verify OTP
        </Button>
      </motion.div> */}
      <input type="text" value={verificationCode} className="border" onChange={(e)=>setVerificationCode(e.target.value)} />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
};

export default OTPVerification;
