---
name: versus-shorts
description: Create "X vs Y" comparison YouTube Shorts — 3-beat split-screen format with data comparison (18-25 seconds)
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch, mcp__playwright__browser_navigate, mcp__playwright__browser_snapshot, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_evaluate, mcp__playwright__browser_close, mcp__playwright__browser_install
user-invocable: true
---

# /versus-shorts — 「X vs Y」比較型 YouTube Shorts

2つの対象をスプリットスクリーンで比較し、「どっち派？」でコメントを誘発する視覚エンゲージメント型。

---

## Quick Reference

| Setting | Value |
|---------|-------|
| Canvas | 1080 x 1920 (portrait 9:16) |
| Target duration | **18-25 seconds** |
| Beats | **3 beats** (Matchup + Data + Verdict) |
| Visual | `imagePrompt` + `html_tailwind` animation (ALL beats) |
| TTS | Kotodama, voiceId: `jikkyo_baby` |
| Image | Google, model: `gemini-3.1-flash-image-preview` |
| BGM | `theme001.mp3`, volume 0.12 |

### news-shorts との違い

| | news-shorts | versus-shorts |
|---|---|---|
| ビート数 | 2-3 (標準3) | **3** (固定) |
| 尺 | 18-50秒 | **18-25秒** |
| 構造 | 速報→意味→結論 | **対決→比較→判定** |
| 核心 | 深さ・権威性 | **視覚的エンゲージメント・議論誘発** |
| Beat 1 | タイトル+サブタイトル | **スプリットスクリーン + VSバッジ** |
| 使い分け | 1ニュース深掘り | **2つの対象の比較** |

---

## Content Strategy

### [MUST] Content pillar

This channel focuses on **「日本人の財布に直結する国際経済ニュース」**. All topic selection must align: financial crises, currency risk, trade conflicts, energy security — always with a Japan impact angle.

### [MUST] Topic selection — versus-shorts に最適なネタ

versus-shorts は **2つの対象の比較** が核心。以下のパターンが最適:

1. **国 vs 国** — 「日本 vs アメリカ(金利)」「中国 vs インド(GDP)」
2. **企業 vs 企業** — 「トヨタ vs テスラ」「ソニー vs 任天堂」
3. **政策 vs 政策** — 「利上げ vs 利下げ」「円安 vs 円高」
4. **資産 vs 資産** — 「株 vs 不動産」「金 vs ビットコイン」

**避けるべきネタ**: 比較対象が不明確、一方が圧倒的に優位(議論が生まれない)、3つ以上の比較(→ ranking-shorts)

### [MUST] 色の使い分け

- **サブジェクトA**: 赤 (`#EF4444`) — 左側
- **サブジェクトB**: シアン (`#0891B2`) — 右側
- この2色を全ビートで一貫して使用

### [MUST] No duplicate topics / Upload timing

news-shorts と同じルールを適用。

---

## Phase 1: Research

### Input sources

- **URL**: Fetch with WebFetch first. Fallback to Playwright MCP if 403/paywalled/JS-heavy.
- **Article text**: Work directly from provided text.
- **WebSearch**: Supplement with additional context.

Extract: **2つの比較対象** + 3つの比較指標 + 結論(日本への影響)。

---

## Phase 2: Script Structure — 「対決→比較→判定」型

### [MUST] 3ビート構成（18-25秒）

| パート | 秒数 | 内容 | ビート |
|--------|------|------|--------|
| 対決提示 | ~5秒 | A vs B、どっちがヤバいか | Beat 1 |
| データ比較 | ~10秒 | 3つの指標で左右並列比較 | Beat 2 |
| 判定 + CTA | ~5-8秒 | 結論 + 「どっち派？」 | Beat 3 |

### [MUST] ナレーションテンプレート

```
Beat 1: [A] vs [B]。どっちがヤバいか。[前提1文]。
Beat 2: データで見ると、[指標1]。[指標2]。[指標3]。
Beat 3: つまり[結論]。あなたはどっち派？コメントで教えてください。
```

### [MUST] 黄金ルール

1. **比較指標は3つ** — 2つだと薄い、4つだと25秒を超える
2. **対等に見せる** — 一方的だと議論が生まれない。両方にメリット/デメリットを示す
3. **「どっち派？」で終わる** — コメント誘導が核心
4. **背景説明なし** — 即対決

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
  - Red (`#EF4444`) for subject A keywords
  - Cyan (`#0891B2`) for subject B keywords
  - Yellow (`#F59E0B`) for key terms/proper nouns
  - Keep highlighting surgical — **1-2 keywords per segment max**

