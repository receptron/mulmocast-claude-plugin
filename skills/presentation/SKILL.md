---
name: presentation
description: Create presentation slides through interactive hearing, preview, and feedback loop
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch, mcp__playwright__browser_navigate, mcp__playwright__browser_snapshot, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_evaluate, mcp__playwright__browser_close, mcp__playwright__browser_install
user-invocable: true
---

# /presentation — インタラクティブ・プレゼンテーション作成

対話的にヒアリングしながら、html_tailwind ベースのリッチなプレゼンテーション用 MulmoScript を作成する。セクションごとにプレビュー → フィードバック → 修正のループで仕上げる。

**原則**: ナレーション（何を言うか）とビジュアル（どう見せるか）を分離。一度に全部作らず、セクション単位で段階的に組み立てる。

---

## Phase 1: ヒアリング

### 必須ヒアリング項目

ユーザーに以下を確認する：

1. **テーマ**: 何についてのプレゼンか
2. **対象者**: 誰に向けて発表するか
3. **目的**: 聞いた人にどうなってほしいか（理解させたい / 説得したい / 行動を促したい）
4. **発表時間**: 何分のプレゼンか（スライド枚数の目安に使う）
5. **素材**: 参考URL、ファイル、データがあるか
6. **トーン**: フォーマル / カジュアル / テクニカル / インスピレーショナル

### 素材の収集

- **URL**: WebFetch で取得。失敗時は Playwright MCP にフォールバック
- **ファイル**: Read で読み込み
- **トピック**: WebSearch で3-5ソースを調査
- **画像素材**: 研究中に見つけた実画像を `output/images/{scriptBasename}/` に保存

```bash
mkdir -p output/images/{scriptBasename}
curl -fL -o output/images/{scriptBasename}/{name}.jpg "URL"
```

### スライド枚数の目安

| 発表時間 | スライド枚数 | 1枚あたり |
|---------|------------|----------|
| 5分 | 8-12枚 | 25-35秒 |
| 10分 | 15-20枚 | 30-40秒 |
| 15分 | 20-30枚 | 30-45秒 |
| 20分 | 25-35枚 | 35-50秒 |
| 30分 | 35-50枚 | 35-50秒 |

### アウトライン提示

```text
## プレゼン概要

**テーマ**: [タイトル案]
**対象者**: [誰向け]
**目的**: [ゴール]
**スライド枚数**: N枚（発表時間 M分）
**トーン**: [選択したトーン]
**テーマカラー**: [corporate / pop / warm / creative / minimal / dark]

## セクション構成

| # | セクション | スライド数 | 内容 |
|---|----------|----------|------|
| 1 | オープニング | 2枚 | タイトル + 問題提起 |
| 2 | 背景・現状 | 5枚 | ... |
| 3 | 提案・解決策 | 8枚 | ... |
| 4 | データ・根拠 | 6枚 | ... |
| 5 | まとめ・CTA | 2枚 | ... |
```

ユーザーの承認を得てから Phase 2 に進む。

---

## Phase 2: セクションごとの作成（反復ループ）

### ワークフロー

1セクションずつ以下を繰り返す：

1. **ナレーション作成** — そのセクションの各スライドのナレーション（発表者が話す内容）を提示
2. **ビジュアル設計** — html_tailwind でスライドのビジュアルを作成
3. **スクリプト書き出し** — JSON に書き出し
4. **プレビュー生成** — `npx mulmocast@latest movie` で動画生成
5. **ユーザーにプレビュー確認を依頼**
6. **フィードバック反映** — 修正して再プレビュー

### ナレーション品質基準

- **長さ**: 1スライドあたり2-4文（30-80語）
- **話し言葉**: 自然な口語体。「〜です」「〜ですね」
- **具体性**: 抽象的な文言は避け、数字・固有名詞・具体例を使う
- **フロー**: 各スライドが自然につながる

### ビジュアル設計: html_tailwind メイン

