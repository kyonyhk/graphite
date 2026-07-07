# graphite

A self-improving agent built on [carbon](https://github.com/kyonyhk/carbon). It
gets better through use: you talk to it, and a reflection pass distills what it
learned into a persistent filesystem memory that future sessions carry forward.
Filesystem memory, grepped and read — no embeddings, no vector store.

Full design and roadmap: `~/Desktop/graphite-spec.md`.

## Setup

graphite depends on `@carbon/core` via a local link. From the carbon repo:

```sh
cd ~/Desktop/carbon/packages/core && bun link
```

Then here:

```sh
bun install
bun link          # puts `graphite` on your PATH
```

Needs `ANTHROPIC_API_KEY` (or a linked profile), same as carbon.

## Use

```sh
# a memory-backed session — reflects automatically when you exit
graphite

# same, with carbon flags passed through
graphite -m claude-sonnet-5
graphite --no-reflect          # skip the automatic reflection this time

# distill the latest session into memory by hand (rarely needed now)
graphite reflect

# reflect on a specific session file
graphite reflect ~/.carbon/sessions/<file>.jsonl
```

Memory lives in `~/.graphite/memory` (override with `GRAPHITE_MEMORY_DIR`).
Each memory is one markdown file with frontmatter; `MEMORY.md` is the index
loaded into every session.

## Status (M1 — the reflection engine)

The loop works end to end: use → reflect → recall. `graphite chat` is carbon
with memory mounted; the novel surface is `reflect.ts` (the reflection pass) and
`prompt.ts` (the memory conventions). A dedicated REPL that injects conventions
into the live session and auto-reflects on exit ("option B") comes when manual
`reflect` starts to chafe — the reflection engine built here carries into it
unchanged.

## Layout

```
src/
  main.ts         CLI: `chat` (→ carbon --memory) and `reflect`
  reflect.ts      the reflection pass — a carbon Agent over a session transcript
  transcript.ts   render a session's messages as clean text for the reflector
  prompt.ts       the memory conventions (graphite's policy, not carbon's)
  memory.ts       default memory dir + index bootstrap
```
