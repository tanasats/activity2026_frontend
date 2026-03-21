'use client';

import React from 'react';
import { X, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // warning, success, info
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-modal-in relative z-10 glass">
        <div className="p-8">
          {/* Header Icon */}
          <div className="flex justify-center mb-6">
            <div className={cn(
              "w-20 h-20 rounded-xl flex items-center justify-center transition-all",
              type === 'warning' && "bg-amber-500/10 text-amber-500 shadow-lg shadow-amber-500/10",
              type === 'danger' && "bg-red-500/10 text-red-500 shadow-lg shadow-red-500/10",
              type === 'success' && "bg-emerald-500/10 text-emerald-500 shadow-lg shadow-emerald-500/10",
              type === 'info' && "bg-primary/10 text-primary shadow-lg shadow-primary/10"
            )}>
              {type === 'warning' && <AlertTriangle size={40} className="animate-pulse" />}
              {type === 'danger' && <AlertTriangle size={40} className="animate-pulse text-red-500" />}
              {type === 'success' && <ShieldCheck size={40} />}
              {type === 'info' && <HelpCircle size={40} />}
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-black text-foreground uppercase tracking-widest italic">{title}</h3>
            <p className="text-muted-foreground px-4">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col gap-3">
            <Button
              variant={type === 'danger' || type === 'warning' ? 'danger' : 'primary'}
              className="w-full py-5 rounded-2xl bg-red-500 text-white"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Processing..." : confirmText}
            </Button>
            <button
              onClick={onClose}
              className="w-full bg-slate-300 py-4 rounded-2xl text-muted-foreground  hover:text-foreground transition-all"
              disabled={loading}
            >
              {cancelText}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