プレゼンテーションスライドは基本的に `html_tailwind` で作成する。Tailwind CSS を使ったリッチなレイアウトで、アニメーション付きの見栄えの良いスライドにする。

#### スライドテンプレートパターン

**タイトルスライド**:
```json
{
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full flex items-center justify-center' style='background:linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)'>",
      "  <div id='content' style='opacity:0;text-align:center;padding:48px'>",
      "    <h1 style='color:white;font-size:64px;font-weight:bold;margin-bottom:24px'>タイトル</h1>",
      "    <p style='color:#94a3b8;font-size:28px'>サブタイトル</p>",
      "    <p style='color:#64748b;font-size:22px;margin-top:48px'>発表者名 | 日付</p>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#content', { opacity: [0,1], translateY: [40,0] }, { start: 0.3, end: 1.2, easing: 'easeOut' });"
    ],
    "animation": true
  }
}
```

**キービジュアル + テキスト（左右分割）**:
```json
{
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full flex' style='background:#0f172a'>",
      "  <div id='img-wrap' style='width:50%;height:100%;overflow:hidden'>",
      "    <img src='image:keyVisual' style='width:100%;height:100%;object-fit:cover' />",
      "  </div>",
      "  <div style='width:50%;display:flex;align-items:center;padding:48px'>",
      "    <div id='text-area'>",
      "      <h2 id='heading' style='opacity:0;color:white;font-size:40px;font-weight:bold;margin-bottom:24px'>見出し</h2>",
      "      <p id='body' style='opacity:0;color:#cbd5e1;font-size:24px;line-height:1.6'>本文テキスト</p>",
      "    </div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.coverZoom('#img-wrap img', { zoomFrom: 1.0, zoomTo: 1.15, start: 0, end: 'auto', containerSelector: '#img-wrap' });",
      "animation.animate('#heading', { opacity: [0,1], translateX: [30,0] }, { start: 0.5, end: 1.2, easing: 'easeOut' });",
      "animation.animate('#body', { opacity: [0,1], translateX: [30,0] }, { start: 0.8, end: 1.5, easing: 'easeOut' });"
    ],
    "animation": true
  }
}
```

**箇条書きスライド（順次表示）**:
```json
{
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full' style='background:#0f172a;padding:64px'>",
      "  <h2 id='title' style='opacity:0;color:white;font-size:44px;font-weight:bold;margin-bottom:40px'>セクションタイトル</h2>",
      "  <div id='item1' style='opacity:0;display:flex;align-items:center;margin-bottom:24px'>",
      "    <div style='width:8px;height:8px;border-radius:50%;background:#3b82f6;margin-right:16px;flex-shrink:0'></div>",
      "    <p style='color:#e2e8f0;font-size:28px'>ポイント1の説明テキスト</p>",
      "  </div>",
      "  <div id='item2' style='opacity:0;display:flex;align-items:center;margin-bottom:24px'>",
      "    <div style='width:8px;height:8px;border-radius:50%;background:#3b82f6;margin-right:16px;flex-shrink:0'></div>",
      "    <p style='color:#e2e8f0;font-size:28px'>ポイント2の説明テキスト</p>",
      "  </div>",
      "  <div id='item3' style='opacity:0;display:flex;align-items:center;margin-bottom:24px'>",
      "    <div style='width:8px;height:8px;border-radius:50%;background:#3b82f6;margin-right:16px;flex-shrink:0'></div>",
      "    <p style='color:#e2e8f0;font-size:28px'>ポイント3の説明テキスト</p>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#title', { opacity: [0,1], translateY: [20,0] }, { start: 0.2, end: 0.8, easing: 'easeOut' });",
      "animation.stagger('#item', 3, { opacity: [0,1], translateX: [40,0] }, { start: 0.6, stagger: 0.4, duration: 0.5, easing: 'easeOut' });"
    ],
    "animation": true
  }
}
```

