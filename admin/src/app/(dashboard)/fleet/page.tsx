import Link from "next/link";
import Image from "next/image";
import { db, isDbConnected } from "@/lib/db";
import { vessels } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { sampleVessels } from "@/lib/db/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Anchor, Edit3, Plus, Ship } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FleetPage() {
  let fleetList: any[] = [...sampleVessels];

  if (isDbConnected) {
    try {
      const data = await db
        .select()
        .from(vessels)
        .orderBy(desc(vessels.createdAt));
      if (data.length > 0) fleetList = data;
    } catch (err) {
      console.warn("DB offline, using sample fleet list.");
    }
  }

  const statusConfig: Record<string, { label: string; bg: string; dot: string; text: string; border: string }> = {
    available: {
      label: "AVAILABLE",
      bg: "bg-[#0d0d0f]/90 backdrop-blur-md",
      text: "text-emerald-400",
      border: "border-emerald-500/40",
      dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    },
    in_transit: {
      label: "IN TRANSIT",
      bg: "bg-[#0d0d0f]/90 backdrop-blur-md",
      text: "text-blue-400",
      border: "border-blue-500/40",
      dot: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]",
    },
    chartered: {
      label: "CHARTERED",
      bg: "bg-[#0d0d0f]/90 backdrop-blur-md",
      text: "text-amber-400",
      border: "border-amber-500/40",
      dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
    },
    maintenance: {
      label: "MAINTENANCE",
      bg: "bg-[#0d0d0f]/90 backdrop-blur-md",
      text: "text-red-400",
      border: "border-red-500/40",
      dot: "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]",
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            Vessel Fleet Manager ({fleetList.length})
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage cargo carriers, technical particulars, charter rates, and photos.
          </p>
        </div>

        <Link href="/fleet/new">
          <Button className="rounded-none bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase tracking-wider gap-2 cursor-pointer h-9 shadow-md">
            <Plus className="w-4 h-4" />
            Add New Vessel
          </Button>
        </Link>
      </div>

      {/* Grid of Vessels */}
      {fleetList.length === 0 ? (
        <Card className="rounded-none bg-[#202023]/60 border-white/5 p-12 text-center space-y-4">
          <Ship className="w-10 h-10 text-neutral-500 mx-auto" />
          <div>
            <h3 className="text-sm font-semibold text-white">No vessels in catalog</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Add your first cargo ship, bulk carrier, or tanker to the fleet.
            </p>
          </div>
          <Link href="/fleet/new">
            <Button
              variant="outline"
              size="sm"
              className="rounded-none bg-[#18181b] border-white/10 text-xs text-[#c89b3c]"
            >
              Add Vessel Now
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fleetList.map((v) => {
            const name = (v.name as any)?.en || "Unnamed Vessel";
            const coverUrl = v.coverImageUrl || "/placeholder-ship.jpg";
            const s = statusConfig[v.status] || statusConfig.available;

            return (
              <Card
                key={v.id}
                className="rounded-none overflow-hidden bg-[#202023]/70 border-white/5 hover:border-[#c89b3c]/40 transition-all flex flex-col group shadow-xl"
              >
                {/* Vessel Thumbnail */}
                <div className="aspect-[16/9] relative bg-neutral-900 overflow-hidden border-b border-white/5">
                  {v.coverImageUrl ? (
                    <img
                      src={v.coverImageUrl}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#18181b] text-neutral-600">
                      <Ship className="w-10 h-10" />
                    </div>
                  )}

                  {/* High-Contrast Status Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <div
                      className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-none border shadow-2xl flex items-center gap-1.5 ${s.text} ${s.border}`}
                      style={{
                        backgroundColor: "rgba(10, 10, 12, 0.92)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                      <span>{s.label}</span>
                    </div>
                  </div>
                </div>

                {/* Vessel Content */}
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-base text-white group-hover:text-[#c89b3c] transition-colors line-clamp-1">
                        {name}
                      </h3>
                    </div>

                    <p className="text-[11px] text-neutral-400 mt-1 font-mono">
                      IMO: {v.imoNumber || "N/A"} • Flag: {v.flag || "N/A"}
                    </p>

                    {/* Quick Specs Grid */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5 text-xs">
                      <div>
                        <span className="text-[10px] text-neutral-500 block uppercase font-mono">
                          DWT
                        </span>
                        <span className="font-medium text-white font-mono">
                          {v.dwt ? `${v.dwt.toLocaleString()} t` : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block uppercase font-mono">
                          Built
                        </span>
                        <span className="font-medium text-white font-mono">
                          {v.yearBuilt || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block uppercase font-mono">
                          Location
                        </span>
                        <span className="font-medium text-neutral-300 truncate block text-[11px]">
                          {v.currentLocation || "Worldwide"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block uppercase font-mono">
                          Charter Rate
                        </span>
                        <span className="font-medium text-[#c89b3c] font-mono">
                          {v.priceOnRequest
                            ? "On Request"
                            : v.charterRateUsd
                            ? `$${Number(v.charterRateUsd).toLocaleString()}/d`
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500 uppercase font-mono">
                      {v.type.replace("_", " ")}
                    </span>

                    <Link href={`/fleet/${v.id}`}>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-none bg-[#18181b] hover:bg-[#c89b3c] hover:text-[#141416] text-white text-xs gap-1.5 h-8 cursor-pointer font-semibold uppercase tracking-wider"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Particulars
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
