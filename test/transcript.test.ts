import type Anthropic from "@anthropic-ai/sdk";
import { describe, expect, test } from "bun:test";
import { formatTranscript } from "../src/transcript.ts";

describe("formatTranscript", () => {
  test("renders a user/agent exchange", () => {
    const messages: Anthropic.MessageParam[] = [
      { role: "user", content: "remember I prefer bun" },
      { role: "assistant", content: [{ type: "text", text: "noted", citations: null }] },
    ];
    const out = formatTranscript(messages);
    expect(out).toContain("User: remember I prefer bun");
    expect(out).toContain("graphite: noted");
  });

  test("renders tool use and results as bracketed lines, not speaker lines", () => {
    const messages: Anthropic.MessageParam[] = [
      {
        role: "assistant",
        content: [
          { type: "tool_use", caller: { type: "direct" }, id: "t1", name: "bash", input: { command: "ls" } },
        ],
      },
      { role: "user", content: [{ type: "tool_result", tool_use_id: "t1", content: "file.txt" }] },
    ];
    const out = formatTranscript(messages);
    expect(out).toContain("[tool bash");
    expect(out).toContain("[tool result: file.txt]");
    expect(out).not.toContain("graphite: [tool");
  });

  test("drops empty text and thinking blocks", () => {
    const messages: Anthropic.MessageParam[] = [
      {
        role: "assistant",
        content: [
          { type: "thinking", thinking: "hmm", signature: "x" },
          { type: "text", text: "", citations: null },
          { type: "text", text: "actual answer", citations: null },
        ],
      },
    ];
    const out = formatTranscript(messages);
    expect(out).toBe("graphite: actual answer");
  });
});
