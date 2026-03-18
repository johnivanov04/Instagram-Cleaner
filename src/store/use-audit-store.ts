"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { compareAccounts } from "@/lib/instagram/compare";
import {
  buildAuditRows,
  filterRows,
  getReviewMeta,
  nextStatus,
  sortRowsByUsername,
} from "@/lib/instagram/audit";
import type {
  AuditRow,
  ComparisonResult,
  ParsedDataset,
  ResultFilter,
  ReviewMeta,
  ReviewStatus,
} from "@/types/instagram";

const PAGE_SIZE = 25;

interface AuditState {
  parsed: ParsedDataset | null;
  comparison: ComparisonResult | null;
  reviewState: Record<string, ReviewMeta>;
  search: string;
  filter: ResultFilter;
  sortAsc: boolean;
  page: number;
  setParsed: (parsed: ParsedDataset) => void;
  setSearch: (value: string) => void;
  setFilter: (value: ResultFilter) => void;
  toggleSort: () => void;
  setPage: (page: number) => void;
  setSelected: (normalizedUsername: string, selected: boolean) => void;
  setStatus: (normalizedUsername: string, requested: "keep" | "unfollow") => void;
  setVisibleSelected: (rows: AuditRow[], selected: boolean) => void;
  clearSelection: () => void;
  clearAllData: () => void;
}

interface PersistedAuditState {
  reviewState: Record<string, ReviewMeta>;
}

const initialState = {
  parsed: null,
  comparison: null,
  search: "",
  filter: "not-following-back" as ResultFilter,
  sortAsc: true,
  page: 1,
};

function mergeReviewState(
  existing: Record<string, ReviewMeta>,
  knownUsernames: Set<string>,
): Record<string, ReviewMeta> {
  const next: Record<string, ReviewMeta> = {};

  for (const username of knownUsernames) {
    next[username] = getReviewMeta(existing, username);
  }

  return next;
}

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      ...initialState,
      reviewState: {},
      setParsed: (parsed) => {
        const comparison = compareAccounts(parsed.followers, parsed.following);

        const usernames = new Set(
          [...comparison.followers, ...comparison.following].map((a) => a.normalizedUsername),
        );

        set((state) => ({
          parsed,
          comparison,
          page: 1,
          reviewState: mergeReviewState(state.reviewState, usernames),
        }));
      },
      setSearch: (value) => set({ search: value, page: 1 }),
      setFilter: (value) => set({ filter: value, page: 1 }),
      toggleSort: () => set((state) => ({ sortAsc: !state.sortAsc })),
      setPage: (page) => set({ page }),
      setSelected: (normalizedUsername, selected) =>
        set((state) => ({
          reviewState: {
            ...state.reviewState,
            [normalizedUsername]: {
              ...getReviewMeta(state.reviewState, normalizedUsername),
              selected,
            },
          },
        })),
      setStatus: (normalizedUsername, requested) =>
        set((state) => {
          const current = getReviewMeta(state.reviewState, normalizedUsername);

          return {
            reviewState: {
              ...state.reviewState,
              [normalizedUsername]: {
                ...current,
                status: nextStatus(current.status, requested),
              },
            },
          };
        }),
      setVisibleSelected: (rows, selected) =>
        set((state) => {
          const next = { ...state.reviewState };
          for (const row of rows) {
            next[row.normalizedUsername] = {
              ...getReviewMeta(state.reviewState, row.normalizedUsername),
              selected,
            };
          }
          return { reviewState: next };
        }),
      clearSelection: () =>
        set((state) => {
          const next: Record<string, ReviewMeta> = {};

          for (const [username, value] of Object.entries(state.reviewState)) {
            next[username] = { ...value, selected: false };
          }

          return { reviewState: next };
        }),
      clearAllData: () => {
        set({ ...initialState, reviewState: {} });
        localStorage.removeItem("ig-follow-audit-storage");
      },
    }),
    {
      name: "ig-follow-audit-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedAuditState => ({ reviewState: state.reviewState }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as PersistedAuditState),
      }),
    },
  ),
);

export function useVisibleRows(): {
  allRows: AuditRow[];
  visibleRows: AuditRow[];
  totalPages: number;
  pageSize: number;
} {
  const comparison = useAuditStore((s) => s.comparison);
  const reviewState = useAuditStore((s) => s.reviewState);
  const filter = useAuditStore((s) => s.filter);
  const search = useAuditStore((s) => s.search);
  const sortAsc = useAuditStore((s) => s.sortAsc);
  const page = useAuditStore((s) => s.page);

  if (!comparison) {
    return { allRows: [], visibleRows: [], totalPages: 1, pageSize: PAGE_SIZE };
  }

  const rows = buildAuditRows(comparison, reviewState);
  const filtered = filterRows(rows, filter, search);
  const sorted = sortRowsByUsername(filtered, sortAsc);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;

  return {
    allRows: sorted,
    visibleRows: sorted.slice(start, start + PAGE_SIZE),
    totalPages,
    pageSize: PAGE_SIZE,
  };
}

export function selectedUsernames(rows: AuditRow[]): string[] {
  return rows
    .filter((row) => row.selected)
    .map((row) => row.username)
    .sort((a, b) => a.localeCompare(b));
}

export function statusLabel(status: ReviewStatus): string {
  if (status === "keep") {
    return "Keep";
  }

  if (status === "unfollow") {
    return "Mark for Unfollow";
  }

  return "Unreviewed";
}
