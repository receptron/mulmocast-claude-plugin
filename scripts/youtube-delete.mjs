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

const videoId = process.argv[2];
if (!videoId) {
  console.error("Usage: node scripts/youtube-delete.mjs <videoId>");
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  "http://localhost:3000/oauth2callback",
);
oauth2Client.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });

const youtube = google.youtube({ version: "v3", auth: oauth2Client });
await youtube.videos.delete({ id: videoId });
console.log("Deleted:", videoId);
