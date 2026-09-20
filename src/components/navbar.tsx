"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { mockDb } from "@/lib/mock-db";
import { User } from "@/types";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Trophy,
  Heart,
  Calendar,
  User as UserIcon,
  Shield,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Target,
  BarChart3
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    // Initial fetch
    setCurrentUser(mockDb.getCurrentUser());

    const handleStorage = () => {
      setCurrentUser(mockDb.getCurrentUser());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [pathname]);


  const handleLogout = () => {
    mockDb.logout();
    setCurrentUser(null);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push("/auth/login");
  };

  const isAuthPage = pathname.startsWith("/auth") || pathname.startsWith("/onboarding");
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/draws");

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-neutral-gray/15 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm group-hover:bg-primary-hover transition-colors">
            <Target className="w-5 h-5 text-gold" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-neutral-dark tracking-tight leading-none group-hover:text-primary transition-colors">
              DIGITAL<span className="text-primary font-extrabold ml-1">HEROES</span>
            </span>
            <span className="text-[10px] text-neutral-gray tracking-wider uppercase font-mono">
              Golf & Charity Draws
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {!isDashboard ? (
            <>
              <Link
                href="/charities"
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  pathname === "/charities" ? "text-primary bg-primary-light" : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-light"
                }`}
              >
                Charity Directory
              </Link>
              <Link
                href="/#how-it-works"
                className="px-3 py-1.5 text-sm font-medium text-neutral-gray hover:text-neutral-dark hover:bg-neutral-light rounded-md transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/#draw-mechanics"
                className="px-3 py-1.5 text-sm font-medium text-neutral-gray hover:text-neutral-dark hover:bg-neutral-light rounded-md transition-colors"
              >
                Draw Mechanics
              </Link>
              <Link
                href="/onboarding/plan-selection"
                className="px-3 py-1.5 text-sm font-medium text-neutral-gray hover:text-neutral-dark hover:bg-neutral-light rounded-md transition-colors"
              >
                Pricing
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  pathname === "/dashboard" ? "text-primary bg-primary-light" : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-light"
                }`}
              >
                Hub
              </Link>
              <Link
                href="/dashboard/scores"
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  pathname === "/dashboard/scores" ? "text-primary bg-primary-light" : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-light"
                }`}
              >
                Scores (5 Max)
              </Link>
              <Link
                href="/dashboard/draws"
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  pathname === "/dashboard/draws" ? "text-primary bg-primary-light" : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-light"
                }`}
              >
                Draws & Results
              </Link>
              <Link
                href="/dashboard/charity"
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  pathname === "/dashboard/charity" ? "text-primary bg-primary-light" : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-light"
                }`}
              >
                My Charity
              </Link>
              <Link
                href="/dashboard/winnings"
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  pathname === "/dashboard/winnings" ? "text-primary bg-primary-light" : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-light"
                }`}
              >
                Winnings
              </Link>
              {currentUser?.role === "admin" && (
                <Link
                  href="/admin"
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                    pathname.startsWith("/admin") ? "text-charity bg-charity-light" : "text-charity hover:bg-charity-light"
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Suite
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Right Actions / Role Switcher */}
        <div className="hidden md:flex items-center gap-2.5">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-standard hover:bg-neutral-light border border-neutral-gray/20 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs overflow-hidden">
                  {currentUser.avatar_url ? (
                    <img src={currentUser.avatar_url} alt={currentUser.full_name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.full_name.charAt(0)
                  )}
                </div>
                <div className="hidden lg:flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-neutral-dark">{currentUser.full_name}</span>
                    <Badge variant={currentUser.role === "admin" ? "charity" : "teal"} size="sm">
                      {currentUser.role}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-neutral-gray font-mono">{currentUser.email}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-neutral-gray" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-modal shadow-xl border border-neutral-gray/20 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-neutral-gray/10 mb-1">
                    <p className="text-xs font-semibold text-neutral-dark">{currentUser.full_name}</p>
                    <p className="text-[11px] text-neutral-gray truncate font-mono">{currentUser.email}</p>
                    <div className="mt-1.5">
                      <Badge variant={currentUser.role === "admin" ? "charity" : "teal"} size="sm">
                        {currentUser.role === "admin" ? "Platform Administrator" : "Active Subscriber"}
                      </Badge>
                    </div>
                  </div>


                  <div className="space-y-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full px-3 py-2 rounded text-xs font-medium text-neutral-dark hover:bg-neutral-light flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-neutral-gray" />
                      Golfer Dashboard
                    </Link>
                    <Link
                      href="/dashboard/scores"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full px-3 py-2 rounded text-xs font-medium text-neutral-dark hover:bg-neutral-light flex items-center gap-2"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-neutral-gray" />
                      Scorecard (1-45 pts)
                    </Link>
                    <Link
                      href="/dashboard/winnings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full px-3 py-2 rounded text-xs font-medium text-neutral-dark hover:bg-neutral-light flex items-center gap-2"
                    >
                      <Trophy className="w-3.5 h-3.5 text-gold-dark" />
                      Claim Payouts
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full px-3 py-2 rounded text-xs font-medium text-neutral-dark hover:bg-neutral-light flex items-center gap-2"
                    >
                      <Heart className="w-3.5 h-3.5 text-charity" />
                      Subscription & Cause
                    </Link>
                    {currentUser.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full px-3 py-2 rounded text-xs font-semibold text-charity hover:bg-charity-light flex items-center gap-2"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Platform Admin Suite
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-neutral-gray/10 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 rounded text-xs font-medium text-status-error hover:bg-red-50 flex items-center gap-2 text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="primary" size="sm" className="shadow-xs">
                  Create Account
                </Button>
              </Link>
            </div>
          )}

          {/* Quick link to log score if logged in */}
          {currentUser && (
            <Link href={pathname.startsWith("/dashboard") ? "/dashboard/scores" : "/dashboard"}>
              <Button variant="primary" size="sm">
                {pathname.startsWith("/dashboard") ? "Log Score" : "My Dashboard"}
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center md:hidden gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-neutral-gray hover:text-neutral-dark hover:bg-neutral-light"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-neutral-dark" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-gray/20 bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-neutral-dark hover:bg-neutral-light rounded-md"
            >
              Home
            </Link>
            <Link
              href="/charities"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-neutral-dark hover:bg-neutral-light rounded-md"
            >
              Charity Directory
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-neutral-dark hover:bg-neutral-light rounded-md"
            >
              Dashboard Hub
            </Link>
            <Link
              href="/dashboard/scores"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-neutral-dark hover:bg-neutral-light rounded-md"
            >
              Scores (5 Max)
            </Link>
            <Link
              href="/dashboard/draws"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-neutral-dark hover:bg-neutral-light rounded-md"
            >
              Draws & Results
            </Link>
            <Link
              href="/dashboard/charity"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-neutral-dark hover:bg-neutral-light rounded-md"
            >
              My Charity
            </Link>
            <Link
              href="/dashboard/winnings"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-neutral-dark hover:bg-neutral-light rounded-md"
            >
              Winnings & Proof
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-charity hover:bg-charity-light rounded-md font-semibold"
            >
              Admin Suite
            </Link>
          </div>

          {/* Bottom mobile menu auth section */}
          <div className="pt-3 border-t border-neutral-gray/10 flex flex-col gap-2">
            {currentUser ? (
              <div className="p-2 bg-neutral-light rounded-md">
                <span className="text-[10px] font-mono text-neutral-gray font-bold uppercase block mb-1">
                  Signed in as
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-dark">{currentUser.full_name}</span>
                  <Badge variant={currentUser.role === "admin" ? "charity" : "teal"}>
                    {currentUser.role}
                  </Badge>
                </div>
                <div className="mt-2 pt-2 border-t border-neutral-gray/10">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-1.5 text-xs text-status-error font-medium hover:bg-red-50 rounded"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log Out of Session
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full" size="sm">
                    Create Account
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
