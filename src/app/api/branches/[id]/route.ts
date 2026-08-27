import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, isDbConnected } from "@/lib/db";
import { branchOffices } from "@/lib/db/schema";
import { branchOfficeFormSchema } from "@/lib/validators";
import { sampleBranches } from "@/lib/db/mock-data";
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

    const data = parsed.data;

    if (isDbConnected) {
      try {
        const [updated] = await db
          .update(branchOffices)
          .set({
            name: data.name,
            portCity: data.portCity,
            country: data.country,
            address: data.address || null,
            phone: data.phone || null,
            email: data.email || null,
            agentName: data.agentName || null,
            sortOrder: data.sortOrder || 0,
            updatedAt: new Date(),
          })
          .where(eq(branchOffices.id, id))
          .returning();

        if (updated) return NextResponse.json(updated);
      } catch (dbErr: any) {
        console.warn("DB update error, falling back to mock:", dbErr.message);
      }
    }

    const idx = sampleBranches.findIndex((b) => b.id === id);
    if (idx !== -1) {
      sampleBranches[idx] = {
        ...sampleBranches[idx],
        ...data,
      };
      return NextResponse.json(sampleBranches[idx]);
    }

    return NextResponse.json({ error: "Office not found" }, { status: 404 });
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
    if (isDbConnected) {
      try {
        const [deleted] = await db
          .delete(branchOffices)
          .where(eq(branchOffices.id, id))
          .returning();

        if (deleted) return NextResponse.json({ success: true, id: deleted.id });
      } catch (dbErr) {
        console.warn("DB delete error, falling back to mock");
      }
    }

    const idx = sampleBranches.findIndex((b) => b.id === id);
    if (idx !== -1) {
      sampleBranches.splice(idx, 1);
      return NextResponse.json({ success: true, id });
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("DELETE /api/branches/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete branch office" },
      { status: 500 }
    );
  }
}
