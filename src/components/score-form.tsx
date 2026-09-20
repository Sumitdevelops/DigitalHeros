"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/toast";
import { mockDb } from "@/lib/mock-db";
import { Calendar, Check, AlertCircle, Sparkles } from "lucide-react";

interface ScoreFormProps {
  onScoreAdded?: () => void;
  compact?: boolean;
}

export function ScoreForm({ onScoreAdded, compact = false }: ScoreFormProps) {
  const { toast } = useToast();
  const todayStr = new Date().toISOString().split("T")[0];

  const [score, setScore] = useState<string>("");
  const [scoreDate, setScoreDate] = useState<string>(todayStr);
  const [courseName, setCourseName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScoreChange = (val: string) => {
    setError(null);
    setScore(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      if (num < 1 || num > 45) {
        setError("Stableford score must be between 1 and 45.");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(score, 10);
    if (isNaN(num) || num < 1 || num > 45) {
      setError("Please enter a valid Stableford score (1 - 45).");
      return;
    }
    if (!scoreDate) {
      setError("Please select a valid date for this round.");
      return;
    }
    if (scoreDate > todayStr) {
      setError("Score date cannot be in the future.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = mockDb.addScore(num, scoreDate, courseName.trim());
      if (!res.success) {
        setError(res.error || "Failed to log score.");
        toast({
          type: "error",
          title: "Score Entry Failed",
          description: res.error,
        });
      } else {
        toast({
          type: "success",
          title: "Round Logged Successfully!",
          description: `Score of ${num} pts on ${scoreDate} saved. Your 5 most recent scores are active for monthly draws.`,
        });
        setScore("");
        setCourseName("");
        setError(null);
        if (onScoreAdded) onScoreAdded();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={compact ? "space-y-3" : "grid grid-cols-1 sm:grid-cols-3 gap-4"}>
        
        {/* Score Input */}
        <div>
          <label className="block text-xs font-bold text-neutral-dark mb-1 font-mono uppercase tracking-wider">
            Stableford Score (1-45) *
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="45"
              required
              placeholder="e.g. 38"
              value={score}
              onChange={(e) => handleScoreChange(e.target.value)}
              className={`w-full h-11 px-4 text-lg font-bold font-mono rounded-standard border bg-white focus:outline-none transition-all ${
                error
                  ? "border-status-error ring-2 ring-status-error/20"
                  : "border-neutral-gray/30 focus:border-primary focus:ring-2 focus:ring-primary/20"
              }`}
            />
            {parseInt(score, 10) >= 36 && (
              <span className="absolute right-3 top-2.5 text-xs text-gold-dark font-medium bg-gold-light px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3" /> Great
              </span>
            )}
          </div>
        </div>

        {/* Date Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-neutral-dark font-mono uppercase tracking-wider">
              Round Date *
            </label>
            <button
              type="button"
              onClick={() => {
                setScoreDate(todayStr);
                setError(null);
              }}
              className="text-[11px] text-primary hover:underline font-mono"
            >
              Today
            </button>
          </div>
          <input
            type="date"
            max={todayStr}
            required
            value={scoreDate}
            onChange={(e) => {
              setError(null);
              setScoreDate(e.target.value);
            }}
            className="w-full h-11 px-3 text-sm rounded-standard border border-neutral-gray/30 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono"
          />
        </div>

        {/* Course Name */}
        <div>
          <label className="block text-xs font-bold text-neutral-dark mb-1 font-mono uppercase tracking-wider">
            Golf Course (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Torrey Pines South"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full h-11 px-3 text-sm rounded-standard border border-neutral-gray/30 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-2.5 bg-red-50 text-status-error rounded-standard text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button & Rolling 5 Rule Explainer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <p className="text-[11px] text-neutral-gray">
          Only your <span className="font-semibold text-neutral-dark">5 most recent scores</span> are kept active. Adding a 6th automatically retires your oldest round.
        </p>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="w-full sm:w-auto shrink-0"
        >
          <Check className="w-4 h-4 mr-1.5" />
          Log Score
        </Button>
      </div>
    </form>
  );
}
