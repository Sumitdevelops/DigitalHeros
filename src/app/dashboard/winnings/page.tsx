"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProofUploadModal } from "@/components/proof-upload-modal";
import { mockDb } from "@/lib/mock-db";
import { Winner } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Trophy,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  FileCheck,
  ShieldCheck,
  Check
} from "lucide-react";

export default function WinningsPage() {
  const [winnings, setWinnings] = useState<Winner[]>([]);
  const [activeUploadWinner, setActiveUploadWinner] = useState<Winner | null>(null);

  const loadWinnings = () => {
    const user = mockDb.getCurrentUser();
    if (!user) {
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
      return;
    }
    const wins = mockDb.getWinners(user.id);
    setWinnings(wins);
  };

  useEffect(() => {
    loadWinnings();
  }, []);

  const totalWon = winnings.reduce((acc, w) => acc + w.amount_won, 0);
  const pendingAmount = winnings.filter((w) => w.status === "pending").reduce((acc, w) => acc + w.amount_won, 0);
  const paidAmount = winnings.filter((w) => w.status === "paid" || w.status === "verified").reduce((acc, w) => acc + w.amount_won, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] transition-colors duration-200">
      <Navbar />

      <main className="flex-1 py-8 lg:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-gray/15 dark:border-white/10">
            <div>
              <span className="text-xs font-mono text-gold-dark dark:text-gold font-semibold uppercase tracking-wider block">
                Prize Disbursements
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark dark:text-white tracking-tight">
                Your Winnings & Payouts
              </h1>
              <p className="text-xs sm:text-sm text-neutral-gray dark:text-neutral-400 mt-1">
                Track prize match winnings, upload verified scorecards, and verify payout statuses.
              </p>
            </div>

            <Badge variant="gold" size="md">
              <Trophy className="w-3.5 h-3.5 mr-1" />
              Verified Ledger
            </Badge>
          </div>

          {/* Top Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="p-6 border border-neutral-gray/20 dark:bg-neutral-slate-800 dark:border-white/10">
              <span className="text-xs font-mono text-neutral-gray dark:text-neutral-400 uppercase tracking-wider block">
                Total Won (All Time)
              </span>
              <span className="text-3xl font-bold font-number text-gold-dark dark:text-gold mt-2 block">
                {formatCurrency(totalWon)}
              </span>
              <span className="text-[11px] text-neutral-gray dark:text-neutral-400 mt-1 block">
                Across {winnings.length} prize draws
              </span>
            </Card>

            <Card className="p-6 border border-status-warning/30 bg-amber-50/20 dark:bg-amber-950/20 dark:border-amber-500/30">
              <span className="text-xs font-mono text-status-warning uppercase tracking-wider block font-bold">
                Pending Verification
              </span>
              <span className="text-3xl font-bold font-number text-status-warning mt-2 block">
                {formatCurrency(pendingAmount)}
              </span>
              <span className="text-[11px] text-neutral-gray dark:text-neutral-400 mt-1 block">
                Requires scorecard proof submission
              </span>
            </Card>

            <Card className="p-6 border border-status-success/30 bg-emerald-50/20 dark:bg-emerald-950/20 dark:border-emerald-500/30">
              <span className="text-xs font-mono text-status-success uppercase tracking-wider block font-bold">
                Paid / Verified
              </span>
              <span className="text-3xl font-bold font-number text-status-success mt-2 block">
                {formatCurrency(paidAmount)}
              </span>
              <span className="text-[11px] text-neutral-gray dark:text-neutral-400 mt-1 block">
                Directly disbursed to your account
              </span>
            </Card>
          </div>

          {/* Winnings Table / Cards */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-dark dark:text-white">Prize History</h2>

            {winnings.length === 0 ? (
              <Card className="p-12 text-center space-y-3 dark:bg-neutral-slate-800 dark:border-white/10">
                <Trophy className="w-12 h-12 text-neutral-gray/30 dark:text-neutral-600 mx-auto" />
                <h3 className="text-base font-bold text-neutral-dark dark:text-white">No winnings yet</h3>
                <p className="text-xs text-neutral-gray dark:text-neutral-400 max-w-sm mx-auto">
                  Ensure you have 5 active scores logged to be eligible for the upcoming monthly cash draw!
                </p>
                <Link href="/dashboard/scores">
                  <Button variant="primary" size="sm" className="mt-2">
                    Enter Scores
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {winnings.map((w) => {
                  return (
                    <Card
                      key={w.id}
                      className="p-6 border border-neutral-gray/20 dark:bg-neutral-slate-800 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-neutral-dark dark:text-white">
                            {w.match_type}-Number Match Prize
                          </span>
                          {w.status === "pending" && (
                            <Badge variant="warning" size="sm">Pending Verification</Badge>
                          )}
                          {w.status === "verified" && (
                            <Badge variant="success" size="sm">Approved • Processing</Badge>
                          )}
                          {w.status === "paid" && (
                            <Badge variant="success" size="sm">Paid Out</Badge>
                          )}
                          {w.status === "rejected" && (
                            <Badge variant="error" size="sm">Rejected</Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-gray dark:text-neutral-400">
                          <span>Amount Won: <strong className="text-neutral-dark dark:text-white text-sm font-number">{formatCurrency(w.amount_won)}</strong></span>
                          <span>•</span>
                          <span>Registered on {formatDate(w.created_at)}</span>
                          {w.payout_date && (
                            <>
                              <span>•</span>
                              <span className="text-status-success font-semibold">
                                Paid on {formatDate(w.payout_date)}
                              </span>
                            </>
                          )}
                        </div>

                        {w.verification_notes && (
                          <p className="text-xs text-neutral-gray dark:text-neutral-400 italic pt-1">
                            Note: {w.verification_notes}
                          </p>
                        )}
                      </div>

                      {/* Action */}
                      <div className="self-end sm:self-center">
                        {w.status === "pending" ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setActiveUploadWinner(w)}
                            className="shadow-sm"
                          >
                            <UploadCloud className="w-4 h-4 mr-1.5" />
                            {w.proof_url ? "Update Proof" : "Upload Proof"}
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            {w.proof_url && (
                              <a
                                href={w.proof_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-primary dark:text-teal-400 font-mono hover:underline mr-2"
                              >
                                <Eye className="w-3.5 h-3.5" /> View Scorecard
                              </a>
                            )}
                            <Badge variant="success" size="md">
                              <Check className="w-3.5 h-3.5 mr-1" />
                              {w.status === "paid" ? "Paid" : "Verified"}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Proof Upload Modal */}
      {activeUploadWinner && (
        <ProofUploadModal
          isOpen={Boolean(activeUploadWinner)}
          onClose={() => setActiveUploadWinner(null)}
          winnerId={activeUploadWinner.id}
          amountWon={activeUploadWinner.amount_won}
          onProofSubmitted={loadWinnings}
        />
      )}

      <Footer />
    </div>
  );
}
