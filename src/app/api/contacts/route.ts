import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, isDbConnected } from "@/lib/db";
import { companyContacts } from "@/lib/db/schema";
import { companyContactsSchema } from "@/lib/validators";
import { sampleCompanyContacts } from "@/lib/db/mock-data";
import { eq } from "drizzle-orm";

// ─── GET /api/contacts ────────────────────────────────────────
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isDbConnected) {
    try {
      const [contacts] = await db.select().from(companyContacts).limit(1);
      if (contacts) return NextResponse.json(contacts);
    } catch (error) {
      console.warn("DB offline, using sampleCompanyContacts fallback");
    }
  }

  return NextResponse.json(sampleCompanyContacts);
}

// ─── PUT /api/contacts ────────────────────────────────────────
export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = companyContactsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { hotlinePhone, generalEmail, telegram, whatsapp } = parsed.data;

    if (isDbConnected) {
      try {
        const [existing] = await db.select().from(companyContacts).limit(1);

        if (existing) {
          const [updated] = await db
            .update(companyContacts)
            .set({
              hotlinePhone: hotlinePhone || null,
              generalEmail: generalEmail || null,
              telegram: telegram || null,
              whatsapp: whatsapp || null,
              updatedAt: new Date(),
            })
            .where(eq(companyContacts.id, existing.id))
            .returning();
          return NextResponse.json(updated);
        } else {
          const [created] = await db
            .insert(companyContacts)
            .values({
              hotlinePhone: hotlinePhone || null,
              generalEmail: generalEmail || null,
              telegram: telegram || null,
              whatsapp: whatsapp || null,
            })
            .returning();
          return NextResponse.json(created);
        }
      } catch (dbErr: any) {
        console.warn("DB update error, falling back to mock:", dbErr.message);
      }
    }

    // Mock store update
    sampleCompanyContacts.hotlinePhone = hotlinePhone || "";
    sampleCompanyContacts.generalEmail = generalEmail || "";
    sampleCompanyContacts.telegram = telegram || "";
    sampleCompanyContacts.whatsapp = whatsapp || "";

    return NextResponse.json(sampleCompanyContacts);
  } catch (error) {
    console.error("PUT /api/contacts error:", error);
    return NextResponse.json(
      { error: "Failed to update company contacts" },
      { status: 500 }
    );
  }
}
