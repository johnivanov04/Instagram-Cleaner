import { describe, expect, it } from "vitest";
import { detectFileType, detectSourceType } from "@/lib/parsers/detect";

describe("detectFileType", () => {
  it("detects JSON by extension and structure", () => {
    expect(detectFileType("followers_1.json", "[{\"value\":\"alice\"}]")).toBe("json");
  });

  it("detects HTML and TXT", () => {
    expect(detectFileType("followers.html", "<html><body></body></html>")).toBe("html");
    expect(detectFileType("list.txt", "alice\nbob")).toBe("txt");
  });
});

describe("detectSourceType", () => {
  it("infers source from filename and text hints", () => {
    expect(detectSourceType("followers_1.json", "[]")).toBe("followers");
    expect(detectSourceType("following.json", "[]")).toBe("following");
    expect(detectSourceType("unknown.txt", "nothing useful")).toBe("unknown");
  });
});
