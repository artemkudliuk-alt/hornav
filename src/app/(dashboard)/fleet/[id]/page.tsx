import { notFound } from "next/navigation";
import { db, isDbConnected } from "@/lib/db";
import { vessels, vesselMedia } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { VesselForm } from "@/components/fleet/vessel-form";
import { sampleVessels } from "@/lib/db/mock-data";

export const dynamic = "force-dynamic";

export default async function EditVesselPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let vesselData: any = null;

  if (isDbConnected) {
    try {
      const [v] = await db
        .select()
        .from(vessels)
        .where(eq(vessels.id, id))
        .limit(1);

      if (v) {
        const media = await db
          .select()
          .from(vesselMedia)
          .where(eq(vesselMedia.vesselId, id))
          .orderBy(vesselMedia.sortOrder);
        vesselData = { ...v, media };
      }
    } catch (err) {
      console.warn("DB offline, checking sample data for vessel:", id);
    }
  }

  if (!vesselData) {
    vesselData = sampleVessels.find((v) => v.id === id) || sampleVessels[0];
  }

  if (!vesselData) {
    notFound();
  }

  return <VesselForm initialData={vesselData} isEditing={true} />;
}
