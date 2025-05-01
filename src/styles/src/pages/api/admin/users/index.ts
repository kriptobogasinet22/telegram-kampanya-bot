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
        // Tüm kullanıcıları getir
        const { data: users, error: getError } = await supabaseAdmin
          .from("users")
          .select("*")
          .order("created_at", { ascending: false })

        if (getError) throw getError
        return res.status(200).json(users)

      default:
        return res.status(405).json({ error: "Method not allowed" })
    }
  } catch (error) {
    console.error("API error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
