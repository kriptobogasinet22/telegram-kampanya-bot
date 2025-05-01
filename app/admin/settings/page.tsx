"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
  const [botSettings, setBotSettings] = useState({
    botToken: process.env.TELEGRAM_BOT_TOKEN || "",
    botName: "KampanyaBot",
    welcomeMessage: "Hoş geldiniz! Kampanya ve fırsatları kaçırmamak için botumuzla tanışın.",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    notifyNewUsers: true,
    notifyNewCampaigns: true,
    notifyErrors: true,
  })

  const [saved, setSaved] = useState(false)

  const handleBotSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBotSettings((prev) => ({ ...prev, [name]: value }))
    setSaved(false)
  }

  const handleNotificationSettingsChange = (name: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }))
    setSaved(false)
  }

  const handleSaveBotSettings = (e: React.FormEvent) => {
    e.preventDefault()
    // Burada API'ye kaydetme işlemi yapılabilir
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleSaveNotificationSettings = (e: React.FormEvent) => {
    e.preventDefault()
    // Burada API'ye kaydetme işlemi yapılabilir
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Ayarlar</h1>

      {saved && (
        <div className="bg-emerald-500/20 text-emerald-400 p-3 rounded mb-4">Ayarlar başarıyla kaydedildi.</div>
      )}

      <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white mb-6">
        <CardHeader>
          <CardTitle>Bot Ayarları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSaveBotSettings} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="botToken" className="text-gray-200">
                Telegram Bot Token
              </Label>
              <Input
                id="botToken"
                name="botToken"
                type="password"
                value={botSettings.botToken}
                onChange={handleBotSettingsChange}
                className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="botName" className="text-gray-200">
                Bot Adı
              </Label>
              <Input
                id="botName"
                name="botName"
                value={botSettings.botName}
                onChange={handleBotSettingsChange}
                className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="welcomeMessage" className="text-gray-200">
                Karşılama Mesajı
              </Label>
              <Textarea
                id="welcomeMessage"
                name="welcomeMessage"
                value={botSettings.welcomeMessage}
                onChange={handleBotSettingsChange}
                className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
              />
            </div>
            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Ayarları Kaydet
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
        <CardHeader>
          <CardTitle>Bildirim Ayarları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSaveNotificationSettings} className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifyNewUsers" className="text-gray-200">
                Yeni Kullanıcı Bildirimleri
              </Label>
              <Switch
                id="notifyNewUsers"
                checked={notificationSettings.notifyNewUsers}
                onCheckedChange={(checked) => handleNotificationSettingsChange("notifyNewUsers", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifyNewCampaigns" className="text-gray-200">
                Yeni Kampanya Bildirimleri
              </Label>
              <Switch
                id="notifyNewCampaigns"
                checked={notificationSettings.notifyNewCampaigns}
                onCheckedChange={(checked) => handleNotificationSettingsChange("notifyNewCampaigns", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifyErrors" className="text-gray-200">
                Hata Bildirimleri
              </Label>
              <Switch
                id="notifyErrors"
                checked={notificationSettings.notifyErrors}
                onCheckedChange={(checked) => handleNotificationSettingsChange("notifyErrors", checked)}
              />
            </div>
            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Ayarları Kaydet
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
