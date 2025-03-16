"use client"

import { useState } from "react"
import { Search, Edit, Trash2, MoreHorizontal, UserPlus, Mail, Key, Plus, X } from "lucide-react"
import { Button } from "../../ui/patientProfile/button"
import { Input } from "../../ui/patientProfile/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/patientProfile/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/patientProfile/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/patientProfile/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/patientProfile/select"
import { Label } from "../../ui/patientProfile/label"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/patientProfile/avatar"
import { Badge } from "../../ui/patientProfile/badge"
import { useToast } from "../../ui/patientProfile/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/patientProfile/alert-dialog"
import { AceternityNav } from "../../components/AceternaityNav"
import { AuroraBackground } from "../../ui/AuroraBackground"
import { BACKEND_URL } from "../../config"
import axios from "axios"
import { UseGetAllStaffData } from "../../hooks/data"
import UserManagementShimmer from "../shimmer/user-management-shimmer"

// Mock data for users
const initialUsers = [
  {
    id: "1",
    firstName: "Dr. Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@hospital.com",
    role: "Doctor",
    department: "Cardiology",
    status: "Active",
    registrationNumber: "",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    firstName: "Dr. Michael",
    lastName: "Chen",
    email: "michael.chen@hospital.com",
    role: "Doctor",
    department: "Neurology",
    status: "Active",
    registrationNumber: "",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    firstName: "Nurse Emma",
    lastName: "Wilson",
    email: "emma.wilson@hospital.com",
    role: "Nurse",
    registrationNumber: "",
    department: "Emergency",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    firstName: "Dr. Robert",
    lastName: "Davis",
    email: "robert.davis@hospital.com",
    role: "Doctor",
    department: "Pediatrics",
    status: "On Leave",
    registrationNumber: "",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    firstName: "Nurse Jessica",
    lastName: "Martinez",
    email: "jessica.martinez@hospital.com",
    role: "Nurse",
    department: "Surgery",
    status: "Active",
    registrationNumber: "",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    firstName: "Dr. James",
    lastName: "Wilson",
    email: "james.wilson@hospital.com",
    role: "Doctor",
    department: "Orthopedics",
    status: "Inactive",
    registrationNumber: "",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFilter, setSearchFilter] = useState("all")
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    department: "",
    registrationNumber: "",
    password: "",
    phone:"",
    education: [] as { degree: string; university: string; year: string }[],
    availability:{} as {
      monday?: {start:string, end:string, availabilityId:string},
      tuesday?: {start:string, end:string, availabilityId:string},
      wednesday?: {start:string, end:string, availabilityId:string},
      thursday?: {start:string, end:string, availabilityId:string},
      friday?: {start:string, end:string, availabilityId:string},
      saturday?: {start:string, end:string, availabilityId:string},
      sunday?: {start:string, end:string, availabilityId:string},
    }
  })
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true);
  const [isAddingUser, setIsAddingUser] = useState(false);

  

  const staffs = UseGetAllStaffData(setIsLoading, setUsers, users)
  

  if (isLoading){
    return <UserManagementShimmer/>
  }

  const filteredUsers = users.filter(
    (user) => {
      if ((searchFilter === "all" || searchFilter === "") && searchQuery === "") {
        return true;
      }
      else if (searchFilter !== "all") {
        return (user.firstName.toLowerCase().includes(searchFilter.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchFilter.toLowerCase()) ||
          user.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
          user.department.toLowerCase().includes(searchFilter.toLowerCase()) ||
          user.role.toLowerCase().includes(searchFilter.toLowerCase()))
      }
      else if (searchQuery !== "") {
        return (user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(searchQuery.toLowerCase()))
      }
    }
  )

  // ----------------------------------------------------------
  const addEducationEntry = () => {
    setNewUser({
      ...newUser,
      education: [...newUser.education, { degree: "", university: "", year: "" }],
    })
  }

  const removeEducationEntry = (index: number) => {
    const updatedEducation = [...newUser.education]
    updatedEducation.splice(index, 1)
    setNewUser({
      ...newUser,
      education: updatedEducation,
    })
  }

  const updateEducationEntry = (index: number, field: string, value: string) => {
    const updatedEducation = [...newUser.education]
    updatedEducation[index] = { ...updatedEducation[index], [field]: value }
    setNewUser({
      ...newUser,
      education: updatedEducation,
    })
  }
  // ----------------------------------------------------

  const handleAddUser = async () => {
    try{
    setIsAddingUser(true)

    const response = await axios.post(`${BACKEND_URL}/api/v1/admin/addNewUser`, newUser, { withCredentials: true })
    console.log(response.data)

    setIsAddingUser(false);
    // setUsers([...users, ...staffs])
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      department: "",
      registrationNumber: "",
      password: "",
      phone:"",
      education: [],
      availability:{}
    })
    setIsAddUserDialogOpen(false)

    console.log(newUser)

    toast({
      title: "User added successfully",
      description: `${newUser.firstName + " " + newUser.lastName} has been added to the system.`,
    })
  }catch(err:any){
    setIsAddingUser(false)
  }
  }

  const handleEditUser = () => {
    if (!currentUser) return

    setUsers(users.map((user) => (user.id === currentUser.id ? { ...currentUser } : user)))
    setIsEditUserDialogOpen(false)

    toast({
      title: "User updated successfully",
      description: `${currentUser.firstName+" "+currentUser.lastName}'s information has been updated.`,
    })
  }

  const handleDeleteUser = () => {
    if (!currentUser) return
    setUsers(users.filter((user) => user.id !== currentUser.id))
    setIsDeleteAlertOpen(false)

    toast({
      title: "User deleted",
      description: `${currentUser.firstName+" "+currentUser.lastName} has been removed from the system.`,
      variant: "destructive",
    })
  }

  const handleResetPassword = () => {
    setIsResetPasswordDialogOpen(false)

    toast({
      title: "Password reset",
      description: `A password reset link has been sent to ${currentUser.email}.`,
    })
  }

  return (
    <AuroraBackground>
      <AceternityNav/>
      <div className="space-y-6 px-[30px] pt-[130px] pb-6 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-cyan-800">User Management</h1>
          <Button className="bg-gradient-to-r from-cyan-700 to-teal-600" onClick={() => setIsAddUserDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select defaultValue="all" value={searchFilter} onValueChange={(value) => setSearchFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="doctor">Doctors</SelectItem>
              <SelectItem value="nurse">Nurses</SelectItem>
              <SelectItem value="staff">Administrative Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.firstName} />
                          <AvatarFallback>{user.firstName.charAt(0) + user.lastName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.firstName + " " + user.lastName}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "Active" ? "default" : user.status === "On Leave" ? "outline" : "secondary"
                        }
                        className={
                          user.status === "Active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : user.status === "On Leave"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentUser(user)
                              setIsEditUserDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentUser(user)
                              setIsResetPasswordDialogOpen(true)
                            }}
                          >
                            <Key className="h-4 w-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setCurrentUser(user)
                              setIsDeleteAlertOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No users found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add User Dialog */}
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Add a new user to the hospital management system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First name
                </Label>
                <Input
                  id="firstName"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Doctor">Doctor</SelectItem>
                    <SelectItem value="Nurse">Nurse</SelectItem>
                    <SelectItem value="Administrative">Administrative Staff</SelectItem>
                    <SelectItem value="Lab Technician">Lab Technician</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <Select
                  value={newUser.department}
                  onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Surgery">Surgery</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {
                newUser.role === "Doctor" &&
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="registrationNumber" className="text-right">
                      Registration number
                    </Label>
                    <Input
                      id="registrationNumber"
                      value={newUser.registrationNumber}
                      onChange={(e) => setNewUser({ ...newUser, registrationNumber: e.target.value })}
                      className="col-span-3"
                    />
                  </div>


                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right mt-2">Education</Label>
                    <div className="col-span-3 space-y-4 overflow-y-scroll h-[100px]">
                      {newUser.education.length === 0 && (
                        <p className="text-sm text-muted-foreground">No education entries added yet.</p>
                      )}

                      {newUser.education.map((edu, index) => (
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
                  </div>
                </>
              }
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Initial Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddUser}
                disabled={!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.role || !newUser.department || !newUser.password || isAddingUser}
              >
              {isAddingUser && 
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Adding...
              </div>}
                {!isAddingUser && "Add User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information in the system.</DialogDescription>
            </DialogHeader>
            {currentUser && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-firstName" className="text-right">
                    First name
                  </Label>
                  <Input
                    id="edit-firstName"
                    value={currentUser.firstName}
                    onChange={(e) => setCurrentUser({ ...currentUser, firstName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-lastName" className="text-right">
                    Last name
                  </Label>
                  <Input
                    id="edit-lastName"
                    value={currentUser.lastName}
                    onChange={(e) => setCurrentUser({ ...currentUser, lastName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={currentUser.email}
                    onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={currentUser.phone}
                    onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={currentUser.role}
                    onValueChange={(value) => setCurrentUser({ ...currentUser, role: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Doctor">Doctor</SelectItem>
                      <SelectItem value="Nurse">Nurse</SelectItem>
                      <SelectItem value="Administrative">Administrative Staff</SelectItem>
                      <SelectItem value="Lab Technician">Lab Technician</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-department" className="text-right">
                    Department
                  </Label>
                  <Select
                    value={currentUser.department}
                    onValueChange={(value) => setCurrentUser({ ...currentUser, department: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Surgery">Surgery</SelectItem>
                      <SelectItem value="Administration">Administration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {
                  currentUser.role === "Doctor" &&
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="registrationNumber" className="text-right">
                        Registration number
                      </Label>
                      <Input
                        id="registrationNumber"
                        value={currentUser.registrationNumber}
                        onChange={(e) => setNewUser({ ...currentUser, registrationNumber: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </>
                }

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={currentUser.status}
                    onValueChange={(value) => setCurrentUser({ ...currentUser, status: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reset Password Dialog */}
        <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>Send a password reset link to the user's email.</DialogDescription>
            </DialogHeader>
            {currentUser && (
              <div className="py-4">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm">
                  A password reset link will be sent to this email address. The link will expire after 24 hours.
                </p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleResetPassword}>Send Reset Link</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Alert */}
        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user account and remove their data from the
                system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AuroraBackground>
  )
}

export default UserManagement

