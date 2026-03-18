"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuditStore } from "@/store/use-audit-store";

interface ItemProps {
  label: string;
  value: number;
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

  if (!comparison) {
    return null;
  }

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <Item label="Followers" value={comparison.followers.length} />
      <Item label="Following" value={comparison.following.length} />
      <Item label="Not Following Back" value={comparison.nonFollowers.length} />
      <Item label="Mutuals" value={comparison.mutuals.length} />
      <Item label="Fans" value={comparison.fans.length} />
    </section>
  );
}
