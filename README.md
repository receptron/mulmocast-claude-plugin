# mulmocast-claude-plugin

[Claude Code](https://claude.com/claude-code) plugin for [MulmoCast](https://github.com/receptron/mulmocast-cli) — AI-native multi-modal presentation platform.

## Skills

### `/mulmocast:mulmocast` (dispatcher)

Unified entry point that automatically detects input type and routes to the appropriate skill.

```
/mulmocast:mulmocast https://example.com/article    → routes to story
/mulmocast:mulmocast samples/presentation.pdf       → routes to narrate
/mulmocast:mulmocast samples/document.md            → routes to narrate
/mulmocast:mulmocast scripts/talk/talk.json         → routes to extend
/mulmocast:mulmocast AI trends in 2026              → routes to story
/mulmocast:mulmocast https://example.com illustrate → routes to illustrate
/mulmocast:mulmocast AI trends, illustrated         → routes to illustrate
```

### `/mulmocast:story`

Create high-quality MulmoScript (video presentations) from scratch through a structured multi-phase creative process:

1. **Research** — Fetch URLs, search topics, collect visual assets
2. **Structure** — Design beat outline with appropriate scale
3. **Narration** — Write compelling spoken narration
4. **Visual Design** — Create slide layouts with the Slide DSL (11 layouts, 12 content block types)
5. **Assembly** — Combine into MulmoScript JSON and generate movie

**Usage:**
```
/mulmocast:story https://example.com/article 日本語でmovie
/mulmocast:story AI trends in 2026, 5 slides, English
/mulmocast:story path/to/document.pdf
```

### `/mulmocast:illustrate`

Create MulmoScript presentations where every visual is an AI-generated image via `imagePrompt`. Uses a structured 5-phase process:

1. **Research** — Fetch URLs, search topics, gather information
2. **Structure** — Design beat outline with visual concepts
3. **Narration** — Write spoken narration that complements images
4. **Image Prompts** — Write detailed prompts for AI image generation with consistent Visual Brief
5. **Assembly** — Combine into MulmoScript JSON and generate movie

**Usage:**
```
/mulmocast:illustrate https://example.com/article
/mulmocast:illustrate AI trends in 2026, illustrated
/mulmocast:illustrate 宇宙の歴史をイラストで
```

### `/mulmocast:narrate`

Convert source files (PDF, PPTX, Markdown, Keynote) into narrated ExtendedMulmoScript with AI-generated narration and metadata.

- **Markdown files**: Uses `parse-md` → presentation plan → `assemble-extended` pipeline with intelligent beat allocation and variant support (detailed/short profiles)
- **PDF/PPTX/Keynote**: Uses `narrate --scaffold-only` → AI analysis → metadata generation

**Usage:**
```
/mulmocast:narrate samples/paper.pdf
/mulmocast:narrate samples/slides.pptx
/mulmocast:narrate samples/document.md
```

### `/mulmocast:extend`

Add metadata to an existing MulmoScript to create an ExtendedMulmoScript. The metadata enables AI features (summarize, query) via `mulmocast-preprocessor`.

**Usage:**
```
/mulmocast:extend scripts/my-talk/my-talk.json
/mulmocast:extend scripts/my-talk/my-talk.json --source samples/my-talk.pdf
```

### `/mulmocast:presentation`

Create presentation slides interactively through a hearing → preview → feedback loop. Builds html_tailwind-based rich slides with animation.

1. **Hearing** — Gather theme, audience, goals, duration, tone
2. **Section-by-section creation** — Build slides per section, preview with `mulmocast movie`, iterate on feedback
3. **Assembly** — Integrate all sections, select theme/BGM, final quality check

**Usage:**
```
/mulmocast:presentation MulmoCastの20分プレゼン
/mulmocast:presentation AI trends, 10 minutes, for engineers
```

### `/mulmocast:news-shorts`

Create YouTube Shorts news videos — 2-3 beats, 18-50 seconds, portrait format with imagePrompt + html_tailwind animation.

**Usage:**
```
/mulmocast:news-shorts https://example.com/breaking-news
```

### `/mulmocast:fact-shorts`

Create "Did you know?" YouTube Shorts — 2-beat loop structure (12-18 seconds).

### `/mulmocast:explainer-shorts`

Create "What is ___?" explainer YouTube Shorts — 3-beat structure (15-25 seconds).

### `/mulmocast:ranking-shorts`

Create "Top 3" countdown YouTube Shorts — 3-beat ranking format (18-25 seconds).

### `/mulmocast:versus-shorts`

Create "X vs Y" comparison YouTube Shorts — 3-beat split-screen format (18-25 seconds).

### `/mulmocast:youtube-upload`

Upload a video file to YouTube. Automatically detects Shorts-eligible videos (vertical, ≤60s) and adds `#Shorts` tag.

**Usage:**
```
/mulmocast:youtube-upload output/my-video/my-video_ja.mp4
/mulmocast:youtube-upload output/my-video/my-video_ja.mp4 "動画タイトル"
```

### `/mulmocast:vocab-chat`

Create a vocabulary learning chat video with messenger-style animated UI and voiceover narration.

**Usage:**
```
/mulmocast:vocab-chat layover
```

### `/mulmocast:vocab-lesson`

Create a vocabulary lesson video with multi-section structure (word display, examples, explanation, review with translation).

**Usage:**
```
/mulmocast:vocab-lesson serendipity
```

### `/mulmocast:conversation-chat`

Create a conversation practice chat video with speech bubble UI and character illustrations.

**Usage:**
```
/mulmocast:conversation-chat ordering coffee
```

### `/mulmocast:stroke-order`

Create a stroke order animation video using KanjiVG data. Supports hiragana, katakana, kanji, and Latin alphabet.

**Usage:**
```
/mulmocast:stroke-order あいうえお
```

## References

The `references/` directory contains design guides for the `/mulmocast:story` and `/mulmocast:presentation` skills:

| Reference | Description |
|-----------|-------------|
| `slide_dsl_reference.md` | Slide DSL layout and block specifications |
| `slide_patterns.md` | Design pattern examples (dense slides, charts, mermaid) |
| `html_animation_reference.md` | MulmoAnimation DSL API reference |
| `cinematic_patterns.md` | Cinematic theme recipes — 14 themes with BGM URLs |
| `image_prompt_reference.md` | Image prompt writing guide and Visual Brief template |

## Repository Structure

This repo is both a **Claude Code Plugin** and a local development workspace. See [docs/plugin-structure.md](./docs/plugin-structure.md) for details on the dual-mode setup (Plugin distribution + local `.claude/skills` symlink).

## Installation

### Step 1: Add marketplace

```bash
claude plugin marketplace add receptron/mulmocast-claude-plugin
```

### Step 2: Install plugin

```bash
claude plugin install mulmocast@mulmocast-plugins
```

### Local development (alternative)

```bash
claude --plugin-dir /path/to/mulmocast-claude-plugin
```

## Prerequisites

### Required

- **Node.js** 22+
- **ffmpeg** — for video/audio assembly
  ```bash
  brew install ffmpeg   # macOS
  ```
- **OPENAI_API_KEY** — for text-to-speech (default TTS provider)
- **npx @mulmocast/slide** — for source file conversion (`narrate`, `extend` skills)
- **npx mulmocast-preprocessor** — for ExtendedMulmoScript processing

### Optional (for additional features)

| Env variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Google Gemini image generation & TTS |
| `REPLICATE_API_TOKEN` | Replicate video generation |
| `ELEVENLABS_API_KEY` | ElevenLabs TTS |

Set these in a `.env` file in your project root.

See [MulmoCast CLI setup](https://github.com/receptron/mulmocast-cli#configuration) for full details.

## YouTube Tools

### Available Scripts

| Script | Description |
|--------|-------------|
| `scripts/yt-auth.mjs` | OAuth2 initial setup (one-time) |
| `scripts/yt-upload.mjs` | Upload video with auto-scheduling |
| `scripts/yt-video.mjs` | Check video info (multiple IDs) |
| `scripts/yt-update.mjs` | Update video (--public, --schedule, --description, --thumbnail) |
| `scripts/yt-stats.mjs` | Channel stats (--json, --topics, --shorts) |
| `scripts/yt-analyze.mjs` | Offline analysis (stdin or --file) |
| `scripts/yt-delete.mjs` | Delete a video |

Shared code is in `scripts/lib/youtube-client.mjs`.

> **Known limitation**: These scripts are designed to run from the plugin root directory (`node scripts/yt-*.mjs`). They resolve `.env` from `process.cwd()` and `googleapis` from the plugin's `node_modules/`. When this plugin is installed by other users via Claude Code, the scripts may not be directly executable from the user's project directory. A future improvement would be to publish them as a separate npm package or use `import.meta.url` for path resolution.

### Setup

The `/mulmocast:youtube-upload` skill requires YouTube Data API credentials. Follow these steps to set up.

### Step 1: Create a Google Cloud project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter a project name (e.g. `mulmocast-youtube`) and click **Create**

### Step 2: Enable YouTube Data API v3

1. In your project, go to **APIs & Services** → **Library**
2. Search for **YouTube Data API v3**
3. Click **Enable**

### Step 3: Create OAuth 2.0 credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure the **OAuth consent screen** first:
   - Choose **External** user type
   - Fill in app name, user support email, and developer contact email
   - Skip scopes — the auth script requests them automatically
   - Click **Save and Return**
4. Back on **Create OAuth client ID**:
   - Application type: **Desktop app**
   - Name: any name (e.g. `mulmocast-uploader`)
   - Click **Create**
5. Copy the **Client ID** and **Client Secret**

### Step 4: Add yourself as a test user

> **Important**: Without this step, authentication will fail with `Error 403: access_denied`.

1. Go to **APIs & Services** → **OAuth consent screen**
2. Click **Test users** → **Add users**
3. Enter your Google account email address (the one you will use to upload videos)
4. Click **Save**

### Step 5: Set environment variables

Add the credentials to your `.env` file in the plugin root:

```
YOUTUBE_CLIENT_ID=your_client_id_here
YOUTUBE_CLIENT_SECRET=your_client_secret_here
```

### Step 6: Obtain a refresh token

Run the auth script:

```bash
node scripts/yt-auth.mjs
```

1. A URL will be displayed — open it in your browser
2. Sign in with the Google account you added as a test user
3. Grant the requested permissions
4. The script outputs a refresh token — add it to `.env`:

```
YOUTUBE_REFRESH_TOKEN=your_refresh_token_here
```

### Step 7: Install dependencies

```bash
yarn install
```

### Step 8: Verify

Test with an unlisted upload:

```bash
node scripts/yt-upload.mjs \
  --file "output/your-video/video.mp4" \
  --title "Test Upload" \
  --privacy unlisted
```

> **Note**: While the OAuth app is in "Testing" status, only registered test users can authenticate, and uploaded videos may default to **private** regardless of the `--privacy` setting. To lift these restrictions, submit the app for Google's verification review in the OAuth consent screen settings.

## License

MIT
