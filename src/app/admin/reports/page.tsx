"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SimpleLineChart } from "@/components/charts/simple-charts";
import { useToast } from "@/components/ui/toast";
import { mockDb } from "@/lib/mock-db";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart3,
  Download,
  Printer,
  TrendingUp,
  DollarSign,
  Users,
  Heart,
  Trophy
} from "lucide-react";

export default function AdminReportsPage() {
  const { toast } = useToast();
  const charities = mockDb.getCharities();
  const draws = mockDb.getDraws();
  const winners = mockDb.getWinners();

  // Historical revenue data
  const revenueTrend = [
    { label: "Oct", value: 18400 },
    { label: "Nov", value: 21500 },
    { label: "Dec", value: 24800 },
    { label: "Jan", value: 27900 },
    { label: "Feb", value: 29400 },
    { label: "Mar", value: 31200 },
  ];

  const drawParticipationTrend = [
    { label: "Draw 1", value: 650 },
    { label: "Draw 2", value: 800 },
    { label: "Draw 3", value: 1050 },
  ];

  const totalRevenueYTD = 153200;
  const totalPayoutsYTD = 49000;
  const totalCharityYTD = charities.reduce((acc, c) => acc + c.ytd_contribution, 0);
  const netPlatformMargin = totalRevenueYTD - totalPayoutsYTD - (totalRevenueYTD * 0.15); // ~15% charity average

  const handleExportAll = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Gross Revenue YTD", totalRevenueYTD],
      ["Total Prize Pools YTD", totalPayoutsYTD],
      ["Total Charity Contributions YTD", totalCharityYTD],
      ["Estimated Net Margin", netPlatformMargin],
      ["Active Paying Subscribers", 1050],
      ["Subscriber Churn Rate", "2.1%"],
      ["Average Subscription Duration", "8.4 months"],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `digital-heroes-executive-report-${Date.now()}.csv`;
    a.click();
    toast({ type: "success", title: "Executive Report Exported to CSV" });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-8 lg:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-gray/15">
        <div>
          <span className="text-xs font-mono text-charity uppercase tracking-wider font-bold block">
            Financial & Performance Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark tracking-tight">
            Reports & Platform Analytics
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-1.5" />
            Print Report
          </Button>
          <Button variant="primary" size="sm" onClick={handleExportAll}>
            <Download className="w-4 h-4 mr-1.5" />
            Export Full Analytics (CSV)
          </Button>
        </div>
      </div>

      {/* Revenue & Margin Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 space-y-1">
          <span className="text-xs font-mono text-neutral-gray uppercase tracking-wider">Gross Subscription Revenue</span>
          <span className="text-2xl sm:text-3xl font-bold font-number text-neutral-dark block mt-1">
            {formatCurrency(totalRevenueYTD)}
          </span>
          <span className="text-[11px] font-mono text-status-success">+14.2% MoM growth</span>
        </Card>

        <Card className="p-6 space-y-1">
          <span className="text-xs font-mono text-neutral-gray uppercase tracking-wider">Total Prize Disbursements</span>
          <span className="text-2xl sm:text-3xl font-bold font-number text-gold-dark block mt-1">
            {formatCurrency(totalPayoutsYTD)}
          </span>
          <span className="text-[11px] font-mono text-neutral-gray">32.0% gross revenue</span>
        </Card>

        <Card className="p-6 space-y-1">
          <span className="text-xs font-mono text-neutral-gray uppercase tracking-wider">Total Philanthropic Tithe</span>
          <span className="text-2xl sm:text-3xl font-bold font-number text-charity block mt-1">
            {formatCurrency(totalCharityYTD)}
          </span>
          <span className="text-[11px] font-mono text-neutral-gray">Direct to 6 non-profits</span>
        </Card>

        <Card className="p-6 space-y-1 bg-gradient-to-br from-primary-light/20 to-white border border-primary/30">
          <span className="text-xs font-mono text-primary uppercase tracking-wider font-bold">Estimated Platform Net</span>
          <span className="text-2xl sm:text-3xl font-bold font-number text-primary block mt-1">
            {formatCurrency(netPlatformMargin)}
          </span>
          <span className="text-[11px] font-mono text-status-success font-semibold">Healthy financial sustainability</span>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Revenue Trend Chart */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-gray/10 pb-3">
            <div>
              <h3 className="font-bold text-base text-neutral-dark">Monthly Revenue Trend (6 Months)</h3>
              <p className="text-xs text-neutral-gray font-mono">Gross subscriptions accrued</p>
            </div>
            <Badge variant="teal" size="sm">Audited</Badge>
          </div>

          <SimpleLineChart
            data={revenueTrend}
            color="#0D7C7F"
            height={220}
            valuePrefix="$"
          />
        </Card>

        {/* Draw Participation Trend */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-gray/10 pb-3">
            <div>
              <h3 className="font-bold text-base text-neutral-dark">Golfer Draw Participation Velocity</h3>
              <p className="text-xs text-neutral-gray font-mono">Total eligible 5-score rounds entered per draw</p>
            </div>
            <Badge variant="gold" size="sm">Engaged Golfers</Badge>
          </div>

          <SimpleLineChart
            data={drawParticipationTrend}
            color="#D4A856"
            height={220}
            valueSuffix=" Players"
          />
        </Card>

      </div>

      {/* Detailed Philanthropic Ledger Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-dark">Cause Distribution Audit Ledger</h2>

        <Card className="p-0 overflow-hidden border border-neutral-gray/20 shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-light border-b border-neutral-gray/15 text-neutral-gray font-mono uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Non-Profit Organization</th>
                <th className="py-3.5 px-4 font-semibold">Cause Category</th>
                <th className="py-3.5 px-4 font-semibold">Total Disbursed (YTD)</th>
                <th className="py-3.5 px-4 font-semibold">Milestone Target</th>
                <th className="py-3.5 px-4 font-semibold">Fulfillment %</th>
                <th className="py-3.5 px-4 font-semibold">Lives Empowered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-gray/10 bg-white font-mono">
              {charities.map((c) => {
                const percent = Math.min(100, Math.round((c.ytd_contribution / c.target_goal) * 100));

                return (
                  <tr key={c.id} className="hover:bg-neutral-light/50 transition-colors">
                    <td className="py-3 px-4 font-sans font-bold text-neutral-dark">
                      {c.name}
                    </td>
                    <td className="py-3 px-4 capitalize font-sans text-neutral-gray">
                      {c.cause_category}
                    </td>
                    <td className="py-3 px-4 font-bold text-charity text-sm">
                      {formatCurrency(c.ytd_contribution)}
                    </td>
                    <td className="py-3 px-4 text-neutral-gray">
                      {formatCurrency(c.target_goal)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-dark">{percent}%</span>
                        <div className="w-16 h-1.5 bg-neutral-light rounded-full overflow-hidden">
                          <div style={{ width: `${percent}%` }} className="h-full bg-charity" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-primary">
                      {c.lives_supported.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>

    </div>
  );
}
