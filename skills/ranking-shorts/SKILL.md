---
name: ranking-shorts
description: Create "Top 3" countdown YouTube Shorts — 3-beat ranking format with number badges (18-25 seconds)
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch, mcp__playwright__browser_navigate, mcp__playwright__browser_snapshot, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_evaluate, mcp__playwright__browser_close, mcp__playwright__browser_install
user-invocable: true
---

# /ranking-shorts — 「Top 3」リスト型 YouTube Shorts

複数ニュースをカウントダウン形式でまとめ、「どれが一番ヤバい？」でコメントを誘発するリスト型。

---

## Quick Reference

| Setting | Value |
|---------|-------|
| Canvas | 1080 x 1920 (portrait 9:16) |
| Target duration | **18-25 seconds** |
| Beats | **3 beats** (#3 + #2 + #1) |
| Visual | `imagePrompt` + `html_tailwind` animation (ALL beats) |
| TTS | Kotodama, voiceId: `jikkyo_baby` |
| Image | Google, model: `gemini-3.1-flash-image-preview` |
| BGM | `theme001.mp3`, volume 0.12 |

### news-shorts との違い

| | news-shorts | ranking-shorts |
|---|---|---|
| ビート数 | 2-3 (標準3) | **3** (固定) |
| 尺 | 18-50秒 | **18-25秒** |
| 構造 | 速報→意味→結論 | **#3→#2→#1 カウントダウン** |
| 核心 | 深さ・権威性 | **カバレッジ幅・カウントダウン** |
| ルール | 1本1ニュース | **意図的に複数ニュース** |
| 使い分け | 1ニュース深掘り | **複数ニュースまとめ** |

---

## Content Strategy

### [MUST] Content pillar

This channel focuses on **「日本人の財布に直結する国際経済ニュース」**. All topic selection must align: financial crises, currency risk, trade conflicts, energy security — always with a Japan impact angle.

### [MUST] Topic selection — ranking-shorts に最適なネタ

ranking-shorts は **複数ニュースのまとめ** が核心。以下のパターンが最適:

1. **今週のヤバいニュース Top 3** — 週次まとめ
2. **○○に影響する3つの出来事** — テーマ別まとめ (例: 円安に効く3大ニュース)
3. **知らないとヤバい3つの数字** — 数字フォーカス
4. **○○業界の激変 Top 3** — 業界別まとめ

**避けるべきネタ**: 1ニュースの深掘り(→ news-shorts)、2つの比較(→ versus-shorts)、4つ以上(25秒を超える)

### [MUST] カウントダウン構造

#3 → #2 → #1 の順に、インパクトが大きくなるように配置。#1 が最大のクライマックス。

### [MUST] No duplicate topics / Upload timing

news-shorts と同じルールを適用。

---

## Phase 1: Research

### Input sources

- **URL**: Fetch with WebFetch first. Fallback to Playwright MCP if 403/paywalled/JS-heavy.
- **Article text**: Work directly from provided text.
- **WebSearch**: Supplement with additional context.

Extract: **3つのニュース** をインパクト順にランク付け + 各ニュースの要点1文 + 日本への影響。

---

## Phase 2: Script Structure — 「#3→#2→#1」カウントダウン型

### [MUST] 3ビート構成（18-25秒）

| パート | 秒数 | 内容 | ビート |
|--------|------|------|--------|
| Hook + #3 | ~6-8秒 | 「今週のヤバいニュースTop3」+ 第3位 | Beat 1 |
| #2 | ~6-8秒 | 第2位 + インパクト | Beat 2 |
| #1 + CTA | ~6-8秒 | 第1位(最大) + 「どれが一番ヤバい？」 | Beat 3 |

### [MUST] ナレーションテンプレート

```
Beat 1: 今週のヤバいニュース、トップ3。第3位、[要点]。
Beat 2: 第2位、[要点]。[インパクト]。
Beat 3: そして第1位、[最大インパクト]。[結論]。どれが一番ヤバいと思いますか？
```

### [MUST] 黄金ルール

1. **各ニュースは1-2文** — 詳細説明はしない。インパクトだけ伝える
2. **#1 が最大** — カウントダウンの醍醐味。#3→#2→#1 と盛り上がる構成
3. **「どれが一番ヤバい？」で終わる** — コメント誘導
4. **背景説明なし** — 即ランキング

### [MUST] Japanese captions

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

Rules:
- `texts` takes precedence over auto-split
- **1行最大9文字** — 半角数字・英字も1文字としてカウント
- **1セグメント2-3行** — `\n` で改行
- **改行前の句読点は不要**
- `text` is still used for TTS narration; `texts` controls only caption display
- **[MUST] text と texts の内容一致**
- **TTS読み間違い対策**: `text`（読み上げ用）で漢字の読み間違いが起きる場合はひらがなにする（例: 市場→しじょう）。`texts`（字幕用）は漢字のままでよい
- `texts` supports `<span>` tags for keyword color highlighting:
  - Red (`#EF4444`) for alarming/impactful keywords
  - Yellow (`#F59E0B`) for key terms/proper nouns
  - Keep highlighting surgical — **1-2 keywords per segment max**

#### Generate command

Use `-c ja` option: `npx mulmocast@latest movie ... -c ja`

---

## Phase 3: Title & Metadata

### [MUST] Title optimization — タイトル構築の黄金ルール

- **First 15 characters are critical**: Shorts feed truncates titles.
- **「Top 3」「ヤバい3選」** 等のリスト感を出す
- **日本の企業名・権威ある人物名** を含める
- **具体的な金額（兆円・万円・%）** — 最初の15文字以内に入れる
- **No English subtitles**

### [MUST] Description

~200 character summary. Include 3-5 searchable SEO keywords.

### [MUST] Tags

Topic-specific + category (`経済ニュース,投資,金融`) + channel (`mulmocast`) tags.

---

## Phase 4: Visual Design

### All beats use `imagePrompt` + `html_tailwind` animation

Every beat has:
1. One AI-generated background image (defined in `imageParams.images`)
2. HTML overlay with text/data
3. MulmoAnimation script for motion

#### Animation rendering modes

- `"animation": { "movie": true }` — CDP screencast mode, ~7-8x faster rendering (recommended)
- `"animation": { "movie": true }` — frame-by-frame mode (slower but still works)

#### Alternative: Swipe Elements

Instead of `html` + `script` for animation, you can use `swipeElements` as a simpler alternative for slide-based transitions. See the MulmoScript schema for details.

### [MUST] Image reference — `image:` URL scheme

```html
<img src='image:bg_xxx' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.7)' />
```

### [MUST] Background image motion variety

| Effect | Animation values |
|--------|-----------------|
| Zoom in | `{ scale: [1.0, 1.15] }` |
| Zoom out | `{ scale: [1.1, 1.0] }` |
| Pan left | `{ translateX: [0, -30] }` |
| Pan right | `{ translateX: [-30, 0] }` |

Beat 1: zoom in, Beat 2: pan left, Beat 3: zoom out.

### [MUST] Number badge design

| Rank | Badge size | Badge color | Extra |
|------|-----------|-------------|-------|
| #3 | 160px | 赤 (`rgba(239,68,68,0.95)`) | なし |
| #2 | 140px | 赤 (`rgba(239,68,68,0.95)`) | なし |
| #1 | 160px | 赤 (`rgba(239,68,68,0.95)`) | 金ボーダー `#F59E0B` 4px + box-shadow glow |

### Beat 1: Hook + #3 — 「今週のヤバいニュース」+ 第3位

Frame 0 で「今週のヤバいニュース」と「3」バッジが即表示。

#### レイアウト構造

```
┌─────────────────────┐
│                     │
│  「今週のヤバい       │  ← 黄色36px, frame 0表示
│   ニュース」         │
│                     │
│      ┌───┐          │
│      │ 3 │          │  ← 赤丸160px, frame 0表示
│      └───┘          │
│                     │
│  ┌───────────────┐  │
│  │ ニュースカード   │  │  ← フェードイン
│  └───────────────┘  │
│                     │
│  詳細テキスト        │  ← stagger reveal
│                     │
└─────────────────────┘
```

#### HTML テンプレート

```html
<div class='h-full w-full overflow-hidden relative bg-black'>
  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>
    <img src='image:bg_rank3' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.7)' />
  </div>
  <div style='position:absolute;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.5) 100%)'></div>
  <div style='position:absolute;top:50%;left:40px;right:40px;transform:translateY(-50%);text-align:center'>
    <div style='color:#F59E0B;font-size:36px;font-weight:900;margin-bottom:20px;text-shadow:0 4px 16px rgba(0,0,0,0.9)'>今週のヤバいニュース</div>
    <div style='display:inline-block;background:rgba(239,68,68,0.95);width:160px;height:160px;border-radius:50%;line-height:160px;text-align:center;margin-bottom:24px'>
      <span style='color:white;font-size:96px;font-weight:900'>3</span>
    </div>
    <div id='r1' style='opacity:0;background:rgba(0,0,0,0.6);border-left:4px solid #EF4444;padding:20px 24px;border-radius:8px;margin-bottom:16px;text-align:left'>
      <div style='color:#EF4444;font-size:24px;font-weight:bold'>第3位</div>
      <div style='color:white;font-size:32px;font-weight:900;margin-top:6px;line-height:1.3'>ニュースの要点</div>
    </div>
    <div id='r2' style='opacity:0;color:white;font-size:28px;font-weight:bold;line-height:1.4;text-shadow:0 2px 8px rgba(0,0,0,0.8)'>補足テキスト</div>
  </div>
</div>
```

#### Animation script

```javascript
const animation = new MulmoAnimation();
animation.animate('#wrap', { scale: [1.0, 1.15] }, { start: 0, end: 'auto', easing: 'linear' });
animation.stagger('#r{i}', 2, { opacity: [0,1], translateY: [30,0] }, { start: 0.5, interval: 0.6, duration: 0.4, easing: 'easeOut' });
```

### Beat 2: #2 — 第2位

#### レイアウト構造

```
┌─────────────────────┐
│                     │
│      ┌───┐          │
│      │ 2 │          │  ← 赤丸140px
│      └───┘          │
│                     │
│  ┌───────────────┐  │
│  │ データカード1   │  │  ← stagger reveal
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ データカード2   │  │  ← stagger reveal
│  └───────────────┘  │
│                     │
└─────────────────────┘
```

#### HTML テンプレート

```html
<div class='h-full w-full overflow-hidden relative bg-black'>
  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>
    <img src='image:bg_rank2' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.5)' />
  </div>
  <div id='badge' style='opacity:0;position:absolute;top:80px;left:50%;transform:translateX(-50%);text-align:center'>
    <div style='display:inline-block;background:rgba(239,68,68,0.95);width:140px;height:140px;border-radius:50%;line-height:140px;text-align:center'>
      <span style='color:white;font-size:84px;font-weight:900'>2</span>
    </div>
  </div>
  <div style='position:absolute;top:280px;left:40px;right:40px'>
    <div id='r1' style='opacity:0;background:rgba(0,0,0,0.6);border-left:4px solid #F59E0B;padding:20px 24px;border-radius:8px;margin-bottom:16px'>
      <div style='color:#F59E0B;font-size:24px;font-weight:bold'>第2位</div>
      <div style='color:white;font-size:32px;font-weight:900;margin-top:6px;line-height:1.3'>ニュースの要点</div>
    </div>
    <div id='r2' style='opacity:0;background:rgba(0,0,0,0.6);border-left:4px solid #94A3B8;padding:20px 24px;border-radius:8px;margin-bottom:16px'>
      <div style='color:#94A3B8;font-size:22px'>インパクト</div>
      <div style='color:white;font-size:28px;font-weight:900;margin-top:6px;line-height:1.4'>影響の内容</div>
    </div>
  </div>
</div>
```

#### Animation script

```javascript
const animation = new MulmoAnimation();
animation.animate('#wrap', { translateX: [0, -30] }, { start: 0, end: 'auto', easing: 'linear' });
animation.animate('#badge', { opacity: [0,1], scale: [1.5,1.0] }, { start: 0.2, end: 0.6, easing: 'easeOut' });
animation.stagger('#r{i}', 2, { opacity: [0,1], translateX: [-20,0] }, { start: 0.5, interval: 0.7, duration: 0.3, easing: 'easeOut' });
```

### Beat 3: #1 + CTA — 第1位（最大インパクト）

#1 バッジは金ボーダー + box-shadow glow で特別感を演出。

#### レイアウト構造

```
┌─────────────────────┐
│                     │
│      ┌───┐          │
│      │ 1 │          │  ← 赤丸160px + 金ボーダー + glow
│      └───┘          │
│                     │
│  ┌───────────────┐  │
│  │ ニュースカード   │  │  ← 黄ボーダー
│  └───────────────┘  │
│                     │
│  結論テキスト        │
│                     │
│  ┌───────────────┐  │
│  │ どれが一番       │  │  ← CTA
│  │ ヤバい？         │  │
│  └───────────────┘  │
│                     │
└─────────────────────┘
```

#### HTML テンプレート

```html
<div class='h-full w-full overflow-hidden relative bg-black'>
  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>
    <img src='image:bg_rank1' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.5)' />
  </div>
  <div id='badge' style='opacity:0;position:absolute;top:80px;left:50%;transform:translateX(-50%);text-align:center'>
    <div style='display:inline-block;background:rgba(239,68,68,0.95);width:160px;height:160px;border-radius:50%;line-height:160px;text-align:center;border:4px solid #F59E0B;box-shadow:0 0 30px rgba(245,158,11,0.6)'>
      <span style='color:white;font-size:96px;font-weight:900'>1</span>
    </div>
  </div>
  <div style='position:absolute;top:300px;left:40px;right:40px'>
    <div id='r1' style='opacity:0;background:rgba(0,0,0,0.6);border:2px solid #F59E0B;border-radius:16px;padding:24px;margin-bottom:16px'>
      <div style='color:#EF4444;font-size:24px;font-weight:bold'>第1位</div>
      <div style='color:white;font-size:34px;font-weight:900;margin-top:8px;line-height:1.3'>最大インパクトのニュース</div>
    </div>
    <div id='r2' style='opacity:0;color:white;font-size:28px;font-weight:bold;line-height:1.4;margin-bottom:16px;text-shadow:0 2px 8px rgba(0,0,0,0.8)'>結論テキスト</div>
    <div id='r3' style='opacity:0;background:rgba(239,68,68,0.15);border:2px solid #F59E0B;border-radius:16px;padding:28px;text-align:center'>
      <div style='color:#F59E0B;font-size:36px;font-weight:900'>どれが一番ヤバい？</div>
      <div style='color:#94A3B8;font-size:24px;margin-top:8px'>コメントで教えてください</div>
    </div>
  </div>
</div>
```

#### Animation script

```javascript
const animation = new MulmoAnimation();
animation.animate('#wrap', { scale: [1.1, 1.0] }, { start: 0, end: 'auto', easing: 'linear' });
animation.animate('#badge', { opacity: [0,1], scale: [1.5,1.0] }, { start: 0.2, end: 0.7, easing: 'easeOut' });
animation.stagger('#r{i}', 3, { opacity: [0,1], translateY: [30,0] }, { start: 0.5, interval: 0.7, duration: 0.4, easing: 'easeOut' });
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

### MulmoScript JSON — Complete Sample

```json
{
  "$mulmocast": { "version": "1.1" },
  "lang": "ja",
  "canvasSize": { "width": 1080, "height": 1920 },
  "title": "今週ヤバいニュースTop3 — 円安・○○・△△",
  "description": "...",
  "references": [
    { "url": "...", "title": "...", "type": "article" },
    { "url": "...", "title": "...", "type": "article" },
    { "url": "...", "title": "...", "type": "article" }
  ],
  "speechParams": {
    "provider": "kotodama",
    "speakers": { "Presenter": { "provider": "kotodama", "voiceId": "jikkyo_baby" } }
  },
  "audioParams": {
    "bgm": { "kind": "url", "url": "https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/theme001.mp3" },
    "bgmVolume": 0.12
  },
  "captionParams": {
    "lang": "ja",
    "bottomOffset": 20,
    "captionSplit": "estimate",
    "textSplit": { "type": "delimiters", "delimiters": ["。", "！", "？", ".", "!", "?"] },
    "styles": ["font-size: 84px", "text-align: left", "font-family: 'Hiragino Sans', 'Noto Sans JP', sans-serif", "font-weight: 900", "letter-spacing: 2px", "color: #F59E0B", "background: transparent", "-webkit-text-stroke: 6px white", "text-shadow: none"]
  },
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
  },
  "imageParams": {
    "provider": "google",
    "model": "gemini-3.1-flash-image-preview",
    "images": {
      "bg_rank3": {
        "type": "imagePrompt",
        "prompt": "#3ニュースの描写, BRIGHT WELL-LIT SCENE, high key lighting, vivid saturated colors, photorealistic, vertical composition 9:16"
      },
      "bg_rank2": {
        "type": "imagePrompt",
        "prompt": "#2ニュースの描写, BRIGHT WELL-LIT SCENE, high key lighting, vivid saturated colors, photorealistic, vertical composition 9:16"
      },
      "bg_rank1": {
        "type": "imagePrompt",
        "prompt": "#1ニュースの描写, BRIGHT WELL-LIT SCENE, high key lighting, vivid saturated colors, photorealistic, vertical composition 9:16"
      }
    }
  },
  "beats": [
    {
      "text": "今週のヤバいニュース、トップ3。第3位、ニュース要点。",
      "texts": [
        "今週のヤバいニュース\nトップ3",
        "第3位\n<span style='color:#EF4444'>要点</span>"
      ],
      "speaker": "Presenter",
      "image": {
        "type": "html_tailwind",
        "html": [
          "<div class='h-full w-full overflow-hidden relative bg-black'>",
          "  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>",
          "    <img src='image:bg_rank3' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.7)' />",
          "  </div>",
          "  <div style='position:absolute;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.5) 100%)'></div>",
          "  <div style='position:absolute;top:50%;left:40px;right:40px;transform:translateY(-50%);text-align:center'>",
          "    <div style='color:#F59E0B;font-size:36px;font-weight:900;margin-bottom:20px;text-shadow:0 4px 16px rgba(0,0,0,0.9)'>今週のヤバいニュース</div>",
          "    <div style='display:inline-block;background:rgba(239,68,68,0.95);width:160px;height:160px;border-radius:50%;line-height:160px;text-align:center;margin-bottom:24px'>",
          "      <span style='color:white;font-size:96px;font-weight:900'>3</span>",
          "    </div>",
          "    <div id='r1' style='opacity:0;background:rgba(0,0,0,0.6);border-left:4px solid #EF4444;padding:20px 24px;border-radius:8px;margin-bottom:16px;text-align:left'>",
          "      <div style='color:#EF4444;font-size:24px;font-weight:bold'>第3位</div>",
          "      <div style='color:white;font-size:32px;font-weight:900;margin-top:6px;line-height:1.3'>ニュースの要点</div>",
          "    </div>",
          "    <div id='r2' style='opacity:0;color:white;font-size:28px;font-weight:bold;line-height:1.4;text-shadow:0 2px 8px rgba(0,0,0,0.8)'>補足テキスト</div>",
          "  </div>",
          "</div>"
        ],
        "script": [
          "const animation = new MulmoAnimation();",
          "animation.animate('#wrap', { scale: [1.0, 1.15] }, { start: 0, end: 'auto', easing: 'linear' });",
          "animation.stagger('#r{i}', 2, { opacity: [0,1], translateY: [30,0] }, { start: 0.5, interval: 0.6, duration: 0.4, easing: 'easeOut' });"
        ],
        "animation": { "movie": true }
      }
    },
    {
      "text": "第2位、ニュース要点。インパクト。",
      "texts": [
        "第2位\n<span style='color:#F59E0B'>要点</span>",
        "インパクト"
      ],
      "speaker": "Presenter",
      "image": {
        "type": "html_tailwind",
        "html": [
          "<div class='h-full w-full overflow-hidden relative bg-black'>",
          "  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>",
          "    <img src='image:bg_rank2' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.5)' />",
          "  </div>",
          "  <div id='badge' style='opacity:0;position:absolute;top:80px;left:50%;transform:translateX(-50%);text-align:center'>",
          "    <div style='display:inline-block;background:rgba(239,68,68,0.95);width:140px;height:140px;border-radius:50%;line-height:140px;text-align:center'>",
          "      <span style='color:white;font-size:84px;font-weight:900'>2</span>",
          "    </div>",
          "  </div>",
          "  <div style='position:absolute;top:280px;left:40px;right:40px'>",
          "    <div id='r1' style='opacity:0;background:rgba(0,0,0,0.6);border-left:4px solid #F59E0B;padding:20px 24px;border-radius:8px;margin-bottom:16px'>",
          "      <div style='color:#F59E0B;font-size:24px;font-weight:bold'>第2位</div>",
          "      <div style='color:white;font-size:32px;font-weight:900;margin-top:6px;line-height:1.3'>ニュースの要点</div>",
          "    </div>",
          "    <div id='r2' style='opacity:0;background:rgba(0,0,0,0.6);border-left:4px solid #94A3B8;padding:20px 24px;border-radius:8px;margin-bottom:16px'>",
          "      <div style='color:#94A3B8;font-size:22px'>インパクト</div>",
          "      <div style='color:white;font-size:28px;font-weight:900;margin-top:6px;line-height:1.4'>影響の内容</div>",
          "    </div>",
          "  </div>",
          "</div>"
        ],
        "script": [
          "const animation = new MulmoAnimation();",
          "animation.animate('#wrap', { translateX: [0, -30] }, { start: 0, end: 'auto', easing: 'linear' });",
          "animation.animate('#badge', { opacity: [0,1], scale: [1.5,1.0] }, { start: 0.2, end: 0.6, easing: 'easeOut' });",
          "animation.stagger('#r{i}', 2, { opacity: [0,1], translateX: [-20,0] }, { start: 0.5, interval: 0.7, duration: 0.3, easing: 'easeOut' });"
        ],
        "animation": { "movie": true }
      }
    },
    {
      "text": "そして第1位、最大インパクト。結論。どれが一番ヤバいと思いますか？",
      "texts": [
        "そして第1位",
        "<span style='color:#EF4444'>最大インパクト</span>",
        "結論",
        "どれが一番\nヤバいと思いますか？"
      ],
      "speaker": "Presenter",
      "image": {
        "type": "html_tailwind",
        "html": [
          "<div class='h-full w-full overflow-hidden relative bg-black'>",
          "  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>",
          "    <img src='image:bg_rank1' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.5)' />",
          "  </div>",
          "  <div id='badge' style='opacity:0;position:absolute;top:80px;left:50%;transform:translateX(-50%);text-align:center'>",
          "    <div style='display:inline-block;background:rgba(239,68,68,0.95);width:160px;height:160px;border-radius:50%;line-height:160px;text-align:center;border:4px solid #F59E0B;box-shadow:0 0 30px rgba(245,158,11,0.6)'>",
          "      <span style='color:white;font-size:96px;font-weight:900'>1</span>",
          "    </div>",
          "  </div>",
          "  <div style='position:absolute;top:300px;left:40px;right:40px'>",
          "    <div id='r1' style='opacity:0;background:rgba(0,0,0,0.6);border:2px solid #F59E0B;border-radius:16px;padding:24px;margin-bottom:16px'>",
          "      <div style='color:#EF4444;font-size:24px;font-weight:bold'>第1位</div>",
          "      <div style='color:white;font-size:34px;font-weight:900;margin-top:8px;line-height:1.3'>最大インパクトのニュース</div>",
          "    </div>",
          "    <div id='r2' style='opacity:0;color:white;font-size:28px;font-weight:bold;line-height:1.4;margin-bottom:16px;text-shadow:0 2px 8px rgba(0,0,0,0.8)'>結論テキスト</div>",
          "    <div id='r3' style='opacity:0;background:rgba(239,68,68,0.15);border:2px solid #F59E0B;border-radius:16px;padding:28px;text-align:center'>",
          "      <div style='color:#F59E0B;font-size:36px;font-weight:900'>どれが一番ヤバい？</div>",
          "      <div style='color:#94A3B8;font-size:24px;margin-top:8px'>コメントで教えてください</div>",
          "    </div>",
          "  </div>",
          "</div>"
        ],
        "script": [
          "const animation = new MulmoAnimation();",
          "animation.animate('#wrap', { scale: [1.1, 1.0] }, { start: 0, end: 'auto', easing: 'linear' });",
          "animation.animate('#badge', { opacity: [0,1], scale: [1.5,1.0] }, { start: 0.2, end: 0.7, easing: 'easeOut' });",
          "animation.stagger('#r{i}', 3, { opacity: [0,1], translateY: [30,0] }, { start: 0.5, interval: 0.7, duration: 0.4, easing: 'easeOut' });"
        ],
        "animation": { "movie": true }
      }
    }
  ]
}
```

### Generate movie

**[MUST]** Always use `-o` for unique output directory:

```bash
npx mulmocast@latest movie scripts/YYYYMMDD/{topic}/script.json -o output/{topic} -c ja
```

### Quality checklist

1. **18-25 seconds** total?
2. **3ビート** (#3 + #2 + #1)?
3. **カウントダウン順** (#3→#2→#1、インパクト昇順)?
4. **Number badge** が各ビートに表示?
5. **#1 に金ボーダー + glow**?
6. **各ニュースは1-2文** に収めている?
7. **「どれが一番ヤバい？」で終わる**?
8. **背景説明なし**? (即ランキング)
9. **Beat 1 タイトル+バッジ** frame 0 で表示?
10. **`image:` scheme** used for img src?
11. **Japan impact angle** clear?
12. **タイトル最初15文字に日本企業名 + 金額**?
13. **text と texts の内容一致**?
14. **TTS読み間違い対策**? (市場→しじょう 等)
15. **キャプションスタイル**: 黄色文字+白縁取り+背景なし?

### Upload

Wait for user confirmation before uploading. Use:

```bash
node ${CLAUDE_SKILL_DIR}/../../scripts/yt-upload.mjs \
  --file "output/{topic}/script_ja.mp4" \
  --title "タイトル #Shorts" \
  --description "..." \
  --tags "tag1,tag2,tag3" \
  --privacy public
```
