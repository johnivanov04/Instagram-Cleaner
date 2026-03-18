import { describe, expect, it } from "vitest";
import { buildAccount, dedupeAccounts, normalizeUsername } from "@/lib/instagram/normalize";

describe("normalizeUsername", () => {
  it("normalizes case, whitespace, and leading @", () => {
    expect(normalizeUsername("  @Alice.Example ")).toBe("alice.example");
  });
});

describe("buildAccount", () => {
  it("returns null for empty usernames", () => {
    expect(buildAccount("   ", "followers")).toBeNull();
  });

  it("keeps display casing while storing normalized value", () => {
    expect(buildAccount("Alice.Example", "followers")).toEqual({
      username: "Alice.Example",
      normalizedUsername: "alice.example",
      sourceType: "followers",
      sourceFile: undefined,
    });
  });
});

describe("dedupeAccounts", () => {
  it("deduplicates by normalized username", () => {
    const first = buildAccount("alice", "followers")!;
    const second = buildAccount("ALICE", "followers")!;
    const third = buildAccount("bob", "followers")!;

    expect(dedupeAccounts([first, second, third]).map((a) => a.normalizedUsername)).toEqual([
      "alice",
      "bob",
    ]);
  });
});
