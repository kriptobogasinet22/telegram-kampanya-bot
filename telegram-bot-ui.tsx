"use client"

import { useState } from "react"
import { Bell, Clock, Cog, FileText, Link } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function TelegramBotUI() {
  const [currentScreen, setCurrentScreen] = useState("start")
  const [nickname, setNickname] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [reminderTime, setReminderTime] = useState("09:00")

  const renderScreen = () => {
    switch (currentScreen) {
      case "start":
        return (
          <div className="flex flex-col space-y-6 p-4 max-w-md mx-auto">
            <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-400">Hoş Geldiniz! 👋</CardTitle>
                <CardDescription className="text-gray-300">
                  Kampanya ve fırsatları kaçırmamak için botumuzla tanışın.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-200">Nasıl Kullanılır:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    <li>Kayıt olarak başlayın</li>
                    <li>Kampanya linklerini keşfedin</li>
                    <li>Günlük hatırlatıcıları ayarlayın</li>
                  </ul>
                </div>
                <Button
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={() => setCurrentScreen("main-menu")}
                >
                  Başla
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      case "main-menu":
        return (
          <div className="flex flex-col space-y-4 p-4 max-w-md mx-auto">
            <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-400">Ana Menü</CardTitle>
                <CardDescription className="text-gray-300">Ne yapmak istersiniz?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-white border-[#2A2A2A] hover:bg-[#2A2A2A]"
                  onClick={() => setCurrentScreen("register")}
                >
                  <FileText className="mr-2 h-4 w-4 text-emerald-400" />📝 Kayıt Ol
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-white border-[#2A2A2A] hover:bg-[#2A2A2A]"
                  onClick={() => setCurrentScreen("campaign-links")}
                >
                  <Link className="mr-2 h-4 w-4 text-emerald-400" />🎯 Kampanya Linkleri
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-white border-[#2A2A2A] hover:bg-[#2A2A2A]"
                  onClick={() => setCurrentScreen("announcements")}
                >
                  <Bell className="mr-2 h-4 w-4 text-emerald-400" />📢 Duyurular
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-white border-[#2A2A2A] hover:bg-[#2A2A2A]"
                  onClick={() => setCurrentScreen("daily-reminder")}
                >
                  <Clock className="mr-2 h-4 w-4 text-emerald-400" />⏰ Günlük Hatırlatıcı
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-white border-[#2A2A2A] hover:bg-[#2A2A2A]"
                  onClick={() => setCurrentScreen("settings")}
                >
                  <Cog className="mr-2 h-4 w-4 text-emerald-400" />
                  ⚙️ Ayarlar
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      case "register":
        return (
          <div className="flex flex-col space-y-4 p-4 max-w-md mx-auto">
            <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-400">📝 Kayıt Ol</CardTitle>
                <CardDescription className="text-gray-300">Lütfen bir kullanıcı adı seçin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nickname" className="text-gray-200">
                    Kullanıcı Adı
                  </Label>
                  <Input
                    id="nickname"
                    placeholder="Kullanıcı adınızı girin"
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={() => {
                    if (nickname) setCurrentScreen("register-success")
                  }}
                  disabled={!nickname}
                >
                  Kayıt Ol
                </Button>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full text-gray-300 hover:text-white hover:bg-[#2A2A2A]"
                  onClick={() => setCurrentScreen("main-menu")}
                >
                  Geri Dön
                </Button>
              </CardFooter>
            </Card>
          </div>
        )

      case "register-success":
        return (
          <div className="flex flex-col space-y-4 p-4 max-w-md mx-auto">
            <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-400">✅ Kayıt Başarılı</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-[#2A2A2A] rounded-lg text-center">
                  <p className="text-gray-200">
                    Merhaba <span className="font-bold text-emerald-400">{nickname}</span>!
                  </p>
                  <p className="text-gray-300 mt-2">
                    Başarıyla kayıt oldunuz. Artık tüm özellikleri kullanabilirsiniz.
                  </p>
                </div>
                <Button
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={() => setCurrentScreen("main-menu")}
                >
                  Ana Menüye Dön
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      case "campaign-links":
        return (
          <div className="flex flex-col space-y-4 p-4 max-w-md mx-auto">
            <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-400">🎯 Kampanya Linkleri</CardTitle>
                <CardDescription className="text-gray-300">Güncel kampanya ve fırsatlar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { site: "TrendyolGO", desc: "İlk siparişinize özel %50 indirim", url: "#" },
                  { site: "Getir", desc: "100 TL ve üzeri alışverişlerde 30 TL indirim", url: "#" },
                  { site: "Yemeksepeti", desc: "Yeni üyelere özel 75 TL indirim kuponu", url: "#" },
                ].map((campaign, index) => (
                  <Card key={index} className="bg-[#2A2A2A] border-[#3A3A3A]">
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-lg text-white">{campaign.site}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-4">
                      <p className="text-gray-300 text-sm">{campaign.desc}</p>
                    </CardContent>
                    <CardFooter className="py-3 px-4">
                      <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" size="sm">
                        Hemen Git
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full text-gray-300 hover:text-white hover:bg-[#2A2A2A]"
                  onClick={() => setCurrentScreen("main-menu")}
                >
                  Ana Menüye Dön
                </Button>
              </CardFooter>
            </Card>
          </div>
        )

      case "announcements":
        return (
          <div className="flex flex-col space-y-4 p-4 max-w-md mx-auto">
            <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-400">📢 Duyurular</CardTitle>
                <CardDescription className="text-gray-300">Önemli bildirimler ve haberler</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Yeni Özellik: Günlük Hatırlatıcı",
                    date: "12.05.2023",
                    content: "Artık günlük kampanya hatırlatıcılarını ayarlayabilirsiniz.",
                  },
                  {
                    title: "Sistem Bakımı",
                    date: "10.05.2023",
                    content: "Yarın 03:00-05:00 arası sistem bakımda olacaktır.",
                  },
                  {
                    title: "Yeni Partnerler",
                    date: "05.05.2023",
                    content: "Yeni iş ortaklarımızla daha fazla kampanya sizlerle!",
                  },
                ].map((announcement, index) => (
                  <Card key={index} className="bg-[#2A2A2A] border-[#3A3A3A]">
                    <CardHeader className="py-3 px-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg text-white">{announcement.title}</CardTitle>
                        <span className="text-xs text-gray-400">{announcement.date}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 px-4">
                      <p className="text-gray-300 text-sm">{announcement.content}</p>
                    </CardContent>
                  </Card>
                ))}
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="subscribe" checked={isSubscribed} onCheckedChange={setIsSubscribed} />
                  <Label htmlFor="subscribe" className="text-gray-200">
                    {isSubscribed ? "Duyurulara Abonesiniz" : "Duyurulara Abone Ol"}
                  </Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full text-gray-300 hover:text-white hover:bg-[#2A2A2A]"
                  onClick={() => setCurrentScreen("main-menu")}
                >
                  Ana Menüye Dön
                </Button>
              </CardFooter>
            </Card>
          </div>
        )

      case "daily-reminder":
        return (
          <div className="flex flex-col space-y-4 p-4 max-w-md mx-auto">
            <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-400">⏰ Günlük Hatırlatıcı</CardTitle>
                <CardDescription className="text-gray-300">
                  Kampanyaları kaçırmamak için günlük hatırlatıcı ayarlayın
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-gray-200">
                    Hatırlatma Zamanı
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="time"
                      type="time"
                      className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="enable-reminder" />
                  <Label htmlFor="enable-reminder" className="text-gray-200">
                    Günlük Hatırlatıcıyı Etkinleştir
                  </Label>
                </div>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white mt-4">Kaydet</Button>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full text-gray-300 hover:text-white hover:bg-[#2A2A2A]"
                  onClick={() => setCurrentScreen("main-menu")}
                >
                  Ana Menüye Dön
                </Button>
              </CardFooter>
            </Card>
          </div>
        )

      case "settings":
        return (
          <div className="flex flex-col space-y-4 p-4 max-w-md mx-auto">
            <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-400">⚙️ Ayarlar</CardTitle>
                <CardDescription className="text-gray-300">Hesap ayarlarınızı yönetin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="change-nickname" className="text-gray-200">
                    Kullanıcı Adı
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="change-nickname"
                      placeholder="Yeni kullanıcı adı"
                      className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                    />
                    <Button variant="outline" className="border-[#3A3A3A] text-white">
                      Değiştir
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-gray-200 font-medium">Abonelikler</h3>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="announcements-sub" className="text-gray-300">
                      Duyuru Bildirimleri
                    </Label>
                    <Switch id="announcements-sub" checked={isSubscribed} onCheckedChange={setIsSubscribed} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="campaign-sub" className="text-gray-300">
                      Kampanya Bildirimleri
                    </Label>
                    <Switch id="campaign-sub" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="reminder-sub" className="text-gray-300">
                      Günlük Hatırlatıcı
                    </Label>
                    <Switch id="reminder-sub" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full text-gray-300 hover:text-white hover:bg-[#2A2A2A]"
                  onClick={() => setCurrentScreen("main-menu")}
                >
                  Ana Menüye Dön
                </Button>
              </CardFooter>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      <div className="flex-1">{renderScreen()}</div>
    </div>
  )
}
