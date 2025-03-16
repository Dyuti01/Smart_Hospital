"use client"

import { useState } from "react"
import { Search, Filter, CheckCircle, XCircle, Clock, MoreHorizontal, FileText } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/patientProfile/avatar"
import { Badge } from "../../ui/patientProfile/badge"
import { Textarea } from "../../ui/patientProfile/textarea"
import { Label } from "../../ui/patientProfile/label"
import { useToast } from "../../ui/patientProfile/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/patientProfile/tabs"

// Mock data for leave applications
const initialLeaveApplications = [
  {
    id: "1",
    employeeName: "Dr. Sarah Johnson",
    employeeId: "EMP001",
    department: "Cardiology",
    leaveType: "Medical",
    startDate: "2024-03-15",
    endDate: "2024-03-20",
    duration: "6 days",
    reason: "Scheduled surgery recovery",
    status: "Pending",
    appliedOn: "2024-03-01",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    employeeName: "Nurse Emma Wilson",
    employeeId: "EMP003",
    department: "Emergency",
    leaveType: "Annual",
    startDate: "2024-04-10",
    endDate: "2024-04-17",
    duration: "8 days",
    reason: "Family vacation",
    status: "Approved",
    appliedOn: "2024-02-25",
    approvedOn: "2024-03-02",
    approvedBy: "Hospital Admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    employeeName: "Dr. Michael Chen",
    employeeId: "EMP002",
    department: "Neurology",
    leaveType: "Conference",
    startDate: "2024-03-25",
    endDate: "2024-03-28",
    duration: "4 days",
    reason: "Attending International Neurology Conference",
    status: "Pending",
    appliedOn: "2024-03-05",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    employeeName: "Dr. Robert Davis",
    employeeId: "EMP004",
    department: "Pediatrics",
    leaveType: "Personal",
    startDate: "2024-03-10",
    endDate: "2024-03-12",
    duration: "3 days",
    reason: "Family emergency",
    status: "Rejected",
    appliedOn: "2024-03-08",
    rejectedOn: "2024-03-09",
    rejectedBy: "Hospital Admin",
    rejectionReason: "Short notice during high patient volume period",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    employeeName: "Nurse Jessica Martinez",
    employeeId: "EMP005",
    department: "Surgery",
    leaveType: "Annual",
    startDate: "2024-05-01",
    endDate: "2024-05-10",
    duration: "10 days",
    reason: "Planned vacation",
    status: "Pending",
    appliedOn: "2024-03-07",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const LeaveManagement = () => {
  const [leaveApplications, setLeaveApplications] = useState(initialLeaveApplications)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [currentApplication, setCurrentApplication] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const { toast } = useToast()

  const filteredApplications = leaveApplications.filter(
    (application) =>
      (application.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        application.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        application.department.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === "all" || application.status.toLowerCase() === statusFilter.toLowerCase()),
  )

  const pendingApplications = filteredApplications.filter((application) => application.status === "Pending")

  const processedApplications = filteredApplications.filter(
    (application) => application.status === "Approved" || application.status === "Rejected",
  )

  const handleApproveLeave = () => {
    if (!currentApplication) return

    setLeaveApplications(
      leaveApplications.map((app) =>
        app.id === currentApplication.id
          ? {
              ...app,
              status: "Approved",
              approvedOn: new Date().toISOString().split("T")[0],
              approvedBy: "Hospital Admin",
            } as typeof app
          : app,
      ),
    )
    setIsApproveDialogOpen(false)

    toast({
      title: "Leave approved",
      description: `${currentApplication.employeeName}'s leave request has been approved.`,
    })
  }

  const handleRejectLeave = () => {
    if (!currentApplication || !rejectionReason) return

    setLeaveApplications(
      leaveApplications.map((app) =>
        app.id === currentApplication.id
          ? {
              ...app,
              status: "Rejected",
              rejectedOn: new Date().toISOString().split("T")[0],
              rejectedBy: "Hospital Admin",
              rejectionReason,
            } as typeof app
          : app,
      ),
    )
    setIsRejectDialogOpen(false)
    setRejectionReason("")

    toast({
      title: "Leave rejected",
      description: `${currentApplication.employeeName}'s leave request has been rejected.`,
      variant: "destructive",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "Rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      case "Pending":
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  const renderLeaveTable = (applications: typeof filteredApplications) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Leave Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length > 0 ? (
            applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={application.avatar} alt={application.employeeName} />
                      <AvatarFallback>{application.employeeName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{application.employeeName}</div>
                      <div className="text-sm text-muted-foreground">{application.department}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{application.leaveType}</TableCell>
                <TableCell>
                  <div className="font-medium">{application.duration}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(application.startDate).toLocaleDateString()} -{" "}
                    {new Date(application.endDate).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(application.status)}</TableCell>
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
                      <DropdownMenuItem
                        onClick={() => {
                          setCurrentApplication(application)
                          setIsViewDialogOpen(true)
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {application.status === "Pending" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentApplication(application)
                              setIsApproveDialogOpen(true)
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentApplication(application)
                              setIsRejectDialogOpen(true)
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-2 text-red-600" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No leave applications found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or department..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Pending Requests</span>
            {pendingApplications.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pendingApplications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="processed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Processed Requests</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-6">
          {renderLeaveTable(pendingApplications)}
        </TabsContent>
        <TabsContent value="processed" className="mt-6">
          {renderLeaveTable(processedApplications)}
        </TabsContent>
      </Tabs>

      {/* View Leave Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Leave Application Details</DialogTitle>
            <DialogDescription>Review the details of this leave application.</DialogDescription>
          </DialogHeader>
          {currentApplication && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={currentApplication.avatar} alt={currentApplication.employeeName} />
                  <AvatarFallback>{currentApplication.employeeName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{currentApplication.employeeName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentApplication.department} • {currentApplication.employeeId}
                  </p>
                </div>
                <div className="ml-auto">{getStatusBadge(currentApplication.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Leave Type</h4>
                  <p>{currentApplication.leaveType}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Duration</h4>
                  <p>{currentApplication.duration}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Start Date</h4>
                  <p>{new Date(currentApplication.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">End Date</h4>
                  <p>{new Date(currentApplication.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Applied On</h4>
                  <p>{new Date(currentApplication.appliedOn).toLocaleDateString()}</p>
                </div>
                {currentApplication.status === "Approved" && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Approved On</h4>
                    <p>{new Date(currentApplication.approvedOn).toLocaleDateString()}</p>
                  </div>
                )}
                {currentApplication.status === "Rejected" && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Rejected On</h4>
                    <p>{new Date(currentApplication.rejectedOn).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Reason for Leave</h4>
                <p className="p-3 bg-muted rounded-md">{currentApplication.reason}</p>
              </div>

              {currentApplication.status === "Rejected" && currentApplication.rejectionReason && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Rejection Reason</h4>
                  <p className="p-3 bg-red-50 text-red-800 rounded-md">{currentApplication.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {currentApplication && currentApplication.status === "Pending" && (
              <>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    setIsRejectDialogOpen(true)
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    setIsApproveDialogOpen(true)
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
            {(!currentApplication || currentApplication.status !== "Pending") && (
              <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Leave Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Leave Request</DialogTitle>
            <DialogDescription>Are you sure you want to approve this leave request?</DialogDescription>
          </DialogHeader>
          {currentApplication && (
            <div className="py-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src={currentApplication.avatar} alt={currentApplication.employeeName} />
                  <AvatarFallback>{currentApplication.employeeName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{currentApplication.employeeName}</div>
                  <div className="text-sm text-muted-foreground">{currentApplication.department}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Leave Type:</span> {currentApplication.leaveType}
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span> {currentApplication.duration}
                </div>
                <div>
                  <span className="text-muted-foreground">Start Date:</span>{" "}
                  {new Date(currentApplication.startDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="text-muted-foreground">End Date:</span>{" "}
                  {new Date(currentApplication.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApproveLeave} className="bg-green-600 hover:bg-green-700">
              Approve Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Leave Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting this leave request.</DialogDescription>
          </DialogHeader>
          {currentApplication && (
            <div className="py-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src={currentApplication.avatar} alt={currentApplication.employeeName} />
                  <AvatarFallback>{currentApplication.employeeName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{currentApplication.employeeName}</div>
                  <div className="text-sm text-muted-foreground">{currentApplication.department}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rejection-reason">Reason for Rejection</Label>
                  <Textarea
                    id="rejection-reason"
                    placeholder="Please provide a detailed reason for rejecting this leave request..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRejectLeave} disabled={!rejectionReason} className="bg-red-600 hover:bg-red-700">
              Reject Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LeaveManagement

