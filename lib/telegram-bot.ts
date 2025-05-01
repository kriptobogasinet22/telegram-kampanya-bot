import { Telegraf, session } from "telegraf"
import { supabaseAdmin } from "./supabase"
import { message } from "telegraf/filters"

// Telegram bot token'ını al
const botToken = process.env.TELEGRAM_BOT_TOKEN

if (!botToken) {
  throw new Error("TELEGRAM_BOT_TOKEN çevre değişkeni tanımlanmamış!")
}

// Bot örneğini oluştur
const bot = new Telegraf(botToken)

// Debug middleware ekleyin
bot.use(async (ctx, next) => {
  console.log("Bot mesajı alındı:", JSON.stringify(ctx.update, null, 2))
  await next()
  console.log("Bot yanıtı gönderildi")
})

// Session middleware
bot.use(session())

// Komutlar
bot.start(async (ctx) => {
  try {
    console.log("Start komutu alındı:", ctx.from)
    const telegramId = ctx.from.id
    const username = ctx.from.username || ""

    // Kullanıcıyı veritabanında kontrol et
    const { data: existingUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("telegram_id", telegramId)
      .single()

    if (userError && userError.code !== "PGRST116") {
      console.error("Kullanıcı sorgulama hatası:", userError)
      throw userError
    }

    if (!existingUser) {
      // Kullanıcı yoksa, yeni kullanıcı oluştur
      const { error: insertError } = await supabaseAdmin.from("users").insert({
        telegram_id: telegramId,
        username: username,
      })

      if (insertError) {
        console.error("Kullanıcı ekleme hatası:", insertError)
        throw insertError
      }
    }

    // Hoş geldin mesajı
    await ctx.reply(
      "Hoş Geldiniz! 👋\n\nKampanya ve fırsatları kaçırmamak için botumuzla tanışın.\n\nNasıl Kullanılır:\n• Kayıt olarak başlayın\n• Kampanya linklerini keşfedin\n• Günlük hatırlatıcıları ayarlayın",
      {
        reply_markup: {
          keyboard: [["📝 Kayıt Ol", "🎯 Kampanya Linkleri"], ["📢 Duyurular", "⏰ Günlük Hatırlatıcı"], ["⚙️ Ayarlar"]],
          resize_keyboard: true,
        },
      },
    )
  } catch (error) {
    console.error("Start komutunda hata:", error)
    await ctx.reply("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
  }
})

// Test komutu ekleyelim
bot.command("test", async (ctx) => {
  await ctx.reply("Bot çalışıyor! 👍")
})

// Ana menü butonları için işleyiciler
bot.hears(["📝 Kayıt Ol", "Kayıt Ol"], async (ctx) => {
  try {
    const telegramId = ctx.from.id

    // Kullanıcının zaten kayıtlı olup olmadığını kontrol et
    const { data: existingUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("telegram_id", telegramId)
      .single()

    if (userError && userError.code !== "PGRST116") {
      console.error("Kullanıcı sorgulama hatası:", userError)
      throw userError
    }

    // Kullanıcı zaten bir nickname'e sahipse
    if (existingUser && existingUser.nickname) {
      await ctx.reply(
        `Zaten "${existingUser.nickname}" kullanıcı adıyla kayıtlısınız. Ayarlardan kullanıcı adınızı değiştirebilirsiniz.`,
      )
      return
    }

    await ctx.reply("Lütfen bir kullanıcı adı seçin:")
    // Kullanıcıyı kayıt moduna al
    ctx.session = { ...ctx.session, waitingForNickname: true }
  } catch (error) {
    console.error("Kayıt ol komutunda hata:", error)
    await ctx.reply("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
  }
})

// Kullanıcı adı girişini bekle
bot.on(message("text"), async (ctx) => {
  try {
    // Eğer kullanıcı kayıt modundaysa
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

    // Diğer butonlar için kontrol
    const text = ctx.message.text

    if (text === "🎯 Kampanya Linkleri" || text === "Kampanya Linkleri") {
      await handleCampaignLinks(ctx)
    } else if (text === "📢 Duyurular" || text === "Duyurular") {
      await handleAnnouncements(ctx)
    } else if (text === "⏰ Günlük Hatırlatıcı" || text === "Günlük Hatırlatıcı") {
      await handleDailyReminder(ctx)
    } else if (text === "⚙️ Ayarlar" || text === "Ayarlar") {
      await handleSettings(ctx)
    } else {
      // Eğer özel bir mod yoksa, mesajı anlamadığını belirt
      await ctx.reply("Üzgünüm, bu mesajı anlamadım. Lütfen menüdeki butonları kullanın.", {
        reply_markup: {
          keyboard: [["📝 Kayıt Ol", "🎯 Kampanya Linkleri"], ["📢 Duyurular", "⏰ Günlük Hatırlatıcı"], ["⚙️ Ayarlar"]],
          resize_keyboard: true,
        },
      })
    }
  } catch (error) {
    console.error("Mesaj işlemede hata:", error)
    await ctx.reply("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
  }
})

// Kampanya Linkleri işleyicisi
async function handleCampaignLinks(ctx) {
  try {
    // Kullanıcının kayıtlı olup olmadığını kontrol et
    const telegramId = ctx.from.id
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("telegram_id", telegramId)
      .single()

    if (userError) {
      console.error("Kullanıcı sorgulama hatası:", userError)
      await ctx.reply("Lütfen önce kayıt olun. '📝 Kayıt Ol' butonuna tıklayın.")
      return
    }

    if (!user.nickname) {
      await ctx.reply("Lütfen önce kayıt olun. '📝 Kayıt Ol' butonuna tıklayın.")
      return
    }

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
        reply_markup: {
          inline_keyboard: [[{ text: "Hemen Git", url: campaign.url }]],
        },
      })

      // Tıklama kaydı ekle
      await supabaseAdmin.from("clicks").insert({
        user_id: user.id,
        campaign_id: campaign.id,
      })
    }
  } catch (error) {
    console.error("Kampanya listesinde hata:", error)
    await ctx.reply("Kampanyalar getirilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
  }
}

// Duyurular işleyicisi
async function handleAnnouncements(ctx) {
  try {
    // Kullanıcının kayıtlı olup olmadığını kontrol et
    const telegramId = ctx.from.id
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("telegram_id", telegramId)
      .single()

    if (userError) {
      console.error("Kullanıcı sorgulama hatası:", userError)
      await ctx.reply("Lütfen önce kayıt olun. '📝 Kayıt Ol' butonuna tıklayın.")
      return
    }

    if (!user.nickname) {
      await ctx.reply("Lütfen önce kayıt olun. '📝 Kayıt Ol' butonuna tıklayın.")
      return
    }

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
    const { data: subscription } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("subscription_type", "announcements")
      .single()

    const isSubscribed = subscription?.is_active || false

    await ctx.reply("Duyuru bildirimleri:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: isSubscribed ? "❌ Abonelikten Çık" : "✅ Abone Ol",
              callback_data: isSubscribed ? "unsubscribe_announcements" : "subscribe_announcements",
            },
          ],
        ],
      },
    })
  } catch (error) {
    console.error("Duyuru listesinde hata:", error)
    await ctx.reply("Duyurular getirilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
  }
}

