import { describe, expect, it } from "vitest";
import { compareAccounts } from "@/lib/instagram/compare";
import { buildAccount } from "@/lib/instagram/normalize";
import type { ParsedAccount } from "@/types/instagram";

describe("compareAccounts", () => {
  it("returns nonFollowers, mutuals, and fans correctly", () => {
    const followers: ParsedAccount[] = [
      buildAccount("alice", "followers"),
      buildAccount("bob", "followers"),
    ].filter((item): item is ParsedAccount => item !== null);

    const following: ParsedAccount[] = [
      buildAccount("alice", "following"),
      buildAccount("charlie", "following"),
    ].filter((item): item is ParsedAccount => item !== null);

    const result = compareAccounts(followers, following);

    expect(result.nonFollowers.map((a) => a.normalizedUsername)).toEqual(["charlie"]);
    expect(result.mutuals.map((a) => a.normalizedUsername)).toEqual(["alice"]);
    expect(result.fans.map((a) => a.normalizedUsername)).toEqual(["bob"]);
  });
});
