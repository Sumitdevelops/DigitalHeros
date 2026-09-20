"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DrawBall } from "@/components/draw-ball";
import { mockDb } from "@/lib/mock-db";
import { Draw, DrawResult, GolfScore, Winner } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Trophy,
  Calendar,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Share2
} from "lucide-react";

export default function DrawResultsDetailPage() {
  const params = useParams();
  const drawId = params.id as string;

  const [draw, setDraw] = useState<Draw | null>(null);
  const [results, setResults] = useState<DrawResult[]>([]);
  const [userScores, setUserScores] = useState<GolfScore[]>([]);
  const [userWinning, setUserWinning] = useState<Winner | null>(null);

  useEffect(() => {
    const d = mockDb.getDrawById(drawId);
    if (d) {
      setDraw(d);
      setResults(mockDb.getDrawResults(d.id));
    }
    const scores = mockDb.getUserScores();
    setUserScores(scores);

    const wins = mockDb.getWinners();
    const currentUserId = mockDb.getCurrentUser()?.id;
    const myWin = currentUserId ? wins.find((w) => w.draw_id === drawId && w.user_id === currentUserId) : undefined;
    if (myWin) {
      setUserWinning(myWin);
      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#0D7C7F", "#D4A856", "#FF6B35", "#10B981"],
      });
    }
  }, [drawId]);

  if (!draw) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] transition-colors duration-200">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Trophy className="w-12 h-12 text-neutral-gray/30 dark:text-neutral-600 mb-3" />
          <h2 className="text-xl font-bold text-neutral-dark dark:text-white">Draw Record Not Found</h2>
          <Link href="/dashboard/draws" className="mt-4">
            <Button variant="primary">Return to Draws</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const drawnNumbers = draw.drawn_numbers || [38, 34, 27, 41, 19];
  const drawnSet = new Set(drawnNumbers);
  const userMatchedScores = userScores.filter((s) => drawnSet.has(s.score));

  const res5 = results.find((r) => r.match_type === 5);
  const res4 = results.find((r) => r.match_type === 4);
  const res3 = results.find((r) => r.match_type === 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] transition-colors duration-200">
      <Navbar />

      <main className="flex-1 py-8 lg:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Back Navigation */}
          <Link
            href="/dashboard/draws"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-gray dark:text-neutral-400 hover:text-primary dark:hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Draws Directory
          </Link>

          {/* Winner Celebration Banner */}
          {userWinning && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-gold-light via-white to-gold-light dark:from-gold/20 dark:via-neutral-slate-800 dark:to-gold/20 border-2 border-gold dark:border-gold/50 shadow-goldGlow flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-gold text-neutral-dark flex items-center justify-center font-bold text-xl shadow-md">
                  🎉
                </div>
                <div>
                  <Badge variant="gold" size="sm" className="mb-1">Winner Confirmed</Badge>
                  <h3 className="text-lg font-bold text-neutral-dark dark:text-white">
                    Congratulations! You matched {userWinning.match_type} numbers!
                  </h3>
                  <p className="text-xs text-neutral-gray dark:text-neutral-300">
                    You won <strong className="text-gold-dark dark:text-gold font-number font-bold text-sm">{formatCurrency(userWinning.amount_won)}</strong> in this draw event.
                  </p>
                </div>
              </div>

              <Link href="/dashboard/winnings">
                <Button variant="gold" size="md" className="shrink-0 shadow-md">
                  Upload Scorecard Proof →
                </Button>
              </Link>
            </div>
          )}

          {/* Header Metadata */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-gray/15 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="teal" size="sm" className="capitalize">
                  {draw.draw_type} Algorithm
                </Badge>
                <Badge variant="success" size="sm">
                  Official Result
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark dark:text-white tracking-tight">
                Draw Results: {formatDate(draw.draw_date)}
              </h1>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-neutral-gray dark:text-neutral-400 font-mono block">Total Prize Distributed</span>
              <span className="text-2xl font-extrabold font-number text-neutral-dark dark:text-white">
                {formatCurrency(draw.total_pool)}
              </span>
            </div>
          </div>

          {/* Drawn 5 Numbers Visual Display */}
          <Card className="p-6 sm:p-8 bg-white dark:bg-neutral-slate-800 border-2 border-primary/20 dark:border-teal-500/30 shadow-md text-center space-y-4">
            <span className="text-xs font-mono text-primary dark:text-teal-400 font-bold uppercase tracking-wider block">
              Official 5 Winning Drawn Numbers
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-2">
              {drawnNumbers.map((num, idx) => (
                <DrawBall
                  key={idx}
                  number={num}
                  isMatched={userScores.some((s) => s.score === num)}
                  size="lg"
                  delayMs={idx * 150}
                />
              ))}
            </div>
            <p className="text-xs text-neutral-gray dark:text-neutral-400 font-mono">
              Numbers highlighted in gold match your active Stableford scores below.
            </p>
          </Card>

          {/* User's Match Outcome Card */}
          <Card className="p-6 space-y-4 bg-neutral-light/50 dark:bg-neutral-slate-800 border border-neutral-gray/20 dark:border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-neutral-dark dark:text-white">Your Round Ticket Match Evaluation</h3>
              <Badge variant={userMatchedScores.length >= 3 ? "gold" : "neutral"} size="sm">
                {userMatchedScores.length} of 5 Matched
              </Badge>
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-4">
              {userScores.map((s) => {
                const isMatched = drawnSet.has(s.score);

                return (
                  <div
                    key={s.id}
                    className={`p-3 rounded-card text-center border transition-all ${
                      isMatched
                        ? "bg-gold-light dark:bg-gold/20 border-gold dark:border-gold/50 shadow-xs text-neutral-dark dark:text-white font-bold"
                        : "bg-white dark:bg-neutral-slate-900 border-neutral-gray/20 dark:border-white/10 text-neutral-gray dark:text-neutral-400"
                    }`}
                  >
                    <span className="text-lg sm:text-xl font-number block">{s.score}</span>
                    <span className="text-[10px] block truncate text-neutral-gray dark:text-neutral-400 font-sans mt-0.5">
                      {s.course_name ? s.course_name.split(" ")[0] : "Round"}
                    </span>
                    {isMatched ? (
                      <span className="text-[9px] font-mono font-bold text-gold-dark dark:text-gold uppercase block mt-1">
                        MATCH!
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-neutral-gray/70 dark:text-neutral-500 uppercase block mt-1">
                        No match
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Detailed Tier-By-Tier Breakdown */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-dark dark:text-white">Payouts by Prize Tier</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 5-Match Tier */}
              <Card className="p-6 border-2 border-gold/40 dark:border-gold/30 bg-gradient-to-b from-gold-light/20 to-white dark:from-gold/10 dark:to-neutral-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="gold" size="sm">Jackpot Tier</Badge>
                  <span className="font-mono text-xs text-neutral-gray dark:text-neutral-400">40% Pool</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-dark dark:text-white">5-Number Match</h3>
                  <p className="text-xs text-neutral-gray dark:text-neutral-400 mt-0.5">Exact match of all 5 scores</p>
                </div>
                <div className="p-3 bg-white dark:bg-neutral-slate-900 rounded-standard border border-neutral-gray/15 dark:border-white/10 space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-gray dark:text-neutral-400">Tier Pool:</span>
                    <span className="font-bold text-neutral-dark dark:text-white">{formatCurrency(draw.pool_5_match)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-gray dark:text-neutral-400">Winners:</span>
                    <span className="font-bold text-neutral-dark dark:text-white">{res5?.winner_count || 0}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-gray/10 dark:border-white/10 pt-1 text-gold-dark dark:text-gold font-bold">
                    <span>Prize Per Winner:</span>
                    <span>{formatCurrency(res5?.prize_per_winner || 0)}</span>
                  </div>
                </div>
              </Card>

              {/* 4-Match Tier */}
              <Card className="p-6 border border-primary/30 dark:border-teal-500/30 dark:bg-neutral-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="teal" size="sm">Runner-Up</Badge>
                  <span className="font-mono text-xs text-neutral-gray dark:text-neutral-400">35% Pool</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-dark dark:text-white">4-Number Match</h3>
                  <p className="text-xs text-neutral-gray dark:text-neutral-400 mt-0.5">Matched 4 of 5 scores</p>
                </div>
                <div className="p-3 bg-neutral-light dark:bg-neutral-slate-900 rounded-standard border border-neutral-gray/15 dark:border-white/10 space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-gray dark:text-neutral-400">Tier Pool:</span>
                    <span className="font-bold text-neutral-dark dark:text-white">{formatCurrency(draw.pool_4_match)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-gray dark:text-neutral-400">Winners:</span>
                    <span className="font-bold text-neutral-dark dark:text-white">{res4?.winner_count || 0}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-gray/10 dark:border-white/10 pt-1 text-primary dark:text-teal-400 font-bold">
                    <span>Prize Per Winner:</span>
                    <span>{formatCurrency(res4?.prize_per_winner || 0)}</span>
                  </div>
                </div>
              </Card>

              {/* 3-Match Tier */}
              <Card className="p-6 border border-charity/30 dark:border-charity/30 dark:bg-neutral-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="charity" size="sm">Community Bonus</Badge>
                  <span className="font-mono text-xs text-neutral-gray dark:text-neutral-400">25% Pool</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-dark dark:text-white">3-Number Match</h3>
                  <p className="text-xs text-neutral-gray dark:text-neutral-400 mt-0.5">Matched 3 of 5 scores</p>
                </div>
                <div className="p-3 bg-neutral-light dark:bg-neutral-slate-900 rounded-standard border border-neutral-gray/15 dark:border-white/10 space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-gray dark:text-neutral-400">Tier Pool:</span>
                    <span className="font-bold text-neutral-dark dark:text-white">{formatCurrency(draw.pool_3_match)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-gray dark:text-neutral-400">Winners:</span>
                    <span className="font-bold text-neutral-dark dark:text-white">{res3?.winner_count || 0}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-gray/10 dark:border-white/10 pt-1 text-charity font-bold">
                    <span>Prize Per Winner:</span>
                    <span>{formatCurrency(res3?.prize_per_winner || 0)}</span>
                  </div>
                </div>
              </Card>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
