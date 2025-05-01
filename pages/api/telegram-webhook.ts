import type { NextApiRequest, NextApiResponse } from "next"
import bot from "@/lib/telegram-bot"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      console.log("Webhook tetiklendi, gelen veri:", JSON.stringify(req.body))
      await bot.handleUpdate(req.body)
      res.status(200).json({ ok: true })
    } else {
      res.status(200).json({ ok: true, message: "Webhook is ready" })
    }
  } catch (error) {
    console.error("Webhook error:", error)
    res.status(500).json({ ok: false, error: "Internal server error" })
  }
}
