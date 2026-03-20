"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildAuditRows } from "@/lib/instagram/audit";
import { useAuditStore } from "@/store/use-audit-store";

interface ItemProps {
  label: string;
  value: number | string;
}

function Item({ label, value }: ItemProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-slate-600 dark:text-slate-300">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold tracking-tight">{value.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}

export function StatsCards(): React.JSX.Element | null {
  const comparison = useAuditStore((s) => s.comparison);
  const reviewState = useAuditStore((s) => s.reviewState);

  if (!comparison) {
    return null;
  }

  const rows = buildAuditRows(comparison, reviewState);
  const pendingCount = rows.filter((row) => row.status === "unfollow").length;
  const completedCount = rows.filter((row) => row.status === "completed").length;
  const progressBase = pendingCount + completedCount;
  const completionPct = progressBase === 0 ? 0 : Math.round((completedCount / progressBase) * 100);

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Item label="Followers" value={comparison.followers.length} />
      <Item label="Following" value={comparison.following.length} />
      <Item label="Not Following Back" value={comparison.nonFollowers.length} />
      <Item label="Mutuals" value={comparison.mutuals.length} />
      <Item label="Fans" value={comparison.fans.length} />
      <Item label="Pending Unfollow" value={pendingCount} />
      <Item label="Completed" value={completedCount} />
      <Item label="Completion" value={`${completionPct}%`} />
    </section>
  );
}
