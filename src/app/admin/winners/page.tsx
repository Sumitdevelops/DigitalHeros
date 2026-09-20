"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { mockDb } from "@/lib/mock-db";
import { Winner } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Award,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  DollarSign,
  AlertCircle,
  Clock,
  ExternalLink
} from "lucide-react";

export default function AdminWinnersPage() {
  const { toast } = useToast();
  const [winners, setWinners] = useState<Winner[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [viewProofUrl, setViewProofUrl] = useState<string | null>(null);
  const [rejectWinnerId, setRejectWinnerId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [markPaidWinnerId, setMarkPaidWinnerId] = useState<string | null>(null);
  const [payoutDate, setPayoutDate] = useState(new Date().toISOString().split("T")[0]);

  const loadWinners = () => {
    setWinners(mockDb.getWinners());
  };

  useEffect(() => {
    loadWinners();
  }, []);

  const pendingList = winners.filter((w) => w.status === "pending");
  const filteredWinners = winners.filter((w) => {
    if (statusFilter === "all") return true;
    return w.status === statusFilter;
  });

  const handleApprove = (winnerId: string) => {
    mockDb.approveWinner(winnerId, "Verified by Admin review of uploaded club scorecard.");
    toast({
      type: "success",
      title: "Scorecard Approved",
      description: "Winner status updated to 'Verified'. Payout scheduled.",
    });
    loadWinners();
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectWinnerId) return;
    mockDb.rejectWinner(rejectWinnerId, rejectReason || "Ineligible or invalid scorecard screenshot.");
    toast({
      type: "info",
      title: "Submission Rejected",
      description: "Winner notified with explanation notes.",
    });
    setRejectWinnerId(null);
    setRejectReason("");
    loadWinners();
  };

  const handleConfirmMarkPaid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!markPaidWinnerId) return;
    mockDb.markWinnerPaid(markPaidWinnerId, payoutDate);
    toast({
      type: "success",
      title: "Payout Recorded",
      description: "Winner disbursement officially logged as 'Paid'.",
    });
    setMarkPaidWinnerId(null);
    loadWinners();
  };

  const handleExportCSV = (status: "pending" | "completed") => {
    const list = status === "pending"
      ? winners.filter((w) => w.status === "pending")
      : winners.filter((w) => w.status === "paid" || w.status === "verified");

    const headers = ["Winner ID", "User Name", "Email", "Match Tier", "Amount Won", "Status", "Payout Date"];
    const rows = list.map((w) => [
      w.id,
      w.user_name || "Anonymous",
      w.user_email || "N/A",
      `${w.match_type}-Match`,
      w.amount_won,
      w.status,
      w.payout_date || "N/A"
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `digital-heroes-${status}-payouts.csv`;
    a.click();
    toast({ type: "success", title: `Exported ${status} payouts CSV` });
  };

  return (
    <div className="py-8 lg:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-gray/15">
        <div>
          <span className="text-xs font-mono text-charity uppercase tracking-wider font-bold block">
            Prize Compliance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark tracking-tight">
            Winner Verifications & Payout Tracking
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExportCSV("pending")}>
            <Download className="w-4 h-4 mr-1.5" />
            Export Pending
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExportCSV("completed")}>
            <Download className="w-4 h-4 mr-1.5" />
            Export Paid
          </Button>
        </div>
      </div>

      {/* PENDING VERIFICATION QUEUE (TOP PRIORITY) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-dark flex items-center gap-2">
            <Clock className="w-5 h-5 text-status-warning" />
            Pending Verification Queue ({pendingList.length})
          </h2>
          <span className="text-xs font-mono text-neutral-gray">24-Hour SLA</span>
        </div>

        {pendingList.length === 0 ? (
          <Card className="p-8 text-center bg-emerald-50/20 border border-status-success/30 text-xs text-neutral-dark space-y-1">
            <CheckCircle2 className="w-8 h-8 text-status-success mx-auto mb-1" />
            <span className="font-bold block text-sm">All Winner Proofs Verified!</span>
            <span className="text-neutral-gray">No outstanding scorecard uploads awaiting administrator review.</span>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingList.map((w) => (
              <Card
                key={w.id}
                className="p-5 border-2 border-status-warning/40 bg-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {/* Proof Thumbnail */}
                  {w.proof_url ? (
                    <div
                      onClick={() => setViewProofUrl(w.proof_url!)}
                      className="w-16 h-16 rounded-standard overflow-hidden border border-neutral-gray/30 bg-neutral-light shrink-0 cursor-pointer group relative"
                    >
                      <img src={w.proof_url} alt="Proof" className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center bg-neutral-dark/30 opacity-0 group-hover:opacity-100 transition-opacity text-white">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-standard bg-neutral-light border border-neutral-gray/25 flex flex-col items-center justify-center text-neutral-gray text-[10px] text-center p-1 font-mono shrink-0">
                      <span>No Proof</span>
                      <span>Uploaded</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-neutral-dark">{w.user_name || "Alex Morgan"}</span>
                      <Badge variant="gold" size="sm">{w.match_type}-Number Match</Badge>
                    </div>
                    <div className="text-xs text-neutral-gray font-mono">
                      <span>Registered on {formatDate(w.created_at)}</span>
                      <span className="mx-1.5">•</span>
                      <span>Email: {w.user_email || "player@digitalheroes.golf"}</span>
                    </div>
                    <span className="text-lg font-bold font-number text-gold-dark block">
                      {formatCurrency(w.amount_won)}
                    </span>
                  </div>
                </div>

                {/* Approve / Reject Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRejectWinnerId(w.id);
                      setRejectReason("");
                    }}
                    className="text-status-error hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove(w.id)}
                    className="shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Approve Scorecard
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* COMPLETE WINNERS & PAYOUTS LEDGER */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-dark">Payout Tracking Ledger</h2>
          <div className="flex gap-1.5">
            {["all", "verified", "paid", "pending"].map((st) => (
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

        <Card className="p-0 overflow-hidden border border-neutral-gray/20 shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-light border-b border-neutral-gray/15 text-neutral-gray font-mono uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Winner</th>
                <th className="py-3.5 px-4 font-semibold">Match Tier</th>
                <th className="py-3.5 px-4 font-semibold">Amount Won</th>
                <th className="py-3.5 px-4 font-semibold">Scorecard Proof</th>
                <th className="py-3.5 px-4 font-semibold">Payout Status</th>
                <th className="py-3.5 px-4 font-semibold">Disbursed Date</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-gray/10 bg-white">
              {filteredWinners.map((w) => (
                <tr key={w.id} className="hover:bg-neutral-light/50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-neutral-dark text-sm block">{w.user_name || "Winner"}</span>
                    <span className="text-[11px] text-neutral-gray font-mono">{w.user_email || "player@digitalheroes.golf"}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-neutral-dark">
                    {w.match_type}-Number Match
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-gold-dark text-sm">
                    {formatCurrency(w.amount_won)}
                  </td>
                  <td className="py-3 px-4">
                    {w.proof_url ? (
                      <button
                        onClick={() => setViewProofUrl(w.proof_url!)}
                        className="text-primary hover:underline font-mono inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Proof
                      </button>
                    ) : (
                      <span className="text-neutral-gray italic">None</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={w.status === "paid" ? "success" : w.status === "verified" ? "teal" : "warning"}
                      size="sm"
                    >
                      {w.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-gray">
                    {w.payout_date ? formatDate(w.payout_date) : "—"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {w.status === "verified" && (
                      <Button
                        variant="gold"
                        size="sm"
                        onClick={() => setMarkPaidWinnerId(w.id)}
                        className="text-neutral-dark font-bold text-xs"
                      >
                        Mark as Paid
                      </Button>
                    )}
                    {w.status === "paid" && (
                      <Badge variant="success" size="sm">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Settled
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Proof Viewer Modal */}
      <Modal
        isOpen={Boolean(viewProofUrl)}
        onClose={() => setViewProofUrl(null)}
        title="Official Scorecard Proof Preview"
        maxWidth="max-w-2xl"
      >
        <div className="p-2 max-h-[500px] overflow-auto flex items-center justify-center bg-neutral-light rounded-standard">
          {viewProofUrl && (
            <img src={viewProofUrl} alt="Scorecard Preview" className="max-w-full max-h-full object-contain rounded" />
          )}
        </div>
        <div className="flex justify-end pt-3">
          <Button variant="outline" size="sm" onClick={() => setViewProofUrl(null)}>
            Close Preview
          </Button>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={Boolean(rejectWinnerId)}
        onClose={() => setRejectWinnerId(null)}
        title="Reject Scorecard Submission"
        description="Provide a clear explanation note for the golfer explaining why their scorecard was not approved."
      >
        <form onSubmit={handleConfirmReject} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-neutral-dark mb-1 font-mono uppercase tracking-wider">
              Rejection Reason *
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Scorecard image is blurry or played date does not match round record."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 text-xs rounded-standard border border-neutral-gray/30 focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-gray/10">
            <Button type="button" variant="outline" size="sm" onClick={() => setRejectWinnerId(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" size="sm">
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>

      {/* Mark Paid Modal */}
      <Modal
        isOpen={Boolean(markPaidWinnerId)}
        onClose={() => setMarkPaidWinnerId(null)}
        title="Record Payment Settlement"
        description="Confirm disbursement has been processed through banking or payment gateway."
      >
        <form onSubmit={handleConfirmMarkPaid} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-neutral-dark mb-1 font-mono uppercase tracking-wider">
              Disbursement Date
            </label>
            <input
              type="date"
              required
              value={payoutDate}
              onChange={(e) => setPayoutDate(e.target.value)}
              className="w-full h-11 px-3 text-sm rounded-standard border border-neutral-gray/30 bg-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-gray/10">
            <Button type="button" variant="outline" size="sm" onClick={() => setMarkPaidWinnerId(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm Paid
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
