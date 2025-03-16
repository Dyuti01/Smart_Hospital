"use client"

import type React from "react"

import { useState, useRef } from "react"
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
import { Paperclip, FileText, Image } from "lucide-react"

// Mock data
const doctorData = {
  id: "D5678",
  name: "Dr. Emily Chen",
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
  bio: "Dr. Emily Chen is a board-certified cardiologist specializing in preventive cardiology and heart disease management. With over 10 years of experience, she is dedicated to providing comprehensive cardiac care using the latest evidence-based approaches.",
  avatarUrl: "/placeholder.svg?height=96&width=96",
  availability: {
    monday: [
      { start: "09:00", end: "12:00" },
      { start: "13:00", end: "17:00" },
    ],
    tuesday: [
      { start: "09:00", end: "12:00" },
      { start: "13:00", end: "17:00" },
    ],
    wednesday: [{ start: "09:00", end: "12:00" }],
    thursday: [
      { start: "09:00", end: "12:00" },
      { start: "13:00", end: "17:00" },
    ],
    friday: [
      { start: "09:00", end: "12:00" },
      { start: "13:00", end: "16:00" },
    ],
    saturday: [],
    sunday: [],
  },
}

const appointments = [
  {
    id: "A001",
    date: "2024-03-15T09:30:00",
    patientName: "Sarah Johnson",
    patientId: "P12345",
    status: "upcoming",
    reason: "Regular checkup",
    notes: "",
    attended: null,
  },
  {
    id: "A002",
    date: "2024-03-15T10:30:00",
    patientName: "Michael Brown",
    patientId: "P23456",
    status: "upcoming",
    reason: "Blood pressure follow-up",
    notes: "",
    attended: null,
  },
  {
    id: "A003",
    date: "2024-03-14T14:00:00",
    patientName: "Jennifer Davis",
    patientId: "P34567",
    status: "completed",
    reason: "Chest pain evaluation",
    notes: "Patient reported occasional chest pain during exercise. ECG normal. Recommended stress test.",
    attended: true,
  },
  {
    id: "A004",
    date: "2024-03-14T15:00:00",
    patientName: "Robert Wilson",
    patientId: "P45678",
    status: "completed",
    reason: "Post-surgery follow-up",
    notes: "Recovery progressing well. Incision healing properly. Cleared for light exercise.",
    attended: true,
  },
  {
    id: "A005",
    date: "2024-03-14T16:00:00",
    patientName: "Lisa Martinez",
    patientId: "P56789",
    status: "completed",
    reason: "Medication review",
    notes: "Adjusted dosage of beta blocker. Patient reporting improved symptoms.",
    attended: false,
  },
]

