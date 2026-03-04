#!/usr/bin/env node

/**
 * YouTube Video Upload Script
 *
 * Usage:
 *   node scripts/youtube-upload.mjs --file <video.mp4> --title "Title" --description "Desc" [--tags "tag1,tag2"] [--privacy unlisted] [--channel <channelId>]
 *
 * Required env vars (in .env):
 *   YOUTUBE_CLIENT_ID
 *   YOUTUBE_CLIENT_SECRET
 *   YOUTUBE_REFRESH_TOKEN
 */

import { google } from "googleapis";
import { readFileSync, createReadStream, existsSync, unlinkSync } from "fs";
import { resolve } from "path";
import { parseArgs } from "util";
import { createInterface } from "readline";
import { execSync } from "child_process";

const loadEnv = (envPath) => {
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, "utf-8").split("\n");
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) return;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
};

loadEnv(resolve(process.cwd(), ".env"));

const { values } = parseArgs({
  options: {
    file: { type: "string" },
    title: { type: "string" },
    description: { type: "string", default: "" },
    tags: { type: "string", default: "" },
    privacy: { type: "string", default: "unlisted" },
    channel: { type: "string", default: "" },
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

const validateEnv = () => {
  const required = [
    "YOUTUBE_CLIENT_ID",
    "YOUTUBE_CLIENT_SECRET",
    "YOUTUBE_REFRESH_TOKEN",
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`Missing env vars: ${missing.join(", ")}`);
    console.error("Run: node scripts/youtube-auth.mjs to set up credentials");
    process.exit(1);
  }
};

const createOAuth2Client = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    "http://localhost:3000/oauth2callback",
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
  });
  return oauth2Client;
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

const listChannels = async (youtube) => {
  const response = await youtube.channels.list({
    part: ["snippet"],
    mine: true,
  });
  return response.data.items || [];
};

const selectChannel = async (youtube) => {
  if (values.channel) return values.channel;

  const channels = await listChannels(youtube);
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

const uploadVideo = async () => {
  validateArgs();
  validateEnv();

  const auth = createOAuth2Client();
  const youtube = google.youtube({ version: "v3", auth });

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
    categoryId: "22", // People & Blogs
  };
  if (channelId) snippet.channelId = channelId;

  const response = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet,
      status: {
        privacyStatus: values.privacy,
        selfDeclaredMadeForKids: false,
      },
    },
    media: {
      body: createReadStream(values.file),
    },
  });

  const videoId = response.data.id;
  console.log(`\nUpload complete!`);
  console.log(`Video ID: ${videoId}`);
  console.log(`URL: https://www.youtube.com/watch?v=${videoId}`);
  console.log(`Shorts URL: https://www.youtube.com/shorts/${videoId}`);

  // Extract first frame and set as custom thumbnail
  await setThumbnailFromFirstFrame(youtube, videoId, values.file);
};

const setThumbnailFromFirstFrame = async (youtube, videoId, videoFile) => {
  const thumbPath = resolve(process.cwd(), `output/thumbnail_${videoId}.jpg`);
  try {
    execSync(
      `ffmpeg -y -i "${videoFile}" -vframes 1 -ss 0 -q:v 2 "${thumbPath}"`,
      { stdio: "pipe" },
    );
    if (!existsSync(thumbPath)) {
      console.error("Thumbnail extraction failed: file not created");
      return;
    }
    console.log(`Thumbnail extracted: ${thumbPath}`);

    await youtube.thumbnails.set({
      videoId,
      media: {
        mimeType: "image/jpeg",
        body: createReadStream(thumbPath),
      },
    });
    console.log("Custom thumbnail set successfully!");
    unlinkSync(thumbPath);
  } catch (err) {
    console.error("Thumbnail upload failed:", err.message);
    if (err.message.includes("forbidden") || err.message.includes("verify")) {
      console.error("Note: Channel may need phone verification for custom thumbnails");
    }
  }
};

uploadVideo().catch((err) => {
  console.error("Upload failed:", err.message);
  process.exit(1);
});
