"use client"

import type React from "react"
import { Close } from "@radix-ui/react-dialog"
import { ChangeEvent, useContext, useRef, useState } from "react"
import firebase from "../firebase"
import {
  Calendar,
  Clock,
  Edit,
  ChevronRight,
  Camera,
  CheckCircle,
  XCircle,
  Users,
  Search,
  MoreHorizontal,
  X,
  Plus,
  Image,
  FileText,
  Paperclip,
} from "lucide-react"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/patientProfile/avatar"
import { Button } from "../ui/patientProfile/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/patientProfile/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/patientProfile/dialog"
import { Input } from "../ui/patientProfile/input"
import { Label } from "../ui/patientProfile/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/patientProfile/tabs"
import { Badge } from "../ui/patientProfile/badge"
import { Textarea } from "../ui/patientProfile/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/patientProfile/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/patientProfile/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/patientProfile/table"

// Add these imports at the top of the file
import { useToast } from "../ui/patientProfile/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/patientProfile/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/patientProfile/alert-dialog"

// Add imports for prescription and test ordering functionality
import { Clipboard, Pill, Beaker } from "lucide-react"
import { AuroraBackground } from "../ui/AuroraBackground"
import { AceternityNav } from "../components/AceternaityNav"
import { UseGetAllDataDoctor, UseGetUserData } from "../hooks/data"
import { BACKEND_URL } from "../config"
import axios from "axios"
import { cn } from "../lib/utils"
import { redirect, useNavigate } from "react-router"
import { DoctorProfileShimmer } from "./shimmer/doctor-profile-shimmer"
import signinContext from "../utils/signinContext"
import UserDataContext from "../utils/dataContext"

// Mock data
const doctorData = {
  id: "D5678",
  firstName: "Dr. Emily",
  lastName: "Chen",
  email: "emily.chen@smartclinic.com",
  phone: "+1 (555) 234-5678",
  specialty: "Cardiology",
  department: "Cardiology Department",
  licenseNumber: "MD12345678",
  education: [
    {
      degree: "Doctor of Medicine",
      university: "Harvard Medical School",
      year: "2010",
    },
    {
      degree: "Residency in Internal Medicine",
      university: "Massachusetts General Hospital",
      year: "2013",
    },
    {
      degree: "Fellowship in Cardiology",
      university: "Stanford Medical Center",
      year: "2016",
    },
  ],
  experience: "10+ years",
  languages: ["English", "Mandarin", "Spanish"],
  specializations: ["Preventive Cardiology", "Heart Disease Management", "Cardiac Rehabilitation", "Echocardiography"],
  bio: "Dr. Emily Chen is a board-certified cardiologist specializing in preventive cardiology and heart disease management. With over 10 years of experience, she is dedicated to providing comprehensive cardiac care using the latest evidence-based approaches.",
  avatarUrl: "/avatar.svg",
  availability: {
    monday: [{}],
    tuesday: [{}],
    wednesday: [{}],
    thursday: [{}],
    friday: [{}],
    saturday: [{}],
    sunday: [{}],
  },
}

const appointmentsData = [
  {
    id: "A001",
    date: "2024-03-15T09:30:00",
    patientName: "Sarah Johnson",
    patientPersonName: "Lisa Martinez",
    patientPersonEmail: "",
    patientPersonPhone: "",
    patientId: "P12345",
    status: "scheduled",
    reason: "Regular checkup",
    notes: "",
    attended: null,
    patientPhone: "",
    patientEmail: "",
    prescription: {
      medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
      tests: [] as any,
      notes: "",
      prescriptionUrl: "/no-file.pdf",
      fileType: ""
    }
  },
  {
    id: "A002",
    date: "2024-03-15T10:30:00",
    patientName: "Michael Brown",
    patientPersonName: "Lisa Martinez",
    patientPersonEmail: "",
    patientPersonPhone: "",
    patientId: "P23456",
    status: "scheduled",
    reason: "Blood pressure follow-up",
    notes: "",
    attended: null,
    patientPhone: "",
    patientEmail: "",
    prescription: {
      medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
      tests: [] as any,
      notes: "",
      prescriptionUrl: "/no-file.pdf",
      fileType: ""
    }
  },
  {
    id: "A003",
    date: "2024-03-14T14:00:00",
    patientName: "Jennifer Davis",
    patientPersonName: "Lisa Martinez",
    patientPersonEmail: "",
    patientPersonPhone: "",
    patientId: "P34567",
    status: "completed",
    reason: "Chest pain evaluation",
    notes: "Patient reported occasional chest pain during exercise. ECG normal. Recommended stress test.",
    attended: true,
    patientPhone: "",
    patientEmail: "",
    prescription: {
      medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
      tests: [] as any,
      notes: "",
      prescriptionUrl: "/no-file.pdf",
      fileType: ""
    }
  },
  {
    id: "A004",
    date: "2024-03-14T15:00:00",
    patientName: "Robert Wilson",
    patientPersonName: "Lisa Martinez",
    patientPersonEmail: "",
    patientPersonPhone: "",
    patientId: "P45678",
    status: "completed",
    reason: "Post-surgery follow-up",
    notes: "Recovery progressing well. Incision healing properly. Cleared for light exercise.",
    attended: true,
    patientPhone: "",
    patientEmail: "",
    prescription: {
      medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
      tests: [] as any,
      notes: "",
      prescriptionUrl: "/no-file.pdf",
      fileType: ""
    }
  },
  {
    id: "A005",
    date: "2024-03-14T16:00:00",
    patientName: "Lisa Martinez",
    patientPersonName: "Lisa Martinez",
    patientPersonEmail: "",
    patientPersonPhone: "",
    patientId: "P56789",
    status: "completed",
    reason: "Medication review",
    notes: "Adjusted dosage of beta blocker. Patient reporting improved symptoms.",
    attended: false,
    patientPhone: "",
    patientEmail: "",
    prescription: {
      medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
      tests: [] as any,
      notes: "",
      prescriptionUrl: "/no-file.pdf",
      fileType: ""
    }
  },
]

