import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { branchOffices } from "@/lib/db/schema";
import { branchOfficeFormSchema } from "@/lib/validators";
import { asc } from "drizzle-orm";

// ─── GET /api/branches ────────────────────────────────────────
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = await db
      .select()
      .from(branchOffices)
      .orderBy(asc(branchOffices.sortOrder));
    return NextResponse.json(list);
  } catch (error) {
    console.error("GET /api/branches error:", error);
    return NextResponse.json(
      { error: "Failed to fetch branch offices" },
      { status: 500 }
    );
  }
}

// ─── POST /api/branches ───────────────────────────────────────
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = branchOfficeFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, portCity, country, address, phone, email, agentName, sortOrder } = parsed.data;

    const [created] = await db
      .insert(branchOffices)
      .values({
        name,
        portCity,
        country,
        address: address || null,
        phone: phone || null,
        email: email || null,
        agentName: agentName || null,
        sortOrder: sortOrder || 0,
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/branches error:", error);
    return NextResponse.json(
      { error: "Failed to create branch office" },
      { status: 500 }
    );
  }
}