#### Generate command

Use `-c ja` option: `npx mulmocast@latest movie ... -c ja`

---

## Phase 3: Title & Metadata

### [MUST] Title optimization — タイトル構築の黄金ルール

- **First 15 characters are critical**: Shorts feed truncates titles.
- **「A vs B」** をタイトルに含める
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

### Beat 1: Split-Screen Matchup — スプリットスクリーン + VS バッジ

Frame 0 で VS バッジが即表示。左右にサブジェクト A/B。

#### レイアウト構造

```
┌──────────┬──────────┐
│          │          │
│  赤背景   │  シアン背景│
│  Subject │  Subject │
│    A     │    B     │
│          │          │
├──────────┴──────────┤
│       VS バッジ      │  ← 赤丸120px, 白文字"VS", 中央, frame 0表示
├─────────────────────┤
│  「どっちがヤバい？」  │  ← 0.8秒フェードイン
└─────────────────────┘
```

#### HTML テンプレート

```html
<div class='h-full w-full overflow-hidden relative bg-black'>
  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>
    <img src='image:bg_matchup' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.5)' />
  </div>
  <div style='position:absolute;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.4) 100%)'></div>
  <div style='position:absolute;top:50%;left:40px;right:40px;transform:translateY(-50%)'>
    <div style='display:flex;gap:16px;margin-bottom:24px'>
      <div style='flex:1;background:rgba(239,68,68,0.85);padding:24px 16px;border-radius:16px;text-align:center'>
        <div style='color:white;font-size:72px;font-weight:900;line-height:1.1'>サブジェクトA</div>
      </div>
      <div style='flex:1;background:rgba(8,145,178,0.85);padding:24px 16px;border-radius:16px;text-align:center'>
        <div style='color:white;font-size:72px;font-weight:900;line-height:1.1'>サブジェクトB</div>
      </div>
    </div>
    <div style='text-align:center;margin-bottom:20px'>
      <div style='display:inline-block;background:rgba(239,68,68,0.95);width:120px;height:120px;border-radius:50%;line-height:120px;text-align:center'>
        <span style='color:white;font-size:56px;font-weight:900'>VS</span>
      </div>
    </div>
    <div id='sub' style='opacity:0;text-align:center'>
      <div style='color:white;font-size:44px;font-weight:900;text-shadow:0 4px 16px rgba(0,0,0,0.9)'>どっちがヤバい？</div>
    </div>
  </div>
</div>
```

#### Animation script

```javascript
const animation = new MulmoAnimation();
animation.animate('#wrap', { scale: [1.0, 1.15] }, { start: 0, end: 'auto', easing: 'linear' });
animation.animate('#sub', { opacity: [0,1], translateY: [20,0] }, { start: 0.8, end: 1.3, easing: 'easeOut' });
```

### Beat 2: Data Comparison — 左右並列比較

ヘッダーに両サブジェクト名。3行の比較データが stagger reveal で上→下に出現。

#### レイアウト構造

```
┌─────────────────────┐
│  Subject A vs B      │  ← ヘッダー (赤 vs シアン)
├─────────────────────┤
│  指標1               │
│  ┌────┐  ┌────┐     │  ← 赤border vs シアンborder
│  │ A値 │  │ B値 │     │
│  └────┘  └────┘     │
├─────────────────────┤
│  指標2               │
│  ┌────┐  ┌────┐     │
│  │ A値 │  │ B値 │     │
│  └────┘  └────┘     │
├─────────────────────┤
│  指標3               │
│  ┌────┐  ┌────┐     │
│  │ A値 │  │ B値 │     │
│  └────┘  └────┘     │
└─────────────────────┘
```

#### HTML テンプレート

