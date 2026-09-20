"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { SimpleLineChart } from "@/components/charts/simple-charts";
import { useToast } from "@/components/ui/toast";
import { mockDb } from "@/lib/mock-db";
import { Charity, Subscription } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Heart,
  Calendar,
  Users,
  TrendingUp,
  Sparkles,
  Check,
  ArrowRight,
  ExternalLink,
  Sliders
} from "lucide-react";

export default function CharityManagementPage() {
  const { toast } = useToast();
  const [charity, setCharity] = useState<Charity | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [charitiesList, setCharitiesList] = useState<Charity[]>([]);
  const [contributionPercent, setContributionPercent] = useState<number>(20);
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [selectedNewCharityId, setSelectedNewCharityId] = useState<string>("");

  const loadCharityData = () => {
    const sub = mockDb.getUserSubscription();
    setSubscription(sub || null);
    const all = mockDb.getCharities();
    setCharitiesList(all);

    if (sub) {
      setContributionPercent(sub.charity_contribution_percentage);
      const found = all.find((c) => c.id === sub.charity_id);
      setCharity(found || all[0]);
    } else {
      setCharity(all[0]);
    }
  };

  useEffect(() => {
    loadCharityData();
  }, []);

  const handleUpdatePercentage = () => {
    if (!subscription) return;
    mockDb.updateSubscription(subscription.id, {
      charity_contribution_percentage: contributionPercent,
    });
    toast({
      type: "success",
      title: "Charity Tithe Updated",
      description: `Your monthly contribution is now set to ${contributionPercent}% of your subscription fee.`,
    });
  };

  const handleConfirmCharityChange = () => {
    if (!subscription || !selectedNewCharityId) return;
    mockDb.updateSubscription(subscription.id, {
      charity_id: selectedNewCharityId,
    });
    const newC = mockDb.getCharityById(selectedNewCharityId);
    toast({
      type: "success",
      title: "Beneficiary Cause Updated",
      description: `Your subscription will now fund ${newC?.name}.`,
    });
    setChangeModalOpen(false);
    loadCharityData();
  };

  const userContributions = mockDb.getContributions(mockDb.getCurrentUser()?.id);
  const totalUserContributed = userContributions.reduce((acc, c) => acc + c.amount, 0) || 11.60;

  const monthlyHistory = [
    { label: "Dec", value: 5.80 },
    { label: "Jan", value: 5.80 },
    { label: "Feb", value: 5.80 },
    { label: "Mar", value: 5.80 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] transition-colors duration-200">
      <Navbar />

      <main className="flex-1 py-8 lg:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-gray/15 dark:border-white/10">
            <div>
              <span className="text-xs font-mono text-charity font-semibold uppercase tracking-wider block">
                Giving & Stewardship
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark dark:text-white tracking-tight">
                Charity Management & Impact
              </h1>
              <p className="text-xs sm:text-sm text-neutral-gray dark:text-neutral-400 mt-1">
                Direct between 10% and 50% of your membership fee to certified golf rehabilitation and junior foundations.
              </p>
            </div>

            <Button variant="outline" size="sm" onClick={() => setChangeModalOpen(true)}>
              Change Supported Cause
            </Button>
          </div>

          {/* Current Charity Showcase Card */}
          {charity && (
            <Card className="p-6 sm:p-8 border-2 border-charity/25 dark:border-charity/40 bg-white dark:bg-neutral-slate-800 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={charity.logo_url}
                    alt=""
                    className="w-16 h-16 rounded-xl border border-neutral-gray/20 dark:border-white/10 object-cover shadow-sm"
                  />
                  <div>
                    <Badge variant="charity" size="sm" className="mb-1">
                      {charity.cause_category}
                    </Badge>
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-dark dark:text-white">
                      {charity.name}
                    </h2>
                    <a
                      href={charity.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary dark:text-teal-400 hover:underline font-mono inline-flex items-center gap-1 mt-0.5"
                    >
                      {charity.website} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <Button variant="outline" size="sm" onClick={() => setChangeModalOpen(true)}>
                  Switch Charity
                </Button>
              </div>

              <p className="text-sm text-neutral-gray dark:text-neutral-300 leading-relaxed">
                {charity.description}
              </p>

              {/* Impact KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-standard bg-charity-light/40 dark:bg-charity/10 border border-charity/20 dark:border-charity/30">
                  <span className="text-xs text-neutral-gray dark:text-neutral-400 font-mono block">Your Direct Contributions</span>
                  <span className="text-2xl font-bold font-number text-charity mt-1 block">
                    {formatCurrency(totalUserContributed)}
                  </span>
                  <span className="text-[11px] text-neutral-gray dark:text-neutral-400 block mt-0.5">
                    Calculated from your subscription
                  </span>
                </div>

                <div className="p-4 rounded-standard bg-neutral-light/70 dark:bg-neutral-slate-900/60 border border-neutral-gray/20 dark:border-white/10">
                  <span className="text-xs text-neutral-gray dark:text-neutral-400 font-mono block">Cause Total Raised (YTD)</span>
                  <span className="text-2xl font-bold font-number text-neutral-dark dark:text-white mt-1 block">
                    {formatCurrency(charity.ytd_contribution)}
                  </span>
                  <span className="text-[11px] text-neutral-gray dark:text-neutral-400 block mt-0.5">
                    Across all Digital Heroes members
                  </span>
                </div>

                <div className="p-4 rounded-standard bg-neutral-light/70 dark:bg-neutral-slate-900/60 border border-neutral-gray/20 dark:border-white/10">
                  <span className="text-xs text-neutral-gray dark:text-neutral-400 font-mono block">Beneficiaries Aided</span>
                  <span className="text-2xl font-bold font-number text-primary dark:text-teal-400 mt-1 block">
                    {charity.lives_supported.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-neutral-gray dark:text-neutral-400 block mt-0.5">
                    Lives equipped & supported
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Adjust Contribution Percentage Slider Card */}
          <Card className="p-6 sm:p-8 space-y-6 dark:bg-neutral-slate-800 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-dark dark:text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-primary dark:text-teal-400" />
                  Adjust Philanthropic Tithe
                </h3>
                <p className="text-xs text-neutral-gray dark:text-neutral-400 mt-0.5">
                  Choose what percentage of your monthly fee goes directly to {charity?.name}.
                </p>
              </div>

              <span className="text-2xl font-bold font-number text-charity">
                {contributionPercent}%
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={contributionPercent}
                onChange={(e) => setContributionPercent(parseInt(e.target.value, 10))}
                className="w-full h-3 bg-neutral-light dark:bg-neutral-slate-700 rounded-lg appearance-none cursor-pointer accent-charity"
              />
              <div className="flex justify-between text-[11px] font-mono text-neutral-gray dark:text-neutral-400">
                <span>10% ($2.90/mo)</span>
                <span>25% ($7.25/mo)</span>
                <span>50% ($14.50/mo)</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="charity" size="sm" onClick={handleUpdatePercentage}>
                <Check className="w-4 h-4 mr-1.5" />
                Save New Tithe Percentage
              </Button>
            </div>
          </Card>

          {/* Contribution History Chart */}
          <Card className="p-6 sm:p-8 space-y-4 dark:bg-neutral-slate-800 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-dark dark:text-white">Monthly Giving History</h3>
                <p className="text-xs text-neutral-gray dark:text-neutral-400">Automatic monthly tithing disbursements</p>
              </div>
              <Badge variant="teal" size="sm">Audit Log</Badge>
            </div>

            <div className="pt-4">
              <SimpleLineChart
                data={monthlyHistory}
                color="#FF6B35"
                height={180}
                valuePrefix="$"
              />
            </div>
          </Card>

        </div>
      </main>

      {/* Switch Charity Modal */}
      <Modal
        isOpen={changeModalOpen}
        onClose={() => setChangeModalOpen(false)}
        title="Select New Charity"
        description="Pick a new certified charity. Your selection will take effect on your next subscription billing cycle."
      >
        <div className="space-y-3 pt-2 max-h-96 overflow-y-auto pr-1">
          {charitiesList.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedNewCharityId(c.id)}
              className={`p-3.5 rounded-standard border cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                (selectedNewCharityId || charity?.id) === c.id
                  ? "border-primary bg-primary-light/40 ring-1 ring-primary/30 dark:bg-primary/20 dark:border-teal-400"
                  : "border-neutral-gray/20 hover:bg-neutral-light dark:border-white/10 dark:hover:bg-neutral-slate-700/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <img src={c.logo_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <h4 className="font-bold text-sm text-neutral-dark dark:text-white leading-tight">{c.name}</h4>
                  <span className="text-[11px] text-neutral-gray dark:text-neutral-400 capitalize font-mono">{c.cause_category}</span>
                </div>
              </div>
              {(selectedNewCharityId || charity?.id) === c.id && (
                <Check className="w-4 h-4 text-primary dark:text-teal-400 shrink-0 stroke-[3]" />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-neutral-gray/10 dark:border-white/10 mt-4">
          <Button variant="outline" size="sm" onClick={() => setChangeModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleConfirmCharityChange}>
            Confirm Change
          </Button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
