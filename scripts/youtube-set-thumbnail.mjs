#!/usr/bin/env node

/**
 * Set custom thumbnail for a YouTube video from its first frame
 *
 * Usage:
 *   node scripts/youtube-set-thumbnail.mjs --id <videoId> --file <video.mp4>
 *   node scripts/youtube-set-thumbnail.mjs --id <videoId> --image <thumbnail.jpg>
 */

import { google } from "googleapis";
import { readFileSync, createReadStream, existsSync, unlinkSync } from "fs";
import { resolve } from "path";
import { parseArgs } from "util";
import { execSync } from "child_process";

const loadEnv = (envPath) => {
  if (!existsSync(envPath)) return;
  readFileSync(envPath, "utf-8").split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) return;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  });
};

loadEnv(resolve(process.cwd(), ".env"));

const { values } = parseArgs({
  options: {
    id: { type: "string" },
    file: { type: "string" },
    image: { type: "string" },
  },
});

if (!values.id || (!values.file && !values.image)) {
  console.error("Usage: node scripts/youtube-set-thumbnail.mjs --id <videoId> --file <video.mp4>");
  console.error("   or: node scripts/youtube-set-thumbnail.mjs --id <videoId> --image <thumbnail.jpg>");
  process.exit(1);
}

const auth = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  "http://localhost:3000/oauth2callback",
);
auth.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });
const youtube = google.youtube({ version: "v3", auth });

let thumbPath = values.image;
let needsCleanup = false;

if (values.file) {
  thumbPath = resolve(process.cwd(), `output/thumbnail_${values.id}.jpg`);
  execSync(
    `ffmpeg -y -i "${values.file}" -vframes 1 -ss 0 -q:v 2 "${thumbPath}"`,
    { stdio: "pipe" },
  );
  console.log(`Extracted first frame: ${thumbPath}`);
  needsCleanup = true;
}

try {
  await youtube.thumbnails.set({
    videoId: values.id,
    media: {
      mimeType: "image/jpeg",
      body: createReadStream(thumbPath),
    },
  });
  console.log(`Thumbnail set for ${values.id}`);
} catch (err) {
  console.error("Failed:", err.message);
  if (err.message.includes("forbidden") || err.message.includes("verify")) {
    console.error("Note: Channel may need phone verification for custom thumbnails");
  }
}

if (needsCleanup && existsSync(thumbPath)) {
  unlinkSync(thumbPath);
}
