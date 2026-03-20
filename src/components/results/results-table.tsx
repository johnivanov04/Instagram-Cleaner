"use client";

import * as React from "react";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast";
import { statusLabel, useAuditStore, useVisibleRows } from "@/store/use-audit-store";
import type { ReviewStatus } from "@/types/instagram";

function statusVariant(status: ReviewStatus): "default" | "neutral" | "warning" | "danger" {
  if (status === "completed") {
    return "default";
  }

  if (status === "keep") {
    return "neutral";
  }

  if (status === "unfollow") {
    return "danger";
  }

  return "warning";
}

export function ResultsTable(): React.JSX.Element {
  const { allRows, visibleRows, totalPages } = useVisibleRows();
  const [exitingRows, setExitingRows] = React.useState<Record<string, boolean>>({});
  const page = useAuditStore((s) => s.page);
  const setPage = useAuditStore((s) => s.setPage);
  const setSelected = useAuditStore((s) => s.setSelected);
  const setStatus = useAuditStore((s) => s.setStatus);
  const setReviewStatus = useAuditStore((s) => s.setReviewStatus);
  const setCompleted = useAuditStore((s) => s.setCompleted);
  const { toast } = useToast();

  const completeWithAnimation = React.useCallback(
    (normalizedUsername: string, previousStatus: ReviewStatus) => {
      setExitingRows((state) => ({ ...state, [normalizedUsername]: true }));

      window.setTimeout(() => {
        setCompleted(normalizedUsername);
        setExitingRows((state) => {
          const next = { ...state };
          delete next[normalizedUsername];
          return next;
        });

        toast({
          kind: "info",
          title: "Marked as completed",
          description: "Removed from active review. Undo?",
          actionLabel: "Undo",
          durationMs: 5000,
          onAction: () => {
            setReviewStatus(normalizedUsername, previousStatus);
          },
        });
      }, 260);
    },
    [setCompleted, setReviewStatus, toast],
  );

  if (allRows.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-lg font-semibold">No accounts in this view</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Upload files or switch filters to see accounts.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left dark:border-slate-800">
                <th className="py-2 pr-3">Selected</th>
                <th className="py-2 pr-3">Username</th>
                <th className="py-2 pr-3">Profile</th>
                <th className="py-2 pr-3">Source File</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => {
                const profileUrl = `https://www.instagram.com/${row.username}/`;
                const isExiting = Boolean(exitingRows[row.normalizedUsername]);

                return (
                  <tr
                    key={`${row.normalizedUsername}-${row.category}`}
                    className={`border-b border-slate-100 transition-all duration-300 dark:border-slate-900 ${
                      isExiting ? "translate-x-2 opacity-0" : "translate-x-0 opacity-100"
                    }`}
                  >
                    <td className="py-2 pr-3">
                      <Checkbox
                        checked={row.selected}
                        onChange={(event) => setSelected(row.normalizedUsername, event.target.checked)}
                      />
                    </td>
                    <td className="py-2 pr-3 font-medium">@{row.username}</td>
                    <td className="py-2 pr-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(profileUrl, "_blank", "noopener,noreferrer")}
                      >
                        <span className="inline-flex items-center gap-1">
                          Open <ExternalLink className="h-3.5 w-3.5" />
                        </span>
                      </Button>
                    </td>
                    <td className="py-2 pr-3 text-slate-600 dark:text-slate-300">{row.sourceFile ?? "-"}</td>
                    <td className="py-2 pr-3">
                      <Badge variant="neutral">{row.category}</Badge>
                    </td>
                    <td className="py-2 pr-3">
                      <Badge variant={statusVariant(row.status)}>{statusLabel(row.status)}</Badge>
                    </td>
                    <td className="py-2 pr-3">
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="secondary" onClick={() => setStatus(row.normalizedUsername, "keep")}>
                          Keep
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => setStatus(row.normalizedUsername, "unfollow")}>
                          Mark for Unfollow
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isExiting}
                          onClick={() => completeWithAnimation(row.normalizedUsername, row.status)}
                        >
                          Mark Completed
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Page {Math.min(page, totalPages)} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage(Math.max(1, page - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage(Math.min(totalPages, page + 1))}
            >
              Next
            </Button>
          </div>
        </div>

        <div className="mt-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              toast({
                kind: "info",
                title: "Manual-action workflow",
                description: "This tool only helps review accounts. It never auto-unfollows.",
              })
            }
          >
            Why no auto-unfollow?
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
