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

- [MulmoCast CLI](https://github.com/receptron/mulmocast-cli) installed in the project (`npm install mulmocast` or `yarn add mulmocast`)
- API keys configured (see [MulmoCast setup](https://github.com/receptron/mulmocast-cli#configuration))

## License

MIT
