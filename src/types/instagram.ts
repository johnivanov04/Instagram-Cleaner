export type SourceType = "followers" | "following" | "unknown";

export type ReviewStatus = "unreviewed" | "keep" | "unfollow";

export type ResultFilter =
  | "all"
  | "not-following-back"
  | "mutuals"
  | "fans"
  | "selected";

export interface ParsedAccount {
  username: string;
  normalizedUsername: string;
  sourceType: SourceType;
  sourceFile?: string;
}

export interface ParseIssue {
  fileName: string;
  message: string;
}

export interface ParsedDataset {
  followers: ParsedAccount[];
  following: ParsedAccount[];
  unknown: ParsedAccount[];
  issues: ParseIssue[];
}

export interface ComparisonResult {
  followers: ParsedAccount[];
  following: ParsedAccount[];
  nonFollowers: ParsedAccount[];
  mutuals: ParsedAccount[];
  fans: ParsedAccount[];
}

export interface ReviewMeta {
  selected: boolean;
  status: ReviewStatus;
}

export interface AuditRow extends ParsedAccount {
  category: "not-following-back" | "mutuals" | "fans";
  selected: boolean;
  status: ReviewStatus;
}
