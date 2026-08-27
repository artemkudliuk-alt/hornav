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

  const statusBadge: Record<string, string> = {
    available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    in_transit: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    chartered: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    maintenance: "bg-red-500/10 text-red-400 border-red-500/20",
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
          <Button className="bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase tracking-wider gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            Add New Vessel
          </Button>
        </Link>
      </div>

      {/* Grid of Vessels */}
      {fleetList.length === 0 ? (
        <Card className="bg-[#202023]/60 border-white/5 p-12 text-center space-y-4">
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
              className="bg-[#18181b] border-white/10 text-xs text-[#c89b3c]"
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

            return (
              <Card
                key={v.id}
                className="rounded-none overflow-hidden bg-[#202023]/70 border-white/5 hover:border-[#c89b3c]/40 transition-all flex flex-col group shadow-lg"
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

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-none font-bold tracking-wider shadow-md ${
                        statusBadge[v.status] || statusBadge.available
                      }`}
                    >
                      {v.status.replace("_", " ")}
                    </Badge>
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
