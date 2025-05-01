"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    is_active: true,
  })
  const router = useRouter()

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const apiKey = localStorage.getItem("adminApiKey")

      if (!apiKey) {
        router.push("/admin/login")
        return
      }

      const response = await fetch("/api/admin/announcements", {
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
        throw new Error("Failed to fetch announcements")
      }

      const data = await response.json()
      setAnnouncements(data)
    } catch (err) {
      setError("Failed to load announcements data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const apiKey = localStorage.getItem("adminApiKey")

      if (!apiKey) {
        router.push("/admin/login")
        return
      }

      const response = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to add announcement")
      }

      // Reset form and refresh announcements
      setFormData({
        title: "",
        content: "",
        is_active: true,
      })
      fetchAnnouncements()
    } catch (err) {
      setError("Failed to add announcement")
      console.error(err)
    }
  }

  if (loading && announcements.length === 0) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Duyurular</h1>
        <div className="text-white">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Duyurular</h1>

      <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white mb-6">
        <CardHeader>
          <CardTitle>Yeni Duyuru Ekle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-200">
                Başlık
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Duyuru başlığı"
                className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content" className="text-gray-200">
                Metin
              </Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Duyuru metni..."
                className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                value={formData.content}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is_active" checked={formData.is_active} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="is_active" className="text-gray-200">
                Yayında
              </Label>
            </div>
            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Duyuru Ekle
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white overflow-hidden">
        <CardHeader>
          <CardTitle>Mevcut Duyurular</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#2A2A2A] hover:bg-[#2A2A2A]">
                  <TableHead className="text-gray-300">Başlık</TableHead>
                  <TableHead className="text-gray-300">İçerik</TableHead>
                  <TableHead className="text-gray-300">Tarih</TableHead>
                  <TableHead className="text-gray-300">Durum</TableHead>
                  <TableHead className="text-gray-300">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.length > 0 ? (
                  announcements.map((announcement: any) => (
                    <TableRow key={announcement.id} className="border-b border-[#2A2A2A] hover:bg-[#2A2A2A]">
                      <TableCell className="text-gray-300">{announcement.title}</TableCell>
                      <TableCell className="text-gray-300 truncate max-w-[200px]">{announcement.content}</TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            announcement.is_active
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {announcement.is_active ? "Yayında" : "Pasif"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 text-gray-300 hover:text-white">
                            Düzenle
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 text-red-400 hover:text-red-300">
                            Sil
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-300 py-4">
                      Henüz duyuru bulunmamaktadır.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
