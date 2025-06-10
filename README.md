# Osu! Song Exporter to YouTube Music

Elegant utility to scan your local Osu! songs folder, extract the song titles, and help you sync or search them on YouTube Music.

## ✨ Features

- Reads the titles of your songs directly from your Osu! songs folder (nothing else, just the folder title!).
- Searches for these songs on YouTube Music using the YouTube Data API.
- Powered by Gemini AI services for enhanced search and matching.
- Flexible configuration for your own API keys.

## 🚀 Quick Start

### 1. Clone the repository

```sh
git clone https://github.com/gustarmartins/osu--song-exporter-to-youtube-music.git
cd osu--song-exporter-to-youtube-music
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure your API Keys

Open `constants.ts` and set your API credentials:

- **YouTube Data API Client ID**  
  Get your client ID from the [Google Cloud Console](https://console.cloud.google.com/) and replace `'YOUR_YOUTUBE_CLIENT_ID'` in:
  ```typescript
  export const YOUTUBE_API_CLIENT_ID: string = 'YOUR_YOUTUBE_CLIENT_ID';
  ```

- **Gemini API Key**  
  Set your Gemini API Key as an environment variable named `API_KEY`.  
  For example (Linux/macOS):
  ```sh
  export API_KEY=your-gemini-api-key
  ```
  Or on Windows (PowerShell):
  ```sh
  $env:API_KEY="your-gemini-api-key"
  ```

  The app will use this key for Gemini-powered features.

### 4. Run locally

```sh
npm run dev
```
or
```sh
npm start
```

Then open your browser at [http://localhost:3000](http://localhost:3000) (or as instructed in your terminal).

---

## 🛠️ How It Works

- The app reads your Osu! songs folder, extracts titles using a smart regex, and prepares them for matching with YouTube Music.
- It uses your provided YouTube Data API Client ID and Gemini API Key for searching and playlist management.

## 🤝 Contributions

Pull requests and issues are welcome!

## 🧠 Powered by Gemini

This app uses Gemini AI services for improved song search and matching. Make sure to set your API key as described above.

---

**Made with ❤️ for Osu! fans.**
