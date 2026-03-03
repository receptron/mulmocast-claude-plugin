#!/usr/bin/env node

/**
 * YouTube OAuth2 Setup Script (one-time)
 *
 * 1. Create a project at https://console.cloud.google.com/
 * 2. Enable YouTube Data API v3
 * 3. Create OAuth 2.0 Client ID (Desktop app)
 * 4. Set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET in .env
 * 5. Run this script to get the refresh token
 *
 * Usage:
 *   node scripts/youtube-auth.mjs
 */

import { google } from "googleapis";
import { createServer } from "http";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import { URL } from "url";

const REDIRECT_PORT = 3000;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/oauth2callback`;
const SCOPES = ["https://www.googleapis.com/auth/youtube"];

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

const ENV_PATH = resolve(process.cwd(), ".env");
loadEnv(ENV_PATH);

const updateEnvToken = (refreshToken) => {
  if (!existsSync(ENV_PATH)) return;
  const content = readFileSync(ENV_PATH, "utf-8");
  const lines = content.split("\n");
  const updated = lines.map((line) => {
    if (line.trim().startsWith("YOUTUBE_REFRESH_TOKEN=")) {
      return `YOUTUBE_REFRESH_TOKEN=${refreshToken}`;
    }
    return line;
  });
  if (!lines.some((l) => l.trim().startsWith("YOUTUBE_REFRESH_TOKEN="))) {
    updated.push(`YOUTUBE_REFRESH_TOKEN=${refreshToken}`);
  }
  writeFileSync(ENV_PATH, updated.join("\n"));
};

const clientId = process.env.YOUTUBE_CLIENT_ID;
const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error("Set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET in .env first.");
  console.error("");
  console.error("Steps:");
  console.error("1. Go to https://console.cloud.google.com/");
  console.error("2. Create a project (or select existing)");
  console.error("3. Enable YouTube Data API v3");
  console.error("4. Go to Credentials → Create OAuth 2.0 Client ID (Desktop app)");
  console.error("5. Add YOUTUBE_CLIENT_ID=... and YOUTUBE_CLIENT_SECRET=... to .env");
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "select_account consent",
});

console.log("Open this URL in your browser:");
console.log("");
console.log(authUrl);
console.log("");
console.log("Waiting for authorization...");

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${REDIRECT_PORT}`);
  if (url.pathname !== "/oauth2callback") {
    res.writeHead(404);
    res.end();
    return;
  }

  const code = url.searchParams.get("code");
  if (!code) {
    res.writeHead(400);
    res.end("Missing authorization code");
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const channelRes = await youtube.channels.list({ part: ["snippet"], mine: true });
    const channels = channelRes.data.items || [];

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Authorization successful!</h1><p>You can close this tab.</p>");

    console.log("");
    console.log("Authorization successful!");
    console.log("");
    if (channels.length > 0) {
      const ch = channels[0];
      console.log(`Authenticated channel: ${ch.snippet.title} (${ch.id})`);
      console.log("");
    }
    updateEnvToken(tokens.refresh_token);
    console.log("YOUTUBE_REFRESH_TOKEN updated in .env");
    console.log("");
  } catch (err) {
    res.writeHead(500);
    res.end("Token exchange failed");
    console.error("Token exchange failed:", err.message);
  } finally {
    server.close();
  }
});

server.listen(REDIRECT_PORT, () => {
  console.log(`Listening on http://localhost:${REDIRECT_PORT}`);
});
