import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, isDbConnected } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { pageFormSchema } from "@/lib/validators";
import { samplePages } from "@/lib/db/mock-data";
import { desc } from "drizzle-orm";

// ─── GET /api/pages ───────────────────────────────────────────
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isDbConnected) {
    try {
      const list = await db
        .select()
        .from(pages)
        .orderBy(desc(pages.createdAt));
      return NextResponse.json(list);
    } catch (error) {
      console.warn("DB offline, using samplePages fallback");
    }
  }

  return NextResponse.json(samplePages);
}

// ─── POST /api/pages ──────────────────────────────────────────
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = pageFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (isDbConnected) {
      try {
        const [created] = await db
          .insert(pages)
          .values({
            slug: data.slug,
            status: data.status,
            title: typeof data.title === "object" ? data.title : { en: data.title || data.pageName || data.slug, ua: "", ru: "" },
            metaDescription: typeof data.metaDescription === "object" ? data.metaDescription : { en: data.metaDescription || "", ua: "", ru: "" },
            content: typeof data.content === "object" ? data.content : { en: data.content || "", ua: "", ru: "" },
            createdBy: session.user.id,
            publishedAt: data.status === "published" ? new Date() : null,
          })
          .returning();

        return NextResponse.json(created, { status: 201 });
      } catch (dbErr: any) {
        console.warn("DB insert error, falling back to mock store:", dbErr.message);
      }
    }

    // In-memory mock store fallback
    const newPage = {
      id: "page-" + Date.now(),
      slug: data.slug,
      status: data.status,
      pageName: data.pageName || data.slug,
      includeInNav: data.includeInNav,
      includeInFooter: data.includeInFooter,
      title: data.title || { en: data.pageName || data.slug, ua: "", ru: "" },
      metaDescription: data.metaDescription || { en: "", ua: "", ru: "" },
      content: data.content || { en: "", ua: "", ru: "" },
      createdAt: new Date().toISOString(),
    };

    samplePages.unshift(newPage);
    return NextResponse.json(newPage, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/pages error:", error);
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}
