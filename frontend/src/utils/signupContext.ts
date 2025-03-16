import { createContext, Dispatch, SetStateAction } from "react";

interface SignupInputParams {
  userType: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  authenticateMethod: string;
}

interface SignupContextType {
  verificationId: string;
  signupFormData: SignupInputParams;
  setVerifyDataSignup: Dispatch<SetStateAction<{ verificationId: string; signupFormData: SignupInputParams }>>;
}

// Default state values
const defaultSignupData: SignupContextType = {
  verificationId: "",
  signupFormData: {
    userType: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    authenticateMethod: "",
  },
  setVerifyDataSignup: () => {}, // Placeholder function
};

const signupContext = createContext<SignupContextType>(defaultSignupData);

export default signupContext;
