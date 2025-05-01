import type { NextApiRequest, NextApiResponse } from "next"
import bot from "@/lib/telegram-bot"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Vercel URL'sini al
    const vercelUrl = process.env.VERCEL_URL || req.headers.host
    const webhookUrl = `https://${vercelUrl}/api/telegram-webhook`

    // Mevcut webhook'u temizle
    await bot.telegram.deleteWebhook()

    // Webhook'u ayarla
    const webhookInfo = await bot.telegram.setWebhook(webhookUrl)

    // Webhook bilgisini kontrol et
    const currentWebhook = await bot.telegram.getWebhookInfo()

    res.status(200).json({
      ok: true,
      message: "Webhook set successfully",
      webhookUrl,
      webhookInfo,
      currentWebhook,
    })
  } catch (error) {
    console.error("Webhook setting error:", error)
    res.status(500).json({
      ok: false,
      error: "Failed to set webhook",
      message: error instanceof Error ? error.message : String(error),
    })
  }
}
