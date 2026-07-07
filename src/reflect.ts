import {
  Agent,
  coreTools,
  Session,
  type AgentEvent,
  type AgentOptions,
} from "@carbon/core";
import { ensureMemoryDir } from "./memory.ts";
import { REFLECTION_PROMPT } from "./prompt.ts";
import { formatTranscript } from "./transcript.ts";

export interface ReflectResult {
  sessionPath: string;
  summary: string;
}

export interface ReflectOptions {
  /** Model for the reflection pass. Defaults to the model the session used. */
  model?: string;
  /** Passed through to the reflector; null disables thinking (e.g. Kimi code models). */
  thinking?: AgentOptions["thinking"];
  cacheControl?: boolean;
}

/**
 * Reflect on a session transcript and update the memory directory. A carbon
 * Agent with graphite's reflection prompt runs inside the memory dir, reads
 * the current index (via carbon's memoryDir injection), and mutates memory
 * files with its ordinary write/edit tools. Sessionless on purpose: the
 * reflection run is not itself persisted or reflected upon.
 */
export async function* reflect(
  memoryDir: string,
  sessionPath: string | null = Session.latestPath(),
  options: ReflectOptions = {},
): AsyncGenerator<AgentEvent, ReflectResult> {
  if (!sessionPath) {
    throw new Error("No session to reflect on. Have a graphite session first, or pass a path.");
  }
  ensureMemoryDir(memoryDir);
  const { session, messages } = Session.load(sessionPath);

  const reflector = new Agent({
    // Reflect with the same model the session used, so a cheap daily driver
    // stays cheap through reflection too.
    model: options.model ?? session.meta.model,
    ...(options.thinking !== undefined ? { thinking: options.thinking } : {}),
    ...(options.cacheControl !== undefined ? { cacheControl: options.cacheControl } : {}),
    cwd: memoryDir, // write/edit resolve relative paths into the memory dir
    memoryDir, // carbon injects the current MEMORY.md index
    projectInstructions: false, // reflection prompt only
    systemPrompt: REFLECTION_PROMPT,
    tools: coreTools(),
  });

  let summary = "";
  for await (const event of reflector.run(formatTranscript(messages))) {
    if (event.type === "text") summary += event.text;
    yield event;
  }
  return { sessionPath, summary: summary.trim() };
}
