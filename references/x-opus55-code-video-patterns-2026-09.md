# X: Claude Opus 5.5「コードで作る動画」表現調査（2026-09-22〜26）

調査日: 2026-09-26  
目的: 直近バズの**表現手法**を整理し、MulmoCast で**参考にできる型**（コピー禁止）を残す。

## 前提（取り違え注意）

この波の本体は **Veo / Sora 系の動画生成モデルではない**。  
Claude Opus 5.5（多くは Claude Code）が**長いコードを書き**、ブラウザ・3D・映像パイプラインで動画をレンダする系。

よく出るスタック:

- 単一 `index.html` + Canvas 2D / WebGL + Web Audio（外部素材ゼロ）
- Remotion（React/TypeScript）
- Blender（Python / MCP 経由）
- HyperFrames（HeyGen 系 skill）+ 製品プロモ
- 音声・BGM は別系統（Gemini TTS、Lyria、ElevenLabs、Suno 等）と分業

## 観測した表現パターン

| ID | パターン | 何が刺さっているか | 例 | 目安 |
|----|----------|-------------------|----|------|
| A | **単一 HTML 完結の長尺** | 「素材ゼロ・ライブラリなし・1ファイル」の驚き | [78s film](https://x.com/jurlycat/status/2102645793828036643), [black hole trip](https://x.com/higgsfield_ai/status/2102899907497705749), [JA紹介](https://x.com/AiAircle34052/status/2103017339881132176) | jurlycat **L1110 / RT73 / bookmarks 800+** |
| B | **同プロンプト1発比較** | 世代差・他社差が目で分かる | [巨獣ワールド](https://x.com/dansyu_callenge/status/2102865591035895925), [航空機](https://x.com/usutaku_channel/status/2102609133300224199), [Blender 10s](https://x.com/AiAircle34052/status/2102646646895227024) | L100 前後も |
| C | **Blender をコード駆動** | 「自分は Blender を入れただけ」物語 | [MCP再構築](https://x.com/OriSilver/status/2102817977812824335), [ローンチ映像](https://x.com/ish_creative/status/2102966807376334856), [チーター](https://x.com/HarshithLucky3/status/2103483330075443455) | 中〜大 |
| D | **Remotion / 長尺映画** | 数千行 TS で「映画」 | [AI史3分](https://x.com/ClaudeCode_love/status/2103047036098760802), [ES Remotion](https://x.com/dumenac/status/2103125666036396526) | 中 |
| E | **モーショングラフィックス / 教材 / PV** | 映像×TTS×BGM の分業が明示される | [HyperFrames PV](https://x.com/Majin_AppSheet/status/2103497319899693327), [アポロ解説](https://x.com/_creatorzz_/status/2103040495366857030), [JetBrains公式](https://x.com/jetbrains/status/2102459650125754812) | JetBrains L180+ |
| F | **落差フックの短尺** | 期待を上げて一気に落とす / 逆転 | [BLVCKOUT非公式・MulmoCast使用例](https://x.com/ystknsh/status/2102766871007436993) | views 1.7万 |
| G | **技法モンタージュ** | 鉛筆→紙模型→3D→戦闘など表現だけ変える | [temple mission](https://x.com/X_DimensionNews/status/2102733943074345346) | 小だが型として有用 |

言語: JA / EN / ES / ZH / AR など横断。型は共通で「コードで映像を制御している」ことがキャプションの主語。

## Mulmo で参考にしてよいこと

1. **単一成果物の驚き** — 「1本の成果物からここまで」デモ設計。Mulmo なら「1 MulmoScript → 多言語・TTS・字幕・動画」の同型の驚き。
2. **同条件 A/B 比較** — モデル差・スタイル差を左右／上下で見せる。beat 分割向き。
3. **落差フック（F）** — 30秒前後で期待→反転。shorts / teaser 構成に直結。
4. **技法モンタージュ（G）** — 同一主題を表現技法だけ変えて畳む。`html_tailwind` / cinematic と相性良。
5. **役割分担の明示（E）** — 映像 / 声 / BGM のクレジット開示が信頼になる（西井さん自身の MulmoCast 例もこの型）。
6. **教材・解説の短尺（E）** — ナレ付き図解。explainer / presentation 系スキルへ。

既存レシピの正本（重複記述しない）:

- シネマティック: [`cinematic_patterns.md`](./cinematic_patterns.md)
- HTML アニメ DSL: [`html_animation_reference.md`](./html_animation_reference.md)
- スライド: [`slide_patterns.md`](./slide_patterns.md) / [`slide_dsl_reference.md`](./slide_dsl_reference.md)
- 画像プロンプト: [`image_prompt_reference.md`](./image_prompt_reference.md)

## パクってはいけない / 無理に寄せないこと

- 特定作品のビジュアル・IP・キャラ・BGM・カット割りそのままの複製
- Remotion 数千行や Blender MCP フルパイプラインを Mulmo の代替として丸ごと真似ること（目的が違う）
- 「動画生成 AI ゼロ」などのキャッチコピーそのものの模倣
- 個別作品のストーリー／演出のクローン

Mulmo の語り口は別価値で: **台本駆動・TTS・多言語・配信まで一気通貫**。

## Mulmo 向けに翻訳した打ち手（案）

| X の型 | Mulmo への落とし方 |
|--------|-------------------|
| A 1ファイル映画 | 「1 script / 1 コマンドで完成」デモ。途中工程を見せすぎない |
| B 同プロンプト比較 | 同一 MulmoScript で voice/style/lang だけ変えた二画面 or 連続 beat |
| F 落差フック | teaser: 盛り上げ beat → 反転 beat。ナレは短く |
| G 技法モンタージュ | 同一 text を image/html_tailwind/chart 等で畳む |
| E 分業クレジット | エンドカードで pipeline（script / TTS / BGM）を明示 |

## 更新ルール

- バズ個別の追記は月次で別ファイルに分けるか、本ファイル末尾に日付セクションを足す。
- レシピ本体は常に上記正本へ寄せ、本ファイルは**動機と型**に留める。
