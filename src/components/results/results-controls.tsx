"use client";

import * as React from "react";
import { ArrowUpDown, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { selectedUsernames, useAuditStore, useVisibleRows } from "@/store/use-audit-store";
import type { ResultFilter } from "@/types/instagram";

const FILTERS: { key: ResultFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "not-following-back", label: "Not Following Back" },
  { key: "mutuals", label: "Mutuals" },
  { key: "fans", label: "Fans" },
  { key: "completed", label: "Completed" },
  { key: "selected", label: "Selected" },
];

function exportCsv(usernames: string[]): void {
  const csv = ["username", ...usernames].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ig-follow-audit-selected.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function ResultsControls(): React.JSX.Element {
  const { allRows, visibleRows } = useVisibleRows();
  const filter = useAuditStore((s) => s.filter);
  const setFilter = useAuditStore((s) => s.setFilter);
  const search = useAuditStore((s) => s.search);
  const setSearch = useAuditStore((s) => s.setSearch);
  const toggleSort = useAuditStore((s) => s.toggleSort);
  const setVisibleSelected = useAuditStore((s) => s.setVisibleSelected);
  const clearSelection = useAuditStore((s) => s.clearSelection);
  const clearAllData = useAuditStore((s) => s.clearAllData);
  const { toast } = useToast();

  const selected = selectedUsernames(allRows);

  return (
    <section className="space-y-4 rounded-2xl border border-amber-200/80 bg-white/60 p-4 shadow-[0_10px_24px_rgba(96,67,43,0.08)] dark:border-stone-700 dark:bg-stone-900/45">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <Input
          placeholder="Search username"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="xl:max-w-sm"
        />

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={toggleSort}>
            <ArrowUpDown className="h-4 w-4" /> Sort by username
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (selected.length === 0) {
                toast({ kind: "error", title: "No selected rows" });
                return;
              }
              exportCsv(selected);
              toast({ kind: "success", title: "CSV exported", description: `${selected.length} usernames exported.` });
            }}
          >
            <Download className="h-4 w-4" /> Export selected CSV
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              clearAllData();
              toast({ kind: "info", title: "All data cleared" });
            }}
          >
            <Trash2 className="h-4 w-4" /> Clear all data
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <Button
            key={item.key}
            variant={filter === item.key ? "default" : "ghost"}
            size="sm"
            className={filter === item.key ? "shadow-[0_8px_18px_rgba(33,24,17,0.14)]" : "border border-amber-200/80 bg-white/70 dark:border-stone-600 dark:bg-stone-800/45"}
            onClick={() => setFilter(item.key)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={() => setVisibleSelected(visibleRows, true)}>
          Select all visible
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setVisibleSelected(visibleRows, false)}>
          Clear visible selection
        </Button>
        <Button size="sm" variant="secondary" onClick={clearSelection}>
          Clear all selection
        </Button>
      </div>
    </section>
  );
}
