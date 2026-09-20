"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { mockDb } from "@/lib/mock-db";
import { Target, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must contain at least one uppercase letter and one number.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!termsAccepted) {
      setError("You must accept the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          fullName: fullName.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to create account.");
        return;
      }

      // Sync registered user into client mockDb session
      mockDb.syncUser(data.user);
      mockDb.setCurrentUser(data.user.id);

      toast({
        type: "success",
        title: "Account Created!",
        description: `Welcome to Digital Heroes, ${data.user.full_name}! Let's select your cause.`,
      });
      // Seamless redirect to Onboarding Step 1
      router.push("/onboarding/charity-selection");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] transition-colors">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12 sm:py-16">
        <div className="w-full max-w-md space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white mx-auto shadow-sm">
              <Target className="w-6 h-6 text-gold" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark dark:text-white tracking-tight">
              Create Your Player Account
            </h1>
            <p className="text-xs sm:text-sm text-neutral-gray dark:text-neutral-400">
              Join thousands of golfers turning weekend scores into real charitable impact and monthly cash draws.
            </p>
          </div>

          <Card className="p-6 sm:p-8 shadow-xl border-neutral-gray/20 dark:border-white/10">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-dark dark:text-neutral-200 mb-1 font-mono uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Palmer"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 px-3 text-sm rounded-standard border border-neutral-gray/30 dark:border-white/15 dark:bg-neutral-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-neutral-dark dark:text-neutral-200 mb-1 font-mono uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="golfer@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3 text-sm rounded-standard border border-neutral-gray/30 dark:border-white/15 dark:bg-neutral-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none font-mono"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-neutral-dark dark:text-neutral-200 mb-1 font-mono uppercase tracking-wider">
                  Password (min 8 chars, 1 uppercase, 1 number)
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3 text-sm rounded-standard border border-neutral-gray/30 dark:border-white/15 dark:bg-neutral-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-neutral-dark dark:text-neutral-200 mb-1 font-mono uppercase tracking-wider">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 px-3 text-sm rounded-standard border border-neutral-gray/30 dark:border-white/15 dark:bg-neutral-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-neutral-gray/30 dark:border-white/15 text-primary focus:ring-primary"
                />
                <label htmlFor="terms" className="text-xs text-neutral-gray dark:text-neutral-400 leading-relaxed">
                  I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 text-status-error text-xs rounded-standard flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full shadow-tealGlow">
                Create Account & Select Cause
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-neutral-gray/15 text-center">
              <p className="text-xs text-neutral-gray">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary font-bold hover:underline">
                  Log in here
                </Link>
              </p>
            </div>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  );
}
