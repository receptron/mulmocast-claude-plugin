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
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { URL } from "url";

const REDIRECT_PORT = 3000;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/oauth2callback`;
const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];

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
  prompt: "consent",
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
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Authorization successful!</h1><p>You can close this tab.</p>");

    console.log("");
    console.log("Authorization successful!");
    console.log("");
    console.log("Add this to your .env file:");
    console.log("");
    console.log(`YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}`);
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
