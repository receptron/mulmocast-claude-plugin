---
name: ppt-to-video
description: Analyze a PowerPoint presentation and generate three MulmoScripts (standard, detailed, promo), then create videos and PDFs
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
argument-hint: "<ppt-file>"
---

# MulmoCast PPT to Video Command

This command analyzes a PowerPoint presentation and generates three MulmoScript files, then creates video and PDF outputs for all.

## Usage

```
/mulmocast:ppt-to-video <ppt-file>
```

Example:
```
/mulmocast:ppt-to-video presentation.pptx
/mulmocast:ppt-to-video slides/quarterly-review.pptx
```

## Supported Formats

- `.pptx` - PowerPoint (preferred)
- `.ppt` - Legacy PowerPoint
- `.pdf` - PDF export of slides (if original unavailable)

## Output Files

Three versions are generated:
1. **Standard version** (`<presentation>.json`): 8-12 beats, condensed key messages
2. **Detailed version** (`<presentation>_detail.json`): 20-30+ beats, slide-by-slide coverage
3. **Promotional version** (`<presentation>_promo.json`): 15-25 beats, WHY-first inspirational pitch

## Language Detection

The output language is automatically determined from the source presentation:
- Japanese PPT → Japanese MulmoScript (`"lang": "ja"`)
- English PPT → English MulmoScript (`"lang": "en"`)

## Workflow

1. **Launch ppt-analyzer agent** to analyze the presentation and generate all three MulmoScripts
2. **Validate** all MulmoScripts against schema
3. **Execute mulmocast CLI** to create video and PDF for all versions

## Execution Steps

### Step 1: Analyze PPT and Generate MulmoScripts

Use the Task tool to launch the `ppt-analyzer` agent with the following prompt:

```
Analyze the PowerPoint presentation at <ppt-file> thoroughly and generate THREE MulmoScript files:

1. Standard version (<presentation-name>.json):
   - 8-12 beats
   - Condensed version of key messages
   - 1 beat per 2-3 slides approximately

2. Detailed version (<presentation-name>_detail.json):
   - 20-30+ beats
   - Comprehensive slide-by-slide coverage
   - Preserve all key content and data

3. Promotional version (<presentation-name>_promo.json):
   - 15-25 beats
   - WHY-first structure (Simon Sinek style)
   - Transform bullets into emotional stories
   - Use imagePrompt for dramatic effect

Detect the language from the presentation and use it for output.
All files must pass mulmoScriptSchema.safeParse() validation.

Save files in the current directory.
```

### Step 2: Validate MulmoScripts

After generating, validate all three files exist and are valid JSON.

### Step 3: Generate Video and PDF for Standard Version

```bash
npx mulmocast movie <presentation-name>.json
npx mulmocast pdf <presentation-name>.json
```

### Step 4: Generate Video and PDF for Detailed Version

```bash
npx mulmocast movie <presentation-name>_detail.json
npx mulmocast pdf <presentation-name>_detail.json
```

### Step 5: Generate Video and PDF for Promotional Version

```bash
npx mulmocast movie <presentation-name>_promo.json
npx mulmocast pdf <presentation-name>_promo.json
```

## Output Files Summary

**Standard Version:**
- `<presentation>.json` - Standard MulmoScript (8-12 beats)
- `output/<presentation>/<presentation>.mp4` - Video (~2-5 min)
- `output/<presentation>/<presentation>_slide.pdf` - PDF slide

**Detailed Version:**
- `<presentation>_detail.json` - Detailed MulmoScript (20-30+ beats)
- `output/<presentation>_detail/<presentation>_detail.mp4` - Video (~10-20 min)
- `output/<presentation>_detail/<presentation>_detail_slide.pdf` - PDF slide

**Promotional Version:**
- `<presentation>_promo.json` - Promotional MulmoScript (15-25 beats)
- `output/<presentation>_promo/<presentation>_promo.mp4` - Video (~5-10 min)
- `output/<presentation>_promo/<presentation>_promo_slide.pdf` - PDF slide

## Use Cases

- **Sales Presentations**: Convert pitch decks into shareable videos
- **Training Materials**: Transform training slides into video courses
- **Conference Talks**: Create video versions of conference presentations
- **Business Reviews**: Turn quarterly reviews into video summaries
- **Proposals**: Make project proposals more engaging

## Tips for Best Results

- **Speaker Notes**: If your PPT has speaker notes, they'll be used as narration text
- **Clear Titles**: Slides with clear titles produce better beat structure
- **Visual Descriptions**: Add alt-text to images for better imagePrompt generation
- **Logical Flow**: PPTs with clear narrative flow produce better videos

## Notes

- Ensure mulmocast CLI is installed (`npm install -g mulmocast`)
- Required API keys must be configured (OPENAI_API_KEY for TTS/images)
- PPTX extraction may require conversion to PDF for some files
- For complex animations/transitions, these will be captured as static content
