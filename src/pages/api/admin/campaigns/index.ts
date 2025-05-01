import type { NextApiRequest, NextApiResponse } from "next"
import { supabaseAdmin } from "@/lib/supabase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Basit bir API anahtarı kontrolü
  const apiKey = req.headers["x-api-key"]
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    switch (req.method) {
      case "GET":
        // Tüm kampanyaları getir
        const { data: campaigns, error: getError } = await supabaseAdmin
          .from("campaigns")
          .select("*")
          .order("created_at", { ascending: false })

        if (getError) throw getError
        return res.status(200).json(campaigns)

      case "POST":
        // Yeni kampanya ekle
        const { site_name, url, description, is_active } = req.body

        if (!site_name || !url) {
          return res.status(400).json({ error: "Site name and URL are required" })
        }

        const { data: newCampaign, error: postError } = await supabaseAdmin
          .from("campaigns")
          .insert({
            site_name,
            url,
            description,
            is_active: is_active !== undefined ? is_active : true,
          })
          .select()
          .single()

        if (postError) throw postError
        return res.status(201).json(newCampaign)

      default:
        return res.status(405).json({ error: "Method not allowed" })
    }
  } catch (error) {
    console.error("API error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
