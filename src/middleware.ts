export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/overview/:path*",
    "/admin/:path*",
    "/settings/:path*",
    "/users/:path*",
    "/leads/:path*",
    "/pages/:path*",
    "/fleet/:path*",
  ],
};
