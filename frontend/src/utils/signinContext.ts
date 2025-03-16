import { createContext, Dispatch, SetStateAction } from "react";

interface SigninInputParams {
  userType: string;
  email: string;
  password: string;
  phone: string;
  authenticateMethod: string;
}

interface SigninContextType {
  verificationId: string;
  signinFormData: SigninInputParams;
  setVerifyDataLogin: Dispatch<SetStateAction<{ verificationId: string; signinFormData: SigninInputParams }>>;
}

// Default state values
const defaultSigninData: SigninContextType = {
  verificationId: "",
  signinFormData: {
    userType: "",
    email: "",
    password: "",
    phone: "",
    authenticateMethod: "",
  },
  setVerifyDataLogin: () => {}, // Placeholder function
};

const signinContext = createContext<SigninContextType>(defaultSigninData);

export default signinContext;
