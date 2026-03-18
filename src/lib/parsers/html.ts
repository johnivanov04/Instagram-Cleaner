export function parseInstagramHtml(text: string): string[] {
  const usernames: string[] = [];

  const hrefRegex = /href=["'](?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:@)?([A-Za-z0-9._]+)\/?["']/gi;
  let hrefMatch: RegExpExecArray | null = null;

  while ((hrefMatch = hrefRegex.exec(text)) !== null) {
    usernames.push(hrefMatch[1]);
  }

  const mentionRegex = /(?:^|\s)@([A-Za-z0-9._]{1,30})\b/g;
  let mentionMatch: RegExpExecArray | null = null;

  while ((mentionMatch = mentionRegex.exec(text)) !== null) {
    usernames.push(mentionMatch[1]);
  }

  return usernames;
}
