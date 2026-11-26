import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const text = "My dad still prints out my sister's blog posts to keep in a binder, and last night he asked if he could \"like\" a paragraph with a yellow highlighter. Honestly, we're all just lucky to have a fan club that loud.";
const characterCount = Array.from(text).length;
if (characterCount < 1 || characterCount > 280 || /[\r\n]/.test(text)) {
  throw new Error("Entry does not satisfy the text gate");
}

const scriptDir = fileURLToPath(new URL(".", import.meta.url));
const configuredDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
if (configuredDir.length === 0) {
  throw new Error("MAKEFUN_OUTPUT_DIR must not be empty");
}
const outputDir = isAbsolute(configuredDir) ? configuredDir : resolve(scriptDir, configuredDir);
const entryPath = resolve(outputDir, "entry.txt");
const expected = Buffer.from(text + "\n", "utf8");
mkdirSync(outputDir, { recursive: true });
writeFileSync(entryPath, expected);
if (!readFileSync(entryPath).equals(expected)) {
  throw new Error("Entry verification failed");
}
