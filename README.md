# MulmoCast Claude Plugin

Claude Code plugin that analyzes various content sources and automatically generates MulmoScript for video and PDF creation.

## Supported Input Types

- **Repositories** - Source code projects, documentation, etc.
- **PDF Documents** - Research papers, reports, white papers, manuals
- **PowerPoint Presentations** - PPTX/PPT slide decks

## Features

- Automatically analyzes content structure and purpose
- **Language detection**: Output language matches source material (Japanese → Japanese, English → English)
- Generates THREE MulmoScript versions:
  - **Standard version**: 8-12 beats, high-level overview
  - **Detailed version**: 20-30+ beats, comprehensive technical deep-dive
  - **Promotional version**: 15-25 beats, Steve Jobs + Simon Sinek "Start with Why" style
- Creates video and PDF outputs using mulmocast CLI
- All generated scripts pass `mulmoScriptSchema.safeParse()` validation

## Promotional Video Style

The promo version uses a "WHY-first" approach:

1. **WHY (First 8-10 beats)**: Emotional connection
   - The Dream: What the viewer wants to achieve
   - The Pain: Current frustrations holding them back
   - The Vision: What life could be like

2. **WHAT (Middle 8-10 beats)**: The solution
   - The Reveal: Introduction of the tool
   - The Magic: Key features with dramatic pacing
   - The Transformation: Before/after comparison

3. **CALL TO ACTION (Last 4-5 beats)**: Invitation
   - Universal appeal and invitation to try

Uses `imagePrompt` extensively for AI-generated emotional imagery.

## Prerequisites

- [mulmocast CLI](https://github.com/receptron/mulmocast-cli) installed
- Required API keys configured (OPENAI_API_KEY, etc.)

## Installation

```bash
claude --add-plugin /path/to/mulmocast-claude-plugin
```

## Usage

### Repository Analysis

```
/mulmocast:generate
```

Analyzes the current repository and generates three MulmoScripts.

### PDF Document Analysis

```
/mulmocast:pdf-to-video <pdf-file>
```

Example:
```
/mulmocast:pdf-to-video research-paper.pdf
/mulmocast:pdf-to-video docs/annual-report.pdf
```

### PowerPoint Analysis

```
/mulmocast:ppt-to-video <ppt-file>
```

Example:
```
/mulmocast:ppt-to-video presentation.pptx
/mulmocast:ppt-to-video slides/keynote.pptx
```

### Output

Each command generates:
1. Three MulmoScripts (standard, detailed, promotional)
2. Video and PDF outputs for all versions

## Components

- **Commands**:
  - `/mulmocast:generate` - Repository analysis
  - `/mulmocast:pdf-to-video` - PDF document analysis
  - `/mulmocast:ppt-to-video` - PowerPoint analysis
- **Agents**:
  - `repo-analyzer` - Repository analysis and script generation
  - `pdf-analyzer` - PDF document analysis and script generation
  - `ppt-analyzer` - PowerPoint analysis and script generation
- **Skill**: `mulmocast-scripting` - MulmoScript best practices and schema validation

## Output

**Standard Version:**
- `<repo-name>.json` - Standard MulmoScript (8-12 beats)
- `output/<repo-name>/<repo-name>.mp4` - Video (~2-5 min)
- `output/<repo-name>/<repo-name>_slide.pdf` - PDF

**Detailed Version:**
- `<repo-name>_detail.json` - Detailed MulmoScript (20-30+ beats)
- `output/<repo-name>_detail/<repo-name>_detail.mp4` - Video (~10-20 min)
- `output/<repo-name>_detail/<repo-name>_detail_slide.pdf` - PDF

**Promotional Version:**
- `<repo-name>_promo.json` - Promotional MulmoScript (15-25 beats)
- `output/<repo-name>_promo/<repo-name>_promo.mp4` - Video (~5-10 min)
- `output/<repo-name>_promo/<repo-name>_promo_slide.pdf` - PDF

## Use Cases

- **Standard**: Quick intro, README video, lightning talks
- **Detailed**: Technical documentation, developer onboarding, training
- **Promo**: Product launch, marketing, social media, investor pitch

## Schema Validation

All generated MulmoScripts comply with `mulmoScriptSchema`:
- `$mulmocast.version` is `"1.1"`
- Valid beat structure with `text` and `image`/`imagePrompt` properties
- Correct image types: `textSlide`, `markdown`, `mermaid`, `chart`, `image`
- Proper mermaid diagram format

## License

MIT
