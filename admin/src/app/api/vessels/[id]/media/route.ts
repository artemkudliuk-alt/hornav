import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { vesselMedia, vessels } from "@/lib/db/schema";
import { uploadFileToBlob } from "@/lib/blob";
import { eq, desc } from "drizzle-orm";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: vesselId } = await params;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const mediaType = (formData.get("type") as "photo" | "pdf") || "photo";
    const isCover = formData.get("isCover") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    let fileUrl = "";
    let blobKey = "";

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const res = await uploadFileToBlob(`vessels/${vesselId}/${file.name}`, buffer, file.type);
      fileUrl = res.url;
      blobKey = res.pathname;
    } else {
      // Local development mock URL if Vercel Blob token is not yet configured
      fileUrl = `/uploads/${file.name}`;
      blobKey = `mock-${Date.now()}-${file.name}`;
    }

    // Get max sort order
    const existing = await db
      .select()
      .from(vesselMedia)
      .where(eq(vesselMedia.vesselId, vesselId))
      .orderBy(desc(vesselMedia.sortOrder))
      .limit(1);

    const nextOrder = existing.length > 0 ? existing[0].sortOrder + 1 : 0;

    const [created] = await db
      .insert(vesselMedia)
      .values({
        vesselId,
        url: fileUrl,
        blobKey,
        type: mediaType,
        filename: file.name,
        sortOrder: nextOrder,
        isCover,
      })
      .returning();

    // If marked as cover, also update vessel's main cover image URL
    if (isCover && mediaType === "photo") {
      await db
        .update(vesselMedia)
        .set({ isCover: false })
        .where(eq(vesselMedia.vesselId, vesselId));

      await db
        .update(vesselMedia)
        .set({ isCover: true })
        .where(eq(vesselMedia.id, created.id));

      await db
        .update(vessels)
        .set({ coverImageUrl: fileUrl })
        .where(eq(vessels.id, vesselId));
    }

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/vessels/[id]/media error:", error);
    return NextResponse.json(
      { error: "Failed to upload vessel media" },
      { status: 500 }
    );
  }
}