// Günlük Hatırlatıcı işleyicisi
async function handleDailyReminder(ctx) {
  try {
    // Kullanıcının kayıtlı olup olmadığını kontrol et
    const telegramId = ctx.from.id
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("telegram_id", telegramId)
      .single()

    if (userError) {
      console.error("Kullanıcı sorgulama hatası:", userError)
      await ctx.reply("Lütfen önce kayıt olun. '📝 Kayıt Ol' butonuna tıklayın.")
      return
    }

    if (!user.nickname) {
      await ctx.reply("Lütfen önce kayıt olun. '📝 Kayıt Ol' butonuna tıklayın.")
      return
    }

    await ctx.reply("Günlük kampanya hatırlatıcısı için bir saat seçin:", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "09:00", callback_data: "reminder_09:00" },
            { text: "12:00", callback_data: "reminder_12:00" },
            { text: "15:00", callback_data: "reminder_15:00" },
          ],
          [
            { text: "18:00", callback_data: "reminder_18:00" },
            { text: "21:00", callback_data: "reminder_21:00" },
          ],
          [{ text: "Hatırlatıcıyı Kapat", callback_data: "reminder_off" }],
        ],
      },
    })
  } catch (error) {
    console.error("Hatırlatıcı ayarlamada hata:", error)
    await ctx.reply("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
  }
}

