import { z } from "zod";
import { buildAccount, dedupeAccounts } from "@/lib/instagram/normalize";
import type { ParsedAccount, ParsedDataset } from "@/types/instagram";
import { detectFileType, detectSourceType } from "./detect";
import { parseInstagramHtml } from "./html";
import { parseInstagramJson } from "./json";
import { parseUsernameList } from "./username-list";

const maxBytes = 15 * 1024 * 1024;

const parseInputSchema = z.object({
  fileName: z.string().min(1),
  text: z.string().min(1),
});

function parseUsernamesByType(fileType: string, text: string): string[] {
  if (fileType === "json") {
    return parseInstagramJson(text);
  }

  if (fileType === "html") {
    return parseInstagramHtml(text);
  }

  if (fileType === "txt") {
    return parseUsernameList(text);
  }

  return [];
}

function appendAccounts(
  usernames: string[],
  sourceType: ParsedAccount["sourceType"],
  sourceFile: string,
): ParsedAccount[] {
  const parsed: ParsedAccount[] = [];

  for (const username of usernames) {
    const account = buildAccount(username, sourceType, sourceFile);
    if (account) {
      parsed.push(account);
    }
  }

  return parsed;
}

export async function parseUploadedFiles(
  files: File[],
  onProgress?: (completed: number, total: number) => void,
): Promise<ParsedDataset> {
  const result: ParsedDataset = {
    followers: [],
    following: [],
    unknown: [],
    issues: [],
  };

  const total = files.length;

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];

    try {
      if (file.size > maxBytes) {
        throw new Error("File is larger than 15MB limit.");
      }

      const text = await file.text();
      const validated = parseInputSchema.parse({ fileName: file.name, text });

      const fileType = detectFileType(validated.fileName, validated.text);
      if (fileType === "unsupported") {
        result.issues.push({
          fileName: validated.fileName,
          message: "Unsupported format. Use JSON, HTML, or TXT exports.",
        });
        continue;
      }

      const inferredSource = detectSourceType(validated.fileName, validated.text);
      const usernames = parseUsernamesByType(fileType, validated.text);

      if (usernames.length === 0) {
        result.issues.push({
          fileName: validated.fileName,
          message: "No usernames found in this file.",
        });
        continue;
      }

      const parsed = appendAccounts(usernames, inferredSource, validated.fileName);

      if (inferredSource === "followers") {
        result.followers.push(...parsed);
      } else if (inferredSource === "following") {
        result.following.push(...parsed);
      } else {
        result.unknown.push(...parsed);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown parse error";
      result.issues.push({ fileName: file.name, message });
    } finally {
      onProgress?.(i + 1, total);
    }
  }

  result.followers = dedupeAccounts(result.followers);
  result.following = dedupeAccounts(result.following);
  result.unknown = dedupeAccounts(result.unknown);

  return result;
}
