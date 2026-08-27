"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { UserNav } from "./user-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { LogOut, Menu, Plus, Ship } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="h-16 border-b border-white/5 bg-[#141416]/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Mobile Menu Toggle */}
      <div className="flex items-center gap-4 lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-400 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </Button>
            }
          />
          <SheetContent side="left" className="p-0 w-64 bg-[#141416] border-r border-white/5">
            <Sidebar userRole={user.role || "editor"} />
          </SheetContent>
        </Sheet>
        <span className="font-semibold text-xs text-white uppercase tracking-wider">
          Danamira CMS
        </span>
      </div>

      {/* Desktop Quick Shortcuts */}
      <div className="hidden lg:flex items-center gap-3">
        {user.role !== "editor" && (
          <>
            <Link href="/fleet/new">
              <Button
                size="sm"
                variant="outline"
                className="bg-[#202023] border-white/10 hover:border-[#c89b3c]/50 text-xs text-neutral-300 hover:text-white gap-2 cursor-pointer"
              >
                <Ship className="w-3.5 h-3.5 text-[#c89b3c]" />
                Add Vessel
              </Button>
            </Link>
            <Link href="/leads">
              <Button
                size="sm"
                variant="outline"
                className="bg-[#202023] border-white/10 hover:border-[#c89b3c]/50 text-xs text-neutral-300 hover:text-white gap-2 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#c89b3c]" />
                View Leads
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-3">
        <UserNav user={user} />
        <div className="h-6 w-[1px] bg-white/10 hidden sm:block"></div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Sign out of Danamira CMS"
          className="text-neutral-400 hover:text-red-400 hover:bg-red-500/10 text-xs gap-1.5 cursor-pointer px-2.5 h-8 rounded-none border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-mono uppercase text-[10px] tracking-wider">Sign out</span>
        </Button>
      </div>
    </header>
  );
}
