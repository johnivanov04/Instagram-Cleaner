"use client";

import * as React from "react";
import { ExtensionSyncBridge } from "@/components/extension-sync-bridge";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ResultsPanel } from "@/components/results/results-panel";
import { ToastViewport } from "@/components/ui/toast";
import { UploadPanel } from "@/components/upload/upload-panel";

export function AppShell(): React.JSX.Element {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-8">
      <ExtensionSyncBridge />
      <section className="rounded-2xl border border-emerald-300/60 bg-gradient-to-br from-emerald-100 via-lime-50 to-white p-6 shadow-sm dark:border-emerald-900/70 dark:from-emerald-950/60 dark:via-slate-950 dark:to-slate-950">
        <p className="inline-block rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          Privacy-first
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">IG Follow Audit</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-700 dark:text-slate-300 sm:text-base">
          Identify accounts you follow that do not follow you back, using only your Instagram data export.
          No scraping, no login automation, and no automatic unfollow actions.
        </p>

        <ol className="mt-5 grid gap-2 text-sm sm:grid-cols-2 xl:grid-cols-4">
          <li className="rounded-lg border border-slate-200 bg-white/90 p-3 dark:border-slate-800 dark:bg-slate-900/70">
            1. Export your Instagram data
          </li>
          <li className="rounded-lg border border-slate-200 bg-white/90 p-3 dark:border-slate-800 dark:bg-slate-900/70">
            2. Upload followers and following files
          </li>
          <li className="rounded-lg border border-slate-200 bg-white/90 p-3 dark:border-slate-800 dark:bg-slate-900/70">
            3. Review non-followers, mutuals, and fans
          </li>
          <li className="rounded-lg border border-slate-200 bg-white/90 p-3 dark:border-slate-800 dark:bg-slate-900/70">
            4. Open profiles manually on Instagram
          </li>
        </ol>
      </section>

      <main className="mt-6 space-y-6">
        <UploadPanel />
        <StatsCards />
        <ResultsPanel />
      </main>

      <ToastViewport />
    </div>
  );
}
