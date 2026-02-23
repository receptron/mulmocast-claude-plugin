---
name: narrate
description: Convert source files (PDF, PPTX, Markdown, Keynote) into narrated ExtendedMulmoScript
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
user-invocable: true
---

# /narrate - Source File to Narrated ExtendedMulmoScript

Convert any supported source file into a validated ExtendedMulmoScript with AI-generated narration and metadata. This is the main entry point for the full pipeline.

## Invocation

```
/narrate <source file path>
```

Supported formats: `.pdf`, `.pptx`, `.md`, `.key`

## CLI Commands Overview

This project uses multiple CLI tools. Do NOT confuse them:

| Command | Package | Purpose | Input |
|---------|---------|---------|-------|
| `npx @mulmocast/slide` | `@mulmocast/slide` | Convert source files to MulmoScript, scaffold ExtendedMulmoScript | Presentation files (.pdf, .pptx, .md, .key) |
| `npx mulmocast@latest` | `mulmocast` | Generate movie/PDF/audio from MulmoScript | `{basename}.json` |
| `npx mulmocast-preprocessor` | `mulmocast-preprocessor` | Convert ExtendedMulmoScript to MulmoScript, query, summarize | `extended_script.json` |

**IMPORTANT**: `npx @mulmocast/slide movie` and `npx mulmocast@latest movie` are DIFFERENT commands. Use `npx mulmocast@latest movie` (not `@mulmocast/slide`) when generating video from a MulmoScript JSON.

**NOTE**: MulmoScript files are named `{basename}.json` (e.g., `scripts/paper/paper.json`), NOT `mulmo_script.json`.

## Instructions

### Step 1: Convert Source File

Detect the file extension and run the appropriate conversion command:

**For Markdown files (`.md`)** — use the parse-md pipeline:

```bash
npx @mulmocast/slide parse-md <file>
```

This produces in `scripts/{basename}/`:
- `parsed_structure.json` — structured markdown sections with typed elements
- `extended-script.schema.json` — ExtendedMulmoScript JSON Schema
- `presentation-plan.schema.json` — intermediate format JSON Schema

Then proceed to **Step 2A** (Markdown pipeline).

**For PDF, PPTX, Keynote files (`.pdf`, `.pptx`, `.key`)** — use scaffold:

```bash
npx @mulmocast/slide narrate <file> --scaffold-only
```

This automatically detects the file format, converts to MulmoScript, and creates `scripts/{basename}/extended_script.json` with:
- Beat IDs assigned
- Empty metadata fields ready for AI analysis
- Extracted texts imported as notes (for PDF)

If the MulmoScript already exists and you want to regenerate it, add `-f`:
```bash
npx @mulmocast/slide narrate <file> --scaffold-only -f
```

Then proceed to **Step 2B** (Presentation pipeline).

---

## Markdown Pipeline (Step 2A → Step 4A)

### Step 2A: Read Inputs

Use the Read tool to read:

1. `scripts/{basename}/parsed_structure.json`
2. `scripts/{basename}/presentation-plan.schema.json`
3. The original markdown file (for full context)

### Step 3A: Create Presentation Plan

Analyze the parsed structure and create `presentation_plan.json` conforming to the plan schema.

**Key decisions to make:**

1. **Beat allocation** (sections != beats):
   - Multiple sections can be consolidated into one beat
   - One dense section can be split across multiple beats
   - Aim for 8-15 beats for a typical document
   - Each beat should be a coherent, presentable unit

2. **Slide content** (`slideMarkdown`):
   - Concise, presentation-ready markdown for the visual slide
   - NOT a copy of the source — distill to key points, headings, bullet lists
   - Include tables, mermaid diagrams, code blocks when they are the focus
   - Each slide should be understandable at a glance

3. **Narration** (`narration`):
   - Natural spoken language explaining the slide content
   - Add context and insight beyond what's on the slide
   - Write in the document's language (specified by `lang`)
   - 2-4 sentences per beat (30-60 words)

