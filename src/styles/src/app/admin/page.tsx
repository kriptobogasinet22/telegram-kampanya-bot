"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, Bell, Link, Settings, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeCampaigns: 0,
    weeklySignups: 0,
    dailySignups: [0, 0, 0, 0, 0, 0, 0],
    totalClicks: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const apiKey = localStorage.getItem("adminApiKey")

        if (!apiKey) {
          router.push("/admin/login")
          return
        }

        const response = await fetch("/api/admin/stats", {
          headers: {
            "x-api-key": apiKey,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("adminApiKey")
            router.push("/admin/login")
            return
          }
          throw new Error("Failed to fetch stats")
        }

        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError("Failed to load dashboard data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white">Yükleniyor...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
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
          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            className={`w-full justify-start ${activeTab === "dashboard" ? "bg-emerald-500 hover:bg-emerald-600" : "text-gray-300 hover:text-white"}`}
            onClick={() => {
              setActiveTab("dashboard")
              router.push("/admin")
            }}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === "users" ? "default" : "ghost"}
            className={`w-full justify-start ${activeTab === "users" ? "bg-emerald-500 hover:bg-emerald-600" : "text-gray-300 hover:text-white"}`}
            onClick={() => {
              setActiveTab("users")
              router.push("/admin/users")
            }}
          >
            <Users className="mr-2 h-4 w-4" />
            Kullanıcılar
          </Button>
          <Button
            variant={activeTab === "links" ? "default" : "ghost"}
            className={`w-full justify-start ${activeTab === "links" ? "bg-emerald-500 hover:bg-emerald-600" : "text-gray-300 hover:text-white"}`}
            onClick={() => {
              setActiveTab("links")
              router.push("/admin/campaigns")
            }}
          >
            <Link className="mr-2 h-4 w-4" />
            Link Yönetimi
          </Button>
          <Button
            variant={activeTab === "announcements" ? "default" : "ghost"}
            className={`w-full justify-start ${activeTab === "announcements" ? "bg-emerald-500 hover:bg-emerald-600" : "text-gray-300 hover:text-white"}`}
            onClick={() => {
              setActiveTab("announcements")
              router.push("/admin/announcements")
            }}
          >
            <Bell className="mr-2 h-4 w-4" />
            Duyurular
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            className={`w-full justify-start ${activeTab === "settings" ? "bg-emerald-500 hover:bg-emerald-600" : "text-gray-300 hover:text-white"}`}
            onClick={() => {
              setActiveTab("settings")
              router.push("/admin/settings")
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            Ayarlar
          </Button>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden w-full bg-[#1E1E1E] border-b border-[#2A2A2A] p-4">
        <Tabs
          defaultValue="dashboard"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value)
            router.push(`/admin${value === "dashboard" ? "" : `/${value}`}`)
          }}
        >
          <TabsList className="grid grid-cols-5 bg-[#2A2A2A]">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-emerald-500">
              <BarChart3 className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-emerald-500">
              <Users className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-emerald-500">
              <Link className="h-4 w-4" />
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
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Toplam Kullanıcı</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-emerald-400">{stats.totalUsers}</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Aktif Link Sayısı</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-emerald-400">{stats.activeCampaigns}</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Haftalık Kayıt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-emerald-400">+{stats.weeklySignups}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
            <CardHeader>
              <CardTitle>Haftalık Kayıt Grafiği</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end justify-between gap-2">
                {stats.dailySignups.map((value, i) => (
                  <div key={i} className="relative flex-1 group">
                    <div
                      className="bg-emerald-500 rounded-t-sm w-full transition-all duration-300 hover:bg-emerald-400"
                      style={{ height: `${value * 10 + 10}px` }}
                    ></div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2A2A2A] text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {value}
                    </div>
                    <div className="text-xs text-center mt-2 text-gray-400">
                      {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"][i]}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
