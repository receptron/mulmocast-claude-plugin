---
name: explainer-shorts
description: Create "What is ___?" explainer YouTube Shorts — 3-beat structure with visual breakdown (15-25 seconds)
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch, mcp__playwright__browser_navigate, mcp__playwright__browser_snapshot, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_evaluate, mcp__playwright__browser_close, mcp__playwright__browser_install
user-invocable: true
---

# /explainer-shorts — 「そもそも○○って何？」解説型 YouTube Shorts

ニュースで聞く難しいワードを「そもそも○○って何？」で30秒以内に解説する。検索需要でエバーグリーン再生を狙う。

---

## Quick Reference

| Setting | Value |
|---------|-------|
| Canvas | 1080 x 1920 (portrait 9:16) |
| Target duration | **15-25 seconds** |
| Beats | **3 beats** (Question + Breakdown + So What) |
| Visual | `imagePrompt` + `html_tailwind` animation (ALL beats) |
| TTS | Kotodama, voiceId: `jikkyo_baby` |
| Image | Google, model: `gemini-3.1-flash-image-preview` |
| BGM | `theme001.mp3`, volume 0.12 |

### 他フォーマットとの違い

| | fact-shorts | explainer-shorts |
|---|---|---|
| ビート数 | 2 | **3** |
| 尺 | 12-18秒 | **15-25秒** |
| 構造 | 知ってた？→つまり→ループ | **○○って何？→図解→だから何？→ループ** |
| 核心 | 衝撃の1数字 | **難しいワードを30秒で理解** |
| Beat 1 | counter animation | **キーワード大表示 + 「？」** |
| 寿命 | ニュース依存 | **エバーグリーン（検索流入）** |
| 使い分け | 衝撃的な数字 | **ニュースワードの解説** |

---

## Content Strategy

### [MUST] Content pillar

This channel focuses on **「日本人の財布に直結する国際経済ニュース」**. 解説するワードもこのドメインに関連するものに限定する。

### [MUST] Topic selection — explainer-shorts に最適なネタ

1. **ニュースで頻出するが意味が曖昧な用語** — レアアース、SWIFT、量的緩和
2. **カタカナ経済用語** — NVIDIA、GAFAM、ETF、NISA
3. **よく聞くが説明できないもの** — ホルムズ海峡、日銀短観、CPI
4. **最近のニュースで話題になったワード** — 既存動画からの導線を作れるもの

### [MUST] タイトルに知ってるキーワードを使う

タイトルの最初の15文字に**誰でも知ってるキーワード**を含める:
- Good: 「NVIDIAってなにがすごいの？」（NVIDIAは知ってる）
- Good: 「レアアースってそもそも何？」（ニュースで聞いたことがある）
- Bad: 「スワップ協定の仕組み」（一般人は知らない）

### [MUST] エバーグリーン設計

- 日付・具体的な株価等の時事データに依存しない内容にする
- 「なぜ重要か」の部分で最新ニュースとの接点を作るが、ニュースが古くなっても動画の価値が残るようにする

### [MUST] 既存動画への導線

チャンネル内の既存動画（fact-shorts, news-shorts等）で使ったワードを解説すると、相互に視聴者を誘導できる。

---

## Phase 1: Research

### Input sources

- **キーワード指定**: ユーザーが解説したいワードを指定
- **WebSearch**: ワードの正確な定義・データを収集
- **WebFetch**: 権威ある解説記事から情報取得

Extract:
1. **一言定義** — 「○○とは、□□のこと」（1文で）
2. **3つのポイント** — なぜ重要か、どう影響するか、日本との関係
3. **身近なたとえ** — 小学生でもわかるアナロジー

---

## Phase 2: Script Structure — 「○○って何？→図解→だから何？」型

### [MUST] 3ビート構成（15-25秒）

| パート | 秒数 | 内容 | ビート |
|--------|------|------|--------|
| ○○って何？ | ~2秒 | キーワード + 疑問で掴む | Beat 1 |
| 一言定義 | ~3-4秒 | 「ひとことで言うと○○」 | Beat 1 |
| ポイント解説 | ~8-12秒 | 3つの要点をカードで | Beat 2 |
| だから何？ | ~4-5秒 | あなたの生活への影響 + ループ | Beat 3 |

### [MUST] ナレーションテンプレート

