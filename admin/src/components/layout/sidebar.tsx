"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Anchor,
  FileText,
  Inbox,
  LayoutDashboard,
  MapPin,
  Settings,
  Ship,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userRole?: string;
}

export function Sidebar({ userRole = "editor" }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    {
      title: "Overview",
      href: "/",
      icon: LayoutDashboard,
      roles: ["admin", "manager", "editor"],
    },
    {
      title: "Leads & Inquiries",
      href: "/leads",
      icon: Inbox,
      roles: ["admin", "manager"],
    },
    {
      title: "Fleet Catalog",
      href: "/fleet",
      icon: Ship,
      roles: ["admin", "manager"],
    },
    {
      title: "Site Pages & SEO",
      href: "/pages",
      icon: FileText,
      roles: ["admin", "editor"],
    },
    {
      title: "Branch Offices",
      href: "/contacts",
      icon: MapPin,
      roles: ["admin", "editor"],
    },
    {
      title: "Users & Access",
      href: "/users",
      icon: Users,
      roles: ["admin"],
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      roles: ["admin"],
    },
  ];

  const filteredNav = navigation.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <aside className="w-64 bg-[#141416] border-r border-white/5 flex flex-col shrink-0 min-h-[100dvh]">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-8 h-8 relative shrink-0">
          <Image
            src="/logo.png"
            alt="Danamira Logo"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-xs text-white uppercase tracking-widest">
            Danamira
          </span>
          <span className="text-[9px] text-[#c89b3c] tracking-[0.2em] uppercase font-mono">
            Fleet CMS
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {filteredNav.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-none text-xs font-medium transition-colors",
                isActive
                  ? "bg-[#202023] text-[#c89b3c] font-semibold border-l-2 border-[#c89b3c]"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-[#c89b3c]" : "text-neutral-500")} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Status Indicator */}
      <div className="p-4 border-t border-white/5">
        <div className="p-3 rounded-none bg-[#202023]/60 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-none bg-emerald-500 shadow-[0_0_6px_#10b981] animate-pulse" />
            <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
              API Active
            </span>
          </div>
          <span className="text-[9px] text-neutral-600 font-mono">v1.0</span>
        </div>
      </div>
    </aside>
  );
}
