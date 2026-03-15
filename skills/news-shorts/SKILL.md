---
name: news-shorts
description: Create YouTube Shorts news video — article to published Shorts in one flow
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch, mcp__playwright__browser_navigate, mcp__playwright__browser_snapshot, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_evaluate, mcp__playwright__browser_close, mcp__playwright__browser_install
user-invocable: true
---

# /news-shorts — YouTube Shorts News Video

Create a YouTube Shorts news video from an article URL or text. One-shot flow: article → script.json → movie → upload.

---

## Quick Reference

| Setting | Value |
|---------|-------|
| Canvas | 1080 x 1920 (portrait 9:16) |
| Target duration | **≤ 50 seconds** |
| Beats | **2-3 beats** (standard: 3) |
| Visual | `imagePrompt` + `html_tailwind` animation (ALL beats) |
| TTS | Kotodama, voiceId: `jikkyo_baby` |
| Image | Google, model: `gemini-3.1-flash-image-preview` |
| BGM | `theme001.mp3`, volume 0.12 |

---

## Content Strategy

### [MUST] Content pillar

Define a clear content axis for the channel. All topic selection must align with this axis. For example, an economic news channel might focus on "personal financial impact" — always connecting events to the viewer's wallet.

### [MUST] Topic selection — viewer relevance axis

News performs poorly unless framed as "impact on the viewer". Always connect events to the audience's daily life. Pure abstract news without personal relevance should be avoided.

### [MUST] No duplicate topics

Never create two separate videos on the same news event. If there's new information, create one comprehensive video instead of splitting.

### [MUST] Title construction — first 15 characters decide everything

The first 15 characters of the title determine whether viewers tap. Include these 3 elements:

1. **Recognizable proper nouns** — company names, authority figures, or celebrities that the target audience knows. Unknown foreign names alone won't attract clicks
2. **Specific amounts** — concrete numbers (currency, percentages, quantities) within the first 15 characters
3. **Impact words** — words that make viewers think "this affects me" (e.g., bankruptcy, price hike, deficit, scandal)

#### Title quality check

| Check | Good | Bad |
|-------|------|-----|
| Recognizable name in first 15 chars? | Known company + hostile takeover | Unknown foreign company collapsed |
| Specific amount in first 15 chars? | $1.3 trillion acquisition | Semiconductor restructuring |
| "Affects my wallet" feeling? | What happens to gas prices | History of oil reserves |

---

## Phase 1: Research

### Input sources

- **URL**: Fetch with WebFetch first. Fallback to Playwright MCP if 403/paywalled/JS-heavy.
- **Article text**: Work directly from provided text.
- **WebSearch**: Supplement with additional context.

Extract: key data points, numbers, quotes, viewer-impact angle.

---

## Phase 2: Script Structure — "Breaking → Meaning → Conclusion"

### [MUST] Optimal news Shorts structure

Lead with the value of the information. Fit "Conclusion → Facts → Meaning → Question" into 2 beats.

| Part | Duration | Content | Beat |
|------|----------|---------|------|
| ① Conclusion (hook) | ~1s | One impactful sentence | Beat 1 |
| ② News facts | ~5s | What, when, who — facts only | Beat 1 |
| ③ Meaning/impact | ~10s | "In other words" — what this means. **This is the value** | Beat 2 |
| ④ Viewer question | ~3s | Comment-driving question | Beat 2 |

### [MUST] Hook patterns (first 1 second of Beat 1)

#### Pattern 1: "This is serious"
```
This news is seriously concerning.
Private credit defaults just hit the US market.
```

#### Pattern 2: "Nobody's talking about this"
```
This news is barely being reported.
China is dumping US treasury bonds.
```

#### Pattern 3: "Actually..."
```
Actually, this news is critical.
Most people are wrong about why REITs are crashing.
```

#### Pattern 4: Number impact
```
$7.9 billion in just 3 weeks.
Anthropic's revenue is exploding.
```

### [MUST] Use "In other words" in Beat 2

