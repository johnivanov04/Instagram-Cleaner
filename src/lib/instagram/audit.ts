import type {
  AuditRow,
  ComparisonResult,
  ParsedAccount,
  ResultFilter,
  ReviewMeta,
  ReviewStatus,
} from "@/types/instagram";

function toRows(
  accounts: ParsedAccount[],
  category: AuditRow["category"],
  reviewState: Record<string, ReviewMeta>,
): AuditRow[] {
  return accounts.map((account) => {
    const review = reviewState[account.normalizedUsername];

    return {
      ...account,
      category,
      selected: review?.selected ?? false,
      status: review?.status ?? "unreviewed",
    };
  });
}

export function buildAuditRows(
  comparison: ComparisonResult,
  reviewState: Record<string, ReviewMeta>,
): AuditRow[] {
  return [
    ...toRows(comparison.nonFollowers, "not-following-back", reviewState),
    ...toRows(comparison.mutuals, "mutuals", reviewState),
    ...toRows(comparison.fans, "fans", reviewState),
  ];
}

export function filterRows(rows: AuditRow[], filter: ResultFilter, search: string): AuditRow[] {
  const query = search.trim().toLowerCase();

  return rows.filter((row) => {
    const completedView = row.status === "completed" || row.status === "keep";

    const byFilter =
      filter === "all" ||
      (filter === "selected"
        ? row.selected
        : filter === "completed"
          ? completedView
          : row.category === filter);

    const bySearch = query.length === 0 || row.normalizedUsername.includes(query);

    return byFilter && bySearch;
  });
}

export function sortRowsByUsername(rows: AuditRow[], asc: boolean): AuditRow[] {
  return [...rows].sort((a, b) => {
    const compare = a.normalizedUsername.localeCompare(b.normalizedUsername);
    return asc ? compare : compare * -1;
  });
}

export function getReviewMeta(
  reviewState: Record<string, ReviewMeta>,
  normalizedUsername: string,
): ReviewMeta {
  return reviewState[normalizedUsername] ?? { selected: false, status: "unreviewed" };
}

export function nextStatus(current: ReviewStatus, requested: "keep" | "unfollow"): ReviewStatus {
  if (current === "completed" && requested === "unfollow") {
    return "unfollow";
  }

  if (current === requested) {
    return "unreviewed";
  }

  return requested;
}
