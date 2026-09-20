"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { mockDb } from "@/lib/mock-db";
import { calculateRevenueSplit } from "@/lib/stripe";
import { Charity } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Heart, Trophy, Check, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

function PlanSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const charityIdParam = searchParams.get("charity");
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const [planType, setPlanType] = useState<"monthly" | "yearly">("monthly");
  const [charityPercent, setCharityPercent] = useState<number>(10);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const charities = mockDb.getCharities();
    if (charityIdParam) {
      const found = charities.find((c) => c.id === charityIdParam);
      if (found) setSelectedCharity(found);
    } else {
      setSelectedCharity(charities[0]);
    }
  }, [charityIdParam]);

  const price = planType === "monthly" ? 29 : 290;
  const split = calculateRevenueSplit(price, charityPercent);

  const handleStartSubscription = async () => {
    if (!selectedCharity) return;
    setIsProcessing(true);

    try {
      // Call Stripe Checkout creation API
      const res = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planType,
          charityId: selectedCharity.id,
          charityPercentage: charityPercent,
          userId: mockDb.getCurrentUser()?.id || "a1111111-1111-1111-1111-111111111111",
        }),
      });

      const data = await res.json();

      // If live or test Stripe Checkout session URL is returned, redirect to Stripe
      if (data.session?.url && data.session.url.startsWith("https://checkout.stripe.com")) {
        window.location.href = data.session.url;
        return;
      }

      const activeUserId = mockDb.getCurrentUser()?.id || "a1111111-1111-1111-1111-111111111111";

      // Simulated fallback if Stripe keys are missing or offline
      mockDb.createOrUpdateSubscription({
        userId: activeUserId,
        planType,
        charityId: selectedCharity.id,
        charityPercentage: charityPercent,
      });

      mockDb.addContribution({
        user_id: activeUserId,
        charity_id: selectedCharity.id,
        amount: split.charityAmount,
        contribution_date: new Date().toISOString().split("T")[0],
      });

      toast({
        type: "success",
        title: "Subscription Activated!",
        description: `Your ${planType} membership is live. $${split.charityAmount.toFixed(2)} allocated to ${selectedCharity.name}.`,
      });

      router.push("/dashboard?welcome=true");
    } catch (err: any) {
      toast({
        type: "error",
        title: "Checkout Error",
        description: err.message || "Failed to initiate checkout session.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Step Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light dark:bg-primary/20 text-primary dark:text-primary-light text-xs font-mono font-semibold">
          <span>Step 2 of 2</span>
          <span>•</span>
          <span>Subscription Plan & Charity Split</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-dark dark:text-white tracking-tight">
          Select Your Membership Tier
        </h1>
        <p className="text-sm text-neutral-gray dark:text-neutral-400 max-w-xl mx-auto">
          Choose between our flexible monthly plan or discounted annual membership. Adjust your philanthropic tithe below.
        </p>
      </div>

      {/* Test Mode / Safe Sandbox Notice Banner */}
      <div className="bg-amber-500/10 dark:bg-amber-950/30 border-2 border-amber-500/30 dark:border-amber-500/40 rounded-card p-4 sm:p-5 flex items-start sm:items-center gap-4 text-amber-900 dark:text-amber-200 shadow-xs">
        <div className="w-10 h-10 rounded-full bg-amber-500/20 dark:bg-amber-500/30 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-amber-700 dark:text-amber-400" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-950 dark:text-amber-100 uppercase tracking-wide text-xs font-mono bg-amber-200/80 dark:bg-amber-900/80 px-2 py-0.5 rounded">
              Sandbox Test Mode
            </span>
            <span className="font-bold text-amber-900 dark:text-amber-200 text-sm">
              This is a test payment — your money won&apos;t go anywhere!
            </span>
          </div>
          <p className="text-amber-800/90 dark:text-amber-300/90 leading-relaxed text-xs">
            This platform uses <strong>Stripe Test Mode</strong>. No real currency will be charged. 
            On the payment screen, you can safely use test card <code className="bg-white/80 dark:bg-neutral-slate-900 border border-amber-300 dark:border-amber-700 px-2 py-0.5 rounded font-mono font-bold text-amber-950 dark:text-amber-200">4242 4242 4242 4242</code> with any future expiration date and any 3-digit CVC.
          </p>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Monthly Plan */}
        <div
          onClick={() => setPlanType("monthly")}
          className={`p-6 rounded-card bg-white dark:bg-neutral-slate-800 border-2 cursor-pointer transition-all ${
            planType === "monthly"
              ? "border-primary ring-2 ring-primary/20 shadow-lg -translate-y-1"
              : "border-neutral-gray/20 dark:border-white/10 hover:border-primary/40"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-neutral-dark dark:text-white">Monthly Player</h3>
            {planType === "monthly" && (
              <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>

          <div className="mb-4">
            <span className="text-3xl font-extrabold font-number text-neutral-dark dark:text-white">$29</span>
            <span className="text-xs text-neutral-gray dark:text-neutral-400 font-mono"> / month</span>
          </div>

          <ul className="space-y-2 text-xs text-neutral-gray dark:text-neutral-400 border-t border-neutral-gray/10 dark:border-white/10 pt-4">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-status-success shrink-0" />
              <span>Enter monthly prize pool draws</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-status-success shrink-0" />
              <span>Log up to 5 rolling Stableford scores</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-status-success shrink-0" />
              <span>Cancel anytime with 1 click</span>
            </li>
          </ul>
        </div>

        {/* Yearly Plan */}
        <div
          onClick={() => setPlanType("yearly")}
          className={`relative p-6 rounded-card bg-white dark:bg-neutral-slate-800 border-2 cursor-pointer transition-all ${
            planType === "yearly"
              ? "border-gold ring-2 ring-gold/30 shadow-lg -translate-y-1 bg-gradient-to-br from-gold-light/20 to-white dark:from-gold/10 dark:to-neutral-slate-800"
              : "border-neutral-gray/20 dark:border-white/10 hover:border-gold/40"
          }`}
        >
          <div className="absolute -top-3 right-6">
            <Badge variant="gold" size="sm" className="shadow-xs">
              Save $58 / Year (2 Months Free)
            </Badge>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-neutral-dark dark:text-white">Annual Founder</h3>
            {planType === "yearly" && (
              <span className="w-5 h-5 rounded-full bg-gold text-neutral-dark flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>

          <div className="mb-4">
            <span className="text-3xl font-extrabold font-number text-gold-dark dark:text-gold">$290</span>
            <span className="text-xs text-neutral-gray dark:text-neutral-400 font-mono"> / year (~$24.17/mo)</span>
          </div>

          <ul className="space-y-2 text-xs text-neutral-gray dark:text-neutral-400 border-t border-neutral-gray/10 dark:border-white/10 pt-4">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-status-success shrink-0" />
              <span>Full 12-month draw participation</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-status-success shrink-0" />
              <span>2 full months free compared to monthly</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-status-success shrink-0" />
              <span>Priority winner proof fast-track</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Interactive Charity Tithe Slider (10% to 50%) */}
      <Card className="p-6 sm:p-8 space-y-6 border-2 border-charity/20 bg-white shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-charity uppercase tracking-wider font-bold block">
              Philanthropic Tithe
            </span>
            <h3 className="text-lg font-bold text-neutral-dark">
              Charity Allocation Percentage: <span className="text-charity font-mono">{charityPercent}%</span>
            </h3>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-neutral-gray block font-mono">Beneficiary Cause:</span>
            <span className="text-sm font-semibold text-neutral-dark flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-charity" />
              {selectedCharity?.name || "Junior Golf Foundation"}
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="10"
            max="50"
            step="5"
            value={charityPercent}
            onChange={(e) => setCharityPercent(parseInt(e.target.value, 10))}
            className="w-full h-3 bg-neutral-light rounded-lg appearance-none cursor-pointer accent-charity"
          />
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-gray">
            <span>10% (Default)</span>
            <span>25%</span>
            <span>50% (Max Impact)</span>
          </div>
        </div>

        {/* Dynamic Financial Split Breakdown */}
        <div className="p-4 rounded-standard bg-neutral-light/70 dark:bg-neutral-slate-900/60 border border-neutral-gray/20 dark:border-white/10 space-y-3">
          <span className="text-xs font-bold text-neutral-dark dark:text-white font-mono uppercase tracking-wider block">
            Financial Allocation Breakdown ({planType})
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-neutral-gray dark:text-neutral-400 block">Total Fee</span>
              <span className="font-bold text-neutral-dark dark:text-white text-sm">{formatCurrency(split.subscriptionPrice)}</span>
            </div>
            <div>
              <span className="text-charity block">Charity Share ({charityPercent}%)</span>
              <span className="font-bold text-charity text-sm">{formatCurrency(split.charityAmount)}</span>
            </div>
            <div>
              <span className="text-primary block">Prize Pool (90%)</span>
              <span className="font-bold text-primary text-sm">{formatCurrency(split.grossPrizePool)}</span>
            </div>
            <div>
              <span className="text-gold-dark dark:text-gold block">5-Match Pool (40%)</span>
              <span className="font-bold text-gold-dark dark:text-gold text-sm">{formatCurrency(split.tier5Pool)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Start Subscription Action */}
      <div className="pt-2 text-center space-y-3">
        <Button
          variant="primary"
          size="lg"
          onClick={handleStartSubscription}
          isLoading={isProcessing}
          className="w-full sm:w-80 shadow-tealGlow mx-auto"
        >
          <ShieldCheck className="w-5 h-5 mr-2" />
          Activate Subscription
        </Button>
        <p className="text-xs text-neutral-gray">
          Instant activation. You will be redirected directly to your Subscriber Dashboard.
        </p>
      </div>

    </div>
  );
}

export default function PlanSelectionOnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] transition-colors">
      <Navbar />
      <main className="flex-1 py-12 lg:py-16">
        <Suspense fallback={<div className="text-center py-20 font-mono text-sm text-neutral-gray dark:text-neutral-400">Loading membership plans...</div>}>
          <PlanSelectionContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
