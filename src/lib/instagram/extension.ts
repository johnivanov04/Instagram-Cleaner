import type { AuditRow, ExtensionPayload } from "@/types/instagram";

export const EXTENSION_SYNC_EVENT = "ig-audit-sync";
export const EXTENSION_COMPLETE_REQUEST_EVENT = "ig-audit-complete-request";
export const APP_TO_EXTENSION_SYNC = "IG_AUDIT_APP_SYNC";
export const EXTENSION_TO_APP_COMPLETE = "IG_AUDIT_EXTENSION_COMPLETED";
export const EXTENSION_TO_APP_REQUEST_SYNC = "IG_AUDIT_EXTENSION_REQUEST_SYNC";

export function buildExtensionPayload(rows: AuditRow[]): ExtensionPayload {
  const accounts = rows.map((row) => ({
    username: row.username,
    normalizedUsername: row.normalizedUsername,
    category: row.category,
    status: row.status,
    selected: row.selected,
  }));

  const unfollowTargets = accounts
    .filter((account) => account.status === "unfollow")
    .map((account) => account.username)
    .sort((a, b) => a.localeCompare(b));

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    unfollowTargets,
    accounts,
  };
}