**数値・KPI ハイライト**:
```json
{
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full flex items-center justify-center' style='background:#0f172a'>",
      "  <div style='display:flex;gap:64px'>",
      "    <div style='text-align:center'>",
      "      <div id='num1' style='color:#3b82f6;font-size:72px;font-weight:bold'>0</div>",
      "      <p style='color:#94a3b8;font-size:22px;margin-top:8px'>ラベル1</p>",
      "    </div>",
      "    <div style='text-align:center'>",
      "      <div id='num2' style='color:#22c55e;font-size:72px;font-weight:bold'>0</div>",
      "      <p style='color:#94a3b8;font-size:22px;margin-top:8px'>ラベル2</p>",
      "    </div>",
      "    <div style='text-align:center'>",
      "      <div id='num3' style='color:#f59e0b;font-size:72px;font-weight:bold'>0</div>",
      "      <p style='color:#94a3b8;font-size:22px;margin-top:8px'>ラベル3</p>",
      "    </div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.counter('#num1', [0, 150], { start: 0.3, end: 1.5, suffix: '%', easing: 'easeOut' });",
      "animation.counter('#num2', [0, 2400], { start: 0.5, end: 1.7, suffix: '万', easing: 'easeOut' });",
      "animation.counter('#num3', [0, 98], { start: 0.7, end: 1.9, suffix: '件', easing: 'easeOut' });"
    ],
    "animation": true
  }
}
```

**引用・メッセージスライド**:
```json
{
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full flex items-center justify-center' style='background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'>",
      "  <div id='quote' style='opacity:0;max-width:900px;text-align:center;padding:48px'>",
      "    <div style='color:#3b82f6;font-size:80px;line-height:1;margin-bottom:16px'>\"</div>",
      "    <p style='color:white;font-size:36px;line-height:1.5;font-style:italic'>引用テキストがここに入ります</p>",
      "    <p style='color:#64748b;font-size:22px;margin-top:32px'>— 発言者名</p>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#quote', { opacity: [0,1], scale: [0.9,1.0] }, { start: 0.3, end: 1.2, easing: 'easeOut' });"
    ],
    "animation": true
  }
}
```

**画像フルスクリーン + オーバーレイテキスト**:
```json
{
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full overflow-hidden relative bg-black'>",
      "  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>",
      "    <img src='image:bgImage' style='width:100%;height:100%;object-fit:cover' />",
      "  </div>",
      "  <div style='position:absolute;inset:0;background:linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)'></div>",
      "  <div id='overlay' style='opacity:0;position:absolute;bottom:80px;left:64px;right:64px'>",
      "    <h2 style='color:white;font-size:44px;font-weight:bold;margin-bottom:16px'>見出し</h2>",
      "    <p style='color:#cbd5e1;font-size:26px'>補足テキスト</p>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.coverZoom('#wrap img', { zoomFrom: 1.0, zoomTo: 1.12, start: 0, end: 'auto', containerSelector: '#wrap' });",
      "animation.animate('#overlay', { opacity: [0,1], translateY: [30,0] }, { start: 0.8, end: 1.5, easing: 'easeOut' });"
    ],
    "animation": true
  }
}
```

#### テンプレート使い分けガイド

| スライドの役割 | テンプレート |
|-------------|-----------|
| タイトル・エンディング | タイトルスライド |
| コンセプト説明 + ビジュアル | キービジュアル + テキスト |
| ポイント列挙 | 箇条書き（順次表示） |
| 数値データ・実績 | 数値・KPI ハイライト |
| 印象的なメッセージ | 引用スライド |
| 写真・イメージ重視 | 画像フルスクリーン + オーバーレイ |
| 比較・対比 | 左右分割（カスタム） |
| フロー・プロセス | ステップ表示（stagger アニメ） |

#### html_tailwind + slide の混在

必要に応じて、構造化データが多いスライド（テーブル、チャート、Mermaid図）は `type: "slide"` の Slide DSL を使ってもよい。その場合は `slideParams.theme` を設定すること。

### プレビュー生成

セクションが完成したら動画を生成してプレビュー：

```bash
npx mulmocast@latest movie scripts/{path}/script.json -o output/{topic}
```

