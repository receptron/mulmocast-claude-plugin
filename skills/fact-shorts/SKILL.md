---
name: fact-shorts
description: Create "Did you know?" YouTube Shorts — 2-beat loop structure with counter animation (12-18 seconds)
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch, mcp__playwright__browser_navigate, mcp__playwright__browser_snapshot, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_evaluate, mcp__playwright__browser_close, mcp__playwright__browser_install
user-invocable: true
---

# /fact-shorts — 「知ってた？」型 YouTube Shorts

衝撃的な1つの数字・事実を「知ってた？」で始めて、ループ再生を狙う最短フォーマット。

---

## Quick Reference

| Setting | Value |
|---------|-------|
| Canvas | 1080 x 1920 (portrait 9:16) |
| Target duration | **12-18 seconds** |
| Beats | **2 beats** (Fact Reveal + Meaning/Loop) |
| Visual | `imagePrompt` + `html_tailwind` animation (ALL beats) |
| TTS | Kotodama, voiceId: `jikkyo_baby` |
| Image | Google, model: `gemini-3.1-flash-image-preview` |
| BGM | `theme001.mp3`, volume 0.12 |

### news-shorts との違い

| | news-shorts | fact-shorts |
|---|---|---|
| ビート数 | 2-3 (標準3) | **2** |
| 尺 | 18-50秒 | **12-18秒** |
| 構造 | 速報→意味→結論 | **知ってた？→つまり→ループ** |
| 核心 | 深さ・権威性 | **ループリプレイ・バイラル** |
| Beat 1 | タイトル+サブタイトル | **「知ってた？」+ counter animation** |
| 使い分け | 1ニュース深掘り | **衝撃的な1つの数字/事実** |

---

## Content Strategy

### [MUST] Content pillar

This channel focuses on **「日本人の財布に直結する国際経済ニュース」**. All topic selection must align: financial crises, currency risk, trade conflicts, energy security — always with a Japan impact angle.

### [MUST] Topic selection — fact-shorts に最適なネタ

fact-shorts は **衝撃的な1つの数字** が核心。以下のパターンが最適:

1. **巨額の金額** — 「○兆円が蒸発」「○億ドルが流出」
2. **意外な割合** — 「実は○%が日本製」「○割が赤字」
3. **時間の衝撃** — 「わずか○日で」「○年ぶり」
4. **比較のギャップ** — 「日本の○倍」「世界の○%を占める」

**避けるべきネタ**: 複雑な経緯の説明が必要、比較が必要(→ versus-shorts)、複数ニュースまとめ(→ ranking-shorts)

### [MUST] ループ構造

fact-shorts の最大の武器は **ループ再生**。Beat 2 の末尾「あなたは知ってましたか？」が Beat 1 の「知ってた？」に自然に繋がり、100%+視聴を狙う。

### [MUST] No duplicate topics / Upload timing

news-shorts と同じルールを適用。

---

## Phase 1: Research

### Input sources

- **URL**: Fetch with WebFetch first. Fallback to Playwright MCP if 403/paywalled/JS-heavy.
- **Article text**: Work directly from provided text.
- **WebSearch**: Supplement with additional context.

Extract: **1つの衝撃的な数字** + その意味（日本への影響）。

---

## Phase 2: Script Structure — 「知ってた？→つまり→ループ」型

### [MUST] 2ビート構成（12-18秒）

| パート | 秒数 | 内容 | ビート |
|--------|------|------|--------|
| 知ってた？ + 数字 | ~1秒 | 「知ってた？」で注意を掴む | Beat 1 |
| ニュース要点 | ~4-5秒 | 何が起きたか。事実だけ | Beat 1 |
| つまり + 影響 | ~5-7秒 | 日本への影響を解説 | Beat 2 |
| ループトリガー | ~2秒 | 「あなたは知ってましたか？」→ 冒頭へ | Beat 2 |

### [MUST] ナレーションテンプレート

```
Beat 1: 知ってた？[衝撃数字]。[ニュース要点1-2文]。
Beat 2: つまり[日本への影響]。[結論]。あなたは知ってましたか？
```

### [MUST] 黄金ルール

1. **数字は1つに絞る** — 複数の数字を出すとインパクトが分散する
2. **「知ってた？」で始める** — 最初の1秒で好奇心を掴む
3. **「あなたは知ってましたか？」で終わる** — ループ + コメント誘導
4. **背景説明なし** — 即本題

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
- **日本の企業名・権威ある人物名** を含める
- **具体的な金額（兆円・万円・%）** — 最初の15文字以内に入れる
- **財布直撃ワード** — `破綻`, `赤字`, `値上がり`, `ヤバい`
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

Beat 1: zoom in, Beat 2: zoom out.

### Beat 1: Fact Reveal — 「知ってた？」+ counter

Frame 0 で「知ってた？」が即表示。中央に counter animation で数字がカウントアップ。

#### レイアウト構造

