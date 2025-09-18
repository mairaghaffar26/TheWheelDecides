"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "user" | "admin"

export interface User {
  id: string
  fullName: string
  email: string
  instagramHandle: string
  country: string
  role: UserRole
  slots: number
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: Omit<User, "id" | "role" | "slots" | "createdAt">) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock data for demo - in real app this would connect to a database
const mockUsers: User[] = [
  {
    id: "admin1",
    fullName: "Admin User",
    email: "admin@wheeldecides.com",
    instagramHandle: "@admin",
    country: "US",
    role: "admin",
    slots: 0,
    createdAt: new Date(),
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("wheel-decides-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Mock authentication - in real app this would call an API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email)
    if (foundUser && (password === "admin123" || password === "user123")) {
      setUser(foundUser)
      localStorage.setItem("wheel-decides-user", JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (userData: Omit<User, "id" | "role" | "slots" | "createdAt">): Promise<boolean> => {
    setIsLoading(true)

    // Mock registration - in real app this would call an API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      role: "user",
      slots: 1, // Default 1 slot for new users
      createdAt: new Date(),
    }

    mockUsers.push(newUser)
    setUser(newUser)
    localStorage.setItem("wheel-decides-user", JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("wheel-decides-user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
