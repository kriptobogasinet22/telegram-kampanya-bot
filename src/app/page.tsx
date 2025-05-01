import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#121212] text-white">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-4xl font-bold text-emerald-400">Kampanya Bot</h1>
        <p className="text-lg text-gray-300">Telegram kampanya botu yönetim paneline hoş geldiniz.</p>
        <div className="flex flex-col space-y-4">
          <Link href="/admin/login">
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Admin Paneline Giriş Yap</Button>
          </Link>
          <a href="https://t.me/your_bot_username" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full border-emerald-500 text-emerald-400 hover:bg-emerald-500/10">
              Telegram Botunu Aç
            </Button>
          </a>
        </div>
      </div>
    </main>
  )
}