```
Beat 1: [ワード]ってそもそも何？ひとことで言うと、[一言定義]。
Beat 2: ポイントは3つ。[要点1]。[要点2]。[要点3]。
Beat 3: つまりあなたの[生活/財布/仕事]に[どう影響するか]。わかった？
```

### [MUST] 黄金ルール

1. **「○○って何？」で始める** — 検索クエリそのもの
2. **一言定義は1文** — 長い説明は禁止
3. **ポイントは3つまで** — 4つ以上は情報過多
4. **身近なたとえを1つ入れる** — 「○○みたいなもの」
5. **「わかった？」で終わる** — ループ + コメント誘導（「○○って何？」に戻る）
6. **専門用語で説明しない** — 解説動画なのに別の難語を使うのはNG

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
  - Cyan (`#0891B2`) for the keyword being explained
  - Yellow (`#F59E0B`) for key terms/proper nouns
  - Keep highlighting surgical — **1-2 keywords per segment max**

#### Generate command

Use `-c ja` option: `npx mulmocast@latest movie ... -c ja`

---

## Phase 3: Title & Metadata

### [MUST] Title optimization

- **「○○って何？」「○○ってなに？」** の形式をベースにする（検索クエリ一致）
- **First 15 characters are critical**: Shorts feed truncates titles
- **知ってるキーワード**を使う — 一般人が聞いたことのあるワード
- **No English subtitles**

Title patterns:
- `レアアースってそもそも何？30秒でわかる`
- `NVIDIAってなにがすごいの？`
- `ホルムズ海峡って何？なぜヤバいのか`

### [MUST] Description

~200 character summary. Include: keyword definition + why it matters + reference URL.

### [MUST] Tags

Keyword + related terms + category (`経済ニュース,投資,金融,解説`) + channel (`mulmocast`) tags.

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

### Beat 1: Question — 「○○って何？」+ キーワード大表示

Frame 0 でキーワードが即表示。「？」マークで好奇心を掴む。

#### レイアウト構造

```
┌─────────────────────┐
│                     │
│  「そもそも」        │  ← シアン26px, frame 0表示
│                     │
│  ┌───────────────┐  │
│  │ シアン背景     │  │  ← rgba(8,145,178,0.85)
│  │ キーワード     │  │  ← 白96px
│  │ って何？       │  │  ← 白48px
│  └───────────────┘  │
│                     │
│  一言定義            │  ← 0.8秒フェードイン, 白40px
│                     │
└─────────────────────┘
```

#### HTML テンプレート

```html
<div class='h-full w-full overflow-hidden relative bg-black'>
  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>
    <img src='image:bg_question' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.7)' />
  </div>
  <div style='position:absolute;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.5) 100%)'></div>
  <div style='position:absolute;top:50%;left:40px;right:40px;transform:translateY(-50%);text-align:center'>
    <div style='color:#0891B2;font-size:26px;font-weight:bold;letter-spacing:4px;margin-bottom:16px'>そもそも</div>
    <div style='display:inline-block;background:rgba(8,145,178,0.85);padding:20px 48px;border-radius:16px'>
      <div style='color:white;font-size:96px;font-weight:900;line-height:1.1'>キーワード</div>
      <div style='color:rgba(255,255,255,0.9);font-size:48px;font-weight:bold;margin-top:4px'>って何？</div>
    </div>
    <div id='def' style='opacity:0;color:white;font-size:40px;font-weight:900;line-height:1.3;margin-top:24px;text-shadow:0 4px 16px rgba(0,0,0,0.9)'>ひとことで言うと<br/>一言定義</div>
  </div>
</div>
```

#### Animation script

```javascript
const animation = new MulmoAnimation();
animation.animate('#wrap', { scale: [1.0, 1.15] }, { start: 0, end: 'auto', easing: 'linear' });
animation.animate('#def', { opacity: [0,1], translateY: [30,0] }, { start: 0.6, end: 1.0, easing: 'easeOut' });
```

### Beat 2: Breakdown — ポイント3つをカード表示

#### レイアウト構造

```
┌─────────────────────┐
│                     │
│  「ポイントは3つ」   │  ← ヘッダー, シアン26px
│                     │
│  ┌───────────────┐  │
│  │ ① ポイント1    │  │  ← シアンborder, stagger
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ ② ポイント2    │  │  ← 黄border, stagger
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ ③ ポイント3    │  │  ← 赤border, stagger
│  └───────────────┘  │
│                     │
└─────────────────────┘
```

