#!/usr/bin/env node

import { google } from "googleapis";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

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

const auth = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  "http://localhost:3000/oauth2callback",
);
auth.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });
const youtube = google.youtube({ version: "v3", auth });

// All mulmocast videos (excluding old VideoShader ones)
const videoIds = [
  "MGLAxBEp2yo", "R5S_9__wlxw", "y3mMpxJfqT0",
  "Y4NC2Y4anZU", "o-GxTUOZSN8", "I9DZiEG4TdI",
  "4voDWCNpkW0", "Hi5zpsIv-Lk", "YIABbzRB0FE",
  "xJfgt2bowDs", "qKcOsivFT-w", "DKzMO-moNvU",
  "7tGa0T1Qw20", "Ki0pmOzTvfo", "qKSXskzMPSw",
  "0l7jhp29Fhg", "IhJstrmKUOY", "bXjto0Oga-o",
  "J43vFbsPZME", "JFvohN15MhE",
];

// YouTube API allows max 50 IDs per request
const res = await youtube.videos.list({
  part: ["snippet"],
  id: videoIds,
});

const items = res.data.items || [];
items.forEach((v) => {
  const desc = v.snippet.description || "";
  const status = desc.length > 10 ? "OK" : "EMPTY";
  console.log(`[${status}] ${v.id} | ${v.snippet.title}`);
  if (status === "OK") {
    console.log(`  Desc: ${desc.substring(0, 80)}...`);
  }
  console.log();
});
