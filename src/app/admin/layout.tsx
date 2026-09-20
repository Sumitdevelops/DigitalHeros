"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { mockDb } from "@/lib/mock-db";
import { User } from "@/types";
import {
  LayoutDashboard,
  Users,
  Trophy,
  Heart,
  Award,
  BarChart3,
  ShieldCheck,
  ArrowRight
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setCurrentUser(mockDb.getCurrentUser());
  }, [pathname]);

  const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/draws", label: "Draw Simulation & Run", icon: Trophy },
    { href: "/admin/charities", label: "Charities", icon: Heart },
    { href: "/admin/winners", label: "Winners & Payouts", icon: Award },
    { href: "/admin/reports", label: "Reports & Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] transition-colors duration-200">
      <Navbar />

      {/* Admin Top Header Banner */}
      <div className="bg-neutral-slate-900 text-white border-b border-neutral-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-charity flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight">Admin Control Center</span>
              <span className="text-[10px] text-neutral-400 font-mono block">Platform Operations & Governance</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="charity" size="sm">
              Super Admin Session
            </Badge>
            <Link
              href="/dashboard"
              className="text-xs text-neutral-300 hover:text-white flex items-center gap-1 font-mono transition-colors"
            >
              <span>Exit to Subscriber View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <nav className="flex items-center gap-1 py-1">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-neutral-slate-800 text-white border-b-2 border-primary"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-slate-800/50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary" : "text-neutral-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}
