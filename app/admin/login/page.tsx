"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLogin() {
  const [apiKey, setApiKey] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!apiKey) {
      setError("API anahtarı gereklidir")
      return
    }

    try {
      setLoading(true)
      setError("")

      // API anahtarını doğrula
      const response = await fetch("/api/admin/stats", {
        headers: {
          "x-api-key": apiKey,
        },
      })

      if (!response.ok) {
        throw new Error("Geçersiz API anahtarı")
      }

      // API anahtarını localStorage'a kaydet
      localStorage.setItem("adminApiKey", apiKey)

      // Dashboard'a yönlendir
      router.push("/admin")
    } catch (err) {
      setError("Giriş başarısız. Geçersiz API anahtarı.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1E1E1E] border-[#2A2A2A] text-white">
        <CardHeader>
          <CardTitle className="text-xl text-emerald-400">Admin Girişi</CardTitle>
          <CardDescription className="text-gray-300">Devam etmek için API anahtarınızı girin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-gray-200">
                API Anahtarı
              </Label>
              <Input
                id="api-key"
                type="password"
                placeholder="API anahtarınızı girin"
                className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" disabled={loading}>
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
