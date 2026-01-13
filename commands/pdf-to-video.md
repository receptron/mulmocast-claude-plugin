---
name: pdf-to-video
description: Analyze a PDF document and generate three MulmoScripts (standard, detailed, promo), then create videos and PDFs
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
argument-hint: "<pdf-file>"
---

# MulmoCast PDF to Video Command

This command analyzes a PDF document and generates three MulmoScript files, then creates video and PDF outputs for all.

## Usage

```
/mulmocast:pdf-to-video <pdf-file>
```

Example:
```
/mulmocast:pdf-to-video report.pdf
/mulmocast:pdf-to-video docs/whitepaper.pdf
```

## Output Files

Three versions are generated:
1. **Standard version** (`<document>.json`): 8-12 beats, summary of key points
2. **Detailed version** (`<document>_detail.json`): 20-30+ beats, comprehensive coverage
3. **Promotional version** (`<document>_promo.json`): 15-25 beats, WHY-first inspirational pitch

## Language Detection

The output language is automatically determined from the source PDF:
- Japanese PDF → Japanese MulmoScript (`"lang": "ja"`)
- English PDF → English MulmoScript (`"lang": "en"`)

## Workflow

1. **Launch pdf-analyzer agent** to analyze the PDF and generate all three MulmoScripts
2. **Validate** all MulmoScripts against schema
3. **Execute mulmocast CLI** to create video and PDF for all versions

## Execution Steps

### Step 1: Analyze PDF and Generate MulmoScripts

Use the Task tool to launch the `pdf-analyzer` agent with the following prompt:

```
Analyze the PDF document at <pdf-file> thoroughly and generate THREE MulmoScript files:

1. Standard version (<document-name>.json):
   - 8-12 beats
   - Summary of main points
   - Key findings and conclusions

2. Detailed version (<document-name>_detail.json):
   - 20-30+ beats
   - Comprehensive coverage of all sections
   - Include data, charts, and detailed analysis

3. Promotional version (<document-name>_promo.json):
   - 15-25 beats
   - WHY-first structure (Simon Sinek style)
   - Make viewers CARE about the topic
   - Use imagePrompt for emotional impact

Detect the language from the PDF and use it for output.
All files must pass mulmoScriptSchema.safeParse() validation.

Save files in the current directory.
```

### Step 2: Validate MulmoScripts

After generating, validate all three files exist and are valid JSON.

### Step 3: Generate Video and PDF for Standard Version

```bash
npx mulmocast movie <document-name>.json
npx mulmocast pdf <document-name>.json
```

### Step 4: Generate Video and PDF for Detailed Version

```bash
npx mulmocast movie <document-name>_detail.json
npx mulmocast pdf <document-name>_detail.json
```

### Step 5: Generate Video and PDF for Promotional Version

```bash
npx mulmocast movie <document-name>_promo.json
npx mulmocast pdf <document-name>_promo.json
```

## Output Files Summary

**Standard Version:**
- `<document>.json` - Standard MulmoScript (8-12 beats)
- `output/<document>/<document>.mp4` - Video (~2-5 min)
- `output/<document>/<document>_slide.pdf` - PDF slide

**Detailed Version:**
- `<document>_detail.json` - Detailed MulmoScript (20-30+ beats)
- `output/<document>_detail/<document>_detail.mp4` - Video (~10-20 min)
- `output/<document>_detail/<document>_detail_slide.pdf` - PDF slide

**Promotional Version:**
- `<document>_promo.json` - Promotional MulmoScript (15-25 beats)
- `output/<document>_promo/<document>_promo.mp4` - Video (~5-10 min)
- `output/<document>_promo/<document>_promo_slide.pdf` - PDF slide

## Use Cases

- **Research Papers**: Convert academic papers into explainer videos
- **Business Reports**: Transform company reports into presentations
- **Government Documents**: Make policy documents accessible
- **White Papers**: Create engaging content from technical documents
- **Manuals**: Turn documentation into video tutorials

## Notes

- Ensure mulmocast CLI is installed (`npm install -g mulmocast`)
- Required API keys must be configured (OPENAI_API_KEY for TTS/images)
- Claude Code can read PDF files directly (text + visual content extraction)
- For large PDFs, the detailed version will cover more content