// Ayarlar işleyicisi
async function handleSettings(ctx) {
  try {
    const telegramId = ctx.from.id

    // Kullanıcının kayıtlı olup olmadığını kontrol et
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("telegram_id", telegramId)
      .single()

    if (userError) {
      console.error("Kullanıcı sorgulama hatası:", userError)
      await ctx.reply("Lütfen önce kayıt olun. '📝 Kayıt Ol' butonuna tıklayın.")
      return
    }

    if (!user.nickname) {
      await ctx.reply("Lütfen önce kayıt olun. '📝 Kayıt Ol' butonuna tıklayın.")
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
      reply_markup: {
        inline_keyboard: [
          [{ text: "Kullanıcı Adını Değiştir", callback_data: "change_nickname" }],
          [
            {
              text: announcementsSub ? "Duyuru Bildirimlerini Kapat" : "Duyuru Bildirimlerini Aç",
              callback_data: announcementsSub ? "unsubscribe_announcements" : "subscribe_announcements",
            },
          ],
          [
            {
              text: campaignsSub ? "Kampanya Bildirimlerini Kapat" : "Kampanya Bildirimlerini Aç",
              callback_data: campaignsSub ? "unsubscribe_campaigns" : "subscribe_campaigns",
            },
          ],
          [{ text: "Hatırlatıcı Ayarla", callback_data: "set_reminder" }],
        ],
      },
    })
  } catch (error) {
    console.error("Ayarlar getirilirken hata:", error)
    await ctx.reply("Ayarlar getirilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
  }
}

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
      await ctx.editMessageReplyMarkup({
        inline_keyboard: [[{ text: "❌ Abonelikten Çık", callback_data: "unsubscribe_announcements" }]],
      })
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
      await ctx.editMessageReplyMarkup({
        inline_keyboard: [[{ text: "✅ Abone Ol", callback_data: "subscribe_announcements" }]],
      })
    }
  } catch (error) {
    console.error("Abonelikten çıkmada hata:", error)
    await ctx.reply("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
  }
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

// Kullanıcı adı değiştirme
bot.action("change_nickname", async (ctx) => {
  await ctx.reply("Lütfen yeni kullanıcı adınızı girin:")
  ctx.session = { ...ctx.session, waitingForNickname: true }
})

bot.action("set_reminder", async (ctx) => {
  await ctx.reply("Günlük kampanya hatırlatıcısı için bir saat seçin:", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "09:00", callback_data: "reminder_09:00" },
          { text: "12:00", callback_data: "reminder_12:00" },
          { text: "15:00", callback_data: "reminder_15:00" },
        ],
        [
          { text: "18:00", callback_data: "reminder_18:00" },
          { text: "21:00", callback_data: "reminder_21:00" },
        ],
        [{ text: "Hatırlatıcıyı Kapat", callback_data: "reminder_off" }],
      ],
    },
  })
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

// Hata yakalama
bot.catch((err, ctx) => {
  console.error(`Bot error for ${ctx.updateType}`, err)
})

export default bot
