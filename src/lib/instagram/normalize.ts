import type { ParsedAccount, SourceType } from "@/types/instagram";

export function normalizeUsername(input: string): string {
  return input.trim().replace(/^@+/, "").toLowerCase();
}

export function buildAccount(
  rawUsername: string,
  sourceType: SourceType,
  sourceFile?: string,
): ParsedAccount | null {
  const normalizedUsername = normalizeUsername(rawUsername);

  if (!normalizedUsername) {
    return null;
  }

  return {
    username: rawUsername.trim().replace(/^@+/, "") || normalizedUsername,
    normalizedUsername,
    sourceType,
    sourceFile,
  };
}

export function dedupeAccounts(accounts: ParsedAccount[]): ParsedAccount[] {
  const seen = new Map<string, ParsedAccount>();

  for (const account of accounts) {
    if (!seen.has(account.normalizedUsername)) {
      seen.set(account.normalizedUsername, account);
      continue;
    }

    const existing = seen.get(account.normalizedUsername)!;

    if (existing.username === existing.normalizedUsername && account.username) {
      seen.set(account.normalizedUsername, account);
    }
  }

  return [...seen.values()];
}
