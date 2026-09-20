"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { mockDb } from "@/lib/mock-db";
import { User, Subscription, Charity } from "@/types";
import { formatDate } from "@/lib/utils";
import { useTheme, Theme } from "@/components/theme-provider";
import {
  User as UserIcon,
  CreditCard,
  Heart,
  Shield,
  Bell,
  Trash2,
  Check,
  AlertTriangle,
  Download,
  LogOut,
  Sun,
  Moon,
  Laptop
} from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [charity, setCharity] = useState<Charity | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const user = mockDb.getCurrentUser();
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }
    setCurrentUser(user);
    setName(user.full_name);
    setEmail(user.email);

    const sub = mockDb.getUserSubscription(user.id);
    setSubscription(sub || null);
    if (sub) {
      setCharity(mockDb.getCharityById(sub.charity_id) || null);
    }
  }, []);

  const handleLogout = () => {
    mockDb.logout();
    toast({ type: "info", title: "Signed Out", description: "You have been safely signed out." });
    window.location.href = "/auth/login";
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    currentUser.full_name = name.trim();
    currentUser.email = email.trim();
    toast({
      type: "success",
      title: "Profile Saved",
      description: "Your personal information has been updated.",
    });
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast({
        type: "error",
        title: "Weak Password",
        description: "New password must be at least 8 characters long.",
      });
      return;
    }
    const current = mockDb.getCurrentUser();
    if (current) {
      mockDb.updateUserPassword(current.id, newPassword);
    }
    setPassword("");
    setNewPassword("");
    toast({
      type: "success",
      title: "Security Credentials Updated",
      description: "Your account password has been changed successfully.",
    });
  };

  const handleCancelSubscription = () => {
    if (!subscription) return;
    mockDb.updateSubscription(subscription.id, { status: "canceled" });
    setSubscription(mockDb.getUserSubscription() || null);
    toast({
      type: "info",
      title: "Subscription Canceled",
      description: "Your membership will terminate at the end of the current billing cycle.",
    });
  };

  const handleDownloadData = () => {
    const data = {
      user: currentUser,
      subscription,
      scores: mockDb.getUserScores(),
      winnings: mockDb.getWinners(),
      contributions: mockDb.getContributions(currentUser?.id),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `digital-heroes-data-${currentUser?.id}.json`;
    a.click();
    toast({
      type: "success",
      title: "Archive Dispatched",
      description: "Complete performance and philanthropic history downloaded.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] transition-colors">
      <Navbar />

      <main className="flex-1 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="pb-2 border-b border-neutral-gray/15 dark:border-white/10">
            <span className="text-xs font-mono text-primary font-semibold uppercase tracking-wider block">
              Preferences & Security
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark dark:text-white tracking-tight">
              Account Settings
            </h1>
          </div>

          {/* Section 1: Profile */}
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 text-base font-bold text-neutral-dark dark:text-white border-b border-neutral-gray/10 dark:border-white/10 pb-3">
              <UserIcon className="w-5 h-5 text-primary" />
              Personal Profile
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-dark dark:text-neutral-200 mb-1 font-mono uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-3 text-sm rounded-standard border border-neutral-gray/30 dark:border-white/15 dark:bg-neutral-slate-900 dark:text-white focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-dark dark:text-neutral-200 mb-1 font-mono uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-3 text-sm rounded-standard border border-neutral-gray/30 dark:border-white/15 dark:bg-neutral-slate-900 dark:text-white focus:border-primary focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" size="sm">
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Section 2: Subscription */}
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-gray/10 pb-3">
              <div className="flex items-center gap-2 text-base font-bold text-neutral-dark">
                <CreditCard className="w-5 h-5 text-primary" />
                Subscription Membership
              </div>
              <Badge variant={subscription?.status === "active" ? "success" : "warning"} size="sm">
                {subscription?.status || "Active"}
              </Badge>
            </div>

            <div className="p-4 rounded-standard bg-neutral-light/70 border border-neutral-gray/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="font-bold text-sm text-neutral-dark capitalize">
                  {subscription?.plan_type || "Monthly"} Plan ($29/month)
                </span>
                <span className="text-neutral-gray block">
                  Next Renewal Date: {formatDate(subscription?.renewal_date || "2026-04-15")}
                </span>
              </div>
              <div className="flex gap-2">
                {subscription?.status !== "canceled" ? (
                  <Button variant="outline" size="sm" onClick={handleCancelSubscription} className="text-status-error hover:bg-red-50">
                    Cancel Subscription
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      mockDb.updateSubscription(subscription.id, { status: "active" });
                      setSubscription(mockDb.getUserSubscription() || null);
                      toast({ type: "success", title: "Subscription Re-activated" });
                    }}
                  >
                    Re-activate Membership
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Section: Appearance & Theme */}
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-gray/10 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2 text-base font-bold text-neutral-dark dark:text-white">
                <Sun className="w-5 h-5 text-gold" />
                Appearance & Theme
              </div>
              <Badge variant="teal" size="sm">
                Interface
              </Badge>
            </div>

            <p className="text-xs text-neutral-gray dark:text-neutral-400">
              Choose your interface color theme or match your system preferences.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {/* Light Mode */}
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-4 rounded-standard border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  theme === "light"
                    ? "border-primary bg-primary-light/40 dark:bg-primary/20 ring-2 ring-primary"
                    : "border-neutral-gray/20 dark:border-white/10 bg-white dark:bg-neutral-slate-800 hover:border-neutral-gray/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-xs">
                    <Sun className="w-5 h-5" />
                  </div>
                  {theme === "light" && <Check className="w-4 h-4 text-primary stroke-[3]" />}
                </div>
                <div>
                  <span className="text-sm font-bold text-neutral-dark dark:text-white block">Light Mode</span>
                  <span className="text-[11px] text-neutral-gray dark:text-neutral-400 block mt-0.5">Clean daylight slate</span>
                </div>
              </button>

              {/* Dark Mode */}
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-4 rounded-standard border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  theme === "dark"
                    ? "border-primary bg-primary-light/40 dark:bg-primary/20 ring-2 ring-primary"
                    : "border-neutral-gray/20 dark:border-white/10 bg-white dark:bg-neutral-slate-800 hover:border-neutral-gray/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-neutral-slate-900 border border-neutral-slate-700 text-teal-400 flex items-center justify-center shadow-xs">
                    <Moon className="w-5 h-5" />
                  </div>
                  {theme === "dark" && <Check className="w-4 h-4 text-primary stroke-[3]" />}
                </div>
                <div>
                  <span className="text-sm font-bold text-neutral-dark dark:text-white block">Dark Mode</span>
                  <span className="text-[11px] text-neutral-gray dark:text-neutral-400 block mt-0.5">High contrast obsidian</span>
                </div>
              </button>

              {/* System Default */}
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`p-4 rounded-standard border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  theme === "system"
                    ? "border-primary bg-primary-light/40 dark:bg-primary/20 ring-2 ring-primary"
                    : "border-neutral-gray/20 dark:border-white/10 bg-white dark:bg-neutral-slate-800 hover:border-neutral-gray/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-neutral-light dark:bg-neutral-slate-700 border border-neutral-gray/20 dark:border-white/10 text-neutral-dark dark:text-neutral-200 flex items-center justify-center shadow-xs">
                    <Laptop className="w-5 h-5" />
                  </div>
                  {theme === "system" && <Check className="w-4 h-4 text-primary stroke-[3]" />}
                </div>
                <div>
                  <span className="text-sm font-bold text-neutral-dark dark:text-white block">System Default</span>
                  <span className="text-[11px] text-neutral-gray dark:text-neutral-400 block mt-0.5">Sync with operating system</span>
                </div>
              </button>
            </div>
          </Card>

          {/* Section 3: Password & Security */}
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 text-base font-bold text-neutral-dark dark:text-white border-b border-neutral-gray/10 dark:border-white/10 pb-3">
              <Shield className="w-5 h-5 text-primary" />
              Security & Credentials
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-neutral-dark dark:text-neutral-200 mb-1 font-mono uppercase tracking-wider">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3 text-sm rounded-standard border border-neutral-gray/30 dark:border-white/15 dark:bg-neutral-slate-900 dark:text-white focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-dark dark:text-neutral-200 mb-1 font-mono uppercase tracking-wider">
                  New Password (min 8 chars)
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-11 px-3 text-sm rounded-standard border border-neutral-gray/30 dark:border-white/15 dark:bg-neutral-slate-900 dark:text-white focus:border-primary focus:outline-none"
                />
              </div>

              <Button type="submit" variant="outline" size="sm">
                Update Password
              </Button>
            </form>
          </Card>

          {/* Section: Appearance & Theme */}
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 text-base font-bold text-neutral-dark dark:text-white border-b border-neutral-gray/10 dark:border-white/10 pb-3">
              <Sun className="w-5 h-5 text-gold" />
              Appearance & Theme
            </div>

            <div className="space-y-3">
              <p className="text-xs text-neutral-gray dark:text-neutral-400">
                Choose how Digital Heroes appears on your device. Choose between light mode, dark mode, or match your system settings automatically.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTheme("light");
                    toast({ type: "info", title: "Theme Set", description: "Light mode enabled" });
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-standard border transition-all text-center ${
                    theme === "light"
                      ? "border-primary bg-primary-light/50 dark:bg-primary/20 text-primary font-bold shadow-xs ring-2 ring-primary/20"
                      : "border-neutral-gray/20 dark:border-white/10 bg-white dark:bg-neutral-slate-800 text-neutral-dark dark:text-neutral-200 hover:bg-neutral-light dark:hover:bg-white/5"
                  }`}
                >
                  <Sun className="w-6 h-6 text-gold" />
                  <div>
                    <span className="text-sm font-semibold block">Light Mode</span>
                    <span className="text-[10px] text-neutral-gray dark:text-neutral-400 font-mono">Crisp & high contrast</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTheme("dark");
                    toast({ type: "info", title: "Theme Set", description: "Dark mode enabled" });
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-standard border transition-all text-center ${
                    theme === "dark"
                      ? "border-primary bg-primary-light/50 dark:bg-primary/20 text-primary font-bold shadow-xs ring-2 ring-primary/20"
                      : "border-neutral-gray/20 dark:border-white/10 bg-white dark:bg-neutral-slate-800 text-neutral-dark dark:text-neutral-200 hover:bg-neutral-light dark:hover:bg-white/5"
                  }`}
                >
                  <Moon className="w-6 h-6 text-primary" />
                  <div>
                    <span className="text-sm font-semibold block">Dark Mode</span>
                    <span className="text-[10px] text-neutral-gray dark:text-neutral-400 font-mono">Deep obsidian slate</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTheme("system");
                    toast({ type: "info", title: "Theme Set", description: "Matching system preferences" });
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-standard border transition-all text-center ${
                    theme === "system"
                      ? "border-primary bg-primary-light/50 dark:bg-primary/20 text-primary font-bold shadow-xs ring-2 ring-primary/20"
                      : "border-neutral-gray/20 dark:border-white/10 bg-white dark:bg-neutral-slate-800 text-neutral-dark dark:text-neutral-200 hover:bg-neutral-light dark:hover:bg-white/5"
                  }`}
                >
                  <Laptop className="w-6 h-6 text-neutral-dark dark:text-neutral-300" />
                  <div>
                    <span className="text-sm font-semibold block">System Default</span>
                    <span className="text-[10px] text-neutral-gray dark:text-neutral-400 font-mono">Sync with device OS</span>
                  </div>
                </button>
              </div>
            </div>
          </Card>

          {/* Section 4: Data & Danger Zone */}
          <Card className="p-6 sm:p-8 space-y-6 border border-red-200 dark:border-red-900/50 bg-red-50/10 dark:bg-red-950/10">
            <div className="flex items-center gap-2 text-base font-bold text-status-error border-b border-red-200/50 pb-3">
              <AlertTriangle className="w-5 h-5 text-status-error" />
              Data Privacy & Account Actions
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-neutral-dark block text-sm">Download Ledger Archive</span>
                <span className="text-neutral-gray">Export your complete golf rounds, winnings history, and donation records in JSON format.</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownloadData}>
                <Download className="w-4 h-4 mr-1.5" />
                Export Ledger
              </Button>
            </div>

            <div className="pt-4 border-t border-red-200/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-neutral-dark block text-sm">Sign Out of Session</span>
                <span className="text-neutral-gray">Log out of your active account session on this device.</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-neutral-dark hover:bg-neutral-light">
                <LogOut className="w-4 h-4 mr-1.5" />
                Sign Out
              </Button>
            </div>

            <div className="pt-4 border-t border-red-200/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-status-error block text-sm">Delete Account</span>
                <span className="text-neutral-gray">Permanently erase your account, logged scores, and subscription history.</span>
              </div>
              <Button variant="danger" size="sm" onClick={() => setDeleteModalOpen(true)}>
                Delete Account
              </Button>
            </div>
          </Card>

        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Account Deletion"
        description="This action is irreversible. All of your Stableford scores, prize tickets, and active subscriptions will be permanently purged."
      >
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              mockDb.deleteUser(currentUser?.id || "");
              toast({ type: "info", title: "Account Deleted" });
              setDeleteModalOpen(false);
              window.location.href = "/";
            }}
          >
            Yes, Permanently Delete
          </Button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
