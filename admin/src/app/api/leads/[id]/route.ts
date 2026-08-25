import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { leadUpdateStatusSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";

// ─── PATCH /api/leads/[id] ────────────────────────────────────
export async function PATCH(
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
    const parsed = leadUpdateStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { status, assignedTo, comment } = parsed.data;

    const updatePayload: any = {
      status,
      updatedAt: new Date(),
    };

    if (assignedTo !== undefined) updatePayload.assignedTo = assignedTo;
    if (comment !== undefined) updatePayload.comment = comment;

    const [updated] = await db
      .update(leads)
      .set(updatePayload)
      .where(eq(leads.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/leads/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update lead status" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/leads/[id] ───────────────────────────────────
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
      { error: "Forbidden: Editors cannot delete leads" },
      { status: 403 }
    );
  }

  const { id } = await params;

  try {
    const [deleted] = await db
      .delete(leads)
      .where(eq(leads.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: deleted.id });
  } catch (error) {
    console.error("DELETE /api/leads/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}
