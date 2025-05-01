import type { NextApiRequest, NextApiResponse } from "next"
import { supabaseAdmin } from "@/lib/supabase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Basit bir API anahtarı kontrolü
  const apiKey = req.headers["x-api-key"]
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { id } = req.query

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid campaign ID" })
  }

  try {
    switch (req.method) {
      case "GET":
        // Kampanya detaylarını getir
        const { data: campaign, error: getError } = await supabaseAdmin
          .from("campaigns")
          .select("*")
          .eq("id", id)
          .single()

        if (getError) {
          if (getError.code === "PGRST116") {
            return res.status(404).json({ error: "Campaign not found" })
          }
          throw getError
        }

        return res.status(200).json(campaign)

      case "PUT":
        // Kampanyayı güncelle
        const { site_name, url, description, is_active } = req.body

        const { data: updatedCampaign, error: putError } = await supabaseAdmin
          .from("campaigns")
          .update({
            site_name,
            url,
            description,
            is_active,
            updated_at: new Date(),
          })
          .eq("id", id)
          .select()
          .single()

        if (putError) throw putError
        return res.status(200).json(updatedCampaign)

      case "DELETE":
        // Kampanyayı sil
        const { error: deleteError } = await supabaseAdmin.from("campaigns").delete().eq("id", id)

        if (deleteError) throw deleteError
        return res.status(200).json({ message: "Campaign deleted successfully" })

      default:
        return res.status(405).json({ error: "Method not allowed" })
    }
  } catch (error) {
    console.error("API error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
