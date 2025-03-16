import { Activity, Users, Calendar, CheckSquare, MessageSquare, Clock, TrendingUp, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/patientProfile/card"
import { Progress } from "../../ui/patientProfile/progress"
import { AceternityNav } from "../../components/AceternaityNav"
import { AuroraBackground } from "../../ui/AuroraBackground"
import { redirect } from "react-router"

const AdminDashboard = () => {
  return (
    <>
    <AuroraBackground>
    <AceternityNav className="bg-white"/>
    <div className="space-y-6 px-[30px] pt-[100px] z-[1000]">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Last updated: </span>
          <span className="text-sm font-medium">Today at 9:42 AM</span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">+6 new this month</p>
          </CardContent>
        </Card>
        <Card onClick={()=> redirect('/admin/leaveManage')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 require immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">8 due today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Announcements</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Sent in the last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity and tasks */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Staff Activity</CardTitle>
            <CardDescription>Overview of staff attendance and activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Current Attendance</span>
                  </div>
                  <span className="text-sm font-medium">86%</span>
                </div>
                <Progress value={86} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">On-time Arrival Rate</span>
                  </div>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Task Completion Rate</span>
                  </div>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Leave Utilization</span>
                  </div>
                  <span className="text-sm font-medium">34%</span>
                </div>
                <Progress value={34} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Dr. Sarah Johnson submitted a leave request",
                  time: "10 minutes ago",
                  icon: <Calendar className="h-4 w-4" />,
                  color: "text-blue-500",
                },
                {
                  action: "New emergency task assigned to Dr. Michael Chen",
                  time: "1 hour ago",
                  icon: <AlertTriangle className="h-4 w-4" />,
                  color: "text-red-500",
                },
                {
                  action: "Staff meeting announcement sent",
                  time: "2 hours ago",
                  icon: <MessageSquare className="h-4 w-4" />,
                  color: "text-green-500",
                },
                {
                  action: "New nurse profile created",
                  time: "Yesterday",
                  icon: <Users className="h-4 w-4" />,
                  color: "text-purple-500",
                },
                {
                  action: "Monthly report generated",
                  time: "2 days ago",
                  icon: <Activity className="h-4 w-4" />,
                  color: "text-orange-500",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`${item.color} bg-muted p-1.5 rounded-full`}>{item.icon}</div>
                  <div>
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </AuroraBackground>
    </>
  )
}

export default AdminDashboard