4. **Core vs optional** (`isCore` / `shortNarration`):
   - `isCore: true`: Essential beats included in ALL output profiles
   - `isCore: false`: Detailed-only beats, skipped in short version
   - `shortNarration`: Condensed narration for short profile (null = skip beat in short)
   - Typical: 60-70% core, 30-40% optional
   - Introduction and conclusion beats should always be core

5. **Script metadata** (`scriptMeta`):
   - `audience`: Target audience
   - `goals`: 2-4 learning objectives
   - `keywords`: 5-10 main keywords
   - `background`: Theme overview
   - `references`: Extract URLs from source, categorize as web/code/document/video
   - `faq`: 2-4 questions with answers

6. **Beat metadata** (`meta`):
   - `section`: Logical section (lowercase-kebab-case, consecutive beats with same section stay grouped)
   - `tags`: Content type tags (intro, overview, definition, example, code, diagram, data, table, comparison, summary, conclusion)
   - `context`: Background info for AI features — most important field. Add supplementary information beyond what's in the slide.
   - `keywords`: 2-5 beat-specific terms
   - `expectedQuestions`: 1-3 audience questions

**Output format:**

```json
{
  "lang": "ja",
  "title": "Presentation Title",
  "scriptMeta": {
    "audience": "...",
    "goals": ["..."],
    "keywords": ["..."],
    "background": "...",
    "references": [{ "type": "web", "url": "...", "title": "..." }],
    "faq": [{ "question": "...", "answer": "..." }]
  },
  "beats": [
    {
      "id": "beat-1",
      "sourceSections": ["sec-0", "sec-1"],
      "slideMarkdown": "# Introduction\n\n- Key point 1\n- Key point 2",
      "narration": "Full narration text...",
      "shortNarration": "Condensed version...",
      "isCore": true,
      "meta": {
        "section": "introduction",
        "tags": ["intro"],
        "context": "Background info...",
        "keywords": ["term1"],
        "expectedQuestions": ["Why is this important?"]
      }
    }
  ]
}
```

Write this to `scripts/{basename}/presentation_plan.json`.

### Step 4A: Assemble, Validate, and Finish

1. Run the assemble command to convert the plan to ExtendedMulmoScript:
   ```bash
   npx @mulmocast/slide assemble-extended scripts/{basename}/presentation_plan.json
   ```
   This validates the plan, converts `isCore`/`shortNarration` to `variants`/`outputProfiles`, and outputs `scripts/{basename}/extended_script.json`.

2. If validation fails, fix the plan and re-run.

3. Generate MulmoScript from ExtendedMulmoScript:
   ```bash
   npx mulmocast-preprocessor scripts/{basename}/extended_script.json -o scripts/{basename}/{basename}.json
   ```

4. Proceed to **Step 5** (Present Results).

---

## Presentation Pipeline (Step 2B → Step 4B)

### Step 2B: Read Inputs

Use the Read tool (not bash/node commands) to read the following files:

1. `scripts/{basename}/extended_script.json` (the scaffolded output from Step 1)
2. `references/extended-script-schema.md` at the plugin root
3. The original source `.md` file (if Markdown, for speaker notes and structure)
4. For image-based slides (PDF/PPTX), read the slide images to understand visual content

### Step 3B: Analyze Content

Analyze the MulmoScript beats, extracted texts, and source file to understand:

- The overall theme and purpose
- The target audience
- The logical structure (sections, flow)
- Content types in each slide (text, code, diagrams, tables, data)
- URLs and external references
- Key terminology and concepts

For slides with images, read the slide images to understand visual content that may not be in extracted text.

### Step 4B: Generate Narration and Metadata

Based on the analysis, generate:

