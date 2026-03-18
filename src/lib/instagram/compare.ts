import type { ComparisonResult, ParsedAccount } from "@/types/instagram";
import { dedupeAccounts } from "./normalize";

function toMap(accounts: ParsedAccount[]): Map<string, ParsedAccount> {
  const map = new Map<string, ParsedAccount>();
  for (const account of dedupeAccounts(accounts)) {
    map.set(account.normalizedUsername, account);
  }
  return map;
}

function sortByUsername(accounts: ParsedAccount[]): ParsedAccount[] {
  return [...accounts].sort((a, b) =>
    a.normalizedUsername.localeCompare(b.normalizedUsername),
  );
}

export function compareAccounts(
  followersInput: ParsedAccount[],
  followingInput: ParsedAccount[],
): ComparisonResult {
  const followersMap = toMap(followersInput);
  const followingMap = toMap(followingInput);

  const followers = sortByUsername([...followersMap.values()]);
  const following = sortByUsername([...followingMap.values()]);

  const nonFollowers = sortByUsername(
    following.filter((account) => !followersMap.has(account.normalizedUsername)),
  );

  const mutuals = sortByUsername(
    following.filter((account) => followersMap.has(account.normalizedUsername)),
  );

  const fans = sortByUsername(
    followers.filter((account) => !followingMap.has(account.normalizedUsername)),
  );

  return {
    followers,
    following,
    nonFollowers,
    mutuals,
    fans,
  };
}
