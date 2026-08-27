import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: "admin" | "manager" | "editor";
  }

  interface Session {
    user: User & {
      id: string;
      role: "admin" | "manager" | "editor";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "manager" | "editor";
  }
}
