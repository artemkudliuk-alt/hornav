import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { vessels } from "@/lib/db/schema";
import { vesselFormSchema } from "@/lib/validators";
import { desc } from "drizzle-orm";

// ─── GET /api/vessels (List all vessels) ──────────────────────
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await db
      .select()
      .from(vessels)
      .orderBy(desc(vessels.createdAt));
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/vessels error:", error);
    return NextResponse.json(
      { error: "Failed to fetch vessels" },
      { status: 500 }
    );
  }
}

// ─── POST /api/vessels (Create new vessel) ────────────────────
export async function POST(req: Request) {
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

    const [created] = await db
      .insert(vessels)
      .values({
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
        createdBy: session.user.id,
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/vessels error:", error);
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A vessel with this IMO number already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create vessel" },
      { status: 500 }
    );
  }
}
