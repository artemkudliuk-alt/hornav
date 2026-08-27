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
import { Card } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Loader2, Save, FileText } from "lucide-react";

interface PageFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function PageForm({ initialData, isEditing = false }: PageFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state (Clean English)
  const [formData, setFormData] = useState({
    slug: initialData?.slug || "index.html",
    status: initialData?.status || "published",
    pageName: initialData?.pageName || "",
    title: typeof initialData?.title === "string" ? initialData.title : (initialData?.title?.en || ""),
    metaDescription: typeof initialData?.metaDescription === "string" ? initialData.metaDescription : (initialData?.metaDescription?.en || ""),
    content: typeof initialData?.content === "string" ? initialData.content : (initialData?.content?.en || ""),
  });

  // Auto slug generation from English title
  function handleTitleChange(val: string) {
    setFormData((prev) => {
      const updated = { ...prev, title: val };
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = {
      ...formData,
      title: { en: formData.title, ua: "", ru: "" },
      metaDescription: { en: formData.metaDescription, ua: "", ru: "" },
      content: { en: formData.content, ua: "", ru: "" },
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

      const saved = await res.json();

      if (!isEditing) {
        router.push(`/pages/${saved.id}`);
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

  const livePageUrl = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? `http://localhost:5173/${formData.slug}`
    : `https://danamiratest.vercel.app/${formData.slug}`;

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
              className="rounded-none text-neutral-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              {isEditing ? `Edit: ${formData.pageName || formData.slug}` : "Create Custom Page"}
            </h1>
            <p className="text-xs text-neutral-400">
              Manage SEO metadata, search engine snippets, and page rich content.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing && (
            <a
              href={livePageUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="button"
                variant="outline"
                className="rounded-none bg-[#202023] border-white/10 hover:bg-white/5 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider gap-1.5 h-9 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#c89b3c]" />
                View Live Page
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
            {isEditing ? "Save Changes" : "Publish Page"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-none text-xs">
          {error}
        </div>
      )}

      {/* Basic URL and Status Settings */}
      <Card className="rounded-none bg-[#202023]/70 border-white/5 p-6 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-2">
            <Label className="text-xs text-neutral-300">Public Page URL</Label>
            <div className="flex items-center rounded-none bg-[#18181b] border border-white/10 overflow-hidden">
              <span className="px-3 text-xs text-neutral-500 font-mono select-none">
                danamirashipping.com/
              </span>
              <Input
                placeholder="index.html"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: e.target.value.toLowerCase(),
                  })
                }
                required
                className="rounded-none bg-transparent border-none text-xs font-mono text-white focus-visible:ring-0"
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
      </Card>

      {/* SEO & Page Content Block */}
      <Card className="rounded-none bg-[#202023]/70 border-white/5 p-6 space-y-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          <FileText className="w-4 h-4 text-[#c89b3c]" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            SEO Metadata & Page Content
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-neutral-300">
              Page Title
            </Label>
            <Input
              placeholder="e.g. Black Sea Grain & Dry Bulk Freight | Danamira Shipping"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-neutral-300">
              Meta Description & Search Snippet
            </Label>
            <Textarea
              rows={2}
              placeholder="Search engine summary snippet (150-160 chars recommended)..."
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData({ ...formData, metaDescription: e.target.value })
              }
              className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-neutral-300">
              Visual & Rich Content
            </Label>
            <RichTextEditor
              content={formData.content || ""}
              onChange={(html) =>
                setFormData({ ...formData, content: html })
              }
              placeholder="Write page content... Add headings, images, YouTube video embeds, or custom layouts..."
            />
            <p className="text-[11px] text-neutral-500">
              Format headings (H1-H4), bold/italic/underline, lists, links, images, and embedded video components.
            </p>
          </div>
        </div>
      </Card>
    </form>
  );
}
