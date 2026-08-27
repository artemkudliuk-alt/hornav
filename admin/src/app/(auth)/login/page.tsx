"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, Mail, ShieldAlert } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError("Invalid email or password. Please check your credentials.");
        setIsLoading(false);
      } else {
        const targetUrl = !callbackUrl || callbackUrl.includes("/api/auth/error") || callbackUrl.includes("/login")
          ? "/"
          : callbackUrl;
        window.location.href = targetUrl;
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md bg-[#202023]/90 border-white/10 shadow-2xl backdrop-blur-md relative z-10">
      <CardHeader className="text-center space-y-4 pb-6">
        <div className="mx-auto w-20 h-20 relative flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Danamira Shipping"
            width={80}
            height={80}
            priority
            className="object-contain drop-shadow-[0_0_15px_rgba(200,155,60,0.2)]"
          />
        </div>
        <div>
          <CardTitle className="text-xl font-semibold uppercase tracking-widest text-white">
            Danamira Shipping
          </CardTitle>
          <CardDescription className="text-xs text-[#c89b3c] tracking-[0.2em] uppercase mt-1">
            Fleet Management CMS
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs text-neutral-300">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                id="email"
                type="email"
                placeholder="admin@danamirashipping.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="pl-10 bg-[#18181b] border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-[#c89b3c]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs text-neutral-300">
              Password
            </Label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="pl-10 bg-[#18181b] border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-[#c89b3c]"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] font-semibold tracking-wider text-xs uppercase py-5 transition-all cursor-pointer mt-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Authenticating...
              </>
            ) : (
              "Sign In to CMS"
            )}
          </Button>
        </form>

        {/* Quick Demo Switcher */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5">
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block text-center">
            Quick 1-Click Role Login:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail("admin@danamirashipping.com");
                setPassword("AdminPassword123!");
              }}
              className="p-2.5 bg-[#18181b] border border-red-500/30 hover:border-red-500/60 rounded-none text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span className="text-[11px] font-semibold text-white">SuperAdmin</span>
              </div>
              <span className="text-[9px] text-neutral-400 font-mono block mt-0.5">Full System Access</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail("manager@danamirashipping.com");
                setPassword("ManagerPassword123!");
              }}
              className="p-2.5 bg-[#18181b] border border-amber-500/30 hover:border-amber-500/60 rounded-none text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="text-[11px] font-semibold text-white">Fleet Manager</span>
              </div>
              <span className="text-[9px] text-neutral-400 font-mono block mt-0.5">Fleet + Leads Desk</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center border-t border-white/5 pt-4 text-[11px] text-neutral-500 font-mono">
          SYS // DANAMIRA.CMS.V1.0
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#141416] p-4 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(200,155,60,0.12),rgba(255,255,255,0))] pointer-events-none" />
      <Suspense fallback={<div className="text-neutral-500 text-xs font-mono">Loading CMS Gateway...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
