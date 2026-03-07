#!/usr/bin/env node

/**
 * YouTube Analytics Offline Analysis
 *
 * Usage:
 *   node scripts/yt-stats.mjs --json --shorts | node scripts/yt-analyze.mjs
 *   node scripts/yt-analyze.mjs --file data.json
 */

import { readFileSync } from "fs";
import { parseArgs } from "util";

const { values } = parseArgs({
  options: {
    file: { type: "string" },
  },
});

const readInput = () => {
  if (values.file) {
    return readFileSync(values.file, "utf8");
  }
  // Read from stdin
  return readFileSync(0, "utf8");
};

const data = JSON.parse(readInput());

const publicVids = data.filter((v) => v.privacy === "public");
const shorts = publicVids.filter((v) => {
  if (v.durationSec !== undefined) return v.durationSec <= 90;
  const match = v.duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  const secs =
    parseInt(match?.[1] || "0", 10) * 60 + parseInt(match?.[2] || "0", 10);
  return secs <= 90;
});

const target = shorts.length > 0 ? shorts : publicVids;

// === Basic Stats ===
const totalViews = target.reduce((s, v) => s + v.views, 0);
const totalLikes = target.reduce((s, v) => s + v.likes, 0);
const totalComments = target.reduce((s, v) => s + v.comments, 0);
const sortedViews = target.map((v) => v.views).sort((a, b) => a - b);
const median = sortedViews[Math.floor(sortedViews.length / 2)];

console.log("=== Basic Stats ===");
console.log(
  `Public videos: ${publicVids.length} (Shorts: ${shorts.length})`,
);
console.log(
  `Total views: ${totalViews} | Likes: ${totalLikes} | Comments: ${totalComments}`,
);
console.log(
  `Avg views: ${Math.round(totalViews / target.length)} | Median: ${median}`,
);
console.log(
  `Like rate: ${((totalLikes / totalViews) * 100).toFixed(2)}% | Comment rate: ${((totalComments / totalViews) * 100).toFixed(3)}%`,
);

// === Publish Hour Analysis (JST) ===
console.log("\n=== Publish Hour (JST) ===");
const hourBuckets = {};
target.forEach((v) => {
  const jstHour = (new Date(v.published).getUTCHours() + 9) % 24;
  const bucket = `${String(jstHour).padStart(2, "0")}`;
  if (!hourBuckets[bucket]) hourBuckets[bucket] = { views: 0, count: 0 };
  hourBuckets[bucket].views += v.views;
  hourBuckets[bucket].count++;
});
Object.entries(hourBuckets)
  .sort(([a], [b]) => a.localeCompare(b))
  .forEach(([h, d]) => {
    const avg = Math.round(d.views / d.count);
    console.log(`${h}h: ${d.count} videos | avg ${avg} views | total ${d.views}`);
  });

// === Day of Week Analysis ===
console.log("\n=== Day of Week ===");
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayBuckets = {};
target.forEach((v) => {
  const jstDate = new Date(new Date(v.published).getTime() + 9 * 3600000);
  const day = dayNames[jstDate.getUTCDay()];
  if (!dayBuckets[day]) dayBuckets[day] = { views: 0, count: 0 };
  dayBuckets[day].views += v.views;
  dayBuckets[day].count++;
});
["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach((d) => {
  const b = dayBuckets[d];
  if (b) console.log(`${d}: ${b.count} videos | avg ${Math.round(b.views / b.count)} views`);
});

