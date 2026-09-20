"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { ScoreForm } from "@/components/score-form";
import { mockDb } from "@/lib/mock-db";
import { GolfScore } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  Target,
  Trophy,
  Calendar,
  Sparkles,
  Edit2,
  Trash2,
  AlertTriangle,
  Info,
  CheckCircle2
} from "lucide-react";

export default function ScoresPage() {
  const { toast } = useToast();
  const [scores, setScores] = useState<GolfScore[]>([]);

  // Edit Modal State
  const [editingScore, setEditingScore] = useState<GolfScore | null>(null);
  const [editScoreVal, setEditScoreVal] = useState<number>(36);
  const [editDateVal, setEditDateVal] = useState<string>("");
  const [editCourseVal, setEditCourseVal] = useState<string>("");
  const [editError, setEditError] = useState<string | null>(null);

  // Delete Modal State
  const [deletingScoreId, setDeletingScoreId] = useState<string | null>(null);

  const loadScores = () => {
    setScores(mockDb.getUserScores());
  };

  useEffect(() => {
    loadScores();
  }, []);

  const bestScore = scores.length > 0 ? Math.max(...scores.map((s) => s.score)) : null;

  const handleOpenEdit = (score: GolfScore) => {
    setEditingScore(score);
    setEditScoreVal(score.score);
    setEditDateVal(score.score_date);
    setEditCourseVal(score.course_name || "");
    setEditError(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScore) return;

    const res = mockDb.updateScore(editingScore.id, editScoreVal, editDateVal, editCourseVal);
    if (!res.success) {
      setEditError(res.error || "Failed to update score.");
      return;
    }

    toast({
      type: "success",
      title: "Score Updated",
      description: `Round on ${editDateVal} updated to ${editScoreVal} pts.`,
    });
    setEditingScore(null);
    loadScores();
  };

  const handleConfirmDelete = () => {
    if (!deletingScoreId) return;
    mockDb.deleteScore(deletingScoreId);
    toast({
      type: "info",
      title: "Score Removed",
      description: "Round score successfully deleted.",
    });
    setDeletingScoreId(null);
    loadScores();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] transition-colors">
      <Navbar />

      <main className="flex-1 py-8 lg:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-gray/15 dark:border-white/10">
            <div>
              <span className="text-xs font-mono text-primary font-semibold uppercase tracking-wider block">
                Performance Tracking
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark dark:text-white tracking-tight">
                Stableford Score Management
              </h1>
              <p className="text-xs sm:text-sm text-neutral-gray dark:text-neutral-400 mt-1">
                Log your official 1–45 point rounds. Your 5 most recent scores are active for monthly cash prize draws.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="teal" size="md">
                {scores.length}/5 Scores Active
              </Badge>
            </div>
          </div>

          {/* Rolling 5 Engine Info Card */}
          <div className="p-4 rounded-card bg-primary-light/40 border border-primary/25 flex items-start gap-3 text-xs leading-relaxed text-neutral-dark">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-primary font-mono uppercase tracking-wider">
                Automated Rolling 5 Mechanism
              </span>
              Only your latest 5 rounds are stored and entered into the draw pool. Adding a new score when at capacity automatically retires your oldest round. Duplicate scores on the same date are disallowed to ensure verified integrity.
            </div>
          </div>

          {/* Score Input Card */}
          <Card className="p-6 sm:p-8 space-y-4 border-2 border-primary/20 shadow-md">
            <h2 className="text-lg font-bold text-neutral-dark flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Log New Stableford Round
            </h2>
            <ScoreForm onScoreAdded={loadScores} />
          </Card>

          {/* Score History Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-dark">
                Active Draw Scores (Last 5)
              </h2>
              <span className="text-xs font-mono text-neutral-gray">
                Reverse Chronological
              </span>
            </div>

            {scores.length === 0 ? (
              <Card className="p-12 text-center space-y-3">
                <Target className="w-12 h-12 text-neutral-gray/40 mx-auto" />
                <h3 className="text-base font-bold text-neutral-dark">No scores logged yet</h3>
                <p className="text-xs text-neutral-gray max-w-sm mx-auto">
                  Log your first weekend round above to activate your entry for the upcoming monthly draw!
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {scores.map((s, idx) => {
                  const isBest = s.score === bestScore;

                  return (
                    <div
                      key={s.id}
                      className={`p-4 sm:p-5 rounded-card border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isBest
                          ? "bg-gradient-to-r from-gold-light/40 via-white to-white dark:from-gold/15 dark:via-neutral-slate-800 dark:to-neutral-slate-800 border-gold/50 shadow-sm"
                          : "bg-white dark:bg-neutral-slate-800 border-neutral-gray/20 dark:border-white/10 hover:border-primary/40 dark:hover:border-primary/40 hover:shadow-xs"
                      }`}
                    >
                      {/* Left info */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold font-number text-lg shrink-0 ${
                            isBest
                              ? "bg-gold text-neutral-dark shadow-goldGlow"
                              : "bg-primary-light dark:bg-primary/20 text-primary dark:text-primary-light"
                          }`}
                        >
                          {s.score}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-neutral-dark dark:text-white">
                              {s.course_name || "Unspecified Course"}
                            </span>
                            {isBest && (
                              <Badge variant="gold" size="sm">
                                Best Round
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-neutral-gray dark:text-neutral-400 font-mono">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(s.score_date)}</span>
                            <span>•</span>
                            <span>Stableford Points</span>
                          </div>
                        </div>
                      </div>

                      {/* Right actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(s)}
                          className="h-8 px-2.5 text-xs text-neutral-gray hover:text-neutral-dark"
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingScoreId(s.id)}
                          className="h-8 px-2.5 text-xs text-status-error hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Edit Score Modal */}
      <Modal
        isOpen={Boolean(editingScore)}
        onClose={() => setEditingScore(null)}
        title="Edit Score Details"
        description="Update your Stableford points or played date."
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-neutral-dark mb-1 font-mono uppercase tracking-wider">
              Stableford Score (1 - 45)
            </label>
            <input
              type="number"
              min="1"
              max="45"
              required
              value={editScoreVal}
              onChange={(e) => setEditScoreVal(parseInt(e.target.value, 10))}
              className="w-full h-11 px-3 text-base font-bold font-mono rounded-standard border border-neutral-gray/30 focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-dark mb-1 font-mono uppercase tracking-wider">
              Round Date
            </label>
            <input
              type="date"
              max={new Date().toISOString().split("T")[0]}
              required
              value={editDateVal}
              onChange={(e) => setEditDateVal(e.target.value)}
              className="w-full h-11 px-3 text-sm rounded-standard border border-neutral-gray/30 focus:border-primary focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-dark mb-1 font-mono uppercase tracking-wider">
              Course Name
            </label>
            <input
              type="text"
              value={editCourseVal}
              onChange={(e) => setEditCourseVal(e.target.value)}
              className="w-full h-11 px-3 text-sm rounded-standard border border-neutral-gray/30 focus:border-primary focus:outline-none"
            />
          </div>

          {editError && (
            <div className="p-2.5 bg-red-50 text-status-error text-xs rounded-standard">
              {editError}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-gray/10">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditingScore(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingScoreId)}
        onClose={() => setDeletingScoreId(null)}
        title="Delete Round Score"
        description="Are you sure you want to delete this score? This action will remove it from your active 5-round draw ticket."
      >
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" size="sm" onClick={() => setDeletingScoreId(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleConfirmDelete}>
            Yes, Delete Score
          </Button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
