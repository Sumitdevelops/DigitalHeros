"use client";

import React, { useState, useRef } from "react";
import { Modal } from "./ui/modal";
import { Button } from "./ui/button";
import { useToast } from "./ui/toast";
import { mockDb } from "@/lib/mock-db";
import { UploadCloud, Image as ImageIcon, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";

interface ProofUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  winnerId: string;
  drawDate?: string;
  amountWon?: number;
  onProofSubmitted?: () => void;
}

export function ProofUploadModal({
  isOpen,
  onClose,
  winnerId,
  drawDate,
  amountWon,
  onProofSubmitted,
}: ProofUploadModalProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (file: File) => {
    setError(null);
    // Validate type
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setError("Please upload a valid JPG or PNG image file.");
      return;
    }
    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit. Please upload a smaller image.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) {
      setError("Please select a proof image first.");
      return;
    }

    setIsSubmitting(true);
    try {
      mockDb.uploadProof(winnerId, previewUrl);
      toast({
        type: "success",
        title: "Proof Uploaded Successfully",
        description: "Your official round scorecard was received. Platform administrators will verify it within 24 hours.",
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      onClose();
      if (onProofSubmitted) onProofSubmitted();
    } catch (err: any) {
      setError(err.message || "Failed to upload proof.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Proof of Winnings"
      description="Submit your verified platform scorecard (e.g. GHIN, Golf Genius, Club Score Sheet) to claim your prize."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {amountWon && (
          <div className="p-3 bg-gold-light border border-gold/30 dark:bg-gold/10 dark:border-gold/30 rounded-standard flex items-center justify-between text-xs">
            <span className="text-neutral-gray dark:text-neutral-400">Prize Pending Verification:</span>
            <span className="font-bold text-neutral-dark dark:text-white font-mono text-sm">${amountWon.toFixed(2)}</span>
          </div>
        )}

        {!previewUrl ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-standard p-8 text-center cursor-pointer transition-colors ${
              isDragOver
                ? "border-primary bg-primary-light/50 dark:bg-teal-950/40"
                : "border-neutral-gray/30 hover:border-primary hover:bg-neutral-light/50 dark:border-white/20 dark:hover:border-teal-400 dark:hover:bg-neutral-slate-700/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />
            <div className="w-12 h-12 rounded-full bg-primary-light dark:bg-teal-950/60 text-primary dark:text-teal-400 flex items-center justify-center mx-auto mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-neutral-dark dark:text-white mb-1">
              Click to upload or drag & drop scorecard
            </p>
            <p className="text-xs text-neutral-gray dark:text-neutral-400">
              Supports JPG, PNG (Max 5MB)
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative rounded-standard overflow-hidden border border-neutral-gray/30 dark:border-white/10 bg-neutral-light dark:bg-neutral-slate-900 max-h-64 flex items-center justify-center">
              <img src={previewUrl} alt="Scorecard Preview" className="w-full h-auto max-h-60 object-contain" />
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl(null);
                  setSelectedFile(null);
                }}
                className="absolute top-2 right-2 p-1.5 bg-neutral-dark/80 text-white rounded-md hover:bg-neutral-dark transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-status-success font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Scorecard image ready for submission</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-status-error dark:text-red-400 text-xs rounded-standard flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-gray/10 dark:border-white/10">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={!previewUrl}>
            Submit for Verification
          </Button>
        </div>
      </form>
    </Modal>
  );
}
