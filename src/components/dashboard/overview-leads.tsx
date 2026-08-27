"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { LeadDetailSheet } from "@/components/leads/lead-detail-sheet";
import { ChevronRight } from "lucide-react";

interface OverviewLeadsProps {
  initialLeads: any[];
}

export function OverviewLeads({ initialLeads }: OverviewLeadsProps) {
  const [leadsList, setLeadsList] = useState<any[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const leadStatusBadge: Record<string, string> = {
    new: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    in_progress: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    completed: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    declined: "bg-neutral-500/10 text-neutral-400 border-neutral-500/30",
  };

  async function handleStatusChange(leadId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setLeadsList((prev) =>
          prev.map((item) => {
            const currentId = item.lead?.id || item.id;
            if (currentId === leadId) {
              if (item.lead) {
                return { ...item, lead: { ...item.lead, status: newStatus } };
              }
              return { ...item, status: newStatus };
            }
            return item;
          })
        );
        if (selectedLead) {
          if (selectedLead.lead) {
            setSelectedLead({
              ...selectedLead,
              lead: { ...selectedLead.lead, status: newStatus },
            });
          } else {
            setSelectedLead({ ...selectedLead, status: newStatus });
          }
        }
      }
    } catch (err) {
      console.error("Failed to update status on overview:", err);
    }
  }

  function handleOpenLead(lead: any) {
    setSelectedLead(lead);
    setIsSheetOpen(true);
  }

  if (leadsList.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-neutral-500">
        No inquiries recorded yet. Inbound forms on the website will feed directly into this table.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2.5">
        {leadsList.slice(0, 5).map((item) => {
          const lead = item.lead || item;
          const status = lead.status || "new";

          return (
            <div
              key={lead.id}
              onClick={() => handleOpenLead(item)}
              className="p-4 rounded-none bg-[#18181b] border border-white/5 hover:border-[#c89b3c]/40 flex items-center justify-between gap-4 transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-xs text-white group-hover:text-[#c89b3c] transition-colors truncate">
                    {lead.clientName}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-none font-bold tracking-wider ${
                      leadStatusBadge[status] || leadStatusBadge.new
                    }`}
                  >
                    {status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="text-[11px] text-neutral-400 mt-1.5 flex items-center gap-2 truncate">
                  <span className="text-neutral-300 font-medium">
                    {lead.loadingPort || "Port TBA"} &rarr; {lead.dischargePort || "Port TBA"}
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-neutral-400">
                    {lead.cargoType || "General Bulk"} {lead.cargoVolume ? `(${lead.cargoVolume})` : ""}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 font-mono block">
                    {new Date(lead.createdAt || Date.now()).toLocaleDateString("en-GB")}
                  </span>
                  <span className="text-[10px] text-[#c89b3c] font-mono uppercase tracking-wider group-hover:underline">
                    Quick Inspect
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-[#c89b3c] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-over Lead Inspector Sheet */}
      <LeadDetailSheet
        lead={selectedLead}
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false);
          setSelectedLead(null);
        }}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
