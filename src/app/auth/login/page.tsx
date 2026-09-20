"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { mockDb } from "@/lib/mock-db";
import { Target, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = data.error || "Failed to log in.";
        setError(errorMsg);
        toast({
          type: "error",
          title: res.status === 404 ? "Email Not Registered" : "Authentication Failed",
          description: errorMsg,
        });
        return;
      }

      // Supabase verified! Sync session
      mockDb.syncUser(data.user);
      mockDb.setCurrentUser(data.user.id);

      toast({
        type: "success",
        title: `Welcome back, ${data.user.full_name}!`,
        description: "Logged in successfully.",
      });

      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotModalOpen(false);
    toast({
      type: "info",
      title: "Password Reset Link Sent",
      description: `If an account exists for ${resetEmail}, a 1-hour secure reset token has been dispatched.`,
    });
    setResetEmail("");
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
              Sign In to Digital Heroes
            </h1>
            <p className="text-xs sm:text-sm text-neutral-gray dark:text-neutral-400">
              Access your golf scores, upcoming draw tickets, and philanthropic ledger.
            </p>
          </div>

          <Card className="p-6 sm:p-8 shadow-xl border-neutral-gray/20 dark:border-white/10">
            <form onSubmit={handleLogin} className="space-y-4">
              
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
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-neutral-dark dark:text-neutral-200 font-mono uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3 text-sm rounded-standard border border-neutral-gray/30 dark:border-white/15 dark:bg-neutral-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 text-status-error text-xs rounded-standard flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full shadow-tealGlow">
                Log In
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-neutral-gray">
                Don't have an account yet?{" "}
                <Link href="/auth/signup" className="text-primary font-bold hover:underline">
                  Sign up here
                </Link>
              </p>
            </div>
          </Card>

        </div>
      </main>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Password"
        description="Enter your email address and we'll send you a password recovery link."
      >
        <form onSubmit={handleForgotSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-neutral-dark mb-1 font-mono uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="golfer@domain.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full h-11 px-3 text-sm rounded-standard border border-neutral-gray/30 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none font-mono"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setForgotModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Send Reset Link
            </Button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
}
