"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Save,
  FileText,
  Compass,
  Trash2,
  Search,
  Globe,
  Share2,
  Sparkles,
  CheckCircle2,
  Copy,
  Image as ImageIcon,
} from "lucide-react";

interface PageFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function PageForm({ initialData, isEditing = false }: PageFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [previewMode, setPreviewMode] = useState<"google" | "telegram">("google");

  // Form state
  const [formData, setFormData] = useState({
    slug: initialData?.slug || "",
    status: initialData?.status || "published",
    includeInNav: initialData?.includeInNav ?? true,
    includeInFooter: initialData?.includeInFooter ?? false,
    pageName: initialData?.pageName || "",
    title: typeof initialData?.title === "string" ? initialData.title : (initialData?.title?.en || ""),
    metaTitle: typeof initialData?.metaTitle === "string" ? initialData.metaTitle : (initialData?.metaTitle?.en || initialData?.title?.en || ""),
    metaDescription: typeof initialData?.metaDescription === "string" ? initialData.metaDescription : (initialData?.metaDescription?.en || ""),
    ogImage: typeof initialData?.ogImage === "string" ? initialData.ogImage : (initialData?.ogImage?.en || ""),
    content: typeof initialData?.content === "string" ? initialData.content : (initialData?.content?.en || ""),
  });

  // Auto slug generation from English title if empty
  function handlePageNameChange(val: string) {
    setFormData((prev) => {
      const updated = { ...prev, pageName: val };
      if (!isEditing && !prev.slug) {
        updated.slug = val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      if (!prev.metaTitle) {
        updated.metaTitle = val ? `${val} | Danamira Shipping Ltd` : "";
      }
      return updated;
    });
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this page?")) return;
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/pages/${initialData.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete page");
      router.push("/pages");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to delete page");
      setIsDeleting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const pageTitle = formData.title || formData.pageName || formData.slug || "New Page";
    const seoTitle = formData.metaTitle || `${pageTitle} | Danamira Shipping Ltd`;
    
    const payload = {
      ...formData,
      pageName: formData.pageName || pageTitle,
      title: { en: pageTitle, ua: "", ru: "" },
      metaTitle: { en: seoTitle, ua: "", ru: "" },
      metaDescription: { en: formData.metaDescription || "", ua: "", ru: "" },
      ogImage: { en: formData.ogImage || "", ua: "", ru: "" },
      content: { en: formData.content || "", ua: "", ru: "" },
    };

    try {
      const url = isEditing
        ? `/api/pages/${initialData.id}`
        : `/api/pages`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save page");
      }

      router.push("/pages");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  }

  const cleanSlug = formData.slug ? formData.slug.replace(/^\/+/, "") : "";
  const isStaticPage = ["company.html", "fleet.html", "contacts.html", "accountability.html", "vessel.html"].includes(cleanSlug);
  const targetPath = isStaticPage ? `/${cleanSlug}` : `/page.html?slug=${cleanSlug}`;
  
  const [livePageUrl, setLivePageUrl] = useState<string>(`https://danamira-shipping.com${targetPath}`);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const port = window.location.port ? ":5188" : "";
      const base = window.location.hostname === "localhost" ? `http://localhost${port}` : "https://danamira-shipping.com";
      setLivePageUrl(`${base}${targetPath}`);
    }
  }, [targetPath]);

  const titleLength = (formData.metaTitle || formData.pageName || "").length;
  const descLength = (formData.metaDescription || "").length;

  function copySlugUrl() {
    navigator.clipboard.writeText(`https://danamira-shipping.com${targetPath}`);
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-white/5">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <Link href="/pages" className="shrink-0 mt-0.5 sm:mt-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-none text-neutral-400 hover:text-white h-9 w-9"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              {isEditing ? `Edit: ${formData.pageName || formData.slug}` : "Create New Site Page"}
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Manage page content, SEO meta tags, social previews, and navigation links.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
          {isEditing && (
            <>
              <a
                href={livePageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial"
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto rounded-none bg-[#202023] border-white/10 hover:bg-white/5 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider gap-1.5 h-9 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#c89b3c]" />
                  <span>View Live</span>
                </Button>
              </a>

              <Button
                type="button"
                variant="outline"
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex-1 sm:flex-initial rounded-none bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider gap-1.5 h-9 cursor-pointer"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Delete</span>
              </Button>
            </>
          )}

          <Button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto rounded-none bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase tracking-wider gap-2 cursor-pointer h-9 shadow-md"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isEditing ? "Save Changes" : "Publish Page"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-none text-xs">
          {error}
        </div>
      )}

      {/* Basic Settings */}
      <Card className="rounded-none bg-[#202023]/70 border-white/5 p-4 sm:p-6 space-y-5 shadow-xl">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <FileText className="w-4 h-4 text-[#c89b3c]" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            General Page Settings
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-neutral-300">Page Internal Name</Label>
            <Input
              placeholder="e.g. Careers & Crewing"
              value={formData.pageName}
              onChange={(e) => handlePageNameChange(e.target.value)}
              className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-neutral-300">Public Slug / URL</Label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-none bg-[#18181b] border border-white/10 overflow-hidden">
              <span className="px-2.5 py-1.5 sm:py-0 text-[11px] sm:text-xs text-neutral-400 font-mono bg-white/[0.02] border-b sm:border-b-0 sm:border-r border-white/5 select-none">
                danamirashipping.com/
              </span>
              <Input
                placeholder="careers"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: e.target.value.toLowerCase(),
                  })
                }
                required
                className="rounded-none bg-transparent border-none text-xs font-mono text-white focus-visible:ring-0 px-2.5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-neutral-300">Publishing Status</Label>
            <Select
              value={formData.status}
              onValueChange={(val) =>
                setFormData({ ...formData, status: val || "published" })
              }
            >
              <SelectTrigger className="rounded-none bg-[#18181b] border-white/10 text-xs text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-none bg-[#202023] border-white/10 text-white text-xs">
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Menu & Footer Placement Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/5">
          <label className="flex items-center gap-3 p-3.5 rounded-none bg-[#18181b] border border-[#c89b3c]/30 hover:border-[#c89b3c] transition-colors cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.includeInNav}
              onChange={(e) =>
                setFormData({ ...formData, includeInNav: e.target.checked })
              }
              className="w-4 h-4 rounded-none border-white/20 text-[#c89b3c] focus:ring-[#c89b3c] cursor-pointer"
            />
            <div>
              <span className="text-xs font-semibold text-[#c89b3c] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Include in Header Menu
              </span>
              <span className="text-[11px] text-neutral-400 block">
                Display in the top navigation bar across the website
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-none bg-[#18181b] border border-white/10 hover:border-[#c89b3c]/50 transition-colors cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.includeInFooter}
              onChange={(e) =>
                setFormData({ ...formData, includeInFooter: e.target.checked })
              }
              className="w-4 h-4 rounded-none border-white/20 text-[#c89b3c] focus:ring-[#c89b3c] cursor-pointer"
            />
            <div>
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#c89b3c]" />
                Include in Footer Links
              </span>
              <span className="text-[11px] text-neutral-400 block">
                Display link in the website footer columns
              </span>
            </div>
          </label>
        </div>
      </Card>

      {/* SEO & Search / Social Preview Block (Yoast Style) */}
      <Card className="rounded-none bg-[#202023]/70 border-white/5 p-4 sm:p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#c89b3c]" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Search Engine Optimization (SEO) &amp; Social Snippets
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:flex items-center gap-1 bg-[#18181b] p-1 border border-white/10 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setPreviewMode("google")}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs uppercase tracking-wider font-mono cursor-pointer transition-colors text-center ${
                previewMode === "google"
                  ? "bg-[#c89b3c] text-neutral-950 font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode("telegram")}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs uppercase tracking-wider font-mono cursor-pointer transition-colors text-center ${
                previewMode === "telegram"
                  ? "bg-[#c89b3c] text-neutral-950 font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Telegram / Social
            </button>
          </div>
        </div>

        {/* Live Snippet Preview Box */}
        <div className="bg-[#18181b] border border-white/10 p-3.5 sm:p-5 rounded-none overflow-hidden max-w-full">
          <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#c89b3c]" />
            Live Preview Snippet
          </div>

          {previewMode === "google" ? (
            /* Google Search Engine Result Preview */
            <div className="space-y-1.5 font-sans">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center text-[10px]">⚓</span>
                <span className="text-neutral-300 font-medium">danamirashipping.com</span>
                <span className="text-neutral-500">&rsaquo; {cleanSlug || "page"}</span>
              </div>
              <h4 className="text-base sm:text-lg text-[#8ab4f8] hover:underline cursor-pointer font-medium leading-tight">
                {formData.metaTitle || formData.pageName || "Danamira Shipping Ltd — Commercial Fleet & Ship Management"}
              </h4>
              <p className="text-xs sm:text-sm text-[#bdc1c6] leading-snug line-clamp-2">
                {formData.metaDescription || "Official document and information published by Danamira Shipping Ltd. Independent commercial ship management and global maritime chartering services."}
              </p>
            </div>
          ) : (
            /* Telegram / WhatsApp / Social Share Card Preview */
            <div className="bg-[#242428] border-l-4 border-[#c89b3c] p-3.5 max-w-lg rounded-sm shadow-md font-sans">
              <div className="text-[11px] text-[#c89b3c] font-semibold tracking-wide uppercase mb-1 flex items-center justify-between">
                <span>danamirashipping.com</span>
                <span className="text-[10px] text-neutral-400 font-mono">TG / WA Preview</span>
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-white leading-snug mb-1">
                {formData.metaTitle || formData.pageName || "Danamira Shipping Ltd"}
              </h4>
              <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed mb-2">
                {formData.metaDescription || "Official company profile, commercial particulars and dry bulk cargo chartering."}
              </p>
              {formData.ogImage ? (
                <div className="w-full h-32 rounded bg-cover bg-center border border-white/5" style={{ backgroundImage: `url(${formData.ogImage})` }} />
              ) : (
                <div className="w-full h-24 rounded bg-[#18181b] border border-white/5 flex items-center justify-center text-neutral-500 text-xs gap-2">
                  <ImageIcon className="w-4 h-4 text-neutral-600" />
                  <span>Default Danamira Maritime Social Card</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SEO Input Fields */}
        <div className="space-y-4">
          {/* SEO Title Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>SEO-заголовок (Meta Title / &lt;title&gt;)</span>
              </Label>
              <span className={`text-[11px] font-mono ${titleLength > 60 ? "text-amber-400 font-bold" : "text-emerald-400"}`}>
                {titleLength} / 60 characters {titleLength >= 30 && titleLength <= 60 && "✓ Optimal"}
              </span>
            </div>
            <Input
              placeholder="e.g. About Us • Company Profile & Mission | Danamira Shipping Ltd"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
            />
            {/* Title Progress Bar */}
            <div className="w-full h-1 bg-neutral-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  titleLength > 65
                    ? "bg-red-500"
                    : titleLength > 60
                    ? "bg-amber-500"
                    : titleLength >= 30
                    ? "bg-emerald-500"
                    : "bg-neutral-600"
                }`}
                style={{ width: `${Math.min(100, (titleLength / 60) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-neutral-400">
              The title displayed on browser tabs, search engine results, and social card headers.
            </p>
          </div>

          {/* Meta Description Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-white">
                Мета-описание (Meta Description / &lt;meta name="description"&gt;)
              </Label>
              <span className={`text-[11px] font-mono ${descLength > 160 ? "text-amber-400 font-bold" : "text-emerald-400"}`}>
                {descLength} / 160 characters {descLength >= 100 && descLength <= 160 && "✓ Optimal"}
              </span>
            </div>
            <Textarea
              rows={3}
              placeholder="e.g. Official company profile of Danamira Shipping Ltd: Independent ship-management under Greek Law 89/1967, corporate mission, and commercial chartering desks."
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              className="rounded-none bg-[#18181b] border-white/10 text-xs text-white resize-none"
            />
            {/* Description Progress Bar */}
            <div className="w-full h-1 bg-neutral-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  descLength > 170
                    ? "bg-red-500"
                    : descLength > 160
                    ? "bg-amber-500"
                    : descLength >= 100
                    ? "bg-emerald-500"
                    : "bg-neutral-600"
                }`}
                style={{ width: `${Math.min(100, (descLength / 160) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-neutral-400">
              Snippet summary used by Google, Bing, Telegram, and messengers when linking to this page.
            </p>
          </div>

          {/* Social Preview Image (OG:Image) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-[#c89b3c]" />
              Social Preview Image URL (og:image)
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://danamirashipping.com/assets/og-preview.jpg or /fleet/molpadia/Photo-1.jpg"
                value={formData.ogImage}
                onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
              />
              <Button
                type="button"
                variant="outline"
                onClick={copySlugUrl}
                className="rounded-none bg-[#18181b] border-white/10 hover:bg-white/5 text-xs text-neutral-300 shrink-0 cursor-pointer"
              >
                {copiedSlug ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSlug ? "Copied" : "Copy URL"}
              </Button>
            </div>
            <p className="text-[11px] text-neutral-400">
              Banner image attached to messenger links (Telegram, WhatsApp, iMessage, Twitter/X, LinkedIn).
            </p>
          </div>
        </div>
      </Card>

      {/* Page Content & Visual Editor Block */}
      <Card className="rounded-none bg-[#202023]/70 border-white/5 p-4 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#c89b3c]" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Page Content &amp; Media
            </h3>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline-block">
            Visual Editor &bull; Headings, Lists, Photos &amp; Embeds
          </span>
        </div>

        <div className="space-y-2">
          <RichTextEditor
            content={formData.content || ""}
            onChange={(html) =>
              setFormData({ ...formData, content: html })
            }
            placeholder="Write page content... Add headings, images, lists, or custom media..."
          />
        </div>
      </Card>
    </form>
  );
}

