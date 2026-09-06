import { spawnSync } from "node:child_process";
const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
  stdio: "inherit",
  env: { ...process.env, STUBSPY_STATIC_PREVIEW: "1", SUPABASE_URL: "", SUPABASE_SECRET_KEY: "" },
});
process.exit(result.status ?? 1);
