import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Danamira Shipping — Fleet Management CMS",
  description: "Vessel fleet operations, charter inquiry management, custom landing pages, and branch agency network.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#18181b] text-neutral-100 font-sans">
        {children}
      </body>
    </html>
  );
}

