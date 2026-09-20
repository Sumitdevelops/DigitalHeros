"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { mockDb } from "@/lib/mock-db";
import { Charity } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Heart, Check, ArrowRight, Search, Sparkles } from "lucide-react";

export default function CharitySelectionOnboardingPage() {
  const router = useRouter();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedCharityId, setSelectedCharityId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const list = mockDb.getCharities();
    setCharities(list);
    if (list.length > 0) {
      setSelectedCharityId(list[0].id);
    }
  }, []);

  const filteredCharities = charities.filter((c) => {
    const matchCat = category === "all" || c.cause_category === category;
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleContinue = () => {
    if (!selectedCharityId) return;
    router.push(`/onboarding/plan-selection?charity=${selectedCharityId}`);
  };

  const selectedCharity = charities.find((c) => c.id === selectedCharityId);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] transition-colors">
      <Navbar />

      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header & Step Indicator */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light dark:bg-primary/20 text-primary dark:text-primary-light text-xs font-mono font-semibold">
              <span>Step 1 of 2</span>
              <span>•</span>
              <span>Onboarding</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-dark dark:text-white tracking-tight">
              Choose a Charity to Support
            </h1>
            <p className="text-sm text-neutral-gray dark:text-neutral-400 leading-relaxed">
              Select which organization receives guaranteed monthly contributions from your subscription. You can change your choice or adjust your contribution percentage anytime.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-gray dark:text-neutral-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Search causes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-3 text-xs rounded-standard border border-neutral-gray/30 dark:border-white/15 bg-white dark:bg-neutral-slate-900 dark:text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {["all", "education", "veterans", "poverty", "health"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                    category === cat
                      ? "bg-primary text-white font-semibold"
                      : "bg-white dark:bg-neutral-slate-800 border border-neutral-gray/20 dark:border-white/10 text-neutral-dark dark:text-neutral-200 hover:bg-neutral-light dark:hover:bg-white/5"
                  }`}
                >
                  {cat === "all" ? "All Causes" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Charities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCharities.map((charity) => {
              const isSelected = charity.id === selectedCharityId;

              return (
                <div
                  key={charity.id}
                  onClick={() => setSelectedCharityId(charity.id)}
                  className={`relative p-5 rounded-card bg-white dark:bg-neutral-slate-800 border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/20 shadow-md -translate-y-1"
                      : "border-neutral-gray/20 dark:border-white/10 hover:border-primary/40 dark:hover:border-primary/40 hover:shadow-sm"
                  }`}
                >
                  {/* Selected Tick Indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={charity.logo_url}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-gray/20 dark:border-white/10"
                      />
                      <div className="pr-6">
                        <h3 className="font-bold text-sm text-neutral-dark dark:text-white leading-snug">
                          {charity.name}
                        </h3>
                        <Badge variant="charity" size="sm" className="mt-1">
                          {charity.cause_category}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-gray dark:text-neutral-400 line-clamp-3 leading-relaxed">
                      {charity.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-neutral-gray/10 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-gray dark:text-neutral-400">{charity.lives_supported.toLocaleString()} Beneficiaries</span>
                    <span className="text-charity font-bold">{formatCurrency(charity.ytd_contribution)} YTD</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Bottom Action */}
          <div className="sticky bottom-6 z-30 p-4 bg-white/95 dark:bg-neutral-slate-900/95 backdrop-blur rounded-xl border border-neutral-gray/20 dark:border-white/10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-charity-light dark:bg-charity/20 text-charity flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-gray uppercase tracking-wider block">
                  Selected Cause
                </span>
                <span className="font-bold text-sm text-neutral-dark">
                  {selectedCharity?.name || "None Selected"}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleContinue}
              disabled={!selectedCharityId}
              className="w-full sm:w-auto shadow-tealGlow"
            >
              Continue to Plan Selection
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
