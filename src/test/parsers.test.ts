import { describe, expect, it } from "vitest";
import { parseInstagramHtml } from "@/lib/parsers/html";
import { parseInstagramJson } from "@/lib/parsers/json";
import { parseUsernameList } from "@/lib/parsers/username-list";
import { parseUploadedFiles } from "@/lib/parsers/parse-files";
import { fixtureText } from "@/test/helpers";

describe("parseInstagramJson", () => {
  it("extracts usernames from Instagram export JSON", () => {
    const users = parseInstagramJson(fixtureText("followers_1.json"));
    expect(users).toEqual(expect.arrayContaining(["Alice.Example", "Bob_Example"]));
  });
});

describe("parseInstagramHtml", () => {
  it("extracts usernames from profile links", () => {
    const users = parseInstagramHtml(fixtureText("followers.html"));
    expect(users).toEqual(["Delta.Profile", "echo.profile"]);
  });
});

describe("parseUsernameList", () => {
  it("extracts usernames from plain text list and URLs", () => {
    const users = parseUsernameList(fixtureText("username-list.txt"));
    expect(users).toEqual(expect.arrayContaining(["Zulu", "romeo.user", "Sierra.User"]));
  });
});

describe("parseUploadedFiles", () => {
  it("parses multiple files and splits followers/following", async () => {
    const files = [
      new File([fixtureText("followers_1.json")], "followers_1.json", { type: "application/json" }),
      new File([fixtureText("following.json")], "following.json", { type: "application/json" }),
    ];

    const parsed = await parseUploadedFiles(files);

    expect(parsed.followers.length).toBe(2);
    expect(parsed.following.length).toBe(2);
    expect(parsed.issues).toHaveLength(0);
  });
});
