import { spawn } from "node:child_process";
import { createRequire } from "node:module";

// Accept the preview supervisor's flags as well as the normal Next.js CLI.
const require = createRequire(import.meta.url);
const args = process.argv.slice(2)
  .filter(arg => arg !== "--strictPort")
  .map(arg => arg === "--host" ? "--hostname" : arg);
const child = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "dev", ...args], {
  stdio: "inherit",
  env: process.env,
});
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("error", error => { console.error(error); process.exit(1); });
child.on("exit", code => process.exit(code ?? 0));
