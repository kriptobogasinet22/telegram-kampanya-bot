"use client"

import { useState } from "react"
import { BarChart3, Bell, Link, Settings, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function WebAdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard")

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
            onClick={() => setActiveTab("dashboard")}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === "users" ? "default" : "ghost"}
            className={`w-full justify-start ${activeTab === "users" ? "bg-emerald-500 hover:bg-emerald-600" : "text-gray-300 hover:text-white"}`}
            onClick={() => setActiveTab("users")}
          >
            <Users className="mr-2 h-4 w-4" />
            Kullanıcılar
          </Button>
          <Button
            variant={activeTab === "links" ? "default" : "ghost"}
            className={`w-full justify-start ${activeTab === "links" ? "bg-emerald-500 hover:bg-emerald-600" : "text-gray-300 hover:text-white"}`}
            onClick={() => setActiveTab("links")}
          >
            <Link className="mr-2 h-4 w-4" />
            Link Yönetimi
          </Button>
          <Button
            variant={activeTab === "announcements" ? "default" : "ghost"}
            className={`w-full justify-start ${activeTab === "announcements" ? "bg-emerald-500 hover:bg-emerald-600" : "text-gray-300 hover:text-white"}`}
            onClick={() => setActiveTab("announcements")}
          >
            <Bell className="mr-2 h-4 w-4" />
            Duyurular
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            className={`w-full justify-start ${activeTab === "settings" ? "bg-emerald-500 hover:bg-emerald-600" : "text-gray-300 hover:text-white"}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Ayarlar
          </Button>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden w-full bg-[#1E1E1E] border-b border-[#2A2A2A] p-4">
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 bg-[#2A2A2A]">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-emerald-500">
              <BarChart3 className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-emerald-500">
              <Users className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="links" className="data-[state=active]:bg-emerald-500">
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
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Toplam Kullanıcı</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-emerald-400">1,248</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Aktif Link Sayısı</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-emerald-400">24</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Haftalık Kayıt</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-emerald-400">+86</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
              <CardHeader>
                <CardTitle>Haftalık Kayıt Grafiği</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end justify-between gap-2">
                  {[35, 28, 45, 65, 53, 42, 80].map((value, i) => (
                    <div key={i} className="relative flex-1 group">
                      <div
                        className="bg-emerald-500 rounded-t-sm w-full transition-all duration-300 hover:bg-emerald-400"
                        style={{ height: `${value * 2}px` }}
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
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Kullanıcılar</h1>

            <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-[#2A2A2A] hover:bg-[#2A2A2A]">
                        <TableHead className="text-gray-300">Tarih</TableHead>
                        <TableHead className="text-gray-300">Telegram ID</TableHead>
                        <TableHead className="text-gray-300">Nick</TableHead>
                        <TableHead className="text-gray-300">Abonelik Durumu</TableHead>
                        <TableHead className="text-gray-300">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { date: "12.05.2023", id: "123456789", nick: "ahmet42", subscribed: true },
                        { date: "11.05.2023", id: "987654321", nick: "mehmet_tr", subscribed: true },
                        { date: "10.05.2023", id: "456789123", nick: "ayse_1990", subscribed: false },
                        { date: "09.05.2023", id: "789123456", nick: "fatma.k", subscribed: true },
                        { date: "08.05.2023", id: "321654987", nick: "ali_veli", subscribed: false },
                      ].map((user, i) => (
                        <TableRow key={i} className="border-b border-[#2A2A2A] hover:bg-[#2A2A2A]">
                          <TableCell className="text-gray-300">{user.date}</TableCell>
                          <TableCell className="text-gray-300">{user.id}</TableCell>
                          <TableCell className="text-gray-300">{user.nick}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${user.subscribed ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}
                            >
                              {user.subscribed ? "Aktif" : "Pasif"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 text-gray-300 hover:text-white">
                              Detay
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "links" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Link Yönetimi</h1>

            <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
              <CardHeader>
                <CardTitle>Yeni Link Ekle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-name" className="text-gray-200">
                      Site Adı
                    </Label>
                    <Input
                      id="site-name"
                      placeholder="Örn: TrendyolGO"
                      className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-url" className="text-gray-200">
                      URL
                    </Label>
                    <Input
                      id="site-url"
                      placeholder="https://..."
                      className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-desc" className="text-gray-200">
                    Açıklama
                  </Label>
                  <Textarea
                    id="site-desc"
                    placeholder="Kampanya açıklaması..."
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="site-active" defaultChecked />
                  <Label htmlFor="site-active" className="text-gray-200">
                    Yayında
                  </Label>
                </div>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Link Ekle</Button>
              </CardContent>
            </Card>

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
                      {[
                        {
                          site: "TrendyolGO",
                          url: "https://trendyol.com/go",
                          desc: "İlk siparişinize özel %50 indirim",
                          active: true,
                        },
                        {
                          site: "Getir",
                          url: "https://getir.com/promo",
                          desc: "100 TL ve üzeri alışverişlerde 30 TL indirim",
                          active: true,
                        },
                        {
                          site: "Yemeksepeti",
                          url: "https://yemeksepeti.com/campaign",
                          desc: "Yeni üyelere özel 75 TL indirim kuponu",
                          active: false,
                        },
                      ].map((link, i) => (
                        <TableRow key={i} className="border-b border-[#2A2A2A] hover:bg-[#2A2A2A]">
                          <TableCell className="text-gray-300">{link.site}</TableCell>
                          <TableCell className="text-gray-300 truncate max-w-[150px]">{link.url}</TableCell>
                          <TableCell className="text-gray-300 truncate max-w-[200px]">{link.desc}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${link.active ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}
                            >
                              {link.active ? "Yayında" : "Pasif"}
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
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "announcements" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Duyurular</h1>

            <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
              <CardHeader>
                <CardTitle>Yeni Duyuru Ekle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="announcement-title" className="text-gray-200">
                    Başlık
                  </Label>
                  <Input
                    id="announcement-title"
                    placeholder="Duyuru başlığı"
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="announcement-text" className="text-gray-200">
                    Metin
                  </Label>
                  <Textarea
                    id="announcement-text"
                    placeholder="Duyuru metni..."
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="announcement-date" className="text-gray-200">
                      Tarih
                    </Label>
                    <Input id="announcement-date" type="date" className="bg-[#2A2A2A] border-[#3A3A3A] text-white" />
                  </div>
                  <div className="flex items-center space-x-2 self-end">
                    <Switch id="announcement-active" defaultChecked />
                    <Label htmlFor="announcement-active" className="text-gray-200">
                      Yayında
                    </Label>
                  </div>
                </div>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Duyuru Ekle</Button>
              </CardContent>
            </Card>

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
                        <TableHead className="text-gray-300">Tarih</TableHead>
                        <TableHead className="text-gray-300">Durum</TableHead>
                        <TableHead className="text-gray-300">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { title: "Yeni Özellik: Günlük Hatırlatıcı", date: "12.05.2023", active: true },
                        { title: "Sistem Bakımı", date: "10.05.2023", active: true },
                        { title: "Yeni Partnerler", date: "05.05.2023", active: false },
                      ].map((announcement, i) => (
                        <TableRow key={i} className="border-b border-[#2A2A2A] hover:bg-[#2A2A2A]">
                          <TableCell className="text-gray-300">{announcement.title}</TableCell>
                          <TableCell className="text-gray-300">{announcement.date}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${announcement.active ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}
                            >
                              {announcement.active ? "Yayında" : "Pasif"}
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
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Ayarlar</h1>

            <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
              <CardHeader>
                <CardTitle>Bot Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bot-token" className="text-gray-200">
                    Telegram Bot Token
                  </Label>
                  <Input
                    id="bot-token"
                    type="password"
                    value="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bot-name" className="text-gray-200">
                    Bot Adı
                  </Label>
                  <Input id="bot-name" value="KampanyaBot" className="bg-[#2A2A2A] border-[#3A3A3A] text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="welcome-message" className="text-gray-200">
                    Karşılama Mesajı
                  </Label>
                  <Textarea
                    id="welcome-message"
                    value="Hoş geldiniz! Kampanya ve fırsatları kaçırmamak için botumuzla tanışın."
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                  />
                </div>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Ayarları Kaydet</Button>
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
              <CardHeader>
                <CardTitle>Bildirim Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-new-users" className="text-gray-200">
                    Yeni Kullanıcı Bildirimleri
                  </Label>
                  <Switch id="notify-new-users" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-new-campaigns" className="text-gray-200">
                    Yeni Kampanya Bildirimleri
                  </Label>
                  <Switch id="notify-new-campaigns" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-errors" className="text-gray-200">
                    Hata Bildirimleri
                  </Label>
                  <Switch id="notify-errors" defaultChecked />
                </div>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Ayarları Kaydet</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
