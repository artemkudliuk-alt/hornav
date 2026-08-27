"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Anchor,
  Calendar,
  CheckCircle2,
  Clock,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Send,
  Ship,
  User,
  XCircle,
} from "lucide-react";

interface LeadDetailProps {
  lead: any | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: string) => Promise<void>;
}

export function LeadDetailSheet({
  lead,
  isOpen,
  onClose,
  onStatusChange,
}: LeadDetailProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!lead) return null;

  const leadData = lead.lead || lead;
  const vesselData = lead.vessel;

  const statusBadge: Record<string, string> = {
    new: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    in_progress: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    declined: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
  };

  async function handleStatusSelect(val: string | null) {
    if (!val) return;
    setIsUpdating(true);
    await onStatusChange(leadData.id, val);
    setIsUpdating(false);
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl bg-[#18181b] border-l border-white/10 text-white p-0 overflow-y-auto"
      >
        {/* Header Block */}
        <div className="p-6 border-b border-white/5 bg-[#141416]/90 sticky top-0 z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-neutral-500">
              INQUIRY ID: #{leadData.id.slice(0, 8)}
            </span>
            <Badge
              className={`text-[10px] uppercase font-mono px-2 py-0.5 ${
                statusBadge[leadData.status] || statusBadge.new
              }`}
            >
              {leadData.status.replace("_", " ")}
            </Badge>
          </div>

          <SheetTitle className="text-xl font-semibold text-white">
            {leadData.clientName}
          </SheetTitle>

          {/* Quick Status Bar */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs text-neutral-400">Update Status:</span>
            <Select
              value={leadData.status}
              onValueChange={handleStatusSelect}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-44 bg-[#202023] border-white/10 text-xs text-white h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-none bg-[#202023] border-white/10 text-white text-xs">
                <SelectItem value="new">🟢 New</SelectItem>
                <SelectItem value="in_progress">🟡 In Progress</SelectItem>
                <SelectItem value="completed">🔵 Completed</SelectItem>
                <SelectItem value="declined">⚪ Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 1. Client Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#c89b3c] flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              Client Contact Info
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-none bg-[#202023]/70 border border-white/5 text-xs">
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">Email</span>
                {leadData.clientEmail ? (
                  <a
                    href={`mailto:${leadData.clientEmail}`}
                    className="text-white hover:text-[#c89b3c] font-medium flex items-center gap-1.5 mt-0.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    {leadData.clientEmail}
                  </a>
                ) : (
                  <span className="text-neutral-500">Not provided</span>
                )}
              </div>

              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">Phone</span>
                {leadData.clientPhone ? (
                  <a
                    href={`tel:${leadData.clientPhone}`}
                    className="text-white hover:text-[#c89b3c] font-medium flex items-center gap-1.5 mt-0.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    {leadData.clientPhone}
                  </a>
                ) : (
                  <span className="text-neutral-500">Not provided</span>
                )}
              </div>

              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">WhatsApp</span>
                <span className="text-neutral-300 block mt-0.5">
                  {leadData.clientWhatsapp || "—"}
                </span>
              </div>

              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">Telegram</span>
                <span className="text-neutral-300 block mt-0.5">
                  {leadData.clientTelegram || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Freight & Logistics Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#c89b3c] flex items-center gap-2">
              <Package className="w-3.5 h-3.5" />
              Freight & Route Parameters
            </h4>
            <div className="p-4 rounded-none bg-[#202023]/70 border border-white/5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-white/5">
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    Loading Port
                  </span>
                  <span className="font-semibold text-white block mt-1">
                    {leadData.loadingPort || "Unspecified"}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    Discharge Port
                  </span>
                  <span className="font-semibold text-white block mt-1">
                    {leadData.dischargePort || "Unspecified"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">Cargo Type</span>
                  <span className="text-neutral-200 uppercase font-mono block mt-0.5">
                    {leadData.cargoType || "Dry Bulk"}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">Quantity / Volume</span>
                  <span className="text-neutral-200 font-mono block mt-0.5">
                    {leadData.cargoVolume || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Linked Vessel (if any) */}
          {vesselData && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#c89b3c] flex items-center gap-2">
                <Ship className="w-3.5 h-3.5" />
                Target Vessel
              </h4>
              <div className="p-4 rounded-none bg-[#202023]/70 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white block">
                    {typeof vesselData.name === "string" ? vesselData.name : ((vesselData.name as any)?.en || "Target Vessel")}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    IMO: {vesselData.imoNumber || "N/A"} • {vesselData.dwt ? `${vesselData.dwt} DWT` : vesselData.type}
                  </span>
                </div>
                <Badge variant="outline" className="text-[9px] uppercase font-mono rounded-none">
                  {vesselData.status}
                </Badge>
              </div>
            </div>
          )}

          {/* 4. Client Comment / Special Instructions */}
          {leadData.comment && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#c89b3c] flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" />
                Client Remarks
              </h4>
              <div className="p-4 rounded-none bg-[#202023]/70 border border-white/5 text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {leadData.comment}
              </div>
            </div>
          )}

          {/* 5. Metadata */}
          <div className="pt-4 border-t border-white/5 text-[11px] text-neutral-500 font-mono flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Received: {new Date(leadData.createdAt).toLocaleString("en-GB")}
            </span>
            {leadData.sourcePage && (
              <span className="flex items-center gap-1.5 truncate max-w-xs">
                <Globe className="w-3.5 h-3.5" />
                {leadData.sourcePage}
              </span>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