```html
<div class='h-full w-full overflow-hidden relative bg-black'>
  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>
    <img src='image:bg_data' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.4)' />
  </div>
  <div id='header' style='opacity:0;position:absolute;top:60px;left:40px;right:40px;text-align:center'>
    <span style='color:#EF4444;font-size:32px;font-weight:900'>サブジェクトA</span>
    <span style='color:#94A3B8;font-size:28px;font-weight:bold;margin:0 16px'>vs</span>
    <span style='color:#0891B2;font-size:32px;font-weight:900'>サブジェクトB</span>
  </div>
  <div style='position:absolute;top:150px;left:40px;right:40px'>
    <div id='r1' style='opacity:0;background:rgba(0,0,0,0.6);border-radius:12px;padding:20px;margin-bottom:16px'>
      <div style='color:#94A3B8;font-size:22px;font-weight:bold;margin-bottom:10px;text-align:center'>指標1</div>
      <div style='display:flex;gap:12px'>
        <div style='flex:1;border-left:4px solid #EF4444;padding:12px 16px;background:rgba(239,68,68,0.1);border-radius:0 8px 8px 0'>
          <div style='color:white;font-size:32px;font-weight:900'>A値</div>
        </div>
        <div style='flex:1;border-left:4px solid #0891B2;padding:12px 16px;background:rgba(8,145,178,0.1);border-radius:0 8px 8px 0'>
          <div style='color:white;font-size:32px;font-weight:900'>B値</div>
        </div>
      </div>
    </div>
    <div id='r2' style='opacity:0;background:rgba(0,0,0,0.6);border-radius:12px;padding:20px;margin-bottom:16px'>
      <div style='color:#94A3B8;font-size:22px;font-weight:bold;margin-bottom:10px;text-align:center'>指標2</div>
      <div style='display:flex;gap:12px'>
        <div style='flex:1;border-left:4px solid #EF4444;padding:12px 16px;background:rgba(239,68,68,0.1);border-radius:0 8px 8px 0'>
          <div style='color:white;font-size:32px;font-weight:900'>A値</div>
        </div>
        <div style='flex:1;border-left:4px solid #0891B2;padding:12px 16px;background:rgba(8,145,178,0.1);border-radius:0 8px 8px 0'>
          <div style='color:white;font-size:32px;font-weight:900'>B値</div>
        </div>
      </div>
    </div>
    <div id='r3' style='opacity:0;background:rgba(0,0,0,0.6);border-radius:12px;padding:20px;margin-bottom:16px'>
      <div style='color:#94A3B8;font-size:22px;font-weight:bold;margin-bottom:10px;text-align:center'>指標3</div>
      <div style='display:flex;gap:12px'>
        <div style='flex:1;border-left:4px solid #EF4444;padding:12px 16px;background:rgba(239,68,68,0.1);border-radius:0 8px 8px 0'>
          <div style='color:white;font-size:32px;font-weight:900'>A値</div>
        </div>
        <div style='flex:1;border-left:4px solid #0891B2;padding:12px 16px;background:rgba(8,145,178,0.1);border-radius:0 8px 8px 0'>
          <div style='color:white;font-size:32px;font-weight:900'>B値</div>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### Animation script

```javascript
const animation = new MulmoAnimation();
animation.animate('#wrap', { translateX: [0, -30] }, { start: 0, end: 'auto', easing: 'linear' });
animation.animate('#header', { opacity: [0,1] }, { start: 0.2, end: 0.6, easing: 'easeOut' });
animation.stagger('#r{i}', 3, { opacity: [0,1], translateX: [-20,0] }, { start: 0.5, interval: 0.7, duration: 0.3, easing: 'easeOut' });
```

### Beat 3: Verdict — 判定 + 「どっち派？」

#### レイアウト構造

```
┌─────────────────────┐
│                     │
│  ヘッダー「判定」     │
│                     │
│  ┌───────────────┐  │
│  │ 判定カード      │  │  ← 黄ボーダー
│  │ 結論           │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │ どっち派？      │  │  ← 赤 vs シアン の2択
│  │ コメントで      │  │
│  │ 教えてください  │  │
│  └───────────────┘  │
│                     │
└─────────────────────┘
```

#### HTML テンプレート

```html
<div class='h-full w-full overflow-hidden relative bg-black'>
  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>
    <img src='image:bg_verdict' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.5)' />
  </div>
  <div id='header' style='opacity:0;position:absolute;top:80px;left:40px;right:40px;text-align:center'>
    <div style='color:#F59E0B;font-size:26px;font-weight:bold;letter-spacing:4px'>判定</div>
  </div>
  <div style='position:absolute;top:200px;left:40px;right:40px'>
    <div id='r1' style='opacity:0;background:rgba(0,0,0,0.6);border:2px solid #F59E0B;border-radius:16px;padding:28px;margin-bottom:20px'>
      <div style='color:#F59E0B;font-size:24px;font-weight:bold'>結論</div>
      <div style='color:white;font-size:32px;font-weight:900;margin-top:8px;line-height:1.4'>結論の内容</div>
    </div>
    <div id='r2' style='opacity:0;margin-bottom:20px'>
      <div style='display:flex;gap:12px'>
        <div style='flex:1;background:rgba(239,68,68,0.85);padding:20px;border-radius:12px;text-align:center'>
          <div style='color:white;font-size:28px;font-weight:900'>サブジェクトA</div>
          <div style='color:rgba(255,255,255,0.8);font-size:20px;margin-top:4px'>派</div>
        </div>
        <div style='flex:1;background:rgba(8,145,178,0.85);padding:20px;border-radius:12px;text-align:center'>
          <div style='color:white;font-size:28px;font-weight:900'>サブジェクトB</div>
          <div style='color:rgba(255,255,255,0.8);font-size:20px;margin-top:4px'>派</div>
        </div>
      </div>
    </div>
    <div id='r3' style='opacity:0;text-align:center'>
      <div style='color:#F59E0B;font-size:36px;font-weight:900'>どっち派？</div>
      <div style='color:#94A3B8;font-size:24px;margin-top:8px'>コメントで教えてください</div>
    </div>
  </div>
