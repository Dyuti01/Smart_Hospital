import React, { useContext, useRef, useState } from "react";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { cn } from "../lib/utils";
import {
  IconBrandMeta,
  IconBrandX
} from "@tabler/icons-react";
import { AuroraBackground } from "../ui/AuroraBackground";
import CusLink from "../components/CusLink";
import { Stethoscope } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Button } from "../ui/patientProfile/button";
import firebase from "../firebase";
import signinContext from "../utils/signinContext";
import { toast } from "../ui/patientProfile/use-toast";
import { useAuth } from "../utils/AuthContext";

export function SigninForm() {
  const [signinFormData, setSigninFormData] = useState({
    userType: "",
    email: "",
    password: "",
    phone: "",
    authenticateMethod: "",
  })
  const [verificationId, setVerificationId] = useState("")
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isSentOtp, setIsSentOtp] = useState(false)
  const [isLogging, setIsLogging] = useState(false)
  const [isLoggedin, setIsLoggedin] = useState(false)

  const recaptchaRef = useRef(null)
  const verificationData = useContext(signinContext)
  const navigate = useNavigate()
  const auth = useAuth();
  const sendOtp = async () => {
    try {
      if (recaptchaRef.current) {
        //@ts-ignore
        recaptchaRef.current.innerHTML = '<div id="recaptcha-container"></div>'
      }
      const verifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", { size: "invisible" })

      firebase.auth().signInWithPhoneNumber(signinFormData.phone, verifier).then((confirmationRes) => {
        setVerificationId(confirmationRes.verificationId)
        // console.log(confirmationRes)
        console.log("OTP got sent")
        setIsSendingOtp(false)
        setIsSentOtp(true)
        verificationData.setVerifyDataLogin({ signinFormData: signinFormData, verificationId: confirmationRes.verificationId })
        navigate('/otp_verification_login')
        // Toast
      }).catch((error) => {
        console.log("Error sending OTP: " + error)
        toast({
          title: "Something wrong",
          description: `${error?.errors?error.errors[9]:""}`,
          variant: "destructive",
          duration: 5000
        })
        setIsSendingOtp(false)
      })

    }
    catch (err: any) {

      console.error(err)
      const message = err.response.data.error;
      toast({
        title: "Something wrong",
        description: `${message}`,
        variant: "destructive",
        duration: 5000
      })

      setIsSendingOtp(false);
    }

  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // api call to backend
    e.preventDefault();
    try {
      if (signinFormData.authenticateMethod === "email") {
        setIsLogging(true)
        const response = await axios.post(`${BACKEND_URL}/api/v1/auth/login`, signinFormData, { withCredentials: true })
        const { message, userId, user }: any = response.data;
        // localStorage.setItem("userId", userId)

        auth.login(userId, JSON.stringify(user));

        if (message !== "Invalid credentials") {
          // add necessary details to the request
        }

        setIsLogging(false);
        setIsLoggedin(true);
        if (signinFormData.userType === "Patient") {
          navigate('/patient_profile')
        }
        else if (signinFormData.userType === "Doctor") {
          navigate("/doctor_profile")
        }
        else {
          navigate("/staff_profile")
        }
      }
      else if (signinFormData.authenticateMethod === "phone") {
        setIsSendingOtp(true);

        const phoneSigninData = {
          userType: signinFormData.userType,
          phone: signinFormData.phone,
        }
        const response = await axios.post(`${BACKEND_URL}/api/v1/auth/loginCheck`, phoneSigninData, { withCredentials: true })
        sendOtp();
      }
    }
    catch (err: any) {
      const message = err.response.data.error;
      console.log(err)
      toast({
        title: "Something wrong",
        description: `${message}`,
        variant: "destructive",
        duration: 3000
      })
      setIsSendingOtp(false)
      setIsLogging(false)
    }
  };

  return (
    // <AuroraBackground>
    <div className="h-screen flex flex-col justify-center items-center z-[1000] bg-[url(/backcover.png)] bg-cover bg-center">
      <div className="max-w-md w-[400px] mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <CusLink to='/' className="flex gap-[5px] items-center justify-center text-white hover:cursor-pointer mb-[10px]" >
          <Stethoscope className="text-blue-700" />
          <span className="text-xl text-gray-900 poppins-regular dark:text-white">smartClinic</span>
        </CusLink>
        <h2 className="font-bold text-4xl text-neutral-800 dark:text-neutral-200">
          Welcome back
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Don't have an account? <CusLink to="/signup" className="underline hover:cursor-pointer">Create account</CusLink>
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="personType">Patient or Doctor or Others</Label>
            <select onChange={(e) => setSigninFormData({ ...signinFormData, userType: e.target.value })} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option defaultValue="Choose">Choose</option>
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
              <option value="Others">Other Staff</option>
            </select>
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="authenticateMethod">Signup with email or phone</Label>
            <select onChange={(e) => setSigninFormData({ ...signinFormData, authenticateMethod: e.target.value })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" defaultValue={"Choose"}>
              <option defaultValue="Choose">Choose</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
          </LabelInputContainer>
          {signinFormData.authenticateMethod === "email" && <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" placeholder="projectmayhem@fc.com" type="email" value={signinFormData.email} onChange={(e) => setSigninFormData({ ...signinFormData, email: e.target.value })} />
          </LabelInputContainer>}
          {signinFormData.authenticateMethod === "email" && <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="••••••••" type="password" value={signinFormData.password} onChange={(e) => setSigninFormData({ ...signinFormData, password: e.target.value })} />
          </LabelInputContainer>}
          {signinFormData.authenticateMethod === "phone" && <LabelInputContainer className="mb-4">
            <Label htmlFor="phoneNumber">Phone number</Label>
            <Input id="phoneNumber" placeholder="+91xxxxxxxxxx" type="tel" value={signinFormData.phone} onChange={(e) => setSigninFormData({ ...signinFormData, phone: e.target.value })} />
          </LabelInputContainer>}
          {/* <LabelInputContainer className="mb-8">
          <Label htmlFor="twitterpassword">Your twitter password</Label>
          <Input
            id="twitterpassword"
            placeholder="••••••••"
            type="twitterpassword"
          />
        </LabelInputContainer> */}

          {signinFormData.authenticateMethod === "email" && <Button
            className={cn(
              "w-full transition-all duration-200 text-white",
              isLoggedin
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700",
            )}
            disabled={isLogging || isLoggedin}
            type="submit"
          >
            {isLogging ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Logging...
              </div>
            ) : isLoggedin ? (
              "Continue"
            ) : (
              "Login"
            )}
          </Button>}

          {signinFormData.authenticateMethod === "phone" && <Button
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
        <div ref={recaptchaRef}>

        </div>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        {/* <div className="flex flex-col space-y-4"> */}
        {/* <div className="flex flex-wrap flex-row justify-center items-center gap-4">
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            {/* <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" /> */}
        {/* <img
              className="max-w-[20px]"
              src="https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/"
              alt="Google"
            />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Sign in with Google
            </span>
            <BottomGradient />
          </button>
        </div> */}
        {/* </form> */}
      </div>
    </div>

    /* </AuroraBackground> */


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
