import { NextResponse } from "next/server";
import { db, isDbConnected } from "@/lib/db";
import { leads, vessels } from "@/lib/db/schema";
import { leadCreateSchema } from "@/lib/validators";
import { notifyNewLead } from "@/lib/telegram";
import { sendLeadEmailNotification } from "@/lib/email";
import { eq } from "drizzle-orm";
import { sampleLeads } from "@/lib/db/mock-data";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = leadCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        {
          status: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    const {
      clientName,
      clientPhone,
      phone,
      clientEmail,
      email,
      clientWhatsapp,
      clientTelegram,
      loadingPort,
      dischargePort,
      cargoType,
      cargoVolume,
      vesselId,
      comment,
      message,
      sourcePage,
    } = parsed.data;

    const normalizedPhone = clientPhone || phone || null;
    const normalizedEmail = clientEmail || email || null;
    const normalizedComment = comment || message || null;

    let leadId = `lead-${Date.now()}`;
    let vesselName: string | null = null;

    if (isDbConnected) {
      try {
        const [newLead] = await db
          .insert(leads)
          .values({
            clientName,
            clientPhone: normalizedPhone,
            clientEmail: normalizedEmail,
            clientWhatsapp: clientWhatsapp || null,
            clientTelegram: clientTelegram || null,
            loadingPort: loadingPort || null,
            dischargePort: dischargePort || null,
            cargoType: cargoType || null,
            cargoVolume: cargoVolume || null,
            vesselId: vesselId || null,
            comment: normalizedComment,
            sourcePage: sourcePage || null,
            status: "new",
          })
          .returning();

        leadId = newLead.id;

        if (vesselId) {
          const [v] = await db
            .select({ name: vessels.name })
            .from(vessels)
            .where(eq(vessels.id, vesselId))
            .limit(1);
          if (v) {
            vesselName = (v.name as any)?.en || null;
          }
        }
      } catch (dbErr) {
        console.warn("Could not insert lead to DB, continuing notification dispatch:", dbErr);
      }
    } else {
      const mockLead = {
        id: leadId,
        status: "new",
        clientName,
        clientPhone: normalizedPhone,
        clientEmail: normalizedEmail,
        clientWhatsapp: clientWhatsapp || null,
        clientTelegram: clientTelegram || null,
        loadingPort: loadingPort || null,
        dischargePort: dischargePort || null,
        cargoType: cargoType || null,
        cargoVolume: cargoVolume || null,
        vesselId: vesselId || null,
        comment: normalizedComment,
        sourcePage: sourcePage || null,
        createdAt: new Date().toISOString(),
      };
      sampleLeads.unshift(mockLead);
    }

    // Trigger asynchronous notifications (Telegram + Email)
    const notificationPayload = {
      id: leadId,
      clientName,
      clientEmail,
      clientPhone,
      clientWhatsapp,
      clientTelegram,
      loadingPort,
      dischargePort,
      cargoType,
      cargoVolume,
      comment,
      sourcePage,
      vesselName,
    };

    // Non-blocking notification dispatch
    Promise.allSettled([
      notifyNewLead(notificationPayload),
      sendLeadEmailNotification(notificationPayload),
    ]).catch((e) => console.error("Notification dispatch error:", e));

    return NextResponse.json(
      { success: true, id: leadId },
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("POST /api/public/leads error:", error);
    return NextResponse.json(
      { error: "Internal server error submitting inquiry" },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
