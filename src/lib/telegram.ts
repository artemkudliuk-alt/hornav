import { Bot, InlineKeyboard, webhookCallback } from "grammy";
import { db } from "./db";
import { leads, vessels, users } from "./db/schema";
import { eq, desc } from "drizzle-orm";

const token = process.env.TELEGRAM_BOT_TOKEN;

export const bot = token ? new Bot(token) : null;

if (bot) {
  // ─── /start Command ──────────────────────────────────────────
  bot.command("start", async (ctx) => {
    const chatId = ctx.chat.id.toString();
    const username = ctx.from?.username || ctx.from?.first_name || "User";

    await ctx.reply(
      `⚓ *Danamira Shipping Bot*\n\n` +
      `Welcome, ${username}!\n` +
      `Your Chat ID is: \`${chatId}\`\n\n` +
      `Available commands:\n` +
      `• /leads - View recent leads\n` +
      `• /fleet - Fleet summary\n` +
      `• /vessel <name> - Search vessel details\n` +
      `• /status <leadId> <new|in_progress|completed|declined> - Update lead status`,
      { parse_mode: "Markdown" }
    );
  });

  // ─── /leads Command ──────────────────────────────────────────
  bot.command("leads", async (ctx) => {
    try {
      const recentLeads = await db
        .select()
        .from(leads)
        .orderBy(desc(leads.createdAt))
        .limit(5);

      if (recentLeads.length === 0) {
        return ctx.reply("📭 No leads found in database.");
      }

      let message = "📋 *Recent 5 Leads:*\n\n";
      for (const lead of recentLeads) {
        const date = new Date(lead.createdAt).toLocaleDateString("en-GB");
        message += `🔹 *ID:* \`${lead.id.slice(0, 8)}\` | *Status:* \`${lead.status.toUpperCase()}\`\n`;
        message += `👤 *Client:* ${lead.clientName} (${lead.clientEmail || lead.clientPhone || "No contact"})\n`;
        message += `🚢 *Route:* ${lead.loadingPort || "?"} ➔ ${lead.dischargePort || "?"}\n`;
        message += `📦 *Cargo:* ${lead.cargoType || "N/A"} (${lead.cargoVolume || "N/A"})\n`;
        message += `📅 *Date:* ${date}\n\n`;
      }

      await ctx.reply(message, { parse_mode: "Markdown" });
    } catch (err) {
      console.error("Telegram /leads error:", err);
      await ctx.reply("❌ Error fetching leads.");
    }
  });

  // ─── /fleet Command ──────────────────────────────────────────
  bot.command("fleet", async (ctx) => {
    try {
      const allVessels = await db.select().from(vessels);
      if (allVessels.length === 0) {
        return ctx.reply("⚓ No vessels in fleet database.");
      }

      const statusCounts = {
        available: allVessels.filter((v) => v.status === "available").length,
        in_transit: allVessels.filter((v) => v.status === "in_transit").length,
        chartered: allVessels.filter((v) => v.status === "chartered").length,
        maintenance: allVessels.filter((v) => v.status === "maintenance").length,
      };

      let message = `⚓ *Danamira Fleet Overview* (Total: ${allVessels.length})\n\n`;
      message += `🟢 Available: ${statusCounts.available}\n`;
      message += `🔵 In Transit: ${statusCounts.in_transit}\n`;
      message += `🟡 Chartered: ${statusCounts.chartered}\n`;
      message += `🔴 Maintenance: ${statusCounts.maintenance}\n\n`;
      message += `*Vessels:*\n`;

      for (const v of allVessels.slice(0, 10)) {
        const name = (v.name as { en: string })?.en || "Unknown";
        message += `• *${name}* [IMO: \`${v.imoNumber || "N/A"}\`] - ${v.type} (${v.status})\n`;
      }

      await ctx.reply(message, { parse_mode: "Markdown" });
    } catch (err) {
      console.error("Telegram /fleet error:", err);
      await ctx.reply("❌ Error fetching fleet summary.");
    }
  });

  // ─── /status Command ─────────────────────────────────────────
  bot.command("status", async (ctx) => {
    const text = ctx.message?.text || "";
    const parts = text.split(/\s+/).slice(1);
    if (parts.length < 2) {
      return ctx.reply("Usage: `/status <leadId> <new|in_progress|completed|declined>`", {
        parse_mode: "Markdown",
      });
    }

    const [leadIdPrefix, newStatus] = parts;
    const validStatuses = ["new", "in_progress", "completed", "declined"];
    if (!validStatuses.includes(newStatus)) {
      return ctx.reply(`Invalid status. Use one of: ${validStatuses.join(", ")}`);
    }

    try {
      const allLeads = await db.select().from(leads);
      const target = allLeads.find((l) => l.id.startsWith(leadIdPrefix));

      if (!target) {
        return ctx.reply(`❌ Lead with ID starting with \`${leadIdPrefix}\` not found.`, {
          parse_mode: "Markdown",
        });
      }

      await db
        .update(leads)
        .set({
          status: newStatus as "new" | "in_progress" | "completed" | "declined",
          updatedAt: new Date(),
        })
        .where(eq(leads.id, target.id));

      await ctx.reply(
        `✅ Lead \`${target.id.slice(0, 8)}\` (${target.clientName}) status updated to *${newStatus.toUpperCase()}*`,
        { parse_mode: "Markdown" }
      );
    } catch (err) {
      console.error("Telegram /status error:", err);
      await ctx.reply("❌ Failed to update lead status.");
    }
  });

  // ─── Callback Queries (Inline Buttons) ───────────────────────
  bot.on("callback_query:data", async (ctx) => {
    const data = ctx.callbackQuery.data;
    if (data.startsWith("lead_status:")) {
      const [, leadId, newStatus] = data.split(":");
      try {
        await db
          .update(leads)
          .set({
            status: newStatus as "new" | "in_progress" | "completed" | "declined",
            updatedAt: new Date(),
          })
          .where(eq(leads.id, leadId));

        await ctx.answerCallbackQuery({
          text: `Status updated to ${newStatus.toUpperCase()}`,
        });

        await ctx.editMessageReplyMarkup({
          reply_markup: new InlineKeyboard().text(
            `Status: ${newStatus.toUpperCase()} ✅`,
            "noop"
          ),
        });
      } catch (err) {
        console.error("Callback error:", err);
        await ctx.answerCallbackQuery({ text: "Error updating status" });
      }
    }
  });
}

