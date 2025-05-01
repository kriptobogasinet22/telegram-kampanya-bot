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

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    site_name: "",
    url: "",
    description: "",
    is_active: true,
  })
  const router = useRouter()

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const apiKey = localStorage.getItem("adminApiKey")

      if (!apiKey) {
        router.push("/admin/login")
        return
      }

      const response = await fetch("/api/admin/campaigns", {
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
        throw new Error("Failed to fetch campaigns")
      }

      const data = await response.json()
      setCampaigns(data)
    } catch (err) {
      setError("Failed to load campaigns data")
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

      const response = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to add campaign")
      }

      // Reset form and refresh campaigns
      setFormData({
        site_name: "",
        url: "",
        description: "",
        is_active: true,
      })
      fetchCampaigns()
    } catch (err) {
      setError("Failed to add campaign")
      console.error(err)
    }
  }

  if (loading && campaigns.length === 0) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Link Yönetimi</h1>
        <div className="text-white">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Link Yönetimi</h1>

      <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white mb-6">
        <CardHeader>
          <CardTitle>Yeni Link Ekle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="site_name" className="text-gray-200">
                  Site Adı
                </Label>
                <Input
                  id="site_name"
                  name="site_name"
                  placeholder="Örn: TrendyolGO"
                  className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                  value={formData.site_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url" className="text-gray-200">
                  URL
                </Label>
                <Input
                  id="url"
                  name="url"
                  placeholder="https://..."
                  className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                  value={formData.url}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-200">
                Açıklama
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Kampanya açıklaması..."
                className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is_active" checked={formData.is_active} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="is_active" className="text-gray-200">
                Yayında
              </Label>
            </div>
            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Link Ekle
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white overflow-hidden">
        <CardHeader>
          <CardTitle>Mevcut Linkler</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#2A2A2A] hover:bg-[#2A2A2A]">
                  <TableHead className="text-gray-300">Site Adı</TableHead>
                  <TableHead className="text-gray-300">URL</TableHead>
                  <TableHead className="text-gray-300">Açıklama</TableHead>
                  <TableHead className="text-gray-300">Durum</TableHead>
                  <TableHead className="text-gray-300">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.length > 0 ? (
                  campaigns.map((campaign: any) => (
                    <TableRow key={campaign.id} className="border-b border-[#2A2A2A] hover:bg-[#2A2A2A]">
                      <TableCell className="text-gray-300">{campaign.site_name}</TableCell>
                      <TableCell className="text-gray-300 truncate max-w-[150px]">{campaign.url}</TableCell>
                      <TableCell className="text-gray-300 truncate max-w-[200px]">
                        {campaign.description || "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            campaign.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {campaign.is_active ? "Yayında" : "Pasif"}
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
                      Henüz kampanya bulunmamaktadır.
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
