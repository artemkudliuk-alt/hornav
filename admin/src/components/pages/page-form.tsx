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
import { ArrowLeft, ExternalLink, Loader2, Save, FileText, Compass, Trash2 } from "lucide-react";

interface PageFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function PageForm({ initialData, isEditing = false }: PageFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state (Clean English)
  const [formData, setFormData] = useState({
    slug: initialData?.slug || "",
    status: initialData?.status || "published",
    includeInNav: initialData?.includeInNav ?? true,
    includeInFooter: initialData?.includeInFooter ?? false,
    pageName: initialData?.pageName || "",
    title: typeof initialData?.title === "string" ? initialData.title : (initialData?.title?.en || ""),
    metaDescription: typeof initialData?.metaDescription === "string" ? initialData.metaDescription : (initialData?.metaDescription?.en || ""),
    content: typeof initialData?.content === "string" ? initialData.content : (initialData?.content?.en || ""),
  });

  // Auto slug generation from English title
  function handleTitleChange(val: string) {
    setFormData((prev) => {
      const updated = { ...prev, title: val };
      if (!isEditing && !prev.slug) {
        updated.slug = val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
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

      router.push("/pages");
      router.refresh();
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
              {isEditing ? `Edit: ${formData.pageName || formData.slug}` : "Create New Site Page"}
            </h1>
            <p className="text-xs text-neutral-400">
              Manage page title, formatting, media photos, and menu placement.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing && (
            <>
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

              <Button
                type="button"
                variant="outline"
                disabled={isDeleting}
                onClick={handleDelete}
                className="rounded-none bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider gap-1.5 h-9 cursor-pointer"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Delete
              </Button>
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
      <Card className="rounded-none bg-[#202023]/70 border-white/5 p-6 space-y-5 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-neutral-300">Page Internal Name</Label>
            <Input
              placeholder="e.g. Careers & Crewing"
              value={formData.pageName}
              onChange={(e) =>
                setFormData({ ...formData, pageName: e.target.value })
              }
              className="rounded-none bg-[#18181b] border-white/10 text-xs text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-neutral-300">Public Page URL</Label>
            <div className="flex items-center rounded-none bg-[#18181b] border border-white/10 overflow-hidden">
              <span className="px-3 text-xs text-neutral-500 font-mono select-none">
                danamirashipping.com/
              </span>
              <Input
                placeholder="page.html"
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

      {/* Page Content & Visual Editor Block */}
      <Card className="rounded-none bg-[#202023]/70 border-white/5 p-6 space-y-4 shadow-xl">
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
