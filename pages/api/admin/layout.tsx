"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, Bell, LinkIcon, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // URL'den aktif sekmeyi belirle
    if (pathname === "/admin") {
      setActiveTab("dashboard")
    } else if (pathname === "/admin/users") {
      setActiveTab("users")
    } else if (pathname === "/admin/campaigns") {
      setActiveTab("links")
    } else if (pathname === "/admin/announcements") {
      setActiveTab("announcements")
    } else if (pathname === "/admin/settings") {
      setActiveTab("settings")
    }

    // Admin API anahtarını kontrol et
    const apiKey = localStorage.getItem("adminApiKey")
    if (!apiKey && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("adminApiKey")
    router.push("/admin/login")
  }

  // Login sayfasında layout gösterme
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#121212] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#1E1E1E] border-r border-[#2A2A2A] p-4 hidden md:block">
        <div className="flex items-center space-x-2 mb-8">
          <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        </div>

        <nav className="space-y-2">
          <Link href="/admin">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "dashboard" ? "bg-emerald-500 hover:bg-emerald-600" : "text-gray-300 hover:text-white"
              }`}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "users" ? "bg-emerald-500 hover:bg-emerald-600" : "text-gray-300 hover:text-white"
              }`}
            >
              <Users className="mr-2 h-4 w-4" />
              Kullanıcılar
            </Button>
          </Link>
          <Link href="/admin/campaigns">
            <Button
              variant={activeTab === "links" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "links" ? "bg-emerald-500 hover:bg-emerald-600" : "text-gray-300 hover:text-white"
              }`}
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              Link Yönetimi
            </Button>
          </Link>
          <Link href="/admin/announcements">
            <Button
              variant={activeTab === "announcements" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "announcements" ? "bg-emerald-500 hover:bg-emerald-600" : "text-gray-300 hover:text-white"
              }`}
            >
              <Bell className="mr-2 h-4 w-4" />
              Duyurular
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "settings" ? "bg-emerald-500 hover:bg-emerald-600" : "text-gray-300 hover:text-white"
              }`}
            >
              <Settings className="mr-2 h-4 w-4" />
              Ayarlar
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white mt-8"
            onClick={handleLogout}
          >
            Çıkış Yap
          </Button>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden w-full bg-[#1E1E1E] border-b border-[#2A2A2A] p-4 fixed top-0 z-10">
        <Tabs
          defaultValue="dashboard"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value)
            switch (value) {
              case "dashboard":
                router.push("/admin")
                break
              case "users":
                router.push("/admin/users")
                break
              case "links":
                router.push("/admin/campaigns")
                break
              case "announcements":
                router.push("/admin/announcements")
                break
              case "settings":
                router.push("/admin/settings")
                break
            }
          }}
        >
          <TabsList className="grid grid-cols-5 bg-[#2A2A2A]">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-emerald-500">
              <BarChart3 className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-emerald-500">
              <Users className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="links" className="data-[state=active]:bg-emerald-500">
              <LinkIcon className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="announcements" className="data-[state=active]:bg-emerald-500">
              <Bell className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-emerald-500">
              <Settings className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:overflow-auto">
        <div className="md:hidden h-16"></div> {/* Mobile nav spacer */}
        {children}
      </div>
    </div>
  )
}
