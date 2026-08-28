"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LeadDetailSheet } from "./lead-detail-sheet";
import {
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Eye,
  Inbox,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Search,
  Ship,
  Trash2,
  XCircle,
} from "lucide-react";

interface LeadsTableProps {
  initialLeads: any[];
}

export function LeadsTable({ initialLeads }: LeadsTableProps) {
  const router = useRouter();
  const [leadsList, setLeadsList] = useState<any[]>(initialLeads);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const statusBadge: Record<string, string> = {
    new: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    in_progress: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    declined: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
  };

  const filteredLeads = leadsList.filter((item) => {
    const l = item.lead || item;
    const matchesStatus =
      statusFilter === "all" ? true : l.status === statusFilter;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesStatus;

    const matchesSearch =
      l.clientName?.toLowerCase().includes(q) ||
      l.clientEmail?.toLowerCase().includes(q) ||
      l.loadingPort?.toLowerCase().includes(q) ||
      l.dischargePort?.toLowerCase().includes(q) ||
      l.cargoType?.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

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
            const l = item.lead || item;
            if (l.id === leadId) {
              return item.lead
                ? { ...item, lead: { ...l, status: newStatus } }
                : { ...l, status: newStatus };
            }
            return item;
          })
        );

        if (selectedLead) {
          const l = selectedLead.lead || selectedLead;
          if (l.id === leadId) {
            setSelectedLead(
              selectedLead.lead
                ? { ...selectedLead, lead: { ...l, status: newStatus } }
                : { ...l, status: newStatus }
            );
          }
        }
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  }

  async function handleDelete(leadId: string) {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLeadsList((prev) =>
          prev.filter((item) => (item.lead?.id || item.id) !== leadId)
        );
        if (selectedLead && (selectedLead.lead?.id || selectedLead.id) === leadId) {
          setIsSheetOpen(false);
          setSelectedLead(null);
        }
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  function openLeadDetail(item: any) {
    setSelectedLead(item);
    setIsSheetOpen(true);
  }

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <Tabs
          value={statusFilter}
          onValueChange={setStatusFilter}
          className="w-full sm:w-auto overflow-x-auto"
        >
          <TabsList className="rounded-none bg-[#202023] border border-white/5 p-1 flex-nowrap overflow-x-auto scrollbar-none w-full sm:w-auto">
            <TabsTrigger value="all" className="rounded-none text-xs shrink-0 whitespace-nowrap">
              All ({leadsList.length})
            </TabsTrigger>
            <TabsTrigger value="new" className="rounded-none text-xs text-emerald-400 shrink-0 whitespace-nowrap">
              New ({leadsList.filter((l) => (l.lead?.status || l.status) === "new").length})
            </TabsTrigger>
            <TabsTrigger value="in_progress" className="rounded-none text-xs text-amber-400 shrink-0 whitespace-nowrap">
              In Progress ({leadsList.filter((l) => (l.lead?.status || l.status) === "in_progress").length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-none text-xs text-blue-400 shrink-0 whitespace-nowrap">
              Completed
            </TabsTrigger>
            <TabsTrigger value="declined" className="rounded-none text-xs text-neutral-400 shrink-0 whitespace-nowrap">
              Declined
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by client, email, port..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-none pl-9 bg-[#202023] border-white/10 text-xs text-white placeholder:text-neutral-500"
          />
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="rounded-none border border-white/5 bg-[#202023]/60 overflow-x-auto min-w-full block shadow-xl">
        <Table>
          <TableHeader className="bg-[#18181b] border-b border-white/5">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider w-32">
                Status
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Client Contact
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Route & Cargo
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Vessel
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider text-right">
                Received
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-xs text-neutral-500"
                >
                  No inquiries matching the selected criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((item) => {
                const lead = item.lead || item;
                const vessel = item.vessel;

                return (
                  <TableRow
                    key={lead.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                    onClick={() => openLeadDetail(item)}
                  >
                    {/* Status with Quick Dropdown */}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <button className="outline-none">
                              <Badge
                                className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-none flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity font-bold tracking-wider ${
                                  statusBadge[lead.status] || statusBadge.new
                                }`}
                              >
                                {lead.status.replace("_", " ")}
                                <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                              </Badge>
                            </button>
                          }
                        />
                        <DropdownMenuContent
                          align="start"
                          className="rounded-none bg-[#202023] border-white/10 text-white text-xs"
                        >
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(lead.id, "new")}
                            className="text-emerald-400 cursor-pointer"
                          >
                            🟢 New
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(lead.id, "in_progress")}
                            className="text-amber-400 cursor-pointer"
                          >
                            🟡 In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(lead.id, "completed")}
                            className="text-blue-400 cursor-pointer"
                          >
                            🔵 Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(lead.id, "declined")}
                            className="text-neutral-400 cursor-pointer"
                          >
                            ⚪ Declined
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>

                    {/* Client Contact */}
                    <TableCell>
                      <span className="font-semibold text-xs text-white block">
                        {lead.clientName}
                      </span>
                      <span className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                        {lead.clientEmail && (
                          <span className="truncate max-w-[160px]">{lead.clientEmail}</span>
                        )}
                        {lead.clientPhone && <span>{lead.clientPhone}</span>}
                      </span>
                    </TableCell>

                    {/* Route & Cargo */}
                    <TableCell>
                      <span className="text-xs text-neutral-200 block font-medium">
                        {lead.loadingPort || "?"} &rarr; {lead.dischargePort || "?"}
                      </span>
                      <span className="text-[11px] text-neutral-400 mt-0.5 block font-mono">
                        {lead.cargoType || "Cargo N/A"} {lead.cargoVolume ? `(${lead.cargoVolume})` : ""}
                      </span>
                    </TableCell>

                    {/* Vessel with Thumbnail */}
                    <TableCell>
                      {vessel ? (
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-7 rounded-none bg-[#141416] border border-white/10 shrink-0 overflow-hidden relative">
                            {vessel.coverImageUrl ? (
                              <img
                                src={vessel.coverImageUrl}
                                alt={typeof vessel.name === "string" ? vessel.name : ((vessel.name as any)?.en || "Vessel")}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-600">
                                <Ship className="w-3.5 h-3.5 text-[#c89b3c]" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-white hover:text-[#c89b3c] transition-colors truncate max-w-[140px] block">
                              {typeof vessel.name === "string" ? vessel.name : ((vessel.name as any)?.en || "Linked Vessel")}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-mono block">
                              {vessel.imoNumber ? `IMO ${vessel.imoNumber}` : (vessel.dwt ? `${vessel.dwt} DWT` : "Vessel")}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-neutral-500">
                          <Ship className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                          <span className="text-[11px] font-mono text-neutral-400">General Fleet</span>
                        </div>
                      )}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-right text-xs text-neutral-400 font-mono">
                      {new Date(lead.createdAt).toLocaleDateString("en-GB")}
                    </TableCell>

                    {/* Row Actions */}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-none h-8 w-8 text-neutral-500 hover:text-white"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent
                          align="end"
                          className="rounded-none bg-[#202023] border-white/10 text-white text-xs"
                        >
                          <DropdownMenuItem
                            onClick={() => openLeadDetail(item)}
                            className="gap-2 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> Inspect Lead
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(lead.id)}
                            className="gap-2 text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Inquiry
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Slide-over Detail Sheet */}
      <LeadDetailSheet
        lead={selectedLead}
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false);
          setSelectedLead(null);
        }}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
