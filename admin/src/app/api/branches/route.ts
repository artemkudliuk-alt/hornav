import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, isDbConnected } from "@/lib/db";
import { branchOffices } from "@/lib/db/schema";
import { branchOfficeFormSchema } from "@/lib/validators";
import { sampleBranches } from "@/lib/db/mock-data";
import { asc } from "drizzle-orm";

// ─── GET /api/branches ────────────────────────────────────────
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isDbConnected) {
    try {
      const list = await db
        .select()
        .from(branchOffices)
        .orderBy(asc(branchOffices.sortOrder));
      return NextResponse.json(list);
    } catch (error) {
      console.warn("DB offline, using sampleBranches fallback");
    }
  }

  return NextResponse.json(sampleBranches);
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

    const data = parsed.data;

    if (isDbConnected) {
      try {
        const [created] = await db
          .insert(branchOffices)
          .values({
            name: data.name,
            portCity: data.portCity,
            country: data.country,
            address: data.address || null,
            phone: data.phone || null,
            email: data.email || null,
            agentName: data.agentName || null,
            sortOrder: data.sortOrder || 0,
          })
          .returning();

        return NextResponse.json(created, { status: 201 });
      } catch (dbErr: any) {
        console.warn("DB insert error, falling back to mock:", dbErr.message);
      }
    }

    const newBranch = {
      id: "branch-" + Date.now(),
      name: data.name,
      portCity: data.portCity,
      country: data.country,
      address: data.address || "",
      phone: data.phone || "",
      email: data.email || "",
      agentName: data.agentName || "",
      sortOrder: data.sortOrder || sampleBranches.length + 1,
    };

    sampleBranches.push(newBranch);
    return NextResponse.json(newBranch, { status: 201 });
  } catch (error) {
    console.error("POST /api/branches error:", error);
    return NextResponse.json(
      { error: "Failed to create branch office" },
      { status: 500 }
    );
  }
}
