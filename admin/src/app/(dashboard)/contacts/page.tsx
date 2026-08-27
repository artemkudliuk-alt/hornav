import { db, isDbConnected } from "@/lib/db";
import { companyContacts, branchOffices } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { sampleBranches, sampleCompanyContacts } from "@/lib/db/mock-data";
import { ContactsManager } from "@/components/contacts/contacts-manager";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  let contactsData: any = sampleCompanyContacts;
  let officesList: any[] = sampleBranches;

  if (isDbConnected) {
    try {
      const [c] = await db.select().from(companyContacts).limit(1);
      if (c) contactsData = c;

      const offices = await db
        .select()
        .from(branchOffices)
        .orderBy(asc(branchOffices.sortOrder));
      if (offices.length > 0) officesList = offices;
    } catch (err) {
      console.warn("DB offline, using sample contacts & offices.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
          Contacts & Offices
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Manage company global contact lines (header &amp; footer) and regional branch offices.
        </p>
      </div>

      <ContactsManager
        initialContacts={contactsData}
        initialOffices={officesList}
      />
    </div>
  );
}
