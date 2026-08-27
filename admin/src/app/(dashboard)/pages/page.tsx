import Link from "next/link";
import { db, isDbConnected } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { samplePages } from "@/lib/db/mock-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit3, Plus, Compass, ExternalLink, Globe, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PagesListPage() {
  let pagesList: any[] = samplePages;

  if (isDbConnected) {
    try {
      const data = await db.select().from(pages).orderBy(desc(pages.createdAt));
      if (data.length > 0) pagesList = data;
    } catch (err) {
      console.warn("DB offline, using sample pages list.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Page Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            Site Pages & Navigation ({pagesList.length})
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage SEO metadata, header navigation menus, and content for all public website pages.
          </p>
        </div>

        <Link href="/pages/new">
          <Button className="rounded-none bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase tracking-wider gap-2 cursor-pointer h-9 shadow-md">
            <Plus className="w-4 h-4" />
            Add New Page
          </Button>
        </Link>
      </div>

      {/* Responsive Page Cards List (No Horizontal Scrollbar) */}
      <div className="space-y-3">
        {pagesList.map((p) => {
          const title = (p.title as any)?.en || "Untitled Page";
          const metaDesc = (p.metaDescription as any)?.en || "";
          const pageName = p.pageName || title;
          const isPublished = p.status === "published";
          const inMenu = p.includeInNav !== false;
          const liveUrl = `http://localhost:5173/${p.slug}`;

          return (
            <Card
              key={p.id}
              className="rounded-none bg-[#202023]/70 border-white/5 hover:border-white/15 p-4 sm:p-5 transition-all shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left & Middle: Info and SEO */}
              <div className="flex-1 min-w-0 space-y-2">
                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-none font-bold tracking-wider inline-flex items-center gap-1.5 border ${
                      isPublished
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isPublished ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                    <span>{p.status}</span>
                  </div>

                  {inMenu ? (
                    <div className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-none font-bold tracking-wider inline-flex items-center gap-1 border bg-[#c89b3c]/10 text-[#c89b3c] border-[#c89b3c]/30">
                      <Compass className="w-3 h-3" />
                      <span>In Header Nav</span>
                    </div>
                  ) : (
                    <div className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-none font-medium tracking-wider inline-flex items-center gap-1 border bg-white/5 text-neutral-400 border-white/10">
                      <FileText className="w-3 h-3 text-neutral-500" />
                      <span>Footer / Direct URL</span>
                    </div>
                  )}
                </div>

                {/* Page Title & Slug */}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm sm:text-base text-white">
                      {pageName}
                    </span>
                    <span className="text-[11px] text-[#c89b3c] font-mono">
                      /{p.slug}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 font-medium mt-0.5 line-clamp-1">
                    {title}
                  </p>
                  {metaDesc && (
                    <p className="text-[11px] text-neutral-400 font-mono mt-0.5 line-clamp-1">
                      {metaDesc}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-block"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-none text-xs bg-[#18181b] hover:bg-white/5 text-neutral-300 hover:text-white gap-1.5 h-8 font-semibold uppercase tracking-wider cursor-pointer border border-white/10"
                  >
                    <ExternalLink className="w-3 h-3 text-[#c89b3c]" />
                    Live
                  </Button>
                </a>

                <Link href={`/pages/${p.id}`}>
                  <Button
                    size="sm"
                    className="rounded-none text-xs bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] gap-1.5 h-8 font-semibold uppercase tracking-wider cursor-pointer shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Page
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
