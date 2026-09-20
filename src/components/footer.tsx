import React from "react";
import Link from "next/link";
import { Target, Shield, Heart, Trophy, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-neutral-slate-900 text-white border-t border-neutral-slate-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white">
                <Target className="w-5 h-5 text-gold" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                DIGITAL<span className="text-primary font-extrabold ml-1">HEROES</span>
              </span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed">
              The high-velocity fintech platform connecting verified Stableford golf performance with transparent monthly prize draws and guaranteed charitable impact.
            </p>
            <div className="flex items-center gap-3 text-neutral-400 text-xs font-mono">
              <span className="flex items-center gap-1 text-status-success">
                <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
                SOC2 Compliant
              </span>
              <span>•</span>
              <span className="text-neutral-300">WHS Ready</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <Link href="/charities" className="hover:text-primary-light transition-colors">
                  Charity Directory
                </Link>
              </li>
              <li>
                <Link href="/dashboard/draws" className="hover:text-primary-light transition-colors">
                  Monthly Prize Draws
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-primary-light transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#draw-mechanics" className="hover:text-primary-light transition-colors">
                  5/4/3 Match Mechanics
                </Link>
              </li>
              <li>
                <Link href="/onboarding/plan-selection" className="hover:text-primary-light transition-colors">
                  Pricing & Subscriptions
                </Link>
              </li>
            </ul>
          </div>

          {/* Impact & Transparency */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Impact & Trust
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <Link href="/charities" className="hover:text-primary-light transition-colors flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-charity" />
                  100% Tax-Deductible Tithing
                </Link>
              </li>
              <li>
                <span className="text-neutral-400">Audited Prize Pools</span>
              </li>
              <li>
                <span className="text-neutral-400">Proof Verification SLA</span>
              </li>
              <li>
                <span className="text-neutral-400">Junior & Veteran Foundations</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Draw Alerts & Updates
            </h4>
            <p className="text-xs text-neutral-400">
              Receive live monthly draw results, winner broadcasts, and charity impact reports.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed to Digital Heroes draw notifications!"); }} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="golfer@domain.com"
                  className="bg-neutral-slate-800 border border-neutral-slate-700 text-white px-3 py-2 rounded-standard text-xs w-full focus:outline-none focus:border-primary font-mono"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white text-xs px-3 py-2 rounded-standard font-medium shrink-0 transition-colors"
                >
                  Join
                </button>
              </div>
              <span className="text-[10px] text-neutral-500 block">No spam. Only draw numbers & charity metrics.</span>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p suppressHydrationWarning>© {new Date().getFullYear()} Digital Heroes. All rights reserved. Built for golf performance and catalytic giving.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/charities" className="hover:text-white transition-colors">
              Charity Guidelines
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
