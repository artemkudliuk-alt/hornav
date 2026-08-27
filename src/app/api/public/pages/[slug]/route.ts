import { NextResponse } from "next/server";
import { db, isDbConnected } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { samplePages } from "@/lib/db/mock-data";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(req.url);
  const lang = (searchParams.get("lang") as "en" | "ua" | "ru") || "en";

  try {
    const normalizedSlug = slug.replace(/\.html$/, "");
    let page: any = samplePages.find(
      (p: any) =>
        p.slug === slug ||
        p.slug === normalizedSlug ||
        p.slug === `${normalizedSlug}.html` ||
        p.id === slug
    );

    if (isDbConnected) {
      const allDbPages = await db.select().from(pages);
      const matched = allDbPages.find(
        (p: any) =>
          p.slug === slug ||
          p.slug === normalizedSlug ||
          p.slug === `${normalizedSlug}.html` ||
          p.slug?.replace(/\.html$/, "") === normalizedSlug ||
          p.id === slug
      );
      if (matched) page = matched;
    }

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const titleObj = page.title as unknown as Record<string, string> | null;
    const metaDescObj = page.metaDescription as unknown as Record<string, string> | null;
    const ogObj = page.ogImage as unknown as Record<string, string> | null;
    const contentObj = page.content as unknown as Record<string, string> | null;

    return NextResponse.json(
      {
        slug: page.slug,
        title: titleObj?.[lang] || titleObj?.en || "",
        titleI18n: page.title,
        metaDescription: metaDescObj?.[lang] || metaDescObj?.en || "",
        ogImage: ogObj?.[lang] || ogObj?.en || "",
        content: contentObj?.[lang] || contentObj?.en || "",
        contentI18n: page.content,
        publishedAt: page.publishedAt || page.createdAt,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
        },
      }
    );
  } catch (error: any) {
    console.error("GET /api/public/pages/[slug] error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch page", details: String(error) },
      { status: 500 }
    );
  }
}
