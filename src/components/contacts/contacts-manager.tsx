"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  Edit3,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

interface ContactsManagerProps {
  initialContacts: any;
  initialOffices: any[];
}

export function ContactsManager({
  initialContacts,
  initialOffices,
}: ContactsManagerProps) {
  // Global contacts state
  const [contacts, setContacts] = useState({
    hotlinePhone: initialContacts?.hotlinePhone || "",
    generalEmail: initialContacts?.generalEmail || "",
    telegram: initialContacts?.telegram || "",
    whatsapp: initialContacts?.whatsapp || "",
  });
  const [isSavingContacts, setIsSavingContacts] = useState(false);
  const [contactsFeedback, setContactsFeedback] = useState<string | null>(null);

  // Branch offices state
  const [offices, setOffices] = useState<any[]>(initialOffices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState<any | null>(null);
  const [isSavingOffice, setIsSavingOffice] = useState(false);

  const [officeForm, setOfficeForm] = useState({
    name: "",
    portCity: "",
    country: "",
    address: "",
    phone: "",
    email: "",
    agentName: "",
    sortOrder: 0,
  });

  // Save global contacts
  async function handleSaveGlobalContacts(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingContacts(true);
    setContactsFeedback(null);

    try {
      const res = await fetch("/api/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contacts),
      });

      if (res.ok) {
        setContactsFeedback("✅ Contacts saved successfully");
        setTimeout(() => setContactsFeedback(null), 3000);
      } else {
        setContactsFeedback("❌ Failed to save contacts");
      }
    } catch (err) {
      console.error(err);
      setContactsFeedback("❌ Error saving contacts");
    } finally {
      setIsSavingContacts(false);
    }
  }

  // Open Dialog for Add or Edit Office
  function openOfficeDialog(office?: any) {
    if (office) {
      setEditingOffice(office);
      setOfficeForm({
        name: office.name || "",
        portCity: office.portCity || "",
        country: office.country || "",
        address: office.address || "",
        phone: office.phone || "",
        email: office.email || "",
        agentName: office.agentName || "",
        sortOrder: office.sortOrder || 0,
      });
    } else {
      setEditingOffice(null);
      setOfficeForm({
        name: "",
        portCity: "",
        country: "",
        address: "",
        phone: "",
        email: "",
        agentName: "",
        sortOrder: offices.length + 1,
      });
    }
    setIsDialogOpen(true);
  }

  // Save Office
  async function handleSaveOffice(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingOffice(true);

    try {
      const url = editingOffice
        ? `/api/branches/${editingOffice.id}`
        : `/api/branches`;
      const method = editingOffice ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(officeForm),
      });

      if (res.ok) {
        const saved = await res.json();
        if (editingOffice) {
          setOffices((prev) =>
            prev.map((o) => (o.id === saved.id ? saved : o))
          );
        } else {
          setOffices((prev) => [...prev, saved]);
        }
        setIsDialogOpen(false);
      }
    } catch (err) {
      console.error("Save office error:", err);
    } finally {
      setIsSavingOffice(false);
    }
  }

  // Delete Office
  async function handleDeleteOffice(id: string) {
    if (!confirm("Are you sure you want to delete this branch office?")) return;

    try {
      const res = await fetch(`/api/branches/${id}`, { method: "DELETE" });
      if (res.ok) {
        setOffices((prev) => prev.filter((o) => o.id !== id));
      }
    } catch (err) {
      console.error("Delete office error:", err);
    }
  }

  return (
    <div className="space-y-8">
      {/* ─── Global Company Contacts ───────────────────────────── */}
      <Card className="bg-[#202023]/70 border-white/5 p-4 sm:p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#c89b3c]" />
            Main Website Contacts (Header &amp; Footer Channels)
          </CardTitle>
          <p className="text-xs text-neutral-400">
            Primary hotline, email, Telegram, and WhatsApp displayed across the website header and footer.
          </p>
        </CardHeader>

        <form onSubmit={handleSaveGlobalContacts} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-neutral-300">Hotline Phone (24/7)</Label>
              <Input
                placeholder="+30 211 34 56 550"
                value={contacts.hotlinePhone}
                onChange={(e) =>
                  setContacts({ ...contacts, hotlinePhone: e.target.value })
                }
                className="bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-neutral-300">General Operations Email</Label>
              <Input
                type="email"
                placeholder="chartering@danamira-shipping.com"
                value={contacts.generalEmail}
                onChange={(e) =>
                  setContacts({ ...contacts, generalEmail: e.target.value })
                }
                className="bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-neutral-300">Telegram Channel / User</Label>
              <Input
                placeholder="@danamira_ops"
                value={contacts.telegram}
                onChange={(e) =>
                  setContacts({ ...contacts, telegram: e.target.value })
                }
                className="bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-neutral-300">WhatsApp Dispatch</Label>
              <Input
                placeholder="+30 211 34 56 550"
                value={contacts.whatsapp}
                onChange={(e) =>
                  setContacts({ ...contacts, whatsapp: e.target.value })
                }
                className="bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            {contactsFeedback ? (
              <span className="text-xs font-medium">{contactsFeedback}</span>
            ) : (
              <span />
            )}

            <Button
              type="submit"
              disabled={isSavingContacts}
              className="w-full sm:w-auto bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase tracking-wider gap-2 cursor-pointer"
            >
              {isSavingContacts ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save Global Contacts
            </Button>
          </div>
        </form>
      </Card>

      {/* ─── Port Agency & Branch Offices ──────────────────────── */}
      <Card className="bg-[#202023]/70 border-white/5 p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#c89b3c]" />
              Branch Offices &amp; Regional Agencies ({offices.length})
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Manage physical agency locations, addresses, local contact numbers, and lead agents.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => openOfficeDialog()}
            className="w-full sm:w-auto bg-[#202023] border border-white/10 hover:border-[#c89b3c]/50 text-xs text-neutral-200 hover:text-white gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#c89b3c]" />
            Add Port Agency
          </Button>
        </div>

        {/* Offices Table */}
        <div className="rounded-lg border border-white/5 bg-[#18181b] overflow-x-auto min-w-full block scrollbar-thin">
          <Table>
            <TableHeader className="bg-[#141416] border-b border-white/5">
              <TableRow className="border-none">
                <TableHead className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Office / Agency Name
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Location (Port / Country)
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Contact Details
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Lead Agent
                </TableHead>
                <TableHead className="w-20 text-right"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {offices.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-xs text-neutral-500"
                  >
                    No branch offices registered yet.
                  </TableCell>
                </TableRow>
              ) : (
                offices.map((office) => (
                  <TableRow
                    key={office.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <TableCell>
                      <span className="font-semibold text-xs text-white block">
                        {office.name}
                      </span>
                      {office.address && (
                        <span className="text-[11px] text-neutral-500 block truncate max-w-xs">
                          {office.address}
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-neutral-200 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#c89b3c]" />
                        {office.portCity}, {office.country}
                      </span>
                    </TableCell>

                    <TableCell className="text-xs text-neutral-300">
                      <div className="space-y-0.5">
                        {office.phone && (
                          <span className="block text-[11px] text-neutral-400 font-mono">
                            {office.phone}
                          </span>
                        )}
                        {office.email && (
                          <span className="block text-[11px] text-neutral-400">
                            {office.email}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-neutral-300">
                      {office.agentName || "—"}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openOfficeDialog(office)}
                          className="h-7 w-7 text-neutral-400 hover:text-white"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteOffice(office.id)}
                          className="h-7 w-7 text-neutral-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* ─── Add/Edit Office Modal Dialog ──────────────────────── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#202023] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-white">
              {editingOffice ? "Edit Port Agency Office" : "Add New Port Agency Office"}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Provide location particulars and local agent contact details.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveOffice} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-neutral-300">Office Title</Label>
              <Input
                placeholder="e.g. Operational Head Office / Black Sea Agency"
                value={officeForm.name}
                onChange={(e) =>
                  setOfficeForm({ ...officeForm, name: e.target.value })
                }
                required
                className="bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Port / City</Label>
                <Input
                  placeholder="e.g. Piraeus / Odesa"
                  value={officeForm.portCity}
                  onChange={(e) =>
                    setOfficeForm({ ...officeForm, portCity: e.target.value })
                  }
                  required
                  className="bg-[#18181b] border-white/10 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Country</Label>
                <Input
                  placeholder="e.g. Greece / Ukraine"
                  value={officeForm.country}
                  onChange={(e) =>
                    setOfficeForm({ ...officeForm, country: e.target.value })
                  }
                  required
                  className="bg-[#18181b] border-white/10 text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-neutral-300">Street Address</Label>
              <Input
                placeholder="e.g. Akti Miaouli 45"
                value={officeForm.address}
                onChange={(e) =>
                  setOfficeForm({ ...officeForm, address: e.target.value })
                }
                className="bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Local Phone</Label>
                <Input
                  placeholder="+30 210 4123890"
                  value={officeForm.phone}
                  onChange={(e) =>
                    setOfficeForm({ ...officeForm, phone: e.target.value })
                  }
                  className="bg-[#18181b] border-white/10 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Local Email</Label>
                <Input
                  type="email"
                  placeholder="piraeus@danamirashipping.com"
                  value={officeForm.email}
                  onChange={(e) =>
                    setOfficeForm({ ...officeForm, email: e.target.value })
                  }
                  className="bg-[#18181b] border-white/10 text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-neutral-300">Lead Port Agent Name</Label>
              <Input
                placeholder="e.g. Capt. Alexandros Nikolaou"
                value={officeForm.agentName}
                onChange={(e) =>
                  setOfficeForm({ ...officeForm, agentName: e.target.value })
                }
                className="bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
                className="text-xs text-neutral-400"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSavingOffice}
                className="bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase tracking-wider"
              >
                {isSavingOffice ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Save Agency"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
