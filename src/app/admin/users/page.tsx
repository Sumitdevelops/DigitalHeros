"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { mockDb } from "@/lib/mock-db";
import { User, Subscription, Charity, GolfScore } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  Users,
  Search,
  Download,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function AdminUserManagementPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [selectedUserScores, setSelectedUserScores] = useState<{ user: User; scores: GolfScore[] } | null>(null);
  const [editingSubUser, setEditingSubUser] = useState<{ user: User; sub: Subscription } | null>(null);
  const [editPlan, setEditPlan] = useState<"monthly" | "yearly">("monthly");
  const [editStatus, setEditStatus] = useState<any>("active");
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const loadData = () => {
    setUsers(mockDb.getUsers());
    setSubscriptions(mockDb.getAllSubscriptions());
    setCharities(mockDb.getCharities());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const sub = subscriptions.find((s) => s.user_id === u.id);
      const subStatus = sub?.status || "active";

      const matchesStatus = statusFilter === "all" || subStatus === statusFilter;
      const matchesSearch =
        u.full_name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [users, subscriptions, search, statusFilter]);

  const handleExportCSV = () => {
    const headers = ["User ID", "Full Name", "Email", "Role", "Subscription Status", "Created At"];
    const rows = filteredUsers.map((u) => {
      const sub = subscriptions.find((s) => s.user_id === u.id);
      return [u.id, u.full_name, u.email, u.role, sub?.status || "none", u.created_at];
    });
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `digital-heroes-users-${Date.now()}.csv`;
    a.click();
    toast({ type: "success", title: "Users Exported to CSV" });
  };

  const handleOpenScores = (user: User) => {
    const scores = mockDb.getUserScores(user.id);
    setSelectedUserScores({ user, scores });
  };

  const handleOpenEditSub = (user: User) => {
    const sub = subscriptions.find((s) => s.user_id === user.id);
    if (!sub) {
      toast({ type: "error", title: "No Subscription Record", description: "This user does not have an active subscription." });
      return;
    }
    setEditingSubUser({ user, sub });
    setEditPlan(sub.plan_type);
    setEditStatus(sub.status);
  };

  const handleSaveSubEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubUser) return;
    mockDb.updateSubscription(editingSubUser.sub.id, {
      plan_type: editPlan,
      status: editStatus,
    });
    toast({ type: "success", title: "Subscription Updated" });
    setEditingSubUser(null);
    loadData();
  };

  const handleConfirmDelete = () => {
    if (!deletingUserId) return;
    mockDb.deleteUser(deletingUserId);
    toast({ type: "info", title: "User Deleted", description: "User record successfully removed." });
    setDeletingUserId(null);
    loadData();
  };

  return (
    <div className="py-8 lg:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-gray/15">
        <div>
          <span className="text-xs font-mono text-charity uppercase tracking-wider font-bold block">
            User Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark tracking-tight">
            Registered Users & Memberships
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-1.5" />
            Export Users (CSV)
          </Button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-gray absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs rounded-standard border border-neutral-gray/30 bg-white focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-gray font-mono">Status:</span>
          {["all", "active", "renewing", "lapsed"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                statusFilter === st
                  ? "bg-primary text-white font-semibold"
                  : "bg-white border border-neutral-gray/20 text-neutral-dark hover:bg-neutral-light"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <Card className="p-0 overflow-hidden border border-neutral-gray/20 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-light border-b border-neutral-gray/15 text-neutral-gray font-mono uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-semibold">User</th>
                <th className="py-3.5 px-4 font-semibold">Role</th>
                <th className="py-3.5 px-4 font-semibold">Membership</th>
                <th className="py-3.5 px-4 font-semibold">Supported Cause</th>
                <th className="py-3.5 px-4 font-semibold">Active Scores</th>
                <th className="py-3.5 px-4 font-semibold">Joined Date</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-gray/10 bg-white">
              {filteredUsers.map((u) => {
                const sub = subscriptions.find((s) => s.user_id === u.id);
                const charity = charities.find((c) => c.id === sub?.charity_id);
                const userScores = mockDb.getUserScores(u.id);

                return (
                  <tr key={u.id} className="hover:bg-primary-light/10 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-dark text-sm">{u.full_name}</div>
                      <div className="text-[11px] text-neutral-gray font-mono">{u.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={u.role === "admin" ? "charity" : "teal"} size="sm">
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="capitalize font-semibold">{sub?.plan_type || "monthly"}</span>
                        <Badge
                          variant={sub?.status === "active" ? "success" : sub?.status === "renewing" ? "pending" : "warning"}
                          size="sm"
                        >
                          {sub?.status || "active"}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-neutral-dark truncate block max-w-[150px]">
                        {charity?.name || "Junior Golf Foundation"}
                      </span>
                      <span className="text-[10px] text-charity font-mono">
                        {sub?.charity_contribution_percentage || 20}% tithe
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={`font-bold ${userScores.length === 5 ? "text-status-success" : "text-neutral-dark"}`}>
                        {userScores.length}/5 rounds
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-gray">
                      {formatDate(u.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenScores(u)}
                          title="View Score History"
                          className="p-1.5 text-neutral-gray hover:text-primary hover:bg-neutral-light rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditSub(u)}
                          title="Edit Subscription"
                          className="p-1.5 text-neutral-gray hover:text-primary hover:bg-neutral-light rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingUserId(u.id)}
                          title="Delete User"
                          className="p-1.5 text-neutral-gray hover:text-status-error hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View Scores Modal */}
      <Modal
        isOpen={Boolean(selectedUserScores)}
        onClose={() => setSelectedUserScores(null)}
        title={`${selectedUserScores?.user.full_name}'s Active Scores`}
        description="Review rolling 5 Stableford rounds entered for the monthly draw."
      >
        <div className="space-y-3 pt-2">
          {selectedUserScores?.scores.length === 0 ? (
            <p className="text-xs text-neutral-gray py-4 text-center">No scores logged yet for this user.</p>
          ) : (
            selectedUserScores?.scores.map((s) => (
              <div key={s.id} className="p-3 bg-neutral-light rounded-standard flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-bold text-neutral-dark font-sans block">{s.course_name}</span>
                  <span className="text-neutral-gray text-[11px]">{formatDate(s.score_date)}</span>
                </div>
                <span className="text-base font-bold text-primary font-number">{s.score} pts</span>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-end pt-4 border-t border-neutral-gray/10 mt-4">
          <Button variant="outline" size="sm" onClick={() => setSelectedUserScores(null)}>
            Close
          </Button>
        </div>
      </Modal>

      {/* Edit Subscription Modal */}
      <Modal
        isOpen={Boolean(editingSubUser)}
        onClose={() => setEditingSubUser(null)}
        title={`Edit Subscription for ${editingSubUser?.user.full_name}`}
        description="Update membership tier or override status."
      >
        <form onSubmit={handleSaveSubEdit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-neutral-dark mb-1 font-mono uppercase tracking-wider">
              Membership Plan
            </label>
            <select
              value={editPlan}
              onChange={(e) => setEditPlan(e.target.value as any)}
              className="w-full h-11 px-3 text-xs rounded-standard border border-neutral-gray/30 bg-white"
            >
              <option value="monthly">Monthly ($29/mo)</option>
              <option value="yearly">Yearly ($290/yr)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-dark mb-1 font-mono uppercase tracking-wider">
              Subscription Status
            </label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as any)}
              className="w-full h-11 px-3 text-xs rounded-standard border border-neutral-gray/30 bg-white"
            >
              <option value="active">Active</option>
              <option value="renewing">Renewing</option>
              <option value="lapsed">Lapsed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-gray/10">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditingSubUser(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingUserId)}
        onClose={() => setDeletingUserId(null)}
        title="Delete User Record"
        description="Are you sure you want to permanently delete this user? Their scores and subscriptions will be purged."
      >
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" size="sm" onClick={() => setDeletingUserId(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleConfirmDelete}>
            Delete User
          </Button>
        </div>
      </Modal>

    </div>
  );
}
