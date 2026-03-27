import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const distAssetsDir = join(process.cwd(), "dist", "assets");
const maxBytes = Number(process.env.MAX_BUNDLE_BYTES ?? 900_000);

const jsFiles = readdirSync(distAssetsDir)
  .filter((name) => name.endsWith(".js"))
  .map((name) => ({ name, size: statSync(join(distAssetsDir, name)).size }))
  .sort((a, b) => b.size - a.size);

if (jsFiles.length === 0) {
  console.error("[perf] No JS assets found in dist/assets. Run build first.");
  process.exit(1);
}

const largest = jsFiles[0];
if (largest.size > maxBytes) {
  console.error(
    `[perf] Largest JS bundle ${largest.name} is ${largest.size} bytes, over threshold ${maxBytes} bytes.`,
  );
  process.exit(1);
}

console.log(
  `[perf] Largest JS bundle ${largest.name} is ${largest.size} bytes (threshold ${maxBytes}).`,
);

