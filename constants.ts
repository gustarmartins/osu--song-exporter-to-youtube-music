
// IMPORTANT: Replace with your actual YouTube Data API Client ID
// You can obtain this from the Google Cloud Console: https://console.cloud.google.com/
export const YOUTUBE_API_CLIENT_ID: string = 'YOUR_YOUTUBE_CLIENT_ID';

// process.env.API_KEY is expected to be set in the environment for Gemini API
// For client-side, this might be window.process.env.API_KEY or injected by a build tool.
// If not available, geminiService will use a placeholder.
export const GEMINI_API_KEY: string | undefined = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : undefined;


export const YOUTUBE_API_SCOPES: string = [
  'https://www.googleapis.com/auth/youtube.readonly', // To read playlists
  'https://www.googleapis.com/auth/youtube.force-ssl' // To create playlists and add items
].join(' ');

export const APP_TITLE = "Osu! Song Sync";

export const OSU_FOLDER_NAME_CLEANUP_REGEX = /^\d*\s*(.+?)(?:\s*(?:\(|\[).*?(?:\)|\]))?\s*$/;
// This regex tries to:
// 1. `^\d*\s*`: Remove leading numbers (beatmap ID) and spaces.
// 2. `(.+?)`: Capture the main song title (artist - title). Non-greedy.
// 3. `(?:\s*(?:\(|\[).*?(?:\)|\]))?`: Optionally match and discard common suffixes like (TV Size), [difficulty], (Cut Ver.).
// 4. `\s*$`: Trim trailing spaces.
