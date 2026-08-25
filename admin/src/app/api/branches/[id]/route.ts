import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { branchOffices } from "@/lib/db/schema";
import { branchOfficeFormSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";

// ─── PUT /api/branches/[id] ───────────────────────────────────
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

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

    const [updated] = await db
      .update(branchOffices)
      .set({
        name,
        portCity,
        country,
        address: address || null,
        phone: phone || null,
        email: email || null,
        agentName: agentName || null,
        sortOrder: sortOrder || 0,
        updatedAt: new Date(),
      })
      .where(eq(branchOffices.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Office not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/branches/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update branch office" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/branches/[id] ────────────────────────────────
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const [deleted] = await db
      .delete(branchOffices)
      .where(eq(branchOffices.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Office not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: deleted.id });
  } catch (error) {
    console.error("DELETE /api/branches/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete branch office" },
      { status: 500 }
    );
  }
}
