import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { leads, vessels, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

// ─── GET /api/leads ───────────────────────────────────────────
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  try {
    const query = status
      ? db
          .select({
            lead: leads,
            vessel: vessels,
            assignedUser: users,
          })
          .from(leads)
          .leftJoin(vessels, eq(leads.vesselId, vessels.id))
          .leftJoin(users, eq(leads.assignedTo, users.id))
          .where(eq(leads.status, status as any))
          .orderBy(desc(leads.createdAt))
      : db
          .select({
            lead: leads,
            vessel: vessels,
            assignedUser: users,
          })
          .from(leads)
          .leftJoin(vessels, eq(leads.vesselId, vessels.id))
          .leftJoin(users, eq(leads.assignedTo, users.id))
          .orderBy(desc(leads.createdAt));

    const results = await query;
    return NextResponse.json(results);
  } catch (error) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
