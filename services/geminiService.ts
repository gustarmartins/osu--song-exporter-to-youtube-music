
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_API_KEY } from '../constants';

class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (GEMINI_API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    } else {
      console.warn("Gemini API Key not found. GeminiService will not be functional.");
    }
  }

  public isAvailable(): boolean {
    return this.ai !== null;
  }

  public async refineSongTitle(originalTitle: string): Promise<string> {
    if (!this.ai) {
      console.warn("Gemini API not initialized. Returning original title.");
      return originalTitle;
    }

    const prompt = `
      From the following osu! beatmap folder name, extract only the artist and song title.
      Ignore any numbers, difficulty indicators like "[Hard]", mapset info like "(TV Size)", or mapper names.
      Return just "Artist - Song Title".

      Folder Name: "${originalTitle}"

      Cleaned Artist - Song Title:
    `;

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17", // Correct model
        contents: prompt,
      });
      
      const text = response.text.trim();
      // Basic cleanup for potential Gemini response artifacts
      return text.replace(/^Cleaned Artist - Song Title:\s*/i, '').trim();
    } catch (error) {
      console.error("Error calling Gemini API for title refinement:", error);
      return originalTitle; // Fallback to original title on error
    }
  }

  // Example: General text generation
  public async generateText(prompt: string): Promise<string> {
    if (!this.ai) {
      return "Gemini API not available.";
    }
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error("Error generating text with Gemini:", error);
      return "Error generating text.";
    }
  }
}

export const geminiService = new GeminiService();
