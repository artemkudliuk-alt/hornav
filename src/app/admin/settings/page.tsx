import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { sampleSettings } from "@/lib/db/mock-data";
import { SettingsManager } from "@/components/settings/settings-manager";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
          Settings
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Manage your administrator profile, lead email routing, and company defaults.
        </p>
      </div>

      <SettingsManager
        initialSettings={sampleSettings}
        currentUser={{
          id: session.user.id,
          name: session.user.name || "Danamira SuperAdmin",
          email: session.user.email || "admin@danamirashipping.com",
          role: session.user.role || "admin",
        }}
      />
    </div>
  );
}
