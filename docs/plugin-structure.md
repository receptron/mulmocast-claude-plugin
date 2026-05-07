# Plugin Structure

このリポジトリは **Claude Code Plugin** として配布されつつ、ローカルでも開発・利用できる二重構成になっている。

## ディレクトリレイアウト

```
mulmocast-claude-plugin/
├── .claude-plugin/        # Plugin 配布用メタデータ
│   ├── plugin.json        # name, version, author, repository
│   └── marketplace.json   # marketplace 配布用情報
├── .claude/               # ローカル開発時に Claude Code が読む
│   ├── settings.local.json
│   └── skills -> ../skills   # シンボリックリンク
├── skills/                # スキル本体（Plugin として配布される実体）
│   ├── mulmocast/         # ディスパッチャー
│   ├── presentation/
│   ├── story/
│   ├── narrate/
│   └── ...
├── references/            # スキルから参照される設計ガイド
│   ├── slide_dsl_reference.md
│   ├── html_animation_reference.md
│   └── ...
└── scripts/               # YouTube ツールやサンプル MulmoScript
```

## 二重構成の仕組み

Claude Code はスキルを以下のいずれかから読み込む：

1. `~/.claude/skills/` — ユーザーグローバル
2. **cwd の `.claude/skills/`** — プロジェクトローカル
3. インストールされた Plugin

このリポジトリは **2** と **3** の両方に対応している。

### ローカル開発時

`.claude/skills` が `../skills` へのシンボリックリンクになっている：

```bash
$ ls -la .claude/
lrwxr-xr-x  skills -> ../skills
```

これにより、このリポジトリ内で Claude Code を起動すると、`.claude/skills/` 経由で `skills/` 配下のスキルが認識される。スキル名は **namespace なし**（`/presentation`, `/story` など）。

### Plugin 配布時

`claude plugin install mulmocast@mulmocast-plugins` でインストールされた場合：

- `.claude-plugin/plugin.json` がプラグイン定義として認識される
- `skills/` 配下のスキルが **namespace 付き**（`/mulmocast:presentation`, `/mulmocast:story` など）で利用可能になる

## ディスパッチャーの fallback 戦略

`skills/mulmocast/SKILL.md` のディスパッチャーは、ユーザー入力を別のスキルにルーティングする際、両方の名前を順に試す：

```text
1. mulmocast:story → 見つからなければ
2. story → fallback
```

これにより、ローカル開発でも Plugin インストール後でも同じディスパッチャーで動作する。

## 開発フロー

### スキルの追加

```bash
mkdir skills/my-skill
cat > skills/my-skill/SKILL.md <<EOF
---
name: my-skill
description: ...
allowed-tools: Read, Write, Edit, Bash
user-invocable: true
---

# /my-skill — ...
EOF
```

シンボリックリンク経由で即座に Claude Code から利用可能。

### Plugin としてリリース

`.claude-plugin/plugin.json` の `version` を上げて、main にマージ。`mulmocast-plugins` marketplace で配布される。

## なぜシンボリックリンクなのか

- **GitHub 上での見やすさ**: `.claude/` ではなく `skills/` をトップレベルに置くことで、リポジトリの主旨（スキル集）が一目でわかる
- **両用対応**: ローカル開発でも Plugin 配布でも同じディレクトリ構造で動く
- **二重管理の回避**: スキル本体は `skills/` の1箇所だけ。`.claude/skills/` には実体を置かない

## 関連ファイル

| ファイル | 役割 |
|---------|------|
| `.claude-plugin/plugin.json` | Plugin メタデータ（name, version, author） |
| `.claude-plugin/marketplace.json` | Marketplace 配布用情報 |
| `.claude/skills` (symlink) | ローカル開発時のスキルパス |
| `.claude/settings.local.json` | ローカル開発時の Claude Code 設定 |
| `skills/*/SKILL.md` | 各スキルの定義 |
| `references/*.md` | スキルから参照される設計ドキュメント |
