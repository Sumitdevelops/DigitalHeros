"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SimpleLineChart } from "@/components/charts/simple-charts";
import { useToast } from "@/components/ui/toast";
import { mockDb } from "@/lib/mock-db";
import { Charity } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Heart,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Users,
  Target,
  ArrowLeft,
  Sparkles,
  Award,
  Share2
} from "lucide-react";

export default function CharityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [charity, setCharity] = useState<Charity | null>(null);

  const charityId = params.id as string;

  useEffect(() => {
    const found = mockDb.getCharityById(charityId);
    if (found) {
      setCharity(found);
    }
  }, [charityId]);

  if (!charity) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] transition-colors duration-200">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Heart className="w-12 h-12 text-neutral-gray/30 dark:text-neutral-600 mb-3" />
          <h2 className="text-xl font-bold text-neutral-dark dark:text-white">Charity Not Found</h2>
          <p className="text-sm text-neutral-gray dark:text-neutral-400 mt-1 mb-4">The organization you are looking for does not exist or has been retired.</p>
          <Link href="/charities">
            <Button variant="primary">Return to Directory</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const percentOfGoal = Math.min(100, Math.round((charity.ytd_contribution / charity.target_goal) * 100));

  // Sample monthly contribution trend for this charity
  const monthlyChartData = [
    { label: "Oct", value: Math.round(charity.ytd_contribution * 0.12) },
    { label: "Nov", value: Math.round(charity.ytd_contribution * 0.22) },
    { label: "Dec", value: Math.round(charity.ytd_contribution * 0.40) },
    { label: "Jan", value: Math.round(charity.ytd_contribution * 0.60) },
    { label: "Feb", value: Math.round(charity.ytd_contribution * 0.82) },
    { label: "Mar", value: Math.round(charity.ytd_contribution) },
  ];

  const handleSupportClick = () => {
    const currentUserId = mockDb.getCurrentUser()?.id;
    const sub = mockDb.getUserSubscription();
    if (sub || currentUserId) {
      mockDb.createOrUpdateSubscription({
        userId: currentUserId,
        planType: sub?.plan_type || "monthly",
        charityId: charity.id,
        charityPercentage: sub?.charity_contribution_percentage || 20,
      });
      toast({
        type: "success",
        title: "Primary Charity Updated!",
        description: `Your monthly subscription allocations will now go directly to ${charity.name}.`,
      });
      router.push("/dashboard/charity");
    } else {
      router.push(`/onboarding/plan-selection?charity=${charity.id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] transition-colors duration-200">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Top Back Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Link href="/charities" className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-gray dark:text-neutral-400 hover:text-primary dark:hover:text-teal-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="relative h-64 sm:h-80 lg:h-96 w-full rounded-2xl overflow-hidden shadow-md">
            <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-dark/90 via-neutral-dark/40 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 text-white">
              <div className="flex items-center gap-4">
                <img
                  src={charity.logo_url}
                  alt=""
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-white dark:border-white/20 object-cover shadow-lg"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="charity" size="sm">{charity.cause_category}</Badge>
                    {charity.is_featured && <Badge variant="gold" size="sm">Featured Partner</Badge>}
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{charity.name}</h1>
                  <a
                    href={charity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neutral-300 hover:text-white inline-flex items-center gap-1 mt-1 font-mono"
                  >
                    <span>{charity.website}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="charity" size="md" onClick={handleSupportClick} className="shadow-lg">
                  <Heart className="w-4 h-4 mr-1.5" />
                  Support This Cause
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Col: Overview & Charts */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Mission Statement */}
              <Card className="p-6 sm:p-8 space-y-4 dark:bg-neutral-slate-800 dark:border-white/10">
                <h2 className="text-xl font-bold text-neutral-dark dark:text-white">Mission & Impact Strategy</h2>
                <p className="text-sm sm:text-base text-neutral-gray dark:text-neutral-300 leading-relaxed">
                  {charity.description}
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-neutral-dark dark:text-neutral-200">
                  <div className="flex items-center gap-1.5 p-2 bg-neutral-light dark:bg-neutral-slate-700/60 rounded-standard">
                    <CheckCircle2 className="w-4 h-4 text-status-success" />
                    <span>501(c)(3) Verified Non-Profit</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-neutral-light dark:bg-neutral-slate-700/60 rounded-standard">
                    <CheckCircle2 className="w-4 h-4 text-status-success" />
                    <span>Direct Community Audited Ledger</span>
                  </div>
                </div>
              </Card>

              {/* Monthly Contribution Growth Chart */}
              <Card className="p-6 sm:p-8 space-y-4 dark:bg-neutral-slate-800 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-dark dark:text-white">Cumulative Contribution Trajectory</h3>
                    <p className="text-xs text-neutral-gray dark:text-neutral-400">Monthly subscription allocations deposited through Digital Heroes</p>
                  </div>
                  <Badge variant="teal" size="sm">6-Month Trend</Badge>
                </div>
                <div className="pt-4">
                  <SimpleLineChart
                    data={monthlyChartData}
                    color="#FF6B35"
                    height={200}
                    valuePrefix="$"
                  />
                </div>
              </Card>

              {/* Upcoming Events */}
              {charity.upcoming_events && charity.upcoming_events.length > 0 && (
                <Card className="p-6 sm:p-8 space-y-4 dark:bg-neutral-slate-800 dark:border-white/10">
                  <h3 className="text-lg font-bold text-neutral-dark dark:text-white">Upcoming Golf Outings & Events</h3>
                  <div className="space-y-3">
                    {charity.upcoming_events.map((evt, idx) => (
                      <div key={idx} className="p-4 rounded-standard bg-neutral-light/70 dark:bg-neutral-slate-700/60 border border-neutral-gray/15 dark:border-white/10 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="font-bold text-neutral-dark dark:text-white text-sm">{evt.title}</h4>
                          <span className="text-xs text-neutral-gray dark:text-neutral-400 block">{evt.location}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge variant="teal" size="sm">
                            <Calendar className="w-3 h-3 mr-1" />
                            {evt.date}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Testimonials */}
              <Card className="p-6 sm:p-8 space-y-4 bg-gradient-to-br from-white to-primary-light/10 dark:from-neutral-slate-800 dark:to-teal-950/20 dark:border-white/10">
                <div className="flex items-center gap-2 text-primary dark:text-teal-400 font-semibold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Beneficiary Testimonial</span>
                </div>
                <blockquote className="text-sm italic text-neutral-dark dark:text-neutral-200 leading-relaxed">
                  "Thanks to the continuous funding from Digital Heroes golfers, we provided 350 customized junior sets and PGA instruction to children who had never held a golf club before. This sustainable stream changes lives week after week."
                </blockquote>
                <div className="text-xs font-mono text-neutral-gray dark:text-neutral-400">
                  — Director of Community Partnerships
                </div>
              </Card>

            </div>

            {/* Right Sidebar: Key Metrics & Action */}
            <div className="lg:col-span-4 space-y-6">
              
              <Card className="p-6 space-y-6 sticky top-24 border-2 border-primary/20 dark:border-teal-500/30 dark:bg-neutral-slate-800 shadow-md">
                <h3 className="text-base font-bold text-neutral-dark dark:text-white border-b border-neutral-gray/10 dark:border-white/10 pb-3">
                  Philanthropic Impact
                </h3>

                {/* Raised vs Goal */}
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-neutral-gray dark:text-neutral-400">YTD Funds Raised</span>
                    <span className="text-2xl font-bold font-number text-charity">
                      {formatCurrency(charity.ytd_contribution)}
                    </span>
                  </div>

                  <div className="h-2.5 w-full bg-neutral-light dark:bg-neutral-slate-700 rounded-full overflow-hidden">
                    <div style={{ width: `${percentOfGoal}%` }} className="h-full bg-charity transition-all duration-500" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-gray dark:text-neutral-400 font-mono">
                    <span>Target: {formatCurrency(charity.target_goal)}</span>
                    <span className="font-bold text-charity">{percentOfGoal}% achieved</span>
                  </div>
                </div>

                {/* Lives Supported */}
                <div className="p-4 rounded-standard bg-neutral-light/70 dark:bg-neutral-slate-700/60 border border-neutral-gray/15 dark:border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-light dark:bg-teal-950/60 text-primary dark:text-teal-400 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-gray dark:text-neutral-400 block">Total Lives Impacted</span>
                    <span className="text-lg font-bold font-number text-neutral-dark dark:text-white">
                      {charity.lives_supported.toLocaleString()} Individuals
                    </span>
                  </div>
                </div>

                {/* Primary CTA */}
                <Button variant="charity" size="lg" onClick={handleSupportClick} className="w-full shadow-charityGlow">
                  <Heart className="w-4 h-4 mr-2" />
                  Select as My Cause
                </Button>

                <p className="text-[11px] text-neutral-gray dark:text-neutral-400 text-center leading-relaxed">
                  You can adjust your donation contribution percentage (10% to 50%) at any time in your dashboard settings.
                </p>
              </Card>

            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
