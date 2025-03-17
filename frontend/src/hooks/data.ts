import axios from "axios";
import { BACKEND_URL } from "../config";
import { useEffect, useState } from "react";
import { toast } from "../ui/patientProfile/use-toast";
import { useNavigate } from "react-router";

export const UseGetUserData = (
  setUser: any,
  setIsLoading: any,
  role: string,
  setEditFormData?: any,
  setScheduleData?: any,
  userId?: string
) => {
  const id = localStorage.getItem("userId");
  const [userData, setUserData] = useState<any>({});
  const navigate = useNavigate();
  try {
    useEffect(() => {
      axios
        .get(
          `${BACKEND_URL}/api/v1/${role.split("Public")[0].toLowerCase()}/get${
            role.split("Public")[0]
          }Data/${role === "DoctorPublic" ? userId : id}`, {withCredentials:true}
        )
        .then((res: any) => {
          setUserData(res.data.userDetails);
          console.log(res.data.userDetails);
          console.log("safeData: ", res.data.userDetails);
          setUser(res.data.userDetails);
          if (setEditFormData) {
            setEditFormData(res.data.userDetails);
          }
          if (setScheduleData) {
            setScheduleData(res.data.userDetails.availability);
          }
          setIsLoading(false);
          console.log(res.data.userDetails.availability);
        })
        .catch((err: any) =>{
          toast({
            title: "Something wrong",
            description: `${err.response.data.error}`,
            variant: "destructive",
            duration: 5000,
          });
          navigate("/signin")
        });
    }, []);
    return userData;
  } catch (err: any) {
    toast({
      title: "Something wrong",
      description: `${err.response.data.error}`,
      variant: "destructive",
      duration: 5000,
    });
    navigate("/signin")
  }
};

export const UseGetAllStaffData = (
  setIsLoading: any,
  setUsers: any,
  users: any
) => {
  const [allStaffData, setAllStaffData] = useState<any>([]);
  const navigate = useNavigate();
  try {
    useEffect(() => {
      axios
        .get(`${BACKEND_URL}/api/v1/admin/getAllStaffData`, {withCredentials:true})
        .then((res: any) => {
          const newStaff = res.data.allStaff;

          const uniqueUsers = Array.from(
            new Map(
              [...users, ...newStaff].map((user) => [user.id, user])
            ).values()
          );

          setAllStaffData(uniqueUsers); // Update local state
          setUsers(uniqueUsers); // Ensure no duplicates in the global users array
          console.log("safeData: ", uniqueUsers);
          setIsLoading(false);
        }).catch((err: any) =>{
          console.log(err)
          toast({
            title: "Something wrong",
            description: `${err.response.data.error}`,
            variant: "destructive",
            duration: 5000,
          });
          navigate("/signin")
        });
    }, []);

    return allStaffData;
  } catch (err: any) {
    toast({
      title: "Something wrong",
      description: `${err.response.data.error}`,
      variant: "destructive",
      duration: 5000,
    });
    navigate("/signin")
  }
};

