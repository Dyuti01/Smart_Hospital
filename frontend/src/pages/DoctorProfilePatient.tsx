import type React from "react"
import { useEffect, useState } from "react"
import { format, addDays, isBefore, isAfter } from "date-fns"
import { Award, GraduationCap, Stethoscope, MapPin, Mail, Phone, CheckCircle, Star, Heart, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/patientProfile/avatar"
import { Button } from "../ui/patientProfile/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/patientProfile/card"
import { Badge } from "../ui/patientProfile/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/patientProfile/tabs"
import { Calendar } from "../ui/patientProfile/calendar"
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
import { Textarea } from "../ui/patientProfile/textarea"
import { cn } from "../lib/utils"
import { AceternityNav } from "../components/AceternaityNav"
import { BACKEND_URL, FRONTEND_URL, PAYMENT_KEY_ID } from "../config"
import axios from "axios"
import { DoctorPublicProfileShimmer } from "./shimmer/doctor-public-profile-shimmer"
import { UseGetUserData } from "../hooks/data"
import { useParams } from "react-router"
import { toast } from "../ui/patientProfile/use-toast"
import { Close } from "@radix-ui/react-dialog"

// Mock data
const doctor = {
  id: "D5678",
  firstName: "Dr. Emily",
  lastName:"Chen",
  title: "Cardiologist",
  rating: 4.9,
  reviewCount: 127,
  experience: "10+ years",
  email: "emily.chen@smartclinic.com",
  phone: "+1 (555) 234-5678",
  location: "Smart Clinic Medical Center, 123 Health St, New York, NY",
  bookingFee: 150,
  bio:
    "Dr. Emily Chen is a board-certified cardiologist specializing in preventive cardiology and heart disease management. With over 10 years of experience, she is dedicated to providing comprehensive cardiac care using the latest evidence-based approaches.",
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
  certifications: [
    "American Board of Internal Medicine",
    "American Board of Cardiology",
    "Advanced Cardiac Life Support (ACLS)",
  ],
  specializations: ["Preventive Cardiology", "Heart Disease Management", "Cardiac Rehabilitation", "Echocardiography"],
  languages: ["English", "Mandarin", "Spanish"],
  avatarUrl: "/placeholder.svg?height=300&width=300",
  availability: {
    monday: [
      { start: "09:00", end: "10:00" },
      { start: "10:00", end: "11:00" },
      { start: "11:00", end: "12:00" },
      { start: "13:00", end: "14:00" },
      { start: "14:00", end: "15:00" },
      { start: "15:00", end: "16:00" },
      { start: "16:00", end: "17:00" },
    ],
    tuesday: [
      { start: "09:00", end: "10:00" },
      { start: "10:00", end: "11:00" },
      { start: "11:00", end: "12:00" },
      { start: "13:00", end: "14:00" },
      { start: "14:00", end: "15:00" },
      { start: "15:00", end: "16:00" },
      { start: "16:00", end: "17:00" },
    ],
    wednesday: [
      { start: "09:00", end: "10:00" },
      { start: "10:00", end: "11:00" },
      { start: "11:00", end: "12:00" },
    ],
    thursday: [
      { start: "09:00", end: "10:00" },
      { start: "10:00", end: "11:00" },
      { start: "11:00", end: "12:00" },
      { start: "13:00", end: "14:00" },
      { start: "14:00", end: "15:00" },
      { start: "15:00", end: "16:00" },
      { start: "16:00", end: "17:00" },
    ],
    friday: [
      { start: "09:00", end: "10:00" },
      { start: "10:00", end: "11:00" },
      { start: "11:00", end: "12:00" },
      { start: "13:00", end: "14:00" },
      { start: "14:00", end: "15:00" },
      { start: "15:00", end: "16:00" },
    ],
    saturday: [],
    sunday: [],
  },
}

// Mock booked slots (in a real app, this would come from the backend)
const bookedSlots = [
  { date: "2024-03-15", time: "10:00" },
  { date: "2024-03-15", time: "14:00" },
  { date: "2024-03-16", time: "11:00" },
  { date: "2024-03-17", time: "09:00" },
]

type TimeSlot = {
  start: string
  end: string
}

export default function DoctorPublicProfile() {
  const [doctorData, setDoctorData] = useState(doctor)
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(Date.now()), 2))
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [bookingFormData, setBookingFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: ""
  })

  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false)

  const [isPaying, setIsPaying] = useState(false);

  const [isLoading, setIsLoading] = useState(true)
  const {doctorId} = useParams()

  UseGetUserData(setDoctorData, setIsLoading, "DoctorPublic", ()=>{}, ()=>{}, doctorId);
  if (isLoading){
    return <DoctorPublicProfileShimmer/>
  }

  // Calculate the min and max dates for booking (1-3 days from now)
  const minDate = addDays(new Date(), 1)
  const maxDate = addDays(new Date(), 5)

  // Get day of week from selected date
  const getDayOfWeek = (date: Date | undefined) => {
    if (!date) return "monday"
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    return days[date.getDay()]
  }

  // Get available time slots for selected date
  const getAvailableTimeSlots = (date: Date | undefined) => {
    if (!date) return []

    const dayOfWeek = getDayOfWeek(date)
    const daySlots = doctorData.availability[dayOfWeek as keyof typeof doctorData.availability] || []

    // Filter out booked slots
    return daySlots.filter((slot) => {
      const dateStr = format(date, "yyyy-MM-dd")
      return !bookedSlots.some((bookedSlot) => bookedSlot.date === dateStr && bookedSlot.time === slot.start)
    })
  }

  const availableTimeSlots = getAvailableTimeSlots(date)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBookingFormData((prev) => ({ ...prev, [name]: value }))
  }

  function loadScript(src: string) {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const pay = async (amount: number) => {
    try{
    setIsPaying(true);
    const customerId = localStorage.getItem("userId") // patientId
    const data = {
      amount: amount * 100,
      currency: "INR",
      customerId: customerId,
      appointmentDetails: {
        patientId: customerId,
        doctorId: doctorId,
        patientPersonName: bookingFormData.name||"",
        patientPersonPhone: bookingFormData.phone||"",
        patientPersonEmail: bookingFormData.email||"",
        // date: date ? format(date, "yyyy-MM-dd") : "",
        date: date,
        timeSlot: selectedTimeSlot,
        patient: bookingFormData,
        status: "SCHEDULED",
      }
    }

    // const config = {
    //   method: "post",
    //   maxBodyLength: Infinity,
    //   url: `${BACKEND_URL}/api/v1/razorpay/initiatePayment`,
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   data: data
    // }

    const initiatePayment = await axios.post(`${BACKEND_URL}/api/v1/razorpay/initiatePayment`, data, { withCredentials: true })

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
    if (!res) {
      alert("Some error at razorpay screen loading")
      return;
    }
    //   const data = await axios.post(`${BACKEND_URL}/razorpay`)
    // Get the orderId

    //   let a = await initiate(amount, params.username, paymentform)
    const { order, customerInfo }: any = initiatePayment.data;
    var options = {
      "key": PAYMENT_KEY_ID, // Enter the Key ID generated from the Dashboard
      "amount": amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": "SmartClinic", //your business name
      "description": "Test Transaction",
      "image": "/logo.png",
      "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "callback_url": `${BACKEND_URL}/api/v1/razorpay/isDonePayment`,
      // "callback_url": `${FRONTEND_URL}/paymentSuccess`,
      "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
        "name": customerInfo.customerName, //your customer's name
        "email": customerInfo.email,
        "contact": customerInfo.phone //Provide the customer's phone number for better conversion rates 
      },
      "notes": {
        "address": "Razorpay Corporate Office"
      },
      "theme": {
        "color": "#3399cc"
      }
    };
    setIsPaying(false);
    setIsBookingDialogOpen(false)

    //@ts-ignore
    var paymentObject = new window.Razorpay(options);
    paymentObject.open();

    return order.id;
  }
  catch(err){
    toast({
      title: "Not registered or logged in",
      description: `${err}`,
      variant: "destructive",
      duration: 5000
    })

    setIsPaying(false);
  }
  }

  const handleBookAppointment = () => {
    // In a real app, this would send the booking data to the backend
    console.log("Booking appointment:", {
      doctor: doctorData.id,
      // date: date ? format(date, "yyyy-MM-dd") : "",
      date: date,
      timeSlot: selectedTimeSlot,
      patient: bookingFormData,
    })
    const orderId = pay(150);
    // axios.post(`${BACKEND_URL}/api/v1/patient/isPaymentDone`, orderId, {withCredentials:true}).then(()=>setIsBookingConfirmed(true))
  }

  const resetBookingForm = () => {
    setSelectedTimeSlot(null)
    setBookingFormData({
      name: "",
      email: "",
      phone: "",
      reason: ""
    })
    setIsBookingConfirmed(false)
    setIsBookingDialogOpen(false)
  }



  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <AceternityNav />
      {/* Hero section with doctor info */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white border rounded-b-3xl">
        {/* <div className="bg-gradient-to-r from-[#dceffe] to-[#f5f2fc] text-white"> */}
        <div className="container mx-auto pt-28 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="rounded-full border-4 border-white shadow-xl overflow-hidden h-48 w-48 md:h-64 md:w-64">
                <Avatar className="h-full w-full">
                  <AvatarImage src={doctorData.avatarUrl} alt={doctorData.firstName+" "+doctorData.lastName} />
                  <AvatarFallback className="text-4xl">
                    {(doctorData.firstName+" "+doctorData.lastName)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <Badge className="absolute bottom-3 right-3 bg-green-500 text-white border-white border-2 px-3 py-1.5 rounded-full">
                <CheckCircle className="h-4 w-4 mr-1" />
                Verified
              </Badge>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold">{doctorData.firstName+" "+doctorData.lastName}</h1>
              <p className="text-xl mt-2 text-cyan-100">{doctorData.title}</p>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-4">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(doctorData.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-semibold">{doctorData.rating}</span>
                  <span className="ml-1 text-cyan-100">({doctorData.reviewCount} reviews)</span>
                </div>

                <Badge className="bg-cyan-700 hover:bg-cyan-700 text-white">
                  <Stethoscope className="h-3.5 w-3.5 mr-1" />
                  {doctorData.experience} experience
                </Badge>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
                <Button className="bg-white text-cyan-700 hover:bg-cyan-50">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </Button>
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-cyan-700">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-cyan-700">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <div className="mt-8 md:mt-0 md:ml-auto">
              <Card className="bg-white text-cyan-900 shadow-lg border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-center text-cyan-800">Consultation Fee</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-2">
                  <p className="text-3xl font-bold text-cyan-700">₹{doctorData.bookingFee}</p>
                  <p className="text-sm text-gray-500">Per appointment</p>
                </CardContent>
                <CardFooter>
                  <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700">
                        Book Appointment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-white">
                      {/* {!isBookingConfirmed ? (
                        <> */}
                          <DialogHeader>
                            <DialogTitle>Book an Appointment</DialogTitle>
                            <DialogDescription>Schedule your appointment with {doctorData.firstName+" "+doctorData.lastName}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="name"
                                name="name"
                                value={bookingFormData.name}
                                onChange={handleInputChange}
                                className="col-span-3"
                                required
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
                                value={bookingFormData.email}
                                onChange={handleInputChange}
                                className="col-span-3"
                                placeholder="Optional, if not have"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="phone" className="text-right">
                                Phone
                              </Label>
                              <Input
                                id="phone"
                                name="phone"
                                value={bookingFormData.phone}
                                onChange={handleInputChange}
                                className="col-span-3"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="reason" className="text-right">
                                Reason
                              </Label>
                              <Textarea
                                id="reason"
                                name="reason"
                                value={bookingFormData.reason}
                                onChange={handleInputChange}
                                className="col-span-3"
                                rows={3}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Date</Label>
                              <div className="col-span-3 font-medium">
                                {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Time</Label>
                              <div className="col-span-3 font-medium">
                                {selectedTimeSlot
                                  ? `${selectedTimeSlot.start} - ${selectedTimeSlot.end}`
                                  : "Select a time slot"}
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Fee</Label>
                              <div className="col-span-3 font-medium text-cyan-700">₹{doctorData.bookingFee}</div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="submit"
                              onClick={handleBookAppointment}
                              disabled={
                                isPaying||
                                !selectedTimeSlot ||
                                !bookingFormData.name ||
                                (!bookingFormData.email &&
                                  !bookingFormData.phone)
                              }
                              className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
                            >
                              
                              {!isPaying && "Confirm Booking and Pay"}
                        {isPaying &&
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Opening payment window...
                          </div>
                          }
                            </Button>
                          </DialogFooter>
                        {/* </> */}
                      {/* ) : ( */}
                        {/* // <> */}
                        {/* //   <DialogHeader>
                        //     <DialogTitle className="text-center text-green-600">Booking Confirmed!</DialogTitle>
                        //   </DialogHeader>
                        //   <div className="py-6 flex flex-col items-center justify-center">
                        //     <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        //       <CheckCircle className="h-8 w-8 text-green-600" />
                        //     </div>
                        //     <p className="text-center mb-2">
                        //       Your appointment with {doctorData.firstName+" "+doctorData.lastName} has been scheduled for:
                        //     </p>
                        //     <p className="text-lg font-bold text-center mb-1">
                        //       {date ? format(date, "MMMM d, yyyy") : ""}
                        //     </p>
                        //     <p className="text-lg font-bold text-center mb-4">
                        //       {selectedTimeSlot ? `${selectedTimeSlot.start} - ${selectedTimeSlot.end}` : ""}
                        //     </p>
                        //     <p className="text-sm text-gray-500 text-center">
                        //       A confirmation has been sent to your email address.
                        //     </p>
                        //   </div>
                        //   <DialogFooter>
                        //     <Button
                        //       onClick={resetBookingForm}
                        //       className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
                        //     >
                        //       Close
                        //     </Button>
                        //   </DialogFooter>
                        // </> */}
                      {/* // )} */}
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Doctor info */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="bio" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="bio" className="text-sm sm:text-base">
                  About
                </TabsTrigger>
                <TabsTrigger value="experience" className="text-sm sm:text-base">
                  Experience
                </TabsTrigger>
                <TabsTrigger value="reviews" className="text-sm sm:text-base">
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="location" className="text-sm sm:text-base">
                  Location
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bio">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>About me</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">{doctorData.bio}</p>

                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-cyan-800">Specializations</h3>
                      <div className="flex flex-wrap gap-2">
                        {doctorData.specializations.map((specialization, index) => (
                          <Badge key={index} variant="secondary" className="bg-cyan-50 text-cyan-700 hover:bg-cyan-100">
                            {specialization}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-cyan-800">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {doctorData.languages.map((language, index) => (
                          <Badge key={index} variant="outline" className="bg-transparent">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Education & Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div>
                      <h3 className="font-semibold text-lg mb-4 text-cyan-800 flex items-center">
                        <GraduationCap className="h-5 w-5 mr-2 text-cyan-600" />
                        Education
                      </h3>
                      <div className="space-y-4">
                        {doctorData.education.map((edu, index) => (
                          <div key={index} className="pl-4 border-l-2 border-cyan-200">
                            <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                            <p className="text-gray-600">{edu.university}</p>
                            <p className="text-sm text-gray-500">{edu.year}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-4 text-cyan-800 flex items-center">
                        <Award className="h-5 w-5 mr-2 text-cyan-600" />
                        Certifications
                      </h3>
                      <div className="space-y-2">
                        {doctorData.certifications && doctorData.certifications.map((cert, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-700">{cert}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Patient Reviews</CardTitle>
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < Math.floor(doctorData.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-semibold">{doctorData.rating}</span>
                      <span className="ml-1 text-gray-500">({doctorData.reviewCount} reviews)</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <p>Reviews will be displayed here.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Location & Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-cyan-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{doctorData.location}</p>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-3 text-cyan-600 flex-shrink-0" />
                      <p className="text-gray-700">{doctorData.email}</p>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-cyan-600 flex-shrink-0" />
                      <p className="text-gray-700">{doctorData.phone}</p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100 h-64 flex items-center justify-center">
                        <p className="text-gray-500">Map will be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column - Booking */}
          <div>
            <Card className="border-0 shadow-sm sticky top-4">
              <CardHeader>
                <CardTitle className="text-cyan-800">Book an Appointment</CardTitle>
                <CardDescription>Select a date and time slot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3 text-gray-700">Select Date</h3>
                  <div className="border rounded-lg p-3">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => {
                        // Disable dates before minDate and after maxDate
                        return isBefore(date, minDate) || isAfter(date, maxDate)
                      }}
                      className="rounded-md border"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3 text-gray-700">Available Time Slots</h3>
                  {availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimeSlots.map((slot, index) => (
                        <Button
                          key={index}
                          variant={selectedTimeSlot === slot ? "default" : "outline"}
                          className={cn(
                            "h-10",
                            selectedTimeSlot === slot
                              ? "bg-cyan-600 hover:bg-cyan-700"
                              : "hover:bg-cyan-50 hover:text-cyan-700",
                          )}
                          onClick={() => {
                            setSelectedTimeSlot(slot)
                            setBookingFormData((prev) => ({ ...prev, timeSlot: slot }))

                          }}
                        >
                          {slot.start}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                      <p>No available slots for this date</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
                      disabled={!selectedTimeSlot}
                    >
                      Book Appointment
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