// === Daily Posting ===
console.log("\n=== Daily Posts vs Performance ===");
const dateBuckets = {};
target.forEach((v) => {
  const jstDate = new Date(new Date(v.published).getTime() + 9 * 3600000);
  const dateStr = jstDate.toISOString().slice(0, 10);
  if (!dateBuckets[dateStr])
    dateBuckets[dateStr] = { views: 0, count: 0, videos: [] };
  dateBuckets[dateStr].views += v.views;
  dateBuckets[dateStr].count++;
  dateBuckets[dateStr].videos.push({
    title: v.title.slice(0, 35),
    views: v.views,
  });
});
Object.entries(dateBuckets)
  .sort()
  .forEach(([date, d]) => {
    const dayOfWeek = dayNames[new Date(date).getUTCDay()];
    console.log(
      `${date}(${dayOfWeek}) | ${d.count} videos | avg ${Math.round(d.views / d.count)} | total ${d.views}`,
    );
    d.videos
      .sort((a, b) => b.views - a.views)
      .forEach((v) => console.log(`  ${String(v.views).padStart(5)} | ${v.title}`));
  });

// === Views Distribution ===
console.log("\n=== Views Distribution ===");
const tiers = [
  { label: "1000+", min: 1000, max: Infinity },
  { label: "500-999", min: 500, max: 999 },
  { label: "100-499", min: 100, max: 499 },
  { label: "50-99", min: 50, max: 99 },
  { label: "10-49", min: 10, max: 49 },
  { label: "0-9", min: 0, max: 9 },
];
tiers.forEach((t) => {
  const vids = target.filter((v) => v.views >= t.min && v.views <= t.max);
  const bar = "\u2588".repeat(vids.length);
  console.log(
    `${t.label.padStart(8)}: ${String(vids.length).padStart(2)} ${bar}`,
  );
});

// === Engagement Ranking (50+ views) ===
console.log("\n=== Engagement Ranking (50+ views) ===");
const engaged = target
  .filter((v) => v.views >= 50)
  .map((v) => ({
    title: v.title.slice(0, 45),
    views: v.views,
    likes: v.likes,
    engRate: (((v.likes + v.comments) / v.views) * 100).toFixed(2),
  }))
  .sort((a, b) => b.engRate - a.engRate);
engaged.forEach((v) => {
  console.log(
    `${v.engRate}% eng | ${String(v.views).padStart(5)} views | ${v.title}`,
  );
});

// === Title Element Analysis ===
console.log("\n=== Title Element Analysis ===");
const patterns = [
  { label: "Includes 兆円", test: (v) => /兆円/.test(v.title) },
  { label: "Includes 万円", test: (v) => /万円/.test(v.title) },
  { label: "Includes %", test: (v) => /%|％/.test(v.title) },
  {
    label: "Numeric amounts",
    test: (v) => /[\d,.]+[兆万億円ドル%]/.test(v.title),
  },
  { label: "Company names", test: (v) => /東芝|デンソー|ソフトバンク|損保|トヨタ/.test(v.title) },
  { label: "Has ？", test: (v) => /？|\?/.test(v.title) },
  { label: "Has 「」", test: (v) => /「/.test(v.title) },
];
patterns.forEach((p) => {
  const matching = target.filter(p.test);
  const nonMatching = target.filter((v) => !p.test(v));
  if (matching.length === 0) return;
  const avgM = Math.round(
    matching.reduce((s, v) => s + v.views, 0) / matching.length,
  );
  const avgN =
    nonMatching.length > 0
      ? Math.round(
          nonMatching.reduce((s, v) => s + v.views, 0) / nonMatching.length,
        )
      : 0;
  const diff = avgM - avgN;
  const arrow = diff > 0 ? "\u2191" : "\u2193";
  console.log(
    `${p.label.padEnd(18)}: ${matching.length} videos | avg ${String(avgM).padStart(5)} vs ${String(avgN).padStart(5)} | ${arrow}${Math.abs(diff)}`,
  );
});

// === Growth Trend ===
console.log("\n=== Cumulative Views Trend ===");
let cumulative = 0;
Object.entries(dateBuckets)
  .sort()
  .forEach(([date, d]) => {
    cumulative += d.views;
    const bar = "\u2593".repeat(Math.round(cumulative / 500));
    console.log(
      `${date} | +${String(d.views).padStart(5)} | total ${String(cumulative).padStart(6)} ${bar}`,
    );
  });
