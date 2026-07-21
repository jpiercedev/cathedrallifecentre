import { spawn } from "node:child_process";
import path from "node:path";

const incoming = process.argv.slice(2);
const forwarded = ["dev"];
let hasHostname = false;

for (let index = 0; index < incoming.length; index += 1) {
  const argument = incoming[index];
  if (argument === "--strictPort") continue;
  if (argument === "--host") {
    forwarded.push("--hostname", incoming[index + 1] ?? "0.0.0.0");
    hasHostname = true;
    index += 1;
    continue;
  }
  if (argument === "--hostname") hasHostname = true;
  forwarded.push(argument);
}

if (!hasHostname) forwarded.push("--hostname", "0.0.0.0");

const nextCli = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
const child = spawn(process.execPath, [nextCli, ...forwarded], {
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
