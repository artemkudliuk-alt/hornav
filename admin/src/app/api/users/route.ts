import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, isDbConnected } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { userCreateSchema } from "@/lib/validators";
import { sampleUsers } from "@/lib/db/mock-data";
import bcrypt from "bcryptjs";
import { desc } from "drizzle-orm";

// ─── GET /api/users (Admin Only) ──────────────────────────────
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
  }

  if (isDbConnected) {
    try {
      const list = await db
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

      return NextResponse.json(list);
    } catch (error) {
      console.warn("DB offline, using sampleUsers fallback");
    }
  }

  return NextResponse.json(sampleUsers);
}

// ─── POST /api/users (Admin Only) ─────────────────────────────
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = userCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password, role, telegramChatId } = parsed.data;

    if (isDbConnected) {
      try {
        const passwordHash = await bcrypt.hash(password, 10);

        const [created] = await db
          .insert(users)
          .values({
            name,
            email,
            passwordHash,
            role,
            telegramChatId: telegramChatId || null,
          })
          .returning({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            telegramChatId: users.telegramChatId,
            createdAt: users.createdAt,
          });

        return NextResponse.json(created, { status: 201 });
      } catch (dbErr: any) {
        console.warn("DB insert error, falling back to mock:", dbErr.message);
      }
    }

    const newUser = {
      id: "user-" + Date.now(),
      name,
      email,
      role,
      telegramChatId: telegramChatId || null,
      createdAt: new Date().toISOString(),
    };

    sampleUsers.unshift(newUser);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
