import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

/** graphite's default global memory directory. */
export function defaultMemoryDir(): string {
  return process.env.GRAPHITE_MEMORY_DIR ?? join(homedir(), ".graphite", "memory");
}

/** Ensure the memory directory and its index file exist. */
export function ensureMemoryDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
  const index = join(dir, "MEMORY.md");
  if (!existsSync(index)) {
    writeFileSync(index, "# Memory Index\n\n");
  }
}