```
┌─────────────────────┐
│                     │
│   「知ってた？」      │  ← 黄色48px, frame 0表示
│                     │
│   ┌───────────────┐ │
│   │  赤背景ブロック │ │  ← rgba(239,68,68,0.85)
│   │  0 → 数値      │ │  ← counter animation, 120px
│   │  単位          │ │  ← 48px
│   └───────────────┘ │
│                     │
│   サブタイトル       │  ← 0.8秒フェードイン, 白44px
│                     │
└─────────────────────┘
```

#### HTML テンプレート

```html
<div class='h-full w-full overflow-hidden relative bg-black'>
  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>
    <img src='image:bg_fact' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.7)' />
  </div>
  <div style='position:absolute;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.5) 100%)'></div>
  <div style='position:absolute;top:50%;left:40px;right:40px;transform:translateY(-50%);text-align:center'>
    <div style='color:#F59E0B;font-size:48px;font-weight:900;margin-bottom:24px;text-shadow:0 4px 16px rgba(0,0,0,0.9)'>知ってた？</div>
    <div style='display:inline-block;background:rgba(239,68,68,0.85);padding:20px 48px;border-radius:16px'>
      <div id='counter' style='color:white;font-size:120px;font-weight:900;line-height:1.0'>0</div>
      <div style='color:rgba(255,255,255,0.9);font-size:48px;font-weight:bold;margin-top:4px'>単位</div>
    </div>
    <div id='sub' style='opacity:0;color:white;font-size:44px;font-weight:900;line-height:1.3;margin-top:24px;text-shadow:0 4px 16px rgba(0,0,0,0.9)'>サブタイトル</div>
  </div>
</div>
```

#### Animation script

```javascript
const animation = new MulmoAnimation();
animation.animate('#wrap', { scale: [1.0, 1.15] }, { start: 0, end: 'auto', easing: 'linear' });
animation.counter('#counter', [0, 数値], { start: 0.3, end: 2.5, prefix: '', suffix: '', decimals: 0 });
animation.animate('#sub', { opacity: [0,1], translateY: [30,0] }, { start: 0.8, end: 1.3, easing: 'easeOut' });
```

### Beat 2: Meaning + Loop — 「つまり」+ カード reveal

#### レイアウト構造

```
┌─────────────────────┐
│                     │
│  「つまり何が起きるか」│  ← ヘッダー, 赤26px
│                     │
│  ┌───────────────┐  │
│  │ 影響カード      │  │  ← stagger reveal
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ 結論カード      │  │  ← stagger reveal
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │ あなたは       │  │  ← 黄ボーダー, ループトリガー
│  │ 知ってましたか？│  │
│  └───────────────┘  │
│                     │
└─────────────────────┘
```

#### HTML テンプレート

```html
<div class='h-full w-full overflow-hidden relative bg-black'>
  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>
    <img src='image:bg_meaning' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.5)' />
  </div>
  <div id='header' style='opacity:0;position:absolute;top:80px;left:40px;right:40px;text-align:center'>
    <div style='color:#EF4444;font-size:26px;font-weight:bold;letter-spacing:4px'>つまり何が起きるか</div>
  </div>
  <div style='position:absolute;top:200px;left:40px;right:40px'>
    <div id='r1' style='opacity:0;background:rgba(0,0,0,0.6);border-left:4px solid #F59E0B;padding:20px 24px;border-radius:8px;margin-bottom:16px'>
      <div style='color:#F59E0B;font-size:24px;font-weight:bold'>影響</div>
      <div style='color:white;font-size:30px;font-weight:900;margin-top:6px;line-height:1.4'>影響の内容</div>
    </div>
    <div id='r2' style='opacity:0;background:rgba(0,0,0,0.6);border-left:4px solid #EF4444;padding:20px 24px;border-radius:8px;margin-bottom:16px'>
      <div style='color:#94A3B8;font-size:22px'>結論</div>
      <div style='color:white;font-size:30px;font-weight:900;margin-top:6px;line-height:1.4'>結論の内容</div>
    </div>
    <div id='r3' style='opacity:0;background:rgba(239,68,68,0.15);border:2px solid #F59E0B;border-radius:16px;padding:28px;text-align:center;margin-top:8px'>
      <div style='color:#F59E0B;font-size:36px;font-weight:900'>あなたは知ってましたか？</div>
    </div>
  </div>
</div>
```

#### Animation script