export const UseGetAllDataPatient = (
  setAppointments: any,
  appointments: any,
  setPrescriptions: any,
  prescriptions: any,
  setPayments:any,
  payments:any,
  setIsLoading: any,
  role: string
) => {
  const id = localStorage.getItem("userId");
  const [allAppointments, setAllAppointments] = useState<any>([]);
  const navigate = useNavigate();
  try {
    useEffect(() => {
      axios
        .get(`${BACKEND_URL}/api/v1/${role.toLowerCase()}/getAllData/${id}`, {withCredentials:true})
        .then((res: any) => {
          const newAppointmetns = res.data.appointments;
          const newPrescriptions = res.data.prescriptions;
          const newPayments = res.data.payments;

          const uniqueAppointments = Array.from(
            new Map(
              [...appointments, ...newAppointmetns].map((appointment) => [
                appointment.id,
                appointment,
              ])
            ).values()
          );

          const uniquePrescriptions = Array.from(
            new Map(
              [...prescriptions, ...newPrescriptions].map((prescription) => [
                prescription.id,
                prescription,
              ])
            ).values()
          );
          const uniquePayments = Array.from(
            new Map(
              [...payments, ...newPayments].map((payment) => [
                payment.id,
                payment,
              ])
            ).values()
          );
          setPayments(uniquePayments);
          setPrescriptions(uniquePrescriptions);
          setAllAppointments(uniqueAppointments); // Update local state
          setAppointments(uniqueAppointments); // Ensure no duplicates in the global users array
          console.log("safeData: ", uniqueAppointments);
          console.log("safeDataPres: ", uniquePrescriptions);
          setIsLoading(false);
        }).catch((err: any) =>{
          toast({
            title: "Something wrong",
            description: `${err.response.data.error}`,
            variant: "destructive",
            duration: 5000,
          });
          navigate("/signin")
        });
    }, []);

    return allAppointments;
  } catch (err: any) {
    toast({
      title: "Something wrong",
      description: `${err.response.data.error}`,
      variant: "destructive",
      duration: 5000,
    });
    navigate("/signin")
  }
};
export const UseGetAllDataDoctor = (
  setAppointments: any,
  appointments: any,
  setPatients: any,
  patients: any,
  setIsLoading: any,
  role: string
) => {
  const id = localStorage.getItem("userId");
  const [allAppointments, setAllAppointments] = useState<any>([]);
  const [allPatients, setAllPatients] = useState<any>([]);
  const navigate = useNavigate();
  try {
    useEffect(() => {
      axios
        .get(`${BACKEND_URL}/api/v1/${role.toLowerCase()}/getAllData/${id}`, {withCredentials:true})
        .then((res: any) => {
          const newAppointmetns = res.data.appointments;
          const newPatients = res.data.patients;

          const uniqueAppointments = Array.from(
            new Map(
              [...appointments, ...newAppointmetns].map((appointment) => [
                appointment.id,
                appointment,
              ])
            ).values()
          );
          const uniquePatients = Array.from(
            new Map(
              [...patients, ...newPatients].map((patient) => [
                patient.id,
                patient,
              ])
            ).values()
          );
          setAllPatients(uniquePatients);
          setPatients(uniquePatients);
          setAllAppointments(uniqueAppointments); // Update local state
          setAppointments(uniqueAppointments); // Ensure no duplicates in the global users array
          console.log("Appointments ", uniqueAppointments);
          console.log("Patients ", uniquePatients);
          setIsLoading(false);
        }).catch((err: any) =>{
          toast({
            title: "Something wrong",
            description: `${err.response.data.error}`,
            variant: "destructive",
            duration: 5000,
          });
          navigate("/signin")
        });
    }, []);

    return { allAppointments, allPatients };
  } catch (err: any) {
    toast({
      title: "Something wrong",
      description: `${err.response.data.error}`,
      variant: "destructive",
      duration: 5000,
    });
    navigate("/signin")
  }
};

export const UseGetAllDoctorsList = (
  doctors: any,
  setDoctors: any,
  setIsLoading: any
) => {
  const navigate = useNavigate();
  try {
    useEffect(() => {
      axios
        .get(`${BACKEND_URL}/api/v1/doctor/getAllDoctors`, {withCredentials:true})
        .then((res: any) => {
          const newDoctors = res.data.doctors;
          const uniqueDoctors = Array.from(
            new Map(
              [...doctors, ...newDoctors].map((doctor) => [doctor.id, doctor])
            ).values()
          );
          setDoctors(uniqueDoctors);
          setIsLoading(false);
        }).catch((err: any) =>{
          toast({
            title: "Something wrong",
            description: `${err.response.data.error}`,
            variant: "destructive",
            duration: 5000,
          });
          navigate("/signin")
        });
    }, []);
  } catch (err: any) {
    toast({
      title: "Something wrong",
      description: `${err.response.data.error}`,
      variant: "destructive",
      duration: 5000,
    });
    navigate("/signin")
  }
};

