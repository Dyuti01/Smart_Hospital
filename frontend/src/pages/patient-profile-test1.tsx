"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Calendar,
  Clock,
  FileText,
  History,
  Edit,
  ChevronRight,
  Download,
  Camera,
  FileCheck,
  CreditCard,
  ExternalLink,
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

// Mock data
const patientData = {
  id: "P12345",
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  phone: "+1 (555) 123-4567",
  dob: "1985-06-15",
  gender: "Female",
  bloodType: "O+",
  address: "123 Main Street, Apt 4B, New York, NY 10001",
  emergencyContact: "Michael Johnson (Husband) - +1 (555) 987-6543",
  allergies: "Penicillin, Peanuts",
  chronicConditions: "Asthma, Hypertension",
  avatarUrl: "/placeholder.svg?height=96&width=96",
}

const appointments = [
  {
    id: "A001",
    date: "2023-11-15T09:30:00",
    doctor: "Dr. Emily Chen",
    department: "Cardiology",
    status: "completed",
    notes: "Regular checkup, blood pressure slightly elevated. Follow-up in 3 months.",
    location: "Main Hospital, Room 305",
    duration: "30 minutes",
    reason: "Annual cardiac evaluation",
    followUp: "Schedule follow-up in 3 months",
    vitals: {
      bloodPressure: "135/85",
      heartRate: "78 bpm",
      temperature: "98.6°F",
      oxygenSaturation: "98%",
    },
  },
  {
    id: "A002",
    date: "2024-01-20T14:00:00",
    doctor: "Dr. James Wilson",
    department: "Pulmonology",
    status: "completed",
    notes: "Asthma review, adjusted medication dosage.",
    location: "Specialty Clinic, Room 210",
    duration: "45 minutes",
    reason: "Asthma management review",
    followUp: "Return in 6 months for reassessment",
    vitals: {
      bloodPressure: "120/80",
      heartRate: "72 bpm",
      temperature: "98.4°F",
      oxygenSaturation: "97%",
    },
  },
  {
    id: "A003",
    date: "2024-02-28T11:15:00",
    doctor: "Dr. Emily Chen",
    department: "Cardiology",
    status: "cancelled",
    notes: "Patient cancelled due to scheduling conflict.",
    location: "Main Hospital, Room 305",
    duration: "30 minutes",
    reason: "Blood pressure check",
    followUp: "Reschedule at patient's convenience",
    vitals: null,
  },
  {
    id: "A004",
    date: "2024-03-10T10:00:00",
    doctor: "Dr. Sarah Miller",
    department: "General Medicine",
    status: "upcoming",
    notes: "Annual physical examination.",
    location: "Primary Care Center, Room 105",
    duration: "60 minutes",
    reason: "Annual physical examination",
    followUp: "To be determined",
    vitals: null,
  },
]

const testReports = [
  {
    id: "TR001",
    date: "2023-11-15",
    name: "Complete Blood Count (CBC)",
    doctor: "Dr. Emily Chen",
    status: "completed",
    results: "Normal range. Slight elevation in white blood cells.",
    pdfUrl: "/sample-report.pdf", // In a real app, this would be a real PDF URL
  },
  {
    id: "TR002",
    date: "2023-11-15",
    name: "Lipid Profile",
    doctor: "Dr. Emily Chen",
    status: "completed",
    results: "Cholesterol: 210 mg/dL (slightly elevated). LDL: 130 mg/dL (elevated).",
    pdfUrl: "/sample-report.pdf", // In a real app, this would be a real PDF URL
  },
  {
    id: "TR003",
    date: "2024-01-20",
    name: "Pulmonary Function Test",
    doctor: "Dr. James Wilson",
    status: "completed",
    results: "Mild obstruction consistent with asthma. Improved from previous test.",
    pdfUrl: "/sample-report.pdf", // In a real app, this would be a real PDF URL
  },
  {
    id: "TR004",
    date: "2024-03-10",
    name: "Comprehensive Metabolic Panel",
    doctor: "Dr. Sarah Miller",
    status: "pending",
    results: "Awaiting results",
    pdfUrl: null,
  },
]

