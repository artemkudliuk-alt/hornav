import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { vessels, vesselMedia } from "@/lib/db/schema";
import { vesselFormSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";

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
    const [vessel] = await db
      .select()
      .from(vessels)
      .where(eq(vessels.id, id))
      .limit(1);

    if (!vessel) {
      return NextResponse.json({ error: "Vessel not found" }, { status: 404 });
    }

    const media = await db
      .select()
      .from(vesselMedia)
      .where(eq(vesselMedia.vesselId, id))
      .orderBy(vesselMedia.sortOrder);

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

    const [updated] = await db
      .update(vessels)
      .set({
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
        deckEquipment: deckEquipment || null,
        coverImageUrl: coverImageUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(vessels.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Vessel not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
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
    const [deleted] = await db
      .delete(vessels)
      .where(eq(vessels.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Vessel not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: deleted.id });
  } catch (error) {
    console.error("DELETE /api/vessels/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete vessel" },
      { status: 500 }
    );
  }
}
