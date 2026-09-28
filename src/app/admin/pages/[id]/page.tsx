import { notFound } from "next/navigation";
import { db, isDbConnected } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { PageForm } from "@/components/pages/page-form";
import { samplePages } from "@/lib/db/mock-data";

export const dynamic = "force-dynamic";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let pageData: any = null;

  if (isDbConnected) {
    try {
      const [p] = await db
        .select()
        .from(pages)
        .where(eq(pages.id, id))
        .limit(1);
      if (p) pageData = p;
    } catch (err) {
      console.warn("DB offline, checking sample pages for:", id);
    }
  }

  if (!pageData) {
    pageData = samplePages.find((p) => p.id === id) || samplePages[0];
  }

  if (!pageData) {
    notFound();
  }

  return <PageForm initialData={pageData} isEditing={true} />;
}
