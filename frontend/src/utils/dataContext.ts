import { createContext, Dispatch, SetStateAction } from "react";

interface dataParams {
  patientId?: string;
  doctorId?: string;
  otherStaffId?: string;
  appointmentId?:string;
  verificationId?:string;
  phone?:string
}

interface UserDataContextType {
  userData: dataParams;
  setUserData: Dispatch<
    SetStateAction<{
      patientId?: string;
      doctorId?: string;
      otherStaffId?: string;
      appointmentId?:string;
      verificationId?:string;
      phone?:string;
    }>
  >;
}

// Default state values
const defaultUserData: UserDataContextType = {
  userData: {
    patientId: "",
    doctorId: "",
    otherStaffId: "",
    appointmentId: "",
    verificationId: "",
    phone:""
  },
  setUserData: () => {}, // Placeholder function
};

const UserDataContext = createContext<UserDataContextType>(defaultUserData);

export default UserDataContext;