"In other words" (or equivalent transition) is powerful in Shorts. Use it at the start of the meaning/impact section:
```
In other words, the dollar is likely to stay strong.
That means import inflation won't stop.
```

### [MUST] Beat 2 ending — comment-driving question

End with a specific question that invites opinions:
- `Do you think the currency will keep weakening?`
- `Will interest rates go up?`
- `How are you preparing?`

### [MUST] Golden rules

1. **No background explanations** — don't explain what the Fed is. Assume knowledge. Background = instant drop-off
2. **One news per video** — no cramming. "Today's 3 biggest stories" is the worst format. "The most important news today" is correct
3. **Include specific numbers** — concreteness = retention

### [MUST] Captions

Captions are generated from the `text` field — do NOT add a `caption` field on beats (it causes schema error).

#### captionParams setup

```json
"captionParams": {
  "lang": "ja",
  "bottomOffset": 20,
  "captionSplit": "estimate",
  "textSplit": {
    "type": "delimiters",
    "delimiters": ["。", "！", "？", ".", "!", "?"]
  },
  "styles": ["font-size: 84px", "text-align: left", "font-family: 'Hiragino Sans', 'Noto Sans JP', sans-serif", "font-weight: 900", "letter-spacing: 2px", "color: #F59E0B", "background: transparent", "-webkit-text-stroke: 6px white", "text-shadow: none"]
}
```

#### Manual caption splits with `texts` array

Each element becomes one caption segment, timed proportionally to text length.

Rules:
- `texts` takes precedence over auto-split
- **Max ~9 characters per line** — bold renders half-width chars at full width
- **2-3 lines per segment** — use `\n` for line breaks. Single-line segments scroll too fast
- **Drop punctuation before line breaks** — the line break itself acts as a pause
- `text` is still used for TTS narration; `texts` controls only caption display
- **[MUST] `text` and `texts` must match in content** — every fact, number, and keyword in `text` (narration) must be covered in `texts` (captions). Segment count doesn't need to match, but content coverage must be complete
- **TTS mispronunciation fix**: If TTS mispronounces kanji, write it in hiragana in `text`. Keep kanji in `texts` (captions)
- `texts` supports `<span>` tags for keyword color highlighting:
  - Red (`#EF4444`) for alarming/impactful keywords
  - Yellow (`#F59E0B`) for key terms/proper nouns
  - Keep highlighting surgical — **1-2 keywords per segment max**

#### Generate command

Use `-c ja` option for Japanese captions: `npx mulmocast@latest movie ... -c ja`

### Beat roles

| Beat | Role | Duration |
|------|------|----------|
| 1 | **HOOK** — ① conclusion hook + ② news facts. Title + subtitle only (no data cards) | ~8-12s |
| 2–N | **BODY** — ③ meaning/impact. "In other words" transition. Data cards/tables OK | ~8-12s each |
| Last | **CLOSE** — ④ viewer question + engagement hook | ~8-12s |

Use 2-3 beats. **3 beats** is the standard structure (HOOK + BODY + CLOSE). Simple topics can use 2 beats. 4+ beats tend to exceed 50 seconds.

---

## Phase 3: Title & Metadata

### [MUST] Title optimization — CTR first

- **First 15 characters are critical**: Shorts feed truncates titles. Put the most impactful phrase first.
- **Curiosity gap**: Hint at something surprising without giving it all away.
- **Clear benefit/threat**: The viewer must instantly know "why should I care?".
- `#Shorts` is appended automatically by the upload script.

### [MUST] Description

~200 character summary of the news. Include 3-5 searchable SEO keywords naturally.

### [MUST] Tags

Include topic-specific, category, and channel tags.

---

## Phase 4: Visual Design

### All beats use `imagePrompt` + `html_tailwind` animation

Never use static slides. Every beat has:
1. One AI-generated background image (defined in `imageParams.images`)
2. HTML overlay with text/data
3. MulmoAnimation script for motion (Ken Burns, fade-ins, stagger)
4. **[MUST]** `"animation": { "movie": true }` — CDP screencast for ~7-8x faster rendering (html/script approach)
4b. For **Swipe Elements**, use `"animation": { "fps": 24 }` instead (not `movie: true`)

