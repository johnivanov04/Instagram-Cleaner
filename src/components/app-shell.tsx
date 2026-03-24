"use client";

import * as React from "react";
import Link from "next/link";
import { ExtensionSyncBridge } from "@/components/extension-sync-bridge";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ResultsPanel } from "@/components/results/results-panel";
import { ToastViewport } from "@/components/ui/toast";
import { UploadPanel } from "@/components/upload/upload-panel";

export function AppShell(): React.JSX.Element {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
      <ExtensionSyncBridge />
      <section className="rounded-3xl border border-amber-200/70 bg-[linear-gradient(125deg,rgba(255,251,245,0.98),rgba(245,231,213,0.88))] p-6 shadow-[0_16px_50px_rgba(92,65,40,0.12)] dark:border-amber-900/50 dark:bg-[linear-gradient(125deg,rgba(54,39,30,0.92),rgba(34,24,18,0.96))]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="inline-flex rounded-full border border-amber-300 bg-amber-100/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-900 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-100">
              Private local workflow
            </p>
            <h1 className="mt-3 text-4xl leading-tight text-stone-900 sm:text-5xl dark:text-amber-50">IG Follow Audit</h1>
            <p className="mt-2 max-w-3xl text-sm text-stone-700 sm:text-base dark:text-amber-100/85">
              Cleanly review who to keep or unfollow from your export files, then complete actions manually on Instagram.
            </p>
          </div>

          <div className="grid gap-2 text-sm text-stone-700 dark:text-amber-100/90">
            <p className="rounded-xl border border-amber-200/80 bg-white/70 px-3 py-2 dark:border-amber-800/80 dark:bg-stone-900/40">1. Upload followers + following exports</p>
            <p className="rounded-xl border border-amber-200/80 bg-white/70 px-3 py-2 dark:border-amber-800/80 dark:bg-stone-900/40">2. Mark unfollow targets and completed actions</p>
            <p className="rounded-xl border border-amber-200/80 bg-white/70 px-3 py-2 dark:border-amber-800/80 dark:bg-stone-900/40">3. Sync progress with extension sidebar</p>
          </div>
        </div>
      </section>

      <main className="mt-6 space-y-6">
        <UploadPanel />
        <StatsCards />
        <ResultsPanel />
      </main>

      <footer className="mt-8 rounded-2xl border border-amber-200/70 bg-white/70 px-4 py-3 text-xs text-stone-700 dark:border-amber-900/40 dark:bg-stone-900/40 dark:text-amber-100/85">
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link className="underline decoration-amber-400 underline-offset-2" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="underline decoration-amber-400 underline-offset-2" href="/terms">
            Terms of Use
          </Link>
          <Link className="underline decoration-amber-400 underline-offset-2" href="/support">
            Support
          </Link>
          <Link className="underline decoration-amber-400 underline-offset-2" href="/how-to">
            How to Use
          </Link>
        </nav>
      </footer>

      <ToastViewport />
    </div>
  );
}
