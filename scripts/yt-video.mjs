#!/usr/bin/env node

/**
 * YouTube Video Info Tool
 *
 * Usage:
 *   node scripts/yt-video.mjs VIDEO_ID
 *   node scripts/yt-video.mjs VIDEO_ID1 VIDEO_ID2 VIDEO_ID3
 */

import { loadEnv, createYouTubeClient } from "./lib/youtube-client.mjs";

loadEnv();

const videoIds = process.argv.slice(2);
if (videoIds.length === 0) {
  console.error("Usage: node scripts/yt-video.mjs <videoId> [videoId2] ...");
  process.exit(1);
}

const youtube = createYouTubeClient();

// YouTube API allows max 50 IDs per request — batch if needed
const MAX_IDS_PER_REQUEST = 50;
const allItems = [];

for (let i = 0; i < videoIds.length; i += MAX_IDS_PER_REQUEST) {
  const batch = videoIds.slice(i, i + MAX_IDS_PER_REQUEST);
  const res = await youtube.videos.list({
    part: ["snippet", "status", "statistics", "contentDetails"],
    id: batch,
  });
  allItems.push(...(res.data.items || []));
}

if (allItems.length === 0) {
  console.error("No videos found for:", videoIds.join(", "));
  process.exit(1);
}

const formatDuration = (iso) => {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const h = match?.[1] || "0";
  const m = match?.[2] || "0";
  const s = match?.[3] || "0";
  const parts = [];
  if (h !== "0") parts.push(`${h}h`);
  parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join("");
};

allItems.forEach((v) => {
  const stats = v.statistics;
  const snippet = v.snippet;
  const status = v.status;

  console.log(`--- ${v.id} ---`);
  console.log(`Title:       ${snippet.title}`);
  console.log(`Published:   ${snippet.publishedAt}`);
  console.log(`Privacy:     ${status.privacyStatus}`);
  if (status.publishAt) {
    console.log(`Scheduled:   ${status.publishAt}`);
  }
  console.log(`Duration:    ${formatDuration(v.contentDetails.duration)}`);
  console.log(
    `Views:       ${Number(stats.viewCount || 0).toLocaleString()}`,
  );
  console.log(
    `Likes:       ${Number(stats.likeCount || 0).toLocaleString()}`,
  );
  console.log(
    `Comments:    ${Number(stats.commentCount || 0).toLocaleString()}`,
  );
  if (snippet.tags?.length > 0) {
    console.log(`Tags:        ${snippet.tags.join(", ")}`);
  }
  const desc = snippet.description || "";
  if (desc.length > 0) {
    console.log(`Description: ${desc.slice(0, 200)}${desc.length > 200 ? "..." : ""}`);
  } else {
    console.log(`Description: (empty)`);
  }
  console.log(`URL:         https://www.youtube.com/shorts/${v.id}`);
  console.log();
});
