#!/usr/bin/env node
import { google } from "googleapis";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) {
  readFileSync(envPath, "utf-8").split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eq = trimmed.indexOf("=");
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  });
}

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  "http://localhost:3000/oauth2callback",
);
oauth2Client.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });

const youtube = google.youtube({ version: "v3", auth: oauth2Client });

// チャンネルのアップロード一覧を取得
const channelRes = await youtube.channels.list({
  part: "contentDetails",
  mine: true,
});
const uploadsPlaylistId = channelRes.data.items[0].contentDetails.relatedPlaylists.uploads;

const playlistRes = await youtube.playlistItems.list({
  part: "snippet",
  playlistId: uploadsPlaylistId,
  maxResults: 50,
});

const videoIds = playlistRes.data.items.map((item) => item.snippet.resourceId.videoId);

const statsRes = await youtube.videos.list({
  part: "snippet,statistics,contentDetails",
  id: videoIds.join(","),
});

const videos = statsRes.data.items.map((v) => ({
  id: v.id,
  title: v.snippet.title,
  published: v.snippet.publishedAt,
  duration: v.contentDetails.duration,
  views: Number(v.statistics.viewCount),
  likes: Number(v.statistics.likeCount),
  comments: Number(v.statistics.commentCount),
}));

// ソート: 再生数の多い順
videos.sort((a, b) => b.views - a.views);

console.log("\n=== YouTube Channel Stats ===\n");
console.log(`Total videos: ${videos.length}`);
console.log(`Total views: ${videos.reduce((sum, v) => sum + v.views, 0).toLocaleString()}`);
console.log(`Total likes: ${videos.reduce((sum, v) => sum + v.likes, 0).toLocaleString()}\n`);

console.log("--- By Views (Top → Bottom) ---\n");
videos.forEach((v, i) => {
  const date = v.published.slice(0, 10);
  console.log(`${String(i + 1).padStart(2)}. [${date}] ${v.title}`);
  console.log(`    Views: ${v.views.toLocaleString()}  Likes: ${v.likes}  Comments: ${v.comments}  Duration: ${v.duration}`);
  console.log(`    https://www.youtube.com/shorts/${v.id}\n`);
});
