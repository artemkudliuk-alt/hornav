import { db, isDbConnected } from "@/lib/db";
import { leads, vessels, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { sampleLeads } from "@/lib/db/mock-data";
import { LeadsTable } from "@/components/leads/leads-table";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LeadsPage() {
  let leadsList: any[] = [...sampleLeads];

  if (isDbConnected) {
    try {
      const data = await db
        .select({
          lead: leads,
          vessel: vessels,
          assignedUser: users,
        })
        .from(leads)
        .leftJoin(vessels, eq(leads.vesselId, vessels.id))
        .leftJoin(users, eq(leads.assignedTo, users.id))
        .orderBy(desc(leads.createdAt));
      if (data.length > 0) leadsList = data;
    } catch (err) {
      console.warn("DB offline, using sample leads list.");
    }
  }

  const formatted = leadsList.map((item) =>
    item.lead ? item : { lead: item, vessel: item.vessel || null, assignedUser: null }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
          Inbound Leads & Freight Inquiries ({formatted.length})
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Review, assign, and process cargo transportation and vessel charter inquiries in real time.
        </p>
      </div>

      <LeadsTable initialLeads={formatted} />
    </div>
  );
}
