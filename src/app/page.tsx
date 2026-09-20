"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DrawBall } from "@/components/draw-ball";
import { PrizePoolTierBar } from "@/components/charts/simple-charts";
import { mockDb } from "@/lib/mock-db";
import { Charity, Draw } from "@/types";
import { formatCurrency, daysUntil } from "@/lib/utils";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import {
  Trophy,
  Heart,
  Target,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Users,
  Calendar,
  Layers,
  ChevronRight,
  Medal,
  Award
} from "lucide-react";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [featuredCharities, setFeaturedCharities] = useState<Charity[]>([]);
  const [upcomingDraw, setUpcomingDraw] = useState<Draw | null>(null);
  const [totalRaisedYTD, setTotalRaisedYTD] = useState<number>(271950);

  useEffect(() => {
    setMounted(true);
    const charities = mockDb.getCharities();
    setFeaturedCharities(charities.filter((c) => c.is_featured));
    setUpcomingDraw(mockDb.getUpcomingDraw() || null);
    setTotalRaisedYTD(charities.reduce((acc, c) => acc + c.ytd_contribution, 0));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] transition-colors">
      <Navbar />

      <main className="flex-1">
        {/* ==========================================================
            1. HERO SECTION
           ========================================================== */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-neutral-gray/15 bg-gradient-to-b from-white via-neutral-light/40 to-[#F8FAFC]">
          {/* Subtle decorative glow */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary-light/40 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Core Value Proposition */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                
                {/* Live Ticker Badge */}
                <div suppressHydrationWarning className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-light border border-primary/30 text-primary text-xs font-mono font-semibold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
                  <span suppressHydrationWarning>March Draw Pool: {mounted && upcomingDraw ? formatCurrency(upcomingDraw.total_pool) : "$28,000"}</span>
                  <span className="text-primary/50">•</span>
                  <span className="text-neutral-dark font-sans font-medium">1,050 Active Players</span>
                </div>

                {/* Primary Tagline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-dark tracking-tight leading-[1.15]">
                  Golf Scores. <br />
                  <span className="text-primary">Monthly Wins.</span> <br />
                  <span className="text-charity">Real Impact.</span>
                </h1>

                {/* Subheadline */}
                <p className="text-base sm:text-lg text-neutral-gray max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  The modern fintech platform where your regular Stableford rounds (1–45 pts) automatically enter high-stakes monthly prize draws—with 10% to 50% guaranteed charitable tithe funding junior academy sets, wounded veterans, and youth access.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link href="/auth/signup" className="w-full sm:w-auto">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-tealGlow">
                      Create Account
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>

                  <Link href="/charities" className="w-full sm:w-auto">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                      Explore Causes
                    </Button>
                  </Link>
                </div>

                {/* Micro Trust Indicators */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-neutral-gray font-mono">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-status-success" />
                    USGA Stableford (1-45)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-status-success" />
                    Guaranteed Payout Tiers
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-status-success" />
                    100% Audited Giving
                  </span>
                </div>

              </div>

              {/* Right Column: Interactive Fintech Hero Card */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md bg-white rounded-2xl shadow-xl border border-neutral-gray/20 p-6 space-y-6">
                  
                  {/* Card Header: Live Draw Status */}
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-gray/10">
                    <div>
                      <span className="text-[11px] font-mono text-neutral-gray uppercase tracking-wider block">
                        Next Monthly Draw
                      </span>
                      <span className="text-base font-bold text-neutral-dark">
                        March 31, 2026
                      </span>
                    </div>
                    <Badge variant="gold" size="md" suppressHydrationWarning>
                      {mounted && upcomingDraw ? `${daysUntil(upcomingDraw.draw_date)} Days Left` : "10 Days Left"}
                    </Badge>
                  </div>

                  {/* Draw Pool Breakdown Pill */}
                  <div className="p-4 rounded-xl bg-neutral-light border border-neutral-gray/20 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-neutral-gray font-medium">Estimated Prize Pool</span>
                      <span suppressHydrationWarning className="text-2xl font-bold font-number text-neutral-dark">
                        <AnimatedCounter
                          end={upcomingDraw?.total_pool || 28000}
                          prefix="$"
                          duration={1800}
                        />
                      </span>
                    </div>
                    <PrizePoolTierBar
                      tier5={upcomingDraw?.pool_5_match || 11200}
                      tier4={upcomingDraw?.pool_4_match || 9800}
                      tier3={upcomingDraw?.pool_3_match || 7000}
                    />
                  </div>

                  {/* Visual 5-Ball Match Preview */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-dark">Sample Winning Numbers</span>
                      <span className="text-[11px] font-mono text-primary font-medium">5-Ball Draw</span>
                    </div>
                    <div className="flex items-center justify-between gap-1 sm:gap-2 pt-1">
                      {[38, 34, 41, 36, 19].map((num, i) => (
                        <DrawBall key={i} number={num} isMatched={i < 3} size="md" />
                      ))}
                    </div>
                    <p className="text-[11px] text-neutral-gray text-center pt-1 font-mono">
                      Gold indicates matched player scores (3 matches = Cash Win!)
                    </p>
                  </div>

                  {/* Live Giving Progress */}
                  <div className="p-3 bg-charity-light/50 border border-charity/30 rounded-standard flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-charity" />
                      <span className="font-medium text-neutral-dark">Junior Golf & Veterans</span>
                    </div>
                    <span suppressHydrationWarning className="font-bold text-charity font-mono">
                      <AnimatedCounter
                        end={totalRaisedYTD || 271950}
                        prefix="$"
                        suffix=" YTD"
                        duration={1800}
                      />
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==========================================================
            2. PLATFORM LIVE STATISTICS
           ========================================================== */}
        <section className="py-12 bg-white border-b border-neutral-gray/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              
              <div className="p-5 rounded-standard bg-neutral-light/60 border border-neutral-gray/15 hover:border-gold/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <span className="text-xs font-mono text-neutral-gray uppercase tracking-wider block group-hover:text-gold-dark transition-colors">
                  Prizes Distributed
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold font-number text-gold-dark mt-1 block tracking-tight">
                  <AnimatedCounter end={1840000} prefix="$" suffix="+" duration={2200} replayOnScroll />
                </span>
                <span className="text-[11px] text-neutral-gray mt-1 block">
                  100% verified & timely paid
                </span>
              </div>

              <div className="p-5 rounded-standard bg-neutral-light/60 border border-neutral-gray/15 hover:border-charity/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <span className="text-xs font-mono text-neutral-gray uppercase tracking-wider block group-hover:text-charity transition-colors">
                  Charity Impact Funds
                </span>
                <span suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold font-number text-charity mt-1 block tracking-tight">
                  <AnimatedCounter end={totalRaisedYTD || 271950} prefix="$" duration={2200} replayOnScroll />
                </span>
                <span className="text-[11px] text-neutral-gray mt-1 block">
                  6 vetted partner organizations
                </span>
              </div>

              <div className="p-5 rounded-standard bg-neutral-light/60 border border-neutral-gray/15 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <span className="text-xs font-mono text-neutral-gray uppercase tracking-wider block group-hover:text-primary transition-colors">
                  Active Golfers
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold font-number text-primary mt-1 block tracking-tight">
                  <AnimatedCounter end={10450} suffix="+" duration={2200} replayOnScroll />
                </span>
                <span className="text-[11px] text-neutral-gray mt-1 block">
                  USGA / WHS players logging
                </span>
              </div>

              <div className="p-5 rounded-standard bg-neutral-light/60 border border-neutral-gray/15 hover:border-neutral-dark/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <span className="text-xs font-mono text-neutral-gray uppercase tracking-wider block group-hover:text-neutral-dark transition-colors">
                  Lives Supported
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold font-number text-neutral-dark mt-1 block tracking-tight">
                  <AnimatedCounter end={6070} suffix="+" duration={2200} replayOnScroll />
                </span>
                <span className="text-[11px] text-neutral-gray mt-1 block">
                  Youth & veterans empowered
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* ==========================================================
            3. 4-STEP "HOW IT WORKS" PROCESS
           ========================================================== */}
        <section id="how-it-works" className="py-20 lg:py-28 bg-[#F8FAFC] border-b border-neutral-gray/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <Badge variant="teal" size="md">
                Transparent Mechanics
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-dark tracking-tight">
                How Digital Heroes Works
              </h2>
              <p className="text-base text-neutral-gray">
                A streamlined, 4-step financial loop combining weekend golf rounds with transparent monthly prize pools and dedicated charity allocations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Step 1 */}
              <Card interactive className="relative bg-white border-neutral-gray/20 p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary-light text-primary flex items-center justify-center font-mono font-bold text-lg">
                  01
                </div>
                <h3 className="text-lg font-bold text-neutral-dark">
                  Subscribe & Select Cause
                </h3>
                <p className="text-sm text-neutral-gray leading-relaxed">
                  Join with a flexible monthly ($29/mo) or yearly plan. Select your partner charity and choose how much to donate (10% to 50%).
                </p>
              </Card>

              {/* Step 2 */}
              <Card interactive className="relative bg-white border-neutral-gray/20 p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary-light text-primary flex items-center justify-center font-mono font-bold text-lg">
                  02
                </div>
                <h3 className="text-lg font-bold text-neutral-dark">
                  Log 5 Golf Scores
                </h3>
                <p className="text-sm text-neutral-gray leading-relaxed">
                  Enter your official Stableford rounds (1–45 points). Our rolling 5-score engine keeps your 5 freshest rounds active for the next draw.
                </p>
              </Card>

              {/* Step 3 */}
              <Card interactive className="relative bg-white border-neutral-gray/20 p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gold-light text-gold-dark flex items-center justify-center font-mono font-bold text-lg">
                  03
                </div>
                <h3 className="text-lg font-bold text-neutral-dark">
                  Monthly Draw Night
                </h3>
                <p className="text-sm text-neutral-gray leading-relaxed">
                  On draw day, 5 numbers are picked (Random or Algorithmic). Match 5, 4, or 3 numbers against your active scores for tiered cash payouts.
                </p>
              </Card>

              {/* Step 4 */}
              <Card interactive className="relative bg-white border-neutral-gray/20 p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-charity-light text-charity flex items-center justify-center font-mono font-bold text-lg">
                  04
                </div>
                <h3 className="text-lg font-bold text-neutral-dark">
                  Claim & Fund Impact
                </h3>
                <p className="text-sm text-neutral-gray leading-relaxed">
                  Winners upload a scorecard screenshot for prompt verification. Meanwhile, your subscription directly funds youth and veteran initiatives.
                </p>
              </Card>

            </div>

          </div>
        </section>

        {/* ==========================================================
            4. DRAW MECHANICS: 5/4/3-MATCH VISUAL EXPLAINER
           ========================================================== */}
        <section id="draw-mechanics" className="py-20 lg:py-28 bg-white border-b border-neutral-gray/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-5 space-y-5">
                <Badge variant="gold" size="md">
                  Prize Architecture
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-dark tracking-tight">
                  Mathematical 5/4/3-Match Logic
                </h2>
                <p className="text-sm sm:text-base text-neutral-gray leading-relaxed">
                  The prize pool is split across three distinct payout tiers. When multiple players match in the same tier, prizes are split equally. If no one hits the 5-match jackpot, the entire 40% rolls over to supercharge the following month!
                </p>

                <div className="p-4 rounded-standard bg-gold-light/60 border border-gold/30 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-neutral-dark">
                    <Trophy className="w-4 h-4 text-gold-dark" />
                    <span>Jackpot Rollover Rule</span>
                  </div>
                  <p className="text-xs text-neutral-gray leading-relaxed">
                    Unclaimed 5-match prize pools automatically accumulate. Current active rollover: <span className="font-mono font-bold text-neutral-dark">+$1,500</span>.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                
                {/* Tier 1 */}
                <div className="p-6 rounded-card border-2 border-gold/40 bg-gradient-to-r from-gold-light/30 to-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-gold text-neutral-dark font-bold font-mono text-xs flex items-center justify-center">
                        5
                      </span>
                      <h4 className="font-bold text-neutral-dark text-base">5-Number Match (Jackpot)</h4>
                    </div>
                    <p className="text-xs text-neutral-gray">
                      All 5 of your logged scores match the 5 drawn numbers.
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-xl font-bold font-number text-gold-dark block">
                      40% of Pool
                    </span>
                    <span className="text-[11px] font-mono text-neutral-gray">
                      + Rollover Accumulation
                    </span>
                  </div>
                </div>

                {/* Tier 2 */}
                <div className="p-6 rounded-card border border-primary/30 bg-gradient-to-r from-primary-light/30 to-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary text-white font-bold font-mono text-xs flex items-center justify-center">
                        4
                      </span>
                      <h4 className="font-bold text-neutral-dark text-base">4-Number Match (Runner-up)</h4>
                    </div>
                    <p className="text-xs text-neutral-gray">
                      Any 4 of your 5 logged scores match the drawn numbers.
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-xl font-bold font-number text-primary block">
                      35% of Pool
                    </span>
                    <span className="text-[11px] font-mono text-neutral-gray">
                      Split equally among winners
                    </span>
                  </div>
                </div>

                {/* Tier 3 */}
                <div className="p-6 rounded-card border border-charity/30 bg-gradient-to-r from-charity-light/30 to-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-charity text-white font-bold font-mono text-xs flex items-center justify-center">
                        3
                      </span>
                      <h4 className="font-bold text-neutral-dark text-base">3-Number Match (Community)</h4>
                    </div>
                    <p className="text-xs text-neutral-gray">
                      Any 3 of your 5 logged scores match the drawn numbers.
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-xl font-bold font-number text-charity block">
                      25% of Pool
                    </span>
                    <span className="text-[11px] font-mono text-neutral-gray">
                      Highest hit rate & frequent winners
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ==========================================================
            5. FEATURED CHARITY IMPACT SECTION
           ========================================================== */}
        <section className="py-20 lg:py-28 bg-[#F8FAFC] border-b border-neutral-gray/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
              <div className="space-y-2">
                <Badge variant="charity" size="md">
                  Vetted Giving
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-dark tracking-tight">
                  Featured Partner Causes
                </h2>
                <p className="text-sm sm:text-base text-neutral-gray max-w-xl">
                  Every subscription guarantees continuous financial support to non-profits using golf as a vehicle for physical, social, and psychological restoration.
                </p>
              </div>

              <Link href="/charities">
                <Button variant="outline" size="sm">
                  View All Causes
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCharities.map((charity) => {
                const percent = Math.min(100, Math.round((charity.ytd_contribution / charity.target_goal) * 100));

                return (
                  <Card key={charity.id} interactive className="overflow-hidden p-0 flex flex-col justify-between">
                    <div>
                      {/* Image Header */}
                      <div className="relative h-44 w-full overflow-hidden bg-neutral-gray/20">
                        <img
                          src={charity.image_url}
                          alt={charity.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge variant="charity" size="sm">
                            {charity.cause_category}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={charity.logo_url}
                            alt=""
                            className="w-10 h-10 rounded-full border border-neutral-gray/20 object-cover"
                          />
                          <div>
                            <h3 className="font-bold text-base text-neutral-dark leading-tight">
                              {charity.name}
                            </h3>
                            <span className="text-xs text-neutral-gray font-mono">
                              {charity.lives_supported.toLocaleString()} lives helped
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-neutral-gray line-clamp-2 leading-relaxed">
                          {charity.description}
                        </p>

                        {/* Progress */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-neutral-gray">Raised: {formatCurrency(charity.ytd_contribution)}</span>
                            <span className="font-bold text-charity">{percent}%</span>
                          </div>
                          <div className="h-2 w-full bg-neutral-light rounded-full overflow-hidden">
                            <div
                              style={{ width: `${percent}%` }}
                              className="h-full bg-charity transition-all duration-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2">
                      <Link href={`/charities/${charity.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Learn More & Support
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>

          </div>
        </section>

        {/* ==========================================================
            6. BOTTOM CALL TO ACTION BANNER
           ========================================================== */}
        <section className="py-20 bg-neutral-dark text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <Badge variant="teal" size="md">
              Join Digital Heroes
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Play Golf. Win Monthly. <br />
              <span className="text-primary-light">Change Lives Forever.</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
              Sign up today, choose your cause, and turn your regular weekend Stableford rounds into transparent community impact and life-changing prize pools.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button variant="gold" size="lg" className="w-full sm:w-auto text-neutral-dark font-bold">
                  Create Player Account
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/charities" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  Browse Charities
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
