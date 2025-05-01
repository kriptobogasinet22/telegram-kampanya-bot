// src/pages/api/send-daily-reminders.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // API anahtarı kontrolü
    const apiKey = req.headers["x-api-key"]
    if (apiKey !== process.env.CRON_API_KEY) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    // Şu anki saati al (UTC)
    const now = new Date()
    
    // Tüm aktif hatırlatıcıları getir
    const { data: reminders, error } = await supabaseAdmin
      .from("reminders")
      .select("*, users!inner(*)")
      .eq("is_active", true)

    if (error) {
      throw error
    }

    if (!reminders || reminders.length === 0) {
      return res.status(200).json({ message: "No reminders to send" })
    }

    // Aktif kampanyaları getir
    const { data: campaigns } = await supabaseAdmin
      .from("campaigns")
      .select("*")
      .eq("is_active", true)
      .limit(3)

    // Şu anki saat için hatırlatıcıları filtrele
    const currentHour = now.getUTCHours().toString().padStart(2, "0")
    const filteredReminders = reminders.filter(reminder => {
      const reminderHour = reminder.time.split(":")[0]
      return reminderHour === currentHour
    })

    // Her kullanıcıya hatırlatıcı gönder
    for (const reminder of filteredReminders) {
      const user = reminder.users
      
      // Hatırlatıcı gönderme kodu...
    }

    res.status(200).json({
      message: `Sent reminders to ${filteredReminders.length} users`,
    })
  } catch (error) {
    console.error("Error sending reminders:", error)
    res.status(500).json({ error: "Failed to send reminders" })
  }
}
