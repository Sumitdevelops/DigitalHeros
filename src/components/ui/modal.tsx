"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  maxWidth = "max-w-lg",
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-dark/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div
        className={cn(
          "relative z-10 w-full bg-white dark:bg-neutral-slate-800 rounded-modal p-6 sm:p-8 shadow-2xl border border-neutral-gray/20 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200 text-neutral-dark dark:text-neutral-100",
          maxWidth,
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-md text-neutral-gray dark:text-neutral-400 hover:text-neutral-dark dark:hover:text-white hover:bg-neutral-light dark:hover:bg-white/10 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {title && (
          <div className="mb-4 pr-6">
            <h2 className="text-xl font-bold text-neutral-dark dark:text-white">{title}</h2>
            {description && <p className="mt-1 text-sm text-neutral-gray dark:text-neutral-400">{description}</p>}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
}
