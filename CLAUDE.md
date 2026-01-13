# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

This is a Claude Code plugin that analyzes various content sources (repositories, PDFs, PowerPoints) and automatically generates MulmoScript files for video and PDF creation using MulmoCast.

## Supported Input Types

1. **Repositories** - Source code projects with README, docs, etc.
2. **PDF Documents** - Research papers, reports, white papers, manuals
3. **PowerPoint Presentations** - PPTX/PPT slide decks

## Plugin Structure

```
mulmocast-claude-plugin/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest (required)
├── commands/
│   ├── generate.md          # /mulmocast:generate - Repository analysis
│   ├── pdf-to-video.md      # /mulmocast:pdf-to-video - PDF analysis
│   └── ppt-to-video.md      # /mulmocast:ppt-to-video - PPT analysis
├── agents/
│   ├── repo-analyzer.md     # Repository analysis agent
│   ├── pdf-analyzer.md      # PDF document analysis agent
│   └── ppt-analyzer.md      # PowerPoint analysis agent
├── skills/
│   └── mulmocast-scripting/
│       └── SKILL.md         # MulmoScript creation guide
├── examples/
│   ├── standard-example.json  # Standard version template
│   └── promo-example.json     # Promo version template (WHY-first)
├── CLAUDE.md                # This file
└── README.md
```

## Component Formats

### Command Format (commands/*.md)
```yaml
---
name: command-name
description: What the command does
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
argument-hint: "[options]"
---

# Command instructions in markdown...
```

### Agent Format (agents/*.md)
```yaml
---
name: agent-name
description: |
  When to use this agent with examples
model: inherit
color: cyan
tools:
  - Read
  - Glob
  - Grep
  - Write
---

# Agent system prompt in markdown...
```

### Skill Format (skills/skill-name/SKILL.md)
```yaml
---
name: skill-name
description: |
  When to use this skill
version: 1.0.0
---

# Skill knowledge content in markdown...
```

## Key Files

- **plugin.json**: Plugin metadata (name, version, description, author)
- **generate.md**: Repository analysis command (`/mulmocast:generate`)
- **pdf-to-video.md**: PDF analysis command (`/mulmocast:pdf-to-video`)
- **ppt-to-video.md**: PPT analysis command (`/mulmocast:ppt-to-video`)
- **repo-analyzer.md**: Agent that analyzes repositories and generates 3 MulmoScript versions
- **pdf-analyzer.md**: Agent that analyzes PDF documents and generates 3 MulmoScript versions
- **ppt-analyzer.md**: Agent that analyzes PowerPoint files and generates 3 MulmoScript versions
- **SKILL.md**: Reference guide for MulmoScript format and best practices

## Language Detection

All analyzers automatically detect the source language and generate MulmoScripts in that language:
- Japanese source → `"lang": "ja"` with Japanese narration
- English source → `"lang": "en"` with English narration

## MulmoScript Output Types

The plugin generates three types of MulmoScript:

1. **Standard** (`<repo>.json`): 8-12 beats, high-level overview
2. **Detailed** (`<repo>_detail.json`): 20-30+ beats, comprehensive technical guide
3. **Promotional** (`<repo>_promo.json`): 15-25 beats, WHY-first inspirational style

## MulmoScript Schema Requirements

All generated MulmoScripts must pass `mulmoScriptSchema.safeParse()`:

```json
{
  "$mulmocast": {
    "version": "1.1",
    "credit": "closing"
  },
  "title": "Title",
  "description": "Description",
  "lang": "en",
  "beats": [
    {
      "text": "Spoken text",
      "image": { "type": "textSlide", "slide": { "title": "..." } }
    },
    {
      "text": "Another beat",
      "imagePrompt": "AI image generation prompt"
    }
  ]
}
```

### Valid Image Types
- `textSlide`: `{ type: "textSlide", slide: { title, subtitle?, bullets? } }`
- `markdown`: `{ type: "markdown", markdown: "..." }`
- `mermaid`: `{ type: "mermaid", title: "...", code: { kind: "text", text: "..." } }`
- `chart`: `{ type: "chart", title: "...", chartData: {...} }`
- `image`: `{ type: "image", source: { kind: "path"|"url", path|url: "..." } }`

### imagePrompt
Instead of `image`, use `imagePrompt` for AI-generated images:
```json
{ "text": "...", "imagePrompt": "cinematic description with emotion and style" }
```

## Development Commands

```bash
# Install the plugin locally
claude --add-plugin /path/to/mulmocast-claude-plugin

# Test the plugin in another repository
cd /some/other/repo
# Then use: /mulmocast:generate
```

## Promotional Video Structure (WHY-first)

The promo version follows Simon Sinek's "Start with Why":

1. **WHY** (First 8-10 beats): Emotional connection
   - The Dream: User's aspirations
   - The Pain: Current frustrations
   - The Vision: What could be

2. **WHAT** (Middle 8-10 beats): The solution
   - The Reveal: Tool introduction
   - The Magic: Feature demonstrations
   - The Transformation: Before/after

3. **CALL TO ACTION** (Last 4-5 beats): Invitation
   - Universal appeal
   - Call to start today

## Dependencies

This plugin requires:
- [mulmocast CLI](https://github.com/receptron/mulmocast-cli) installed
- OPENAI_API_KEY environment variable for TTS and image generation

## Example MulmoScripts

The `examples/` directory contains reference MulmoScripts:

- **standard-example.json**: Template for standard overview videos
  - Uses textSlide, markdown, mermaid
  - 6 beats, professional tone

- **promo-example.json**: Template for promotional WHY-first videos
  - Uses imagePrompt for 60%+ of beats
  - 15 beats, emotional connection first
  - Follows: Dream → Pain → Vision → Reveal → Magic → Invitation

## Testing

To test changes to this plugin:
1. Make changes to commands/agents/skills
2. Go to a test repository
3. Run `/mulmocast:generate`
4. Verify the generated MulmoScripts are valid JSON
5. Run `mulmocast movie <script>.json` to test video generation
