---
name: youtube-upload
description: Upload video to YouTube (Shorts or regular)
allowed-tools: Read, Edit, Bash, Glob, Grep
user-invocable: true
---

# /youtube-upload — Upload Video to YouTube

Upload a video file to YouTube. Automatically detects Shorts-eligible videos (vertical, ≤60s) and adds `#Shorts` tag.

## Prerequisites

### First-time setup

1. Ensure `googleapis` is installed:
   ```bash
   npm ls googleapis 2>/dev/null || npm install -g googleapis
   ```

2. Check if YouTube credentials exist in `.env`:
   ```
   YOUTUBE_CLIENT_ID=...
   YOUTUBE_CLIENT_SECRET=...
   YOUTUBE_REFRESH_TOKEN=...
   ```

3. If credentials are missing, guide the user:
   - Go to https://console.cloud.google.com/
   - Create or select a project
   - Enable **YouTube Data API v3**
   - Go to **Credentials** → **Create OAuth 2.0 Client ID** (Desktop app)
   - Add `YOUTUBE_CLIENT_ID` and `YOUTUBE_CLIENT_SECRET` to `.env`
   - Run `node scripts/youtube-auth.mjs` to get `YOUTUBE_REFRESH_TOKEN`

## Invocation

```
/youtube-upload <video file> [title]
```

## Instructions

### Step 1: Identify the video file

If a file path is provided, use it directly. Otherwise, look for the most recent `.mp4` in `output/` subdirectories (videos are stored under `output/{topic}/script_ja.mp4`).

```bash
ls -t output/*/script_ja.mp4 2>/dev/null | head -5
```

### Step 2: Detect if the video is Shorts-eligible

Use `ffprobe` to check dimensions and duration:

```bash
ffprobe -v quiet -print_format json -show_streams -show_format <video_file>
```

- **Shorts**: vertical (height > width) AND duration ≤ 60s
- **Regular**: everything else

### Step 3: Prepare title and description

Ask the user for:
- **Title** (max 100 chars) — **[MUST] First 15 characters are critical**: Shorts feed truncates titles. Put the most impactful phrase first. For Japanese-target Shorts, do NOT add English subtitles (e.g., `| Shadow Bank`). Use that space for Japanese keywords.
- **Description** — **[MUST]** Every upload MUST include a ~200 character summary of the news/content covered in the video. Extract this from the script.json `description` field or compose from the beat texts. NEVER upload with an empty description.
- **Tags** — **[SHOULD]** Add topic-relevant tags beyond `#Shorts` (e.g., `円安,ホルムズ,投資,経済ニュース`). These improve search discoverability.
- **Privacy** (public / unlisted / private, default: unlisted)

For Shorts, automatically add `#Shorts` to the title if not already present.

### Publishing pace

- **[SHOULD]** Limit to **2-3 uploads per day** for optimal algorithm treatment. Bulk uploading (10+ in one day) can hurt channel evaluation.

### Step 4: Upload

```bash
node scripts/youtube-upload.mjs \
  --file "<video_file>" \
  --title "<title>" \
  --description "<description>" \
  --tags "<tag1,tag2>" \
  --privacy "<privacy>"
```

### Step 5: Report result

Display the upload result:
- Video URL: `https://www.youtube.com/watch?v=<id>`
- Shorts URL (if applicable): `https://www.youtube.com/shorts/<id>`

## Notes

- New/unverified OAuth apps may have uploads default to **private** until Google's compliance audit is passed
- YouTube Shorts: vertical video (9:16), ≤ 60 seconds
- `#Shorts` in the title helps YouTube categorize the video as a Short
