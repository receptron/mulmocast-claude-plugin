#!/usr/bin/env node

/**
 * YouTube Video Upload Script
 *
 * Usage:
 *   node scripts/youtube-upload.mjs --file <video.mp4> --title "Title" --description "Desc" [--tags "tag1,tag2"] [--privacy unlisted]
 *
 * Required env vars (in .env):
 *   YOUTUBE_CLIENT_ID
 *   YOUTUBE_CLIENT_SECRET
 *   YOUTUBE_REFRESH_TOKEN
 */

import { google } from "googleapis";
import { readFileSync, createReadStream, existsSync } from "fs";
import { resolve } from "path";
import { parseArgs } from "util";

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

const uploadVideo = async () => {
  validateArgs();
  validateEnv();

  const auth = createOAuth2Client();
  const youtube = google.youtube({ version: "v3", auth });

  const tags = values.tags
    ? values.tags.split(",").map((t) => t.trim())
    : [];

  console.log(`Uploading: ${values.file}`);
  console.log(`Title: ${values.title}`);
  console.log(`Privacy: ${values.privacy}`);

  const response = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title: values.title,
        description: values.description,
        tags,
        categoryId: "22", // People & Blogs
      },
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
};

uploadVideo().catch((err) => {
  console.error("Upload failed:", err.message);
  process.exit(1);
});
