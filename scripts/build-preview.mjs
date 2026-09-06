import { spawnSync } from "node:child_process";
import { cpSync, existsSync } from "node:fs";
const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
  stdio: "inherit",
  env: { ...process.env, STUBSPY_STATIC_PREVIEW: "1", SUPABASE_URL: "", SUPABASE_SECRET_KEY: "" },
});
if (result.status !== 0) process.exit(result.status ?? 1);
// Next 16 uses distDir as the static export destination. Normalize public files
// to the hosting manifest's supported directory without copying server output.
if (!existsSync(".next-preview/index.html")) throw new Error("Static export is missing index.html");
cpSync(".next-preview", "out", { recursive: true });
