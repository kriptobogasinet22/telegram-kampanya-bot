"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TelegramBotUI from "../telegram-bot-ui"
import WebAdminPanel from "../web-admin-panel"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-white mb-6">Telegram Bot ve Admin Panel Mockup</h1>

        <Tabs defaultValue="telegram" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#1E1E1E]">
            <TabsTrigger value="telegram" className="data-[state=active]:bg-emerald-500">
              Telegram Bot UI
            </TabsTrigger>
            <TabsTrigger value="admin" className="data-[state=active]:bg-emerald-500">
              Web Admin Paneli
            </TabsTrigger>
          </TabsList>
          <TabsContent value="telegram" className="mt-4">
            <div className="max-w-md mx-auto border-4 border-[#2A2A2A] rounded-xl overflow-hidden">
              <TelegramBotUI />
            </div>
          </TabsContent>
          <TabsContent value="admin" className="mt-4">
            <div className="border-4 border-[#2A2A2A] rounded-xl overflow-hidden">
              <WebAdminPanel />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
