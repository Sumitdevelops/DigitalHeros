"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SimpleLineChart, PrizePoolTierBar, CharityShareDonut } from "@/components/charts/simple-charts";
import { mockDb } from "@/lib/mock-db";
import { User, Subscription, Draw, Winner, Charity } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users,
  Trophy,
  Heart,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Clock
} from "lucide-react";

export default function AdminOverviewPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [draws, setDraws] = useState<Draw[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [charities, setCharities] = useState<Charity[]>([]);

  useEffect(() => {
    setUsers(mockDb.getUsers());
    setSubs(mockDb.getAllSubscriptions());
    setDraws(mockDb.getDraws());
    setWinners(mockDb.getWinners());
    setCharities(mockDb.getCharities());
  }, []);

  const activeSubscribersCount = subs.filter((s) => s.status === "active" || s.status === "renewing").length || 1050;
  const totalPrizePoolYTD = draws.reduce((acc, d) => acc + d.total_pool, 0) || 49000;
  const totalCharityYTD = charities.reduce((acc, c) => acc + c.ytd_contribution, 0) || 271950;
  const pendingVerifications = winners.filter((w) => w.status === "pending");

  // Chart data
  const subscriberGrowthData = [
    { label: "Jan", value: 680 },
    { label: "Feb", value: 890 },
    { label: "Mar", value: activeSubscribersCount },
  ];

  const charityDonutShares = charities.slice(0, 4).map((c, i) => ({
    name: c.name,
    amount: c.ytd_contribution,
    color: ["#0D7C7F", "#FF6B35", "#D4A856", "#10B981"][i % 4],
  }));

  return (
    <div className="py-8 lg:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Welcome & Pending Alerts */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-gray/15">
        <div>
          <span className="text-xs font-mono text-charity uppercase tracking-wider font-bold block">
            Executive Summary
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark tracking-tight">
            Platform Overview & Operations
          </h1>
        </div>

        {pendingVerifications.length > 0 && (
          <Link href="/admin/winners">
            <div className="p-2 px-3 bg-amber-50 border border-status-warning/40 rounded-standard flex items-center gap-2 text-xs text-status-warning font-semibold hover:bg-amber-100 transition-colors">
              <AlertTriangle className="w-4 h-4" />
              <span>{pendingVerifications.length} Winner Proofs Pending Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        )}
      </div>

      {/* 4 Major Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <Card className="p-6 space-y-2 border border-neutral-gray/20">
          <div className="flex items-center justify-between text-xs text-neutral-gray font-mono">
            <span>Active Subscribers</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold font-number text-neutral-dark">
            {activeSubscribersCount.toLocaleString()}
          </div>
          <span className="text-[11px] text-status-success font-mono flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% this month
          </span>
        </Card>

        {/* Metric 2 */}
        <Card className="p-6 space-y-2 border border-neutral-gray/20">
          <div className="flex items-center justify-between text-xs text-neutral-gray font-mono">
            <span>Total Prize Pool (YTD)</span>
            <Trophy className="w-4 h-4 text-gold-dark" />
          </div>
          <div className="text-3xl font-bold font-number text-gold-dark">
            {formatCurrency(totalPrizePoolYTD)}
          </div>
          <span className="text-[11px] text-neutral-gray font-mono block">
            Across {draws.length} scheduled & past draws
          </span>
        </Card>

        {/* Metric 3 */}
        <Card className="p-6 space-y-2 border border-neutral-gray/20">
          <div className="flex items-center justify-between text-xs text-neutral-gray font-mono">
            <span>Charity Impact (YTD)</span>
            <Heart className="w-4 h-4 text-charity" />
          </div>
          <div className="text-3xl font-bold font-number text-charity">
            {formatCurrency(totalCharityYTD)}
          </div>
          <span className="text-[11px] text-neutral-gray font-mono block">
            Directly tithed to 6 verified causes
          </span>
        </Card>

        {/* Metric 4 */}
        <Card className="p-6 space-y-2 border border-neutral-gray/20">
          <div className="flex items-center justify-between text-xs text-neutral-gray font-mono">
            <span>Draws Run / Scheduled</span>
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold font-number text-neutral-dark">
            {draws.length} Events
          </div>
          <span className="text-[11px] text-neutral-gray font-mono block">
            Next scheduled: March 31, 2026
          </span>
        </Card>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Subscribers Growth Trend (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-gray/10 pb-3">
              <div>
                <h3 className="font-bold text-base text-neutral-dark">Subscriber Growth Trajectory</h3>
                <p className="text-xs text-neutral-gray font-mono">Active paying golfers (90-day trajectory)</p>
              </div>
              <Badge variant="teal" size="sm">Quarterly Trend</Badge>
            </div>

            <SimpleLineChart
              data={subscriberGrowthData}
              color="#0D7C7F"
              height={200}
              valueSuffix=" Golfers"
            />
          </Card>

          {/* Prize Pool Distribution */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-gray/10 pb-3">
              <div>
                <h3 className="font-bold text-base text-neutral-dark">Prize Pool Tier Split (Upcoming Draw)</h3>
                <p className="text-xs text-neutral-gray font-mono">40% Tier 5 (Jackpot) • 35% Tier 4 • 25% Tier 3</p>
              </div>
              <span className="font-bold font-number text-neutral-dark text-sm">$28,000 Total</span>
            </div>

            <PrizePoolTierBar
              tier5={11200}
              tier4={9800}
              tier3={7000}
            />
          </Card>
        </div>

        {/* Charity Allocation Donut & Recent Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Charity Share */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-gray/10 pb-3">
              <div>
                <h3 className="font-bold text-base text-neutral-dark">Giving Allocation by Cause</h3>
                <p className="text-xs text-neutral-gray font-mono">YTD cumulative distribution</p>
              </div>
            </div>

            <CharityShareDonut shares={charityDonutShares} />
          </Card>

          {/* Quick Operations Stream */}
          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-gray/10 pb-2">
              <h3 className="font-bold text-sm text-neutral-dark">Quick Administrative Actions</h3>
            </div>

            <div className="space-y-2">
              <Link href="/admin/draws" className="flex items-center justify-between p-2.5 rounded-standard bg-neutral-light/70 hover:bg-neutral-light text-xs font-semibold text-neutral-dark transition-colors">
                <span className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-gold-dark" />
                  Simulate & Publish Monthly Draw
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-gray" />
              </Link>

              <Link href="/admin/winners" className="flex items-center justify-between p-2.5 rounded-standard bg-neutral-light/70 hover:bg-neutral-light text-xs font-semibold text-neutral-dark transition-colors">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  Review Scorecard Verifications
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-gray" />
              </Link>

              <Link href="/admin/charities" className="flex items-center justify-between p-2.5 rounded-standard bg-neutral-light/70 hover:bg-neutral-light text-xs font-semibold text-neutral-dark transition-colors">
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-charity" />
                  Add or Edit Partner Charities
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-gray" />
              </Link>

              <Link href="/admin/reports" className="flex items-center justify-between p-2.5 rounded-standard bg-neutral-light/70 hover:bg-neutral-light text-xs font-semibold text-neutral-dark transition-colors">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Generate P&L & Revenue Reports
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-gray" />
              </Link>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}