### Swipe Elements (v2.6.0+ — declarative animation)

Instead of `html` + `script`, use an `elements` array for declarative animation. Pure JSON, no JavaScript needed.

```json
{
  "image": {
    "type": "html_tailwind",
    "elements": [ ... ],
    "animation": { "fps": 24 }
  }
}
```

**`elements` and `html` are mutually exclusive** — cannot use both.

#### [MUST] timing is in seconds (NOT ratio)

`to.timing: [start, end]` specifies **absolute seconds**, not beat ratio.

```json
// ❌ Wrong — completes in just 1 second
"to": { "opacity": 1, "timing": [0, 1] }

// ✅ Correct — takes 12 seconds (full beat duration)
"to": { "translate": [50, 1600], "timing": [0, 12] }

// ✅ Fade-in over 1-2 seconds
"to": { "opacity": 1, "timing": [0.3, 1.5] }
```

Match timing to the beat's audio length (typically 10-12 seconds).

#### [MUST] pos vs to.translate conflict

`pos: [x, y]` internally adds `transform: translate(-50%, -50%)` for center-based positioning. However, `to.translate`/`to.rotate` animations **overwrite the entire transform**, causing position jumps.

- **Elements with movement animation** → use `x`/`y` (NOT `pos`)
- **Static elements with only opacity changes** → `pos` is fine

```json
// ❌ pos + translate → transform overwrite causes position jump
{ "pos": ["50%", "10%"], "to": { "translate": [0, 1600] } }

// ✅ x/y + translate → works correctly
{ "x": "50%", "y": "10%", "to": { "translate": [0, 1600] } }
```

#### Falling particle effects (cherry blossoms, sparkles, etc.)

Rules for elements that move across the screen:

1. **Use `x`/`y` positioning** (NOT `pos`) — avoids transform overwrite
2. **`timing: [start, 12]`** — use the full beat duration for slow movement
3. **`rotate` max ±30-60 degrees** — large rotation looks unnatural (appears to float upward)
4. **`translateY` positive values only** — gravity = downward (positive)
5. **Stagger start times** — `timing: [0, 12]`, `[1, 12]`, `[3, 12]`, `[5, 12]` for sequential starts
6. **Start from inside the screen** — `y: "5%"` to `y: "30%"`. Off-screen starts reduce visible time

```json
{ "id": "p01", "x": "8%",  "y": "5%",  "text": "🌸", "fontSize": "52px", "opacity": 0.9,
  "to": { "translate": [60, 1800], "rotate": 40, "timing": [0, 12] } },
{ "id": "p02", "x": "55%", "y": "10%", "text": "🌸", "fontSize": "40px", "opacity": 0.75,
  "to": { "translate": [-30, 1600], "rotate": -35, "timing": [2, 12] } }
```

#### Swipe Elements property reference

| Property | Description |
|----------|-------------|
| `id` | Element ID |
| `x`, `y` | Top-left based position (px or %). Use for elements with movement animation |
| `pos: [x, y]` | Center-based position. For static elements only |
| `w`, `h` | Size |
| `bc` | Background color/gradient |
| `img`, `imgFit` | Image URL, fit method |
| `text`, `fontSize`, `fontWeight`, `textColor`, `textAlign` | Text properties |
| `opacity`, `rotate`, `scale`, `translate` | Initial values |
| `cornerRadius`, `shadow`, `clip` | Decoration |
| `elements` | Child elements (nestable) |

#### to (transition animation)

```json
"to": { "opacity": 1, "translate": [0, -20], "scale": 1.2, "rotate": 10, "timing": [0.5, 2] }
```

#### loop (continuous animation)

| style | Effect | delta |
|-------|--------|-------|
| `wiggle` | Left-right swing | Angle (deg) |
| `vibrate` | Horizontal vibration | Distance (px) |
| `bounce` | Vertical bounce | Height (px) |
| `pulse` | Scale oscillation | Amplitude (e.g. 0.1) |
| `blink` | Opacity flash | — |
| `spin` | Full rotation | — |
| `shift` | Directional drift | — |

