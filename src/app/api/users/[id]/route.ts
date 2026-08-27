import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, isDbConnected } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { userUpdateSchema } from "@/lib/validators";
import { sampleUsers } from "@/lib/db/mock-data";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

// ─── PUT /api/users/[id] (Admin Only) ─────────────────────────
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = userUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password, role, telegramChatId } = parsed.data;

    if (isDbConnected) {
      try {
        const updatePayload: any = { updatedAt: new Date() };

        if (name) updatePayload.name = name;
        if (email) updatePayload.email = email;
        if (role) updatePayload.role = role;
        if (telegramChatId !== undefined) updatePayload.telegramChatId = telegramChatId;
        if (password) {
          updatePayload.passwordHash = await bcrypt.hash(password, 10);
        }

        const [updated] = await db
          .update(users)
          .set(updatePayload)
          .where(eq(users.id, id))
          .returning({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            telegramChatId: users.telegramChatId,
          });

        if (updated) return NextResponse.json(updated);
      } catch (dbErr: any) {
        console.warn("DB update error, falling back to mock:", dbErr.message);
      }
    }

    const idx = sampleUsers.findIndex((u) => u.id === id);
    if (idx !== -1) {
      sampleUsers[idx] = {
        ...sampleUsers[idx],
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
        ...(telegramChatId !== undefined && { telegramChatId }),
      };
      return NextResponse.json(sampleUsers[idx]);
    }

    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    console.error("PUT /api/users/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/users/[id] (Admin Only) ──────────────────────
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  // Prevent admin from deleting themselves
  if (id === session.user.id) {
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 400 }
    );
  }

  try {
    if (isDbConnected) {
      try {
        const [deleted] = await db
          .delete(users)
          .where(eq(users.id, id))
          .returning();

        if (deleted) return NextResponse.json({ success: true, id: deleted.id });
      } catch (dbErr) {
        console.warn("DB delete error, falling back to mock");
      }
    }

    const idx = sampleUsers.findIndex((u) => u.id === id);
    if (idx !== -1) {
      sampleUsers.splice(idx, 1);
      return NextResponse.json({ success: true, id });
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("DELETE /api/users/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
