import { NextResponse } from "next/server";
import { saveUpload } from "@/lib/storage";

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

    const { url: fileUrl } = await saveUpload(buffer, file.name);

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
