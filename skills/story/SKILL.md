---
name: story
description: Create high-quality MulmoScript through structured multi-phase creative process
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch, mcp__playwright__browser_navigate, mcp__playwright__browser_snapshot, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_evaluate, mcp__playwright__browser_close, mcp__playwright__browser_install
user-invocable: true
---

# /story — Structured MulmoScript Creation

Create compelling MulmoScript through a structured creative process. Present Topic Brief + Beat Outline + Narrations + Visual plan to the user, then assemble the final JSON.

**Key principle**: Separate *what to say* (narration) from *how to show it* (visuals). Never generate both simultaneously.

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
2. **Playwright MCP (fallback)**: `browser_navigate` + `browser_snapshot`. Close with `browser_close` after all browser operations (fetching + image collection).
3. **WebSearch (supplement)**: Gather additional context regardless of the primary fetch method.

If the page has pagination, **fetch ALL pages** before proceeding.

### Conduct deep research

- For URLs: Extract main arguments, key data points, quotes, and structure
- For topics: Search 3-5 sources, cross-reference facts
- For files: Analyze content, identify themes

### Collect visual assets

During research, actively download real images. **Real images > AI-generated** for recognizable subjects.

Store in `output/images/{scriptBasename}/`:
```bash
mkdir -p output/images/{scriptBasename}
curl -fL -o output/images/{scriptBasename}/{name}.jpg "URL"
```

If using Playwright, collect image URLs with `browser_evaluate`:
```javascript
() => Array.from(document.querySelectorAll('img')).filter(img => img.naturalWidth > 200).map(img => ({src: img.src, alt: img.alt || ''}))
```

### Present Topic Brief for approval

```text
## Topic Brief

**Subject**: [one line]
**Target audience**: [who]
**Tone**: [professional / conversational / energetic / serious]
**Orientation**: [landscape (1280×720) / portrait (1080×1920)]
**Key insights** (3-5):
1. ...

**Suggested theme**: [corporate / pop / warm / creative / minimal / dark]
**Collected images** (N found):
- [description]: [local path]
```

Ask the user about orientation. Default to **landscape** (1280×720) for presentations and standard videos. Use **portrait** (1080×1920) for short-form content (TikTok, Reels, Shorts, Stories).

### Theme-to-Content Matching

**Default to light/bright themes.** Dark theme is only for explicitly technical/developer content.

| Content Type | Theme | Background |
|-------------|-------|-----------|
| Business news, financial data | corporate (DEFAULT) | Light |
| Pop culture, entertainment | pop | Light |
| Education, tutorials | warm | Light |
| Academic, research | minimal | Light |
| Startups, design | creative | Dark |
| Tech talks, developer content | dark | Dark |

---

## Phase 2: Story Structure

### Determine scale

| Source length | Beat count | Structure |
|--------------|-----------|-----------|
| Short (1 article) | 3-8 beats | HOOK → SECTIONS → CLOSE |
| Medium (long article) | 8-15 beats | HOOK → (SECTION_INTRO → BEATS) × N → CLOSE |
| Long (report, multi-chapter) | 15-25 beats | HOOK → (CHAPTER → BEATS) × N → CLOSE |

When user asks for condensed/few slides, aim for 3-5 dense beats.

**Note**: For YouTube Shorts news videos, use the dedicated `/news-shorts` skill instead of `/story`.

### Present Beat Outline for approval

