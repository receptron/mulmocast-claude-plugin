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
| Beats | **2-3 beats** |
| Visual | `imagePrompt` + `html_tailwind` animation (ALL beats) |
| TTS | Kotodama, voiceId: `jikkyo_baby` |
| Image | Google |
| BGM | `theme001.mp3`, volume 0.12 |

---

## Content Strategy

### [MUST] Content pillar

This channel focuses on **「日本人の財布に直結する国際経済ニュース」**. All topic selection must align: financial crises, currency risk, trade conflicts, energy security — always with a Japan impact angle.

### [MUST] Topic selection — "日本への影響" axis

International news performs poorly unless framed as "impact on Japan / your wallet". Always connect foreign events to Japanese viewers' lives (e.g., ホルムズ封鎖 → 1ドル200円, MFS破綻 → 三井住友に飛び火). Pure foreign news without Japan angle should be avoided.

### [MUST] No duplicate topics

Never create two separate videos on the same news event. If there's new information, create one comprehensive video instead of splitting.

---

## Phase 1: Research

### Input sources

- **URL**: Fetch with WebFetch first. Fallback to Playwright MCP if 403/paywalled/JS-heavy.
- **Article text**: Work directly from provided text.
- **WebSearch**: Supplement with additional context.

Extract: key data points, numbers, quotes, Japan-impact angle.

---

## Phase 2: Script Structure (2-3 beats)

### Beat roles

| Beat | Role | Duration |
|------|------|----------|
| 1 | **HOOK** — Grab attention, show title | ~15-20s |
| 2 | **BODY** — Core facts, data, contrast | ~15-20s |
| 3 | **CLOSE** — Implication + engagement hook | ~15-20s |

For simpler topics, 2 beats (HOOK + CLOSE) is fine.

### [MUST] Beat 1 narration — pattern interrupt hook

Open with a surprising fact, counter-intuitive statement, or dramatic number. The first sentence must stop the scroll.

- Bad: `米AI企業アンソロピックが成長しています`
- Good: `わずか3週間で7900億円。アンソロピックの売上が爆発しています`

### [MUST] Last beat engagement hook

End the final beat's narration with a question or call to think (e.g., 「あなたはどう備えますか？」「コメントで教えてください」). This drives comments and engagement.

---

## Phase 3: Title & Metadata

### [MUST] Title optimization — CTR first

- **First 15 characters are critical**: Shorts feed truncates titles. Put the most impactful phrase first.
- **Curiosity gap**: Hint at something surprising without giving it all away (e.g., `二重担保で破綻` not `英MFSが二重担保で破綻し担保不足1800億円`).
- **Clear benefit/threat**: The viewer must instantly know "why should I care?" (e.g., `1ドル200円？` implies personal financial impact).
- Bad: `英住宅ローン会社MFSが破綻 — 二重担保疑惑で担保不足は最大9億ポンド`. Good: `二重担保で破綻 — 英MFS、担保不足1800億円`.
- **No English subtitles**: For Japanese-target Shorts, do NOT add `| Shadow Bank Collapse` etc. Use that space for Japanese keywords.
- `#Shorts` is appended automatically by the upload script.

### [MUST] Description

~200 character summary of the news. Include 3-5 searchable SEO keywords naturally (e.g., 円安, ホルムズ海峡, 原油価格, 日本経済).

### [MUST] Tags

Include topic-specific (`円安,ホルムズ海峡,原油`), category (`経済ニュース,投資,金融`), and channel (`mulmocast`) tags.

---

## Phase 4: Visual Design

### All beats use `imagePrompt` + `html_tailwind` animation

Never use static slides. Every beat has:
1. One AI-generated background image (defined in `imageParams.images`)
2. HTML overlay with text/data
3. MulmoAnimation script for motion (Ken Burns, fade-ins, stagger)

### [MUST] Beat 1 title layout — top 1/3, visible from frame 0

The title area occupies the **top ~1/3** of the screen. Use a top-to-bottom gradient overlay for readability.

