"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit3,
  Loader2,
  Lock,
  Mail,
  Plus,
  Send,
  Shield,
  Trash2,
  User,
  Users as UsersIcon,
} from "lucide-react";

interface UsersManagerProps {
  initialUsers: any[];
  currentUserId: string;
}

export function UsersManager({
  initialUsers,
  currentUserId,
}: UsersManagerProps) {
  const [usersList, setUsersList] = useState<any[]>(initialUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor",
    telegramChatId: "",
  });

  const roleColors: Record<string, string> = {
    admin: "bg-red-500/10 text-red-400 border-red-500/20",
    manager: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    editor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  function openDialog(user?: any) {
    setError(null);
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        role: user.role || "editor",
        telegramChatId: user.telegramChatId || "",
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "editor",
        telegramChatId: "",
      });
    }
    setIsDialogOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const url = editingUser
        ? `/api/users/${editingUser.id}`
        : `/api/users`;
      const method = editingUser ? "PUT" : "POST";

      const payload: any = { ...formData };
      if (editingUser && !payload.password) {
        delete payload.password;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save user");
      }

      const saved = await res.json();

      if (editingUser) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === saved.id ? { ...u, ...saved } : u))
        );
      } else {
        setUsersList((prev) => [saved, ...prev]);
      }

      setIsDialogOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to save user");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (id === currentUserId) {
      alert("You cannot delete your own account.");
      return;
    }

    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsersList((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (err) {
      console.error("Delete user error:", err);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            Users &amp; Permissions ({usersList.length})
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage team access roles (Admin, Manager, Editor) and Telegram instant lead notification alerts.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => openDialog()}
          className="bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase tracking-wider gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border border-white/5 bg-[#202023]/60 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#18181b] border-b border-white/5">
            <TableRow className="border-none">
              <TableHead className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Name & Email
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Access Role
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Telegram Chat ID
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider text-right">
                Created
              </TableHead>
              <TableHead className="w-20 text-right"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {usersList.map((user) => (
              <TableRow
                key={user.id}
                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                <TableCell>
                  <span className="font-semibold text-xs text-white block">
                    {user.name}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {user.email}
                  </span>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-[9px] uppercase font-mono tracking-wider ${
                      roleColors[user.role] || roleColors.editor
                    }`}
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {user.role}
                  </Badge>
                </TableCell>

                <TableCell className="text-xs text-neutral-400 font-mono">
                  {user.telegramChatId ? (
                    <span className="text-[#c89b3c] flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5" />
                      {user.telegramChatId}
                    </span>
                  ) : (
                    <span className="text-neutral-600">Unlinked</span>
                  )}
                </TableCell>

                <TableCell className="text-right text-xs text-neutral-500 font-mono">
                  {new Date(user.createdAt).toLocaleDateString("en-GB")}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openDialog(user)}
                      className="h-7 w-7 text-neutral-400 hover:text-white"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                    {user.id !== currentUserId && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(user.id)}
                        className="h-7 w-7 text-neutral-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#202023] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-white">
              {editingUser ? `Edit User: ${editingUser.name}` : "Create New User Account"}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Assign roles and permissions for system access.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-neutral-300">Full Name</Label>
              <Input
                placeholder="e.g. Captain Alexandros"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-neutral-300">Email Address</Label>
              <Input
                type="email"
                placeholder="user@danamirashipping.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-neutral-300">
                {editingUser ? "New Password (leave empty to keep current)" : "Password"}
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!editingUser}
                className="bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Access Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(val) =>
                    setFormData({ ...formData, role: val || "editor" })
                  }
                >
                  <SelectTrigger className="bg-[#18181b] border-white/10 text-xs text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#202023] border-white/10 text-white text-xs">
                    <SelectItem value="admin">🔴 Admin (Full Access)</SelectItem>
                    <SelectItem value="manager">🟡 Manager (Leads + Fleet)</SelectItem>
                    <SelectItem value="editor">🔵 Editor (Pages + Contacts)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-300">Telegram Chat ID</Label>
                <Input
                  placeholder="e.g. 123456789"
                  value={formData.telegramChatId}
                  onChange={(e) =>
                    setFormData({ ...formData, telegramChatId: e.target.value })
                  }
                  className="bg-[#18181b] border-white/10 text-xs text-white font-mono"
                />
              </div>
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
                disabled={isSaving}
                className="bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase tracking-wider"
              >
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Save User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
