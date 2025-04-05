"use client"

import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Define user roles
export type UserRole = "user" | "admin" | "verifier"

// User interface
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

// Auth context interface
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
})

// Mock users for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "password",
    role: "admin" as UserRole,
  },
  {
    id: "2",
    name: "Verifier User",
    email: "verifier@example.com",
    password: "password",
    role: "verifier" as UserRole,
  },
  {
    id: "3",
    name: "Regular User",
    email: "user@example.com",
    password: "password",
    role: "user" as UserRole,
  },
]

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

      if (!user) {
        throw new Error("Invalid credentials")
      }

      // Remove password before storing
      const { password: _, ...userWithoutPassword } = user

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      setUser(userWithoutPassword)

      // Redirect based on role
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else if (user.role === "verifier") {
        router.push("/verifier/dashboard")
      } else {
        router.push("/dashboard")
      }

      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    try {
      // Check if email already exists
      if (MOCK_USERS.some((u) => u.email === email)) {
        throw new Error("Email already in use")
      }

      // In a real app, this would be an API call
      const newUser = {
        id: (MOCK_USERS.length + 1).toString(),
        name,
        email,
        role: "user" as UserRole,
      }

      // Store user in localStorage (for demo purposes)
      localStorage.setItem("user", JSON.stringify(newUser))
      setUser(newUser)

      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext)

