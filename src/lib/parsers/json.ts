const KNOWN_LABELS = new Set(["followers", "following", "media", "post", "story", "reel"]);

function collectCandidateUsernames(value: unknown, out: string[]): void {
  if (value === null || value === undefined) {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectCandidateUsernames(item, out);
    }
    return;
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;

    if (typeof obj.value === "string") {
      out.push(obj.value);
    }

    if (typeof obj.username === "string") {
      out.push(obj.username);
    }

    if (typeof obj.title === "string" && !KNOWN_LABELS.has(obj.title.toLowerCase())) {
      out.push(obj.title);
    }

    for (const nested of Object.values(obj)) {
      collectCandidateUsernames(nested, out);
    }
  }
}

export function parseInstagramJson(text: string): string[] {
  const parsed = JSON.parse(text) as unknown;
  const usernames: string[] = [];

  collectCandidateUsernames(parsed, usernames);

  return usernames;
}
