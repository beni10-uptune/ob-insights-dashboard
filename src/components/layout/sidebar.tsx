"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Newspaper,
  Search,
  TrendingUp,
  Target,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react"

interface SidebarProps {
  className?: string
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "News & Insights",
    href: "/dashboard/news",
    icon: Newspaper,
    badge: "New",
  },
  {
    name: "Search Intelligence",
    href: "/dashboard/search",
    icon: Search,
  },
  {
    name: "Website Performance",
    href: "/dashboard/performance",
    icon: TrendingUp,
  },
  {
    name: "Competitive Intelligence",
    href: "/dashboard/competitive",
    icon: Target,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-gray-50/40 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex h-14 items-center justify-between px-4">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">OI</span>
            </div>
            <span className="font-semibold text-lg">Obesity Insights</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  collapsed && "px-2"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 h-10",
            collapsed && "px-2"
          )}
        >
          <User className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="flex-1 text-left">Profile</span>}
        </Button>
      </div>
    </div>
  )
}