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

    const data = parsed.data;
    const normalizedName = data.clientName || data.name || "Prospective Client";
    const normalizedPhone = data.clientPhone || data.phone || null;
    const normalizedEmail = data.clientEmail || data.email || null;
    const normalizedComment = data.comment || data.message || data.notes || (data.company ? `Company: ${data.company}` : null);
    const normalizedSource = data.sourcePage || data.source || "Website Direct Form";

    let leadId = `lead-${Date.now()}`;
    let vesselName: string | null = null;

    // Resolve UUID for vessel safely
    let targetVesselUuid: string | null = null;
    if (data.vesselId === "vessel-molpadia" || data.vesselId === "11111111-1111-1111-1111-111111111111") {
      targetVesselUuid = "11111111-1111-1111-1111-111111111111";
      vesselName = "MV MOLPADIA";
    } else if (data.vesselId === "vessel-metanira" || data.vesselId === "22222222-2222-2222-2222-222222222222") {
      targetVesselUuid = "22222222-2222-2222-2222-222222222222";
      vesselName = "MV METANIRA";
    } else if (data.vesselId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.vesselId)) {
      targetVesselUuid = data.vesselId;
    }

    if (isDbConnected) {
      try {
        const [newLead] = await db
          .insert(leads)
          .values({
            clientName: normalizedName,
            clientPhone: normalizedPhone,
            clientEmail: normalizedEmail,
            clientWhatsapp: data.clientWhatsapp || null,
            clientTelegram: data.clientTelegram || null,
            loadingPort: data.loadingPort || null,
            dischargePort: data.dischargePort || null,
            cargoType: data.cargoType || null,
            cargoVolume: data.cargoVolume || null,
            vesselId: targetVesselUuid,
            comment: normalizedComment,
            sourcePage: normalizedSource,
            status: "new",
          })
          .returning();

        leadId = newLead.id;

        if (targetVesselUuid && !vesselName) {
          const [v] = await db
            .select({ name: vessels.name })
            .from(vessels)
            .where(eq(vessels.id, targetVesselUuid))
            .limit(1);
          if (v) {
            vesselName = typeof v.name === "object" ? (v.name as any)?.en : String(v.name);
          }
        }
      } catch (dbErr) {
        console.error("Could not insert lead to PostgreSQL DB:", dbErr);
      }
    } else {
      const mockLead = {
        id: leadId,
        status: "new",
        clientName: normalizedName,
        clientPhone: normalizedPhone,
        clientEmail: normalizedEmail,
        clientWhatsapp: data.clientWhatsapp || null,
        clientTelegram: data.clientTelegram || null,
        loadingPort: data.loadingPort || null,
        dischargePort: data.dischargePort || null,
        cargoType: data.cargoType || null,
        cargoVolume: data.cargoVolume || null,
        vesselId: data.vesselId || null,
        comment: normalizedComment,
        sourcePage: normalizedSource,
        createdAt: new Date().toISOString(),
      };
      sampleLeads.unshift(mockLead);
    }

    // Trigger asynchronous notifications (Telegram + Email)
    const notificationPayload = {
      id: leadId,
      clientName: normalizedName,
      clientEmail: normalizedEmail,
      clientPhone: normalizedPhone,
      clientWhatsapp: data.clientWhatsapp,
      clientTelegram: data.clientTelegram,
      loadingPort: data.loadingPort,
      dischargePort: data.dischargePort,
      cargoType: data.cargoType,
      cargoVolume: data.cargoVolume,
      comment: normalizedComment,
      sourcePage: normalizedSource,
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