const medicalHistory = [
  {
    id: "MH001",
    date: "2010-05-10",
    event: "Asthma Diagnosis",
    doctor: "Dr. Robert Brown",
    details: "Initial diagnosis of mild persistent asthma. Started on inhaled corticosteroids.",
  },
  {
    id: "MH002",
    date: "2018-09-22",
    event: "Hypertension Diagnosis",
    doctor: "Dr. Emily Chen",
    details: "Diagnosed with stage 1 hypertension. Started on lifestyle modifications and monitoring.",
  },
  {
    id: "MH003",
    date: "2020-03-15",
    event: "Appendectomy",
    doctor: "Dr. Michael Garcia",
    details: "Laparoscopic appendectomy performed due to acute appendicitis. No complications.",
  },
  {
    id: "MH004",
    date: "2022-11-05",
    event: "Hypertension Medication",
    doctor: "Dr. Emily Chen",
    details: "Started on low-dose ACE inhibitor for blood pressure management.",
  },
]

// Update the prescriptions data model to relate to specific appointments
const prescriptions = [
  {
    id: "P001",
    date: "2023-11-15",
    appointmentId: "A001",
    appointmentDate: "2023-11-15T09:30:00",
    appointmentReason: "Annual cardiac evaluation",
    doctor: "Dr. Emily Chen",
    department: "Cardiology",
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days" },
      { name: "Aspirin", dosage: "81mg", frequency: "Once daily", duration: "30 days" },
    ],
    tests: [
      { name: "Complete Blood Count", urgency: "Routine" },
      { name: "Lipid Profile", urgency: "Routine" },
    ],
    notes: "Continue monitoring blood pressure. Follow up in 3 months.",
    fileType: "pdf",
    fileUrl: "/sample-prescription.pdf", // In a real app, this would be a real PDF URL
  },
  {
    id: "P002",
    date: "2024-01-20",
    appointmentId: "A002",
    appointmentDate: "2024-01-20T14:00:00",
    appointmentReason: "Asthma management review",
    doctor: "Dr. James Wilson",
    department: "Pulmonology",
    medications: [
      { name: "Albuterol Inhaler", dosage: "2 puffs", frequency: "As needed", duration: "As needed" },
      { name: "Fluticasone", dosage: "220mcg", frequency: "Twice daily", duration: "90 days" },
    ],
    tests: [{ name: "Pulmonary Function Test", urgency: "Within 2 weeks" }],
    notes: "Use Albuterol before exercise. Avoid known triggers.",
    fileType: "pdf",
    fileUrl: "/sample-prescription.pdf", // In a real app, this would be a real PDF URL
  },
  {
    id: "P003",
    date: "2023-11-15",
    appointmentId: "A001",
    appointmentDate: "2023-11-15T09:30:00",
    appointmentReason: "Annual cardiac evaluation",
    doctor: "Dr. Emily Chen",
    department: "Cardiology",
    medications: [
      { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily at bedtime", duration: "90 days" },
      { name: "Omega-3 Supplements", dosage: "1000mg", frequency: "Twice daily with meals", duration: "90 days" },
    ],
    tests: [
      { name: "Liver Function Test", urgency: "After 30 days" },
      { name: "Lipid Profile", urgency: "After 90 days" },
    ],
    notes: "Maintain low-fat diet. Increase physical activity to 30 minutes daily.",
    fileType: "image",
    fileUrl: "/sample-prescription.jpg", // In a real app, this would be a real image URL
  },
]

