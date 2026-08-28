"use client";

import { useState, useEffect } from "react";
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
import {
  Loader2,
  Save,
  ArrowLeft,
  Ship,
  ExternalLink,
  Star,
  Trash2,
  AlertTriangle,
  Search,
  Globe,
  Share2,
  Copy,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";

interface VesselFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function VesselForm({ initialData, isEditing = false }: VesselFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("base");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [seoPreviewMode, setSeoPreviewMode] = useState<"google" | "telegram">("google");

  // Form State (Clean English)
  const [formData, setFormData] = useState({
    imoNumber: initialData?.imoNumber || "",
    name: typeof initialData?.name === "string" ? initialData?.name : (initialData?.name?.en || ""),
    slug: initialData?.slug || (initialData?.name?.en ? initialData.name.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : ""),
    metaTitle: typeof initialData?.metaTitle === "string" ? initialData.metaTitle : (initialData?.metaTitle?.en || (initialData?.name?.en ? `${initialData.name.en} — Technical Particulars | Danamira Shipping` : "")),
    metaDescription: typeof initialData?.metaDescription === "string" ? initialData.metaDescription : (initialData?.metaDescription?.en || (initialData?.description?.en || "Commercial specifications, general arrangement plan, crane capacities, and photo inspection gallery of dry bulk cargo vessel.")),
    ogImage: initialData?.ogImage || initialData?.coverImageUrl || "",
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
    media: initialData?.media || [],
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Client-side validation: Name is mandatory
    if (!formData.name || formData.name.trim().length === 0) {
      setActiveTab("base");
      setError("Please enter the Vessel Name in Tab 1 (Base Details) before creating the vessel.");
      return;
    }

    setIsSaving(true);

    // Ensure cover image is set if media has a cover
    let finalCoverUrl = formData.coverImageUrl;
    if (formData.media && formData.media.length > 0) {
      const coverItem = formData.media.find((m: any) => m.isCover && m.type === "photo");
      if (coverItem) {
        finalCoverUrl = coverItem.url;
      } else {
        const firstPhoto = formData.media.find((m: any) => m.type === "photo");
        if (firstPhoto) finalCoverUrl = firstPhoto.url;
      }
    }

    const payload = {
      ...formData,
      coverImageUrl: finalCoverUrl,
      name: { en: formData.name.trim(), ua: "", ru: "" },
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
        const msg = data.details?.name?.en?._errors?.[0] || data.error || "Failed to save vessel";
        throw new Error(msg);
      }

      const saved = await res.json();

      if (!isEditing) {
        router.push("/fleet");
        router.refresh();
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

  const targetVesselSlug = formData.slug || initialData?.slug || initialData?.id || "vessel-molpadia";
  const [liveSiteUrl, setLiveSiteUrl] = useState<string>(
    `https://danamira-shipping.com/vessel.html?id=${targetVesselSlug}`
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const port = window.location.port ? ":5188" : "";
      const base = window.location.hostname === "localhost" ? `http://localhost${port}` : "https://danamira-shipping.com";
      setLiveSiteUrl(`${base}/vessel.html?id=${targetVesselSlug}`);
    }
  }, [targetVesselSlug]);

  async function handleDeleteVessel() {
    if (!initialData?.id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/vessels/${initialData.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/fleet");
        router.refresh();
      } else {
        alert("Failed to delete vessel.");
        setIsDeleting(false);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting vessel.");
      setIsDeleting(false);
    }
  }

  const handleCoverChange = (url: string) => {
    setFormData((prev) => ({ ...prev, coverImageUrl: url }));
  };

  const handleMediaListChange = (list: any[]) => {
    setFormData((prev) => ({ ...prev, media: list }));
  };

  return (
    <>
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
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="rounded-none bg-red-600/10 hover:bg-red-600 border-red-500/30 hover:border-red-600 text-red-400 hover:text-white text-xs font-semibold uppercase tracking-wider gap-1.5 h-9 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Vessel
                </Button>

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
              </>
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="rounded-none bg-[#202023] border border-white/5 p-1 w-full justify-start overflow-x-auto">
          <TabsTrigger value="base" className="rounded-none text-xs uppercase tracking-wider">
            1. Base Details
          </TabsTrigger>
          <TabsTrigger value="specs" className="rounded-none text-xs uppercase tracking-wider">
            2. Technical Specs
          </TabsTrigger>
          <TabsTrigger value="content" className="rounded-none text-xs uppercase tracking-wider">
            3. Descriptions &amp; Particulars
          </TabsTrigger>
          <TabsTrigger value="media" className="rounded-none text-xs uppercase tracking-wider">
            4. Photos &amp; PDF Specs
          </TabsTrigger>
          <TabsTrigger value="seo" className="rounded-none text-xs uppercase tracking-wider text-[#c89b3c] font-semibold">
            5. SEO &amp; Social Snippets
          </TabsTrigger>
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

        {/* ─── TAB 4: Media Gallery & Documents ───────────────── */}
        <TabsContent value="media" className="space-y-6">
          <Card className="rounded-none bg-[#202023]/70 border-white/5 p-6 shadow-xl">
            <MediaGallery
              vesselId={initialData?.id || "new-vessel"}
              initialMedia={
                formData.media && formData.media.length > 0
                  ? formData.media
                  : (formData.coverImageUrl
                      ? [
                          {
                            id: "cover-init",
                            url: formData.coverImageUrl,
                            type: "photo",
                            isCover: true,
                            filename: "cover.jpg",
                            sortOrder: 1,
                          },
                        ]
                      : [])
              }
              onCoverChange={handleCoverChange}
              onMediaChange={handleMediaListChange}
            />
          </Card>
        </TabsContent>

        {/* ─── TAB 5: SEO & Social Snippets ─────────────────────── */}
        <TabsContent value="seo" className="space-y-6">
          <Card className="rounded-none bg-[#202023]/70 border-white/5 p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#c89b3c]" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Vessel SEO &amp; Messenger Previews (OpenGraph)
                </h3>
              </div>
              <div className="flex items-center gap-1 bg-[#18181b] p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setSeoPreviewMode("google")}
                  className={`px-3 py-1 text-xs uppercase tracking-wider font-mono cursor-pointer transition-colors ${
                    seoPreviewMode === "google"
                      ? "bg-[#c89b3c] text-neutral-950 font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Google Preview
                </button>
                <button
                  type="button"
                  onClick={() => setSeoPreviewMode("telegram")}
                  className={`px-3 py-1 text-xs uppercase tracking-wider font-mono cursor-pointer transition-colors ${
                    seoPreviewMode === "telegram"
                      ? "bg-[#c89b3c] text-neutral-950 font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Telegram / WhatsApp Preview
                </button>
              </div>
            </div>

            {/* Live Snippet Preview Box */}
            <div className="bg-[#18181b] border border-white/10 p-4 sm:p-5 rounded-none">
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#c89b3c]" />
                Live Social / Search Snippet
              </div>

              {seoPreviewMode === "google" ? (
                /* Google Search Engine Result Preview */
                <div className="space-y-1.5 font-sans">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center text-[10px]">⚓</span>
                    <span className="text-neutral-300 font-medium">danamirashipping.com</span>
                    <span className="text-neutral-500">&rsaquo; fleet &rsaquo; {formData.slug || (formData.name ? formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "vessel")}</span>
                  </div>
                  <h4 className="text-base sm:text-lg text-[#8ab4f8] hover:underline cursor-pointer font-medium leading-tight">
                    {formData.metaTitle || (formData.name ? `${formData.name} — Technical Particulars | Danamira Shipping` : "MV MOLPADIA — Technical Particulars | Danamira Shipping")}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#bdc1c6] leading-snug line-clamp-2">
                    {formData.metaDescription || "Commercial specifications, general arrangement plan, crane capacities, and photo inspection gallery of dry bulk cargo vessel."}
                  </p>
                </div>
              ) : (
                /* Telegram / WhatsApp / Social Share Card Preview */
                <div className="bg-[#242428] border-l-4 border-[#c89b3c] p-3.5 max-w-lg rounded-sm shadow-md font-sans">
                  <div className="text-[11px] text-[#c89b3c] font-semibold tracking-wide uppercase mb-1 flex items-center justify-between">
                    <span>danamirashipping.com</span>
                    <span className="text-[10px] text-neutral-400 font-mono">Telegram / WA Preview</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-white leading-snug mb-1">
                    {formData.metaTitle || (formData.name ? `${formData.name} — Technical Particulars | Danamira Shipping` : "MV MOLPADIA — Technical Particulars | Danamira Shipping")}
                  </h4>
                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed mb-2">
                    {formData.metaDescription || "Commercial specifications, general arrangement plan, crane capacities, and photo inspection gallery of dry bulk cargo vessel."}
                  </p>
                  {(formData.ogImage || formData.coverImageUrl) ? (
                    <div
                      className="w-full h-36 rounded bg-cover bg-center border border-white/5 shadow-inner"
                      style={{ backgroundImage: `url(${formData.ogImage || formData.coverImageUrl})` }}
                    />
                  ) : (
                    <div className="w-full h-24 rounded bg-[#18181b] border border-white/5 flex items-center justify-center text-neutral-500 text-xs gap-2">
                      <ImageIcon className="w-4 h-4 text-neutral-600" />
                      <span>Vessel Cover Photo Preview</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SEO Input Fields */}
            <div className="space-y-4">
              {/* Vessel SEO Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-white">
                    SEO-заголовок (Meta Title / &lt;title&gt;)
                  </Label>
                  <span className={`text-[11px] font-mono ${(formData.metaTitle || "").length > 60 ? "text-amber-400 font-bold" : "text-emerald-400"}`}>
                    {(formData.metaTitle || "").length} / 60 characters
                  </span>
                </div>
                <Input
                  placeholder="e.g. MV METANIRA — Technical Particulars & GA Plan | Danamira Shipping"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
                />
                <p className="text-[11px] text-neutral-400">
                  Custom page title shown in browser tab and search results.
                </p>
              </div>

              {/* Permanent Link / Slug */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-white">
                  Ярлык / ЧПУ (Vessel Slug &amp; URL)
                </Label>
                <div className="flex items-center rounded-none bg-[#18181b] border border-white/10 overflow-hidden">
                  <span className="px-2.5 text-xs text-neutral-500 font-mono select-none">
                    danamirashipping.com/vessel.html?slug=
                  </span>
                  <Input
                    placeholder="metanira"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })}
                    className="rounded-none bg-transparent border-none text-xs font-mono text-white focus-visible:ring-0"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`https://danamirashipping.com/vessel.html?slug=${formData.slug || "vessel"}`);
                      setCopiedSlug(true);
                      setTimeout(() => setCopiedSlug(false), 2000);
                    }}
                    className="rounded-none px-3 text-xs text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {copiedSlug ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-white">
                    Мета-описание (Meta Description / &lt;meta name="description"&gt;)
                  </Label>
                  <span className={`text-[11px] font-mono ${(formData.metaDescription || "").length > 160 ? "text-amber-400 font-bold" : "text-emerald-400"}`}>
                    {(formData.metaDescription || "").length} / 160 characters
                  </span>
                </div>
                <Textarea
                  rows={3}
                  placeholder="e.g. Commercial specifications, general arrangement plan, crane capacities, and photo inspection gallery of dry bulk cargo vessel."
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  className="rounded-none bg-[#18181b] border-white/10 text-xs text-white resize-none"
                />
                <p className="text-[11px] text-neutral-400">
                  Snippet description for search engines and social preview cards.
                </p>
              </div>

              {/* Social Preview Image URL */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-[#c89b3c]" />
                  Social Preview Image (og:image)
                </Label>
                <Input
                  placeholder="e.g. /fleet/metanira/Vessel_Description__METANIRA.png or direct photo URL"
                  value={formData.ogImage}
                  onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                  className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
                />
                <p className="text-[11px] text-neutral-400">
                  Defaults to the primary vessel photo or a custom social card image.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </form>

    {/* ─── Delete Confirmation Modal ─────────────────────────────── */}
    {showDeleteConfirm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
        <div className="bg-[#1c1c1f] border border-white/10 max-w-md w-full p-6 space-y-4 shadow-2xl">
          <div className="flex items-center gap-3 text-red-400">
            <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Permanently Delete Vessel?
              </h3>
              <p className="text-xs text-neutral-400">
                This vessel and all associated data will be permanently removed from the fleet.
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#141416] border border-white/5 space-y-1 text-xs">
            <div className="font-semibold text-white">
              {formData.name || "Unnamed Vessel"}
            </div>
            <div className="text-neutral-400 font-mono text-[11px]">
              IMO: {formData.imoNumber || "N/A"} • Type: {formData.type}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded-none bg-[#141416] border-white/10 text-neutral-300 text-xs uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isDeleting}
              onClick={handleDeleteVessel}
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
  </>
  );
}
