"use client";

import * as React from "react";
import { create } from "zustand";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  title: string;
  description?: string;
  kind: ToastKind;
}

interface ToastStore {
  toasts: ToastMessage[];
  pushToast: (toast: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: number) => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  pushToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Date.now() + Math.floor(Math.random() * 1000) }],
    })),
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function useToast(): { toast: (toast: Omit<ToastMessage, "id">) => void } {
  const pushToast = useToastStore((s) => s.pushToast);

  return {
    toast: pushToast,
  };
}

export function ToastViewport(): React.JSX.Element {
  const toasts = useToastStore((s) => s.toasts);
  const dismissToast = useToastStore((s) => s.dismissToast);

  React.useEffect(() => {
    if (toasts.length === 0) {
      return;
    }

    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        dismissToast(toast.id);
      }, 2600),
    );

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [toasts, dismissToast]);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(92vw,24rem)] flex-col gap-2">
      {toasts.map((toast) => (
        <Card
          key={toast.id}
          className={cn(
            "pointer-events-auto border-l-4 px-4 py-3",
            toast.kind === "success" && "border-l-emerald-500",
            toast.kind === "error" && "border-l-rose-500",
            toast.kind === "info" && "border-l-sky-500",
          )}
        >
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.description ? (
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{toast.description}</p>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