```json
"loop": { "style": "bounce", "delta": 12, "count": 0, "duration": 2.5 }
```

`to` and `loop` can be used together on the same element.

### [MUST] Beat 1 = Thumbnail — frame 0 is everything

Beat 1's first frame becomes the YouTube thumbnail. Whether viewers tap or scroll past depends entirely on this frame.

#### Thumbnail optimization rules

Beat 1 should display **title + subtitle only** over the background image. No data cards, number badges, or informational elements. Narration content is handled by captions (subtitles).

1. **Bright, vivid background image** — `filter:brightness(0.7)` minimum. Dark images get lost in the feed. Include `BRIGHT WELL-LIT SCENE`, `high key lighting`, `vivid saturated colors` in imagePrompt. Avoid `dark`, `moody`, `dramatic lighting`
1b. **[MUST] Specify target language in imagePrompt** — AI image generation tends to produce English text/signs. For Japanese scenes, include `Japanese text signs`, `Japanese language signage`, `no English text`. For specific text, use `sign reading "ガソリンスタンド"`
2. **Title with background block** — use semi-transparent color blocks (`background:rgba(239,68,68,0.85)`) for readability. Don't rely on `text-shadow` alone
3. **Max 3 colors** — primary (e.g. red) + white (text) + accent (e.g. yellow). More colors = visual noise
4. **Vertically centered** — `top:50%; transform:translateY(-50%)` for the title block. Center is more visible than top-third in thumbnails
5. **Title visible at frame 0** — `opacity:1` from the start (no fade-in). If the title isn't in the thumbnail, CTR drops

#### Layout structure

```
┌─────────────────────┐
│                     │
│   ┌───────────────┐ │
│   │ Red bg block   │ │  ← rgba(239,68,68,0.85), padding:12px 32px
│   │ Main title     │ │  ← 100-120px, white, font-weight:900
│   └───────────────┘ │
│   Subheadline       │  ← 48-56px, white, text-shadow
│                     │
└─────────────────────┘
```

#### HTML template

```html
<div class='h-full w-full overflow-hidden relative bg-black'>
  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>
    <img src='image:bg_xxx' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.7)' />
  </div>
  <div style='position:absolute;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.5) 100%)'></div>
  <div style='position:absolute;top:50%;left:40px;right:40px;transform:translateY(-50%);text-align:center'>
    <div style='display:inline-block;background:rgba(239,68,68,0.85);padding:12px 32px;border-radius:12px'>
      <span style='color:white;font-size:110px;font-weight:900;line-height:1.0;letter-spacing:4px'>Main Title</span>
    </div>
    <div style='color:white;font-size:52px;font-weight:900;line-height:1.3;margin-top:20px;text-shadow:0 4px 16px rgba(0,0,0,0.9)'>Subheadline</div>
  </div>
</div>
```

### [MUST] First 2 seconds maximum impact

Animate in subtitle at `start: 0.8`. Ken Burns effect on background image throughout.

### [MUST] Background image motion variety

Each beat should use a **different** Ken Burns effect to create visual dynamism. Avoid repeating the same motion on consecutive beats.

| Effect | Animation values |
|--------|-----------------|
| Zoom in | `{ scale: [1.0, 1.15] }` |
| Zoom out | `{ scale: [1.1, 1.0] }` |
| Pan left | `{ translateX: [0, -30] }` |
| Pan right | `{ translateX: [-30, 0] }` |
| Pan up + zoom | `{ translateY: [0, -30], scale: [1.05, 1.0] }` |

Example: Beat 1 zoom in, Beat 2 pan left, Beat 3 zoom out, Beat 4 pan right.

### Beat 2-N layout patterns

**Data comparison** (stagger reveal):
```javascript
animation.stagger('#r{i}', 3, { opacity: [0,1], translateX: [-30,0] }, { start: 0.7, interval: 0.7, duration: 0.5, easing: 'easeOut' });
```

