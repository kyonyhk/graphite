#!/usr/bin/env bun
import { Session } from "@carbon/core";
import { spawnSync } from "node:child_process";
import { printBanner } from "./banner.ts";
import { defaultMemoryDir, ensureMemoryDir } from "./memory.ts";
import { reflect } from "./reflect.ts";

const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;

const HELP = `graphite — a self-improving agent on carbon

usage:
  graphite [carbon args…]        start a memory-backed session; reflects automatically on exit
  graphite reflect [path]        update memory from the latest session (or a given one)

flags:
  --no-reflect                   skip the automatic reflection on exit

Memory lives in ${defaultMemoryDir()} (override with GRAPHITE_MEMORY_DIR).
`;

/** Does this session file have any actual messages, or just the meta line? */
function hasMessages(path: string): boolean {
  try {
    return Session.load(path).messages.length > 0;
  } catch {
    return false;
  }
}

/** Drive a reflection and render its activity. Shared by `reflect` and auto-reflect. */
async function runReflection(memoryDir: string, sessionPath?: string): Promise<void> {
  const generator = reflect(memoryDir, sessionPath ?? undefined);
  let next = await generator.next();
  while (!next.done) {
    const event = next.value;
    if (event.type === "tool_start") {
      const label = event.name === "bash" ? "" : ` ${JSON.stringify(event.input).slice(0, 80)}`;
      process.stdout.write(dim(`  ${cyan(event.name)}${label}\n`));
    } else if (event.type === "done" && event.stopReason === "refusal") {
      process.stdout.write(red("[the model declined]\n"));
    }
    next = await generator.next();
  }
  const { sessionPath: reflected, summary } = next.value;
  process.stdout.write(`\n${dim(`reflected on ${reflected}`)}\n\n${summary}\n`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const memoryDir = defaultMemoryDir();

  // `graphite reflect` and `graphite --help` are the only explicit commands.
  // Everything else — including bare `graphite` — starts a chat session, with
  // any args passed through to carbon (e.g. `graphite -m claude-sonnet-5`).
  if (command === "-h" || command === "--help" || command === "help") {
    process.stdout.write(HELP);
    return;
  }

  if (command === "reflect") {
    try {
      await runReflection(memoryDir, args[1]);
    } catch (error) {
      console.error(red(`error: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
    return;
  }

  // chat (the default). Accept an explicit leading "chat" for clarity, but
  // it's optional — bare `graphite` lands here.
  const rest = command === "chat" ? args.slice(1) : args;
  ensureMemoryDir(memoryDir);
  const noReflect = rest.includes("--no-reflect");
  const carbonArgs = rest.filter((a) => a !== "--no-reflect");
  const printMode = carbonArgs.includes("-p") || carbonArgs.includes("--print");

  // graphite owns the wordmark; carbon prints only its info line (--no-banner).
  // Skip the banner in print mode (one-shot, non-interactive).
  if (!printMode) printBanner("a self-improving agent · memory on");

  // Note the session that exists before carbon runs, so we can tell which one
  // carbon creates and reflect on exactly that.
  const before = Session.latestPath();
  const result = spawnSync("carbon", ["--memory", memoryDir, "--no-banner", ...carbonArgs], {
    stdio: "inherit",
  });

  // Auto-reflect on the session carbon just created (newest, if new and
  // non-empty). This closes the learning loop in one command.
  if (!noReflect) {
    const after = Session.latestPath();
    if (after && after !== before && hasMessages(after)) {
      process.stdout.write(dim("\n─ reflecting on this session ─\n"));
      try {
        await runReflection(memoryDir, after);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        process.stdout.write(red(`\nreflection failed: ${message}\n`));
      }
    }
  }
  process.exit(result.status ?? 0);
}

main();
