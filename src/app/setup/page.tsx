"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface SetupResult {
  status: "success" | "error"
  message: string
  credentials?: {
    email: string
    password: string
  }
  user?: {
    id: string
    email: string
    role: string
  }
}

export default function SetupPage() {
  const [result, setResult] = useState<SetupResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const createAdminUser = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/seed")
      const data = await response.json()
      setResult(data)
    } catch {
      setResult({ status: "error", message: "Failed to connect to API" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Setup</CardTitle>
          <CardDescription>
            Initialize your admin account for Obesity Insights Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!result ? (
            <div className="space-y-4">
              <Button 
                onClick={createAdminUser} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Creating Admin User..." : "Create Admin User"}
              </Button>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-blue-800 font-medium mb-2">Ready to Sign In?</h4>
                <p className="text-blue-700 text-sm mb-3">Your admin account is already set up!</p>
                <div className="bg-white rounded border p-3 mb-3">
                  <h5 className="font-medium text-gray-900 mb-2">Use these credentials:</h5>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Email:</span> b10smith5@gmail.com</p>
                    <p><span className="font-medium">Password:</span> Admin123!</p>
                    <p><span className="font-medium">Role:</span> Admin</p>
                  </div>
                </div>
                <Link href="/auth/signin">
                  <Button className="w-full">
                    Sign In Now →
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {result.status === "success" ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-green-800 font-medium mb-2">✅ Success!</h3>
                  <p className="text-green-700 text-sm mb-3">{result.message}</p>
                  
                  {result.credentials && (
                    <div className="bg-white rounded border p-3 mb-3">
                      <h4 className="font-medium text-gray-900 mb-2">Your Credentials:</h4>
                      <div className="text-sm space-y-1">
                        <p><span className="font-medium">Email:</span> {result.credentials.email}</p>
                        <p><span className="font-medium">Password:</span> {result.credentials.password}</p>
                        <p><span className="font-medium">Role:</span> Admin</p>
                      </div>
                    </div>
                  )}
                  
                  <Link href="/auth/signin">
                    <Button className="w-full">
                      Go to Sign In →
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-red-800 font-medium mb-2">❌ Error</h3>
                  <p className="text-red-700 text-sm">{result.message}</p>
                  <Button 
                    onClick={() => setResult(null)} 
                    variant="outline" 
                    className="w-full mt-3"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <div className="text-center pt-4 border-t">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}