const patientsData = [
  {
    id: "P12345",
    name: "Sarah Johnson",
    age: 39,
    gender: "Female",
    lastVisit: "2024-02-15",
    condition: "Hypertension",
    contactInfo: "+1 (555) 123-4567",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "P23456",
    name: "Michael Brown",
    age: 52,
    gender: "Male",
    lastVisit: "2024-03-01",
    condition: "Coronary Artery Disease",
    contactInfo: "+1 (555) 234-5678",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "P34567",
    name: "Jennifer Davis",
    age: 45,
    gender: "Female",
    lastVisit: "2024-03-14",
    condition: "Chest Pain",
    contactInfo: "+1 (555) 345-6789",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "P45678",
    name: "Robert Wilson",
    age: 68,
    gender: "Male",
    lastVisit: "2024-03-14",
    condition: "Post CABG",
    contactInfo: "+1 (555) 456-7890",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "P56789",
    name: "Lisa Martinez",
    age: 41,
    gender: "Female",
    lastVisit: "2024-03-14",
    condition: "Arrhythmia",
    contactInfo: "+1 (555) 567-8901",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
]

export default function DoctorProfileTest() {
  const [doctor, setDoctor] = useState(doctorData)
  const [editFormData, setEditFormData] = useState(doctorData)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [appointments, setAppointments] = useState(appointmentsData)
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointments[0] | null>(null)
  const [patients, setPatients] = useState(patientsData)
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [appointmentFilter, setAppointmentFilter] = useState("all")

  // Add this after the existing useState declarations
  const { toast } = useToast()
  const [isEditingSchedule, setIsEditingSchedule] = useState(false)
  const [isScheduleChanging, setIsScheduleChanging] = useState(false)
  const [scheduleData, setScheduleData] = useState(doctor.availability)
  const [isAddingPrescription, setIsAddingPrescription] = useState(false)
  const [isOrderingTests, setIsOrderingTests] = useState(false)
  const [selectedPatientForAction, setSelectedPatientForAction] = useState<typeof patients[0] | null>(null)
  const [appointmentNotes, setAppointmentNotes] = useState("")

  const [isPrescriptionCreating, setIsPrescriptionCreating] = useState(false);
  const [isNotesSaving, setIsNotesSaving] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isMissedMarking, setIsMissedMarking] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isOtherDataLoading, setIsOtherDataLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  // Add state for prescription and test ordering
  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false)
  const [isTestOrderDialogOpen, setIsTestOrderDialogOpen] = useState(false)
  const [newPrescription, setNewPrescription] = useState({
    medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
    tests: [] as any,
    notes: "",
    prescriptionUrl: "/no-file.pdf",
    fileType: ""
  })

  // const [editPrescription, setEditPrescription] = useState({
  //   medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
  //   tests: [] as any,
  //   notes: "",
  //   prescriptionUrl:"/no-file.pdf"
  // })

  const [newTestOrder, setNewTestOrder] = useState({
    tests: [{ name: "", urgency: "Routine" }],
    notes: ""
  })

  // First, add a new state for the prescription file
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null)
  const [prescriptionFilePreview, setPrescriptionFilePreview] = useState<string | null>(null)
  const recaptchaRef = useRef(null)
  const verificationData = useContext(UserDataContext)
  const [isSentOtp, setIsSentOtp] = useState(false)
  const navigate = useNavigate();
  // const [isLoading, setIsLoading] = useState(2)

  // const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }


  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setEditFormData((prev: any) => ({ ...prev, avatarUrl: file }))
    }
  };


  // const handleSave = () => {
  //   setDoctor(editFormData)
  // }

  UseGetUserData(setDoctor, setIsProfileLoading, "Doctor", setEditFormData, setScheduleData);
  UseGetAllDataDoctor(setAppointments, appointments, setPatients, patients, setIsOtherDataLoading, "Doctor");


  if (isProfileLoading || isOtherDataLoading) {
    return <DoctorProfileShimmer />
  }

  // ------------------------------------------------------------------------------------------

  const addEducationEntry = () => {
    setEditFormData({
      ...editFormData,
      education: [...editFormData.education, { degree: "", university: "", year: "" }],
    })
  }

  const removeEducationEntry = (index: number) => {
    const updatedEducation = [...editFormData.education]
    updatedEducation.splice(index, 1)
    setEditFormData({
      ...editFormData,
      education: updatedEducation,
    })
  }

  const updateEducationEntry = (index: number, field: string, value: string) => {
    const updatedEducation = [...editFormData.education]
    updatedEducation[index] = { ...updatedEducation[index], [field]: value }
    setEditFormData({
      ...editFormData,
      education: updatedEducation,
    })
  }
  // ---------------------------------------------------------------------------------------

  const handleAddMedication = () => {
    setNewPrescription({
      ...newPrescription,
      medications: [...newPrescription.medications, { name: "", dosage: "", frequency: "", duration: "" }]
    })
  }

  const handleRemoveMedication = (index: number) => {
    const updatedMedications = [...newPrescription.medications]
    updatedMedications.splice(index, 1)
    setNewPrescription({
      ...newPrescription,
      medications: updatedMedications
    })
  }

  const handleMedicationChange = (index: number, field: string, value: string) => {
    const updatedMedications = [...newPrescription.medications]
    updatedMedications[index] = { ...updatedMedications[index], [field]: value }
    setNewPrescription({
      ...newPrescription,
      medications: updatedMedications
    })
  }

  const handleAddTest = () => {
    setNewPrescription({
      ...newPrescription,
      tests: [...newPrescription.tests, { name: "", urgency: "Routine" }]
    })
  }

  const handleRemoveTest = (index: number) => {
    const updatedTests = [...newPrescription.tests]
    updatedTests.splice(index, 1)
    setNewPrescription({
      ...newPrescription,
      tests: updatedTests
    })
  }

  const handleTestChange = (index: number, field: string, value: string) => {
    const updatedTests = [...newPrescription.tests]
    updatedTests[index] = { ...updatedTests[index], [field]: value }
    setNewPrescription({
      ...newPrescription,
      tests: updatedTests
    })
  }

  const handleAddTestToOrder = () => {
    setNewTestOrder({
      ...newTestOrder,
      tests: [...newTestOrder.tests, { name: "", urgency: "Routine" }]
    })
  }

  const handleRemoveTestFromOrder = (index: number) => {
    const updatedTests = [...newTestOrder.tests]
    updatedTests.splice(index, 1)
    setNewTestOrder({
      ...newTestOrder,
      tests: updatedTests
    })
  }

  const handleTestOrderChange = (index: number, field: string, value: string) => {
    const updatedTests = [...newTestOrder.tests]
    updatedTests[index] = { ...updatedTests[index], [field]: value }
    setNewTestOrder({
      ...newTestOrder,
      tests: updatedTests
    })
  }

  // -----------------------------------------------------------------------------------------
  // Prescription file
  const handlePrescriptionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPrescriptionFile(file)
    const fileType = file.type.split('/')[1];
    setNewPrescription((prev: any) => ({ ...prev, prescriptionUrl: file, fileType: fileType }))
    // Create preview for images
    console.log(file.type)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        setPrescriptionFilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      // For PDFs, just show the filename
      setPrescriptionFilePreview(null)
    }
  }

  // Add a function to clear the selected file
  const handleClearPrescriptionFile = () => {
    setPrescriptionFile(null)
    setPrescriptionFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCreatePrescription = async (appointmentId: string) => {
    // In a real app, this would save the prescription to the database
    try {
      console.log(newPrescription)
      setIsPrescriptionCreating(true);
      await axios.patch(`${BACKEND_URL}/api/v1/doctor/createPrescription/${appointmentId}`, newPrescription, {
        withCredentials: true, headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      toast({
        title: "Prescription created",
        description: `Prescription has been created for ${selectedAppointment?.patientName}`,
        variant: "default",
      })
      setIsPrescriptionCreating(false);
      setIsPrescriptionDialogOpen(false)
      setPrescriptionFile(null)
      setPrescriptionFilePreview(null)
      setNewPrescription({
        medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
        tests: [],
        notes: "",
        prescriptionUrl: "",
        fileType:""
      })
    }
    catch (err: any) {
      console.log(err)
      toast({
        title: "Something wrong",
        description: `${err}`,
        variant: "destructive",
        duration: 5000
      })
      setIsPrescriptionCreating(false);
    }
  }
  // --------------------------------------------------------------------------------------------------

  const handleCreateTestOrder = () => {
    // In a real app, this would save the test order to the database
    toast({
      title: "Tests ordered",
      description: `Tests have been ordered for ${selectedAppointment?.patientName}`,
      variant: "default",
    })
    setIsTestOrderDialogOpen(false)
    setNewTestOrder({
      tests: [{ name: "", urgency: "Routine" }],
      notes: ""
    })
  }

  const handleSaveProfile = () => {
    try {
      const doctorId = localStorage.getItem("userId")
      setIsEditing(true)
      axios.patch(`${BACKEND_URL}/api/v1/doctor/edit/${doctorId}`, editFormData, {
        withCredentials: true, headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res: any) => {
        console.log(res.data.doctorDetails)
        console.log("safeData: ", res.data.doctorDetails)
        setDoctor(res.data.doctorDetails)
        setEditFormData(res.data.doctorDetails)
        setIsEditing(false);
        setIsEdited(true);
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
          variant: "success",
          duration: 5000
        })
      })
    }
    catch (err: any) {
      console.log(err)
      toast({
        title: "Something wrong",
        description: `${err}`,
        variant: "destructive",
        duration: 5000
      })
    }
  }

  const handleEditSchedule = () => {
    setIsEditingSchedule(true)
  }

  const handleSaveSchedule = () => {
    setIsEditingSchedule(true)
    setIsScheduleChanging(true)
    try {
      const doctorId = localStorage.getItem("userId")
      axios.patch(`${BACKEND_URL}/api/v1/doctor/editSchedule/${doctorId}`, scheduleData, {
        withCredentials: true
      }).then((res: any) => {
        console.log(res.data.scheduleData)
        console.log("safeData: ", res.data.scheduleData)
        setScheduleData(res.data.scheduleData)
        setEditFormData(res.data.scheduleData)
        setIsEditingSchedule(false);
        setIsScheduleChanging(false);
        toast({
          title: "Successful",
          description: `Your schedule got updated!`,
          variant: "success",
          duration: 5000
        })
      })
    }
    catch (err: any) {
      console.log(err)
      toast({
        title: "Something wrong",
        description: `${err}`,
        variant: "destructive",
        duration: 5000
      })
    }
    // console.log(scheduleData)
    // toast({
    //   title: "Schedule updated",
    //   description: "Your availability schedule has been updated successfully.",
    //   variant: "default",
    // })
  }

  const handleScheduleChange = (day: string, index: number, field: 'start' | 'end', value: string) => {
    setScheduleData(prev => {
      const newSchedule: any = { ...prev }
      const daySlots = [...(newSchedule[day as keyof typeof newSchedule] || [])]
      daySlots[index] = { ...daySlots[index], [field]: value }
      newSchedule[day as keyof typeof newSchedule] = daySlots
      return newSchedule
    })
  }

  const handleAddTimeSlot = (day: string) => {
    setScheduleData(prev => {
      const newSchedule: any = { ...prev }
      const daySlots = [...(newSchedule[day as keyof typeof newSchedule] || [])]
      daySlots.push({ start: "09:00", end: "10:00" })
      newSchedule[day as keyof typeof newSchedule] = daySlots
      return newSchedule
    })
  }

  const handleRemoveTimeSlot = (day: string, index: number) => {
    setScheduleData(prev => {
      const newSchedule: any = { ...prev }
      const daySlots = [...(newSchedule[day as keyof typeof newSchedule] || [])]
      daySlots.splice(index, 1)
      newSchedule[day as keyof typeof newSchedule] = daySlots
      return newSchedule
    })
  }


  const sendOtp = (data: { appointmentId: string, phone: string, attended: boolean }) => {
    try {
      console.log(data)
      if (recaptchaRef.current) {
        //@ts-ignore
        recaptchaRef.current.innerHTML = '<div id="recaptcha-container"></div>'
      }
      const verifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", { size: "invisible" })

      firebase.auth().signInWithPhoneNumber(data.phone, verifier).then((confirmationRes) => {
        // console.log(confirmationRes)
        console.log("OTP got sent")
        setIsSendingOtp(false)
        setIsSentOtp(true)
        verificationData.setUserData({ ...verificationData.userData, verificationId: confirmationRes.verificationId, appointmentId: data.appointmentId, phone: data.phone })
        navigate('/otp_verification_attendence')
        // Toast
      }).catch((error) => {
        console.log("Error sending OTP: " + error)
      })

    }
    catch (err) {

      console.error(err)
    }

  }

  const handleAttendanceChange = async (appointmentId: string, phone: string, attended: boolean) => {
    // In a real app, this would update the database
    try {

      if (attended) {
        setIsSendingOtp(true);
        sendOtp({ appointmentId: appointmentId, phone: phone, attended: attended });
      }
      else {
        setIsMissedMarking(true);
        await axios.patch(`${BACKEND_URL}/api/v1/doctor/markAttendence/${appointmentId}`, { isAttended: attended }, { withCredentials: true })

        setIsMissedMarking(false);
        toast({
          title: "Missed marked",
          description: `Attendence marked as missed.`,
          variant: "success",
          duration: 5000
        })
      }

    }
    catch (err) {
      console.log(err)
      toast({
        title: "Something wrong",
        description: `${err}`,
        variant: "destructive",
        duration: 5000
      })
      setIsSendingOtp(false);
      setIsSentOtp(false);
    }
  }

  const handleSaveNotes = async () => {
    if (selectedAppointment) {
      try {
        setIsNotesSaving(true);
        await axios.patch(`${BACKEND_URL}/api/v1/doctor/updateNotes/${selectedAppointment.id}`, { notes: selectedAppointment.notes }, { withCredentials: true });
        setIsNotesSaving(false);

        toast({
          title: "Notes saved",
          description: "Appointment notes have been saved successfully.",
          variant: "default",
        })
      } catch (err) {
        console.log(err)
        toast({
          title: "Something wrong",
          description: `${err}`,
          variant: "destructive",
          duration: 5000
        })
        setIsNotesSaving(false);

      }
    }
  }

  const handleScheduleNewAppointment = () => {
    toast({
      title: "Scheduling new appointment",
      description: "Opening appointment scheduler...",
      variant: "default",
    })
  }

  const handleViewPatientRecord = (patient: typeof patients[0]) => {
    toast({
      title: "Opening patient record",
      description: `Viewing medical record for ${patient.name}`,
      variant: "default",
    })
  }

  const handleViewTestReports = (patient: typeof patients[0]) => {
    toast({
      title: "Opening test reports",
      description: `Viewing test reports for ${patient.name}`,
      variant: "default",
    })
  }

  const handleViewPrescriptions = (patient: typeof patients[0]) => {
    toast({
      title: "Opening prescriptions",
      description: `Viewing prescriptions for ${patient.name}`,
      variant: "default",
    })
  }

  const handleAddPrescription = (patient: typeof patients[0]) => {
    setSelectedPatientForAction(patient)
    setIsAddingPrescription(true)
  }

  const handleOrderTests = (patient: typeof patients[0]) => {
    setSelectedPatientForAction(patient)
    setIsOrderingTests(true)
  }

  const handleSubmitPrescription = () => {
    setIsAddingPrescription(false)
    toast({
      title: "Prescription added",
      description: selectedPatientForAction ? `Prescription has been added for ${selectedPatientForAction.name}` : "Prescription has been added",
      variant: "default",
    })
  }

  const handleSubmitTestOrder = () => {
    setIsOrderingTests(false)
    toast({
      title: "Tests ordered",
      description: selectedPatientForAction ? `Tests have been ordered for ${selectedPatientForAction.name}` : "Tests have been ordered",
      variant: "default",
    })
  }

  const filteredAppointments = appointments.filter((appointment) => {
    if (appointmentFilter === "scheduled" && appointment.status !== "scheduled") return false
    if (appointmentFilter === "completed" && appointment.status !== "completed") return false
    if (appointmentFilter === "attended" && appointment.attended !== true) return false
    if (appointmentFilter === "missed" && appointment.attended !== false) return false
    return true
  })

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddSpecialization = () => {
    const newSpecialization = document.getElementById("new-specialization") as HTMLInputElement
    if (newSpecialization && newSpecialization.value.trim()) {
      setEditFormData((prev) => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.value.trim()],
      }))
      newSpecialization.value = ""
    }
  }

  const handleRemoveSpecialization = (index: number) => {
    setEditFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index),
    }))
  }
  const handleAddLanguage = () => {
    const newLanguage = document.getElementById("new-language") as HTMLInputElement
    if (newLanguage && newLanguage.value.trim()) {
      setEditFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage.value.trim()],
      }))
      newLanguage.value = ""
    }
  }

  const handleRemoveLanguage = (index: number) => {
    setEditFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <AuroraBackground>
      <TooltipProvider>
        <AceternityNav />
        <div className="container mx-auto pt-28 pb-6 px-[100px] max-w-full z-10 bg-gradient-to-r from-cyan-600 to-teal-600">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="w-full md:w-1/3">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <CardTitle>Doctor Profile</CardTitle>
                      <CardDescription>Professional information</CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => setIsEdited(false)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit profile</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[525px] max-h-[90vh] flex flex-col">
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                          <DialogDescription>
                            Update your professional information. Click save when you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 overflow-y-auto pr-1">
                          <div className="flex flex-col items-center gap-4">
                            <Avatar className="h-24 w-24 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                              <AvatarImage src={editFormData.avatarUrl} alt={(editFormData.firstName && editFormData.lastName) && (editFormData.firstName[0] + " " + editFormData.lastName[0])} />
                              <AvatarFallback>
                                {(editFormData.firstName + " " + editFormData.lastName)
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                              <Camera className="h-4 w-4 mr-2" />
                              Change Photo
                            </Button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept="image/*"
                              className="hidden"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstName" className="text-right">
                              First name
                            </Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={editFormData.firstName}
                              onChange={handleInputChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastName" className="text-right">
                              Last name
                            </Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={editFormData.lastName}
                              onChange={handleInputChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={editFormData.email}
                              onChange={handleInputChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                              Phone
                            </Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={editFormData.phone}
                              onChange={handleInputChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="specialty" className="text-right">
                              Specialty
                            </Label>
                            <Input
                              id="specialty"
                              name="specialty"
                              value={editFormData.specialty}
                              onChange={handleInputChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="specializations" className="text-right mt-2">
                              Specializations
                            </Label>
                            <div className="col-span-3 space-y-2">
                              <div className="flex flex-wrap gap-2 mb-2">
                                {editFormData.specializations && editFormData.specializations.map((specialization, index) => (
                                  <div key={index} className="flex items-center bg-muted rounded-full px-3 py-1 text-sm">
                                    <span>{specialization}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSpecialization(index)}
                                      className="ml-2 text-gray-500 hover:text-red-500"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Input id="new-specialization" placeholder="Add specialization..." className="flex-1" />
                                <Button type="button" variant="outline" size="sm" onClick={handleAddSpecialization}>
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>


                          <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="languages" className="text-right mt-2">
                              Languages
                            </Label>
                            <div className="col-span-3 space-y-2">
                              <div className="flex flex-wrap gap-2 mb-2">
                                {editFormData.languages && editFormData.languages.map((language, index) => (
                                  <div key={index} className="flex items-center bg-muted rounded-full px-3 py-1 text-sm">
                                    <span>{language}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveLanguage(index)}
                                      className="ml-2 text-gray-500 hover:text-red-500"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Input id="new-language" placeholder="Add language..." className="flex-1" />
                                <Button type="button" variant="outline" size="sm" onClick={handleAddLanguage}>
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="department" className="text-right">
                              Department
                            </Label>
                            <Input
                              id="department"
                              name="department"
                              value={editFormData.department}
                              onChange={handleInputChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="licenseNumber" className="text-right">
                              License Number
                            </Label>
                            <Input
                              id="licenseNumber"
                              name="licenseNumber"
                              value={editFormData.licenseNumber}
                              onChange={handleInputChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="experience" className="text-right">
                              Experience
                            </Label>
                            <Input
                              id="experience"
                              name="experience"
                              value={editFormData.experience}
                              onChange={handleInputChange}
                              className="col-span-3"
                            />
                          </div>
                          {/* <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right mt-2">Education</Label>
                            <div className="col-span-3 space-y-4 overflow-y-scroll h-[100px]">
                              {(!editFormData.education || (editFormData.education.length === 0)) && (
                                <p className="text-sm text-muted-foreground">No education entries added yet.</p>
                              )}

                              {editFormData.education && editFormData.education.map((edu, index) => (
                                <div key={index} className="grid gap-3 p-3 border rounded-md relative">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1 h-6 w-6"
                                    onClick={() => removeEducationEntry(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                  <div className="grid gap-2">
                                    <Label htmlFor={`degree-${index}`}>Degree</Label>
                                    <Input
                                      id={`degree-${index}`}
                                      value={edu.degree}
                                      onChange={(e) => updateEducationEntry(index, "degree", e.target.value)}
                                      placeholder="e.g., MBBS, MD, MS"
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor={`university-${index}`}>University/Institution</Label>
                                    <Input
                                      id={`university-${index}`}
                                      value={edu.university}
                                      onChange={(e) => updateEducationEntry(index, "university", e.target.value)}
                                      placeholder="e.g., Harvard Medical School"
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor={`year-${index}`}>Year</Label>
                                    <Input
                                      id={`year-${index}`}
                                      value={edu.year}
                                      onChange={(e) => updateEducationEntry(index, "year", e.target.value)}
                                      placeholder="e.g., 2015"
                                    />
                                  </div>
                                </div>
                              ))}

                              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addEducationEntry}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Education
                              </Button>
                            </div>
                          </div> */}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bio" className="text-right">
                              Bio
                            </Label>
                            <Textarea
                              id="bio"
                              name="bio"
                              value={editFormData.bio}
                              onChange={handleInputChange}
                              className="col-span-3"
                              rows={3}
                            />
                          </div>
                        </div>
                        <DialogFooter className="mt-2">
                          {/* <Button type="submit" onClick={handleSaveProfile}>
                            Save changes
                          </Button> */}
                          {!isEdited && <Button
                            className={cn(
                              "w-full transition-all duration-200",
                              isEditing
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700",
                            )}
                            // disabled={isEditing}
                            disabled={(editFormData === doctor && !isEdited) || isEditing}
                            onClick={() => {
                              if (!isEdited) {
                                handleSaveProfile()
                              }
                              else if (isEdited) {
                                redirect('/patient_profile')
                              }
                            }}
                          >
                            {isEditing ? (
                              <div className="flex items-center">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Editing...
                              </div>
                            ) : (
                              "Save changes"
                            )}
                          </Button>}

                          {isEdited &&
                            <Close className={cn("py-2 rounded-lg w-full transition-all duration-200 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700")}>{"Continue to your profile"}</Close>}
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center mb-6">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={doctor.avatarUrl} alt={doctor.firstName + " " + doctor.lastName} />
                      <AvatarFallback>
                        {(doctor.firstName + " " + doctor.lastName)
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold">{doctor.firstName + " " + doctor.lastName}</h2>
                    <p className="text-muted-foreground">{doctor.specialty}</p>
                    <p className="text-muted-foreground">ID: {doctor.id}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">Email</span>
                      <span>{doctor.email}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">Phone</span>
                      <span>{doctor.phone}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">Department</span>
                      <span>{doctor.department}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">License Number</span>
                      <span>{doctor.licenseNumber}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">Experience</span>
                      <span>{doctor.experience}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">Education</span>
                      <div className="space-y-2">
                        {doctor.education.map((edu, index) => (
                          <div key={index} className="text-sm">
                            <div className="font-medium">{edu.degree}</div>
                            <div>
                              {edu.university}, {edu.year}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">Bio</span>
                      <span className="text-sm">{doctor.bio}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Availability Schedule</CardTitle>
                  <CardDescription>Your weekly working hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(scheduleData).map(([day, slots]: any) => (
                      <div key={day} className="flex justify-between items-center">
                        <div className="font-medium capitalize">{day}</div>
                        <div>
                          {slots.length > 0 ? (
                            slots.map((slot: any, index: any) => (
                              <div key={index} className="flex items-center gap-2">
                                {isEditingSchedule ? (
                                  <>
                                    <Input
                                      type="time"
                                      value={slot.start}
                                      onChange={(e) => handleScheduleChange(day, index, 'start', e.target.value)}
                                      className="w-24"
                                    />
                                    -
                                    <Input
                                      type="time"
                                      value={slot.end}
                                      onChange={(e) => handleScheduleChange(day, index, 'end', e.target.value)}
                                      className="w-24"
                                    />
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveTimeSlot(day, index)}>
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <span className="text-sm">
                                    {index > 0 && ", "}
                                    {slot.start} - {slot.end}
                                  </span>
                                )}
                              </div>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">Not Available</span>
                          )}
                          {isEditingSchedule && (
                            <Button variant="ghost" size="icon" onClick={() => handleAddTimeSlot(day)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  {isEditingSchedule ? (
                    <div className="w-full space-y-4">
                      <div className="space-y-4">
                        {Object.entries(scheduleData).map(([day, slots]: any) => (
                          <div key={day} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium capitalize">{day}</h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddTimeSlot(day)}
                                className="h-8 text-xs"
                              >
                                Add Slot
                              </Button>
                            </div>
                            {slots.length > 0 ? (
                              <div className="space-y-2">
                                {slots.map((slot: any, index: any) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <Input
                                      type="time"
                                      value={slot.start}
                                      onChange={(e) => handleScheduleChange(day, index, 'start', e.target.value)}
                                      className="w-32"
                                    />
                                    <span>to</span>
                                    <Input
                                      type="time"
                                      value={slot.end}
                                      onChange={(e) => handleScheduleChange(day, index, 'end', e.target.value)}
                                      className="w-32"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveTimeSlot(day, index)}
                                      className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">Not Available</div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsEditingSchedule(false)}>Cancel</Button>
                        {/* <Button onClick={handleSaveSchedule}>Save Schedule</Button> */}
                        <Button onClick={handleSaveSchedule}>
                          {!isScheduleChanging && "Save Schedule"}
                          {isScheduleChanging &&
                            <div className="flex items-center">
                              <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2" />
                              Changing schedule...
                            </div>
                          }
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button variant="outline" className="w-full" onClick={handleEditSchedule}>
                      Edit Schedule
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>

            <div className="w-full md:w-2/3">
              <Tabs defaultValue="appointments" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="appointments" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Appointments</span>
                  </TabsTrigger>
                  <TabsTrigger value="patients" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>My Patients</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="appointments" className="mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <CardTitle>Appointments</CardTitle>
                          <CardDescription>Manage your patient appointments</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select defaultValue="all" onValueChange={setAppointmentFilter}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Filter appointments" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Appointments</SelectItem>
                              <SelectItem value="scheduled">Scheduled</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="attended">Attended</SelectItem>
                              <SelectItem value="missed">Missed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="max-h-[1160px] overflow-y-scroll [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                      <div className="space-y-4">
                        {filteredAppointments.map((appointment) => (
                          <Card key={appointment.id} className="overflow-hidden">
                            <div className={`h-2 ${getStatusColor(appointment.status)}`} />
                            <CardHeader className="pb-2">
                              <div className="flex justify-between">
                                <div>
                                  <CardTitle className="text-lg">{appointment.patientPersonName}</CardTitle>
                                  <CardDescription>Patient ID: {appointment.patientId}</CardDescription>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <Badge variant="outline" className={getStatusColor(appointment.status)}>
                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                  </Badge>
                                  {appointment.attended === true && (
                                    <Badge variant="outline" className="bg-green-100 text-green-800">
                                      Attended
                                    </Badge>
                                  )}
                                  {appointment.attended === false && (
                                    <Badge variant="outline" className="bg-red-100 text-red-800">
                                      Missed
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pb-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{format(new Date(appointment.date), "MMMM d, yyyy")}</span>
                                <Clock className="h-4 w-4 ml-2 text-muted-foreground" />
                                <span>{format(new Date(appointment.date), "h:mm a")}</span>
                              </div>
                              <p className="text-sm">Reason: {appointment.reason}</p>
                              {appointment.notes && <p className="text-sm mt-1">Notes: {appointment.notes}</p>}
                            </CardContent>
                            <CardFooter className="pt-0 flex justify-between">
                              <div>
                                {appointment.status === "scheduled" && (
                                  <div className="flex gap-2">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => handleAttendanceChange(appointment.id, appointment.patientPhone, true)}
                                          >

                                            {!isSendingOtp && <><CheckCircle className="h-4 w-4" />"Mark Attended"</>}
                                            {isSendingOtp &&
                                              <div className="flex items-center">
                                                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2" />
                                                Sending OTP...
                                              </div>}
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Mark this appointment as attended</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => handleAttendanceChange(appointment.id, appointment.patientPhone, false)}
                                          >
                                            <XCircle className="h-4 w-4" />
                                            {!isMissedMarking && "Mark Missed"}
                                            {isMissedMarking &&
                                              <div className="flex items-center">
                                                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2" />
                                                Marking missed...
                                              </div>}
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Mark this appointment as missed</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                )}
                              </div>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => {
                                    setSelectedAppointment(appointment);
                                    setNewPrescription(appointment.prescription);
                                  }}>
                                    View Details
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[525px]">
                                  <DialogHeader>
                                    <DialogTitle>Appointment Details</DialogTitle>
                                    <DialogDescription>
                                      Patient: {selectedAppointment?.patientName} (ID: {selectedAppointment?.patientId})
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedAppointment && (
                                    <div className="grid gap-4 py-4">
                                      <div className="flex items-center justify-between">
                                        <Badge variant="outline" className={getStatusColor(selectedAppointment.status)}>
                                          {selectedAppointment.status.charAt(0).toUpperCase() +
                                            selectedAppointment.status.slice(1)}
                                        </Badge>
                                        <div className="text-sm text-muted-foreground">
                                          {format(new Date(selectedAppointment.date), "MMMM d, yyyy")} at{" "}
                                          {format(new Date(selectedAppointment.date), "h:mm a")}
                                        </div>
                                      </div>
                                      <div className="grid gap-2">
                                        <div className="flex justify-between">
                                          <div>
                                            <h3 className="text-sm font-semibold">Patient person name</h3>
                                            <p className="text-sm">{selectedAppointment.patientPersonName}</p>
                                          </div>
                                          <div>
                                            <h3 className="text-sm font-semibold">Patient person contact</h3>
                                            <p className="text-sm">{selectedAppointment.patientPersonPhone || appointment.patientPersonEmail}</p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="grid gap-2">
                                        <h3 className="text-sm font-semibold">Reason for Visit</h3>
                                        <p className="text-sm">{selectedAppointment.reason}</p>
                                      </div>

                                      <div className="grid gap-2">
                                        <h3 className="text-sm font-semibold">Notes</h3>
                                        <Textarea
                                          value={selectedAppointment?.notes || ""}
                                          placeholder="Add appointment notes here..."
                                          className="min-h-[100px]"
                                          onClick={() => console.log(selectedAppointment)}
                                          onChange={(e) => {
                                            setAppointmentNotes(e.target.value)
                                            // In a real app, this would update the appointment notes in state
                                            setSelectedAppointment((prev) =>
                                              prev ? { ...prev, notes: e.target.value } : null
                                            )
                                          }}
                                        />
                                      </div>

                                      <div className="grid gap-2">
                                        <h3 className="text-sm font-semibold">Attendance</h3>
                                        <div className="flex gap-2">
                                          <Button
                                            variant={selectedAppointment.attended === true ? "default" : "outline"}
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => handleAttendanceChange(selectedAppointment.id, appointment.patientPhone, true)}
                                          >
                                            {!isSendingOtp && <><CheckCircle className="h-4 w-4" />Attended</>}
                                            {isSendingOtp &&
                                              <div className="flex items-center">
                                                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2" />
                                                Marking attended...
                                              </div>}
                                          </Button>

                                          <Button
                                            variant={selectedAppointment.attended === false ? "default" : "outline"}
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => handleAttendanceChange(selectedAppointment.id, appointment.patientPhone, false)}
                                          >
                                            {!isMissedMarking && <><XCircle className="h-4 w-4" />Missed</>}
                                            {isMissedMarking &&
                                              <div className="flex items-center">
                                                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2" />
                                                Marking missed...
                                              </div>}
                                          </Button>
                                        </div>
                                      </div>

                                      <div className="grid gap-2">
                                        <h3 className="text-sm font-semibold">Actions</h3>
                                        <div className="flex flex-wrap gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewPatientRecord(
                                              patients.find(p => p.id === selectedAppointment.patientId) || patients[0]
                                            )}
                                          >
                                            <Clipboard className="h-4 w-4 mr-2" />
                                            View Patient Record
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              setIsPrescriptionDialogOpen(true)
                                            }}
                                          >
                                            <Pill className="h-4 w-4 mr-2" />
                                            Add Prescription
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              setIsTestOrderDialogOpen(true)
                                            }}
                                          >
                                            <Beaker className="h-4 w-4 mr-2" />
                                            Order Tests
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  <DialogFooter>
                                    <Button onClick={handleSaveNotes}>
                                      {/* Save Notes */}
                                      {!isNotesSaving && "Save notes"}
                                      {isNotesSaving &&
                                        <div className="flex items-center">
                                          <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2" />
                                          Saving notes...
                                        </div>
                                      }

                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                    {/* <CardFooter>
                      <Button className="w-full" onClick={handleScheduleNewAppointment}>Schedule New Appointment</Button>
                    </CardFooter> */}
                  </Card>
                </TabsContent>

                <TabsContent value="patients" className="mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <CardTitle>My Patients</CardTitle>
                          <CardDescription>View and manage your patient records</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-auto">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search patients..."
                            className="pl-8 w-full sm:w-[250px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Age/Gender</TableHead>
                            <TableHead>Condition</TableHead>
                            <TableHead>Last Visit</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPatients.map((patient) => (
                            <TableRow key={patient.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                                    <AvatarFallback>
                                      {patient.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{patient.name}</div>
                                    <div className="text-xs text-muted-foreground">{patient.id}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {patient.age} / {patient.gender}
                              </TableCell>
                              <TableCell>{patient.condition}</TableCell>
                              <TableCell>{format(new Date(patient.lastVisit), "MMM d, yyyy")}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleViewPatientRecord(patient)}>
                                      View Medical Record
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleViewTestReports(patient)}>
                                      View Test Reports
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleViewPrescriptions(patient)}>
                                      View Prescriptions
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleScheduleNewAppointment()}>
                                      Schedule Appointment
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleAddPrescription(patient)}>
                                      Add Prescription
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleOrderTests(patient)}>
                                      Order Tests
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter>
                      <div className="text-sm text-muted-foreground">
                        Showing {filteredPatients.length} of {patients.length} patients
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <AlertDialog open={isAddingPrescription} onOpenChange={setIsAddingPrescription}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Add Prescription</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to add a prescription for {selectedPatientForAction?.name}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsAddingPrescription(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmitPrescription}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={isOrderingTests} onOpenChange={setIsOrderingTests}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Order Tests</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to order tests for {selectedPatientForAction?.name}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsOrderingTests(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmitTestOrder}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Add Prescription Dialog */}
          <Dialog open={isPrescriptionDialogOpen} onOpenChange={setIsPrescriptionDialogOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Create Prescription</DialogTitle>
                <DialogDescription>
                  {selectedAppointment ? `Create a prescription for ${selectedAppointment.patientName}` : 'Create a new prescription'}
                </DialogDescription>
              </DialogHeader>
              <div className="overflow-y-auto pr-1">
                <div className="grid gap-6 py-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold">Medications</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddMedication}
                        className="h-8 text-xs"
                      >
                        Add Medication
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {newPrescription.medications.map((med: any, index: any) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-start p-3 rounded-md border">
                          <div className="col-span-12 sm:col-span-3">
                            <Label htmlFor={`med-name-${index}`} className="text-xs mb-1 block">Medication</Label>
                            <Input
                              id={`med-name-${index}`}
                              value={med.name}
                              onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                              placeholder="Medication name"
                            />
                          </div>
                          <div className="col-span-6 sm:col-span-2">
                            <Label htmlFor={`med-dosage-${index}`} className="text-xs mb-1 block">Dosage</Label>
                            <Input
                              id={`med-dosage-${index}`}
                              value={med.dosage}
                              onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                              placeholder="e.g., 10mg"
                            />
                          </div>
                          <div className="col-span-6 sm:col-span-3">
                            <Label htmlFor={`med-frequency-${index}`} className="text-xs mb-1 block">Frequency</Label>
                            <Input
                              id={`med-frequency-${index}`}
                              value={med.frequency}
                              onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                              placeholder="e.g., Once daily"
                            />
                          </div>
                          <div className="col-span-10 sm:col-span-3">
                            <Label htmlFor={`med-duration-${index}`} className="text-xs mb-1 block">Duration</Label>
                            <Input
                              id={`med-duration-${index}`}
                              value={med.duration}
                              onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                              placeholder="e.g., 30 days"
                            />
                          </div>
                          <div className="col-span-2 sm:col-span-1 flex items-end justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMedication(index)}
                              disabled={newPrescription.medications.length === 1}
                              className="h-10 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold">Tests</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddTest}
                        className="h-8 text-xs"
                      >
                        Add Test
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {newPrescription.tests.map((test: any, index: any) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-start p-3 rounded-md border">
                          <div className="col-span-12 sm:col-span-7">
                            <Label htmlFor={`test-name-${index}`} className="text-xs mb-1 block">Test Name</Label>
                            <Input
                              id={`test-name-${index}`}
                              value={test.name}
                              onChange={(e) => handleTestChange(index, 'name', e.target.value)}
                              placeholder="Test name"
                            />
                          </div>
                          <div className="col-span-10 sm:col-span-4">
                            <Label htmlFor={`test-urgency-${index}`} className="text-xs mb-1 block">Urgency</Label>
                            <Select
                              value={test.urgency}
                              onValueChange={(value) => handleTestChange(index, 'urgency', value)}
                            >
                              <SelectTrigger id={`test-urgency-${index}`}>
                                <SelectValue placeholder="Select urgency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Routine">Routine</SelectItem>
                                <SelectItem value="Urgent">Urgent</SelectItem>
                                <SelectItem value="STAT">STAT (Immediate)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2 sm:col-span-1 flex items-end justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveTest(index)}
                              className="h-10 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="prescription-notes" className="text-sm font-semibold">Notes</Label>
                    <Textarea
                      id="prescription-notes"
                      value={newPrescription.notes}
                      onChange={(e) => setNewPrescription({ ...newPrescription, notes: e.target.value })}
                      placeholder="Additional instructions or notes for the patient"
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                  <div>
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">Last prescription</h3>
                        <span className={cn("text-sm text-muted-foreground")}>Prescription_{selectedAppointment?.prescription.prescriptionUrl.split('/')[selectedAppointment?.prescription.prescriptionUrl.split('/').length - 1]}</span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedAppointment?.prescription.prescriptionUrl, "_blank")}
                        className="flex items-center gap-1 mr-5"
                      >
                        <FileText className="h-4 w-4" />
                        <span>View</span>
                      </Button>
                    </div>

                  </div>
                  <div>
                    <Label htmlFor="prescription-document" className="text-sm font-semibold">Upload Prescription Document</Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                        >
                          <Paperclip className="h-4 w-4 mr-2" />
                          {prescriptionFile ? 'Change Document' : 'Upload Document (PDF or Image)'}
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          id="prescription-document"
                          accept="image/*,application/pdf"
                          onChange={handlePrescriptionFileChange}
                          className="hidden"
                        />
                        {prescriptionFile && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={handleClearPrescriptionFile}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {prescriptionFile && (
                        <div className="p-3 border rounded-md">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {prescriptionFile.type.startsWith('image/') ? (
                                <Image className="h-5 w-5 text-blue-500" />
                              ) : (
                                <FileText className="h-5 w-5 text-red-500" />
                              )}
                              <span className="text-sm font-medium truncate">{prescriptionFile.name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {(prescriptionFile.size / 1024).toFixed(1)} KB
                            </span>
                          </div>

                          {prescriptionFilePreview && (
                            <div className="mt-3 border rounded overflow-hidden max-h-40">
                              <img
                                src={prescriptionFilePreview || "/placeholder.svg"}
                                alt="Prescription preview"
                                className="w-full h-auto object-contain"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-2">
                <Button variant="outline" onClick={() => setIsPrescriptionDialogOpen(false)}>Cancel</Button>
                <Button
                  onClick={() => handleCreatePrescription(selectedAppointment?.id || "")}
                  disabled={newPrescription.medications.some((med: any) => !med.name || !med.dosage || !med.frequency || !med.duration)}
                >

                  {!isPrescriptionCreating && "Create Prescription"}
                  {isPrescriptionCreating &&
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2" />
                      Creating prescription...
                    </div>
                  }
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add test order dialog */}
          <Dialog open={isTestOrderDialogOpen} onOpenChange={setIsTestOrderDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Order Medical Tests</DialogTitle>
                <DialogDescription>
                  {selectedAppointment ? `Order tests for ${selectedAppointment.patientName}` : 'Order medical tests'}
                </DialogDescription>
              </DialogHeader>
              <div className="overflow-y-auto pr-1">
                <div className="grid gap-6 py-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold">Tests</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddTestToOrder}
                        className="h-8 text-xs"
                      >
                        Add Test
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {newTestOrder.tests.map((test, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-start p-3 rounded-md border">
                          <div className="col-span-12 sm:col-span-7">
                            <Label htmlFor={`order-test-name-${index}`} className="text-xs mb-1 block">Test Name</Label>
                            <Input
                              id={`order-test-name-${index}`}
                              value={test.name}
                              onChange={(e: any) => handleTestOrderChange(index, 'name', e.target.value)}
                              placeholder="Test name"
                            />
                          </div>
                          <div className="col-span-10 sm:col-span-4">
                            <Label htmlFor={`order-test-urgency-${index}`} className="text-xs mb-1 block">Urgency</Label>
                            <Select
                              value={test.urgency}
                              onValueChange={(value: any) => handleTestOrderChange(index, 'urgency', value)}
                            >
                              <SelectTrigger id={`order-test-urgency-${index}`}>
                                <SelectValue placeholder="Select urgency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Routine">Routine</SelectItem>
                                <SelectItem value="Urgent">Urgent</SelectItem>
                                <SelectItem value="STAT">STAT (Immediate)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2 sm:col-span-1 flex items-end justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveTestFromOrder(index)}
                              disabled={newTestOrder.tests.length === 1}
                              className="h-10 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="test-order-notes" className="text-sm font-semibold">Notes</Label>
                    <Textarea
                      id="test-order-notes"
                      value={newTestOrder.notes}
                      onChange={(e) => setNewTestOrder({ ...newTestOrder, notes: e.target.value })}
                      placeholder="Additional instructions for the lab"
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-2">
                <Button variant="outline" onClick={() => setIsTestOrderDialogOpen(false)}>Cancel</Button>
                <Button
                  onClick={handleCreateTestOrder}
                  disabled={newTestOrder.tests.some(test => !test.name)}
                >
                  Order Tests
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Toast Provider at the very end of the component */}
        </div>
      </TooltipProvider>
      <div ref={recaptchaRef}>

      </div>
    </AuroraBackground>
  )
}

