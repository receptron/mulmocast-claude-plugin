#!/usr/bin/env node

/**
 * YouTube Video Upload Script
 *
 * Usage:
 *   node scripts/yt-upload.mjs --file <video.mp4> --title "Title" [--description "Desc"] [--tags "tag1,tag2"] [--privacy unlisted] [--channel <channelId>] [--schedule "7:15"] [--schedule "2026-03-10T13:00"]
 */

import { createReadStream, existsSync } from "fs";
import { parseArgs } from "util";
import { createInterface } from "readline";
import {
  loadEnv,
  createYouTubeClient,
  parseJSTDateTime,
  setThumbnailForVideo,
} from "./lib/youtube-client.mjs";

loadEnv();

const { values } = parseArgs({
  options: {
    file: { type: "string" },
    title: { type: "string" },
    description: { type: "string", default: "" },
    tags: { type: "string", default: "" },
    privacy: { type: "string", default: "unlisted" },
    channel: { type: "string", default: "" },
    schedule: { type: "string", default: "" },
  },
});

const validateArgs = () => {
  const missing = [];
  if (!values.file) missing.push("--file");
  if (!values.title) missing.push("--title");
  if (missing.length > 0) {
    console.error(`Missing required arguments: ${missing.join(", ")}`);
    process.exit(1);
  }
  if (!existsSync(values.file)) {
    console.error(`File not found: ${values.file}`);
    process.exit(1);
  }
};

const prompt = (question) => {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
};

const selectChannel = async (youtube) => {
  if (values.channel) return values.channel;

  const response = await youtube.channels.list({
    part: ["snippet"],
    mine: true,
  });
  const channels = response.data.items || [];
  if (channels.length <= 1) return undefined;

  console.log("\nAvailable channels:");
  channels.forEach((ch, i) => {
    console.log(`  ${i + 1}. ${ch.snippet.title} (${ch.id})`);
  });

  const answer = await prompt(`\nSelect channel [1-${channels.length}]: `);
  const index = parseInt(answer, 10) - 1;
  if (index < 0 || index >= channels.length) {
    console.error("Invalid selection");
    process.exit(1);
  }
  return channels[index].id;
};

const MORNING_START = 7;
const MORNING_END = 9;
const AFTERNOON_START = 15;
const AFTERNOON_END = 17;

const getJSTNow = () => {
  const now = new Date();
  const jstOffset_ms = 9 * 60 * 60 * 1000;
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  return new Date(utc + jstOffset_ms);
};

const isInPublishWindow = (jstNow) => {
  const hour = jstNow.getHours();
  const min = jstNow.getMinutes();
  const time = hour + min / 60;
  return (
    (time >= MORNING_START && time < MORNING_END) ||
    (time >= AFTERNOON_START && time < AFTERNOON_END)
  );
};

const getNextPublishTime = (jstNow) => {
  const hour = jstNow.getHours();
  const min = jstNow.getMinutes();
  const time = hour + min / 60;

  const makeJSTDate = (baseDate, targetHour) => {
    const d = new Date(baseDate);
    d.setHours(targetHour, 0, 0, 0);
    return d;
  };

  let scheduledJST;
  if (time < MORNING_START) {
    scheduledJST = makeJSTDate(jstNow, MORNING_START);
  } else if (time >= MORNING_END && time < AFTERNOON_START) {
    scheduledJST = makeJSTDate(jstNow, AFTERNOON_START);
  } else {
    scheduledJST = makeJSTDate(jstNow, MORNING_START);
    scheduledJST.setDate(scheduledJST.getDate() + 1);
  }

  const localOffset_ms = new Date().getTimezoneOffset() * 60 * 1000;
  const jstOffset_ms = 9 * 60 * 60 * 1000;
  return new Date(scheduledJST.getTime() - localOffset_ms - jstOffset_ms);
};

const uploadVideo = async () => {
  validateArgs();

  const youtube = createYouTubeClient();
  const channelId = await selectChannel(youtube);

  const tags = values.tags
    ? values.tags.split(",").map((t) => t.trim())
    : [];

  console.log(`Uploading: ${values.file}`);
  console.log(`Title: ${values.title}`);
  console.log(`Privacy: ${values.privacy}`);
  if (channelId) console.log(`Channel: ${channelId}`);

  const snippet = {
    title: values.title,
    description: values.description,
    tags,
    categoryId: "22",
  };
  if (channelId) snippet.channelId = channelId;

  // Determine scheduling
  const jstNow = getJSTNow();
  let effectivePrivacy = values.privacy;
  let publishAt;

  if (values.schedule) {
    const scheduledUTC = parseJSTDateTime(values.schedule);
    publishAt = scheduledUTC.toISOString();
    effectivePrivacy = "private";
    console.log(
      `Scheduling for JST ${scheduledUTC.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
    );
  } else if (values.privacy === "public") {
    if (isInPublishWindow(jstNow)) {
      console.log(
        `JST ${jstNow.toLocaleTimeString("ja-JP")} — within publish window, publishing immediately`,
      );
    } else {
      const scheduledUTC = getNextPublishTime(jstNow);
      publishAt = scheduledUTC.toISOString();
      effectivePrivacy = "private";
      console.log(
        `JST ${jstNow.toLocaleTimeString("ja-JP")} — outside publish window, scheduling for JST ${scheduledUTC.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
      );
    }
  }

  const status = {
    privacyStatus: effectivePrivacy,
    selfDeclaredMadeForKids: false,
  };
  if (publishAt) {
    status.publishAt = publishAt;
  }

  const response = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: { snippet, status },
    media: { body: createReadStream(values.file) },
  });

  const videoId = response.data.id;
  console.log(`\nUpload complete!`);
  console.log(`Video ID: ${videoId}`);
  console.log(`URL: https://www.youtube.com/watch?v=${videoId}`);
  console.log(`Shorts URL: https://www.youtube.com/shorts/${videoId}`);
  if (publishAt) {
    console.log(
      `Scheduled publish: ${new Date(publishAt).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })} JST`,
    );
  }

  await setThumbnailForVideo(youtube, videoId, values.file);
};

uploadVideo().catch((err) => {
  console.error("Upload failed:", err.message);
  process.exit(1);
});
