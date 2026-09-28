import { db, isDbConnected } from "@/lib/db";
import { vessels } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { sampleVessels } from "@/lib/db/mock-data";
import { FleetManager } from "@/components/fleet/fleet-manager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FleetPage() {
  let fleetList: any[] = [...sampleVessels];

  if (isDbConnected) {
    try {
      const data = await db
        .select()
        .from(vessels)
        .orderBy(desc(vessels.createdAt));
      if (data.length > 0) fleetList = data;
    } catch (err) {
      console.warn("DB offline, using sample fleet list.");
    }
  }

  return <FleetManager initialFleet={fleetList} />;
}