```javascript
const animation = new MulmoAnimation();
animation.animate('#wrap', { scale: [1.1, 1.0] }, { start: 0, end: 'auto', easing: 'linear' });
animation.animate('#header', { opacity: [0,1] }, { start: 0.2, end: 0.6, easing: 'easeOut' });
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
  "title": "日本企業の○○が△兆円 — 知ってた？",
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
      "bg_fact": {
        "type": "imagePrompt",
        "prompt": "描写内容, BRIGHT WELL-LIT SCENE, high key lighting, vivid saturated colors, photorealistic, vertical composition 9:16"
      },
      "bg_meaning": {
        "type": "imagePrompt",
        "prompt": "描写内容, BRIGHT WELL-LIT SCENE, high key lighting, vivid saturated colors, photorealistic, vertical composition 9:16"
      }
    }
  },
  "beats": [
    {
      "text": "知ってた？○○。ニュース要点。",
      "texts": [
        "知ってた？",
        "<span style='color:#EF4444'>○○</span>\nニュース要点"
      ],
      "speaker": "Presenter",
      "image": {
        "type": "html_tailwind",
        "html": [
          "<div class='h-full w-full overflow-hidden relative bg-black'>",
          "  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>",
          "    <img src='image:bg_fact' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.7)' />",
          "  </div>",
          "  <div style='position:absolute;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.5) 100%)'></div>",
          "  <div style='position:absolute;top:50%;left:40px;right:40px;transform:translateY(-50%);text-align:center'>",
          "    <div style='color:#F59E0B;font-size:48px;font-weight:900;margin-bottom:24px;text-shadow:0 4px 16px rgba(0,0,0,0.9)'>知ってた？</div>",
          "    <div style='display:inline-block;background:rgba(239,68,68,0.85);padding:20px 48px;border-radius:16px'>",
          "      <div id='counter' style='color:white;font-size:120px;font-weight:900;line-height:1.0'>0</div>",
          "      <div style='color:rgba(255,255,255,0.9);font-size:48px;font-weight:bold;margin-top:4px'>兆円</div>",
          "    </div>",
          "    <div id='sub' style='opacity:0;color:white;font-size:44px;font-weight:900;line-height:1.3;margin-top:24px;text-shadow:0 4px 16px rgba(0,0,0,0.9)'>サブタイトル</div>",
          "  </div>",
          "</div>"
        ],
        "script": [
          "const animation = new MulmoAnimation();",
          "animation.animate('#wrap', { scale: [1.0, 1.15] }, { start: 0, end: 'auto', easing: 'linear' });",
          "animation.counter('#counter', [0, 10], { start: 0.3, end: 2.5, decimals: 1 });",
          "animation.animate('#sub', { opacity: [0,1], translateY: [30,0] }, { start: 0.8, end: 1.3, easing: 'easeOut' });"
        ],
        "animation": { "movie": true }
      }
    },
    {
      "text": "つまり影響内容。結論。あなたは知ってましたか？",
      "texts": [
        "つまり\n<span style='color:#EF4444'>影響内容</span>",
        "結論",
        "あなたは\n知ってましたか？"
      ],
      "speaker": "Presenter",
      "image": {
        "type": "html_tailwind",
        "html": [
          "<div class='h-full w-full overflow-hidden relative bg-black'>",
          "  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>",
          "    <img src='image:bg_meaning' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.5)' />",
          "  </div>",
          "  <div id='header' style='opacity:0;position:absolute;top:80px;left:40px;right:40px;text-align:center'>",
          "    <div style='color:#EF4444;font-size:26px;font-weight:bold;letter-spacing:4px'>つまり何が起きるか</div>",
          "  </div>",
          "  <div style='position:absolute;top:200px;left:40px;right:40px'>",
          "    <div id='r1' style='opacity:0;background:rgba(0,0,0,0.6);border-left:4px solid #F59E0B;padding:20px 24px;border-radius:8px;margin-bottom:16px'>",
          "      <div style='color:#F59E0B;font-size:24px;font-weight:bold'>影響</div>",
          "      <div style='color:white;font-size:30px;font-weight:900;margin-top:6px;line-height:1.4'>影響の内容</div>",
          "    </div>",
          "    <div id='r2' style='opacity:0;background:rgba(0,0,0,0.6);border-left:4px solid #EF4444;padding:20px 24px;border-radius:8px;margin-bottom:16px'>",
          "      <div style='color:#94A3B8;font-size:22px'>結論</div>",
          "      <div style='color:white;font-size:30px;font-weight:900;margin-top:6px;line-height:1.4'>結論の内容</div>",
          "    </div>",
          "    <div id='r3' style='opacity:0;background:rgba(239,68,68,0.15);border:2px solid #F59E0B;border-radius:16px;padding:28px;text-align:center;margin-top:8px'>",
          "      <div style='color:#F59E0B;font-size:36px;font-weight:900'>あなたは知ってましたか？</div>",
          "    </div>",
          "  </div>",
          "</div>"
        ],
        "script": [
          "const animation = new MulmoAnimation();",
          "animation.animate('#wrap', { scale: [1.1, 1.0] }, { start: 0, end: 'auto', easing: 'linear' });",
          "animation.animate('#header', { opacity: [0,1] }, { start: 0.2, end: 0.6, easing: 'easeOut' });",
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

1. **12-18 seconds** total?
2. **2ビート** のみ? (3ビート以上にしない)
3. **「知ってた？」で始まる**?
4. **counter animation** で数字カウントアップ?
5. **「つまり」で意味・影響**を伝えている?
6. **「あなたは知ってましたか？」で終わる**? (ループ構造)
7. **数字は1つに絞っている**?
8. **背景説明なし**? (即本題)
9. **Beat 1 「知ってた？」** frame 0 で表示?
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
