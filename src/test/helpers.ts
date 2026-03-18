import fs from "node:fs";
import path from "node:path";

export function fixtureText(fileName: string): string {
  return fs.readFileSync(path.join(process.cwd(), "src/test/fixtures", fileName), "utf8");
}