ユーザーに `output/{topic}/script_ja.mp4` を確認してもらい、フィードバックを反映する。

### フィードバック対応

ユーザーのフィードバックに応じて：
- **テキスト修正**: ナレーションや表示テキストを変更
- **レイアウト変更**: テンプレートパターンを変更
- **スライド追加/削除**: セクション内のスライド数を調整
- **アニメーション調整**: タイミングやエフェクトを変更
- **画像変更**: imagePrompt を変更して再生成

修正後は再度 `npx mulmocast@latest movie` でプレビュー生成。

---

## Phase 3: 全体統合 & 最終調整

### テーマ設定

`npx mulmocast@latest tool info themes --format json` でテーマ一覧を取得し、`slideParams.theme` に設定する。

| プレゼンの種類 | テーマ |
|-------------|-------|
| ビジネス・提案 | corporate |
| マーケティング・プロモーション | pop |
| 教育・ワークショップ | warm |
| 学術・研究 | minimal |
| デザイン・クリエイティブ | creative |
| テック・エンジニアリング | dark |

### BGM 選択

[mulmocast-media BGM catalog](https://github.com/receptron/mulmocast-media/tree/main/bgms) からプレゼンのトーンに合う BGM を選択：

| BGM | タイトル | ムード | 向いているプレゼン |
|-----|-------|------|---------------|
| `story001.mp3` | Whispered Melody | ピアノ、落ち着き | 報告・説明 |
| `story002.mp3` | Rise and Shine | テクノ、インスピレーション | テック・スタートアップ |
| `story003.mp3` | Chasing the Sunset | ピアノ、前向き | ビジョン・提案 |
| `story004.mp3` | Whispering Keys | クラシカル | 研究発表 |
| `story005.mp3` | Whisper of Ivory | ピアノソロ | フォーマル |
| `theme001.mp3` | Rise of the Flame | オーケストラ | 成果発表・キックオフ |
| `morning001.mp3` | Morning Dance | 朝、軽やか | カジュアル |

URL: `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/{name}`

### MulmoScript 組み立て

```json
{
  "$mulmocast": { "version": "1.1" },
  "lang": "ja",
  "canvasSize": { "width": 1280, "height": 720 },
  "title": "プレゼンタイトル",
  "description": "概要",
  "references": [{ "url": "...", "title": "...", "type": "article" }],
  "speechParams": {
    "provider": "kotodama",
    "speakers": {
      "Presenter": { "provider": "kotodama", "voiceId": "jikkyo_baby" }
    }
  },
  "audioParams": {
    "bgm": { "kind": "url", "url": "https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/story003.mp3" },
    "bgmVolume": 0.12
  },
  "slideParams": { "theme": {} },
  "imageParams": { "provider": "google", "images": {} },
  "beats": []
}
```

### 品質チェックリスト

1. **フック**: 最初のスライドで聴衆の注意を引けるか
2. **一貫性**: 色使い・フォントサイズ・レイアウトが統一されているか
3. **可読性**: テキストが多すぎないか。1スライド1メッセージが理想
4. **フロー**: スライド間の流れが自然か
5. **具体性**: 抽象的な表現が具体的な数字・事例に置き換わっているか
6. **ビジュアルバリエーション**: 同じテンプレートが連続していないか
7. **アニメーション**: 過度でなく、内容を補強しているか
8. **画像**: 認識可能な対象には実画像、抽象概念にはAI生成画像

### 動画生成

```bash
npx mulmocast@latest movie scripts/{path}/script.json -o output/{topic}
```

---

## リファレンス

設計時に参照するドキュメント：

| ファイル | 内容 |
|---------|------|
| `references/slide_dsl_reference.md` | Slide DSL 仕様（レイアウト、ブロック、テーマ） |
| `references/html_animation_reference.md` | MulmoAnimation API、アニメーションパターン |
| `references/cinematic_patterns.md` | シネマティックテーマのレシピ集 |
| `references/image_prompt_reference.md` | 画像プロンプトガイド |
| `references/slide_patterns.md` | スライドデザインパターン例 |
