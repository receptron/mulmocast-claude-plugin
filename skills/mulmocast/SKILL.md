---
name: mulmocast
description: Unified entry point — automatically routes input to the appropriate MulmoCast skill
allowed-tools: Read, Bash, Grep, Glob
user-invocable: true
---

# /mulmocast - Unified Dispatcher

Automatically detect the input type and route to the appropriate MulmoCast skill.

## Invocation

```
/mulmocast <input>
```

Where `<input>` can be a URL, file path, or topic description.

## Routing Rules

Detect the input type and invoke the corresponding skill using the Skill tool:

1. **URL** (starts with `http://` or `https://`) → invoke `/mulmocast:story`
   - The story skill will fetch the URL, research the content, and create a presentation

2. **File path with presentation extension** (`.pdf`, `.pptx`, `.md`, `.key`) → invoke `/mulmocast:narrate`
   - The narrate skill will convert the source file into a narrated ExtendedMulmoScript

3. **File path with `.json` extension** → invoke `/mulmocast:extend`
   - The extend skill will add metadata to the existing MulmoScript

4. **Plain text** (no extension, not a URL) → invoke `/mulmocast:story`
   - Treat as a topic description for the story skill to research and create a presentation

## Examples

```
/mulmocast https://example.com/article
→ routes to /mulmocast:story

/mulmocast samples/presentation.pdf
→ routes to /mulmocast:narrate

/mulmocast samples/document.md
→ routes to /mulmocast:narrate

/mulmocast scripts/my-talk/my-talk.json
→ routes to /mulmocast:extend

/mulmocast AI trends in 2026
→ routes to /mulmocast:story
```

## Important

- Do NOT process the input yourself — always delegate to the appropriate skill
- Pass the original input (including any additional arguments) to the target skill
- If the input type is ambiguous, ask the user which skill to use
