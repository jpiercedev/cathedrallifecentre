import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chromiumBinary from "@sparticuz/chromium";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ??
  (await chromiumBinary.executablePath());
const command = path.join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "playwright.cmd" : "playwright",
);

const run = (executable, args, env = process.env) =>
  new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      cwd: root,
      env,
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (signal) reject(new Error(`${executable} exited after signal ${signal}.`));
      else resolve(code ?? 1);
    });
  });

try {
  if (process.env.SKIP_PLAYWRIGHT_BUILD !== "1") {
    const packageManager = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
    const buildCode = await run(packageManager, ["build"]);
    if (buildCode !== 0) process.exit(buildCode);
  }

  process.exitCode = await run(
    command,
    ["test", ...process.argv.slice(2)],
    {
      ...process.env,
      PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH: executablePath,
      XDG_CACHE_HOME: process.env.XDG_CACHE_HOME ?? "/tmp/codex-cache",
    },
  );
} catch (error) {
  console.error(`Unable to run browser tests: ${error.message}`);
  process.exitCode = 1;
}
