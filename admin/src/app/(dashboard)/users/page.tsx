import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db, isDbConnected } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { UsersManager } from "@/components/users/users-manager";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  let usersList: any[] = [
    {
      id: session.user.id || "00000000-0000-0000-0000-000000000001",
      name: session.user.name || "Danamira SuperAdmin",
      email: session.user.email || "admin@danamirashipping.com",
      role: "admin",
      telegramChatId: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      name: "Fleet Operations Manager",
      email: "manager@danamirashipping.com",
      role: "manager",
      telegramChatId: "987654321",
      createdAt: new Date().toISOString(),
    },
  ];

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
