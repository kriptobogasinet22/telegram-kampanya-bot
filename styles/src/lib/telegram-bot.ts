import { Telegraf, session, Markup } from "telegraf"
import { supabaseAdmin } from "./supabase"
import { message } from "telegraf/filters"

// Telegram bot token'ını al
const botToken = process.env.TELEGRAM_BOT_TOKEN

if (!botToken) {
  throw new Error("TELEGRAM_BOT_TOKEN çevre değişkeni tanımlanmamış!")
}

// Bot örneğini oluştur
const bot = new Telegraf(botToken)

// Middleware
bot.use(session())

// Komutlar
bot.start(async (ctx) => {
  try {
    const telegramId = ctx.from.id
    const username = ctx.from.username || ""

    // Kullanıcıyı veritabanında kontrol et
    const { data: existingUser } = await supabaseAdmin.from("users").select("*").eq("telegram_id", telegramId).single()

    if (!existingUser) {
      // Kullanıcı yoksa, yeni kullanıcı oluştur
      await supabaseAdmin.from("users").insert({
        telegram_id: telegramId,
        username: username,
      })
    }

    // Hoş geldin mesajı
    await ctx.reply(
      "Hoş Geldiniz! 👋\n\nKampanya ve fırsatları kaçırmamak için botumuzla tanışın.\n\nNasıl Kullanılır:\n• Kayıt olarak başlayın\n• Kampanya linklerini keşfedin\n• Günlük hatırlatıcıları ayarlayın",
      Markup.keyboard([
        ["📝 Kayıt Ol", "🎯 Kampanya Linkleri"],
        ["📢 Duyurular", "⏰ Günlük Hatırlatıcı"],
        ["⚙️ Ayarlar"],
      ]).resize(),
    )
  } catch (error) {
    console.error("Start komutunda hata:", error)
    await ctx.reply("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
  }
})

// Ana menü butonları için işleyiciler
bot.hears("📝 Kayıt Ol", async (ctx) => {
  await ctx.reply("Lütfen bir kullanıcı adı seçin:")
  // Kullanıcıyı kayıt moduna al
  ctx.session = { ...ctx.session, waitingForNickname: true }
})

// Kullanıcı adı girişini bekle
bot.on(message("text"), async (ctx) => {
  if (ctx.session?.waitingForNickname) {
    const nickname = ctx.message.text
    const telegramId = ctx.from.id

    try {
      // Kullanıcı adını güncelle
      await supabaseAdmin.from("users").update({ nickname }).eq("telegram_id", telegramId)

      // Kayıt başarılı mesajı
      await ctx.reply(
        `✅ Kayıt Başarılı\n\nMerhaba ${nickname}!\n\nBaşarıyla kayıt oldunuz. Artık tüm özellikleri kullanabilirsiniz.`,
      )

      // Kullanıcıyı kayıt modundan çıkar
      ctx.session.waitingForNickname = false
    } catch (error) {
      console.error("Kullanıcı adı güncellemede hata:", error)
      await ctx.reply("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
    }
    return
  }
})

// Kampanya Linkleri
bot.hears("🎯 Kampanya Linkleri", async (ctx) => {
  try {
    // Aktif kampanyaları getir
    const { data: campaigns, error } = await supabaseAdmin.from("campaigns").select("*").eq("is_active", true)

    if (error) throw error

    if (!campaigns || campaigns.length === 0) {
      await ctx.reply("Şu anda aktif kampanya bulunmamaktadır.")
      return
    }

    // Her kampanya için mesaj gönder
    for (const campaign of campaigns) {
      const message = `*${campaign.site_name}*\n${campaign.description}`
      await ctx.reply(message, {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([Markup.button.url("Hemen Git", campaign.url)]),
      })

      // Tıklama kaydı için kullanıcı bilgilerini al
      const telegramId = ctx.from.id
      const { data: user } = await supabaseAdmin.from("users").select("id").eq("telegram_id", telegramId).single()

      if (user) {
        // Tıklama kaydı ekle
        await supabaseAdmin.from("clicks").insert({
          user_id: user.id,
          campaign_id: campaign.id,
        })
      }
    }
  } catch (error) {
    console.error("Kampanya listesinde hata:", error)
    await ctx.reply("Kampanyalar getirilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
  }
})

// Duyurular
bot.hears("📢 Duyurular", async (ctx) => {
  try {
    // Aktif duyuruları getir
    const { data: announcements, error } = await supabaseAdmin.from("announcements").select("*").eq("is_active", true)

    if (error) throw error

    if (!announcements || announcements.length === 0) {
      await ctx.reply("Şu anda aktif duyuru bulunmamaktadır.")
      return
    }

    // Her duyuru için mesaj gönder
    for (const announcement of announcements) {
      const message = `*${announcement.title}*\n\n${announcement.content}`
      await ctx.reply(message, {
        parse_mode: "Markdown",
      })
    }

    // Abone ol/çık butonu
    const telegramId = ctx.from.id
    const { data: user } = await supabaseAdmin.from("users").select("id").eq("telegram_id", telegramId).single()

    if (user) {
      const { data: subscription } = await supabaseAdmin
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("subscription_type", "announcements")
        .single()

      const isSubscribed = subscription?.is_active || false

      await ctx.reply(
        "Duyuru bildirimleri:",
        Markup.inlineKeyboard([
          Markup.button.callback(
            isSubscribed ? "❌ Abonelikten Çık" : "✅ Abone Ol",
            isSubscribed ? "unsubscribe_announcements" : "subscribe_announcements",
          ),
        ]),
      )
    }
  } catch (error) {
    console.error("Duyuru listesinde hata:", error)
    await ctx.reply("Duyurular getirilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
  }
})

// Abone ol/çık butonları için işleyiciler
bot.action("subscribe_announcements", async (ctx) => {
  try {
    const telegramId = ctx.from?.id
    if (!telegramId) return

    const { data: user } = await supabaseAdmin.from("users").select("id").eq("telegram_id", telegramId).single()

    if (user) {
      // Önce mevcut aboneliği kontrol et
      const { data: existingSubscription } = await supabaseAdmin
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("subscription_type", "announcements")
        .single()

      if (existingSubscription) {
        // Varsa güncelle
        await supabaseAdmin.from("subscriptions").update({ is_active: true }).eq("id", existingSubscription.id)
      } else {
        // Yoksa yeni ekle
        await supabaseAdmin.from("subscriptions").insert({
          user_id: user.id,
          subscription_type: "announcements",
          is_active: true,
        })
      }

      await ctx.editMessageText("Duyuru bildirimleri: ✅ Abone oldunuz")
      await ctx.editMessageReplyMarkup(
        Markup.inlineKeyboard([Markup.button.callback("❌ Abonelikten Çık", "unsubscribe_announcements")]),
      )
    }
  } catch (error) {
    console.error("Abone olmada hata:", error)
    await ctx.reply("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
  }
})

bot.action("unsubscribe_announcements", async (ctx) => {
  try {
    const telegramId = ctx.from?.id
    if (!telegramId) return

    const { data: user } = await supabaseAdmin.from("users").select("id").eq("telegram_id", telegramId).single()

    if (user) {
      await supabaseAdmin
        .from("subscriptions")
        .update({ is_active: false })
        .eq("user_id", user.id)
        .eq("subscription_type", "announcements")

      await ctx.editMessageText("Duyuru bildirimleri: ❌ Abonelikten çıktınız")
      await ctx.editMessageReplyMarkup(
        Markup.inlineKeyboard([Markup.button.callback("✅ Abone Ol", "subscribe_announcements")]),
      )
    }
  } catch (error) {
    console.error("Abonelikten çıkmada hata:", error)
    await ctx.reply("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
  }
})

// Günlük Hatırlatıcı
bot.hears("⏰ Günlük Hatırlatıcı", async (ctx) => {
  await ctx.reply(
    "Günlük kampanya hatırlatıcısı için bir saat seçin:",
    Markup.inlineKeyboard([
      [
        Markup.button.callback("09:00", "reminder_09:00"),
        Markup.button.callback("12:00", "reminder_12:00"),
        Markup.button.callback("15:00", "reminder_15:00"),
      ],
      [Markup.button.callback("18:00", "reminder_18:00"), Markup.button.callback("21:00", "reminder_21:00")],
      [Markup.button.callback("Hatırlatıcıyı Kapat", "reminder_off")],
    ]),
  )
})

// Hatırlatıcı butonları için işleyiciler
bot.action(/reminder_(\d{2}:\d{2})/, async (ctx) => {
  try {
    const match = ctx.match[1]
    const time = match
    const telegramId = ctx.from?.id

    if (!telegramId) return

    const { data: user } = await supabaseAdmin.from("users").select("id").eq("telegram_id", telegramId).single()

    if (user) {
      // Önce mevcut hatırlatıcıyı kontrol et
      const { data: existingReminder } = await supabaseAdmin
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (existingReminder) {
        // Varsa güncelle
        await supabaseAdmin.from("reminders").update({ time, is_active: true }).eq("id", existingReminder.id)
      } else {
        // Yoksa yeni ekle
        await supabaseAdmin.from("reminders").insert({
          user_id: user.id,
          time,
          is_active: true,
        })
      }

      await ctx.editMessageText(`Günlük hatırlatıcı ${time} için ayarlandı.`)
    }
  } catch (error) {
    console.error("Hatırlatıcı ayarlamada hata:", error)
    await ctx.reply("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
  }
})

bot.action("reminder_off", async (ctx) => {
  try {
    const telegramId = ctx.from?.id
    if (!telegramId) return

    const { data: user } = await supabaseAdmin.from("users").select("id").eq("telegram_id", telegramId).single()

    if (user) {
      await supabaseAdmin.from("reminders").update({ is_active: false }).eq("user_id", user.id)

      await ctx.editMessageText("Günlük hatırlatıcı kapatıldı.")
    }
  } catch (error) {
    console.error("Hatırlatıcı kapatmada hata:", error)
    await ctx.reply("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
  }
})

// Ayarlar
bot.hears("⚙️ Ayarlar", async (ctx) => {
  try {
    const telegramId = ctx.from.id

    // Kullanıcı bilgilerini getir
    const { data: user } = await supabaseAdmin.from("users").select("*").eq("telegram_id", telegramId).single()

    if (!user) {
      await ctx.reply("Kullanıcı bilgileriniz bulunamadı. Lütfen /start komutunu kullanarak yeniden başlayın.")
      return
    }

    // Abonelik durumlarını getir
    const { data: subscriptions } = await supabaseAdmin.from("subscriptions").select("*").eq("user_id", user.id)

    const announcementsSub = subscriptions?.find((s) => s.subscription_type === "announcements")?.is_active || false
    const campaignsSub = subscriptions?.find((s) => s.subscription_type === "campaigns")?.is_active || false

    // Hatırlatıcı durumunu getir
    const { data: reminder } = await supabaseAdmin
      .from("reminders")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single()

    let settingsMessage = `*Ayarlar*\n\nKullanıcı Adı: ${user.nickname || "Ayarlanmamış"}\n\n`
    settingsMessage += `*Abonelikler:*\n`
    settingsMessage += `- Duyuru Bildirimleri: ${announcementsSub ? "✅" : "❌"}\n`
    settingsMessage += `- Kampanya Bildirimleri: ${campaignsSub ? "✅" : "❌"}\n`
    settingsMessage += `- Günlük Hatırlatıcı: ${reminder ? `✅ (${reminder.time})` : "❌"}`

    await ctx.reply(settingsMessage, {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("Kullanıcı Adını Değiştir", "change_nickname")],
        [
          Markup.button.callback(
            announcementsSub ? "Duyuru Bildirimlerini Kapat" : "Duyuru Bildirimlerini Aç",
            announcementsSub ? "unsubscribe_announcements" : "subscribe_announcements",
          ),
        ],
        [
          Markup.button.callback(
            campaignsSub ? "Kampanya Bildirimlerini Kapat" : "Kampanya Bildirimlerini Aç",
            campaignsSub ? "unsubscribe_campaigns" : "subscribe_campaigns",
          ),
        ],
        [Markup.button.callback("Hatırlatıcı Ayarla", "set_reminder")],
      ]),
    })
  } catch (error) {
    console.error("Ayarlar getirilirken hata:", error)
    await ctx.reply("Ayarlar getirilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
  }
})

// Kullanıcı adı değiştirme
bot.action("change_nickname", async (ctx) => {
  await ctx.reply("Lütfen yeni kullanıcı adınızı girin:")
  ctx.session = { ...ctx.session, waitingForNickname: true }
})

// Kampanya aboneliği
bot.action("subscribe_campaigns", async (ctx) => {
  try {
    const telegramId = ctx.from?.id
    if (!telegramId) return

    const { data: user } = await supabaseAdmin.from("users").select("id").eq("telegram_id", telegramId).single()

    if (user) {
      // Önce mevcut aboneliği kontrol et
      const { data: existingSubscription } = await supabaseAdmin
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("subscription_type", "campaigns")
        .single()

      if (existingSubscription) {
        // Varsa güncelle
        await supabaseAdmin.from("subscriptions").update({ is_active: true }).eq("id", existingSubscription.id)
      } else {
        // Yoksa yeni ekle
        await supabaseAdmin.from("subscriptions").insert({
          user_id: user.id,
          subscription_type: "campaigns",
          is_active: true,
        })
      }

      await ctx.reply("Kampanya bildirimleri açıldı.")
    }
  } catch (error) {
    console.error("Kampanya aboneliğinde hata:", error)
    await ctx.reply("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
  }
})

bot.action("unsubscribe_campaigns", async (ctx) => {
  try {
    const telegramId = ctx.from?.id
    if (!telegramId) return

    const { data: user } = await supabaseAdmin.from("users").select("id").eq("telegram_id", telegramId).single()

    if (user) {
      await supabaseAdmin
        .from("subscriptions")
        .update({ is_active: false })
        .eq("user_id", user.id)
        .eq("subscription_type", "campaigns")

      await ctx.reply("Kampanya bildirimleri kapatıldı.")
    }
  } catch (error) {
    console.error("Kampanya aboneliğini kapatmada hata:", error)
    await ctx.reply("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
  }
})

bot.action("set_reminder", async (ctx) => {
  await ctx.reply(
    "Günlük kampanya hatırlatıcısı için bir saat seçin:",
    Markup.inlineKeyboard([
      [
        Markup.button.callback("09:00", "reminder_09:00"),
        Markup.button.callback("12:00", "reminder_12:00"),
        Markup.button.callback("15:00", "reminder_15:00"),
      ],
      [Markup.button.callback("18:00", "reminder_18:00"), Markup.button.callback("21:00", "reminder_21:00")],
      [Markup.button.callback("Hatırlatıcıyı Kapat", "reminder_off")],
    ]),
  )
})

// Hata yakalama
bot.catch((err, ctx) => {
  console.error(`Bot error for ${ctx.updateType}`, err)
})

export default bot
