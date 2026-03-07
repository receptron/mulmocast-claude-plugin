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
| Beats | **3-5 beats** |
| Visual | `imagePrompt` + `html_tailwind` animation (ALL beats) |
| TTS | Kotodama, voiceId: `jikkyo_baby` |
| Image | Google, model: `gemini-3.1-flash-image-preview` |
| BGM | `theme001.mp3`, volume 0.12 |

---

## Content Strategy

### [MUST] Content pillar

This channel focuses on **「日本人の財布に直結する国際経済ニュース」**. All topic selection must align: financial crises, currency risk, trade conflicts, energy security — always with a Japan impact angle.

### [MUST] Topic selection — "日本への影響" axis

International news performs poorly unless framed as "impact on Japan / your wallet". Always connect foreign events to Japanese viewers' lives (e.g., ホルムズ封鎖 → 1ドル200円, MFS破綻 → 三井住友に飛び火). Pure foreign news without Japan angle should be avoided.

### [MUST] No duplicate topics

Never create two separate videos on the same news event. If there's new information, create one comprehensive video instead of splitting.

### [MUST] Upload timing & frequency — アルゴリズム対策

1. **ゴールデンタイム**: **7-9時**（通勤）と **18-23時**（夜のニュース時間）。早朝5-7時は避ける
2. **1日最大2-3本**: 同じ時間帯に2本以上投稿しない。間隔を最低2時間あける。連投はアルゴリズムにスパム判定されるリスクあり
3. **タイトルに日本人の財布に直結する具体数字を入れる**: 伸びる例: `1ドル200円？`, `年8万円赤字`, `三井住友に飛び火`。伸びない例: 海外ニュースの翻訳そのまま
4. **英語サブタイトル禁止**: `| Shadow Bank Collapse` 等は日本語ターゲットにノイズ。検索にも効かない

#### パフォーマンス実績（参考）

| パターン | 平均Views | 例 |
|---------|----------|-----|
| 財布直結 + 具体数字 | 1,000+ | `1ドル200円？`, `植田総裁が明言` |
| 有名企業/人物 + 日本接点 | 700+ | `バークシャー日本商社`, `アンソロピック3兆円` |
| 海外ニュース + 日本角度弱い | 10-50 | `UBS警告`, `Blackstone払い戻し` |
| 早朝5-7時連投 | 5-20 | 3/4水曜の8本連投 → 全滅 |

---

## Phase 1: Research

### Input sources

- **URL**: Fetch with WebFetch first. Fallback to Playwright MCP if 403/paywalled/JS-heavy.
- **Article text**: Work directly from provided text.
- **WebSearch**: Supplement with additional context.

Extract: key data points, numbers, quotes, Japan-impact angle.

---

## Phase 2: Script Structure — 「速報→意味→結論」型

### [MUST] ニュースShortsの最強構成（18-22秒）

情報の価値を最初に出す。「結論→要点→意味→問い」の4パートを2ビートに収める。

| パート | 秒数 | 内容 | ビート |
|--------|------|------|--------|
| ①結論（フック） | ~1秒 | インパクトある一言。ニュース名よりインパクト | Beat 1 |
| ②ニュース要点 | ~5秒 | 何が・いつ・誰が。事実だけ | Beat 1 |
| ③意味・影響 | ~10秒 | 「つまり」何が起きるか。**ここが価値** | Beat 2 |
| ④視聴者への問い | ~3秒 | コメント誘導の質問 | Beat 2 |

### [MUST] フック型パターン（Beat 1 冒頭の1秒）

#### 型1:「これヤバいです」型
```
このニュースかなりヤバいです。
米国のプライベートクレジットでデフォルトが出ました。
```

#### 型2:「知らないと損」型
```
このニュース、ほとんど報道されていません。
中国が米国債を大量に売っています。
```

#### 型3:「実は」型
```
実はこのニュース、かなり重要です。
リートが暴落している理由、ほとんどの人が誤解しています。
```

#### 型4: 数字インパクト型
```
わずか3週間で7900億円。
アンソロピックの売上が爆発しています。
```

### [MUST] Beat 2 で「つまり」を使う

Shortsでは「つまり」が強い。意味・影響パートの冒頭で使う:
```
つまり何が起きるかというと、ドル高が続く可能性が高い。
日本は円安圧力が続くので、輸入インフレが止まりません。
```

### [MUST] Beat 2 末尾 — コメント誘導の問い

具体的な二択・意見を求める質問で終わる:
- `これ、円安さらに進むと思いますか？`
- `日本は利上げすると思いますか？`
- `あなたはどう備えますか？`

### [MUST] 黄金ルール