#### HTML テンプレート

```html
<div class='h-full w-full overflow-hidden relative bg-black'>
  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>
    <img src='image:bg_breakdown' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.5)' />
  </div>
  <div id='header' style='opacity:0;position:absolute;top:60px;left:40px;right:40px;text-align:center'>
    <div style='color:#0891B2;font-size:26px;font-weight:bold;letter-spacing:4px'>ポイントは3つ</div>
  </div>
  <div style='position:absolute;top:150px;left:40px;right:40px'>
    <div id='r1' style='opacity:0;background:rgba(0,0,0,0.6);border-left:4px solid #0891B2;padding:20px 24px;border-radius:8px;margin-bottom:16px'>
      <div style='color:#0891B2;font-size:22px;font-weight:bold'>① ラベル1</div>
      <div style='color:white;font-size:28px;font-weight:900;margin-top:6px;line-height:1.4'>ポイント1の内容</div>
    </div>
    <div id='r2' style='opacity:0;background:rgba(0,0,0,0.6);border-left:4px solid #F59E0B;padding:20px 24px;border-radius:8px;margin-bottom:16px'>
      <div style='color:#F59E0B;font-size:22px;font-weight:bold'>② ラベル2</div>
      <div style='color:white;font-size:28px;font-weight:900;margin-top:6px;line-height:1.4'>ポイント2の内容</div>
    </div>
    <div id='r3' style='opacity:0;background:rgba(0,0,0,0.6);border-left:4px solid #EF4444;padding:20px 24px;border-radius:8px;margin-bottom:16px'>
      <div style='color:#EF4444;font-size:22px;font-weight:bold'>③ ラベル3</div>
      <div style='color:white;font-size:28px;font-weight:900;margin-top:6px;line-height:1.4'>ポイント3の内容</div>
    </div>
  </div>
</div>
```

#### Animation script

```javascript
const animation = new MulmoAnimation();
animation.animate('#wrap', { translateX: [0, -30] }, { start: 0, end: 'auto', easing: 'linear' });
animation.animate('#header', { opacity: [0,1] }, { start: 0.1, end: 0.4, easing: 'easeOut' });
animation.stagger('#r{i}', 3, { opacity: [0,1], translateX: [-20,0] }, { start: 0.3, interval: 0.6, duration: 0.3, easing: 'easeOut' });
```

### Beat 3: So What — 「だから何？」+ ループトリガー

#### レイアウト構造

```
┌─────────────────────┐
│                     │
│  「つまりあなたに   │
│   どう関係するか」  │  ← ヘッダー
│                     │
│  ┌───────────────┐  │
│  │ 生活への影響   │  │  ← 影響カード
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │ わかった？     │  │  ← シアンボーダー, ループ
│  │ 他にも解説して │  │
│  │ ほしい言葉は？ │  │
│  └───────────────┘  │
│                     │
└─────────────────────┘
```

#### HTML テンプレート

```html
<div class='h-full w-full overflow-hidden relative bg-black'>
  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>
    <img src='image:bg_sowhat' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.5)' />
  </div>
  <div id='header' style='opacity:0;position:absolute;top:80px;left:40px;right:40px;text-align:center'>
    <div style='color:#0891B2;font-size:26px;font-weight:bold;letter-spacing:4px'>つまりあなたにどう関係するか</div>
  </div>
  <div style='position:absolute;top:220px;left:40px;right:40px'>
    <div id='r1' style='opacity:0;background:rgba(0,0,0,0.6);border-left:4px solid #F59E0B;padding:20px 24px;border-radius:8px;margin-bottom:16px'>
      <div style='color:#F59E0B;font-size:24px;font-weight:bold'>あなたへの影響</div>
      <div style='color:white;font-size:30px;font-weight:900;margin-top:6px;line-height:1.4'>影響の内容</div>
    </div>
    <div id='r2' style='opacity:0;background:rgba(8,145,178,0.15);border:2px solid #0891B2;border-radius:16px;padding:28px;text-align:center;margin-top:8px'>
      <div style='color:#0891B2;font-size:36px;font-weight:900'>わかった？</div>
      <div style='color:#94A3B8;font-size:22px;margin-top:8px'>他に解説してほしい言葉は？</div>
    </div>
  </div>
</div>
```

