"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Building,
  KeyRound,
  Save,
  Loader2,
} from "lucide-react";

interface SettingsManagerProps {
  initialSettings: any;
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export function SettingsManager({
  initialSettings,
  currentUser,
}: SettingsManagerProps) {
  // 1. Account State
  const [accountForm, setAccountForm] = useState({
    name: currentUser?.name || initialSettings?.userName || "Danamira SuperAdmin",
    email: currentUser?.email || initialSettings?.userEmail || "admin@danamirashipping.com",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [accountFeedback, setAccountFeedback] = useState<string | null>(null);

  // 2. Email Notifications State
  const [emailForm, setEmailForm] = useState({
    leadNotificationEmails:
      initialSettings?.leadNotificationEmails ||
      "chartering@danamirashipping.com, ops@danamirashipping.com",
    emailSenderName:
      initialSettings?.emailSenderName || "Danamira Shipping Freight Desk",
    autoReplySubject:
      initialSettings?.autoReplySubject ||
      "Inquiry Received — Danamira Shipping Ltd",
    autoReplyMessage:
      initialSettings?.autoReplyMessage ||
      "Thank you for contacting Danamira Shipping. Our commercial chartering desk has received your freight / vessel inquiry and will respond promptly with particulars and rate indications.",
  });
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<string | null>(null);

  // 3. General Preferences State
  const [generalForm, setGeneralForm] = useState({
    companyName: initialSettings?.companyName || "DANAMIRA SHIPPING LTD",
    defaultCurrency: initialSettings?.defaultCurrency || "USD",
    timezone: initialSettings?.timezone || "Europe/Athens",
  });
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);
  const [generalFeedback, setGeneralFeedback] = useState<string | null>(null);

  // Handlers
  async function handleSaveAccount(e: React.FormEvent) {
    e.preventDefault();
    if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmPassword) {
      setAccountFeedback("❌ New passwords do not match");
      return;
    }

    setIsSavingAccount(true);
    setAccountFeedback(null);

    try {
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: accountForm.name,
          email: accountForm.email,
          ...(accountForm.newPassword ? { password: accountForm.newPassword } : {}),
        }),
      });

      if (res.ok) {
        setAccountFeedback("✅ Account updated successfully");
        setAccountForm((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }));
        setTimeout(() => setAccountFeedback(null), 3000);
      } else {
        setAccountFeedback("❌ Failed to update account");
      }
    } catch {
      setAccountFeedback("❌ Error updating account");
    } finally {
      setIsSavingAccount(false);
    }
  }

  async function handleSaveEmailSettings(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingEmail(true);
    setEmailFeedback(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailForm),
      });

      if (res.ok) {
        setEmailFeedback("✅ Lead email settings saved successfully");
        setTimeout(() => setEmailFeedback(null), 3000);
      } else {
        setEmailFeedback("❌ Failed to save email settings");
      }
    } catch {
      setEmailFeedback("❌ Error saving email settings");
    } finally {
      setIsSavingEmail(false);
    }
  }

  async function handleSaveGeneralSettings(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingGeneral(true);
    setGeneralFeedback(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generalForm),
      });

      if (res.ok) {
        setGeneralFeedback("✅ Company preferences saved successfully");
        setTimeout(() => setGeneralFeedback(null), 3000);
      } else {
        setGeneralFeedback("❌ Failed to save preferences");
      }
    } catch {
      setGeneralFeedback("❌ Error saving preferences");
    } finally {
      setIsSavingGeneral(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ─── 1. Account & Security Card ────────────────────────── */}
      <Card className="rounded-none bg-[#202023]/70 border-white/5 p-6 shadow-xl space-y-5">
        <div className="border-b border-white/5 pb-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-[#c89b3c]" />
            1. My Account &amp; Password
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Manage your admin profile name, login email, and change your password.
          </p>
        </div>

        <form onSubmit={handleSaveAccount} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">Your Full Name</Label>
              <Input
                value={accountForm.name}
                onChange={(e) =>
                  setAccountForm({ ...accountForm, name: e.target.value })
                }
                required
                className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">Login Email Address</Label>
              <Input
                type="email"
                value={accountForm.email}
                onChange={(e) =>
                  setAccountForm({ ...accountForm, email: e.target.value })
                }
                required
                className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-neutral-400" />
                New Password (optional)
              </Label>
              <Input
                type="password"
                placeholder="Leave blank to keep current password"
                value={accountForm.newPassword}
                onChange={(e) =>
                  setAccountForm({ ...accountForm, newPassword: e.target.value })
                }
                className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">Confirm New Password</Label>
              <Input
                type="password"
                placeholder="Repeat new password"
                value={accountForm.confirmPassword}
                onChange={(e) =>
                  setAccountForm({
                    ...accountForm,
                    confirmPassword: e.target.value,
                  })
                }
                className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            {accountFeedback ? (
              <span className="text-xs font-medium text-amber-300">
                {accountFeedback}
              </span>
            ) : (
              <span />
            )}

            <Button
              type="submit"
              disabled={isSavingAccount}
              className="rounded-none bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase tracking-wider gap-2 cursor-pointer h-9 shadow-md"
            >
              {isSavingAccount ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save Account Profile
            </Button>
          </div>
        </form>
      </Card>

      {/* ─── 2. Lead Inquiries & Email Routing Card ────────────── */}
      <Card className="rounded-none bg-[#202023]/70 border-white/5 p-6 shadow-xl space-y-5">
        <div className="border-b border-white/5 pb-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#c89b3c]" />
            2. Lead Inquiries &amp; Email Routing
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Specify which email inboxes receive live freight inquiries and customize the automatic client receipt message.
          </p>
        </div>

        <form onSubmit={handleSaveEmailSettings} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-300">
              Notification Recipient Emails (comma separated)
            </Label>
            <Input
              placeholder="chartering@danamirashipping.com, ops@danamirashipping.com"
              value={emailForm.leadNotificationEmails}
              onChange={(e) =>
                setEmailForm({
                  ...emailForm,
                  leadNotificationEmails: e.target.value,
                })
              }
              required
              className="rounded-none bg-[#18181b] border-white/10 text-xs text-white font-mono"
            />
            <p className="text-[11px] text-neutral-500">
              When a client submits a freight or vessel charter request on the website, instant notifications with full cargo details will be delivered to these addresses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">Email Sender Name</Label>
              <Input
                placeholder="Danamira Shipping Freight Desk"
                value={emailForm.emailSenderName}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, emailSenderName: e.target.value })
                }
                className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">Client Auto-Reply Subject</Label>
              <Input
                placeholder="Inquiry Received — Danamira Shipping Ltd"
                value={emailForm.autoReplySubject}
                onChange={(e) =>
                  setEmailForm({
                    ...emailForm,
                    autoReplySubject: e.target.value,
                  })
                }
                className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-300">
              Client Auto-Reply Message Body
            </Label>
            <Textarea
              rows={3}
              placeholder="Write message sent automatically to the client after submitting an inquiry..."
              value={emailForm.autoReplyMessage}
              onChange={(e) =>
                setEmailForm({
                  ...emailForm,
                  autoReplyMessage: e.target.value,
                })
              }
              className="rounded-none bg-[#18181b] border-white/10 text-xs text-white leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            {emailFeedback ? (
              <span className="text-xs font-medium text-amber-300">
                {emailFeedback}
              </span>
            ) : (
              <span />
            )}

            <Button
              type="submit"
              disabled={isSavingEmail}
              className="rounded-none bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase tracking-wider gap-2 cursor-pointer h-9 shadow-md"
            >
              {isSavingEmail ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save Email Routing
            </Button>
          </div>
        </form>
      </Card>

      {/* ─── 3. Website & Company Defaults Card ─────────────────── */}
      <Card className="rounded-none bg-[#202023]/70 border-white/5 p-6 shadow-xl space-y-5">
        <div className="border-b border-white/5 pb-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-[#c89b3c]" />
            3. Website &amp; Company Defaults
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Global business parameters and default formatting options.
          </p>
        </div>

        <form onSubmit={handleSaveGeneralSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">Official Legal Name</Label>
              <Input
                value={generalForm.companyName}
                onChange={(e) =>
                  setGeneralForm({ ...generalForm, companyName: e.target.value })
                }
                required
                className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">Default Currency</Label>
              <Select
                value={generalForm.defaultCurrency}
                onValueChange={(val) =>
                  setGeneralForm({ ...generalForm, defaultCurrency: val || "USD" })
                }
              >
                <SelectTrigger className="rounded-none bg-[#18181b] border-white/10 text-xs text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none bg-[#202023] border-white/10 text-white text-xs">
                  <SelectItem value="USD">USD ($) — US Dollars</SelectItem>
                  <SelectItem value="EUR">EUR (€) — Euros</SelectItem>
                  <SelectItem value="GBP">GBP (£) — British Pounds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">System Timezone</Label>
              <Select
                value={generalForm.timezone}
                onValueChange={(val) =>
                  setGeneralForm({ ...generalForm, timezone: val || "Europe/Athens" })
                }
              >
                <SelectTrigger className="rounded-none bg-[#18181b] border-white/10 text-xs text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none bg-[#202023] border-white/10 text-white text-xs">
                  <SelectItem value="Europe/Athens">Europe/Athens (UTC+2 / +3)</SelectItem>
                  <SelectItem value="Europe/Kyiv">Europe/Kyiv (UTC+2 / +3)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (UTC+0 / +1)</SelectItem>
                  <SelectItem value="Asia/Dubai">Asia/Dubai (UTC+4)</SelectItem>
                  <SelectItem value="UTC">UTC / GMT Universal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            {generalFeedback ? (
              <span className="text-xs font-medium text-amber-300">
                {generalFeedback}
              </span>
            ) : (
              <span />
            )}

            <Button
              type="submit"
              disabled={isSavingGeneral}
              className="rounded-none bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase tracking-wider gap-2 cursor-pointer h-9 shadow-md"
            >
              {isSavingGeneral ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save Company Defaults
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