**Bottom text reveal** (closing beat):
```javascript
animation.animate('#main', { opacity: [0,1], translateY: [40,0] }, { start: 0.5, end: 1.3, easing: 'easeOut' });
animation.animate('#footer', { opacity: [0,1] }, { start: 2.2, end: 2.9, easing: 'easeOut' });
```

### [MUST] Image reference — `image:` URL scheme

Use `image:` URL scheme to reference `imageParams.images` in html_tailwind beats. No file paths needed — mulmocast resolves them automatically.

```html
<img src='image:bg_money' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.7)' />
```

### slideParams theme (dark news theme)

```json
"slideParams": {
  "theme": {
    "colors": {
      "bg": "0F172A", "bgCard": "1E293B", "bgCardAlt": "334155",
      "text": "F8FAFC", "textMuted": "94A3B8", "textDim": "64748B",
      "primary": "EF4444", "accent": "F59E0B", "success": "16A34A",
      "warning": "EA580C", "danger": "DC2626", "info": "0891B2",
      "highlight": "EF4444"
    },
    "fonts": { "title": "Georgia", "body": "Helvetica", "mono": "Menlo" }
  }
}
```

### Animation reference

For full MulmoAnimation DSL, **Read** `${CLAUDE_SKILL_DIR}/../../references/html_animation_reference.md`.

---

## Phase 5: Assembly & Output

### Script file location

```
scripts/YYYYMMDD/{topic}/script.json
```

Use `date` command to get today's date for the directory name.

### MulmoScript JSON template

```json
{
  "$mulmocast": { "version": "1.1" },
  "lang": "ja",
  "canvasSize": { "width": 1080, "height": 1920 },
  "title": "...",
  "description": "...",
  "references": [{ "url": "...", "title": "...", "type": "article" }],
  "speechParams": {
    "provider": "kotodama",
    "speakers": { "Presenter": { "provider": "kotodama", "voiceId": "jikkyo_baby" } }
  },
  "audioParams": {
    "bgm": { "kind": "url", "url": "https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/theme001.mp3" },
    "bgmVolume": 0.12
  },
  "captionParams": { "lang": "ja", "bottomOffset": 20, "captionSplit": "estimate", "textSplit": { "type": "delimiters", "delimiters": ["。", "！", "？", ".", "!", "?"] }, "styles": ["font-size: 84px", "text-align: left", "font-family: 'Hiragino Sans', 'Noto Sans JP', sans-serif", "font-weight: 900", "letter-spacing: 2px", "color: #F59E0B", "background: transparent", "-webkit-text-stroke: 6px white", "text-shadow: none"] },
  "slideParams": { "theme": { "..." : "..." } },
  "imageParams": { "provider": "google", "model": "gemini-3.1-flash-image-preview", "images": { "bg_xxx": { "type": "imagePrompt", "prompt": "..." } } },
  "beats": [ ]
}
```

### Generate movie

**[MUST]** Always use `-o` for unique output directory:

```bash
npx mulmocast@latest movie scripts/YYYYMMDD/{topic}/script.json -o output/{topic} -c ja
```

### Quality checklist

1. **≤ 50 seconds** total?
2. **"Conclusion → Facts → Meaning → Question" structure**?
3. **Impact in the first second**? (hook pattern used)
4. **"In other words" transition** for meaning/impact?
5. **Comment-driving question** at the end?
6. **One news per video**? (no cramming)
7. **No background explanations**? (straight to the point)
8. **Specific numbers** included?
9. **Beat 1 title visible at frame 0**?
10. **`image:` scheme** used for img src (not relative paths)?
11. **Viewer impact angle** clear?
12. **Recognizable name + amount in first 15 chars of title**?
13. **`text` and `texts` content match**? (narration fully covered by captions)
14. **TTS mispronunciation handled**? (hiragana fallback for ambiguous kanji)
15. **Caption style**: colored text + white stroke + transparent background?

