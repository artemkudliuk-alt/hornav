import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { pageFormSchema } from "@/lib/validators";
import { desc } from "drizzle-orm";

// ─── GET /api/pages ───────────────────────────────────────────
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = await db
      .select()
      .from(pages)
      .orderBy(desc(pages.createdAt));
    return NextResponse.json(list);
  } catch (error) {
    console.error("GET /api/pages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
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

    const { slug, status, title, metaDescription, ogImage, content } = parsed.data;

    const [created] = await db
      .insert(pages)
      .values({
        slug,
        status,
        title,
        metaDescription: metaDescription || null,
        ogImage: ogImage || null,
        content,
        createdBy: session.user.id,
        publishedAt: status === "published" ? new Date() : null,
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/pages error:", error);
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A page with this URL slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}
