import { NextResponse } from "next/server";
import { db, isDbConnected } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { samplePages } from "@/lib/db/mock-data";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : (await Promise.resolve(params));
    const rawSlug = resolvedParams?.slug || "";
    const slug = decodeURIComponent(rawSlug);
    const { searchParams } = new URL(req.url);
    const lang = (searchParams.get("lang") as "en" | "ua" | "ru") || "en";

    const normalizedSlug = slug.replace(/\.html$/, "");
    let page: any = samplePages.find(
      (p: any) =>
        p.slug === slug ||
        p.slug === normalizedSlug ||
        p.slug === `${normalizedSlug}.html` ||
        p.id === slug
    );

    if (isDbConnected) {
      try {
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
      } catch (dbErr) {
        console.warn("DB lookup error in public pages slug:", dbErr);
      }
    }

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const pageTitle = typeof page.title === "object" ? (page.title?.[lang] || page.title?.en || page.slug) : (page.title || page.slug);
    const pageDesc = typeof page.metaDescription === "object" ? (page.metaDescription?.[lang] || page.metaDescription?.en || "") : (page.metaDescription || "");
    const pageContent = typeof page.content === "object" ? (page.content?.[lang] || page.content?.en || "") : (page.content || "");
    const pageOg = typeof page.ogImage === "object" ? (page.ogImage?.[lang] || page.ogImage?.en || "") : (page.ogImage || "");

    return NextResponse.json(
      {
        slug: page.slug,
        title: pageTitle,
        titleI18n: typeof page.title === "object" ? page.title : { en: page.title, ua: "", ru: "" },
        metaDescription: pageDesc,
        ogImage: pageOg,
        content: pageContent,
        contentI18n: typeof page.content === "object" ? page.content : { en: page.content, ua: "", ru: "" },
        publishedAt: page.publishedAt || page.createdAt || new Date().toISOString(),
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
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
