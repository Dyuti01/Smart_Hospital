"use client"

import type React from "react"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router"
import {
  LayoutDashboard,
  Users,
  Calendar,
  CheckSquare,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
} from "lucide-react"
import { Button } from "../ui/patientProfile/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/patientProfile/avatar"
import { useAuth } from "../utils/AuthContext"
import { BeamBackground } from "./BeamsBackground"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/patientProfile/dropdown-menu"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: "/users", label: "User Management", icon: <Users className="h-5 w-5" /> },
    { path: "/leave-management", label: "Leave Management", icon: <Calendar className="h-5 w-5" /> },
    { path: "/tasks", label: "Task Management", icon: <CheckSquare className="h-5 w-5" /> },
    { path: "/communication", label: "Communication", icon: <MessageSquare className="h-5 w-5" /> },
  ]

  return (
    // <BeamBackground>
      <div className="min-h-screen bg-background/95 backdrop-blur-sm">
        {/* Mobile sidebar toggle */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-full bg-background/90 backdrop-blur-sm"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-background/80 backdrop-blur-md border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">H</span>
                </div>
                <span className="text-xl font-bold">Hospital Admin</span>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-colors ${
                    location.pathname === item.path ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b">
            <div className="flex items-center justify-between p-4">
              <h1 className="text-xl font-semibold lg:hidden">Hospital Admin</h1>

              <div className="flex items-center ml-auto space-x-4">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt={user?.name || "User"} />
                        <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-4 md:p-6 max-w-7xl mx-auto">{children}</main>
        </div>
      </div>
    // </BeamBackground>
  )
}

export default DashboardLayout