```text
## Beat Outline (N beats)

| # | Tag | Summary |
|---|-----|---------|
| 1 | HOOK | ... |
| N | CLOSE | ... |
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

### Present narrations for approval

---

## Phase 4: Visual Design

### Theme selection

Run `npx mulmocast@latest tool info themes --format json` to get all theme definitions, then embed the chosen theme object in `slideParams.theme`.

### Color scheme discipline

**Follow a restrained color palette.** Too many colors creates visual noise.

1. **Pick 1 base color per presentation** (usually `primary`): Use for headings, sidebars, badges, dividers. Creates visual unity.
2. **Add 1-2 highlight colors sparingly**: `danger`/`warning` only for alarming data; `success` only for positive metrics. Target **specific words or values**, not entire sections.
3. **Section sidebars share the base color**: Don't assign different colors to each sidebar — use `primary` for all. Differentiation comes from label text.
4. **Inline `{color:text}` is surgical**: Highlight 1-2 key terms per bullet. Default text color handles the rest.
5. **Metrics encode meaning consistently**: Green=positive, red=negative, primary=neutral. Don't use 4 colors for 4 metrics unless each encodes different meaning.

**BAD** (rainbow sidebars):
```json
{ "type": "section", "label": "A", "color": "primary" },
{ "type": "section", "label": "B", "color": "accent" },
{ "type": "section", "label": "C", "color": "warning" }
```

**GOOD** (unified base + surgical accent):
```json
{ "type": "section", "label": "A", "color": "primary" },
{ "type": "section", "label": "B", "color": "primary" },
{ "type": "section", "label": "C", "color": "primary" }
```
Then inside bullets: `"Key point about {danger:critical risk} and normal context"`

### Slide density by beat count

| Beat count | Density | Approach |
|-----------|---------|----------|
| 3-5 beats | Maximum | Pack each slide like a cheat sheet. Use split + multiple sections, nested bullets, tables, metrics. Every pixel should carry information. |
| 6-10 beats | Standard | 3-5 bullet points per slide. Use split layout with image/chart in one panel and text in the other. Fill space with imageRef or callout blocks. |
| 11+ beats | Relaxed | Focus on one key point per slide. Generous whitespace. Use title/bigQuote for section breaks. |

**Fill space with visuals**: In any density, if a panel has room, add `imageRef`, `imagePrompt`, `chart`, or `mermaid`. Never leave panels empty.

### Layout selection guide

| Content Type | Recommended Layout |
|-------------|-------------------|
| Opening/closing | `title` or `bigQuote` |
| Dense information (DEFAULT) | `split` with content blocks |
| Numbers/KPIs | `stats` or `split` with `metric` blocks |
| Steps/process | `columns` or `timeline` |
| Compare/contrast | `comparison` |
| Data tables | `table` or `split` with `table` block |

### DSL reference and patterns

For layout/block specifications, **Read** `references/slide_dsl_reference.md` at the plugin root.

For design pattern examples (dense slides, charts, mermaid), **Read** `references/slide_patterns.md` at the plugin root.

### Image embedding

Define images in `imageParams.images`, then reference with `imageRef` blocks in slide content:
```json
{ "type": "imageRef", "ref": "keyVisual", "alt": "Description", "fit": "contain" }
```

**Path formula**: From `scripts/samples/` to `output/images/` = `../../output/images/{basename}/{filename}`.

For AI-generated images when no real counterpart exists, use `imagePrompt` in `imageParams.images` (object form — defines a named image for `imageRef` to reference):
```json
{ "type": "imagePrompt", "prompt": "Detailed description..." }
```

For image-only beats without slide layout, use `imagePrompt` as a beat-level string field (generates a standalone background image):
```json
{ "text": "Narration", "imagePrompt": "Detailed prompt..." }
```

### Animated beats (`html_tailwind` animation)

For beats that benefit from motion — cinematic intros, opening crawls, data visualizations, 3D effects — use `html_tailwind` animation instead of static slides or imagePrompt.

**Read** `references/html_animation_reference.md` at the plugin root for the full API reference (MulmoAnimation DSL, interpolate, Easing, property types).

For cinematic theme recipes (Star Wars, cyberpunk, mecha anime, film noir, synthwave, Matrix, documentary, anime opening, horror, Terminator, Dragon Ball scouter, Blade Runner, Total Recall, JARVIS), **Read** `references/cinematic_patterns.md`.

For **image animation patterns** (Ken Burns, overlay, carousel, parallax, HUD overlay on photos), see the "Image Animation Patterns" section in `references/html_animation_reference.md`. Key rules: variable must be named `animation`, wrap `<img>` in `<div>` for transforms, use relative paths from the script file (automatically resolved to `file://` at render time).

#### When to use animation

| Content Type | Visual Mode |
|-------------|-------------|
| Data, charts, structured info | `slide` (default) |
| Photographic / illustrative imagery | `imagePrompt` (static) |
| **Cinematic visuals with motion** | **`imagePrompt` + `html_tailwind` animation** |
| Cinematic intros, text crawls, transitions | `html_tailwind` animation |
| Data dashboards with animated counters | `html_tailwind` animation |
| 3D card flips, reveals, code walkthroughs | `html_tailwind` animation |

#### imagePrompt + html_tailwind animation (recommended for visual beats)

Combine AI-generated images with animation for cinematic results. Define images in `imageParams.images`, then reference the generated files in `html_tailwind` HTML. `mulmo movie` generates images before rendering video, so the files exist at render time.

**Path formula**: `../../output/images/{scriptBasename}/{imageKey}.png`

```json
{
  "imageParams": {
    "images": {
      "bg_scene": { "type": "imagePrompt", "prompt": "Cinematic description..." }
    }
  },
  "beats": [{
    "text": "Narration",
    "image": {
      "type": "html_tailwind",
      "html": [
        "<div class='h-full w-full overflow-hidden relative bg-black'>",
        "  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>",
        "    <img src='../../output/images/script/bg_scene.png' style='width:100%;height:100%;object-fit:cover' />",
        "  </div>",
        "  <div style='position:absolute;inset:0;background:linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)'></div>",
        "  <div id='text' style='opacity:0;position:absolute;bottom:120px;left:48px;right:48px'>",
        "    <h1 style='color:white;font-size:44px;font-weight:bold'>Title</h1>",
        "  </div>",
        "</div>"
      ],
      "script": [
        "const animation = new MulmoAnimation();",
        "animation.animate('#wrap', { scale: [1.0, 1.15] }, { start: 0, end: 'auto', easing: 'linear' });",
        "animation.animate('#text', { opacity: [0,1], translateY: [40,0] }, { start: 0.5, end: 1.5, easing: 'easeOut' });"
      ],
      "animation": true
    }
  }]
}
```

