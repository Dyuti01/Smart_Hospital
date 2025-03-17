import React, { useContext, useRef, useState } from "react";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { cn } from "../lib/utils";
import {
  IconBrandMeta,
  IconBrandX,
} from "@tabler/icons-react";
import { AuroraBackground } from "../ui/AuroraBackground";
import CusLink from "../components/CusLink";
import { Stethoscope } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";
import { BACKEND_URL } from "../config";
import OTPVerification from "../components/OTPInput";
import { RecaptchaVerifier, signInWithCredential, signInWithPhoneNumber, } from "firebase/auth"

import firebase from "../firebase";
import { error } from "console";
import { ToastProvider } from "../ui/patientProfile/toast";
import signupContext from "../utils/signupContext";
import { Button } from "../ui/patientProfile/button";
import { toast } from "../ui/patientProfile/use-toast";

interface SignupInputParams {
  userType: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  authenticateMethod: string;
  purpose:string;
}

export function SignupForm() {
  const [signupFormData, setSignupFormData] = useState<SignupInputParams>({
    userType: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    authenticateMethod: "",
    purpose: "signup"
  })
  // const [verificationCode, setVerificationCode ] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const recaptchaRef = useRef(null)
  const verificationData = useContext(signupContext)

  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isSentOtp, setIsSentOtp] = useState(false)
  const [isUserCreating, setIsUserCreating] = useState(false)
  const [isUserCreated, setIsUserCreated] = useState(false)

  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      if (recaptchaRef.current) {
        //@ts-ignore
        recaptchaRef.current.innerHTML = '<div id="recaptcha-container"></div>'
      }
      const verifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", { size: "invisible" })

      firebase.auth().signInWithPhoneNumber(signupFormData.phone, verifier).then((confirmationRes) => {
        setVerificationId(confirmationRes.verificationId)
        // console.log(confirmationRes)
        console.log("OTP got sent")
        setIsSendingOtp(false)
        setIsSentOtp(true)
        verificationData.setVerifyDataSignup({signupFormData:signupFormData, verificationId:confirmationRes.verificationId})
        navigate('/otp_verification_signup')
        // Toast
      }).catch((error) => {
        console.log("Error sending OTP: " + error)
      })

    }
    catch (err) {
      
      console.error(err)
    }

  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(signupFormData);
    // api call to backend
    try {
      if (signupFormData.authenticateMethod === "phone") {
        setIsSendingOtp(true);
        const signupPhoneData = {
          userType: signupFormData.userType,
          firstName: signupFormData.firstName,
          lastName: signupFormData.lastName,
          phone: signupFormData.phone
        }
        const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signupCheck`, signupPhoneData, { withCredentials: true })
        console.log(response.data)
        sendOtp()
      }
      else if (signupFormData.authenticateMethod === "email") {
        setIsUserCreating(true)
        const signupEmailData = {
          userType: signupFormData.userType,
          firstName: signupFormData.firstName,
          lastName: signupFormData.lastName,
          email: signupFormData.email,
          password: signupFormData.password,
        }
        const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, signupEmailData, { withCredentials: true })
        console.log(response.data)
        setIsUserCreating(false)
        setIsUserCreated(true)
        const { message }: any = response.data;
        if (message !== "Invalid credentials") {
          // add necessary details to the request
        }
        verificationData.setVerifyDataSignup({signupFormData:signupFormData, verificationId:verificationId})
        navigate('/signin')
      }


    }
    catch (err:any) {
      const message = err.response.data.error;
      console.log(err)
      toast({
        title: "Something wrong",
        description: `${message}`,
        variant: "destructive",
        duration:5000
      })
      setIsSendingOtp(false);
      setIsUserCreating(false);
    }


  };
  return (
    // <AuroraBackground>
      <div className="h-screen flex justify-center items-center z-[1000] bg-[url(/backcover.png)] bg-cover bg-center">

        <div className="md:w-[500px] rounded-none md:rounded-2xl px-4 pt-4 md:px-8 md:pt-8 shadow-input bg-white dark:bg-black">
          <CusLink to='/' className="flex gap-[5px] items-center justify-center text-white hover:cursor-pointer mb-[10px]" >
            <Stethoscope className="text-blue-700" />
            <span className="text-xl text-gray-900 poppins-regular dark:text-white">smartClinic</span>
          </CusLink>
          <h2 className="font-bold text-4xl text-neutral-800 dark:text-neutral-200">
            Welcome!!!
          </h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Already have an account? <CusLink to="/signin" className="underline hover:cursor-pointer">Login</CusLink>
          </p>

          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="personType">Patient or Doctor or Others</Label>
              <select onChange={(e) => setSignupFormData({ ...signupFormData, userType: e.target.value })} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" defaultValue={"Choose"}>
                <option defaultValue="Choose">Choose</option>
                <option value="Patient">Patient</option>
                {/* <option value="Doctor">Doctor</option>
                <option value="Others">Other Staff</option> */}
              </select>
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="authenticateMethod">Signup with email or phone</Label>
              <select onChange={(e) => setSignupFormData({...signupFormData, authenticateMethod:e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" defaultValue={"Choose"}>
                <option defaultValue="Choose">Choose</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </LabelInputContainer>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <LabelInputContainer>
                <Label htmlFor="firstname">First name</Label>
                <Input id="firstname" placeholder="Tyler" type="text" value={signupFormData.firstName} onChange={(e) => setSignupFormData({ ...signupFormData, firstName: e.target.value })} />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="lastname">Last name</Label>
                <Input id="lastname" placeholder="Durden" type="text" value={signupFormData.lastName} onChange={(e) => setSignupFormData({ ...signupFormData, lastName: e.target.value })} />
              </LabelInputContainer>
            </div>
            {signupFormData.authenticateMethod === "email" && <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" placeholder="projectmayhem@fc.com" type="email" value={signupFormData.email} onChange={(e) => setSignupFormData({ ...signupFormData, email: e.target.value })} />
            </LabelInputContainer>}
            {signupFormData.authenticateMethod === "email" && <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="••••••••" type="password" minLength={6} value={signupFormData.password} onChange={(e) => setSignupFormData({ ...signupFormData, password: e.target.value })} />
            </LabelInputContainer>}

            {signupFormData.authenticateMethod === "phone" && <LabelInputContainer className="mb-4">
              <Label htmlFor="phoneNumber">Phone number</Label>
              <Input id="phoneNumber" placeholder="+91xxxxxxxxxx" type="tel" value={signupFormData.phone} onChange={(e) => setSignupFormData({ ...signupFormData, phone: e.target.value })} />
            </LabelInputContainer>}
            {/* <LabelInputContainer className="mb-8">
          <Label htmlFor="twitterpassword">Your twitter password</Label>
          <Input
            id="twitterpassword"
            placeholder="••••••••"
            type="twitterpassword"
          />
        </LabelInputContainer> */}

            {/* {signupFormData.authenticateMethod === "email" && <button
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Sign up &rarr;
              <BottomGradient />
            </button>} */}
            {signupFormData.authenticateMethod === "email" && <Button
              className={cn(
                "w-full transition-all duration-200 text-white",
                isUserCreated
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700",
              )}
              disabled={isUserCreating || isUserCreated}
              type="submit"
            >
              {isUserCreating ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </div>
              ) : isUserCreated ? (
                "Continue"
              ) : (
                "Sign up"
              )}
            </Button>}
            {/* {signupFormData.authenticateMethod === "phone" && <button
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Send OTP &rarr;
              <BottomGradient />
            </button>} */}
            {signupFormData.authenticateMethod === "phone" && <Button
              className={cn(
                "w-full transition-all duration-200 text-white",
                isSentOtp
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700",
              )}
              disabled={isSendingOtp || isSentOtp}
              type="submit"
            >
              {isSendingOtp ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </div>
              ) : isSentOtp ? (
                "Continue"
              ) : (
                "Send OTP"
              )}
            </Button>}
          </form>

          {/* {authenticateMethod === "phone" && <OTPVerification verificationId={verificationId} signupFormData={signupFormData} />} */}

          <div ref={recaptchaRef}>

          </div>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mb-3 h-[1px] w-full" />

          {/* <div className="flex flex-col space-y-4"> */}
          {/* <div className="flex flex-wrap flex-row justify-center items-center gap-4 pb-3">
            <button
              className=" relative group/btn flex space-x-2 items-center justify-start px-4 text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              type="submit"
            >
              // {/* <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" /> */}
              {/* <img
                className="max-w-[20px]"
                src="https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/"
                alt="Google"
              />
              <span className="hidden  md:flex text-neutral-700 dark:text-neutral-300 text-sm">
                Signup with Google
              </span>
              <BottomGradient />
            </button>
          </div> */}
        </div>
      </div>

    // </AuroraBackground>


  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