</div>
```

#### Animation script

```javascript
const animation = new MulmoAnimation();
animation.animate('#wrap', { scale: [1.1, 1.0] }, { start: 0, end: 'auto', easing: 'linear' });
animation.animate('#header', { opacity: [0,1] }, { start: 0.2, end: 0.6, easing: 'easeOut' });
animation.stagger('#r{i}', 3, { opacity: [0,1], translateY: [30,0] }, { start: 0.5, interval: 0.8, duration: 0.4, easing: 'easeOut' });
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
  "title": "A vs B — どっちがヤバい？",
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
      "bg_matchup": {
        "type": "imagePrompt",
        "prompt": "描写内容, BRIGHT WELL-LIT SCENE, high key lighting, vivid saturated colors, photorealistic, vertical composition 9:16"
      },
      "bg_data": {
        "type": "imagePrompt",
        "prompt": "描写内容, BRIGHT WELL-LIT SCENE, high key lighting, vivid saturated colors, photorealistic, vertical composition 9:16"
      },
      "bg_verdict": {
        "type": "imagePrompt",
        "prompt": "描写内容, BRIGHT WELL-LIT SCENE, high key lighting, vivid saturated colors, photorealistic, vertical composition 9:16"
      }
    }
  },
  "beats": [
    {
      "text": "サブジェクトA vs サブジェクトB。どっちがヤバいか。前提の1文。",
      "texts": [
        "<span style='color:#EF4444'>A</span> vs <span style='color:#0891B2'>B</span>",
        "どっちがヤバいか\n前提の1文"
      ],
      "speaker": "Presenter",
      "image": {
        "type": "html_tailwind",
        "html": [
          "<div class='h-full w-full overflow-hidden relative bg-black'>",
          "  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>",
          "    <img src='image:bg_matchup' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.5)' />",
          "  </div>",
          "  <div style='position:absolute;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.4) 100%)'></div>",
          "  <div style='position:absolute;top:50%;left:40px;right:40px;transform:translateY(-50%)'>",
          "    <div style='display:flex;gap:16px;margin-bottom:24px'>",
          "      <div style='flex:1;background:rgba(239,68,68,0.85);padding:24px 16px;border-radius:16px;text-align:center'>",
          "        <div style='color:white;font-size:72px;font-weight:900;line-height:1.1'>A</div>",
          "      </div>",
          "      <div style='flex:1;background:rgba(8,145,178,0.85);padding:24px 16px;border-radius:16px;text-align:center'>",
          "        <div style='color:white;font-size:72px;font-weight:900;line-height:1.1'>B</div>",
          "      </div>",
          "    </div>",
          "    <div style='text-align:center;margin-bottom:20px'>",
          "      <div style='display:inline-block;background:rgba(239,68,68,0.95);width:120px;height:120px;border-radius:50%;line-height:120px;text-align:center'>",
          "        <span style='color:white;font-size:56px;font-weight:900'>VS</span>",
          "      </div>",
          "    </div>",
          "    <div id='sub' style='opacity:0;text-align:center'>",
          "      <div style='color:white;font-size:44px;font-weight:900;text-shadow:0 4px 16px rgba(0,0,0,0.9)'>どっちがヤバい？</div>",
          "    </div>",
          "  </div>",
          "</div>"
        ],
        "script": [
          "const animation = new MulmoAnimation();",
          "animation.animate('#wrap', { scale: [1.0, 1.15] }, { start: 0, end: 'auto', easing: 'linear' });",
          "animation.animate('#sub', { opacity: [0,1], translateY: [20,0] }, { start: 0.8, end: 1.3, easing: 'easeOut' });"
        ],
        "animation": { "movie": true }
      }
    },
    {
      "text": "データで見ると、指標1。指標2。指標3。",
      "texts": [
        "データで見ると\n<span style='color:#EF4444'>指標1</span>",
        "<span style='color:#0891B2'>指標2</span>",
        "指標3"
      ],
      "speaker": "Presenter",
      "image": {
        "type": "html_tailwind",
        "html": [
          "<div class='h-full w-full overflow-hidden relative bg-black'>",
          "  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>",
          "    <img src='image:bg_data' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.4)' />",
          "  </div>",
          "  <div id='header' style='opacity:0;position:absolute;top:60px;left:40px;right:40px;text-align:center'>",
          "    <span style='color:#EF4444;font-size:32px;font-weight:900'>A</span>",
          "    <span style='color:#94A3B8;font-size:28px;font-weight:bold;margin:0 16px'>vs</span>",
          "    <span style='color:#0891B2;font-size:32px;font-weight:900'>B</span>",
          "  </div>",
          "  <div style='position:absolute;top:150px;left:40px;right:40px'>",
          "    <div id='r1' style='opacity:0;background:rgba(0,0,0,0.6);border-radius:12px;padding:20px;margin-bottom:16px'>",
          "      <div style='color:#94A3B8;font-size:22px;font-weight:bold;margin-bottom:10px;text-align:center'>指標1</div>",
          "      <div style='display:flex;gap:12px'>",
          "        <div style='flex:1;border-left:4px solid #EF4444;padding:12px 16px;background:rgba(239,68,68,0.1);border-radius:0 8px 8px 0'>",
          "          <div style='color:white;font-size:32px;font-weight:900'>A値</div>",
          "        </div>",
          "        <div style='flex:1;border-left:4px solid #0891B2;padding:12px 16px;background:rgba(8,145,178,0.1);border-radius:0 8px 8px 0'>",
          "          <div style='color:white;font-size:32px;font-weight:900'>B値</div>",
          "        </div>",
          "      </div>",
          "    </div>",
          "    <div id='r2' style='opacity:0;background:rgba(0,0,0,0.6);border-radius:12px;padding:20px;margin-bottom:16px'>",
          "      <div style='color:#94A3B8;font-size:22px;font-weight:bold;margin-bottom:10px;text-align:center'>指標2</div>",
          "      <div style='display:flex;gap:12px'>",
          "        <div style='flex:1;border-left:4px solid #EF4444;padding:12px 16px;background:rgba(239,68,68,0.1);border-radius:0 8px 8px 0'>",
          "          <div style='color:white;font-size:32px;font-weight:900'>A値</div>",
          "        </div>",
          "        <div style='flex:1;border-left:4px solid #0891B2;padding:12px 16px;background:rgba(8,145,178,0.1);border-radius:0 8px 8px 0'>",
          "          <div style='color:white;font-size:32px;font-weight:900'>B値</div>",
          "        </div>",
          "      </div>",
          "    </div>",
          "    <div id='r3' style='opacity:0;background:rgba(0,0,0,0.6);border-radius:12px;padding:20px;margin-bottom:16px'>",
          "      <div style='color:#94A3B8;font-size:22px;font-weight:bold;margin-bottom:10px;text-align:center'>指標3</div>",
          "      <div style='display:flex;gap:12px'>",
          "        <div style='flex:1;border-left:4px solid #EF4444;padding:12px 16px;background:rgba(239,68,68,0.1);border-radius:0 8px 8px 0'>",
          "          <div style='color:white;font-size:32px;font-weight:900'>A値</div>",
          "        </div>",
          "        <div style='flex:1;border-left:4px solid #0891B2;padding:12px 16px;background:rgba(8,145,178,0.1);border-radius:0 8px 8px 0'>",
          "          <div style='color:white;font-size:32px;font-weight:900'>B値</div>",
          "        </div>",
          "      </div>",
          "    </div>",
          "  </div>",
          "</div>"
        ],
        "script": [
          "const animation = new MulmoAnimation();",
          "animation.animate('#wrap', { translateX: [0, -30] }, { start: 0, end: 'auto', easing: 'linear' });",
          "animation.animate('#header', { opacity: [0,1] }, { start: 0.2, end: 0.6, easing: 'easeOut' });",
          "animation.stagger('#r{i}', 3, { opacity: [0,1], translateX: [-20,0] }, { start: 0.5, interval: 0.7, duration: 0.3, easing: 'easeOut' });"
        ],
        "animation": { "movie": true }
      }
    },
    {
      "text": "つまり結論。あなたはどっち派？コメントで教えてください。",
      "texts": [
        "つまり\n<span style='color:#F59E0B'>結論</span>",
        "あなたは\nどっち派？",
        "コメントで\n教えてください"
      ],
      "speaker": "Presenter",
      "image": {
        "type": "html_tailwind",
        "html": [
          "<div class='h-full w-full overflow-hidden relative bg-black'>",
          "  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>",
          "    <img src='image:bg_verdict' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.5)' />",
          "  </div>",
          "  <div id='header' style='opacity:0;position:absolute;top:80px;left:40px;right:40px;text-align:center'>",
          "    <div style='color:#F59E0B;font-size:26px;font-weight:bold;letter-spacing:4px'>判定</div>",
          "  </div>",
          "  <div style='position:absolute;top:200px;left:40px;right:40px'>",
          "    <div id='r1' style='opacity:0;background:rgba(0,0,0,0.6);border:2px solid #F59E0B;border-radius:16px;padding:28px;margin-bottom:20px'>",
          "      <div style='color:#F59E0B;font-size:24px;font-weight:bold'>結論</div>",
          "      <div style='color:white;font-size:32px;font-weight:900;margin-top:8px;line-height:1.4'>結論の内容</div>",
          "    </div>",
          "    <div id='r2' style='opacity:0;margin-bottom:20px'>",
          "      <div style='display:flex;gap:12px'>",
          "        <div style='flex:1;background:rgba(239,68,68,0.85);padding:20px;border-radius:12px;text-align:center'>",
          "          <div style='color:white;font-size:28px;font-weight:900'>A</div>",
          "          <div style='color:rgba(255,255,255,0.8);font-size:20px;margin-top:4px'>派</div>",
          "        </div>",
          "        <div style='flex:1;background:rgba(8,145,178,0.85);padding:20px;border-radius:12px;text-align:center'>",
          "          <div style='color:white;font-size:28px;font-weight:900'>B</div>",
          "          <div style='color:rgba(255,255,255,0.8);font-size:20px;margin-top:4px'>派</div>",
          "        </div>",
          "      </div>",
          "    </div>",
          "    <div id='r3' style='opacity:0;text-align:center'>",
          "      <div style='color:#F59E0B;font-size:36px;font-weight:900'>どっち派？</div>",
          "      <div style='color:#94A3B8;font-size:24px;margin-top:8px'>コメントで教えてください</div>",
          "    </div>",
          "  </div>",
          "</div>"
        ],
        "script": [
          "const animation = new MulmoAnimation();",
          "animation.animate('#wrap', { scale: [1.1, 1.0] }, { start: 0, end: 'auto', easing: 'linear' });",
          "animation.animate('#header', { opacity: [0,1] }, { start: 0.2, end: 0.6, easing: 'easeOut' });",
          "animation.stagger('#r{i}', 3, { opacity: [0,1], translateY: [30,0] }, { start: 0.5, interval: 0.8, duration: 0.4, easing: 'easeOut' });"
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
2. **3ビート** (Matchup + Data + Verdict)?
3. **スプリットスクリーン** + **VSバッジ** in Beat 1?
4. **赤(A) vs シアン(B)** の色が全ビートで一貫?
5. **3つの比較指標** in Beat 2?
6. **stagger reveal** で上→下に出現?
7. **「どっち派？」で終わる**?
8. **背景説明なし**? (即対決)
9. **Beat 1 VS バッジ** frame 0 で表示?
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
