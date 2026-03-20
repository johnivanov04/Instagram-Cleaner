import { describe, expect, it } from "vitest";
import { filterRows } from "@/lib/instagram/audit";
import type { AuditRow } from "@/types/instagram";

const rows: AuditRow[] = [
  {
    username: "alpha",
    normalizedUsername: "alpha",
    sourceType: "following",
    category: "not-following-back",
    selected: false,
    status: "keep",
  },
  {
    username: "bravo",
    normalizedUsername: "bravo",
    sourceType: "following",
    category: "mutuals",
    selected: false,
    status: "completed",
  },
  {
    username: "charlie",
    normalizedUsername: "charlie",
    sourceType: "following",
    category: "fans",
    selected: false,
    status: "unfollow",
  },
];

describe("filterRows", () => {
  it("includes completed and keep rows in completed filter", () => {
    const result = filterRows(rows, "completed", "");
    expect(result.map((row) => row.normalizedUsername)).toEqual(["alpha", "bravo"]);
  });

  it("hides completed rows outside completed filter", () => {
    const allResult = filterRows(rows, "all", "");
    expect(allResult.map((row) => row.normalizedUsername)).toEqual(["alpha", "charlie"]);

    const selectedResult = filterRows(
      rows.map((row) => ({ ...row, selected: true })),
      "selected",
      "",
    );
    expect(selectedResult.map((row) => row.normalizedUsername)).toEqual(["alpha", "charlie"]);
  });

  it("applies search inside completed filter", () => {
    const result = filterRows(rows, "completed", "br");
    expect(result.map((row) => row.normalizedUsername)).toEqual(["bravo"]);
  });
});
