---
name: illustrate
description: Create MulmoScript with AI-generated illustrations through structured creative process
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch, mcp__playwright__browser_navigate, mcp__playwright__browser_snapshot, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_evaluate, mcp__playwright__browser_close, mcp__playwright__browser_install
user-invocable: true
---

# /illustrate — Illustrated MulmoScript Creation

Create MulmoScript presentations where every visual is an AI-generated image via `imagePrompt`. Present Topic Brief + Beat Outline + Narrations + Image Prompts to the user, then assemble the final JSON.

**Key principle**: Each beat pairs narration (spoken text) with a single AI-generated image. The narration and image complement each other — narration provides context the image cannot, and the image provides visuals the narration cannot.

---

## Phase 1: Research & Understanding

### Determine the input source

Ask the user what they want to create content about. Inputs can be:
- **URL**: Fetch and analyze the page content
- **Topic**: Research with WebSearch
- **File**: Read the provided file(s)
- **Freeform description**: Work directly from the user's description

### Web fetching strategy

Try **WebFetch first**. Only use Playwright MCP when WebFetch fails (403, paywalled, JS-heavy).

1. **WebFetch (default)**: Simple and sufficient for most public pages.
2. **Playwright MCP (fallback)**: `browser_navigate` + `browser_snapshot`. Close with `browser_close` after all browser operations.
3. **WebSearch (supplement)**: Gather additional context regardless of the primary fetch method.

If the page has pagination, **fetch ALL pages** before proceeding.

### Conduct deep research

- For URLs: Extract main arguments, key data points, quotes, and structure
- For topics: Search 3-5 sources, cross-reference facts
- For files: Analyze content, identify themes

### Present Topic Brief for approval

```text
## Topic Brief

**Subject**: [one line]
**Target audience**: [who]
**Tone**: [professional / conversational / energetic / serious]
**Key insights** (3-5):
1. ...

**Suggested visual style**: [photorealistic / digital illustration / watercolor / anime / flat design / cinematic / isometric / minimalist]
**Color palette**: [2-3 dominant colors for visual consistency]
```

---

## Phase 2: Story Structure

### Determine scale

| Source length | Beat count | Structure |
|--------------|-----------|-----------|
| Short (1 article) | 3-8 beats | HOOK → SECTIONS → CLOSE |
| Medium (long article) | 8-15 beats | HOOK → (SECTION_INTRO → BEATS) × N → CLOSE |
| Long (report, multi-chapter) | 15-25 beats | HOOK → (CHAPTER → BEATS) × N → CLOSE |

When user asks for condensed/few slides, aim for 3-5 beats.

### Present Beat Outline for approval

```text
## Beat Outline (N beats)

| # | Tag | Summary | Visual concept |
|---|-----|---------|---------------|
| 1 | HOOK | ... | [one-line image concept] |
| N | CLOSE | ... | [one-line image concept] |
```

---

## Phase 3: Narration Writing

### Quality standards

**GOOD narration**: Opens with specific detail, uses sensory language, natural spoken rhythm, each beat advances the story.

**BAD narration**: Generic statements ("AI is changing the world"), listy recitation, robotic transitions.

### Guidelines

- **Length**: 2-4 sentences per beat (30-60 words)
- **Language**: Match the `lang` field
- **Flow**: Each beat should feel like a natural continuation
- **Complement the image**: Do not describe what the image shows. Instead, add context, explanation, or narrative that the image alone cannot convey.

### Present narrations for approval

---

## Phase 4: Image Prompt Writing

### Reference

**Read** `references/image_prompt_reference.md` at the plugin root for the full prompt-writing guide.

### Define a Visual Brief

Before writing individual prompts, establish a Visual Brief that applies to all beats:

```text
## Visual Brief

**Style**: [e.g., flat digital illustration]
**Palette**: [e.g., navy blue, coral, white]
**Recurring elements**: [e.g., geometric shapes, rounded corners]
**Character style**: [e.g., simplified figures, no detailed facial features]
**Background treatment**: [e.g., soft gradient backgrounds]
```

### Write image prompts

For each beat, write a 50-150 word detailed prompt following this structure:

```
[Beat-specific subject and composition] + [Visual Brief style/palette/elements]
```

**Rules**:
- Every prompt MUST include the Visual Brief keywords for consistency
- Never ask the image to contain text, labels, or numbers
- One clear subject per image — avoid overcrowded scenes
- Use concrete visual metaphors for abstract concepts
- Specify composition (framing, angle) for each image

### Present image prompts for approval

```text
## Image Prompts

| # | Narration (first line) | Image Prompt |
|---|----------------------|--------------|
| 1 | "Opening line..." | Full prompt text |
| N | "Closing line..." | Full prompt text |
```

---

## Phase 5: Assembly & Review

### Combine narrations + image prompts into MulmoScript JSON

```json
{
  "$mulmocast": { "version": "1.1" },
  "lang": "en",
  "canvasSize": { "width": 1280, "height": 720 },
  "title": "Title",
  "description": "Brief description",
  "references": [{ "url": "...", "title": "...", "type": "article" }],
  "speechParams": { "speakers": { "Presenter": { "voiceId": "shimmer" } } },
  "imageParams": { "provider": "google" },
  "beats": [
    {
      "text": "Narration text here.",
      "speaker": "Presenter",
      "imagePrompt": "Detailed image prompt here..."
    }
  ]
}
```

**Key differences from story skill output**:
- No `slideParams` (no slide theme needed unless mixing modes)
- `imageParams.provider` is set (e.g., `"google"`)
- Each beat uses `imagePrompt` (string) instead of `image.type: "slide"`

### Add `reference` to data-citing beats

For beats showing statistics or research findings, add `"reference": "Source: ..."` to the beat.

### Quality checklist

1. **Hook test**: Does beat 1 grab attention?
2. **Visual Brief consistency**: Do all prompts share the same style/palette/elements?
3. **Specificity test**: Replace vague prompts with concrete subjects and compositions.
4. **Narration-image complementarity**: Narration adds context the image cannot show; image shows what narration cannot describe.
5. **No text in images**: No prompts ask for text, labels, or numbers in the generated image.
6. **Visual variety**: Different compositions and subjects across beats (not all the same framing).
7. **Schema compliance**: Version "1.1", proper beat structure, `imagePrompt` as string field.

### Write the file and present output

Generate the movie directly — `npx mulmocast@latest movie` automatically generates images and audio as well, so separate image/audio steps are unnecessary.

```bash
npx mulmocast@latest movie <filename>
```

```text
Wrote: <filename>

Summary:
- N beats, [visual style] style
- Key topics: [brief list]

Output: output/video/<basename>.mp4
```

---

## Mixing Modes

Individual beats can use `image.type: "slide"` for content that benefits from structured layouts (data tables, metrics, charts):

```json
{
  "text": "Here are the quarterly results.",
  "speaker": "Presenter",
  "image": {
    "type": "slide",
    "slide": { "layout": "stats", "title": "Q4 Results", "stats": [...] }
  }
}
```

When mixing slide beats with imagePrompt beats:
- Add `slideParams.theme` to the top-level JSON (required for slide rendering)
- Run `npx mulmocast@latest tool info themes --format json` to get theme definitions
- See `references/slide_dsl_reference.md` for layout and block specifications
