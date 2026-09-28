import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db, isDbConnected } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { sampleUsers } from "@/lib/db/mock-data";
import { UsersManager } from "@/components/users/users-manager";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  let usersList: any[] = sampleUsers;

  if (isDbConnected) {
    try {
      const data = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          telegramChatId: users.telegramChatId,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt));
      if (data.length > 0) usersList = data;
    } catch (err) {
      console.warn("DB offline, using default users list.");
    }
  }

  return (
    <UsersManager
      initialUsers={usersList}
      currentUserId={session.user.id}
    />
  );
}
