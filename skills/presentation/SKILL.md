---
name: presentation
description: Create presentation slides through interactive hearing, preview, and feedback loop
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch, mcp__playwright__browser_navigate, mcp__playwright__browser_snapshot, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_evaluate, mcp__playwright__browser_close, mcp__playwright__browser_install
user-invocable: true
---

# /presentation — インタラクティブ・プレゼンテーション作成

html_tailwind ベースのリッチなプレゼンテーション用 MulmoScript を作成する。

**原則**: ナレーション（何を言うか）とビジュアル（どう見せるか）を分離。

**鉄則**: テンプレだけのスライドは禁止。データは必ずグラフ化し、概念は必ず画像で可視化する。

---

## モード選択

ユーザーの要求に応じて、2つのモードを使い分ける：

| モード | 使い方 | 適しているケース |
|-------|--------|--------------|
| **Craft モード** | 1枚ずつ対話で丁寧に作る | 重要なプレゼン、デザインにこだわりたい、構成が未定 |
| **Batch モード** | ヒアリング→一括生成 | 構成が決まっている、素早く作りたい、素材が揃っている |

ユーザーが「1枚ずつ作りたい」「丁寧に作りたい」と言ったら **Craft モード**。
ユーザーが「〇〇について20枚で作って」「一気に作って」と言ったら **Batch モード**。
判断できない場合はユーザーに聞く。

---

## Craft モード — 1枚ずつ対話で作る

### 概要

ユーザーと対話しながら1ページずつスライドを作り上げるモード。各ページごとにプレビュー → フィードバック → 修正を繰り返す。

### ワークフロー

#### Step 1: 初期設定

最初のページを作る前に以下を決める：

1. **スクリプトの保存先** — `scripts/{name}/script.json` を作成
2. **ブランディング** — ロゴ画像があれば `imageParams.images` に登録。背景色・テキスト色を決める
3. **MulmoScript の雛形** — `$mulmocast`, `lang`, `canvasSize`, `speechParams`, `audioParams`, `slideParams`, `imageParams` を設定

ロゴがある場合は全スライドの同じ位置（左上推奨）に配置して統一感を出す。

#### Step 2: 1枚ずつ作成ループ

以下を繰り返す：

1. **ユーザーが内容を指示** — 「次は〇〇を入れたい」
2. **ナレーション作成** — `text` フィールドに話し言葉で書く
3. **ビジュアル作成** — html_tailwind でスライドを作る
4. **JSON に追加** — `beats` 配列に追加
5. **PDF プレビュー** — `npx mulmocast@latest pdf` で生成してユーザーに見せる
6. **フィードバック** — ユーザーの修正指示を反映
7. **承認** — OKなら次のページへ

#### Step 3: 定期的にコミット

数ページ作ったらコミットする。ユーザーが「コミットして」と言ったら即コミット。

### Craft モードのルール

- **PDF でプレビュー** — movie ではなく `npx mulmocast@latest pdf` を使う（高速）
- **1枚ずつ確認** — まとめて作らない。ユーザーの承認なしに次のページに進まない
- **前のページを壊さない** — 新しいページを追加するとき、既存ページの画像キャッシュを消さない（`rm -f output/*/images/*/beat-{新しいID}*` のみ削除）
- **ブランディング一貫** — ロゴ位置、背景色、テキスト色を全ページで統一
- **ユーザーの言葉をそのまま使う** — ナレーションはユーザーの指示をベースに自然な話し言葉に整える
- **過剰に提案しない** — ユーザーが求めていないページを勝手に追加しない

---

## Batch モード — ヒアリング→一括生成

### Phase 1: ヒアリング

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

### Phase 2: セクションごとの作成（反復ループ）

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
    "animation": { "movie": true }
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
    "animation": { "movie": true }
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
    "animation": { "movie": true }
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
    "animation": { "movie": true }
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
    "animation": { "movie": true }
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
    "animation": { "movie": true }
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

#### animation は必ず movie モードを使う

`"animation": true` ではなく `"animation": { "movie": true }` を必ず指定する。movie モードはCDP screencastを使い、フレーム単位のレンダリングより大幅に高速（約7-8倍）。

```json
"animation": { "movie": true }
```

#### ビジュアルの鉄則 — テンプレだけのスライドは禁止

プレゼンテーションの鉄則として、以下を必ず守る：

1. **データは必ずグラフ化** — 数値を箇条書きで並べるだけは禁止。Chart.js の `chart` ブロックを使う
   - **比較**: 棒グラフ（bar）、横棒（horizontalBar）
   - **構成比**: 円グラフ（pie）、ドーナツ（doughnut）
   - **推移**: 折れ線（line）、面（area）
   - **フロー・構造**: Sankey チャート（`chartjs-chart-sankey`、自動ロード）
   - **階層・構成**: Treemap（`chartjs-chart-treemap`、自動ロード）
   - **増減分析**: Waterfall レイアウト
   - **関係性**: Mermaid 図

2. **概念・対象物は必ず画像で可視化**
   - **実在する対象**（人物、企業、製品）: WebFetch/curl で実画像をダウンロードし `output/images/{basename}/` に保存
   - **抽象概念**: `imageParams.images` に `imagePrompt` で AI 生成画像を定義し、`image:keyName` で参照
   - **全スライドの半数以上** に画像を入れることを目指す

3. **テキストだけのスライドは2枚以上連続させない**
   - テキストスライドの前後には必ずビジュアルスライド（グラフ、画像、図解）を挟む

#### グラフ使い分けガイド

| データの特性 | 推奨グラフ | 例 |
|------------|----------|---|
| A vs B の比較 | bar | 売上前年比較 |
| 全体の内訳 | pie / doughnut | セグメント構成比 |
| 時系列推移 | line | 四半期業績推移 |
| 資金・リソースの流れ | sankey | 投資先配分、売上構成フロー |
| 階層的な構成 | treemap | ポートフォリオ構成 |
| 増減の要因分析 | waterfall | 利益増減要因 |
| プロセス・関係性 | mermaid | 組織図、フロー図 |

#### html_tailwind + slide の混在

グラフやテーブルを含むスライドは `type: "slide"` の Slide DSL を使う。ビジュアル重視のスライドは `type: "html_tailwind"` を使う。両者を自由に混在できる。`slideParams.theme` を設定すること。

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

### Phase 3: 全体統合 & 最終調整

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
