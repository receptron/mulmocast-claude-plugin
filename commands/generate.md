---
name: generate
description: Analyze repository and generate three MulmoScripts (standard, detailed, promo), then create videos and PDFs
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - Bash
  - Task
argument-hint: "[options]"
---

# MulmoCast Generate Command

This command analyzes the current repository and generates three MulmoScript files, then creates video and PDF outputs for all.

## Output Files

Three versions are generated:
1. **Standard version** (`<repo>.json`): 8-12 beats, high-level overview
2. **Detailed version** (`<repo>_detail.json`): 20-30+ beats, comprehensive deep-dive
3. **Promotional version** (`<repo>_promo.json`): 15-25 beats, Steve Jobs-style inspirational pitch

## Workflow

1. **Launch repo-analyzer agent** to analyze the repository and generate all three MulmoScripts
2. **Validate** all MulmoScripts against schema
3. **Execute mulmocast CLI** to create video and PDF for all versions

## Execution Steps

### Step 1: Analyze Repository and Generate MulmoScripts

Use the Task tool to launch the `repo-analyzer` agent with the following prompt:

```
Analyze this repository thoroughly and generate THREE MulmoScript files:

1. Standard version (<repository-name>.json):
   - 8-12 beats
   - High-level overview
   - Focus on "what" and "why"

2. Detailed version (<repository-name>_detail.json):
   - 20-30+ beats
   - Comprehensive deep-dive
   - Cover architecture, components, implementation details
   - Include multiple code examples and diagrams

3. Promotional version (<repository-name>_promo.json):
   - 15-25 beats
   - Steve Jobs keynote style
   - Dramatic pacing, build anticipation
   - Focus on benefits and transformation
   - Inspire users to try the tool

All files must pass mulmoScriptSchema.safeParse() validation.

Save files in the current directory.
```

### Step 2: Validate MulmoScripts

After generating, validate all three files exist and are valid JSON.

### Step 3: Generate Video and PDF for Standard Version

```bash
npx mulmocast movie <repository-name>.json
npx mulmocast pdf <repository-name>.json
```

### Step 4: Generate Video and PDF for Detailed Version

```bash
npx mulmocast movie <repository-name>_detail.json
npx mulmocast pdf <repository-name>_detail.json
```

### Step 5: Generate Video and PDF for Promotional Version

```bash
npx mulmocast movie <repository-name>_promo.json
npx mulmocast pdf <repository-name>_promo.json
```

## Output Files Summary

**Standard Version:**
- `<repo>.json` - Standard MulmoScript (8-12 beats)
- `output/<repo>/<repo>.mp4` - Video (~2-5 min)
- `output/<repo>/<repo>_slide.pdf` - PDF slide

**Detailed Version:**
- `<repo>_detail.json` - Detailed MulmoScript (20-30+ beats)
- `output/<repo>_detail/<repo>_detail.mp4` - Video (~10-20 min)
- `output/<repo>_detail/<repo>_detail_slide.pdf` - PDF slide

**Promotional Version:**
- `<repo>_promo.json` - Promotional MulmoScript (15-25 beats)
- `output/<repo>_promo/<repo>_promo.mp4` - Video (~5-10 min)
- `output/<repo>_promo/<repo>_promo_slide.pdf` - PDF slide

## Use Cases

- **Standard**: Quick intro for new users, README video, conference lightning talks
- **Detailed**: Technical documentation, onboarding developers, training materials
- **Promo**: Product launch, marketing, social media, investor presentations

## Notes

- Ensure mulmocast CLI is installed (`npm install -g mulmocast`)
- Required API keys must be configured (OPENAI_API_KEY for TTS/images)
- Video generation may take several minutes depending on beat count
- Promotional version uses dramatic pacing for maximum impact
