import { NextResponse } from "next/server";
import { db, isDbConnected } from "@/lib/db";
import { companyContacts, branchOffices } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { sampleBranches } from "@/lib/db/mock-data";

export async function GET() {
  try {
    let globalContacts: any = {
      hotlinePhone: "+30 210 1234567",
      generalEmail: "snp@danamirashipping.com",
      telegram: "@danamira_ops",
      whatsapp: "+30 210 1234567",
    };
    let offices: any[] = sampleBranches;

    if (isDbConnected) {
      const [c] = await db.select().from(companyContacts).limit(1);
      if (c) globalContacts = c;

      const data = await db
        .select()
        .from(branchOffices)
        .orderBy(asc(branchOffices.sortOrder));
      if (data.length > 0) offices = data;
    }

    return NextResponse.json(
      {
        company: globalContacts,
        offices,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/public/contacts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch public contacts" },
      { status: 500 }
    );
  }
}