#### Animation script

```javascript
const animation = new MulmoAnimation();
animation.animate('#wrap', { scale: [1.1, 1.0] }, { start: 0, end: 'auto', easing: 'linear' });
animation.animate('#header', { opacity: [0,1] }, { start: 0.2, end: 0.6, easing: 'easeOut' });
animation.stagger('#r{i}', 2, { opacity: [0,1], translateY: [30,0] }, { start: 0.5, interval: 0.8, duration: 0.4, easing: 'easeOut' });
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
  "title": "レアアースってそもそも何？30秒でわかる",
  "description": "ニュースでよく聞く「レアアース」をわかりやすく解説。希土類元素17種類の総称で、スマホ・EV・半導体に不可欠。中国が世界の7割を生産。日本経済の急所。",
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
      "bg_question": {
        "type": "imagePrompt",
        "prompt": "キーワードを象徴するビジュアル, BRIGHT WELL-LIT SCENE, high key lighting, vivid saturated colors, photorealistic, vertical composition 9:16"
      },
      "bg_breakdown": {
        "type": "imagePrompt",
        "prompt": "関連するインフラ・産業のビジュアル, BRIGHT WELL-LIT SCENE, high key lighting, vivid saturated colors, photorealistic, vertical composition 9:16"
      },
      "bg_sowhat": {
        "type": "imagePrompt",
        "prompt": "日本の日常生活・消費者視点のビジュアル, BRIGHT WELL-LIT SCENE, high key lighting, vivid saturated colors, photorealistic, vertical composition 9:16"
      }
    }
  },
  "beats": [
    {
      "text": "レアアースってそもそも何？ひとことで言うと、スマホやEVに絶対必要な希少な金属のこと。",
      "texts": [
        "<span style='color:#0891B2'>レアアース</span>\nってそもそも何？",
        "ひとことで言うと\nスマホやEVに必要な\n<span style='color:#0891B2'>希少な金属</span>"
      ],
      "speaker": "Presenter",
      "image": {
        "type": "html_tailwind",
        "html": ["...Beat 1 HTML..."],
        "script": ["...Beat 1 Animation..."],
        "animation": { "movie": true }
      }
    },
    {
      "text": "ポイントは3つ。1つ目、全部で17種類ある。2つ目、中国が世界の7割を生産してる。3つ目、スマホ、EV、半導体、ぜんぶこれがないと作れない。",
      "texts": [
        "ポイントは3つ",
        "①全部で<span style='color:#0891B2'>17種類</span>",
        "②中国が世界の\n<span style='color:#EF4444'>7割を生産</span>",
        "③スマホ・EV・半導体\nぜんぶ必要"
      ],
      "speaker": "Presenter",
      "image": {
        "type": "html_tailwind",
        "html": ["...Beat 2 HTML..."],
        "script": ["...Beat 2 Animation..."],
        "animation": { "movie": true }
      }
    },
    {
      "text": "つまり、中国がストップしたらスマホもクルマも値上がりする。あなたの生活に直結してる。わかった？",
      "texts": [
        "つまり中国が止めたら\n<span style='color:#EF4444'>スマホもクルマも値上がり</span>",
        "あなたの生活に\n直結してる",
        "わかった？"
      ],
      "speaker": "Presenter",
      "image": {
        "type": "html_tailwind",
        "html": ["...Beat 3 HTML..."],
        "script": ["...Beat 3 Animation..."],
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

1. **15-25 seconds** total?
2. **3ビート** 構成? (Question + Breakdown + So What)
3. **「○○って何？」で始まる**? (検索クエリ一致)
4. **一言定義が1文**?
5. **ポイントが3つ以内**?
6. **身近なたとえが1つ入っている**?
7. **専門用語で説明していない**? (解説なのに別の難語はNG)
8. **「わかった？」で終わる**? (ループ + コメント誘導)
9. **Beat 1 キーワード** frame 0 で表示?
10. **`image:` scheme** used for img src?
11. **Japan impact angle** clear?
12. **タイトルに知ってるキーワード**?
13. **text と texts の内容一致**?
14. **TTS読み間違い対策**? (市場→しじょう 等)
15. **キャプションスタイル**: 黄色文字+白縁取り+背景なし?
16. **エバーグリーン**? (日付依存の情報を避けている)

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
