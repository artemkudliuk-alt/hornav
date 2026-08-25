import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Cloud,
  Code2,
  Database,
  ExternalLink,
  Mail,
  Send,
  Shield,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  const isDbConfigured = Boolean(process.env.DATABASE_URL);
  const isBlobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  const isTelegramConfigured = Boolean(process.env.TELEGRAM_BOT_TOKEN);
  const isEmailConfigured = Boolean(process.env.RESEND_API_KEY);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
          System Integrations & Settings
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Configure external notification webhooks, cloud storage, and public API access keys.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Infrastructure Services Status */}
        <Card className="bg-[#202023]/70 border-white/5 p-6 space-y-4">
          <CardHeader className="p-0">
            <CardTitle className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Cloud className="w-4 h-4 text-[#c89b3c]" />
              Cloud Infrastructure Status
            </CardTitle>
            <CardDescription className="text-xs text-neutral-400">
              Active Vercel and third-party cloud service connectors.
            </CardDescription>
          </CardHeader>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-lg bg-[#18181b] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-xs font-medium text-white block">
                    Neon PostgreSQL Database
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    Drizzle ORM Connection Pool
                  </span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-[9px] uppercase font-mono ${
                  isDbConfigured
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                {isDbConfigured ? "Connected" : "Not Set"}
              </Badge>
            </div>

            <div className="p-3 rounded-lg bg-[#18181b] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Cloud className="w-4 h-4 text-blue-400" />
                <div>
                  <span className="text-xs font-medium text-white block">
                    Vercel Blob Storage (CDN)
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    High-res Vessel Media & PDF Specs
                  </span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-[9px] uppercase font-mono ${
                  isBlobConfigured
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}
              >
                {isBlobConfigured ? "Active" : "Local Mock"}
              </Badge>
            </div>

            <div className="p-3 rounded-lg bg-[#18181b] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-[#c89b3c]" />
                <div>
                  <span className="text-xs font-medium text-white block">
                    Telegram Dispatch Bot
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    Grammy Serverless Webhook
                  </span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-[9px] uppercase font-mono ${
                  isTelegramConfigured
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}
              >
                {isTelegramConfigured ? "Enabled" : "Token Required"}
              </Badge>
            </div>

            <div className="p-3 rounded-lg bg-[#18181b] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="text-xs font-medium text-white block">
                    Resend Email Gateway
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    Transactional Inquiry Alerts
                  </span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-[9px] uppercase font-mono ${
                  isEmailConfigured
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}
              >
                {isEmailConfigured ? "Enabled" : "Optional"}
              </Badge>
            </div>
          </div>
        </Card>

        {/* 2. Public API Endpoints Directory */}
        <Card className="bg-[#202023]/70 border-white/5 p-6 space-y-4">
          <CardHeader className="p-0">
            <CardTitle className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#c89b3c]" />
              Public REST API Directory
            </CardTitle>
            <CardDescription className="text-xs text-neutral-400">
              Endpoints consumed by the landing website and external client apps.
            </CardDescription>
          </CardHeader>

          <div className="space-y-2.5 pt-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-[#18181b] border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#c89b3c] font-bold">GET /api/public/vessels</span>
                <Badge variant="outline" className="text-[9px]">CORS ENABLED</Badge>
              </div>
              <p className="text-[10px] text-neutral-400 font-sans">
                Returns fleet catalog with language support (?lang=en|ua|ru)
              </p>
            </div>

            <div className="p-2.5 rounded bg-[#18181b] border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#c89b3c] font-bold">GET /api/public/vessels/[id]</span>
                <Badge variant="outline" className="text-[9px]">CORS ENABLED</Badge>
              </div>
              <p className="text-[10px] text-neutral-400 font-sans">
                Returns single vessel technical specs, photos, and attached PDF documents.
              </p>
            </div>

            <div className="p-2.5 rounded bg-[#18181b] border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#c89b3c] font-bold">POST /api/public/leads</span>
                <Badge variant="outline" className="text-[9px]">PUBLIC INTAKE</Badge>
              </div>
              <p className="text-[10px] text-neutral-400 font-sans">
                Submits freight charter inquiry, records in DB, triggers Telegram + Email alerts.
              </p>
            </div>

            <div className="p-2.5 rounded bg-[#18181b] border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#c89b3c] font-bold">GET /api/public/pages/[slug]</span>
                <Badge variant="outline" className="text-[9px]">CORS ENABLED</Badge>
              </div>
              <p className="text-[10px] text-neutral-400 font-sans">
                Returns custom landing page HTML content and SEO metadata.
              </p>
            </div>

            <div className="p-2.5 rounded bg-[#18181b] border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#c89b3c] font-bold">GET /api/public/contacts</span>
                <Badge variant="outline" className="text-[9px]">CORS ENABLED</Badge>
              </div>
              <p className="text-[10px] text-neutral-400 font-sans">
                Returns global phone lines, email, WhatsApp, and port agency offices.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Telegram Bot Setup Walkthrough */}
      <Card className="bg-[#202023]/70 border-white/5 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-[#c89b3c]" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Telegram Bot Webhook Configuration Guide
          </h3>
        </div>

        <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
          <p>
            To receive live inquiry notifications and manage leads directly inside Telegram:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-neutral-400 bg-[#18181b] p-4 rounded-lg border border-white/5 font-mono text-[11px]">
            <li>Open Telegram and create a bot via <strong className="text-white">@BotFather</strong> using <code className="text-[#c89b3c]">/newbot</code>.</li>
            <li>Copy the API token and add it to your Vercel Environment Variables as <code className="text-[#c89b3c]">TELEGRAM_BOT_TOKEN</code>.</li>
            <li>
              Set your production webhook by requesting:
              <br />
              <code className="text-neutral-300 break-all select-all block p-2 mt-1 rounded bg-[#141416] border border-white/5">
                https://api.telegram.org/bot&lt;TOKEN&gt;/setWebhook?url=https://&lt;YOUR_DOMAIN&gt;/api/telegram/webhook
              </code>
            </li>
            <li>Send <code className="text-[#c89b3c]">/start</code> to your bot, copy the returned Chat ID, and link it in the <strong className="text-white">Users & Access</strong> page.</li>
          </ol>
        </div>
      </Card>
    </div>
  );
}
