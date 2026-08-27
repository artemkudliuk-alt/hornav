import { NextResponse } from "next/server";
import { uploadFileToBlob } from "@/lib/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const mediaType = (formData.get("type") as "photo" | "pdf") || "photo";
    const isCover = formData.get("isCover") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let fileUrl = "";

    // 1. If Vercel Blob is configured (Production)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const res = await uploadFileToBlob(`uploads/${Date.now()}-${file.name}`, buffer, file.type);
        fileUrl = res.url;
      } catch (blobErr) {
        console.warn("Blob upload failed, fallback to local disk:", blobErr);
      }
    }

    // 2. Local disk fallback (/public/uploads)
    if (!fileUrl) {
      try {
        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });
        await writeFile(path.join(uploadsDir, safeName), buffer);
        fileUrl = `/uploads/${safeName}`;
      } catch (fsErr) {
        console.warn("FS write failed:", fsErr);
        fileUrl = `/uploads/${file.name}`;
      }
    }

    return NextResponse.json(
      {
        id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        url: fileUrl,
        type: mediaType,
        filename: file.name,
        isCover,
        sortOrder: 1,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      { error: "Upload failed: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