1. **背景説明はしない** — `FRBとはアメリカの中央銀行で…` → 即離脱。知ってる前提で話す
2. **1本1ニュース** — 詰め込みNG。`今日は3つニュースがあります` は最悪。`今日一番ヤバいニュース` が正解
3. **数字を入れる** — 具体性＝視聴維持。`日銀が40年国債の利回りを操作` のように数字で具体化

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
  "styles": ["font-size: 84px", "text-align: left", "font-family: 'Hiragino Sans', 'Noto Sans JP', sans-serif", "font-weight: 900", "letter-spacing: 2px"]
}
```

#### Manual caption splits with `texts` array

Each element becomes one caption segment, timed proportionally to text length.

Rules:
- `texts` takes precedence over auto-split
- **1行最大9文字** — 半角数字・英字も1文字としてカウント（boldだと半角も全角と同じ幅になる）
- **1セグメント2-3行** — `\n` で改行して2-3行をまとめて表示。1行ずつだと流れが速すぎて追えない
- **改行前の句読点は不要** — 次の行やセグメントに移るので `。` `、` は省略
- `text` is still used for TTS narration; `texts` controls only caption display
- **TTS読み間違い対策**: `text`（読み上げ用）で漢字の読み間違いが起きる場合はひらがなにする（例: 金→きん、市場→しじょう）。`texts`（字幕用）は漢字のままでよい
- `texts` supports `<span>` tags for keyword color highlighting:
  - Red (`#EF4444`) for alarming/impactful keywords
  - Yellow (`#F59E0B`) for key terms/proper nouns
  - Keep highlighting surgical — **1-2 keywords per segment max**

#### Generate command

Use `-c ja` option: `npx mulmocast@latest movie ... -c ja`

### Beat roles

| Beat | Role | Duration |
|------|------|----------|
| 1 | **HOOK** — ①結論フック + ②ニュース要点。タイトル+サブタイトルのみ表示（データカード不可） | ~8-12s |
| 2–N | **BODY** — ③意味・影響。「つまり」で展開。データカード/表OK | ~8-12s each |
| Last | **CLOSE** — ④視聴者への問い + engagement hook | ~8-12s |

Use 3-5 beats. For simpler topics, 3 beats (HOOK + BODY + CLOSE) is the minimum.

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

### [MUST] Beat 1 = Thumbnail — frame 0 で勝負が決まる

Beat 1 の最初のフレームがそのまま YouTube サムネイルになる。Shorts フィードでスワイプされるかクリックされるかは、このフレームで決まる。

#### サムネイル最適化ルール

Beat 1 は **タイトル + サブタイトルのみ** を背景画像の上に表示する。データカード、数字バッジ、情報要素は一切入れない。ナレーション内容はキャプション（字幕）が担う。

1. **背景画像は明るく鮮やかに** — `filter:brightness(0.7)` 以上。暗すぎるとフィードで埋もれる。imagePrompt には `BRIGHT WELL-LIT SCENE`, `high key lighting`, `vivid saturated colors` を含め、`dark`, `moody`, `dramatic lighting` は避ける
2. **メインタイトルに背景ブロック** — テキストだけでなく、半透明カラーブロック（`background:rgba(239,68,68,0.85)`）で囲んで視認性を確保。`text-shadow` だけに頼らない
3. **色は3色以内** — 赤(primary) + 白(text) + 黄(accent) のみ。多色はノイズ
4. **縦中央配置** — `top:50%; transform:translateY(-50%)` でタイトルブロックを画面中央に。上1/3ではなく中央の方がサムネイルでの視認性が高い
5. **タイトルは frame 0 で表示** — `opacity:1` で最初から見せる（フェードイン不要）。サムネイルにタイトルが映らないと CTR が下がる

#### レイアウト構造

```
┌─────────────────────┐
│                     │
│   ┌───────────────┐ │
│   │ 背景ブロック赤  │ │  ← rgba(239,68,68,0.85), padding:12px 32px
│   │ メインタイトル  │ │  ← 100-120px, white, font-weight:900
│   └───────────────┘ │
│   サブヘッドライン    │  ← 48-56px, white, text-shadow
│                     │
└─────────────────────┘
```

#### HTML テンプレート

```html
<div class='h-full w-full overflow-hidden relative bg-black'>
  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>
    <img src='...' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.7)' />
  </div>
  <div style='position:absolute;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.5) 100%)'></div>
  <div style='position:absolute;top:50%;left:40px;right:40px;transform:translateY(-50%);text-align:center'>
    <div style='display:inline-block;background:rgba(239,68,68,0.85);padding:12px 32px;border-radius:12px'>
      <span style='color:white;font-size:110px;font-weight:900;line-height:1.0;letter-spacing:4px'>メインタイトル</span>
    </div>
    <div style='color:white;font-size:52px;font-weight:900;line-height:1.3;margin-top:20px;text-shadow:0 4px 16px rgba(0,0,0,0.9)'>サブヘッドライン</div>
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

For full MulmoAnimation DSL, **Read** `${CLAUDE_SKILL_DIR}/html_animation_reference.md`.

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
  "captionParams": { "lang": "ja", "bottomOffset": 20, "captionSplit": "estimate", "textSplit": { "type": "delimiters", "delimiters": ["。", "！", "？", ".", "!", "?"] }, "styles": ["font-size: 84px", "text-align: left", "font-family: 'Hiragino Sans', 'Noto Sans JP', sans-serif", "font-weight: 900", "letter-spacing: 2px"] },
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
2. **「結論→要点→意味→問い」構成**?
3. **最初の1秒でインパクト**? (フック型パターン使用)
4. **「つまり」で意味・影響**を伝えている?
5. **コメント誘導の問い**で終わっている?
6. **1本1ニュース**? (詰め込みNG)
7. **背景説明なし**? (即本題)
8. **具体的な数字**が入っている?
9. **Beat 1 タイトル** frame 0 で表示?
10. **Image paths** match `-o` output directory?
11. **Japan impact angle** clear?

### Upload

Wait for user confirmation before uploading. Use:

```bash
node ${CLAUDE_SKILL_DIR}/youtube-upload.mjs \
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
