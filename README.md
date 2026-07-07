# graphite

A self-improving agent built on [carbon](https://github.com/kyonyhk/carbon). It
gets better through use: you talk to it, and a reflection pass distills what it
learned into a persistent filesystem memory that future sessions carry forward.

> **Status: early.** The reflection loop works end to end (use, reflect,
> recall) and is the point of this repo. It is a working prototype, not a
> finished product.

## The idea

Most agents forget everything between sessions. graphite is a bet that an agent
you use every day should compound: the corrections you make, the preferences
you express, and the context you explain once should still be there tomorrow.

The mechanism is deliberately plain. Memory is a directory of small markdown
files, one fact per file, with an index. The agent reads and writes them with
ordinary file tools. There are no embeddings and no vector store: memory is
grepped and read, not retrieved by similarity. This is the anti-RAG position,
and testing whether it holds up in daily use is part of the point.

The loop has three moves:

1. **Use.** You have a normal session with the agent, backed by memory.
2. **Reflect.** When the session ends, a reflection pass reads the transcript
   and updates the memory files: what you prefer, what a project needs,
   corrections you made, things worth remembering. The reflection pass is
   itself a carbon agent with a reflection-specific prompt. The harness
   improving its own memory is the harness running itself.
3. **Recall.** The next session loads the memory index and reads the relevant
   files on demand, so the agent starts already knowing what it learned.

graphite is a thin layer on top of carbon. carbon provides the agent loop, the
tools, the sessions, and the memory-loading mechanism. graphite supplies the
policy carbon deliberately leaves out: what counts as worth remembering, the
file format, and when to reflect. Nothing here forks or patches carbon; it is
built entirely on carbon's public API.

## Setup

Needs [Bun](https://bun.sh) and [carbon](https://github.com/kyonyhk/carbon).
graphite depends on `@carbon/core`, which is linked locally:

```sh
# 1. clone and link carbon's core
git clone https://github.com/kyonyhk/carbon
cd carbon/packages/core && bun link && cd -

# 2. clone and set up graphite
git clone https://github.com/kyonyhk/graphite
cd graphite && bun install && bun link
```

Auth resolves like the Anthropic SDK: set `ANTHROPIC_API_KEY`, or log in with a
profile.

## Use

```sh
graphite                 # a memory-backed session; reflects automatically on exit
graphite --no-reflect    # skip the automatic reflection this time
graphite reflect         # reflect on the latest session by hand
graphite reflect <path>  # reflect on a specific session file
```

Memory lives in `~/.graphite/memory` (override with `GRAPHITE_MEMORY_DIR`). Each
memory is one markdown file with frontmatter; `MEMORY.md` is the index loaded
into every session. Look in that directory anytime to see what the agent has
learned about you.

## How it works

```
src/
  main.ts         the CLI: a session (wrapping carbon) that reflects on exit
  reflect.ts      the reflection pass, a carbon agent over a session transcript
  transcript.ts   render a session's messages as clean text for the reflector
  prompt.ts       the memory conventions (graphite's policy, not carbon's)
  memory.ts       the default memory directory and index
```

The daily session currently wraps carbon with memory mounted, and reflects when
it exits. The reflection engine (`reflect.ts` and the conventions in
`prompt.ts`) is the substance and carries forward as graphite grows.

## How this was built

graphite was designed and directed by me and implemented in close collaboration
with Claude Code. The design (the loop, the anti-RAG memory position, the split
between carbon's mechanism and graphite's policy) is mine; much of the
implementation was written by an agent under that direction, which the commit
trailers reflect honestly.

## License

MIT. See [LICENSE](./LICENSE).
