import type { NextApiRequest, NextApiResponse } from "next"
import { supabaseAdmin } from "@/lib/supabase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Basit bir API anahtarı kontrolü
  const apiKey = req.headers["x-api-key"]
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    // Toplam kullanıcı sayısı
    const { count: totalUsers, error: usersError } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true })

    if (usersError) throw usersError

    // Aktif kampanya sayısı
    const { count: activeCampaigns, error: campaignsError } = await supabaseAdmin
      .from("campaigns")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    if (campaignsError) throw campaignsError

    // Son 7 gündeki yeni kullanıcılar
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: weeklySignups, error: weeklyError } = await supabaseAdmin
      .from("users")
      .select("created_at")
      .gte("created_at", sevenDaysAgo.toISOString())

    if (weeklyError) throw weeklyError

    // Günlük yeni kullanıcı sayıları
    const dailySignups = Array(7).fill(0)

    weeklySignups?.forEach((user) => {
      const date = new Date(user.created_at)
      const dayIndex = 6 - Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
      if (dayIndex >= 0 && dayIndex < 7) {
        dailySignups[dayIndex]++
      }
    })

    // Toplam tıklama sayısı
    const { count: totalClicks, error: clicksError } = await supabaseAdmin
      .from("clicks")
      .select("*", { count: "exact", head: true })

    if (clicksError) throw clicksError

    return res.status(200).json({
      totalUsers,
      activeCampaigns,
      weeklySignups: weeklySignups?.length || 0,
      dailySignups,
      totalClicks,
    })
  } catch (error) {
    console.error("API error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
