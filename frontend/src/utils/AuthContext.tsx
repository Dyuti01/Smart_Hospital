"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  userId: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (userId: string) => boolean
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (userId) {
      setUser({userId:userId})
      setIsAuthenticated(true)
    }
  }, [])

  const login = (userId:string) => {

      // setUser(user)
      setIsAuthenticated(true)
      localStorage.setItem("userId", userId)
      return true;
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("userId")
  }
  
  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

