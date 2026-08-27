import { NextResponse } from "next/server";
import { db, isDbConnected } from "@/lib/db";
import { vessels, vesselMedia } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sampleVessels } from "@/lib/db/mock-data";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const lang = (searchParams.get("lang") as "en" | "ua" | "ru") || "en";

  try {
    let vessel: any = null;
    let media: any[] = [];

    if (isDbConnected) {
      try {
        const [dbVessel] = await db
          .select()
          .from(vessels)
          .where(eq(vessels.id, id))
          .limit(1);

        if (dbVessel) {
          vessel = dbVessel;
          media = await db
            .select()
            .from(vesselMedia)
            .where(eq(vesselMedia.vesselId, id))
            .orderBy(vesselMedia.sortOrder);
        }
      } catch (dbErr) {
        console.warn("DB query failed, fallback to mock data:", dbErr);
      }
    }

    if (!vessel) {
      const mock = sampleVessels.find((v) => v.id === id);
      if (mock) {
        vessel = mock;
        media = mock.media || [];
      }
    }

    if (!vessel) {
      return NextResponse.json({ error: "Vessel not found" }, { status: 404 });
    }

    const nameObj = vessel.name as unknown as Record<string, string> | null;
    const descObj = vessel.description as unknown as Record<string, string> | null;
    const deckObj = vessel.deckEquipment as unknown as Record<string, string> | null;

    const responseData = {
      ...vessel,
      name: nameObj?.[lang] || nameObj?.en || "Unnamed Vessel",
      nameI18n: vessel.name,
      description: descObj?.[lang] || descObj?.en || "",
      descriptionI18n: vessel.description,
      deckEquipment: deckObj?.[lang] || deckObj?.en || "",
      deckEquipmentI18n: vessel.deckEquipment,
      photos: media.filter((m: any) => m.type === "photo"),
      documents: media.filter((m: any) => m.type === "pdf"),
    };

    return NextResponse.json(responseData, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("GET /api/public/vessels/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch vessel details" },
      { status: 500 }
    );
  }
}
