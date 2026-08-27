"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Ship,
  Plus,
  Edit3,
  Trash2,
  Star,
  Search,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface VesselItem {
  id: string;
  name: any;
  type: string;
  status: string;
  imoNumber?: string | null;
  flag?: string | null;
  dwt?: number | null;
  yearBuilt?: number | null;
  currentLocation?: string | null;
  charterRateUsd?: string | number | null;
  salePriceUsd?: string | number | null;
  priceOnRequest?: boolean | null;
  isFeatured?: boolean | null;
  coverImageUrl?: string | null;
}

interface FleetManagerProps {
  initialFleet: VesselItem[];
}

const statusConfig: Record<
  string,
  { label: string; bg: string; dot: string; text: string; border: string }
> = {
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

export function FleetManager({ initialFleet }: FleetManagerProps) {
  const [fleet, setFleet] = useState<VesselItem[]>(initialFleet);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vesselToDelete, setVesselToDelete] = useState<VesselItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter vessels
  const filteredFleet = fleet.filter((v) => {
    const name = typeof v.name === "string" ? v.name : v.name?.en || "";
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.imoNumber && v.imoNumber.includes(searchQuery)) ||
      (v.flag && v.flag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || v.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  async function confirmDelete() {
    if (!vesselToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/vessels/${vesselToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFleet((prev) => prev.filter((v) => v.id !== vesselToDelete.id));
        setVesselToDelete(null);
      } else {
        alert("Failed to delete vessel from database.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An unexpected error occurred while deleting the vessel.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            Vessel Fleet Manager ({fleet.length})
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage cargo carriers, technical particulars, charter rates, photos, and live site listings.
          </p>
        </div>

        <Link href="/fleet/new">
          <Button className="rounded-none bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase tracking-wider gap-2 cursor-pointer h-9 shadow-md">
            <Plus className="w-4 h-4" />
            Add New Vessel
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#202023]/70 border border-white/5 p-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by vessel name, IMO, flag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs rounded-none bg-[#18181b] border-white/10 text-white placeholder:text-neutral-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["all", "available", "in_transit", "chartered", "maintenance"].map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer border ${
                  statusFilter === status
                    ? "bg-[#c89b3c] text-[#141416] border-[#c89b3c]"
                    : "bg-[#18181b] text-neutral-400 border-white/5 hover:text-white hover:border-white/10"
                }`}
              >
                {status === "all" ? "All Vessels" : status.replace("_", " ")}
              </button>
            )
          )}
        </div>
      </div>

      {/* Grid of Vessels */}
      {filteredFleet.length === 0 ? (
        <Card className="rounded-none bg-[#202023]/60 border-white/5 p-12 text-center space-y-4">
          <Ship className="w-10 h-10 text-neutral-500 mx-auto" />
          <div>
            <h3 className="text-sm font-semibold text-white">No vessels found</h3>
            <p className="text-xs text-neutral-400 mt-1">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search criteria or filter."
                : "Add your first cargo ship or bulk carrier to the fleet catalog."}
            </p>
          </div>
          {searchQuery || statusFilter !== "all" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="rounded-none bg-[#18181b] border-white/10 text-xs text-neutral-300"
            >
              Clear Filters
            </Button>
          ) : (
            <Link href="/fleet/new">
              <Button
                variant="outline"
                size="sm"
                className="rounded-none bg-[#18181b] border-white/10 text-xs text-[#c89b3c]"
              >
                Add Vessel Now
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFleet.map((v) => {
            const name = typeof v.name === "string" ? v.name : v.name?.en || "Unnamed Vessel";
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

                  {/* Featured Badge */}
                  {v.isFeatured && (
                    <div className="absolute top-3 left-3 z-10">
                      <div
                        className="text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-none border border-[#c89b3c]/50 text-[#c89b3c] shadow-2xl flex items-center gap-1"
                        style={{
                          backgroundColor: "rgba(10, 10, 12, 0.92)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <Star className="w-3 h-3 fill-[#c89b3c]" />
                        <span>FEATURED</span>
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
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

                  {/* Actions: Edit & Delete Buttons */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-neutral-500 uppercase font-mono">
                      {v.type.replace("_", " ")}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <Link href={`/fleet/${v.id}`}>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="rounded-none bg-[#18181b] hover:bg-[#c89b3c] hover:text-[#141416] text-white text-xs gap-1.5 h-8 cursor-pointer font-semibold uppercase tracking-wider"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setVesselToDelete(v)}
                        className="rounded-none text-neutral-500 hover:text-red-400 hover:bg-red-500/10 h-8 px-2.5 cursor-pointer"
                        title="Delete Vessel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ─── Delete Confirmation Modal ─────────────────────────────── */}
      {vesselToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#1c1c1f] border border-white/10 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Delete Vessel From Fleet?
                </h3>
                <p className="text-xs text-neutral-400">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#141416] border border-white/5 space-y-1 text-xs">
              <div className="font-semibold text-white">
                {typeof vesselToDelete.name === "string"
                  ? vesselToDelete.name
                  : vesselToDelete.name?.en || "Vessel"}
              </div>
              <div className="text-neutral-400 font-mono text-[11px]">
                IMO: {vesselToDelete.imoNumber || "N/A"} • Status:{" "}
                {vesselToDelete.status}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isDeleting}
                onClick={() => setVesselToDelete(null)}
                className="rounded-none bg-[#141416] border-white/10 text-neutral-300 text-xs uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="rounded-none bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider gap-1.5 cursor-pointer shadow-md"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
