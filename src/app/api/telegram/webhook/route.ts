import { NextResponse } from "next/server";
import { bot } from "@/lib/telegram";
import { webhookCallback } from "grammy";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!bot) {
    return NextResponse.json(
      { error: "Telegram bot is not configured" },
      { status: 503 }
    );
  }

  const secret = req.headers.get("X-Telegram-Bot-Api-Secret-Token");
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
  }

  try {
    const handler = webhookCallback(bot, "std/http");
    return await handler(req);
  } catch (error) {
    console.error("Telegram webhook handling error:", error);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}
