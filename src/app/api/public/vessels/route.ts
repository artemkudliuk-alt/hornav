import { NextResponse } from "next/server";
import { db, isDbConnected } from "@/lib/db";
import { vessels } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { sampleVessels } from "@/lib/db/mock-data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as any;
  const status = searchParams.get("status") as any;
  const lang = (searchParams.get("lang") as "en" | "ua" | "ru") || "en";

  try {
    let list: any[] = sampleVessels;

    if (isDbConnected) {
      const conditions = [];
      if (type) conditions.push(eq(vessels.type, type));
      if (status) conditions.push(eq(vessels.status, status));

      const query = conditions.length > 0
        ? db.select().from(vessels).where(and(...conditions)).orderBy(desc(vessels.createdAt))
        : db.select().from(vessels).orderBy(desc(vessels.createdAt));

      const data = await query;
      if (data.length > 0) list = data;
    }

    // Localize response based on requested language
    const formatted = list.map((v) => {
      const nameObj = v.name as unknown as Record<string, string> | null;
      const descObj = v.description as unknown as Record<string, string> | null;
      const deckObj = v.deckEquipment as unknown as Record<string, string> | null;

      return {
        id: v.id,
        imoNumber: v.imoNumber,
        name: nameObj?.[lang] || nameObj?.en || "Unnamed Vessel",
        nameI18n: v.name,
        type: v.type,
        status: v.status,
        charterRateUsd: v.charterRateUsd,
        salePriceUsd: v.salePriceUsd,
        priceOnRequest: v.priceOnRequest,
        currentLocation: v.currentLocation,
        tradingArea: v.tradingArea,
        dwt: v.dwt,
        teu: v.teu,
        cubicCapacity: v.cubicCapacity,
        yearBuilt: v.yearBuilt,
        flag: v.flag,
        loa: v.loa,
        beam: v.beam,
        draft: v.draft,
        maxSpeed: v.maxSpeed,
        ecoSpeed: v.ecoSpeed,
        classSociety: v.classSociety,
        description: descObj?.[lang] || descObj?.en || "",
        deckEquipment: deckObj?.[lang] || deckObj?.en || "",
        coverImageUrl: v.coverImageUrl,
        createdAt: v.createdAt,
      };
    });

    return NextResponse.json(formatted, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("GET /api/public/vessels error:", error);
    return NextResponse.json(
      { error: "Failed to fetch public fleet catalog" },
      { status: 500 }
    );
  }
}
