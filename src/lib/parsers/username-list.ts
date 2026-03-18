export function parseUsernameList(text: string): string[] {
  const usernames: string[] = [];

  for (const line of text.split(/\r?\n/)) {
    const cleaned = line.trim();
    if (!cleaned) {
      continue;
    }

    // Accept either plain usernames or full profile URLs in line-delimited text exports.
    const fromUrl = cleaned.match(/instagram\.com\/(?:@)?([A-Za-z0-9._]+)/i)?.[1];
    if (fromUrl) {
      usernames.push(fromUrl);
      continue;
    }

    const candidate = cleaned.replace(/^@+/, "").replace(/[^A-Za-z0-9._].*$/, "");
    if (candidate) {
      usernames.push(candidate);
    }
  }

  return usernames;
}
