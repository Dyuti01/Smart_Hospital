"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../../utils/AuthContext"
import { Button } from "../../ui/patientProfile/button"
import { Input } from "../../ui/patientProfile/input"
import { Label } from "../../ui/patientProfile/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/patientProfile/card"
import { BeamBackground } from "../../components/BeamsBackground"
import { useToast } from "../../ui/patientProfile/use-toast"
import { Eye, EyeOff, Hospital } from "lucide-react"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password)

      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome to the Hospital Admin Dashboard",
        })
        navigate("/")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Try admin@hospital.com / admin123",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BeamBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-background/95 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <Hospital className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Hospital Admin Portal</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-xs text-center text-muted-foreground mt-4">
              Demo credentials: admin@hospital.com / admin123
            </p>
          </CardFooter>
        </Card>
      </div>
    </BeamBackground>
  )
}

export default LoginPage