- **Main headline**: font-size **90-100px**, `font-weight:900`, `letter-spacing:4px`, `text-shadow:0 4px 20px rgba(0,0,0,0.8)`, **opacity:1** (NO fade-in), `color:#EF4444` or theme primary. A punchy 2-6 character phrase.
- **Sub-headline**: font-size **52-56px**, `font-weight:900`, `text-shadow:0 2px 10px rgba(0,0,0,0.8)`, **opacity:1**, white. 1-2 lines.
- **Subtitle** (optional): font-size 28-30px, `opacity:0` → animate in at `start: 0.8`.
- **Badge/tag** (optional): animate in at `start: 1.5` at bottom area.

Main headline and sub-headline are **static from frame 0** (no animation). This ensures the Shorts feed preview shows a clear, readable title.

```html
<div style='position:absolute;top:80px;left:60px;right:60px;text-align:center'>
  <div style='color:#EF4444;font-size:100px;font-weight:900;line-height:1.1;letter-spacing:4px;text-shadow:0 4px 20px rgba(0,0,0,0.8)'>メインタイトル</div>
  <div style='color:white;font-size:56px;font-weight:900;line-height:1.3;margin-top:20px;text-shadow:0 2px 10px rgba(0,0,0,0.8)'>サブヘッドライン</div>
  <div id='sub' style='opacity:0;color:#F59E0B;font-size:30px;font-weight:bold;margin-top:24px'>補足テキスト</div>
</div>
```

### [MUST] First 2 seconds maximum impact

Animate in subtitle at `start: 0.8`, badge at `start: 1.5`. Ken Burns zoom on background image throughout.

### Beat 2-3 layout patterns

**Data comparison** (stagger reveal):
```javascript
animation.stagger('#r{i}', 3, { opacity: [0,1], translateX: [-30,0] }, { start: 0.7, interval: 0.7, duration: 0.5, easing: 'easeOut' });
```

**Bottom text reveal** (closing beat):
```javascript
animation.animate('#main', { opacity: [0,1], translateY: [40,0] }, { start: 0.5, end: 1.3, easing: 'easeOut' });
animation.animate('#footer', { opacity: [0,1] }, { start: 2.2, end: 2.9, easing: 'easeOut' });
```

### Image path with `-o` output

When using `-o output/{topic}`, HTML img src must reference:
```
../../../output/{topic}/images/script/{imageKey}.png
```

For scripts at `scripts/YYYYMMDD/{topic}/script.json` with `-o output/{topic}`:
- 3 levels up from `scripts/YYYYMMDD/{topic}/` → repo root
- Then down to `output/{topic}/images/script/`

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

For full MulmoAnimation DSL, **Read** `references/html_animation_reference.md`.

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
  "slideParams": { "theme": { "..." : "..." } },
  "imageParams": { "provider": "google", "images": { "bg_xxx": { "type": "imagePrompt", "prompt": "..." } } },
  "beats": [ ]
}
```

### Generate movie

**[MUST]** Always use `-o` for unique output directory:

```bash
npx mulmocast@latest movie scripts/YYYYMMDD/{topic}/script.json -o output/{topic}
```

### Quality checklist

1. **≤ 50 seconds** total?
2. **Beat 1 title** visible from frame 0 (opacity:1, no fade-in)?
3. **Pattern interrupt hook** in first sentence?
4. **Engagement hook** in last sentence?
5. **Image paths** match `-o` output directory?
6. **Japan impact angle** clear?

### Upload

Wait for user confirmation before uploading. Use:

```bash
node scripts/youtube-upload.mjs \
  --file "output/{topic}/script_ja.mp4" \
  --title "タイトル #Shorts" \
  --description "..." \
  --tags "tag1,tag2,tag3" \
  --privacy public
```

The upload script automatically handles:
- Scheduling (JST 7-9 / 15-17 windows, otherwise scheduled for next window)
- Thumbnail extraction from first frame

### Reference examples

- `scripts/20260304/indonesia-force-majeure/script.json`
- `scripts/20260304/hormuz-japan-200yen/script.json`
- `scripts/20260304/mfs-shadow-bank-detail/script.json`
