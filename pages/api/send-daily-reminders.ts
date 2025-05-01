import type { NextApiRequest, NextApiResponse } from "next"
import { supabaseAdmin } from "@/lib/supabase"
import bot from "@/lib/telegram-bot"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // API anahtarı kontrolü
    const apiKey = req.headers["x-api-key"]
    if (apiKey !== process.env.CRON_API_KEY) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    // Şu anki saati al (UTC)
    const now = new Date()
    const currentHour = now.getUTCHours().toString().padStart(2, "0")
    const currentMinute = now.getUTCMinutes().toString().padStart(2, "0")
    const currentTime = `${currentHour}:${currentMinute}`

    // Bu saatte hatırlatıcısı olan kullanıcıları bul
    const { data: reminders, error } = await supabaseAdmin
      .from("reminders")
      .select("*, users!inner(*)")
      .eq("is_active", true)
      .like("time", `${currentHour}:%`)

    if (error) {
      throw error
    }

    if (!reminders || reminders.length === 0) {
      return res.status(200).json({ message: "No reminders to send" })
    }

    // Aktif kampanyaları getir
    const { data: campaigns } = await supabaseAdmin.from("campaigns").select("*").eq("is_active", true).limit(3)

    // Her kullanıcıya hatırlatıcı gönder
    for (const reminder of reminders) {
      const user = reminder.users

      try {
        await bot.telegram.sendMessage(
          user.telegram_id,
          `⏰ *Günlük Kampanya Hatırlatıcısı*\n\nMerhaba ${user.nickname || "değerli kullanıcı"}! İşte bugünün öne çıkan kampanyaları:`,
          { parse_mode: "Markdown" },
        )

        // Kampanyaları gönder
        if (campaigns && campaigns.length > 0) {
          for (const campaign of campaigns) {
            await bot.telegram.sendMessage(user.telegram_id, `*${campaign.site_name}*\n${campaign.description}`, {
              parse_mode: "Markdown",
              reply_markup: {
                inline_keyboard: [[{ text: "Hemen Git", url: campaign.url }]],
              },
            })
          }
        } else {
          await bot.telegram.sendMessage(
            user.telegram_id,
            "Bugün için aktif kampanya bulunmamaktadır. Daha sonra tekrar kontrol edin.",
          )
        }
      } catch (err) {
        console.error(`Failed to send reminder to user ${user.telegram_id}:`, err)
      }
    }

    res.status(200).json({
      message: `Sent reminders to ${reminders.length} users`,
    })
  } catch (error) {
    console.error("Error sending reminders:", error)
    res.status(500).json({ error: "Failed to send reminders" })
  }
}
