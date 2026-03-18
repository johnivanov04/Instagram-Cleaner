export type SupportedFileType = "json" | "html" | "txt" | "unsupported";

const FOLLOWERS_HINTS = [/followers?/i, /follower_?\d*/i];
const FOLLOWING_HINTS = [/following/i, /relationships_following/i];

export function detectFileType(fileName: string, text: string): SupportedFileType {
  const lowerName = fileName.toLowerCase();
  const trimmed = text.trim();

  if (lowerName.endsWith(".json") || trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return "json";
  }

  if (
    lowerName.endsWith(".html") ||
    lowerName.endsWith(".htm") ||
    /<html|<body|<a\s/i.test(trimmed)
  ) {
    return "html";
  }

  if (lowerName.endsWith(".txt") || /\r?\n/.test(trimmed)) {
    return "txt";
  }

  return "unsupported";
}

export function detectSourceType(fileName: string, text: string): "followers" | "following" | "unknown" {
  const lowerName = fileName.toLowerCase();
  const sample = `${lowerName}\n${text.slice(0, 1800).toLowerCase()}`;

  if (FOLLOWERS_HINTS.some((re) => re.test(sample))) {
    return "followers";
  }

  if (FOLLOWING_HINTS.some((re) => re.test(sample))) {
    return "following";
  }

  return "unknown";
}
