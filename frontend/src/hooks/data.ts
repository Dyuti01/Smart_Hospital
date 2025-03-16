import axios from "axios";
import { BACKEND_URL } from "../config";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    axios
      .get(
        `${BACKEND_URL}/api/v1/${role.split("Public")[0].toLowerCase()}/get${
          role.split("Public")[0]
        }Data/${role === "DoctorPublic" ? userId : id}`
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
      });
  }, []);
  return userData;
};

export const UseGetAllStaffData = (
  setIsLoading: any,
  setUsers: any,
  users: any
) => {
  const [allStaffData, setAllStaffData] = useState<any>([]);
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/admin/getAllStaffData`)
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
      });
  }, []);

  return allStaffData;
};

export const UseGetAllDataPatient = (setAppointments:any, appointments:any, setPrescriptions:any, prescriptions:any, setIsLoading:any, role:string) => {
  const id = localStorage.getItem("userId");
  const [allAppointments, setAllAppointments] = useState<any>([])
	useEffect(()=>{
	axios
      .get(`${BACKEND_URL}/api/v1/${role.toLowerCase()}/getAllData/${id}`)
      .then((res: any) => {
        const newAppointmetns = res.data.appointments;
        const newPrescriptions = res.data.prescriptions;

        const uniqueAppointments = Array.from(
          new Map(
            [...appointments, ...newAppointmetns].map((appointment) => [appointment.id, appointment])
          ).values()
        );

        const uniquePrescriptions = Array.from(
          new Map(
            [...prescriptions, ...newPrescriptions].map((prescription) => [prescription.id, prescription])
          ).values()
        )
        setPrescriptions(uniquePrescriptions);
        setAllAppointments(uniqueAppointments); // Update local state
        setAppointments(uniqueAppointments); // Ensure no duplicates in the global users array
        console.log("safeData: ", uniqueAppointments);
        console.log("safeDataPres: ", uniquePrescriptions);
        setIsLoading(false)
	  })
	}, [])

  return allAppointments;
};
export const UseGetAllDataDoctor = (setAppointments:any, appointments:any, setPatients:any, patients:any, setIsLoading:any, role:string) => {
  const id = localStorage.getItem("userId");
  const [allAppointments, setAllAppointments] = useState<any>([])
  const [allPatients, setAllPatients] = useState<any>([])
	useEffect(()=>{
	axios
      .get(`${BACKEND_URL}/api/v1/${role.toLowerCase()}/getAllData/${id}`)
      .then((res: any) => {
        const newAppointmetns = res.data.appointments;
        const newPatients = res.data.patients;

        const uniqueAppointments = Array.from(
          new Map(
            [...appointments, ...newAppointmetns].map((appointment) => [appointment.id, appointment])
          ).values()
        );
        const uniquePatients = Array.from(
          new Map(
            [...patients, ...newPatients].map((patient) => [patient.id, patient])
          ).values()
        );
        setAllPatients(uniquePatients);
        setPatients(uniquePatients);
        setAllAppointments(uniqueAppointments); // Update local state
        setAppointments(uniqueAppointments); // Ensure no duplicates in the global users array
        console.log("Appointments ", uniqueAppointments);
        console.log("Patients ", uniquePatients);
        setIsLoading(false)
	  })
	}, [])

  return {allAppointments, allPatients};
};

export const UseGetAllDoctorsList = (doctors:any, setDoctors:any, setIsLoading:any)=>{
  useEffect(()=>{
    axios.get(`${BACKEND_URL}/api/v1/doctor/getAllDoctors`)
    .then((res:any)=>{
      const newDoctors = res.data.doctors
      const uniqueDoctors = Array.from(
        new Map(
          [...doctors, ...newDoctors].map((doctor) => [doctor.id, doctor])
        ).values()
      );
      setDoctors(uniqueDoctors);
      setIsLoading(false);
    })
  }, [])
}
