#!/usr/bin/env node

/**
 * YouTube Channel Stats Tool
 *
 * Usage:
 *   node scripts/yt-stats.mjs              # Formatted table
 *   node scripts/yt-stats.mjs --json        # JSON output (for piping)
 *   node scripts/yt-stats.mjs --topics      # With topic breakdown
 *   node scripts/yt-stats.mjs --shorts      # Shorts only (<=90s)
 */

import { parseArgs } from "util";
import { loadEnv, createYouTubeClient } from "./lib/youtube-client.mjs";

loadEnv();

const { values } = parseArgs({
  options: {
    json: { type: "boolean", default: false },
    topics: { type: "boolean", default: false },
    shorts: { type: "boolean", default: false },
  },
});

const youtube = createYouTubeClient();

const CHANNEL_ID = "UCbTOk9XG0-2sTEXJB1owooQ";

// Fetch all video IDs with pagination
const fetchAllVideoIds = async () => {
  const allIds = [];
  let pageToken = "";
  do {
    const res = await youtube.search.list({
      channelId: CHANNEL_ID,
      part: "id",
      type: "video",
      maxResults: 50,
      order: "date",
      pageToken: pageToken || undefined,
    });
    res.data.items.forEach((item) => allIds.push(item.id.videoId));
    pageToken = res.data.nextPageToken || "";
  } while (pageToken);
  return allIds;
};

// Fetch video details in batches of 50
const fetchVideoDetails = async (videoIds) => {
  const videos = [];
  const BATCH_SIZE = 50;
  for (let i = 0; i < videoIds.length; i += BATCH_SIZE) {
    const batch = videoIds.slice(i, i + BATCH_SIZE);
    const res = await youtube.videos.list({
      part: "snippet,statistics,contentDetails,status",
      id: batch.join(","),
    });
    videos.push(...res.data.items);
  }
  return videos;
};

const parseDurationSec = (iso) => {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const h = parseInt(match?.[1] || "0", 10);
  const m = parseInt(match?.[2] || "0", 10);
  const s = parseInt(match?.[3] || "0", 10);
  return h * 3600 + m * 60 + s;
};

const videoIds = await fetchAllVideoIds();
const rawVideos = await fetchVideoDetails(videoIds);

const rows = rawVideos.map((v) => ({
  id: v.id,
  title: v.snippet.title,
  published: v.snippet.publishedAt,
  privacy: v.status.privacyStatus,
  views: parseInt(v.statistics.viewCount || "0", 10),
  likes: parseInt(v.statistics.likeCount || "0", 10),
  comments: parseInt(v.statistics.commentCount || "0", 10),
  duration: v.contentDetails.duration,
  durationSec: parseDurationSec(v.contentDetails.duration),
  tags: v.snippet.tags || [],
  description: v.snippet.description?.slice(0, 300) || "",
}));

rows.sort((a, b) => new Date(b.published) - new Date(a.published));

// Filter shorts if requested
const filteredRows = values.shorts
  ? rows.filter((r) => r.durationSec <= 90)
  : rows;

// JSON output mode
if (values.json) {
  console.log(JSON.stringify(filteredRows, null, 2));
  process.exit(0);
}

// Formatted table output
const publicRows = filteredRows.filter((r) => r.privacy === "public");
const totalViews = publicRows.reduce((s, r) => s + r.views, 0);
const totalLikes = publicRows.reduce((s, r) => s + r.likes, 0);
const totalComments = publicRows.reduce((s, r) => s + r.comments, 0);
const avgViews =
  publicRows.length > 0 ? Math.round(totalViews / publicRows.length) : 0;

console.log(`\n=== Channel Stats${values.shorts ? " (Shorts)" : ""} ===\n`);
console.log(`Total videos: ${filteredRows.length} (public: ${publicRows.length})`);
console.log(`Total views:  ${totalViews.toLocaleString()}`);
console.log(`Total likes:  ${totalLikes.toLocaleString()}`);
console.log(`Avg views:    ${avgViews.toLocaleString()}\n`);

// Video list sorted by date
console.log("--- All Videos ---\n");
filteredRows.forEach((r) => {
  const date = new Date(r.published).toISOString().slice(0, 16);
  const viewsStr = String(r.views).padStart(5);
  const likesStr = String(r.likes).padStart(3);
  const commentsStr = String(r.comments).padStart(2);
  const privacyStr = r.privacy.padEnd(9);
  console.log(
    `${date} | ${viewsStr} views | ${likesStr} likes | ${commentsStr} comments | ${privacyStr} | ${r.title}`,
  );
});

// Top 5 and Bottom 5
const sorted = [...publicRows].sort((a, b) => b.views - a.views);
console.log("\n--- TOP 5 ---");
sorted.slice(0, 5).forEach((r) => {
  console.log(`  ${r.views} views - ${r.title}`);
  console.log(`    https://www.youtube.com/shorts/${r.id}`);
});

console.log("\n--- BOTTOM 5 ---");
sorted.slice(-5).forEach((r) => {
  console.log(`  ${r.views} views - ${r.title}`);
});

// Topic analysis
if (values.topics) {
  console.log("\n--- Topic Analysis ---\n");
  const topics = {};
  const categorize = (title) => {
    if (/円安|ドル|為替/.test(title)) return "為替・円安";
    if (/原油|ホルムズ|中東/.test(title)) return "原油・中東";
    if (/AI|アンソロピック|OpenAI/.test(title)) return "AI関連";
    if (/半導体|デンソー|スイッチ/.test(title)) return "テック・半導体";
    if (/破綻|MFS|クラゲ/.test(title)) return "金融破綻";
    if (/バフェット|バークシャー|投資/.test(title)) return "投資・著名投資家";
    if (/日銀|植田|利上げ/.test(title)) return "日銀・金融政策";
    return "その他";
  };

  publicRows.forEach((r) => {
    const cat = categorize(r.title);
    if (!topics[cat]) topics[cat] = [];
    topics[cat].push(r.views);
  });

  Object.entries(topics)
    .sort((a, b) => {
      const avgA = a[1].reduce((s, v) => s + v, 0) / a[1].length;
      const avgB = b[1].reduce((s, v) => s + v, 0) / b[1].length;
      return avgB - avgA;
    })
    .forEach(([cat, viewsList]) => {
      const avg = Math.round(
        viewsList.reduce((s, v) => s + v, 0) / viewsList.length,
      );
      console.log(`  ${cat}: avg ${avg} views (${viewsList.length} videos)`);
    });
}