const patients = [
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

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState(doctorData)
  const [editFormData, setEditFormData] = useState(doctorData)
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointments[0] | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [appointmentFilter, setAppointmentFilter] = useState("all")

  // Add this after the existing useState declarations
  const { toast } = useToast()
  const [isEditingSchedule, setIsEditingSchedule] = useState(false)
  const [scheduleData, setScheduleData] = useState(doctor.availability)
  const [isAddingPrescription, setIsAddingPrescription] = useState(false)
  const [isOrderingTests, setIsOrderingTests] = useState(false)
  const [selectedPatientForAction, setSelectedPatientForAction] = useState<typeof patients[0] | null>(null)
  const [appointmentNotes, setAppointmentNotes] = useState("")

  // Add state for prescription and test ordering
  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false)
  const [isTestOrderDialogOpen, setIsTestOrderDialogOpen] = useState(false)
  const [newPrescription, setNewPrescription] = useState<any>({
    medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
    tests: [],
    notes: ""
  })
  const [newTestOrder, setNewTestOrder] = useState({
    tests: [{ name: "", urgency: "Routine" }],
    notes: ""
  })

  // First, add a new state for the prescription file
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null)
  const [prescriptionFilePreview, setPrescriptionFilePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setDoctor(editFormData)
  }

  // Add these handler functions before the return statement

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

  // Add a function to handle file selection
  const handlePrescriptionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPrescriptionFile(file)
    
    // Create preview for images
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

  // Update the handleCreatePrescription function to include the file
  const handleCreatePrescription = () => {
    // In a real app, this would save the prescription to the database
    // and upload the file to a storage service
    toast({
      title: "Prescription created",
      description: `Prescription has been created for ${selectedAppointment?.patientName}${prescriptionFile ? ' with attached document' : ''}`,
      variant: "default",
    })
    setIsPrescriptionDialogOpen(false)
    setPrescriptionFile(null)
    setPrescriptionFilePreview(null)
    setNewPrescription({
      medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
      tests: [],
      notes: ""
    })
  }

  const handleSaveProfile = () => {
    setDoctor(editFormData)
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
      variant: "default",
    })
  }

  const handleEditSchedule = () => {
    setIsEditingSchedule(true)
  }

  const handleSaveSchedule = () => {
    setIsEditingSchedule(false)
    toast({
      title: "Schedule updated",
      description: "Your availability schedule has been updated successfully.",
      variant: "default",
    })
  }

  const handleScheduleChange = (day: string, index: number, field: 'start' | 'end', value: string) => {
    setScheduleData(prev => {
      const newSchedule:any = { ...prev }
      const daySlots = [...(newSchedule[day as keyof typeof newSchedule] || [])]
      daySlots[index] = { ...daySlots[index], [field]: value }
      newSchedule[day as keyof typeof newSchedule] = daySlots
      return newSchedule
    })
  }

  const handleAddTimeSlot = (day: string) => {
    setScheduleData(prev => {
      const newSchedule:any = { ...prev }
      const daySlots = [...(newSchedule[day as keyof typeof newSchedule] || [])]
      daySlots.push({ start: "09:00", end: "10:00" })
      newSchedule[day as keyof typeof newSchedule] = daySlots
      return newSchedule
    })
  }

  const handleRemoveTimeSlot = (day: string, index: number) => {
    setScheduleData(prev => {
      const newSchedule:any = { ...prev }
      const daySlots = [...(newSchedule[day as keyof typeof newSchedule] || [])]
      daySlots.splice(index, 1)
      newSchedule[day as keyof typeof newSchedule] = daySlots
      return newSchedule
    })
  }

  const handleAttendanceChange = (appointmentId: string, attended: boolean) => {
    // In a real app, this would update the database
    toast({
      title: attended ? "Marked as attended" : "Marked as missed",
      description: `Appointment has been marked as ${attended ? "attended" : "missed"}.`,
      variant: attended ? "default" : "destructive",
    })
  }

  const handleSaveNotes = () => {
    if (selectedAppointment) {
      toast({
        title: "Notes saved",
        description: "Appointment notes have been saved successfully.",
        variant: "default",
      })
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

  const handleCreateTestOrder = () => {
    // In a real app, this would save the test order to the database
    toast({
      title: "Test order created",
      description: `Test order has been created for ${selectedAppointment?.patientName}`,
      variant: "default",
    })
    setIsTestOrderDialogOpen(false)
    setNewTestOrder({
      tests: [{ name: "", urgency: "Routine" }],
      notes: ""
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
    if (appointmentFilter === "upcoming" && appointment.status !== "upcoming") return false
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto py-6 max-w-7xl">
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
                    <Button variant="outline" size="icon">
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
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={editFormData.avatarUrl} alt={editFormData.name} />
                          <AvatarFallback>
                            {editFormData.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                          <Camera className="h-4 w-4 mr-2" />
                          Change Photo
                        </Button>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={editFormData.name}
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
                      <Button type="submit" onClick={handleSaveProfile}>
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={doctor.avatarUrl} alt={doctor.name} />
                  <AvatarFallback>
                    {doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{doctor.name}</h2>
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
                {Object.entries(scheduleData).map(([day, slots]) => (
                  <div key={day} className="flex justify-between items-center">
                    <div className="font-medium capitalize">{day}</div>
                    <div>
                      {slots.length > 0 ? (
                        slots.map((slot, index) => (
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
                    {Object.entries(scheduleData).map(([day, slots]) => (
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
                            {slots.map((slot, index) => (
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
                    <Button onClick={handleSaveSchedule}>Save Schedule</Button>
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
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="attended">Attended</SelectItem>
                          <SelectItem value="missed">Missed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                      <Card key={appointment.id} className="overflow-hidden">
                        <div className={`h-2 ${getStatusColor(appointment.status)}`} />
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div>
                              <CardTitle className="text-lg">{appointment.patientName}</CardTitle>
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
                            {appointment.status === "upcoming" && (
                              <div className="flex gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() => handleAttendanceChange(appointment.id, true)}
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                        Mark Attended
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
                                        onClick={() => handleAttendanceChange(appointment.id, false)}
                                      >
                                        <XCircle className="h-4 w-4" />
                                        Mark Missed
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
                              <Button variant="ghost" size="sm" onClick={() => setSelectedAppointment(appointment)}>
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
                                    <h3 className="text-sm font-medium">Reason for Visit</h3>
                                    <p className="text-sm">{selectedAppointment.reason}</p>
                                  </div>

                                  <div className="grid gap-2">
                                    <h3 className="text-sm font-medium">Notes</h3>
                                    <Textarea
                                      value={selectedAppointment?.notes || ""}
                                      placeholder="Add appointment notes here..."
                                      className="min-h-[100px]"
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
                                    <h3 className="text-sm font-medium">Attendance</h3>
                                    <div className="flex gap-2">
                                      <Button
                                        variant={selectedAppointment.attended === true ? "default" : "outline"}
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() => handleAttendanceChange(selectedAppointment.id, true)}
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                        Attended
                                      </Button>
                                      <Button
                                        variant={selectedAppointment.attended === false ? "default" : "outline"}
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() => handleAttendanceChange(selectedAppointment.id, false)}
                                      >
                                        <XCircle className="h-4 w-4" />
                                        Missed
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="grid gap-2">
                                    <h3 className="text-sm font-medium">Actions</h3>
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
                                <Button onClick={handleSaveNotes}>Save Notes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleScheduleNewAppointment}>Schedule New Appointment</Button>
                </CardFooter>
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
            <h3 className="text-sm font-medium">Medications</h3>
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
            {newPrescription.medications.map((med:any, index:any) => (
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
            <h3 className="text-sm font-medium">Tests</h3>
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
            {newPrescription.tests.map((test:any, index:any) => (
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
          <Label htmlFor="prescription-notes" className="text-sm font-medium">Notes</Label>
          <Textarea 
            id="prescription-notes"
            value={newPrescription.notes}
            onChange={(e) => setNewPrescription({...newPrescription, notes: e.target.value})}
            placeholder="Additional instructions or notes for the patient"
            className="mt-2"
            rows={3}
          />
        </div>

        
        <div>
          <Label htmlFor="prescription-document" className="text-sm font-medium">Upload Prescription Document</Label>
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
      <Button variant="outline" onClick={() => {
        setIsPrescriptionDialogOpen(false);
        setPrescriptionFile(null);
        setPrescriptionFilePreview(null);
      }}>Cancel</Button>
      <Button 
        onClick={handleCreatePrescription}
        disabled={newPrescription.medications.some((med:any) => !med.name || !med.dosage || !med.frequency || !med.duration)}
      >
        Create Prescription
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      
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
                  <h3 className="text-sm font-medium">Tests</h3>
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
                          onChange={(e) => handleTestOrderChange(index, 'name', e.target.value)}
                          placeholder="Test name"
                        />
                      </div>
                      <div className="col-span-10 sm:col-span-4">
                        <Label htmlFor={`order-test-urgency-${index}`} className="text-xs mb-1 block">Urgency</Label>
                        <Select 
                          value={test.urgency}
                          onValueChange={(value) => handleTestOrderChange(index, 'urgency', value)}
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
                <Label htmlFor="test-order-notes" className="text-sm font-medium">Notes</Label>
                <Textarea 
                  id="test-order-notes"
                  value={newTestOrder.notes}
                  onChange={(e) => setNewTestOrder({...newTestOrder, notes: e.target.value})}
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
    </div>
    </TooltipProvider>
  );
}

