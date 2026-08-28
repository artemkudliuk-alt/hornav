import { NextResponse } from "next/server";
import { db, isDbConnected } from "@/lib/db";
import { vessels, vesselMedia } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sampleVessels } from "@/lib/db/mock-data";
import { ensureDatabaseInitialized } from "@/lib/db/init-db";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await ensureDatabaseInitialized();
    const resolvedParams = params instanceof Promise ? await params : (await Promise.resolve(params));
    const rawId = resolvedParams?.id || "";
    const id = decodeURIComponent(rawId);
    const { searchParams } = new URL(req.url);
    const lang = (searchParams.get("lang") as "en" | "ua" | "ru") || "en";

    let vessel: any = null;
    let media: any[] = [];

    if (isDbConnected) {
      try {
        const allVessels = await db.select().from(vessels);
        const dbVessel = allVessels.find(
          (v: any) =>
            v.id === id ||
            v.slug === id ||
            v.imoNumber === id ||
            v.imo_number === id ||
            (v.name && typeof v.name === "object" && (v.name.en?.toLowerCase().includes(id.toLowerCase()) || v.name.en?.toLowerCase().replace(/[^a-z0-9]/g, "-") === id))
        );

        if (dbVessel) {
          vessel = dbVessel;
          try {
            media = await db
              .select()
              .from(vesselMedia)
              .where(eq(vesselMedia.vesselId, dbVessel.id))
              .orderBy(vesselMedia.sortOrder);
          } catch (mErr) {
            console.warn("Could not query vesselMedia table:", mErr);
          }
        }
      } catch (dbErr) {
        console.warn("DB query failed, fallback to mock data:", dbErr);
      }
    }

    if (!vessel) {
      const mock = sampleVessels.find(
        (v) =>
          v.id === id ||
          v.slug === id ||
          v.imoNumber === id ||
          (v.name && typeof v.name === "object" && (v.name.en?.toLowerCase().includes(id.toLowerCase()) || v.name.en?.toLowerCase().replace(/[^a-z0-9]/g, "-") === id))
      );
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
    const metaTitleObj = vessel.metaTitle as unknown as Record<string, string> | null;
    const metaDescObj = vessel.metaDescription as unknown as Record<string, string> | null;

    const responseData = {
      ...vessel,
      imoNumber: vessel.imoNumber || vessel.imo_number,
      name: typeof vessel.name === "object" ? (nameObj?.[lang] || nameObj?.en || "Unnamed Vessel") : (vessel.name || "Unnamed Vessel"),
      nameI18n: typeof vessel.name === "object" ? vessel.name : { en: vessel.name, ua: "", ru: "" },
      metaTitle: typeof vessel.metaTitle === "object" ? (metaTitleObj?.[lang] || metaTitleObj?.en || `MV ${nameObj?.en || vessel.name} — Technical Particulars | Danamira Shipping`) : (vessel.metaTitle || `MV ${nameObj?.en || vessel.name} — Technical Particulars | Danamira Shipping`),
      metaDescription: typeof vessel.metaDescription === "object" ? (metaDescObj?.[lang] || metaDescObj?.en || (descObj?.[lang] || descObj?.en || "")) : (vessel.metaDescription || (descObj?.[lang] || descObj?.en || "")),
      description: typeof vessel.description === "object" ? (descObj?.[lang] || descObj?.en || "") : (vessel.description || ""),
      deckEquipment: typeof vessel.deckEquipment === "object" ? (deckObj?.[lang] || deckObj?.en || "") : (vessel.deckEquipment || ""),
      coverImageUrl: vessel.coverImageUrl || vessel.cover_image_url || "/fleet/molpadia/MV_MOLPADIA__PHOTO.jpg",
      ogImage: vessel.ogImage || vessel.coverImageUrl || "/fleet/molpadia/MV_MOLPADIA__PHOTO.jpg",
      media,
    };

    return NextResponse.json(responseData, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error: any) {
    console.error("GET /api/public/vessels/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch vessel details" },
      { status: 500 }
    );
  }
}