**`scriptMeta`** (script-level):
- `background`: 1-2 sentence overview of the theme
- `audience`: Who this is for
- `goals`: 2-4 learning objectives or goals
- `keywords`: 5-10 main keywords
- `references`: Extract URLs, categorize as web/code/document/video
- `author`: If identifiable from content
- `faq`: 2-4 likely questions with answers

**`beats[].text`** (narration):
- If the beat's `text` is empty, generate a concise narration based on the slide content and extracted text
- The narration should be natural spoken language, NOT a verbatim copy of source text
- Match the language specified in `lang` field of the MulmoScript
- 2-4 sentences per beat (30-60 words)
- If the beat already has `text`, preserve it as-is

**`beats[].meta`** (per-beat):
- `section`: Logical section name (lowercase-kebab-case, e.g., "introduction", "main-topic-1", "conclusion")
- `tags`: Content type tags from: `intro`, `overview`, `definition`, `example`, `code`, `diagram`, `data`, `table`, `demo`, `comparison`, `summary`, `conclusion`, `q-and-a`
- `keywords`: 2-5 beat-specific terms
- `notes`: If `extracted_texts.json` exists, put the raw extracted text here
- `context`: Background info for AI query/summarize. Be substantive — don't just restate the slide
- `expectedQuestions`: 1-3 natural audience questions

Then build and write the ExtendedMulmoScript:

1. Start with the original MulmoScript (preserve ALL existing fields)
2. Add `scriptMeta` at the top level
3. Add `meta` to each beat, set `text` for narration
4. Add `outputProfiles: {}` (empty)
5. If beats don't have `id` fields, add them (`"beat-1"`, `"beat-2"`, ...)
6. Write to `scripts/{basename}/extended_script.json` with 2-space indentation

Run validation:
```bash
npx @mulmocast/slide extend validate scripts/{basename}/extended_script.json
```

If validation fails, fix the errors and re-write the file. Repeat until validation passes.

Generate MulmoScript:
```bash
npx mulmocast-preprocessor scripts/{basename}/extended_script.json -o scripts/{basename}/{basename}.json
```

Proceed to **Step 5** (Present Results).

---

## Step 5: Present Results and Next Steps

Display a summary:
- Number of beats processed (for Markdown: total, core, and optional counts)
- Sections identified
- Key topics/keywords
- Output profiles available (if Markdown pipeline: detailed, short)
- Output file path

Then show the user the next steps they can take:

```
ExtendedMulmoScript is ready! Here's what you can do next:

## Query the content interactively
npx mulmocast-preprocessor query scripts/{basename}/extended_script.json -i

## Generate a summary
npx mulmocast-preprocessor summarize scripts/{basename}/extended_script.json

## Generate a narrated video
npx mulmocast-preprocessor scripts/{basename}/extended_script.json -o scripts/{basename}/{basename}.json
npx mulmocast@latest movie scripts/{basename}/{basename}.json
```

Ask the user if they want to adjust any narration or metadata before proceeding.

## Quality Guidelines

- **Narration**: Write as if presenting to an audience. Use clear, spoken language. Avoid reading raw data verbatim — summarize and explain instead.
- **slideMarkdown** (Markdown pipeline): Presentation-ready, not a dump of the source. Think "what would go on a slide."
- **context field**: Most important for AI features. Add supplementary info: related concepts, technical background, real-world examples, historical context.
- **section naming**: Use lowercase-kebab-case. Consecutive beats in the same logical section share the same section value.
- **tags**: 2-4 tags per beat. Be specific but not excessive.
- **expectedQuestions**: Natural questions a real audience member would ask.
- **keywords**: Prefer specific technical terms over generic words.
- **isCore judgment** (Markdown pipeline): Introduction, key findings, and conclusion are always core. Examples, deep-dives, and supplementary content can be optional.
- **shortNarration** (Markdown pipeline): If a core beat needs the same text in both profiles, omit shortNarration (it defaults to the full narration).
- **Preserve original content**: Never modify existing MulmoScript fields (image, speaker, etc.) except `text` when generating narration.
