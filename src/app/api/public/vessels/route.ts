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
      const vesselName = typeof v.name === "object" ? (v.name?.[lang] || v.name?.en || "") : (v.name || "Unnamed Vessel");
      const vesselDesc = typeof v.description === "object" ? (v.description?.[lang] || v.description?.en || "") : (v.description || "");
      const vesselDeck = typeof v.deckEquipment === "object" ? (v.deckEquipment?.[lang] || v.deckEquipment?.en || "") : (v.deckEquipment || "");

      return {
        id: v.id,
        imoNumber: v.imoNumber || v.imo_number,
        name: vesselName,
        nameI18n: typeof v.name === "object" ? v.name : { en: v.name, ua: "", ru: "" },
        type: v.type || "bulk_carrier",
        status: v.status || "available",
        charterRateUsd: v.charterRateUsd,
        salePriceUsd: v.salePriceUsd,
        priceOnRequest: Boolean(v.priceOnRequest),
        currentLocation: v.currentLocation,
        tradingArea: v.tradingArea,
        dwt: v.dwt || v.dwtTonnage || 6400,
        teu: v.teu,
        cubicCapacity: v.cubicCapacity || v.grainCapacityCbm,
        yearBuilt: v.yearBuilt || v.builtYear || 2012,
        flag: v.flag || "Panama",
        loa: v.loa || v.lengthOverallM || 108.2,
        beam: v.beam || v.beamM || 18.2,
        draft: v.draft || v.summerDraftM || 6.7,
        maxSpeed: v.maxSpeed,
        ecoSpeed: v.ecoSpeed,
        classSociety: v.classSociety || v.classificationSociety || "DNV",
        description: vesselDesc,
        deckEquipment: vesselDeck,
        coverImageUrl: v.coverImageUrl || v.cover_image_url || "/ship1_screen3.png",
        pdfGaPlanUrl: v.pdfGaPlanUrl || v.pdf_ga_plan_url || null,
        createdAt: v.createdAt || new Date().toISOString(),
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
