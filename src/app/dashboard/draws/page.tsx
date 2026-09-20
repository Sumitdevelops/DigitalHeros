"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DrawBall } from "@/components/draw-ball";
import { PrizePoolTierBar } from "@/components/charts/simple-charts";
import { mockDb } from "@/lib/mock-db";
import { Draw, GolfScore } from "@/types";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";
import {
  Trophy,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Award
} from "lucide-react";

export default function DrawsParticipationPage() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [userScores, setUserScores] = useState<GolfScore[]>([]);

  useEffect(() => {
    setDraws(mockDb.getDraws());
    setUserScores(mockDb.getUserScores());
  }, []);

  const upcomingDraw = draws.find((d) => d.status === "scheduled") || draws[0];
  const pastDraws = draws.filter((d) => d.status === "completed" || d.status === "published");

  const isEligible = userScores.length === 5;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] transition-colors">
      <Navbar />

      <main className="flex-1 py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-gray/15 dark:border-white/10">
            <div>
              <span className="text-xs font-mono text-primary font-semibold uppercase tracking-wider block">
                Prize Events
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark dark:text-white tracking-tight">
                Monthly Draws & Results
              </h1>
              <p className="text-xs sm:text-sm text-neutral-gray dark:text-neutral-400 mt-1">
                Every month, 5 winning numbers are drawn. Match 5, 4, or 3 of your active scores to win cash prizes.
              </p>
            </div>

            <Badge variant="gold" size="md">
              <Trophy className="w-3.5 h-3.5 mr-1" />
              Monthly Cadence
            </Badge>
          </div>

          {/* UPCOMING DRAW FEATURED HERO CARD */}
          {upcomingDraw && (
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-white via-white to-gold-light/25 dark:from-neutral-slate-800 dark:via-neutral-slate-800 dark:to-gold/10 border-2 border-gold/40 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="gold" size="sm">Scheduled Draw</Badge>
                    <Badge variant="teal" size="sm" className="capitalize">
                      {upcomingDraw.draw_type} Draw
                    </Badge>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-dark dark:text-white">
                    Upcoming Draw: {formatDate(upcomingDraw.draw_date)}
                  </h2>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-neutral-gray dark:text-neutral-400 font-mono block">Countdown</span>
                  <span className="text-lg font-bold font-number text-gold-dark dark:text-gold">
                    {daysUntil(upcomingDraw.draw_date)} Days Remaining
                  </span>
                </div>
              </div>

              {/* Prize Pool Allocation */}
              <div className="p-5 bg-white dark:bg-neutral-slate-900 rounded-card border border-neutral-gray/20 dark:border-white/10 shadow-xs space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-neutral-gray dark:text-neutral-400 font-mono uppercase tracking-wider">
                    Total Estimated Prize Pool
                  </span>
                  <span className="text-3xl font-bold font-number text-neutral-dark dark:text-white">
                    {formatCurrency(upcomingDraw.total_pool)}
                  </span>
                </div>

                <PrizePoolTierBar
                  tier5={upcomingDraw.pool_5_match}
                  tier4={upcomingDraw.pool_4_match}
                  tier3={upcomingDraw.pool_3_match}
                />
              </div>

              {/* Player Participation Status Box */}
              <div className="p-4 rounded-standard bg-neutral-light/70 dark:bg-neutral-slate-900/60 border border-neutral-gray/20 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {isEligible ? (
                      <CheckCircle2 className="w-4 h-4 text-status-success" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-status-warning" />
                    )}
                    <span className="font-bold text-neutral-dark dark:text-white text-sm">
                      {isEligible
                        ? "You are fully entered with 5 active scores!"
                        : `Incomplete entry: ${userScores.length}/5 scores logged`}
                    </span>
                  </div>
                  <p className="text-neutral-gray dark:text-neutral-400">
                    {isEligible
                      ? "Your 5 most recent scores will automatically be matched on draw day."
                      : "Log your remaining rounds before draw day to qualify for cash prizes."}
                  </p>
                </div>

                {isEligible ? (
                  <div className="flex items-center gap-1 font-mono">
                    <span className="text-neutral-gray dark:text-neutral-400 mr-1">Active Ticket:</span>
                    {userScores.map((s) => (
                      <span key={s.id} className="px-1.5 py-0.5 rounded bg-primary-light dark:bg-primary/20 font-bold text-primary dark:text-primary-light text-[11px]">
                        {s.score}
                      </span>
                    ))}
                  </div>
                ) : (
                  <Link href="/dashboard/scores">
                    <Button variant="primary" size="sm">
                      Log Missing Scores
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          )}

          {/* PAST DRAWS DIRECTORY */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-dark">Past Draw Results</h2>

            {pastDraws.length === 0 ? (
              <Card className="p-8 text-center text-xs text-neutral-gray">
                No past draws have been published yet.
              </Card>
            ) : (
              <div className="space-y-4">
                {pastDraws.map((d) => {
                  const results = mockDb.getDrawResults(d.id);
                  const totalWinners = results.reduce((acc, r) => acc + r.winner_count, 0);

                  return (
                    <Card key={d.id} className="p-6 space-y-4 border border-neutral-gray/20">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-neutral-gray/10">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-neutral-dark text-base">
                            Draw: {formatDate(d.draw_date)}
                          </span>
                          <Badge variant="teal" size="sm" className="capitalize">
                            {d.draw_type}
                          </Badge>
                          <Badge variant="success" size="sm">
                            Completed
                          </Badge>
                        </div>
                        <span className="text-xs font-mono text-neutral-gray">
                          Total Pool: <strong className="text-neutral-dark">{formatCurrency(d.total_pool)}</strong>
                        </span>
                      </div>

                      {/* Drawn Numbers Balls */}
                      {d.drawn_numbers && (
                        <div className="space-y-2">
                          <span className="text-xs text-neutral-gray font-semibold block">
                            Drawn Winning Numbers (5 Balls):
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            {d.drawn_numbers.map((num, i) => (
                              <DrawBall key={i} number={num} isMatched={userScores.some((s) => s.score === num)} size="sm" />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tier Breakdown Badges */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                        <div className="p-2.5 bg-neutral-light dark:bg-neutral-slate-900/60 rounded-standard">
                          <span className="text-neutral-gray dark:text-neutral-400 block">5-Match Winners</span>
                          <span className="font-bold text-neutral-dark dark:text-white">
                            {results.find((r) => r.match_type === 5)?.winner_count || 0} winners
                          </span>
                          <span className="text-[10px] text-gold-dark dark:text-gold block">
                            {formatCurrency(results.find((r) => r.match_type === 5)?.prize_per_winner || 0)} each
                          </span>
                        </div>

                        <div className="p-2.5 bg-neutral-light dark:bg-neutral-slate-900/60 rounded-standard">
                          <span className="text-neutral-gray dark:text-neutral-400 block">4-Match Winners</span>
                          <span className="font-bold text-neutral-dark dark:text-white">
                            {results.find((r) => r.match_type === 4)?.winner_count || 0} winners
                          </span>
                          <span className="text-[10px] text-primary dark:text-primary-light block">
                            {formatCurrency(results.find((r) => r.match_type === 4)?.prize_per_winner || 0)} each
                          </span>
                        </div>

                        <div className="p-2.5 bg-neutral-light dark:bg-neutral-slate-900/60 rounded-standard">
                          <span className="text-neutral-gray dark:text-neutral-400 block">3-Match Winners</span>
                          <span className="font-bold text-neutral-dark dark:text-white">
                            {results.find((r) => r.match_type === 3)?.winner_count || 0} winners
                          </span>
                          <span className="text-[10px] text-charity dark:text-charity-light block">
                            {formatCurrency(results.find((r) => r.match_type === 3)?.prize_per_winner || 0)} each
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <Link href={`/draws/${d.id}`}>
                          <Button variant="outline" size="sm">
                            View Full Breakdown & My Status →
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
