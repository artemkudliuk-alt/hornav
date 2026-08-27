"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { MediaGallery } from "./media-gallery";
import { Loader2, Save, ArrowLeft, Ship, ExternalLink, Star } from "lucide-react";
import Link from "next/link";

interface VesselFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function VesselForm({ initialData, isEditing = false }: VesselFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State (Clean English)
  const [formData, setFormData] = useState({
    imoNumber: initialData?.imoNumber || "",
    name: typeof initialData?.name === "string" ? initialData?.name : (initialData?.name?.en || ""),
    type: initialData?.type || "bulk_carrier",
    status: initialData?.status || "available",
    charterRateUsd: initialData?.charterRateUsd || "",
    salePriceUsd: initialData?.salePriceUsd || "",
    priceOnRequest: initialData?.priceOnRequest ?? false,
    isFeatured: initialData?.isFeatured ?? true,
    currentLocation: initialData?.currentLocation || "",
    tradingArea: initialData?.tradingArea || "",

    // Tech Specs - Registry & Dimensions
    dwt: initialData?.dwt || "",
    gt: initialData?.gt || "",
    nt: initialData?.nt || "",
    yearBuilt: initialData?.yearBuilt || "",
    flag: initialData?.flag || "",
    classSociety: initialData?.classSociety || "",
    callSign: initialData?.callSign || "",
    officialNumber: initialData?.officialNumber || "",
    loa: initialData?.loa || "",
    beam: initialData?.beam || "",
    draft: initialData?.draft || "",
    depthMoulded: initialData?.depthMoulded || "",

    // Tech Specs - Cargo & Holds
    grainCapacity: initialData?.grainCapacity || "",
    baleCapacity: initialData?.baleCapacity || "",
    cubicCapacity: initialData?.cubicCapacity || "",
    teu: initialData?.teu || "",
    holdsCount: initialData?.holdsCount || "",
    tankTopStrength: initialData?.tankTopStrength || "",

    // Tech Specs - Machinery & Speeds
    mainEngine: initialData?.mainEngine || "",
    bowThruster: initialData?.bowThruster || "",
    maxSpeed: initialData?.maxSpeed || "",
    ecoSpeed: initialData?.ecoSpeed || "",
    fuelConsumption: initialData?.fuelConsumption || "",

    // Content & Particulars (English)
    description: typeof initialData?.description === "string" ? initialData?.description : (initialData?.description?.en || ""),
    deckEquipment: typeof initialData?.deckEquipment === "string" ? initialData?.deckEquipment : (initialData?.deckEquipment?.en || ""),
    coverImageUrl: initialData?.coverImageUrl || "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = {
      ...formData,
      name: { en: formData.name, ua: "", ru: "" },
      description: { en: formData.description, ua: "", ru: "" },
      deckEquipment: { en: formData.deckEquipment, ua: "", ru: "" },
      charterRateUsd: formData.charterRateUsd ? Number(formData.charterRateUsd) : null,
      salePriceUsd: formData.salePriceUsd ? Number(formData.salePriceUsd) : null,
      dwt: formData.dwt ? Number(formData.dwt) : null,
      teu: formData.teu ? Number(formData.teu) : null,
      cubicCapacity: formData.cubicCapacity ? Number(formData.cubicCapacity) : null,
      yearBuilt: formData.yearBuilt ? Number(formData.yearBuilt) : null,
      loa: formData.loa ? Number(formData.loa) : null,
      beam: formData.beam ? Number(formData.beam) : null,
      draft: formData.draft ? Number(formData.draft) : null,
      depthMoulded: formData.depthMoulded ? Number(formData.depthMoulded) : null,
      maxSpeed: formData.maxSpeed ? Number(formData.maxSpeed) : null,
      ecoSpeed: formData.ecoSpeed ? Number(formData.ecoSpeed) : null,
    };

    try {
      const url = isEditing
        ? `/api/vessels/${initialData.id}`
        : `/api/vessels`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save vessel");
      }

      const saved = await res.json();

      if (!isEditing) {
        router.push(`/fleet/${saved.id}`);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  }

  const liveSiteUrl = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? `http://localhost:5173/vessel.html?id=${initialData?.id || "vessel-molpadia"}`
    : `https://danamiratest.vercel.app/vessel.html?id=${initialData?.id || "vessel-molpadia"}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Action Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/fleet">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-none text-neutral-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              {isEditing
                ? `Edit: ${formData.name || "Vessel"}`
                : "Add New Vessel to Fleet"}
            </h1>
            <p className="text-xs text-neutral-400">
              Manage vessel technical particulars, cargo specifications, charter terms, and media assets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing && (
            <a
              href={liveSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="button"
                variant="outline"
                className="rounded-none bg-[#202023] border-white/10 hover:bg-white/5 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider gap-1.5 h-9 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#c89b3c]" />
                View on Site
              </Button>
            </a>
          )}
          <Button
            type="submit"
            disabled={isSaving}
            className="rounded-none bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase tracking-wider gap-2 cursor-pointer h-9 shadow-md"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isEditing ? "Save Changes" : "Create Vessel"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-none text-xs">
          {error}
        </div>
      )}

      {/* Main Tabs Structure */}
      <Tabs defaultValue="base" className="space-y-6">
        <TabsList className="rounded-none bg-[#202023] border border-white/5 p-1 w-full justify-start overflow-x-auto">
          <TabsTrigger value="base" className="rounded-none text-xs uppercase tracking-wider">
            1. Base Details
          </TabsTrigger>
          <TabsTrigger value="specs" className="rounded-none text-xs uppercase tracking-wider">
            2. Technical Specs
          </TabsTrigger>
          <TabsTrigger value="content" className="rounded-none text-xs uppercase tracking-wider">
            3. Descriptions & Particulars
          </TabsTrigger>
          {isEditing && (
            <TabsTrigger value="media" className="rounded-none text-xs uppercase tracking-wider">
              4. Media & PDF Docs
            </TabsTrigger>
          )}
        </TabsList>

        {/* ─── TAB 1: Base Details ──────────────────────────────── */}
        <TabsContent value="base" className="space-y-6">
          <Card className="rounded-none bg-[#202023]/70 border-white/5 p-6 space-y-6 shadow-xl">
            {/* Vessel Name */}
            <div className="space-y-2">
              <Label htmlFor="vesselName" className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Ship className="w-4 h-4 text-[#c89b3c]" />
                Vessel Name
              </Label>
              <Input
                id="vesselName"
                placeholder="e.g. MV METANIRA"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="rounded-none bg-[#18181b] border-white/10 text-white text-sm focus-visible:ring-[#c89b3c]"
              />
            </div>

            {/* Grid of basic fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">IMO Number</Label>
                <Input
                  placeholder="e.g. 9823412"
                  value={formData.imoNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, imoNumber: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Vessel Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val) =>
                    setFormData({ ...formData, type: val || "bulk_carrier" })
                  }
                >
                  <SelectTrigger className="rounded-none bg-[#18181b] border-white/10 text-xs text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none bg-[#202023] border-white/10 text-white">
                    <SelectItem value="bulk_carrier">Bulk Carrier</SelectItem>
                    <SelectItem value="container">Container Ship</SelectItem>
                    <SelectItem value="tanker">Tanker</SelectItem>
                    <SelectItem value="roro">Ro-Ro Vessel</SelectItem>
                    <SelectItem value="barge">Barge</SelectItem>
                    <SelectItem value="tug">Tugboat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Operational Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData({ ...formData, status: val || "available" })
                  }
                >
                  <SelectTrigger className="rounded-none bg-[#18181b] border-white/10 text-xs text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none bg-[#202023] border-white/10 text-white">
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="chartered">Chartered</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Charter Rate ($/day)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 8500"
                  value={formData.charterRateUsd}
                  onChange={(e) =>
                    setFormData({ ...formData, charterRateUsd: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Sale Price ($ USD)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 6200000"
                  value={formData.salePriceUsd}
                  onChange={(e) =>
                    setFormData({ ...formData, salePriceUsd: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Current Location / Port</Label>
                <Input
                  placeholder="e.g. Port of Piraeus, Greece"
                  value={formData.currentLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, currentLocation: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Trading Area</Label>
                <Input
                  placeholder="e.g. Mediterranean & Black Sea"
                  value={formData.tradingArea}
                  onChange={(e) =>
                    setFormData({ ...formData, tradingArea: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
                />
              </div>
            </div>

            {/* Visibility & Pricing Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
              <label className="flex items-center gap-3 p-3.5 rounded-none bg-[#18181b] border border-white/10 hover:border-[#c89b3c]/50 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.priceOnRequest}
                  onChange={(e) =>
                    setFormData({ ...formData, priceOnRequest: e.target.checked })
                  }
                  className="w-4 h-4 rounded-none border-white/20 text-[#c89b3c] focus:ring-[#c89b3c] cursor-pointer"
                />
                <div>
                  <span className="text-xs font-semibold text-white block">Price on Request</span>
                  <span className="text-[11px] text-neutral-400 block">Hide public day rate / sale price</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-none bg-[#18181b] border border-[#c89b3c]/30 hover:border-[#c89b3c] transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="w-4 h-4 rounded-none border-white/20 text-[#c89b3c] focus:ring-[#c89b3c] cursor-pointer"
                />
                <div>
                  <span className="text-xs font-semibold text-[#c89b3c] flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-[#c89b3c]" />
                    Featured on Homepage
                  </span>
                  <span className="text-[11px] text-neutral-400 block">Display in Hero Showcase on main page</span>
                </div>
              </label>
            </div>
          </Card>
        </TabsContent>

        {/* ─── TAB 2: Technical Specifications ──────────────────── */}
        <TabsContent value="specs" className="space-y-6">
          {/* Section 1: Registry & Dimensions */}
          <Card className="rounded-none bg-[#202023]/70 border-white/5 p-6 space-y-4 shadow-xl">
            <div className="border-b border-white/5 pb-2">
              <h3 className="text-xs font-semibold text-[#c89b3c] uppercase tracking-wider">
                1. General Registry & Dimensions
              </h3>
              <p className="text-[11px] text-neutral-400">
                Core vessel identity, flag state, classification, and main hull dimensions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Deadweight (DWT, t)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 6408"
                  value={formData.dwt}
                  onChange={(e) =>
                    setFormData({ ...formData, dwt: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Gross Tonnage (GT)</Label>
                <Input
                  placeholder="e.g. 4591"
                  value={formData.gt}
                  onChange={(e) =>
                    setFormData({ ...formData, gt: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Net Tonnage (NT)</Label>
                <Input
                  placeholder="e.g. 2352"
                  value={formData.nt}
                  onChange={(e) =>
                    setFormData({ ...formData, nt: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Year Built (BLT)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 2014"
                  value={formData.yearBuilt}
                  onChange={(e) =>
                    setFormData({ ...formData, yearBuilt: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Flag State</Label>
                <Input
                  placeholder="e.g. Antigua & Barbuda"
                  value={formData.flag}
                  onChange={(e) =>
                    setFormData({ ...formData, flag: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Classification Society</Label>
                <Input
                  placeholder="e.g. DNV (Det Norske Veritas)"
                  value={formData.classSociety}
                  onChange={(e) =>
                    setFormData({ ...formData, classSociety: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Call Sign</Label>
                <Input
                  placeholder="e.g. V2FX5"
                  value={formData.callSign}
                  onChange={(e) =>
                    setFormData({ ...formData, callSign: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Official Number</Label>
                <Input
                  placeholder="e.g. 12467"
                  value={formData.officialNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, officialNumber: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Length Overall (LOA, m)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 108.20"
                  value={formData.loa}
                  onChange={(e) =>
                    setFormData({ ...formData, loa: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Beam (m)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 18.20"
                  value={formData.beam}
                  onChange={(e) =>
                    setFormData({ ...formData, beam: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Summer Draft (m)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 6.85"
                  value={formData.draft}
                  onChange={(e) =>
                    setFormData({ ...formData, draft: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Depth Moulded (m)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 9.00"
                  value={formData.depthMoulded}
                  onChange={(e) =>
                    setFormData({ ...formData, depthMoulded: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>
            </div>
          </Card>

          {/* Section 2: Cargo Holds & Capacities */}
          <Card className="rounded-none bg-[#202023]/70 border-white/5 p-6 space-y-4 shadow-xl">
            <div className="border-b border-white/5 pb-2">
              <h3 className="text-xs font-semibold text-[#c89b3c] uppercase tracking-wider">
                2. Cargo Capacities, Holds & Gear
              </h3>
              <p className="text-[11px] text-neutral-400">
                Cubic cargo volumes, grain/bale figures, hatches configuration, and floor strength.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Grain Capacity (cu.ft / m³)</Label>
                <Input
                  placeholder="e.g. 315,000 cu.ft (8,920 cu.m)"
                  value={formData.grainCapacity}
                  onChange={(e) =>
                    setFormData({ ...formData, grainCapacity: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Bale Capacity (cu.ft / m³)</Label>
                <Input
                  placeholder="e.g. 305,000 cu.ft (8,637 cu.m)"
                  value={formData.baleCapacity}
                  onChange={(e) =>
                    setFormData({ ...formData, baleCapacity: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">TEU Capacity</Label>
                <Input
                  type="number"
                  placeholder="e.g. 390"
                  value={formData.teu}
                  onChange={(e) =>
                    setFormData({ ...formData, teu: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Holds & Hatches Count</Label>
                <Input
                  placeholder="e.g. 2 Holds / 2 Hatches (2HO / 2HA)"
                  value={formData.holdsCount}
                  onChange={(e) =>
                    setFormData({ ...formData, holdsCount: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Tanktop Load Strength (MT/m²)</Label>
                <Input
                  placeholder="e.g. 15.0 MT / sq.m"
                  value={formData.tankTopStrength}
                  onChange={(e) =>
                    setFormData({ ...formData, tankTopStrength: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Total Cubic Capacity (m³)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 8950.0"
                  value={formData.cubicCapacity}
                  onChange={(e) =>
                    setFormData({ ...formData, cubicCapacity: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>
            </div>
          </Card>

          {/* Section 3: Machinery & Speeds */}
          <Card className="rounded-none bg-[#202023]/70 border-white/5 p-6 space-y-4 shadow-xl">
            <div className="border-b border-white/5 pb-2">
              <h3 className="text-xs font-semibold text-[#c89b3c] uppercase tracking-wider">
                3. Machinery, Speed & Fuel Consumption
              </h3>
              <p className="text-[11px] text-neutral-400">
                Engine models, thrusters, cruising speeds, and operational fuel burn.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-xs text-neutral-300">Main Engine Maker & Model</Label>
                <Input
                  placeholder="e.g. MAN B&W 6L27/38 (2,040 kW @ 800 RPM)"
                  value={formData.mainEngine}
                  onChange={(e) =>
                    setFormData({ ...formData, mainEngine: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Bow Thruster</Label>
                <Input
                  placeholder="e.g. Fitted (350 kW)"
                  value={formData.bowThruster}
                  onChange={(e) =>
                    setFormData({ ...formData, bowThruster: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Max Speed (knots)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 13.5"
                  value={formData.maxSpeed}
                  onChange={(e) =>
                    setFormData({ ...formData, maxSpeed: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Eco Speed (knots)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 11.0"
                  value={formData.ecoSpeed}
                  onChange={(e) =>
                    setFormData({ ...formData, ecoSpeed: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Fuel Consumption Summary</Label>
                <Input
                  placeholder="e.g. Eco: ~9.5 MT VLSFO/day at sea"
                  value={formData.fuelConsumption}
                  onChange={(e) =>
                    setFormData({ ...formData, fuelConsumption: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ─── TAB 3: Descriptions & Particulars ────────────────── */}
        <TabsContent value="content" className="space-y-6">
          <Card className="rounded-none bg-[#202023]/70 border-white/5 p-6 space-y-6 shadow-xl">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Vessel Particulars & Commercial Description
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Provide detailed cargo capabilities, hold specifications, gear, and commercial terms in English.
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">
                  Detailed Description & Cargo Capabilities
                </Label>
                <RichTextEditor
                  content={formData.description || ""}
                  onChange={(html) =>
                    setFormData({ ...formData, description: html })
                  }
                  placeholder="Detailed vessel cargo capabilities, hold cubics, certifications..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">
                  Deck Equipment & Cargo Gear
                </Label>
                <Textarea
                  rows={4}
                  placeholder="Cranes, derricks, hatch covers, grabbers, out-reaches..."
                  value={formData.deckEquipment}
                  onChange={(e) =>
                    setFormData({ ...formData, deckEquipment: e.target.value })
                  }
                  className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ─── TAB 4: Media Gallery & Documents (Only in Edit) ─── */}
        {isEditing && (
          <TabsContent value="media">
            <Card className="rounded-none bg-[#202023]/70 border-white/5 p-6 shadow-xl">
              <MediaGallery
                vesselId={initialData.id}
                initialMedia={initialData.media || []}
                onCoverChange={(url) =>
                  setFormData((prev) => ({ ...prev, coverImageUrl: url }))
                }
              />
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </form>
  );
}
