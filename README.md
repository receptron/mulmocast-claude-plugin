# mulmocast-claude-plugin

[Claude Code](https://claude.com/claude-code) plugin for [MulmoCast](https://github.com/receptron/mulmocast-cli) — AI-native multi-modal presentation platform.

## Skills

### `/mulmocast:story`

Create high-quality MulmoScript (video presentations) through a structured multi-phase creative process:

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

## Installation

### From marketplace

```
/plugin install mulmocast@receptron/mulmocast-claude-plugin
```

### Local development

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