const payments = [
  {
    id: "PAY001",
    date: "2024-03-10",
    amount: 150.0,
    description: "Co-pay for Annual Physical",
    status: "Paid",
  },
  {
    id: "PAY002",
    date: "2024-02-15",
    amount: 75.0,
    description: "Prescription Refill",
    status: "Paid",
  },
  {
    id: "PAY003",
    date: "2024-01-20",
    amount: 200.0,
    description: "Specialist Consultation",
    status: "Pending",
  },
  {
    id: "PAY004",
    date: "2023-12-05",
    amount: 500.0,
    description: "MRI Scan",
    status: "Paid",
  },
]

export default function PatientProfile() {
  const [patient, setPatient] = useState(patientData)
  const [editFormData, setEditFormData] = useState(patientData)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<(typeof appointments)[0] | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setPatient(editFormData)
    setIsEditing(false)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setEditFormData((prev) => ({ ...prev, avatarUrl: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleViewReport = (pdfUrl: string) => {
    // In a real app, this would open the PDF in a new tab
    window.open(pdfUrl, "_blank")
  }

  const handleDownloadReport = (pdfUrl: string, reportName: string) => {
    // In a real app, this would trigger a download
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = `${reportName.replace(/\s+/g, "_")}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "upcoming":
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <CardTitle>Patient Profile</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
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
                        Update your personal information. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 overflow-y-auto pr-1">
                      <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-24 w-24 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          <AvatarImage src={editFormData.avatarUrl} alt={editFormData.name} />
                          <AvatarFallback>
                            {editFormData.name
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
                        <Label htmlFor="dob" className="text-right">
                          Date of Birth
                        </Label>
                        <Input
                          id="dob"
                          name="dob"
                          type="date"
                          value={editFormData.dob}
                          onChange={handleInputChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="gender" className="text-right">
                          Gender
                        </Label>
                        <Select
                          value={editFormData.gender}
                          onValueChange={(value) => handleSelectChange("gender", value)}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bloodType" className="text-right">
                          Blood Type
                        </Label>
                        <Select
                          value={editFormData.bloodType}
                          onValueChange={(value) => handleSelectChange("bloodType", value)}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                            <SelectItem value="Unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                          Address
                        </Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={editFormData.address}
                          onChange={handleInputChange}
                          className="col-span-3"
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="emergencyContact" className="text-right">
                          Emergency Contact
                        </Label>
                        <Input
                          id="emergencyContact"
                          name="emergencyContact"
                          value={editFormData.emergencyContact}
                          onChange={handleInputChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="allergies" className="text-right">
                          Allergies
                        </Label>
                        <Textarea
                          id="allergies"
                          name="allergies"
                          value={editFormData.allergies}
                          onChange={handleInputChange}
                          className="col-span-3"
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="chronicConditions" className="text-right">
                          Chronic Conditions
                        </Label>
                        <Textarea
                          id="chronicConditions"
                          name="chronicConditions"
                          value={editFormData.chronicConditions}
                          onChange={handleInputChange}
                          className="col-span-3"
                          rows={2}
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-2">
                      <Button type="submit" onClick={handleSave}>
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
                  <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                  <AvatarFallback>
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{patient.name}</h2>
                <p className="text-muted-foreground">Patient ID: {patient.id}</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Email</span>
                  <span>{patient.email}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Phone</span>
                  <span>{patient.phone}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Date of Birth</span>
                  <span>{new Date(patient.dob).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Gender</span>
                  <span>{patient.gender}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Blood Type</span>
                  <span>{patient.bloodType}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Address</span>
                  <span className="text-sm">{patient.address}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Emergency Contact</span>
                  <span className="text-sm">{patient.emergencyContact}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Allergies</span>
                  <span className="text-sm">{patient.allergies || "None"}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Chronic Conditions</span>
                  <span className="text-sm">{patient.chronicConditions || "None"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-2/3">
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="appointments" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Appointments</span>
              </TabsTrigger>
              <TabsTrigger value="test-reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Test Reports</span>
              </TabsTrigger>
              <TabsTrigger value="medical-history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span>Medical History</span>
              </TabsTrigger>
              <TabsTrigger value="prescriptions" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                <span>Prescriptions</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Payments</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appointments</CardTitle>
                  <CardDescription>View your past and upcoming appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <Card key={appointment.id} className="overflow-hidden">
                        <div className={`h-2 ${getStatusColor(appointment.status)}`} />
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div>
                              <CardTitle className="text-lg">{appointment.doctor}</CardTitle>
                              <CardDescription>{appointment.department}</CardDescription>
                            </div>
                            <Badge variant="outline" className={getStatusColor(appointment.status)}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{format(new Date(appointment.date), "MMMM d, yyyy")}</span>
                            <Clock className="h-4 w-4 ml-2 text-muted-foreground" />
                            <span>{format(new Date(appointment.date), "h:mm a")}</span>
                          </div>
                          <p className="text-sm">{appointment.notes}</p>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-auto"
                                onClick={() => setSelectedAppointment(appointment)}
                              >
                                View Details
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px]">
                              <DialogHeader>
                                <DialogTitle>Appointment Details</DialogTitle>
                                <DialogDescription>
                                  {selectedAppointment?.doctor} - {selectedAppointment?.department}
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
                                    <h3 className="text-sm font-medium">Location</h3>
                                    <p className="text-sm">{selectedAppointment.location}</p>
                                  </div>

                                  <div className="grid gap-2">
                                    <h3 className="text-sm font-medium">Duration</h3>
                                    <p className="text-sm">{selectedAppointment.duration}</p>
                                  </div>

                                  <div className="grid gap-2">
                                    <h3 className="text-sm font-medium">Reason for Visit</h3>
                                    <p className="text-sm">{selectedAppointment.reason}</p>
                                  </div>

                                  <div className="grid gap-2">
                                    <h3 className="text-sm font-medium">Notes</h3>
                                    <p className="text-sm">{selectedAppointment.notes}</p>
                                  </div>

                                  {selectedAppointment.vitals && (
                                    <div className="grid gap-2">
                                      <h3 className="text-sm font-medium">Vitals</h3>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>Blood Pressure: {selectedAppointment.vitals.bloodPressure}</div>
                                        <div>Heart Rate: {selectedAppointment.vitals.heartRate}</div>
                                        <div>Temperature: {selectedAppointment.vitals.temperature}</div>
                                        <div>O2 Saturation: {selectedAppointment.vitals.oxygenSaturation}</div>
                                      </div>
                                    </div>
                                  )}

                                  <div className="grid gap-2">
                                    <h3 className="text-sm font-medium">Follow-up</h3>
                                    <p className="text-sm">{selectedAppointment.followUp}</p>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                {selectedAppointment?.status === "upcoming" && (
                                  <Button variant="outline" className="mr-auto">
                                    Reschedule
                                  </Button>
                                )}
                                <Button>Close</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Schedule New Appointment</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="test-reports" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Reports</CardTitle>
                  <CardDescription>View your laboratory and diagnostic test results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead>
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Test Name</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Doctor</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {testReports.map((report) => (
                            <tr
                              key={report.id}
                              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            >
                              <td className="p-4 align-middle">{format(new Date(report.date), "MMM d, yyyy")}</td>
                              <td className="p-4 align-middle font-medium">{report.name}</td>
                              <td className="p-4 align-middle">{report.doctor}</td>
                              <td className="p-4 align-middle">
                                <Badge variant="outline" className={getStatusColor(report.status)}>
                                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                </Badge>
                              </td>
                              <td className="p-4 align-middle">
                                <div className="flex gap-2">
                                  {report.status === "completed" && (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => report.pdfUrl && handleViewReport(report.pdfUrl)}
                                        disabled={!report.pdfUrl}
                                      >
                                        <ExternalLink className="h-3 w-3 mr-1" />
                                        View
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() =>
                                          report.pdfUrl && handleDownloadReport(report.pdfUrl, report.name)
                                        }
                                        disabled={!report.pdfUrl}
                                      >
                                        <Download className="h-3 w-3" />
                                        <span>Download</span>
                                      </Button>
                                    </>
                                  )}
                                  {report.status === "pending" && (
                                    <Button variant="outline" size="sm" disabled>
                                      Pending
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical-history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Medical History</CardTitle>
                  <CardDescription>Your comprehensive medical history timeline</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-6 border-l">
                    {medicalHistory.map((event, index) => (
                      <div key={event.id} className={`relative pb-8 ${index === medicalHistory.length - 1 ? "" : ""}`}>
                        <div className="absolute -left-[25px] h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <div className="h-5 w-5 rounded-full bg-primary" />
                        </div>
                        <div className="ml-6">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                            <h3 className="text-lg font-semibold">{event.event}</h3>
                            <time className="text-sm text-muted-foreground">
                              {format(new Date(event.date), "MMMM d, yyyy")}
                            </time>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">Doctor: {event.doctor}</p>
                          <p className="text-sm">{event.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Update the prescription card rendering to show appointment information */}
            <TabsContent value="prescriptions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Prescriptions</CardTitle>
                  <CardDescription>View your current and past prescriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                      <Card key={prescription.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{prescription.doctor}</CardTitle>
                              <CardDescription>{prescription.department}</CardDescription>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-50">
                              {new Date(prescription.date).toLocaleDateString()}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="p-3 bg-muted/50 rounded-md mb-4">
                              <h4 className="text-sm font-medium mb-1">Appointment Information</h4>
                              <p className="text-sm">
                                <span className="font-medium">Date:</span>{" "}
                                {format(new Date(prescription.appointmentDate), "MMMM d, yyyy 'at' h:mm a")}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Reason:</span> {prescription.appointmentReason}
                              </p>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">Medications</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {prescription.medications.map((med, idx) => (
                                  <div key={idx} className="flex items-start space-x-2 p-2 rounded-md bg-muted/50">
                                    <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      {idx + 1}
                                    </div>
                                    <div>
                                      <p className="font-medium">{med.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {med.dosage} • {med.frequency} • {med.duration}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {prescription.tests && prescription.tests.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-2">Tests Prescribed</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {prescription.tests.map((test, idx) => (
                                    <div key={idx} className="flex items-start space-x-2 p-2 rounded-md bg-muted/50">
                                      <div className="h-5 w-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {idx + 1}
                                      </div>
                                      <div>
                                        <p className="font-medium">{test.name}</p>
                                        <p className="text-sm text-muted-foreground">{test.urgency}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {prescription.notes && (
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-2">Doctor's Notes</h4>
                                <p className="text-sm p-2 rounded-md bg-muted/50">{prescription.notes}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <div className="text-sm text-muted-foreground">
                            Prescribed on {new Date(prescription.date).toLocaleDateString()}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(prescription.fileUrl, "_blank")}
                              className="flex items-center gap-1"
                            >
                              <FileText className="h-4 w-4" />
                              <span>View</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const link = document.createElement("a")
                                link.href = prescription.fileUrl
                                link.download = `Prescription_${prescription.id}.${prescription.fileType}`
                                document.body.appendChild(link)
                                link.click()
                                document.body.removeChild(link)
                              }}
                              className="flex items-center gap-1"
                            >
                              <Download className="h-4 w-4" />
                              <span>Download</span>
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payments</CardTitle>
                  <CardDescription>View your payment history and outstanding balances</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead>
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment) => (
                            <tr
                              key={payment.id}
                              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            >
                              <td className="p-4 align-middle">{format(new Date(payment.date), "MMM d, yyyy")}</td>
                              <td className="p-4 align-middle">{payment.description}</td>
                              <td className="p-4 align-middle">${payment.amount.toFixed(2)}</td>
                              <td className="p-4 align-middle">
                                <Badge variant="outline" className={getStatusColor(payment.status)}>
                                  {payment.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Make a Payment</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

