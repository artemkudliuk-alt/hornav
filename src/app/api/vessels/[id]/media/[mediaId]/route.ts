import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { vesselMedia, vessels } from "@/lib/db/schema";
import { deleteFileFromBlob } from "@/lib/blob";
import { eq, and } from "drizzle-orm";

// ─── PATCH: Set as Main Cover ─────────────────────────────────
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: vesselId, mediaId } = await params;

  try {
    const body = await req.json();
    const { isCover } = body;

    if (isCover) {
      // 1. Reset all existing covers for this vessel
      await db
        .update(vesselMedia)
        .set({ isCover: false })
        .where(eq(vesselMedia.vesselId, vesselId));

      // 2. Set this media as cover
      const [updated] = await db
        .update(vesselMedia)
        .set({ isCover: true })
        .where(
          and(eq(vesselMedia.id, mediaId), eq(vesselMedia.vesselId, vesselId))
        )
        .returning();

      if (!updated) {
        return NextResponse.json({ error: "Media not found" }, { status: 404 });
      }

      // 3. Update main vessel coverImageUrl denormalized field
      await db
        .update(vessels)
        .set({ coverImageUrl: updated.url })
        .where(eq(vessels.id, vesselId));

      return NextResponse.json(updated);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/vessels/[id]/media/[mediaId] error:", error);
    return NextResponse.json(
      { error: "Failed to update media status" },
      { status: 500 }
    );
  }
}

// ─── DELETE: Delete Media ─────────────────────────────────────
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: vesselId, mediaId } = await params;

  try {
    const [deleted] = await db
      .delete(vesselMedia)
      .where(
        and(eq(vesselMedia.id, mediaId), eq(vesselMedia.vesselId, vesselId))
      )
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // Try deleting from blob if token exists
    if (process.env.BLOB_READ_WRITE_TOKEN && deleted.url.startsWith("http")) {
      try {
        await deleteFileFromBlob(deleted.url);
      } catch (e) {
        console.warn("Could not delete from Vercel Blob:", e);
      }
    }

    // If deleted media was cover, clear coverImageUrl on vessel
    if (deleted.isCover) {
      await db
        .update(vessels)
        .set({ coverImageUrl: null })
        .where(eq(vessels.id, vesselId));
    }

    return NextResponse.json({ success: true, id: deleted.id });
  } catch (error) {
    console.error("DELETE /api/vessels/[id]/media/[mediaId] error:", error);
    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 }
    );
  }
}
