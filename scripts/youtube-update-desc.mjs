#!/usr/bin/env node

import { google } from "googleapis";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { parseArgs } from "util";

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
    description: { type: "string" },
  },
});

if (!values.id || !values.description) {
  console.error("Usage: node scripts/youtube-update-desc.mjs --id <videoId> --description <text>");
  process.exit(1);
}

const auth = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  "http://localhost:3000/oauth2callback",
);
auth.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });
const youtube = google.youtube({ version: "v3", auth });

const res = await youtube.videos.list({ part: ["snippet"], id: [values.id] });
const video = res.data.items[0];
if (!video) {
  console.error("Video not found:", values.id);
  process.exit(1);
}

video.snippet.description = values.description;
await youtube.videos.update({
  part: ["snippet"],
  requestBody: { id: values.id, snippet: video.snippet },
});
console.log("Updated description for:", values.id);
