import type { NextApiRequest, NextApiResponse } from "next"
import bot from "@/lib/telegram-bot"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Vercel URL'sini al
    const vercelUrl = process.env.VERCEL_URL || req.headers.host
    const webhookUrl = `https://${vercelUrl}/api/telegram-webhook`

    // Webhook'u ayarla
    await bot.telegram.setWebhook(webhookUrl)

    res.status(200).json({
      ok: true,
      message: "Webhook set successfully",
      webhookUrl,
    })
  } catch (error) {
    console.error("Webhook setting error:", error)
    res.status(500).json({
      ok: false,
      error: "Failed to set webhook",
    })
  }
}
