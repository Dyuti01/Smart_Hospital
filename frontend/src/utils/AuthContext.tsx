"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  userId: string,
  fullName:string,
  avatarUrl:string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (userId: string, user:string) => boolean
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
    const userId = localStorage.getItem("userId");
    const blankUser = JSON.stringify({fullName:"", avatarUrl:""});
    const user = JSON.parse(localStorage.getItem("user")||blankUser)
    if (userId && user) {
      setUser({userId:userId, fullName: user.fullName||"", avatarUrl:user.avatarUrl})
      setIsAuthenticated(true)
    }
  }, [])

  const login = (userId:string, user:string) => {      
      setIsAuthenticated(true)
      localStorage.setItem("user",user);
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