Tips: Use `filter:brightness(0.4)` or gradient overlays for text readability. Mix freely with static slide beats. See `references/html_animation_reference.md` § "Combining imagePrompt with html_tailwind Animation" for more patterns.

#### Animated beat structure

```json
{
  "image": {
    "type": "html_tailwind",
    "html": ["<div id='el' style='opacity:0'>...</div>"],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#el', { opacity: [0, 1], translateY: [30, 0] }, { start: 0, end: 0.5, easing: 'easeOut' });"
    ],
    "animation": true
  }
}
```

Key rules:
- `html`: HTML markup with Tailwind CSS (no `<script>` tags). Set initial styles inline (e.g., `style='opacity:0'`)
- `script`: JavaScript code (no `<script>` tags). Use `MulmoAnimation` DSL or raw `render()` + `interpolate()`
- `animation`: `true` (30fps) or `{ "fps": 15 }` for custom fps
- **Do NOT set `duration`** — it is auto-calculated from the audio length. Setting it explicitly causes audio/video desync. Only set `duration` for silent beats or fixed-length intros.
- Name the MulmoAnimation instance `animation` to enable auto-render (no manual `render()` needed)
- Use `end: 'auto'` for animations that span the entire beat duration

#### Mixing animated beats with slides

Animated beats can be freely mixed with slide beats and imagePrompt beats in the same script. When mixing, ensure `slideParams.theme` is present for any slide beats.

### Present visual plan for approval

---

## Phase 5: Assembly & Review

### Select BGM

Choose background music from the [mulmocast-media BGM catalog](https://github.com/receptron/mulmocast-media/tree/main/bgms) that matches the story mood:

| BGM | Title | Mood | Best for |
|-----|-------|------|----------|
| `story001.mp3` | Whispered Melody | smooth, piano | Calm narratives, reflective stories |
| `story002.mp3` | Rise and Shine | techno, inspiring, piano | Motivational, startup, tech innovation |
| `story003.mp3` | Chasing the Sunset | piano, inspiring | Uplifting stories, journeys, aspirations |
| `story004.mp3` | Whispering Keys | classical, ambient | Academic, research, thoughtful content |
| `story005.mp3` | Whisper of Ivory | piano solo, classical | Elegant, formal, documentary |
| `theme001.mp3` | Rise of the Flame | classical, emotional | Epic achievements, milestones, announcements |
| `vibe001.mp3` | Let It Vibe! | rap, dance | Pop culture, entertainment, energetic |
| `olympic001.mp3` | Olympic-style Theme | epic orchestral fanfare | Grand openings, celebrations, competitions |
| `morning001.mp3` | Morning Dance | morning, piano solo | Lifestyle, daily routines, light topics |

**URL pattern**: `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/{name}`

Select the BGM that best matches the tone from Phase 1's Topic Brief, and add it to `audioParams`.

### Combine narrations + visuals into MulmoScript JSON

```json
{
  "$mulmocast": { "version": "1.1" },
  "lang": "en",
  "canvasSize": { "width": 1280, "height": 720 },  // portrait: { "width": 1080, "height": 1920 }
  "title": "Title",
  "description": "Brief description",
  "references": [{ "url": "...", "title": "...", "type": "article" }],
  "speechParams": { "speakers": { "Presenter": { "voiceId": "shimmer" } } },
  "audioParams": {
    "bgm": { "kind": "url", "url": "https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/story001.mp3" },
    "bgmVolume": 0.15
  },
  "slideParams": { "theme": { } },
  "imageParams": { "provider": "google", "images": { } },
  "beats": [
    {
      "text": "Narration",
      "speaker": "Presenter",
      "image": {
        "type": "slide",
        "slide": { "layout": "...", "..." : "..." },
        "reference": "Source: ... (optional)"
      }
    }
  ]
}
```

### Add `reference` to data-citing beats

For beats showing statistics or research findings, add `"reference": "Source: ..."` to the `image` object.

### Quality checklist

1. **Hook test**: Does beat 1 grab attention?
2. **Density test**: Does every slide match the target density for its beat count?
3. **Specificity test**: Replace vague statements with concrete numbers, names, examples.
4. **Visual variety**: At least 2-3 different layout types used.
5. **Visual-narration alignment**: Each visual directly supports its narration.
6. **Image check**: Real images used for recognizable subjects; AI-generated only for abstract concepts.
7. **Schema compliance**: Version "1.1", proper beat structure.

### Write the file and present output

Generate the movie directly — `npx mulmocast@latest movie` automatically generates images and audio as well, so separate image/audio steps are unnecessary.

**[MUST]** Always use `-o` to specify a unique output directory per video so files are preserved and not overwritten. Use the topic directory name as the output directory name:

```bash
npx mulmocast@latest movie scripts/20260304/indonesia-force-majeure/script.json -o output/indonesia-force-majeure
```

The output will be:
```
output/indonesia-force-majeure/
├── script_ja.mp4
├── script_ja.mp3
├── script_studio.json
├── audio/
└── images/
```

When uploading, reference: `output/{topic}/script_ja.mp4`
