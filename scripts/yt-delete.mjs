#!/usr/bin/env node

/**
 * YouTube Video Delete Tool
 *
 * Usage:
 *   node scripts/yt-delete.mjs <videoId>
 */

import { loadEnv, createYouTubeClient } from "./lib/youtube-client.mjs";

loadEnv();

const videoId = process.argv[2];
if (!videoId) {
  console.error("Usage: node scripts/yt-delete.mjs <videoId>");
  process.exit(1);
}

const youtube = createYouTubeClient();
await youtube.videos.delete({ id: videoId });
console.log("Deleted:", videoId);
