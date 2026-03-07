#!/usr/bin/env node

/**
 * YouTube Video Update Tool
 *
 * Usage:
 *   node scripts/yt-update.mjs VIDEO_ID --public
 *   node scripts/yt-update.mjs VIDEO_ID --schedule "2026-03-09T08:00"
 *   node scripts/yt-update.mjs VIDEO_ID --description "New description"
 *   node scripts/yt-update.mjs VIDEO_ID --thumbnail output/video.mp4
 *   node scripts/yt-update.mjs VIDEO_ID --thumbnail image.jpg
 *   node scripts/yt-update.mjs VIDEO_ID --public --description "Desc" --thumbnail img.jpg
 */

import { parseArgs } from "util";
import {
  loadEnv,
  createYouTubeClient,
  parseJSTDateTime,
  setThumbnailForVideo,
} from "./lib/youtube-client.mjs";

loadEnv();

const { values, positionals } = parseArgs({
  options: {
    public: { type: "boolean", default: false },
    schedule: { type: "string" },
    description: { type: "string" },
    thumbnail: { type: "string" },
  },
  allowPositionals: true,
});

const videoId = positionals[0];
if (!videoId) {
  console.error("Usage: node scripts/yt-update.mjs <videoId> [options]");
  console.error("  --public              Set to public");
  console.error('  --schedule "YYYY-MM-DDTHH:MM"  Schedule publish (JST)');
  console.error('  --description "text"  Update description');
  console.error("  --thumbnail <path>    Set thumbnail (video or image)");
  process.exit(1);
}

const hasAction =
  values.public || values.schedule || values.description || values.thumbnail;
if (!hasAction) {
  console.error("No action specified. Use --public, --schedule, --description, or --thumbnail");
  process.exit(1);
}

const youtube = createYouTubeClient();

// Handle status update (--public or --schedule)
if (values.public || values.schedule) {
  const statusUpdate = {
    selfDeclaredMadeForKids: false,
  };

  if (values.public) {
    statusUpdate.privacyStatus = "public";
    console.log(`Setting ${videoId} to public...`);
  }

  if (values.schedule) {
    const publishAt = parseJSTDateTime(values.schedule);
    statusUpdate.privacyStatus = "private";
    statusUpdate.publishAt = publishAt.toISOString();
    const jstStr = publishAt.toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    });
    console.log(`Scheduling ${videoId} for ${jstStr} JST...`);
  }

  const res = await youtube.videos.update({
    part: ["status"],
    requestBody: { id: videoId, status: statusUpdate },
  });
  const st = res.data.status;
  console.log(`Status: ${st.privacyStatus}${st.publishAt ? ` | publishAt: ${st.publishAt}` : ""}`);
}

// Handle description update
if (values.description !== undefined) {
  console.log(`Updating description for ${videoId}...`);
  const res = await youtube.videos.list({ part: ["snippet"], id: [videoId] });
  const video = res.data.items?.[0];
  if (!video) {
    console.error("Video not found:", videoId);
    process.exit(1);
  }
  video.snippet.description = values.description;
  await youtube.videos.update({
    part: ["snippet"],
    requestBody: { id: videoId, snippet: video.snippet },
  });
  console.log("Description updated.");
}

// Handle thumbnail update
if (values.thumbnail) {
  console.log(`Setting thumbnail for ${videoId}...`);
  await setThumbnailForVideo(youtube, videoId, values.thumbnail);
}

console.log("Done.");
