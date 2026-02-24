# mulmocast-claude-plugin

[Claude Code](https://claude.com/claude-code) plugin for [MulmoCast](https://github.com/receptron/mulmocast-cli) — AI-native multi-modal presentation platform.

## Skills

### `/mulmocast:mulmocast` (dispatcher)

Unified entry point that automatically detects input type and routes to the appropriate skill.

```
/mulmocast:mulmocast https://example.com/article    → routes to story
/mulmocast:mulmocast samples/presentation.pdf       → routes to narrate
/mulmocast:mulmocast samples/document.md            → routes to narrate
/mulmocast:mulmocast scripts/talk/talk.json         → routes to extend
/mulmocast:mulmocast AI trends in 2026              → routes to story
/mulmocast:mulmocast https://example.com illustrate → routes to illustrate
/mulmocast:mulmocast AI trends, illustrated         → routes to illustrate
```

### `/mulmocast:story`

Create high-quality MulmoScript (video presentations) from scratch through a structured multi-phase creative process:

1. **Research** — Fetch URLs, search topics, collect visual assets
2. **Structure** — Design beat outline with appropriate scale
3. **Narration** — Write compelling spoken narration
4. **Visual Design** — Create slide layouts with the Slide DSL (11 layouts, 12 content block types)
5. **Assembly** — Combine into MulmoScript JSON and generate movie

**Usage:**
```
/mulmocast:story https://example.com/article 日本語でmovie
/mulmocast:story AI trends in 2026, 5 slides, English
/mulmocast:story path/to/document.pdf
```

### `/mulmocast:illustrate`

Create MulmoScript presentations where every visual is an AI-generated image via `imagePrompt`. Uses a structured 5-phase process:

1. **Research** — Fetch URLs, search topics, gather information
2. **Structure** — Design beat outline with visual concepts
3. **Narration** — Write spoken narration that complements images
4. **Image Prompts** — Write detailed prompts for AI image generation with consistent Visual Brief
5. **Assembly** — Combine into MulmoScript JSON and generate movie

**Usage:**
```
/mulmocast:illustrate https://example.com/article
/mulmocast:illustrate AI trends in 2026, illustrated
/mulmocast:illustrate 宇宙の歴史をイラストで
```

### `/mulmocast:narrate`

Convert source files (PDF, PPTX, Markdown, Keynote) into narrated ExtendedMulmoScript with AI-generated narration and metadata.

- **Markdown files**: Uses `parse-md` → presentation plan → `assemble-extended` pipeline with intelligent beat allocation and variant support (detailed/short profiles)
- **PDF/PPTX/Keynote**: Uses `narrate --scaffold-only` → AI analysis → metadata generation

**Usage:**
```
/mulmocast:narrate samples/paper.pdf
/mulmocast:narrate samples/slides.pptx
/mulmocast:narrate samples/document.md
```

### `/mulmocast:extend`

Add metadata to an existing MulmoScript to create an ExtendedMulmoScript. The metadata enables AI features (summarize, query) via `mulmocast-preprocessor`.

**Usage:**
```
/mulmocast:extend scripts/my-talk/my-talk.json
/mulmocast:extend scripts/my-talk/my-talk.json --source samples/my-talk.pdf
```

## Installation

### Step 1: Add marketplace

```bash
claude plugin marketplace add receptron/mulmocast-claude-plugin
```

### Step 2: Install plugin

```bash
claude plugin install mulmocast@mulmocast-plugins
```

### Local development (alternative)

```bash
claude --plugin-dir /path/to/mulmocast-claude-plugin
```

## Prerequisites

### Required

- **Node.js** 22+
- **ffmpeg** — for video/audio assembly
  ```bash
  brew install ffmpeg   # macOS
  ```
- **OPENAI_API_KEY** — for text-to-speech (default TTS provider)
- **npx @mulmocast/slide** — for source file conversion (`narrate`, `extend` skills)
- **npx mulmocast-preprocessor** — for ExtendedMulmoScript processing

### Optional (for additional features)

| Env variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Google Gemini image generation & TTS |
| `REPLICATE_API_TOKEN` | Replicate video generation |
| `ELEVENLABS_API_KEY` | ElevenLabs TTS |

Set these in a `.env` file in your project root.

See [MulmoCast CLI setup](https://github.com/receptron/mulmocast-cli#configuration) for full details.

## License

MIT
