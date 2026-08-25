"use client";

import { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Globe, Loader2, Save, Sparkles, ExternalLink } from "lucide-react";

interface PageFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function PageForm({ initialData, isEditing = false }: PageFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active language for multilingual inputs
  const [activeLang, setActiveLang] = useState<"en" | "ua" | "ru">("en");

  // Form state
  const [formData, setFormData] = useState({
    slug: initialData?.slug || "",
    status: initialData?.status || "draft",
    title: {
      en: initialData?.title?.en || "",
      ua: initialData?.title?.ua || "",
      ru: initialData?.title?.ru || "",
    },
    metaDescription: {
      en: initialData?.metaDescription?.en || "",
      ua: initialData?.metaDescription?.ua || "",
      ru: initialData?.metaDescription?.ru || "",
    },
    ogImage: {
      en: initialData?.ogImage?.en || "",
      ua: initialData?.ogImage?.ua || "",
      ru: initialData?.ogImage?.ru || "",
    },
    content: {
      en: initialData?.content?.en || "",
      ua: initialData?.content?.ua || "",
      ru: initialData?.content?.ru || "",
    },
  });

  // Auto slug generation from English title
  function handleTitleChange(val: string) {
    setFormData((prev) => {
      const updated = {
        ...prev,
        title: { ...prev.title, [activeLang]: val },
      };
      if (!isEditing && activeLang === "en" && !prev.slug) {
        updated.slug = val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const url = isEditing ? `/api/pages/${initialData.id}` : `/api/pages`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save page");
      }

      router.push("/pages");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save page");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Action Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/pages">
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
              {isEditing ? `Edit Page: /routes/${formData.slug}` : "Create Custom Route Landing"}
            </h1>
            <p className="text-xs text-neutral-400">
              Build dedicated SEO landing pages for specialized cargo corridors and freight solutions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase tracking-wider gap-2 cursor-pointer"
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
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-xs">
          {error}
        </div>
      )}

      {/* Basic URL and Status Settings */}
      <Card className="bg-[#202023]/70 border-white/5 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-2">
            <Label className="text-xs text-neutral-300">URL Route Slug</Label>
            <div className="flex items-center rounded-md bg-[#18181b] border border-white/10 overflow-hidden">
              <span className="px-3 text-xs text-neutral-500 font-mono select-none">
                danamirashipping.com/routes/
              </span>
              <Input
                placeholder="black-sea-grain-freight"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                  })
                }
                required
                className="bg-transparent border-none text-xs font-mono text-white focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-neutral-300">Publishing Status</Label>
            <Select
              value={formData.status}
              onValueChange={(val) =>
                setFormData({ ...formData, status: val || "draft" })
              }
            >
              <SelectTrigger className="bg-[#18181b] border-white/10 text-xs text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#202023] border-white/10 text-white text-xs">
                <SelectItem value="draft">🟡 Draft (Черновик)</SelectItem>
                <SelectItem value="published">🟢 Published (Опубликовано)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Multilingual SEO & Content Block */}
      <Card className="bg-[#202023]/70 border-white/5 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#c89b3c]" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Multilingual SEO & Page Content
            </h3>
          </div>

          {/* Language Switcher Tabs */}
          <div className="flex gap-1 bg-[#18181b] p-0.5 rounded border border-white/5">
            {(["en", "ua", "ru"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-1.5 text-xs font-bold uppercase rounded transition-colors ${
                  activeLang === lang
                    ? "bg-[#c89b3c] text-[#141416]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-neutral-300">
              Page Title ({activeLang.toUpperCase()})
            </Label>
            <Input
              placeholder={`e.g. Black Sea Grain & Dry Bulk Freight | Danamira (${activeLang.toUpperCase()})`}
              value={formData.title[activeLang]}
              onChange={(e) => handleTitleChange(e.target.value)}
              required={activeLang === "en"}
              className="bg-[#18181b] border-white/10 text-xs text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-neutral-300">
              Meta Description & OpenGraph ({activeLang.toUpperCase()})
            </Label>
            <Textarea
              rows={2}
              placeholder={`Search engine summary snippet in ${activeLang.toUpperCase()} (150-160 chars recommended)...`}
              value={formData.metaDescription[activeLang]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  metaDescription: {
                    ...formData.metaDescription,
                    [activeLang]: e.target.value,
                  },
                })
              }
              className="bg-[#18181b] border-white/10 text-xs text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-neutral-300">
              Visual & Rich Content ({activeLang.toUpperCase()})
            </Label>
            <RichTextEditor
              key={`editor-${activeLang}`}
              content={formData.content[activeLang] || ""}
              onChange={(html) =>
                setFormData({
                  ...formData,
                  content: {
                    ...formData.content,
                    [activeLang]: html,
                  },
                })
              }
              placeholder={`Write content for ${activeLang.toUpperCase()}... Add headings, images, YouTube video embeds, or custom layouts...`}
            />
            <p className="text-[11px] text-neutral-500">
              WordPress/Notion-style visual editor: format headings (H1-H4), bold/italic/underline, align text, insert images, YouTube video embeds, and view live client preview.
            </p>
          </div>
        </div>
      </Card>
    </form>
  );
}
