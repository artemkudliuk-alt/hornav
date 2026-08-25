import Link from "next/link";
import { db, isDbConnected } from "@/lib/db";
import { vessels, leads, pages, branchOffices } from "@/lib/db/schema";
import { desc, count, eq } from "drizzle-orm";
import { sampleVessels, sampleLeads, samplePages, sampleBranches } from "@/lib/db/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  FileText,
  Inbox,
  MapPin,
  Plus,
  Ship,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let totalVessels = sampleVessels.length;
  let availableVessels = sampleVessels.filter((v) => v.status === "available").length;
  let totalLeads = sampleLeads.length;
  let newLeadsCount = sampleLeads.filter((l) => l.status === "new").length;
  let totalPages = samplePages.length;
  let totalBranches = sampleBranches.length;
  let recentLeads: any[] = sampleLeads;
  let recentVessels: any[] = sampleVessels.slice(0, 4);

  if (isDbConnected) {
    try {
      const allVessels = await db.select().from(vessels);
      if (allVessels.length > 0) {
        totalVessels = allVessels.length;
        availableVessels = allVessels.filter((v) => v.status === "available").length;
        recentVessels = allVessels.slice(0, 4);
      }

      const allLeads = await db
        .select()
        .from(leads)
        .orderBy(desc(leads.createdAt))
        .limit(5);
      if (allLeads.length > 0) {
        recentLeads = allLeads;
        totalLeads = (await db.select({ value: count() }).from(leads))[0]?.value || 0;
        newLeadsCount = (
          await db
            .select({ value: count() })
            .from(leads)
            .where(eq(leads.status, "new"))
        )[0]?.value || 0;
      }

      const pageCount = (await db.select({ value: count() }).from(pages))[0]?.value || 0;
      if (pageCount > 0) totalPages = pageCount;

      const branchCount = (await db.select({ value: count() }).from(branchOffices))[0]?.value || 0;
      if (branchCount > 0) totalBranches = branchCount;
    } catch (err) {
      console.warn("DB offline, rendered with sample metrics.");
    }
  }

  const leadStatusBadge: Record<string, string> = {
    new: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    in_progress: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    declined: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
  };

  const vesselStatusBadge: Record<string, string> = {
    available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    in_transit: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    chartered: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    maintenance: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header Banner */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-[#202023] via-[#202023]/80 to-[#141416] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#c89b3c] uppercase font-mono tracking-widest block mb-1">
            Operational Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Fleet Operations & Freight Control
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl font-light">
            Monitor vessel availability, inbound charter inquiries, custom logistics routes, and regional agency networks in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/leads">
            <Button className="bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase tracking-wider cursor-pointer">
              <Inbox className="w-3.5 h-3.5 mr-1.5" />
              Manage Leads ({newLeadsCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Core Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Fleet */}
        <Card className="bg-[#202023]/70 border-white/5 hover:border-white/10 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Fleet Vessels
            </CardTitle>
            <Ship className="w-4 h-4 text-[#c89b3c]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">{totalVessels}</div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {availableVessels} available for charter
            </p>
          </CardContent>
        </Card>

        {/* Metric 2: Leads */}
        <Card className="bg-[#202023]/70 border-white/5 hover:border-white/10 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Active Inquiries
            </CardTitle>
            <Inbox className="w-4 h-4 text-[#c89b3c]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">{totalLeads}</div>
            <p className="text-[11px] text-amber-400 mt-1 font-medium">
              {newLeadsCount} new unprocessed
            </p>
          </CardContent>
        </Card>

        {/* Metric 3: Landing Pages */}
        <Card className="bg-[#202023]/70 border-white/5 hover:border-white/10 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Route Landings
            </CardTitle>
            <FileText className="w-4 h-4 text-[#c89b3c]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">{totalPages}</div>
            <p className="text-[11px] text-neutral-400 mt-1">
              Custom SEO landing pages
            </p>
          </CardContent>
        </Card>

        {/* Metric 4: Port Offices */}
        <Card className="bg-[#202023]/70 border-white/5 hover:border-white/10 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Branch Offices
            </CardTitle>
            <MapPin className="w-4 h-4 text-[#c89b3c]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">{totalBranches}</div>
            <p className="text-[11px] text-neutral-400 mt-1">
              Operational port agencies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Recent Leads & Fleet Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Inbound Leads Table */}
        <Card className="lg:col-span-2 bg-[#202023]/60 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-semibold text-white">
                Recent Inbound Inquiries
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Latest customer freight and charter requests
              </CardDescription>
            </div>
            <Link href="/leads">
              <Button variant="ghost" size="sm" className="text-xs text-[#c89b3c] hover:text-white gap-1">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent>
            {recentLeads.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-500">
                No inquiries recorded yet. Inbound forms on the website will feed directly into this table.
              </div>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3.5 rounded-lg bg-[#18181b]/70 border border-white/5 flex items-center justify-between gap-4 hover:border-white/10 transition-colors"
                  >
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white truncate">
                          {lead.clientName}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[9px] uppercase font-mono px-1.5 py-0 ${
                            leadStatusBadge[lead.status] || leadStatusBadge.new
                          }`}
                        >
                          {lead.status}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-2 truncate">
                        <span>{lead.loadingPort || "?"} &rarr; {lead.dischargePort || "?"}</span>
                        <span>•</span>
                        <span>{lead.cargoType || "Cargo N/A"} ({lead.cargoVolume || "Qty N/A"})</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-neutral-500 font-mono block">
                        {new Date(lead.createdAt).toLocaleDateString("en-GB")}
                      </span>
                      <Link
                        href={`/leads?id=${lead.id}`}
                        className="text-[11px] text-[#c89b3c] hover:underline mt-1 inline-block"
                      >
                        Inspect &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right 1 Col: Fleet Quick Overview */}
        <Card className="bg-[#202023]/60 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-semibold text-white">
                Fleet Status
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Active vessels in management
              </CardDescription>
            </div>
            <Link href="/fleet">
              <Button variant="ghost" size="sm" className="text-xs text-[#c89b3c] hover:text-white gap-1">
                Catalog <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="space-y-3">
            {recentVessels.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-500">
                No vessels cataloged yet.
              </div>
            ) : (
              recentVessels.map((v) => {
                const name = (v.name as any)?.en || "Unnamed Vessel";
                return (
                  <div
                    key={v.id}
                    className="p-3 rounded-lg bg-[#18181b]/70 border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-xs text-white block">
                        {name}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        IMO: {v.imoNumber || "N/A"} • {v.dwt ? `${v.dwt} DWT` : v.type}
                      </span>
                    </div>

                    <Badge
                      variant="outline"
                      className={`text-[9px] uppercase font-mono px-1.5 py-0 ${
                        vesselStatusBadge[v.status] || vesselStatusBadge.available
                      }`}
                    >
                      {v.status.replace("_", " ")}
                    </Badge>
                  </div>
                );
              })
            )}

            <div className="pt-2">
              <Link href="/fleet/new" className="block">
                <Button
                  variant="outline"
                  className="w-full bg-[#18181b] border-dashed border-white/10 hover:border-[#c89b3c]/50 text-xs text-neutral-400 hover:text-white cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-2 text-[#c89b3c]" />
                  Add New Vessel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