// ─── Notification Dispatcher ──────────────────────────────────
export async function notifyNewLead(lead: {
  id: string;
  clientName: string;
  clientEmail?: string | null;
  clientPhone?: string | null;
  clientWhatsapp?: string | null;
  clientTelegram?: string | null;
  loadingPort?: string | null;
  dischargePort?: string | null;
  cargoType?: string | null;
  cargoVolume?: string | null;
  comment?: string | null;
  sourcePage?: string | null;
  vesselName?: string | null;
}) {
  if (!bot) {
    console.log("Telegram bot token not configured, skipping notification.");
    return;
  }

  try {
    // Find all users who have registered a telegramChatId
    const targetUsers = await db
      .select({ chatId: users.telegramChatId })
      .from(users);

    const chatIds = targetUsers
      .map((u) => u.chatId)
      .filter((id): id is string => Boolean(id));

    if (chatIds.length === 0) {
      console.log("No telegram chat IDs registered for notification.");
      return;
    }

    let text = `🚨 *NEW FREIGHT INQUIRY / LEAD*\n\n`;
    text += `👤 *Client:* ${lead.clientName}\n`;
    if (lead.clientEmail) text += `📧 *Email:* ${lead.clientEmail}\n`;
    if (lead.clientPhone) text += `📞 *Phone:* ${lead.clientPhone}\n`;
    if (lead.clientWhatsapp) text += `💬 *WhatsApp:* ${lead.clientWhatsapp}\n`;
    if (lead.clientTelegram) text += `✈️ *Telegram:* ${lead.clientTelegram}\n`;
    if (lead.vesselName) text += `🚢 *Vessel:* ${lead.vesselName}\n`;
    if (lead.loadingPort || lead.dischargePort) {
      text += `📍 *Route:* ${lead.loadingPort || "?"} ➔ ${lead.dischargePort || "?"}\n`;
    }
    if (lead.cargoType || lead.cargoVolume) {
      text += `📦 *Cargo:* ${lead.cargoType || "N/A"} (${lead.cargoVolume || "N/A"})\n`;
    }
    if (lead.comment) text += `📝 *Comment:* ${lead.comment}\n`;
    if (lead.sourcePage) text += `🔗 *Source:* \`${lead.sourcePage}\`\n`;

    const keyboard = new InlineKeyboard()
      .text("⚡ In Progress", `lead_status:${lead.id}:in_progress`)
      .text("✅ Complete", `lead_status:${lead.id}:completed`)
      .row()
      .text("❌ Decline", `lead_status:${lead.id}:declined`);

    for (const chatId of chatIds) {
      try {
        await bot.api.sendMessage(chatId, text, {
          parse_mode: "Markdown",
          reply_markup: keyboard,
        });
      } catch (err) {
        console.error(`Failed to send Telegram message to ${chatId}:`, err);
      }
    }
  } catch (err) {
    console.error("Error in notifyNewLead:", err);
  }
}
