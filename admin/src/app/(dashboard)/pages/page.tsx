import Link from "next/link";
import { db, isDbConnected } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { samplePages } from "@/lib/db/mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit3, Plus } from "lucide-react";

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            Landing Pages & Route Builder ({pagesList.length})
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Generate and edit custom marketing landing pages for logistics corridors and cargo trades.
          </p>
        </div>

        <Link href="/pages/new">
          <Button className="bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase tracking-wider gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            Create Page
          </Button>
        </Link>
      </div>

      {/* Pages Table */}
      <div className="rounded-none border border-white/5 bg-[#202023]/60 overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-[#18181b] border-b border-white/5">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider w-32">
                Status
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Page Title & URL Slug
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider text-right">
                Created
              </TableHead>
              <TableHead className="w-28 text-right"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pagesList.map((p) => {
              const title = (p.title as any)?.en || "Untitled Page";
              const isPublished = p.status === "published";

              return (
                <TableRow
                  key={p.id}
                  className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                >
                  <TableCell>
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
                  </TableCell>

                  <TableCell>
                    <span className="font-semibold text-xs text-white block">
                      {title}
                    </span>
                    <span className="text-[11px] text-[#c89b3c] font-mono mt-0.5 block">
                      /routes/{p.slug}
                    </span>
                  </TableCell>

                  <TableCell className="text-right text-xs text-neutral-400 font-mono">
                    {new Date(p.createdAt).toLocaleDateString("en-GB")}
                  </TableCell>

                  <TableCell className="text-right">
                    <Link href={`/pages/${p.id}`}>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-none text-xs bg-[#18181b] hover:bg-[#c89b3c] hover:text-[#141416] text-white gap-1.5 h-8 font-semibold uppercase tracking-wider cursor-pointer border border-white/10"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
