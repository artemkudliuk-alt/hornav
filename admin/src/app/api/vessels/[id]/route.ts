import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, isDbConnected } from "@/lib/db";
import { vessels, vesselMedia } from "@/lib/db/schema";
import { vesselFormSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";
import { sampleVessels } from "@/lib/db/mock-data";

// ─── GET /api/vessels/[id] ────────────────────────────────────
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

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
        console.warn("DB query failed, fallback to sampleVessels:", dbErr);
      }
    }

    if (!vessel) {
      const mock = sampleVessels.find((v) => v.id === id);
      if (mock) {
        vessel = mock;
        media = (mock as any).media || [];
      }
    }

    if (!vessel) {
      return NextResponse.json({ error: "Vessel not found" }, { status: 404 });
    }

    return NextResponse.json({ ...vessel, media });
  } catch (error) {
    console.error("GET /api/vessels/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch vessel details" },
      { status: 500 }
    );
  }
}

// ─── PUT /api/vessels/[id] ────────────────────────────────────
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role === "editor") {
    return NextResponse.json(
      { error: "Forbidden: Editors cannot modify fleet" },
      { status: 403 }
    );
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = vesselFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      imoNumber,
      name,
      type,
      status,
      charterRateUsd,
      salePriceUsd,
      priceOnRequest,
      currentLocation,
      tradingArea,
      dwt,
      teu,
      cubicCapacity,
      yearBuilt,
      flag,
      loa,
      beam,
      draft,
      maxSpeed,
      ecoSpeed,
      classSociety,
      description,
      deckEquipment,
      coverImageUrl,
    } = parsed.data;

    if (isDbConnected) {
      try {
        const [updated] = await db
          .update(vessels)
          .set({
            imoNumber: imoNumber || null,
            name,
            type: type as any,
            status: status as any,
            charterRateUsd: charterRateUsd ? charterRateUsd.toString() : null,
            salePriceUsd: salePriceUsd ? salePriceUsd.toString() : null,
            priceOnRequest,
            currentLocation: currentLocation || null,
            tradingArea: tradingArea || null,
            dwt: dwt || null,
            teu: teu || null,
            cubicCapacity: cubicCapacity ? cubicCapacity.toString() : null,
            yearBuilt: yearBuilt || null,
            flag: flag || null,
            loa: loa ? loa.toString() : null,
            beam: beam ? beam.toString() : null,
            draft: draft ? draft.toString() : null,
            maxSpeed: maxSpeed ? maxSpeed.toString() : null,
            ecoSpeed: ecoSpeed ? ecoSpeed.toString() : null,
            classSociety: classSociety || null,
            description: description || null,
            deckEquipment: deckEquipment || null,
            coverImageUrl: coverImageUrl || null,
            updatedAt: new Date(),
          })
          .where(eq(vessels.id, id))
          .returning();

        if (updated) return NextResponse.json(updated);
      } catch (dbErr) {
        console.warn("DB update failed, fallback to in-memory:", dbErr);
      }
    }

    // In-memory fallback
    const idx = sampleVessels.findIndex((v) => v.id === id);
    if (idx !== -1) {
      sampleVessels[idx] = {
        ...sampleVessels[idx],
        imoNumber: imoNumber || null,
        name,
        type,
        status,
        charterRateUsd: charterRateUsd ? charterRateUsd.toString() : null,
        salePriceUsd: salePriceUsd ? salePriceUsd.toString() : null,
        priceOnRequest,
        currentLocation: currentLocation || null,
        tradingArea: tradingArea || null,
        dwt: dwt || null,
        teu: teu || null,
        cubicCapacity: cubicCapacity ? cubicCapacity.toString() : null,
        yearBuilt: yearBuilt || null,
        flag: flag || null,
        loa: loa ? loa.toString() : null,
        beam: beam ? beam.toString() : null,
        draft: draft ? draft.toString() : null,
        maxSpeed: maxSpeed ? maxSpeed.toString() : null,
        ecoSpeed: ecoSpeed ? ecoSpeed.toString() : null,
        classSociety: classSociety || null,
        description: description || null,
        coverImageUrl: coverImageUrl || (body.media?.find((m: any) => m.isCover)?.url || sampleVessels[idx].coverImageUrl),
        media: body.media || sampleVessels[idx].media || [],
        updatedAt: new Date(),
      } as any;
      return NextResponse.json(sampleVessels[idx]);
    }

    return NextResponse.json({ error: "Vessel not found" }, { status: 404 });
  } catch (error: any) {
    console.error("PUT /api/vessels/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update vessel" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/vessels/[id] ─────────────────────────────────
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role === "editor") {
    return NextResponse.json(
      { error: "Forbidden: Editors cannot modify fleet" },
      { status: 403 }
    );
  }

  const { id } = await params;

  try {
    if (isDbConnected) {
      try {
        await db.delete(vessels).where(eq(vessels.id, id));
      } catch (dbErr) {
        console.warn("DB delete failed, fallback to in-memory:", dbErr);
      }
    }

    const idx = sampleVessels.findIndex((v) => v.id === id);
    if (idx !== -1) {
      sampleVessels.splice(idx, 1);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/vessels/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete vessel" },
      { status: 500 }
    );
  }
}
