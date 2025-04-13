"use client"

import { useState, useEffect } from "react"
import {Link} from "react-router"
import { Search, MapPin, Star, Filter, X } from "lucide-react"
import { Button } from "../ui/patientProfile/button"
import { Input } from "../ui/patientProfile/input"
import { Card, CardContent } from "../ui/patientProfile/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/patientProfile/avatar"
import { Badge } from "../ui/patientProfile/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/patientProfile/select"
import { Skeleton } from "../ui/patientProfile/skeleton"
import { UseGetAllDoctorsList } from "../hooks/data"
import DoctorsListLoading from "./shimmer/doctorsList-shimmer"
import { AceternityNav } from "../components/AceternaityNav"
import { AuroraBackground } from "../ui/AuroraBackground"
import Footer from "../components/Footer"

// Mock data for doctors
const doctorsData = [
  {
    id: "d1",
    name: "Dr. Emily Chen",
    specialty: "Cardiologist",
    hospital: "Smart Clinic Medical Center",
    location: "New York, NY",
    rating: 4.9,
    reviewCount: 127,
    experience: "10+ years",
    availability: "Available Today",
    avatar: "/placeholder.svg?height=300&width=300",
    featured: true,
  },
  {
    id: "d2",
    name: "Dr. Michael Johnson",
    specialty: "Neurologist",
    hospital: "Central Hospital",
    location: "Boston, MA",
    rating: 4.7,
    reviewCount: 98,
    experience: "15+ years",
    availability: "Available Tomorrow",
    avatar: "/placeholder.svg?height=300&width=300",
    featured: false,
  },
  {
    id: "d3",
    name: "Dr. Sarah Williams",
    specialty: "Pediatrician",
    hospital: "Children's Medical Center",
    location: "Chicago, IL",
    rating: 4.8,
    reviewCount: 156,
    experience: "8+ years",
    availability: "Available Today",
    avatar: "/placeholder.svg?height=300&width=300",
    featured: true,
  },
  {
    id: "d4",
    name: "Dr. James Wilson",
    specialty: "Orthopedic Surgeon",
    hospital: "Orthopedic Specialists",
    location: "Los Angeles, CA",
    rating: 4.6,
    reviewCount: 87,
    experience: "12+ years",
    availability: "Next Available: Monday",
    avatar: "/placeholder.svg?height=300&width=300",
    featured: false,
  },
  // {
  //   id: "d5",
  //   name: "Dr. Lisa Martinez",
  //   specialty: "Dermatologist",
  //   hospital: "Skin Care Clinic",
  //   location: "Miami, FL",
  //   rating: 4.9,
  //   reviewCount: 112,
  //   experience: "9+ years",
  //   availability: "Available Today",
  //   avatar: "/placeholder.svg?height=300&width=300",
  //   featured: true,
  // },
  // {
  //   id: "d6",
  //   name: "Dr. Robert Davis",
  //   specialty: "Gastroenterologist",
  //   hospital: "Digestive Health Center",
  //   location: "Houston, TX",
  //   rating: 4.5,
  //   reviewCount: 76,
  //   experience: "11+ years",
  //   availability: "Next Available: Tuesday",
  //   avatar: "/placeholder.svg?height=300&width=300",
  //   featured: false,
  // },
  // {
  //   id: "d7",
  //   name: "Dr. Jennifer Lee",
  //   specialty: "Psychiatrist",
  //   hospital: "Mental Health Institute",
  //   location: "Seattle, WA",
  //   rating: 4.8,
  //   reviewCount: 103,
  //   experience: "7+ years",
  //   availability: "Available Today",
  //   avatar: "/placeholder.svg?height=300&width=300",
  //   featured: false,
  // },
  // {
  //   id: "d8",
  //   name: "Dr. David Brown",
  //   specialty: "Ophthalmologist",
  //   hospital: "Vision Care Center",
  //   location: "Philadelphia, PA",
  //   rating: 4.7,
  //   reviewCount: 91,
  //   experience: "14+ years",
  //   availability: "Next Available: Wednesday",
  //   avatar: "/placeholder.svg?height=300&width=300",
  //   featured: false,
  // },
]

export default function DoctorsListPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [doctors, setDoctors] = useState(doctorsData)

  // Simulate loading
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false)
//     }, 1500)

//     return () => clearTimeout(timer)
//   }, [])

  UseGetAllDoctorsList(doctors, setDoctors, setLoading);

  if (loading){
    return <DoctorsListLoading/>
  }

  // Get unique specialties for filter
  const specialties = Array.from(new Set(doctorsData.map((doctor) => doctor.specialty)))

  // Filter doctors based on search and filters
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSpecialty = specialtyFilter === "all" || doctor.specialty === specialtyFilter

    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "today" && doctor.availability.includes("Today")) ||
      (availabilityFilter === "tomorrow" && doctor.availability.includes("Tomorrow"))

    return matchesSearch && matchesSpecialty && matchesAvailability
  })

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setSpecialtyFilter("all")
    setAvailabilityFilter("all")
  }

  // Check if any filter is active
  const isFilterActive = searchQuery || specialtyFilter !== "all" || availabilityFilter !== "all"

  return (
    <>
    <AuroraBackground>
    <AceternityNav/>
    <div className="container mx-auto pt-[140px] pb-8 px-4 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-900 via-teal-600 to-teal-50">Find the Right Doctor for You</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our network of highly qualified healthcare professionals and book your appointment today.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by doctor name, specialty, hospital, or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <div className="flex flex-wrap gap-3 flex-1">
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Availability</SelectItem>
                  <SelectItem value="today">Available Today</SelectItem>
                  <SelectItem value="tomorrow">Available Tomorrow</SelectItem>
                </SelectContent>
              </Select>

              {isFilterActive && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="h-10">
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {loading
              ? "Loading doctors..."
              : `Showing ${filteredDoctors.length} ${filteredDoctors.length === 1 ? "doctor" : "doctors"}`}
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Skeleton loaders
            Array(6)
              .fill(0)
              .map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <div className="flex items-center gap-1">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-20 rounded-full" />
                          <Skeleton className="h-8 w-24 rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="border-t p-4">
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-6">
                    {/* {doctor.featured && (
                      <Badge className="absolute top-4 right-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white">
                        Featured
                      </Badge>
                    )} */}
                    <div className="flex items-start gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={doctor.avatar} alt={doctor.name} />
                        <AvatarFallback>
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-lg">{doctor.name}</h3>
                        <p className="text-muted-foreground">{doctor.specialty}</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-sm font-medium">{doctor.rating}</span>
                          <span className="ml-1 text-xs text-muted-foreground">({doctor.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm flex items-center text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1 inline" />
                        {doctor.hospital}, {doctor.location}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                          {doctor.experience}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            doctor.availability.includes("Today")
                              ? "bg-green-50 text-green-700 hover:bg-green-50"
                              : "bg-orange-50 text-orange-700 hover:bg-orange-50"
                          }
                        >
                          {doctor.availability}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="border-t p-4">
                    <Link to={`/doctor_profile_public/${doctor.id}`}>
                      <Button className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No doctors found</h3>
              <p className="text-muted-foreground mb-4">We couldn't find any doctors matching your search criteria.</p>
              <Button onClick={resetFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer/>
    
    </AuroraBackground>
    </>
  )
}

