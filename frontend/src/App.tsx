import './App.css'
import { Landing } from './components/Landing'
import { BrowserRouter, redirect, Route, Routes, useNavigate } from 'react-router'
import { SignupForm } from './pages/Signup'
import { SigninForm } from './pages/Signin'
import DoctorProfile from './pages/DoctorProfilePersonal'
import PatientProfileV0 from './pages/patient-profile'
import PaymentSuccess from './pages/PaymentSuccess'
import PatientProfileTest from './pages/patient-profile-test'
import DoctorPublicProfile from './pages/DoctorProfilePatient'
import OTPVerificationSignup from './pages/OTPverificationSignup'
import AdminLogin from './pages/admin/adminLogin'
import signupContext from './utils/signupContext'
import signinContext from './utils/signinContext'
import { useEffect, useState } from 'react'
import OTPVerificationLogin from './pages/OTPverificationLogin'
import UserDataContext from './utils/dataContext'
import { ToastProvider } from './ui/patientProfile/toast'
import { Toaster } from './ui/patientProfile/toaster'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import LeaveManagement from './pages/admin/LeaveManagement'
import NotFound404 from './pages/404Notfound'
import PatientProfileTest1 from './pages/patient-profile-test1'
import DoctorProfileTest from './pages/doctor-profile-test'
import UserManagementTest from './pages/admin/UserManagementTest'
import OTPVerificationAttendence from './pages/OTPverificationAttendence'
import DoctorsListPage from './pages/DoctorsList'
import { AuthContext, AuthProvider, useAuth } from './utils/AuthContext'
import { BACKEND_URL } from './config'
import axios from 'axios'
import { toast } from './ui/patientProfile/use-toast'

interface dataParams {
  patientId?: string;
  doctorId?: string;
  otherStaffId?: string;
  appointmentId?:string;
  verificationId?:string;
  phone?:string
}
function App() {
  const [genData, setGenData] = useState<dataParams>({
    patientId:"",
  doctorId:"",
  otherStaffId:"",
  appointmentId:"",
  verificationId:"",
  phone:""
  })
  const [verifyDataSignup, setVerifyDataSignup] = useState({
    verificationId:"", 
    signupFormData:{  userType:"",
                      firstName: "",
                      lastName: "",
                      email: "",
                      password: "",
                      phone: "",
                      authenticateMethod:""
                    }
  })
  const [verifyDataLogin, setVerifyDataLogin] = useState({
    verificationId:"", 
    signinFormData:{  userType:"",
                      email: "",
                      password: "",
                      phone: "",
                      authenticateMethod:""
                    }
  })
  const auth = useAuth();

useEffect(()=>{
  axios.get(`${BACKEND_URL}/api/v1/auth/loggedCheck`, {withCredentials:true}).then((res:any)=>{
    console.log("Global:", res.data);
    auth.login(res.data.userId, JSON.stringify(res.data.user))
   }).catch((error)=>{
     auth.logout();
   })
 }, [])

  return (
    <>
    <UserDataContext.Provider value={{userData:genData, setUserData:setGenData}}>
    <signinContext.Provider value={{signinFormData:verifyDataLogin.signinFormData, verificationId:verifyDataLogin.verificationId, setVerifyDataLogin:setVerifyDataLogin}}>
    <signupContext.Provider value={{signupFormData:verifyDataSignup.signupFormData, verificationId:verifyDataSignup.verificationId, setVerifyDataSignup:setVerifyDataSignup}}>
    
      {/* <Appbar/> */}
    <Routes>
      <Route path='/' element={<Landing/>}/>
      <Route path='/signup' element={<SignupForm/>}/>
      <Route path='/signin' element={<SigninForm/>}/>
      {/* <Route path='/doctor_profile' element={<DoctorProfile/>}/> */}
      <Route path='/doctor_profile_public/:doctorId' element={<DoctorPublicProfile/>}/>
      <Route path='/doctor_profile_test' element={<DoctorProfile/>}/>
      <Route path='/doctor_profile' element={<DoctorProfileTest/>}/>
      <Route path='/patient_profile' element={<PatientProfileV0/>}/>
      <Route path='/patient_profile_test' element={<PatientProfileTest1/>}/>
      <Route path='/paymentSuccess' element={<PaymentSuccess/>}/>
      <Route path='/otp_verification_signup' element={<OTPVerificationSignup/>}/> 
      <Route path='/otp_verification_login' element={<OTPVerificationLogin/>}/> 
      <Route path='/otp_verification_attendence' element={<OTPVerificationAttendence/>}/> 
      <Route path='/admin/login' element={<AdminLogin/>}/>
      <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
      <Route path='/admin/login' element={<AdminLogin/>}/>
      <Route path='/admin/userManage' element={<UserManagement/>}/>
      <Route path='/admin/userManageTest' element={<UserManagementTest/>}/>
      <Route path='/admin/leaveManage' element={<LeaveManagement/>}/>
      <Route path='/doctorsList' element={<DoctorsListPage/>}/>
      
      <Route path='/*' element={<NotFound404/>}/>
      

    </Routes>
    </signupContext.Provider>
    </signinContext.Provider>
    </UserDataContext.Provider>
    <Toaster/>
    </>
  )
}

export default App
