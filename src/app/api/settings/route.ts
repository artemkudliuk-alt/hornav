import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sampleSettings } from "@/lib/db/mock-data";

// ─── GET /api/settings ────────────────────────────────────────
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(sampleSettings);
}

// ─── PUT /api/settings ────────────────────────────────────────
export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    Object.assign(sampleSettings, body);

    return NextResponse.json(sampleSettings);
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
