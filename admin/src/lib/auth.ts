import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // 1. First, attempt to query the PostgreSQL database if online
        try {
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

          if (user) {
            const isValid = await bcrypt.compare(password, user.passwordHash);
            if (isValid) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              };
            }
          }
        } catch (dbErr) {
          console.warn(
            "Database connection unavailable during login, checking local fallback credentials:",
            dbErr instanceof Error ? dbErr.message : dbErr
          );
        }

        // 2. Built-in default credentials for local development & fallback
        if (
          email.toLowerCase() === "admin@danamirashipping.com" &&
          password === "AdminPassword123!"
        ) {
          return {
            id: "00000000-0000-0000-0000-000000000001",
            email: "admin@danamirashipping.com",
            name: "Danamira SuperAdmin",
            role: "admin" as const,
          };
        }

        if (
          email.toLowerCase() === "manager@danamirashipping.com" &&
          password === "ManagerPassword123!"
        ) {
          return {
            id: "00000000-0000-0000-0000-000000000002",
            email: "manager@danamirashipping.com",
            name: "Fleet Operations Manager",
            role: "manager" as const,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isLoginPage = nextUrl.pathname.startsWith("/login");
      const isPublicApi = nextUrl.pathname.startsWith("/api/public");
      const isAuthApi = nextUrl.pathname.startsWith("/api/auth");

      // Allow public API and Auth handlers without session
      if (isPublicApi || isAuthApi) return true;

      if (!isLoggedIn && !isLoginPage) {
        return false; // Redirect to login
      }

      if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
});
