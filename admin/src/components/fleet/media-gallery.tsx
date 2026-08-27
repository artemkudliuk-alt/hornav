"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FileText, Loader2, Star, Trash2, Upload, Check } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  type: "photo" | "pdf";
  filename?: string | null;
  sortOrder: number;
  isCover: boolean;
}

interface MediaGalleryProps {
  vesselId: string;
  initialMedia?: MediaItem[];
  onCoverChange?: (url: string) => void;
  onMediaChange?: (list: MediaItem[]) => void;
}

export function MediaGallery({
  vesselId,
  initialMedia = [],
  onCoverChange,
  onMediaChange,
}: MediaGalleryProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const photos = mediaList.filter((m) => m.type === "photo");
  const documents = mediaList.filter((m) => m.type === "pdf");

  async function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "photo" | "pdf"
  ) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(`Processing ${files.length} file(s)...`);

    const newItems: MediaItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isFirst = photos.length === 0 && newItems.length === 0 && type === "photo";
      let uploadedMedia: MediaItem | null = null;

      if (vesselId && vesselId !== "new-vessel") {
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("type", type);
          formData.append("isCover", String(isFirst));

          const res = await fetch(`/api/vessels/${vesselId}/media`, {
            method: "POST",
            body: formData,
          });

          if (res.ok) {
            uploadedMedia = await res.json();
          }
        } catch (err) {
          console.warn("Server upload fallback:", err);
        }
      }

      if (!uploadedMedia) {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        });

        uploadedMedia = {
          id: "media-" + Date.now() + "-" + i,
          url: dataUrl,
          type,
          filename: file.name,
          sortOrder: mediaList.length + newItems.length + 1,
          isCover: isFirst,
        };
      }

      newItems.push(uploadedMedia);
    }

    const nextMediaList = [...mediaList, ...newItems];
    setMediaList(nextMediaList);

    if (onMediaChange) {
      onMediaChange(nextMediaList);
    }

    const coverItem = newItems.find((m) => m.isCover);
    if (coverItem && onCoverChange) {
      onCoverChange(coverItem.url);
    }

    setIsUploading(false);
    setUploadProgress(null);
    e.target.value = "";
  }

  async function handleSetCover(mediaId: string) {
    if (vesselId && vesselId !== "new-vessel") {
      try {
        await fetch(`/api/vessels/${vesselId}/media/${mediaId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isCover: true }),
        });
      } catch (err) {
        console.warn("Failed to patch cover on server:", err);
      }
    }

    const target = mediaList.find((m) => m.id === mediaId);
    const nextList = mediaList.map((item) => ({
      ...item,
      isCover: item.id === mediaId,
    }));

    setMediaList(nextList);

    if (target && onCoverChange) {
      onCoverChange(target.url);
    }
    if (onMediaChange) {
      onMediaChange(nextList);
    }
  }

  async function handleDelete(mediaId: string) {
    if (!confirm("Are you sure you want to delete this media item?")) return;

    if (vesselId && vesselId !== "new-vessel") {
      try {
        await fetch(`/api/vessels/${vesselId}/media/${mediaId}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.warn("Failed to delete media on server:", err);
      }
    }

    const nextList = mediaList.filter((m) => m.id !== mediaId);
    setMediaList(nextList);

    if (onMediaChange) {
      onMediaChange(nextList);
    }

    const deletedWasCover = mediaList.find((m) => m.id === mediaId)?.isCover;
    if (deletedWasCover) {
      const newCover = nextList.find((m) => m.type === "photo");
      if (newCover) {
        newCover.isCover = true;
        if (onCoverChange) onCoverChange(newCover.url);
      } else if (onCoverChange) {
        onCoverChange("");
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* ─── Photos Gallery Section ─────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Vessel Photo Gallery ({photos.length})
            </h3>
            <p className="text-xs text-neutral-400">
              Upload up to 20 high-res photos. Designate the primary cover photo for the public catalog.
            </p>
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, "photo")}
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              className="bg-[#202023] border-white/10 hover:border-[#c89b3c]/50 text-xs text-neutral-200 pointer-events-none"
            >
              {isUploading ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5 mr-1.5 text-[#c89b3c]" />
              )}
              Upload Photos
            </Button>
          </label>
        </div>

        {uploadProgress && (
          <div className="p-3 bg-[#c89b3c]/10 border border-[#c89b3c]/30 text-[#c89b3c] rounded text-xs flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{uploadProgress}</span>
          </div>
        )}

        {photos.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-none p-10 text-center space-y-3 bg-[#18181b]/50">
            <Upload className="w-8 h-8 text-neutral-500 mx-auto" />
            <p className="text-xs text-neutral-400">
              No photos uploaded yet. Click "Upload Photos" above to add vessel pictures.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <Card
                key={photo.id}
                className={`rounded-none overflow-hidden relative group border transition-all ${
                  photo.isCover
                    ? "border-[#c89b3c] ring-1 ring-[#c89b3c]"
                    : "border-white/5 hover:border-white/20"
                } bg-[#18181b] shadow-md`}
              >
                <div className="aspect-[4/3] relative w-full bg-neutral-900 overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.filename || "Vessel photo"}
                    className="w-full h-full object-cover"
                  />

                  {/* Main Cover Badge */}
                  {photo.isCover && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge className="rounded-none bg-[#c89b3c] text-[#141416] font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 fill-current" />
                        MAIN COVER
                      </Badge>
                    </div>
                  )}

                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    {!photo.isCover && (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSetCover(photo.id)}
                        className="rounded-none text-[10px] h-7 bg-[#202023] hover:bg-[#c89b3c] hover:text-[#141416] text-white border border-white/10 font-semibold uppercase tracking-wider cursor-pointer"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        Make Cover
                      </Button>
                    )}

                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(photo.id)}
                      className="rounded-none h-7 w-7 bg-red-600/80 hover:bg-red-600 text-white cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="p-2 text-[10px] text-neutral-400 truncate font-mono bg-[#18181b]">
                  {photo.filename || "image.png"}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ─── PDF Documents Section ──────────────────────────────── */}
      <div className="space-y-4 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Technical Documents & Particulars ({documents.length})
            </h3>
            <p className="text-xs text-neutral-400">
              Attach Q88 forms, General Arrangement (GA) plans, or capacity tables for client download.
            </p>
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFileUpload(e, "pdf")}
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              className="rounded-none bg-[#202023] border-white/10 hover:border-[#c89b3c]/50 text-xs text-neutral-200 pointer-events-none font-semibold uppercase tracking-wider"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5 text-[#c89b3c]" />
              Attach PDF Specs
            </Button>
          </label>
        </div>

        {documents.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-none p-6 text-center text-xs text-neutral-500 bg-[#18181b]/50">
            No PDF specifications attached.
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3 rounded-none bg-[#18181b] border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-none bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-medium text-white block truncate">
                      {doc.filename || "Vessel_Particulars.pdf"}
                    </span>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-[#c89b3c] hover:underline font-mono"
                    >
                      Preview Document &rarr;
                    </a>
                  </div>
                </div>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(doc.id)}
                  className="rounded-none text-neutral-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
