"use client"

import { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { Toaster } from "@/components/ui/sonner"

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={title} subtitle={subtitle} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      
      <Toaster />
    </div>
  )
}