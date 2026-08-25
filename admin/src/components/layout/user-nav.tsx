"use client";

import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, Shield, User } from "lucide-react";

interface UserNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
}

export function UserNav({ user }: UserNavProps) {
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "DM";

  const roleColors: Record<string, string> = {
    admin: "bg-red-500/10 text-red-400 border-red-500/20",
    manager: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    editor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  const role = user.role || "editor";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none cursor-pointer group">
        <div className="flex flex-col text-right hidden sm:flex">
          <span className="text-xs font-medium text-white group-hover:text-[#c89b3c] transition-colors">
            {user.name || "User"}
          </span>
          <div className="flex items-center justify-end gap-1 mt-0.5">
            <span className="text-[10px] text-neutral-500 font-mono">
              {user.email}
            </span>
          </div>
        </div>

        <Avatar className="w-9 h-9 border border-white/10 bg-[#27272a] text-neutral-200">
          <AvatarFallback className="text-xs font-bold text-[#c89b3c] bg-[#202023]">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 bg-[#202023] border-white/10 text-white shadow-xl"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">
              {user.name}
            </p>
            <p className="text-xs leading-none text-neutral-400">
              {user.email}
            </p>
            <div className="pt-2">
              <Badge
                variant="outline"
                className={`text-[10px] uppercase font-mono tracking-wider ${
                  roleColors[role] || roleColors.editor
                }`}
              >
                <Shield className="w-3 h-3 mr-1" />
                {role}
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer text-xs"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
