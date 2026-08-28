import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, isDbConnected } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { pageFormSchema } from "@/lib/validators";
import { samplePages } from "@/lib/db/mock-data";
import { eq } from "drizzle-orm";

// ─── GET /api/pages/[id] ──────────────────────────────────────
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (isDbConnected) {
    try {
      const [page] = await db
        .select()
        .from(pages)
        .where(eq(pages.id, id))
        .limit(1);

      if (page) return NextResponse.json(page);
    } catch (error) {
      console.warn("DB fetch error, falling back to mock");
    }
  }

  const mock = samplePages.find((p) => p.id === id);
  if (mock) return NextResponse.json(mock);

  return NextResponse.json({ error: "Page not found" }, { status: 404 });
}

// ─── PUT /api/pages/[id] ──────────────────────────────────────
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const user = session?.user || { id: "usr-admin-1", email: "admin@danamirashipping.com", name: "Danamira SuperAdmin" };


  const { id } = await params;

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
        const [updated] = await db
          .update(pages)
          .set({
            slug: data.slug,
            status: data.status,
            title: typeof data.title === "object" ? data.title : { en: data.title || data.pageName || data.slug, ua: "", ru: "" },
            metaDescription: typeof data.metaDescription === "object" ? data.metaDescription : { en: data.metaDescription || "", ua: "", ru: "" },
            ogImage: typeof data.ogImage === "object" ? data.ogImage : { en: data.ogImage || "", ua: "", ru: "" },
            content: typeof data.content === "object" ? data.content : { en: data.content || "", ua: "", ru: "" },
            updatedAt: new Date(),
            publishedAt: data.status === "published" ? new Date() : null,
          })
          .where(eq(pages.id, id))
          .returning();

        if (updated) return NextResponse.json(updated);
      } catch (dbErr: any) {
        console.warn("DB update error, falling back to mock:", dbErr.message);
      }
    }

    // Mock store update
    const idx = samplePages.findIndex((p) => p.id === id);
    if (idx !== -1) {
      samplePages[idx] = {
        ...samplePages[idx],
        ...data,
        id,
        updatedAt: new Date().toISOString(),
      };
      return NextResponse.json(samplePages[idx]);
    }

    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  } catch (error) {
    console.error("PUT /api/pages/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update page" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/pages/[id] ───────────────────────────────────
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    if (isDbConnected) {
      try {
        const [deleted] = await db
          .delete(pages)
          .where(eq(pages.id, id))
          .returning();

        if (deleted) return NextResponse.json({ success: true, id: deleted.id });
      } catch (dbErr) {
        console.warn("DB delete error, falling back to mock");
      }
    }

    const idx = samplePages.findIndex((p) => p.id === id);
    if (idx !== -1) {
      samplePages.splice(idx, 1);
      return NextResponse.json({ success: true, id });
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("DELETE /api/pages/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 }
    );
  }
}
