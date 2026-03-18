# IG Follow Audit

Privacy-first MVP web app for identifying Instagram accounts you follow that do not follow you back.

## What this app does

1. You export your Instagram data from your own account.
2. You upload followers/following export files.
3. The app parses and compares accounts locally in-browser.
4. You review results and optionally export selected usernames to CSV.
5. You open Instagram profiles manually, one-by-one.

## Compliance and safety constraints

- No Instagram login automation.
- No scraping private Instagram pages.
- No use of unofficial/private Instagram APIs.
- No automatic follow/unfollow actions.
- All parsing and comparison are local-first in the browser.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI primitives in `src/components/ui/`
- Zustand state store (with persisted review state)
- Zod validation for parser input safety
- Vitest for parser/comparison tests

## Project structure

```text
src/
	app/
		globals.css
		layout.tsx
		page.tsx
	components/
		app-shell.tsx
		dashboard/
			stats-cards.tsx
		results/
			results-controls.tsx
			results-panel.tsx
			results-table.tsx
		ui/
			badge.tsx
			button.tsx
			card.tsx
			checkbox.tsx
			input.tsx
			toast.tsx
		upload/
			upload-dropzone.tsx
			upload-panel.tsx
	lib/
		instagram/
			audit.ts
			compare.ts
			normalize.ts
		parsers/
			detect.ts
			html.ts
			index.ts
			json.ts
			parse-files.ts
			username-list.ts
		utils.ts
	store/
		use-audit-store.ts
	test/
		fixtures/
			followers.html
			followers_1.json
			following.json
			username-list.txt
		compare.test.ts
		detect.test.ts
		helpers.ts
		normalize.test.ts
		parsers.test.ts
	types/
		instagram.ts
vitest.config.ts
```

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Test

```bash
npm run test
npm run test:coverage
```

## Parser strategy

The parser layer is designed to be extensible and format-tolerant:

- `detectFileType(fileName, text)`:
	Determines JSON/HTML/TXT/unsupported by extension and content signatures.
- `detectSourceType(fileName, text)`:
	Infers `followers`, `following`, or `unknown` from filename/content hints.
- `parseInstagramJson(text)`:
	Recursively traverses JSON and extracts string values in common username fields (`value`, `username`) across nested objects and arrays.
- `parseInstagramHtml(text)`:
	Extracts profile usernames from Instagram links and `@mentions` via regex.
- `parseUsernameList(text)`:
	Parses line-based username lists and profile URLs.
- `normalizeUsername(input)`:
	Trims whitespace, removes leading `@`, lowercases for comparison while preserving original display casing.

## Data model

`ParsedAccount` is the unified account shape:

```ts
{
	username: string;
	normalizedUsername: string;
	sourceType: "followers" | "following" | "unknown";
	sourceFile?: string;
}
```

Comparison sets:

- `followers`
- `following`
- `nonFollowers = following - followers`
- `mutuals = following ∩ followers`
- `fans = followers - following`

## Assumptions about Instagram export formats

- JSON files may contain nested structures with username values under keys like `value` or `username`.
- Followers/following file names often include substrings like `followers`, `followers_1`, `following`, or `relationships_following`.
- HTML exports may include Instagram profile links (`https://www.instagram.com/{username}/`).
- TXT files may contain plain usernames, `@username`, or full Instagram URLs one per line.
- Split files (`followers_1`, `followers_2`, etc.) are expected and deduplicated after parsing.

If Instagram changes export structures, add parser adapters in `src/lib/parsers/` and test them with new fixtures.
