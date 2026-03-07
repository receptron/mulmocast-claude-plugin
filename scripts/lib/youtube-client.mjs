import { google } from "googleapis";
import { readFileSync, createReadStream, existsSync, unlinkSync } from "fs";
import { resolve } from "path";
import { execSync } from "child_process";

const REDIRECT_URI = "http://localhost:3000/oauth2callback";

export const loadEnv = (envPath) => {
  const fullPath = envPath || resolve(process.cwd(), ".env");
  if (!existsSync(fullPath)) return;
  readFileSync(fullPath, "utf-8")
    .split("\n")
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) return;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    });
};

export const createYouTubeClient = () => {
  const required = [
    "YOUTUBE_CLIENT_ID",
    "YOUTUBE_CLIENT_SECRET",
    "YOUTUBE_REFRESH_TOKEN",
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`Missing env vars: ${missing.join(", ")}`);
    console.error("Run: node scripts/yt-auth.mjs to set up credentials");
    process.exit(1);
  }

  const auth = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    REDIRECT_URI,
  );
  auth.setCredentials({
    refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
  });

  return google.youtube({ version: "v3", auth });
};

export const extractThumbnail = (videoPath, outputPath) => {
  const thumbPath =
    outputPath || resolve(process.cwd(), `output/thumbnail_tmp.jpg`);
  execSync(
    `ffmpeg -y -i "${videoPath}" -vframes 1 -ss 0 -q:v 2 "${thumbPath}"`,
    { stdio: "pipe" },
  );
  if (!existsSync(thumbPath)) {
    throw new Error("Thumbnail extraction failed: file not created");
  }
  return thumbPath;
};

export const setThumbnailForVideo = async (youtube, videoId, sourcePath) => {
  const isVideo = /\.(mp4|mov|webm|mkv)$/i.test(sourcePath);
  let thumbPath = sourcePath;
  let needsCleanup = false;

  if (isVideo) {
    thumbPath = resolve(process.cwd(), `output/thumbnail_${videoId}.jpg`);
    extractThumbnail(sourcePath, thumbPath);
    console.log(`Extracted first frame: ${thumbPath}`);
    needsCleanup = true;
  }

  try {
    await youtube.thumbnails.set({
      videoId,
      media: {
        mimeType: "image/jpeg",
        body: createReadStream(thumbPath),
      },
    });
    console.log(`Thumbnail set for ${videoId}`);
  } catch (err) {
    console.error("Thumbnail upload failed:", err.message);
    if (err.message.includes("forbidden") || err.message.includes("verify")) {
      console.error(
        "Note: Channel may need phone verification for custom thumbnails",
      );
    }
  } finally {
    if (needsCleanup && existsSync(thumbPath)) {
      unlinkSync(thumbPath);
    }
  }
};

export const parseJSTDateTime = (dateTimeStr) => {
  const hasDate = dateTimeStr.includes("-");
  if (hasDate) {
    // "YYYY-MM-DDTHH:MM" format (JST)
    const jstDate = new Date(`${dateTimeStr}:00+09:00`);
    return jstDate;
  }
  // "HH:MM" format — use today/tomorrow in JST
  const [hourStr, minStr] = dateTimeStr.split(":");
  const targetHour = parseInt(hourStr, 10);
  const targetMin = parseInt(minStr || "0", 10);

  const now = new Date();
  const jstNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  jstNow.setHours(targetHour, targetMin, 0, 0);

  // Convert JST to UTC
  const utcTime = new Date(`${formatLocalDate(jstNow)}T${String(targetHour).padStart(2, "0")}:${String(targetMin).padStart(2, "0")}:00+09:00`);

  // If the time is in the past, schedule for tomorrow
  if (utcTime.getTime() <= now.getTime()) {
    utcTime.setDate(utcTime.getDate() + 1);
  }
  return utcTime;
};

const formatLocalDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
