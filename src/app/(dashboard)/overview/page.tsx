import Link from "next/link";
import { db, isDbConnected } from "@/lib/db";
import { vessels, leads, branchOffices } from "@/lib/db/schema";
import { desc, count, eq } from "drizzle-orm";
import { sampleVessels, sampleLeads, sampleBranches } from "@/lib/db/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OverviewLeads } from "@/components/dashboard/overview-leads";
import {
  ArrowUpRight,
  ChevronRight,
  Inbox,
  MapPin,
  Plus,
  Ship,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  let totalVessels = 0;
  let availableVessels = 0;
  let totalLeads = 0;
  let newLeadsCount = 0;
  let totalBranches = 0;
  let recentLeads: any[] = [];
  let recentVessels: any[] = [];

  if (isDbConnected) {
    try {
      const allVessels = await db.select().from(vessels);
      totalVessels = allVessels.length;
      availableVessels = allVessels.filter((v: any) => v.status === "available").length;
      recentVessels = allVessels.slice(0, 4);

      const allLeads = await db
        .select()
        .from(leads)
        .orderBy(desc(leads.createdAt))
        .limit(5);
      recentLeads = allLeads;
      totalLeads = (await db.select({ value: count() }).from(leads))[0]?.value || 0;
      newLeadsCount = (
        await db
          .select({ value: count() })
          .from(leads)
          .where(eq(leads.status, "new"))
      )[0]?.value || 0;

      const branchCount = (await db.select({ value: count() }).from(branchOffices))[0]?.value || 0;
      totalBranches = branchCount;
    } catch (err) {
      console.warn("DB offline, rendered with sample metrics.");
      totalVessels = sampleVessels.length;
      availableVessels = sampleVessels.filter((v) => v.status === "available").length;
      totalLeads = sampleLeads.length;
      newLeadsCount = sampleLeads.filter((l) => l.status === "new").length;
      totalBranches = sampleBranches.length;
      recentLeads = [...sampleLeads];
      recentVessels = [...sampleVessels].slice(0, 4);
    }
  } else {
    totalVessels = sampleVessels.length;
    availableVessels = sampleVessels.filter((v) => v.status === "available").length;
    totalLeads = sampleLeads.length;
    newLeadsCount = sampleLeads.filter((l) => l.status === "new").length;
    totalBranches = sampleBranches.length;
    recentLeads = [...sampleLeads];
    recentVessels = [...sampleVessels].slice(0, 4);
  }

  const vesselStatusBadge: Record<string, string> = {
    available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    in_transit: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    chartered: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    maintenance: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  const formattedLeads = recentLeads.map((item) =>
    item.lead ? item : { lead: item, vessel: item.vessel || null, assignedUser: null }
  );

  return (
    <div className="space-y-6">
      {/* Top Banner (Clean, no duplicate button) */}
      <div className="p-6 rounded-none bg-[#202023]/80 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] text-[#c89b3c] uppercase font-mono tracking-widest block mb-1">
            Operational Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Fleet Operations & Freight Control
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl font-light">
            Monitor vessel availability, customer freight requests, and regional port agency networks in real time.
          </p>
        </div>
      </div>

      {/* 3 Core Metric KPI Cards (Clean 3-Column Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Fleet */}
        <Link href="/fleet" className="block group">
          <Card className="rounded-none bg-[#202023]/70 border-white/5 hover:border-[#c89b3c]/40 transition-all p-5 h-full flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider group-hover:text-white transition-colors">
                Fleet Vessels
              </span>
              <div className="w-8 h-8 rounded-none bg-[#18181b] border border-white/5 flex items-center justify-center text-[#c89b3c] group-hover:border-[#c89b3c]/40 transition-colors">
                <Ship className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-white font-mono">{totalVessels}</div>
              <p className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-none bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                {availableVessels} available for charter
              </p>
            </div>
          </Card>
        </Link>

        {/* Metric 2: Leads */}
        <Link href="/leads" className="block group">
          <Card className="rounded-none bg-[#202023]/70 border-white/5 hover:border-[#c89b3c]/40 transition-all p-5 h-full flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider group-hover:text-white transition-colors">
                Active Inquiries
              </span>
              <div className="w-8 h-8 rounded-none bg-[#18181b] border border-white/5 flex items-center justify-center text-[#c89b3c] group-hover:border-[#c89b3c]/40 transition-colors">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-white font-mono">{totalLeads}</div>
              <p className="text-[11px] text-amber-400 mt-1.5 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-none bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                {newLeadsCount} new unprocessed
              </p>
            </div>
          </Card>
        </Link>

        {/* Metric 3: Branch Offices */}
        <Link href="/contacts" className="block group">
          <Card className="rounded-none bg-[#202023]/70 border-white/5 hover:border-[#c89b3c]/40 transition-all p-5 h-full flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider group-hover:text-white transition-colors">
                Branch Offices
              </span>
              <div className="w-8 h-8 rounded-none bg-[#18181b] border border-white/5 flex items-center justify-center text-[#c89b3c] group-hover:border-[#c89b3c]/40 transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-white font-mono">{totalBranches}</div>
              <p className="text-[11px] text-neutral-400 mt-1.5">
                Operational port agencies
              </p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Grid: Recent Leads & Fleet Quick Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Inbound Leads Table */}
        <Card className="lg:col-span-2 rounded-none bg-[#202023]/60 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/5">
            <div>
              <CardTitle className="text-base font-semibold text-white">
                Recent Inbound Inquiries
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400 mt-0.5">
                Click any inquiry to inspect details or update status
              </CardDescription>
            </div>
            <Link href="/leads">
              <Button variant="ghost" size="sm" className="rounded-none text-xs text-[#c89b3c] hover:text-white gap-1 hover:bg-white/5">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="pt-4">
            <OverviewLeads initialLeads={formattedLeads} />
          </CardContent>
        </Card>

        {/* Right 1 Col: Fleet Quick Overview */}
        <Card className="rounded-none bg-[#202023]/60 border-white/5 flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/5">
              <div>
                <CardTitle className="text-base font-semibold text-white">
                  Fleet Status
                </CardTitle>
                <CardDescription className="text-xs text-neutral-400 mt-0.5">
                  Active vessels in management
                </CardDescription>
              </div>
              <Link href="/fleet">
                <Button variant="ghost" size="sm" className="rounded-none text-xs text-[#c89b3c] hover:text-white gap-1 hover:bg-white/5">
                  Catalog <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="pt-4 space-y-2.5">
              {recentVessels.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-500">
                  No vessels cataloged yet.
                </div>
              ) : (
                recentVessels.map((v) => {
                  const name = typeof v.name === "string" ? v.name : ((v.name as any)?.en || "Unnamed Vessel");
                  return (
                    <Link
                      key={v.id}
                      href={`/fleet/${v.id}`}
                      className="block group"
                    >
                      <div className="p-3.5 rounded-none bg-[#18181b] border border-white/5 hover:border-[#c89b3c]/40 flex items-center justify-between transition-all group-hover:-translate-y-0.5">
                        <div>
                          <span className="font-semibold text-xs text-white group-hover:text-[#c89b3c] transition-colors block">
                            {name}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono mt-0.5 block">
                            IMO: {v.imoNumber || "N/A"} • {v.dwt ? `${v.dwt} DWT` : (v.type || "Vessel")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-none font-bold ${
                              vesselStatusBadge[v.status] || vesselStatusBadge.available
                            }`}
                          >
                            {(v.status || "available").replace("_", " ")}
                          </Badge>
                          <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-[#c89b3c] transition-colors" />
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </CardContent>
          </div>

          <div className="p-6 pt-2">
            <Link href="/fleet/new" className="block">
              <Button
                variant="outline"
                className="w-full rounded-none bg-[#18181b] border-dashed border-white/15 hover:border-[#c89b3c] text-xs text-neutral-300 hover:text-white cursor-pointer h-10 font-semibold uppercase tracking-wider"
              >
                <Plus className="w-3.5 h-3.5 mr-2 text-[#c89b3c]" />
                Add New Vessel
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
