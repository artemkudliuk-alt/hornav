import { NextResponse } from "next/server";
import { db, isDbConnected } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { samplePages } from "@/lib/db/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let list: any[] = samplePages.filter((p: any) => p.status === "published" || !p.status);

    if (isDbConnected) {
      try {
        const dbPages = await db
          .select()
          .from(pages)
          .where(eq(pages.status, "published"))
          .orderBy(desc(pages.createdAt));
        if (dbPages.length > 0) list = dbPages;
      } catch (err) {
        console.warn("DB offline, using samplePages fallback for public pages list");
      }
    }

    const formatted = list.map((p: any) => {
      const titleObj = typeof p.title === "object" ? p.title : { en: p.title || p.pageName || p.slug };
      const pageTitle = titleObj?.en || p.pageName || p.slug;
      return {
        id: p.id,
        slug: p.slug,
        pageName: p.pageName || pageTitle,
        title: pageTitle,
        includeInNav: p.includeInNav !== false,
        includeInFooter: p.includeInFooter !== false,
        publishedAt: p.publishedAt || p.createdAt,
      };
    });

    return NextResponse.json(formatted, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error: any) {
    console.error("GET /api/public/pages error:", error);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}
