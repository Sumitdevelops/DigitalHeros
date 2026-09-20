"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { mockDb } from "@/lib/mock-db";
import { Charity, CauseCategory } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Search, Heart, Filter, Calendar, ArrowRight, ExternalLink } from "lucide-react";

export default function CharitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [charities, setCharities] = useState<Charity[]>([]);

  useEffect(() => {
    setCharities(mockDb.getCharities());
  }, []);

  const categories: { label: string; value: string }[] = [
    { label: "All Causes", value: "all" },
    { label: "Education & Youth", value: "education" },
    { label: "Veterans Rehab", value: "veterans" },
    { label: "Poverty & Access", value: "poverty" },
    { label: "Environment & Eco", value: "environment" },
    { label: "Children Health", value: "health" },
  ];

  const filteredCharities = useMemo(() => {
    return charities.filter((c) => {
      const matchesCategory = selectedCategory === "all" || c.cause_category === selectedCategory;
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [charities, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="bg-white dark:bg-neutral-slate-900 border-b border-neutral-gray/15 dark:border-white/10 py-12 lg:py-16 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <Badge variant="charity" size="md">
              Impact Directory
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-dark dark:text-white tracking-tight">
              Support a Cause That Matters
            </h1>
            <p className="text-base text-neutral-gray dark:text-neutral-400 max-w-2xl mx-auto">
              Browse thoroughly vetted charitable organizations. Every monthly subscription allows you to direct between 10% and 50% of your fee to the cause you care about most.
            </p>

            {/* Search and Filters */}
            <div className="max-w-2xl mx-auto pt-4 space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 text-neutral-gray dark:text-neutral-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Search causes, organizations, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-standard border border-neutral-gray/30 dark:border-white/15 bg-neutral-light/50 dark:bg-neutral-slate-800 text-neutral-dark dark:text-white placeholder:text-neutral-gray dark:placeholder:text-neutral-500 focus:bg-white dark:focus:bg-neutral-slate-800 focus:outline-none focus:border-primary dark:focus:border-teal-400 focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === cat.value
                        ? "bg-primary text-white shadow-xs font-semibold"
                        : "bg-neutral-light dark:bg-neutral-slate-800 text-neutral-dark dark:text-neutral-300 hover:bg-neutral-gray/20 dark:hover:bg-neutral-slate-700"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Directory Grid */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs font-mono text-neutral-gray dark:text-neutral-400 uppercase tracking-wider">
                Showing {filteredCharities.length} {filteredCharities.length === 1 ? "Organization" : "Organizations"}
              </span>
            </div>

            {filteredCharities.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-neutral-slate-800 rounded-card border border-neutral-gray/20 dark:border-white/10 p-8 space-y-3">
                <Heart className="w-10 h-10 text-neutral-gray/40 dark:text-neutral-500 mx-auto" />
                <h3 className="text-lg font-bold text-neutral-dark dark:text-white">No charities matched your search</h3>
                <p className="text-sm text-neutral-gray dark:text-neutral-400">Try adjusting your keywords or selecting another cause category.</p>
                <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCharities.map((charity) => {
                  const percent = Math.min(100, Math.round((charity.ytd_contribution / charity.target_goal) * 100));

                  return (
                    <Card key={charity.id} interactive className="overflow-hidden p-0 flex flex-col justify-between dark:bg-neutral-slate-800 dark:border-white/10">
                      <div>
                        {/* Image Header */}
                        <div className="relative h-48 w-full overflow-hidden bg-neutral-gray/20 dark:bg-neutral-slate-700">
                          <img
                            src={charity.image_url}
                            alt={charity.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 right-3 flex gap-1.5">
                            <Badge variant="charity" size="sm">
                              {charity.cause_category}
                            </Badge>
                            {charity.is_featured && (
                              <Badge variant="gold" size="sm">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={charity.logo_url}
                              alt=""
                              className="w-12 h-12 rounded-full border border-neutral-gray/20 dark:border-white/10 object-cover shadow-xs"
                            />
                            <div>
                              <h3 className="font-bold text-base text-neutral-dark dark:text-white leading-tight">
                                {charity.name}
                              </h3>
                              <span className="text-xs text-neutral-gray dark:text-neutral-400 font-mono">
                                {charity.lives_supported.toLocaleString()} beneficiaries supported
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-neutral-gray dark:text-neutral-400 line-clamp-3 leading-relaxed">
                            {charity.description}
                          </p>

                          {/* Events Badge */}
                          {charity.upcoming_events && charity.upcoming_events.length > 0 && (
                            <div className="flex items-center gap-2 p-2 bg-neutral-light dark:bg-neutral-slate-700/60 rounded-standard text-xs text-neutral-dark dark:text-neutral-200">
                              <Calendar className="w-3.5 h-3.5 text-primary dark:text-teal-400 shrink-0" />
                              <span className="truncate font-medium">
                                Upcoming: {charity.upcoming_events[0].title} ({charity.upcoming_events[0].date})
                              </span>
                            </div>
                          )}

                          {/* Funding Progress Bar */}
                          <div className="space-y-1.5 pt-2">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-neutral-gray dark:text-neutral-400">
                                Raised: <strong className="text-neutral-dark dark:text-white">{formatCurrency(charity.ytd_contribution)}</strong>
                              </span>
                              <span className="font-bold text-charity">{percent}% of goal</span>
                            </div>
                            <div className="h-2 w-full bg-neutral-light dark:bg-neutral-slate-700 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${percent}%` }}
                                className="h-full bg-charity transition-all duration-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="px-6 pb-6 pt-2 border-t border-neutral-gray/10 dark:border-white/10 flex items-center justify-between gap-3">
                        <Link href={`/charities/${charity.id}`} className="flex-1">
                          <Button variant="primary" size="sm" className="w-full">
                            View Cause & Impact
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
