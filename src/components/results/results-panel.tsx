"use client";

import * as React from "react";
import { useAuditStore } from "@/store/use-audit-store";
import { ResultsControls } from "./results-controls";
import { ResultsTable } from "./results-table";

export function ResultsPanel(): React.JSX.Element | null {
  const comparison = useAuditStore((s) => s.comparison);

  if (!comparison) {
    return null;
  }

  return (
    <section className="space-y-4">
      <ResultsControls />
      <ResultsTable />
    </section>
  );
}
