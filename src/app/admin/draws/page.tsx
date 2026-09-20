"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { DrawBall } from "@/components/draw-ball";
import { PrizePoolTierBar } from "@/components/charts/simple-charts";
import { useToast } from "@/components/ui/toast";
import { mockDb } from "@/lib/mock-db";
import { Draw, DrawType, SimulationResults } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Trophy,
  Play,
  Eye,
  PlusCircle,
  Calendar,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

export default function AdminDrawsPage() {
  const { toast } = useToast();
  const [draws, setDraws] = useState<Draw[]>([]);
  const [selectedDraw, setSelectedDraw] = useState<Draw | null>(null);

  // Simulation State
  const [simulation, setSimulation] = useState<SimulationResults | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  // New Draw Modal
  const [newDrawModalOpen, setNewDrawModalOpen] = useState(false);
  const [newDate, setNewDate] = useState("2026-04-30");
  const [newType, setNewType] = useState<DrawType>("random");

  const loadDraws = () => {
    const list = mockDb.getDraws();
    setDraws(list);
    const scheduled = list.find((d) => d.status === "scheduled") || list[0];
    setSelectedDraw(scheduled);
  };

  useEffect(() => {
    loadDraws();
  }, []);

  const handleSimulate = (customType?: DrawType) => {
    if (!selectedDraw) return;
    setIsSimulating(true);

    setTimeout(() => {
      const sim = mockDb.simulateDraw(selectedDraw.id, customType || selectedDraw.draw_type);
      setSimulation(sim);
      setIsSimulating(false);
      toast({
        type: "info",
        title: "Simulation Executed (Dry-Run)",
        description: `Generated 5 numbers. Evaluated against ${sim.total_eligible_subscribers} active subscriber rounds.`,
      });
    }, 400);
  };

  const handlePublishDraw = () => {
    if (!selectedDraw || !simulation) return;

    try {
      mockDb.publishDraw(selectedDraw.id, simulation);
      toast({
        type: "success",
        title: "Draw Published Successfully!",
        description: `Official results recorded. Winners automatically registered in payout queue.`,
      });
      setPublishModalOpen(false);
      setSimulation(null);
      loadDraws();
    } catch (err: any) {
      toast({
        type: "error",
        title: "Publish Failed",
        description: err.message,
      });
    }
  };

  const handleCreateDraw = (e: React.FormEvent) => {
    e.preventDefault();
    const created = mockDb.createDraw({
      draw_date: newDate,
      draw_type: newType,
    });
    toast({
      type: "success",
      title: "New Draw Scheduled",
      description: `Draw for ${formatDate(created.draw_date)} created.`,
    });
    setNewDrawModalOpen(false);
    loadDraws();
  };

  return (
    <div className="py-8 lg:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-gray/15">
        <div>
          <span className="text-xs font-mono text-charity uppercase tracking-wider font-bold block">
            Draw Mechanics Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark tracking-tight">
            Draw Configuration & Simulator
          </h1>
        </div>

        <Button variant="primary" size="sm" onClick={() => setNewDrawModalOpen(true)}>
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Schedule New Draw
        </Button>
      </div>

      {/* ACTIVE TARGET DRAW & SIMULATION CONTROL PANEL */}
      {selectedDraw && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Target Draw Configuration (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 space-y-5 border-2 border-primary/25">
              <div className="flex items-center justify-between border-b border-neutral-gray/10 pb-3">
                <span className="text-xs font-mono text-neutral-gray uppercase tracking-wider font-bold">
                  Target Draw Configuration
                </span>
                <Badge variant={selectedDraw.status === "scheduled" ? "warning" : "success"} size="sm">
                  {selectedDraw.status}
                </Badge>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-gray">Draw Date:</span>
                  <span className="font-bold text-neutral-dark">{formatDate(selectedDraw.draw_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-gray">Draw Algorithm:</span>
                  <span className="font-bold text-primary capitalize">{selectedDraw.draw_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-gray">Eligible Subscribers:</span>
                  <span className="font-bold text-neutral-dark">{selectedDraw.active_subscriber_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-gray">Rollover Jackpot from Prev:</span>
                  <span className="font-bold text-gold-dark">{formatCurrency(selectedDraw.rollover_amount)}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-gray/10 pt-2 text-sm">
                  <span className="text-neutral-gray">Total Prize Pool:</span>
                  <span className="font-bold text-neutral-dark font-number">{formatCurrency(selectedDraw.total_pool)}</span>
                </div>
              </div>

              {/* Simulation Triggers */}
              <div className="pt-2 space-y-2">
                <Button
                  variant="gold"
                  size="md"
                  onClick={() => handleSimulate()}
                  isLoading={isSimulating}
                  className="w-full text-neutral-dark font-bold shadow-goldGlow"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Preview Dry-Run Simulation
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSimulate("random")}
                    className="text-xs"
                  >
                    Simulate Random
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSimulate("algorithmic")}
                    className="text-xs"
                  >
                    Simulate Algorithmic
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel: Dry-Run Simulation Results (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {!simulation ? (
              <Card className="p-12 text-center space-y-3 bg-neutral-light/40 border border-dashed border-neutral-gray/30">
                <Trophy className="w-12 h-12 text-neutral-gray/40 mx-auto" />
                <h3 className="text-base font-bold text-neutral-dark">No Active Simulation</h3>
                <p className="text-xs text-neutral-gray max-w-md mx-auto">
                  Click <strong>"Preview Dry-Run Simulation"</strong> on the left to evaluate 5 drawn numbers against all active subscribers' rounds without saving to the database.
                </p>
              </Card>
            ) : (
              <Card className="p-6 sm:p-8 space-y-6 border-2 border-gold/40 bg-gradient-to-br from-white via-white to-gold-light/20 shadow-md">
                <div className="flex items-center justify-between border-b border-neutral-gray/10 pb-3">
                  <div>
                    <span className="text-xs font-mono text-gold-dark font-bold uppercase tracking-wider block">
                      Dry-Run Simulation Results ({simulation.draw_type})
                    </span>
                    <span className="text-xs text-neutral-gray font-mono">
                      Evaluated across {simulation.total_eligible_subscribers} active score sets
                    </span>
                  </div>
                  <Badge variant="gold" size="sm">PREVIEW ONLY</Badge>
                </div>

                {/* Simulated Numbers */}
                <div className="space-y-2 text-center">
                  <span className="text-xs font-mono text-neutral-gray uppercase tracking-wider">
                    Simulated Drawn Numbers
                  </span>
                  <div className="flex items-center justify-center gap-3 py-1">
                    {simulation.drawn_numbers.map((num, i) => (
                      <DrawBall key={i} number={num} isMatched={true} size="md" />
                    ))}
                  </div>
                </div>

                {/* Simulated Winner Hits */}
                <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 bg-white rounded-standard border border-neutral-gray/20 shadow-xs">
                    <span className="text-neutral-gray block">5-Match Winners</span>
                    <span className="font-bold text-neutral-dark text-base block mt-0.5">
                      {simulation.tier_5_winners.length}
                    </span>
                    <span className="text-gold-dark text-[11px] block">
                      {formatCurrency(simulation.prize_per_tier_5)} each
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-standard border border-neutral-gray/20 shadow-xs">
                    <span className="text-neutral-gray block">4-Match Winners</span>
                    <span className="font-bold text-neutral-dark text-base block mt-0.5">
                      {simulation.tier_4_winners.length}
                    </span>
                    <span className="text-primary text-[11px] block">
                      {formatCurrency(simulation.prize_per_tier_4)} each
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-standard border border-neutral-gray/20 shadow-xs">
                    <span className="text-neutral-gray block">3-Match Winners</span>
                    <span className="font-bold text-neutral-dark text-base block mt-0.5">
                      {simulation.tier_3_winners.length}
                    </span>
                    <span className="text-charity text-[11px] block">
                      {formatCurrency(simulation.prize_per_tier_3)} each
                    </span>
                  </div>
                </div>

                {/* Rollover notice if 0 5-match */}
                {simulation.tier_5_winners.length === 0 && (
                  <div className="p-3 rounded-standard bg-gold-light/60 border border-gold/40 text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-dark shrink-0" />
                    <span>
                      0 winners in Tier 1: <strong>{formatCurrency(simulation.next_rollover)}</strong> will automatically rollover to next month's jackpot.
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-gray/10">
                  <Button variant="outline" size="sm" onClick={() => handleSimulate()}>
                    <RefreshCw className="w-3.5 h-3.5 mr-1" /> Re-roll Simulation
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setPublishModalOpen(true)}
                    className="shadow-tealGlow font-bold"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Publish & Run Draw
                  </Button>
                </div>
              </Card>
            )}
          </div>

        </div>
      )}

      {/* SCHEDULED & PAST DRAWS LIST */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-neutral-dark">All Platform Draws</h2>

        <Card className="p-0 overflow-hidden border border-neutral-gray/20 shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-light border-b border-neutral-gray/15 text-neutral-gray font-mono uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Draw Date</th>
                <th className="py-3.5 px-4 font-semibold">Algorithm</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Prize Pool</th>
                <th className="py-3.5 px-4 font-semibold">Drawn Numbers</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-gray/10 bg-white">
              {draws.map((d) => (
                <tr key={d.id} className="hover:bg-neutral-light/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-neutral-dark">
                    {formatDate(d.draw_date)}
                  </td>
                  <td className="py-3 px-4 font-mono capitalize text-neutral-gray">
                    {d.draw_type}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={d.status === "completed" ? "success" : "warning"} size="sm">
                      {d.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-neutral-dark">
                    {formatCurrency(d.total_pool)}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {d.drawn_numbers ? (
                      <span className="text-primary font-bold">
                        [{d.drawn_numbers.join(", ")}]
                      </span>
                    ) : (
                      <span className="text-neutral-gray italic">Awaiting Draw</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDraw(d);
                          setSimulation(null);
                        }}
                        className="text-xs"
                      >
                        Select
                      </Button>
                      {d.status === "completed" && (
                        <Link href={`/draws/${d.id}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            View Results
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Publish Confirmation Modal */}
      <Modal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        title="Confirm Draw Publication"
        description="Publishing this draw will commit the drawn numbers, record winners in the database, and make results instantly visible to all subscribers. Are you sure you want to proceed?"
      >
        <div className="p-3 bg-gold-light rounded-standard border border-gold/30 text-xs font-mono mb-4">
          Drawn Numbers: [{simulation?.drawn_numbers.join(", ")}]
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-neutral-gray/10">
          <Button variant="outline" size="sm" onClick={() => setPublishModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handlePublishDraw}>
            Confirm & Publish Results
          </Button>
        </div>
      </Modal>

      {/* Schedule New Draw Modal */}
      <Modal
        isOpen={newDrawModalOpen}
        onClose={() => setNewDrawModalOpen(false)}
        title="Schedule New Draw Event"
        description="Configure date and draw algorithm for the next monthly draw."
      >
        <form onSubmit={handleCreateDraw} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-neutral-dark mb-1 font-mono uppercase tracking-wider">
              Draw Date
            </label>
            <input
              type="date"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full h-11 px-3 text-sm rounded-standard border border-neutral-gray/30 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-dark mb-1 font-mono uppercase tracking-wider">
              Draw Algorithm
            </label>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-2 p-3 border rounded-standard cursor-pointer hover:bg-neutral-light">
                <input
                  type="radio"
                  name="type"
                  checked={newType === "random"}
                  onChange={() => setNewType("random")}
                />
                <span className="text-xs font-semibold text-neutral-dark">Random Draw</span>
              </label>

              <label className="flex items-center gap-2 p-3 border rounded-standard cursor-pointer hover:bg-neutral-light">
                <input
                  type="radio"
                  name="type"
                  checked={newType === "algorithmic"}
                  onChange={() => setNewType("algorithmic")}
                />
                <span className="text-xs font-semibold text-neutral-dark">Algorithmic Weighted</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-gray/10">
            <Button type="button" variant="outline" size="sm" onClick={() => setNewDrawModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Schedule Draw
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
