#!/usr/bin/env bun
import { spawnSync } from "node:child_process";
import { defaultMemoryDir, ensureMemoryDir } from "./memory.ts";
import { reflect } from "./reflect.ts";

const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;

const HELP = `graphite — a self-improving agent on carbon

usage:
  graphite chat [carbon args…]   start a memory-backed session (carbon --memory)
  graphite reflect [path]        update memory from the latest session (or a given one)

Memory lives in ${defaultMemoryDir()} (override with GRAPHITE_MEMORY_DIR).
`;

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const memoryDir = defaultMemoryDir();

  switch (command) {
    case "chat": {
      // M1 daily driver: carbon with memory pointed at graphite's dir. When
      // graphite needs to inject conventions live or auto-reflect on exit,
      // this passthrough becomes a real REPL (graphite M2 / "option B").
      ensureMemoryDir(memoryDir);
      const result = spawnSync("carbon", ["--memory", memoryDir, ...rest], { stdio: "inherit" });
      process.exit(result.status ?? 0);
      break;
    }
    case "reflect": {
      try {
        const generator = reflect(memoryDir, rest[0] ?? undefined);
        // Drive the generator, rendering the reflector's activity.
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
        const { sessionPath, summary } = next.value;
        process.stdout.write(`\n${dim(`reflected on ${sessionPath}`)}\n\n${summary}\n`);
      } catch (error) {
        console.error(red(`error: ${error instanceof Error ? error.message : String(error)}`));
        process.exit(1);
      }
      break;
    }
    case undefined:
    case "-h":
    case "--help":
      process.stdout.write(HELP);
      break;
    default:
      console.error(red(`unknown command: ${command}\n`));
      process.stdout.write(HELP);
      process.exit(1);
  }
}

main();
