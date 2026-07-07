import type Anthropic from "@anthropic-ai/sdk";

const MAX_BLOCK_CHARS = 4_000;

/**
 * Render a carbon session's message array as clean, readable text for the
 * reflection agent. The raw JSONL is noisy (tool IDs, nested blocks); this
 * distills it to "User: / graphite: / [tool …]" so the reflector reasons over
 * signal, not wire format.
 */
export function formatTranscript(messages: Anthropic.MessageParam[]): string {
  const out: string[] = [];
  for (const message of messages) {
    const speaker = message.role === "user" ? "User" : "graphite";
    for (const line of renderContent(message.content)) {
      out.push(line.startsWith("[") ? line : `${speaker}: ${line}`);
    }
  }
  return out.join("\n\n");
}

function renderContent(content: Anthropic.MessageParam["content"]): string[] {
  if (typeof content === "string") return content.trim() ? [clip(content)] : [];
  const lines: string[] = [];
  for (const block of content) {
    switch (block.type) {
      case "text":
        if (block.text.trim()) lines.push(clip(block.text));
        break;
      case "tool_use":
        lines.push(`[tool ${block.name} ${clip(JSON.stringify(block.input))}]`);
        break;
      case "tool_result": {
        const text = toolResultText(block.content);
        if (text) lines.push(`[tool result: ${clip(text)}]`);
        break;
      }
      // thinking, images, documents, etc. are dropped — reflection cares about
      // what was said and done, not internal reasoning or binary payloads.
    }
  }
  return lines;
}

function toolResultText(content: Anthropic.ToolResultBlockParam["content"]): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .map((b) => (b.type === "text" ? b.text : ""))
    .filter(Boolean)
    .join("\n");
}

function clip(s: string): string {
  const t = s.trim();
  return t.length > MAX_BLOCK_CHARS ? `${t.slice(0, MAX_BLOCK_CHARS)}…[clipped]` : t;
}
