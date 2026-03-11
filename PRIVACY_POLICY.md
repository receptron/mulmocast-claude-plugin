# Privacy Policy

**Last updated:** March 11, 2026

## Overview

MulmoCast Claude Plugin ("the Plugin") is an open-source Claude Code plugin that generates video presentations, podcasts, and educational content locally on the user's machine. This privacy policy explains how the Plugin handles user data.

## Data Collection

The Plugin does **not** collect, store, transmit, or share any personal data or usage analytics. There is no telemetry, tracking, or data collection of any kind.

## Data Processing

All content processing occurs locally on the user's machine. The Plugin:

- Reads input files (URLs, PDFs, documents) only as explicitly requested by the user
- Generates output files (videos, audio, images) to the user's local filesystem
- Does **not** send data to any server operated by the Plugin authors

## Third-Party API Usage

The Plugin integrates with third-party AI services for content generation. These services are called only when the user explicitly triggers a skill, and are subject to their own privacy policies:

| Service | Purpose | Privacy Policy |
|---------|---------|----------------|
| OpenAI | Text-to-speech, image generation | https://openai.com/privacy |
| Google Cloud / Gemini | TTS, image generation | https://policies.google.com/privacy |
| ElevenLabs | Text-to-speech | https://elevenlabs.io/privacy-policy |
| Replicate | Video generation | https://replicate.com/privacy |
| YouTube Data API | Video upload | https://policies.google.com/privacy |

API keys for these services are stored locally in the user's `.env` file and are never transmitted to the Plugin authors.

## User Responsibility

Users are responsible for:

- Managing their own API keys and credentials securely
- Ensuring compliance with third-party service terms when using AI-generated content
- Content they create and publish using the Plugin

## Changes to This Policy

Updates to this policy will be reflected in this file with an updated date. As an open-source project, all changes are visible in the repository's commit history.

## Contact

For questions about this privacy policy, please open an issue at:
https://github.com/receptron/mulmocast-claude-plugin/issues
