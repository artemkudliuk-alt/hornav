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
import { Loader2, Save, ArrowLeft, Ship, ExternalLink } from "lucide-react";
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
    currentLocation: initialData?.currentLocation || "",
    tradingArea: initialData?.tradingArea || "",

    // Tech Specs
    dwt: initialData?.dwt || "",
    teu: initialData?.teu || "",
    cubicCapacity: initialData?.cubicCapacity || "",
    yearBuilt: initialData?.yearBuilt || "",
    flag: initialData?.flag || "",
    loa: initialData?.loa || "",
    beam: initialData?.beam || "",
    draft: initialData?.draft || "",
    maxSpeed: initialData?.maxSpeed || "",
    ecoSpeed: initialData?.ecoSpeed || "",
    classSociety: initialData?.classSociety || "",

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
              className="text-neutral-400 hover:text-white"
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
              href={`/vessel.html?id=${initialData?.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="button"
                variant="outline"
                className="bg-[#202023] border-white/10 hover:bg-white/5 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider gap-1.5 h-9 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#c89b3c]" />
                View on Site
              </Button>
            </a>
          )}
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase tracking-wider gap-2 cursor-pointer h-9"
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
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-xs">
          {error}
        </div>
      )}

      {/* Main Tabs Structure */}
      <Tabs defaultValue="base" className="space-y-6">
        <TabsList className="bg-[#202023] border border-white/5 p-1 w-full justify-start overflow-x-auto">
          <TabsTrigger value="base" className="text-xs uppercase tracking-wider">
            1. Base Details
          </TabsTrigger>
          <TabsTrigger value="specs" className="text-xs uppercase tracking-wider">
            2. Technical Specs
          </TabsTrigger>
          <TabsTrigger value="content" className="text-xs uppercase tracking-wider">
            3. Descriptions & Particulars
          </TabsTrigger>
          {isEditing && (
            <TabsTrigger value="media" className="text-xs uppercase tracking-wider">
              4. Media & PDF Docs
            </TabsTrigger>
          )}
        </TabsList>

        {/* ─── TAB 1: Base Details ──────────────────────────────── */}
        <TabsContent value="base" className="space-y-6">
          <Card className="bg-[#202023]/70 border-white/5 p-6 space-y-6">
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
                className="bg-[#18181b] border-white/10 text-white text-sm focus-visible:ring-[#c89b3c]"
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
                  className="bg-[#18181b] border-white/10 font-mono text-xs text-white"
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
                  <SelectTrigger className="bg-[#18181b] border-white/10 text-xs text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#202023] border-white/10 text-white">
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
                  <SelectTrigger className="bg-[#18181b] border-white/10 text-xs text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#202023] border-white/10 text-white">
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
                  className="bg-[#18181b] border-white/10 font-mono text-xs text-white"
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
                  className="bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2 flex flex-col justify-end">
                <label className="flex items-center gap-2 text-xs text-neutral-300 p-2.5 rounded bg-[#18181b] border border-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.priceOnRequest}
                    onChange={(e) =>
                      setFormData({ ...formData, priceOnRequest: e.target.checked })
                    }
                    className="rounded border-white/20 text-[#c89b3c] focus:ring-[#c89b3c]"
                  />
                  <span>Price on Request</span>
                </label>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Current Location / Port</Label>
                <Input
                  placeholder="e.g. Port of Piraeus, Greece"
                  value={formData.currentLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, currentLocation: e.target.value })
                  }
                  className="bg-[#18181b] border-white/10 text-xs text-white"
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
                  className="bg-[#18181b] border-white/10 text-xs text-white"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ─── TAB 2: Technical Specifications ──────────────────── */}
        <TabsContent value="specs" className="space-y-6">
          <Card className="bg-[#202023]/70 border-white/5 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Deadweight (DWT)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 7500"
                  value={formData.dwt}
                  onChange={(e) =>
                    setFormData({ ...formData, dwt: e.target.value })
                  }
                  className="bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">TEU Capacity</Label>
                <Input
                  type="number"
                  placeholder="e.g. 450"
                  value={formData.teu}
                  onChange={(e) =>
                    setFormData({ ...formData, teu: e.target.value })
                  }
                  className="bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Cubic Capacity (m³)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 9800.5"
                  value={formData.cubicCapacity}
                  onChange={(e) =>
                    setFormData({ ...formData, cubicCapacity: e.target.value })
                  }
                  className="bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Year Built</Label>
                <Input
                  type="number"
                  placeholder="e.g. 2021"
                  value={formData.yearBuilt}
                  onChange={(e) =>
                    setFormData({ ...formData, yearBuilt: e.target.value })
                  }
                  className="bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Flag State</Label>
                <Input
                  placeholder="e.g. Greece / Marshall Islands"
                  value={formData.flag}
                  onChange={(e) =>
                    setFormData({ ...formData, flag: e.target.value })
                  }
                  className="bg-[#18181b] border-white/10 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Classification Society</Label>
                <Input
                  placeholder="e.g. DNV / Lloyd's Register / ABS"
                  value={formData.classSociety}
                  onChange={(e) =>
                    setFormData({ ...formData, classSociety: e.target.value })
                  }
                  className="bg-[#18181b] border-white/10 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Length Overall (LOA, m)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 108.50"
                  value={formData.loa}
                  onChange={(e) =>
                    setFormData({ ...formData, loa: e.target.value })
                  }
                  className="bg-[#18181b] border-white/10 font-mono text-xs text-white"
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
                  className="bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Draft (m)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 6.85"
                  value={formData.draft}
                  onChange={(e) =>
                    setFormData({ ...formData, draft: e.target.value })
                  }
                  className="bg-[#18181b] border-white/10 font-mono text-xs text-white"
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
                  className="bg-[#18181b] border-white/10 font-mono text-xs text-white"
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
                  className="bg-[#18181b] border-white/10 font-mono text-xs text-white"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ─── TAB 3: Descriptions & Particulars ────────────────── */}
        <TabsContent value="content" className="space-y-6">
          <Card className="bg-[#202023]/70 border-white/5 p-6 space-y-6">
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
                  className="bg-[#18181b] border-white/10 text-xs text-white"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ─── TAB 4: Media Gallery & Documents (Only in Edit) ─── */}
        {isEditing && (
          <TabsContent value="media">
            <Card className="bg-[#202023]/70 border-white/5 p-6">
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
