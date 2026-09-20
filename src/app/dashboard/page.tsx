"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScoreForm } from "@/components/score-form";
import { DrawBall } from "@/components/draw-ball";
import { PrizePoolTierBar } from "@/components/charts/simple-charts";
import { mockDb } from "@/lib/mock-db";
import { User, Subscription, GolfScore, Draw, Charity, Winner } from "@/types";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";
import {
  Trophy,
  Heart,
  Target,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  PlusCircle,
  Award
} from "lucide-react";

import { useToast } from "@/components/ui/toast";
import confetti from "canvas-confetti";

export default function DashboardHubPage() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [charity, setCharity] = useState<Charity | null>(null);
  const [scores, setScores] = useState<GolfScore[]>([]);
  const [upcomingDraw, setUpcomingDraw] = useState<Draw | null>(null);
  const [winnings, setWinnings] = useState<Winner[]>([]);

  const loadData = () => {
    const user = mockDb.getCurrentUser();
    if (!user) {
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
      return;
    }
    setCurrentUser(user);

    const sub = mockDb.getUserSubscription(user.id);
    setSubscription(sub || null);

    if (sub) {
      const c = mockDb.getCharityById(sub.charity_id);
      setCharity(c || null);
    } else {
      setCharity(mockDb.getCharities()[0]);
    }

    setScores(mockDb.getUserScores(user.id));
    setUpcomingDraw(mockDb.getUpcomingDraw() || null);
    setWinnings(mockDb.getWinners(user.id));
  };

  useEffect(() => {
    loadData();

    // Check for Stripe Checkout success return
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("checkout_success") === "true") {
        const plan = (params.get("plan") as any) || "monthly";
        const charityId = params.get("charity") || "c1111111-1111-1111-1111-111111111111";

        mockDb.createOrUpdateSubscription({
          planType: plan,
          charityId: charityId,
          charityPercentage: 20,
        });

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#0D7C7F", "#D4A856", "#FF6B35"],
        });

        toast({
          type: "success",
          title: "Payment Confirmed via Stripe!",
          description: `Your ${plan} membership is officially activated. Good luck in this month's charity draw!`,
        });

        loadData();
      }
    }
  }, []);

  const totalWon = winnings.reduce((acc, w) => acc + w.amount_won, 0);
  const pendingWon = winnings.filter((w) => w.status === "pending").reduce((acc, w) => acc + w.amount_won, 0);
  const paidWon = winnings.filter((w) => w.status === "paid" || w.status === "verified").reduce((acc, w) => acc + w.amount_won, 0);
  const userContributions = mockDb.getContributions(currentUser?.id).reduce((acc, c) => acc + c.amount, 0);

  // Best score
  const bestScore = scores.length > 0 ? Math.max(...scores.map((s) => s.score)) : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] transition-colors">
      <Navbar />

      <main className="flex-1 py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Top Banner Greeting */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-gray/15 dark:border-white/10">
            <div>
              <span className="text-xs font-mono text-primary font-semibold uppercase tracking-wider block">
                Subscriber Hub
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark dark:text-white tracking-tight">
                Welcome back, {currentUser?.full_name || "Golfer"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/dashboard/scores">
                <Button variant="primary" size="sm">
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  Enter Round Score
                </Button>
              </Link>
              <Link href="/dashboard/draws">
                <Button variant="outline" size="sm">
                  View Draw Status
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats Grid (4 items) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Stat 1: Scores Logged */}
            <Card className="p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-neutral-gray font-mono">
                <span>Active Scores</span>
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold font-number text-primary">
                  {scores.length}/5
                </div>
                <span className="text-[11px] text-neutral-gray mt-1 block">
                  {scores.length === 5 ? "Fully eligible for next draw" : `${5 - scores.length} more needed for draw`}
                </span>
              </div>
            </Card>

            {/* Stat 2: Draws Participated */}
            <Card className="p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-neutral-gray font-mono">
                <span>Draws Entered</span>
                <Trophy className="w-4 h-4 text-gold-dark" />
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold font-number text-neutral-dark">
                  3
                </div>
                <span className="text-[11px] text-neutral-gray mt-1 block">
                  Next draw: March 31
                </span>
              </div>
            </Card>

            {/* Stat 3: Total Winnings */}
            <Card className="p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-neutral-gray font-mono">
                <span>Total Winnings</span>
                <Award className="w-4 h-4 text-gold" />
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold font-number text-gold-dark">
                  {formatCurrency(totalWon)}
                </div>
                <span className="text-[11px] text-neutral-gray mt-1 block">
                  {winnings.length} winning {winnings.length === 1 ? "round" : "rounds"} matched
                </span>
              </div>
            </Card>

            {/* Stat 4: Charity Contributed */}
            <Card className="p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-neutral-gray font-mono">
                <span>Charity Given</span>
                <Heart className="w-4 h-4 text-charity" />
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold font-number text-charity">
                  {formatCurrency(userContributions || 11.60)}
                </div>
                <span className="text-[11px] text-neutral-gray mt-1 block truncate">
                  To {charity?.name || "Junior Golf"}
                </span>
              </div>
            </Card>

          </div>

          {/* 3-Column Main Hub Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* COLUMN 1 (Primary - 4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Subscription Card */}
              <Card className="p-6 space-y-4 border-2 border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-gray uppercase tracking-wider">
                    Membership Status
                  </span>
                  <Badge variant="success" size="sm">
                    {subscription?.status || "Active"}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-neutral-dark capitalize">
                    {subscription?.plan_type || "Monthly"} Plan ($29/mo)
                  </h3>
                  <p className="text-xs text-neutral-gray font-mono">
                    Renews on {formatDate(subscription?.renewal_date || "2026-04-15")}
                  </p>
                </div>

                <div className="p-3 bg-neutral-light dark:bg-neutral-slate-900/60 rounded-standard text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-gray dark:text-neutral-400">Charity Allocation:</span>
                    <span className="font-bold text-charity font-mono">
                      {subscription?.charity_contribution_percentage || 20}% of fee
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-gray dark:text-neutral-400">Draw Entry:</span>
                    <span className="font-bold text-status-success font-mono">Automatic</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-xs">
                  <Link href="/dashboard/settings" className="text-primary font-semibold hover:underline">
                    Manage Subscription →
                  </Link>
                </div>
              </Card>

              {/* Quick Score Entry Widget */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-neutral-dark flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-primary" />
                    Quick Log Score
                  </h3>
                  <Badge variant="teal" size="sm">1-45 Pts</Badge>
                </div>

                <ScoreForm onScoreAdded={loadData} compact={true} />
              </Card>

            </div>

            {/* COLUMN 2 (Engagement - 5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Upcoming Draw Card */}
              <Card className="p-6 space-y-5 bg-gradient-to-br from-white via-white to-gold-light/20 dark:from-neutral-slate-800 dark:via-neutral-slate-800 dark:to-gold/10 border-2 border-gold/30">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-neutral-gray dark:text-neutral-400 uppercase tracking-wider block">
                      Next Monthly Draw
                    </span>
                    <h3 className="text-lg font-bold text-neutral-dark dark:text-white">
                      March 31, 2026
                    </h3>
                  </div>
                  <Badge variant="gold" size="md">
                    {upcomingDraw ? `${daysUntil(upcomingDraw.draw_date)} Days` : "10 Days"}
                  </Badge>
                </div>

                {/* Pool summary */}
                <div className="p-4 bg-white dark:bg-neutral-slate-900 rounded-standard border border-neutral-gray/20 dark:border-white/10 shadow-xs space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-neutral-gray dark:text-neutral-400">Total Prize Pool</span>
                    <span className="text-2xl font-bold font-number text-neutral-dark dark:text-white">
                      {upcomingDraw ? formatCurrency(upcomingDraw.total_pool) : "$28,000"}
                    </span>
                  </div>
                  <PrizePoolTierBar
                    tier5={upcomingDraw?.pool_5_match || 11200}
                    tier4={upcomingDraw?.pool_4_match || 9800}
                    tier3={upcomingDraw?.pool_3_match || 7000}
                  />
                </div>

                {/* Player Eligibility */}
                <div className="flex items-center justify-between text-xs p-3 bg-white dark:bg-neutral-slate-900 rounded-standard border border-neutral-gray/15 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-ping"></span>
                    <span className="font-semibold text-neutral-dark dark:text-white">
                      Your Eligibility: {scores.length === 5 ? "5/5 Scores Ready" : `${scores.length}/5 Scores`}
                    </span>
                  </div>
                  <Link href="/dashboard/draws" className="text-primary font-medium hover:underline font-mono">
                    View Details →
                  </Link>
                </div>
              </Card>

              {/* Charity Progress Card */}
              {charity && (
                <Card className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-neutral-dark flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-charity" />
                      Your Cause: {charity.name}
                    </h3>
                    <Link href="/dashboard/charity" className="text-xs text-primary hover:underline">
                      Change
                    </Link>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={charity.logo_url}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-neutral-gray/20 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <p className="text-xs text-neutral-gray line-clamp-2">
                        {charity.description}
                      </p>
                      <span className="text-[11px] font-mono text-charity font-semibold block pt-1">
                        You contribute {subscription?.charity_contribution_percentage || 20}% of each subscription fee
                      </span>
                    </div>
                  </div>
                </Card>
              )}

              {/* Recent Scores Table */}
              <Card className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-neutral-dark">Recent Rounds (Last 3)</h3>
                  <Link href="/dashboard/scores" className="text-xs text-primary hover:underline">
                    View All (5 Max)
                  </Link>
                </div>

                {scores.length === 0 ? (
                  <div className="text-center py-6 text-xs text-neutral-gray">
                    No scores logged yet. Enter your first Stableford round above!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {scores.slice(0, 3).map((s) => (
                      <div
                        key={s.id}
                        className={`p-3 rounded-standard flex items-center justify-between text-xs border ${
                          s.score === bestScore
                            ? "bg-gold-light/40 dark:bg-gold/15 border-gold/40"
                            : "bg-white dark:bg-neutral-slate-900 border-neutral-gray/15 dark:border-white/10"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-dark dark:text-white">{s.course_name || "Course"}</span>
                            {s.score === bestScore && (
                              <Badge variant="gold" size="sm">Best</Badge>
                            )}
                          </div>
                          <span className="text-neutral-gray dark:text-neutral-400 font-mono text-[11px]">{formatDate(s.score_date)}</span>
                        </div>
                        <span className="text-base font-extrabold font-number text-primary">
                          {s.score} pts
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

            </div>

            {/* COLUMN 3 (Sidebar - 3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Winnings Summary Sidebar */}
              <Card className="p-6 space-y-4">
                <h3 className="font-bold text-base text-neutral-dark border-b border-neutral-gray/10 pb-3">
                  Winnings Ledger
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-gray">Total Won:</span>
                    <span className="font-bold text-gold-dark text-sm">{formatCurrency(totalWon)}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-gray">Pending Proof:</span>
                    <span className="font-semibold text-status-warning">{formatCurrency(pendingWon)}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-gray">Paid & Verified:</span>
                    <span className="font-semibold text-status-success">{formatCurrency(paidWon)}</span>
                  </div>
                </div>

                <Link href="/dashboard/winnings" className="block pt-2">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View Winnings & Upload Proof
                  </Button>
                </Link>
              </Card>

              {/* Quick Navigation Menu */}
              <Card className="p-4 space-y-1">
                <span className="text-[10px] font-mono text-neutral-gray uppercase tracking-wider block px-2 pb-1">
                  Hub Navigation
                </span>
                <Link
                  href="/dashboard/scores"
                  className="flex items-center justify-between p-2 rounded-standard text-xs text-neutral-dark dark:text-neutral-200 hover:bg-neutral-light dark:hover:bg-white/5 font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Scores Management
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-gray dark:text-neutral-400" />
                </Link>
                <Link
                  href="/dashboard/draws"
                  className="flex items-center justify-between p-2 rounded-standard text-xs text-neutral-dark dark:text-neutral-200 hover:bg-neutral-light dark:hover:bg-white/5 font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-gold-dark dark:text-gold" />
                    Draws & Results
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-gray dark:text-neutral-400" />
                </Link>
                <Link
                  href="/dashboard/charity"
                  className="flex items-center justify-between p-2 rounded-standard text-xs text-neutral-dark dark:text-neutral-200 hover:bg-neutral-light dark:hover:bg-white/5 font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-charity" />
                    Charity & Giving
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-gray dark:text-neutral-400" />
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center justify-between p-2 rounded-standard text-xs text-neutral-dark dark:text-neutral-200 hover:bg-neutral-light dark:hover:bg-white/5 font-medium"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-neutral-gray dark:text-neutral-400" />
                    Account Settings
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-gray dark:text-neutral-400" />
                </Link>
              </Card>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
