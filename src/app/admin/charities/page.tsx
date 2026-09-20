"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { mockDb } from "@/lib/mock-db";
import { Charity, CauseCategory } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Heart,
  PlusCircle,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  Calendar,
  Check
} from "lucide-react";

export default function AdminCharitiesPage() {
  const { toast } = useToast();
  const [charities, setCharities] = useState<Charity[]>([]);

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharity, setEditingCharity] = useState<Charity | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [category, setCategory] = useState<CauseCategory>("education");
  const [imageUrl, setImageUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [targetGoal, setTargetGoal] = useState<number>(100000);
  const [isFeatured, setIsFeatured] = useState(false);

  // Delete modal
  const [deletingCharityId, setDeletingCharityId] = useState<string | null>(null);

  const loadCharities = () => {
    setCharities(mockDb.getCharities());
  };

  useEffect(() => {
    loadCharities();
  }, []);

  const handleOpenAdd = () => {
    setEditingCharity(null);
    setName("");
    setDescription("");
    setWebsite("https://");
    setCategory("education");
    setImageUrl("https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1200&q=80");
    setLogoUrl("https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=200&q=80");
    setTargetGoal(100000);
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Charity) => {
    setEditingCharity(c);
    setName(c.name);
    setDescription(c.description);
    setWebsite(c.website);
    setCategory(c.cause_category);
    setImageUrl(c.image_url);
    setLogoUrl(c.logo_url);
    setTargetGoal(c.target_goal);
    setIsFeatured(c.is_featured);
    setIsModalOpen(true);
  };

  const handleSaveCharity = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCharity) {
      mockDb.updateCharity(editingCharity.id, {
        name,
        description,
        website,
        cause_category: category,
        image_url: imageUrl,
        logo_url: logoUrl,
        target_goal: targetGoal,
        is_featured: isFeatured,
      });
      toast({ type: "success", title: "Charity Updated" });
    } else {
      mockDb.createCharity({
        name,
        description,
        website,
        cause_category: category,
        image_url: imageUrl,
        logo_url: logoUrl,
        target_goal: targetGoal,
        is_featured: isFeatured,
        upcoming_events: [],
      });
      toast({ type: "success", title: "New Charity Created" });
    }
    setIsModalOpen(false);
    loadCharities();
  };

  const handleToggleFeatured = (c: Charity) => {
    mockDb.updateCharity(c.id, { is_featured: !c.is_featured });
    toast({
      type: "info",
      title: !c.is_featured ? "Added to Featured Spotlight" : "Removed from Featured",
    });
    loadCharities();
  };

  const handleConfirmDelete = () => {
    if (!deletingCharityId) return;
    mockDb.deleteCharity(deletingCharityId);
    toast({ type: "info", title: "Charity Removed" });
    setDeletingCharityId(null);
    loadCharities();
  };

  return (
    <div className="py-8 lg:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-gray/15">
        <div>
          <span className="text-xs font-mono text-charity uppercase tracking-wider font-bold block">
            Partner Network
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark tracking-tight">
            Charity & Cause Governance
          </h1>
        </div>

        <Button variant="charity" size="sm" onClick={handleOpenAdd}>
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Add New Charity
        </Button>
      </div>

      {/* Charities List */}
      <Card className="p-0 overflow-hidden border border-neutral-gray/20 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-light border-b border-neutral-gray/15 text-neutral-gray font-mono uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Charity</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">YTD Contributions</th>
                <th className="py-3.5 px-4 font-semibold">Target Goal</th>
                <th className="py-3.5 px-4 font-semibold">Featured</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-gray/10 bg-white">
              {charities.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-light/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={c.logo_url} alt="" className="w-10 h-10 rounded-lg object-cover border border-neutral-gray/20" />
                      <div>
                        <div className="font-bold text-sm text-neutral-dark">{c.name}</div>
                        <a
                          href={c.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-primary hover:underline font-mono inline-flex items-center gap-1"
                        >
                          {c.website} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="charity" size="sm">
                      {c.cause_category}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-charity text-sm">
                    {formatCurrency(c.ytd_contribution)}
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-gray">
                    {formatCurrency(c.target_goal)}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleFeatured(c)}
                      className={`p-1.5 rounded-full transition-colors ${
                        c.is_featured ? "text-gold bg-gold-light" : "text-neutral-gray hover:text-gold"
                      }`}
                      title="Toggle Homepage Spotlight"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-neutral-gray hover:text-primary hover:bg-neutral-light rounded"
                        title="Edit Charity"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingCharityId(c.id)}
                        className="p-1.5 text-neutral-gray hover:text-status-error hover:bg-red-50 rounded"
                        title="Delete Charity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Charity Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCharity ? "Edit Charity Details" : "Register New Charity"}
        description="Configure non-profit details, cause category, and target philanthropic milestone."
      >
        <form onSubmit={handleSaveCharity} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-neutral-dark mb-1 font-mono uppercase tracking-wider">
              Organization Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-3 text-sm rounded-standard border border-neutral-gray/30 focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-dark mb-1 font-mono uppercase tracking-wider">
              Cause Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CauseCategory)}
              className="w-full h-11 px-3 text-xs rounded-standard border border-neutral-gray/30 bg-white"
            >
              <option value="education">Education & Youth</option>
              <option value="veterans">Veterans Adaptive Golf</option>
              <option value="poverty">Poverty & Public Access</option>
              <option value="environment">Environment & Wetlands</option>
              <option value="health">Children Health</option>
              <option value="other">Other Initiative</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-dark mb-1 font-mono uppercase tracking-wider">
              Mission Statement & Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs rounded-standard border border-neutral-gray/30 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-dark mb-1 font-mono uppercase tracking-wider">
                Website URL
              </label>
              <input
                type="url"
                required
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full h-11 px-3 text-xs rounded-standard border border-neutral-gray/30 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-dark mb-1 font-mono uppercase tracking-wider">
                Target Funding Goal ($)
              </label>
              <input
                type="number"
                required
                value={targetGoal}
                onChange={(e) => setTargetGoal(parseFloat(e.target.value))}
                className="w-full h-11 px-3 text-xs rounded-standard border border-neutral-gray/30 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-dark mb-1 font-mono uppercase tracking-wider">
                Hero Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full h-11 px-3 text-xs rounded-standard border border-neutral-gray/30 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-dark mb-1 font-mono uppercase tracking-wider">
                Logo Image URL
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full h-11 px-3 text-xs rounded-standard border border-neutral-gray/30 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-gray/30 text-charity focus:ring-charity"
            />
            <label htmlFor="isFeatured" className="text-xs font-semibold text-neutral-dark">
              Feature this charity on platform homepage spotlight
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-gray/10">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="charity" size="sm">
              Save Charity
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingCharityId)}
        onClose={() => setDeletingCharityId(null)}
        title="Delete Charity"
        description="Are you sure you want to remove this charity? Existing subscriber allocations will be maintained."
      >
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" size="sm" onClick={() => setDeletingCharityId(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleConfirmDelete}>
            Delete Charity
          </Button>
        </div>
      </Modal>

    </div>
  );
}
