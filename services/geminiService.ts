
import { GoogleGenAI, Type } from "@google/genai";
import { SONGS } from "../constants";
import { Song } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getRecommendations = async (query: string): Promise<{ message: string; songIds: string[] }> => {
  try {
    // Updated to include description in metadata for better context
    const songMetadata = SONGS.map(s => `${s.id}: ${s.title} - Ref: ${s.bibleReference} - Desc: ${s.description}`).join('\n');

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User Query: "${query}"\n\nCatalog:\n${songMetadata}`,
      config: {
        systemInstruction: `You are the "DJ Bíblia Sertaneja AI".
        Your goal is to recommend songs from the provided catalog based on the user's mood, biblical theme, description or query.
        
        1. Return a friendly, short message in Portuguese adopting a "Country/Sertanejo Gospel" persona (use terms like "irmão", "abençoado", "glória a Deus", "moda boa").
        2. Select suitable song IDs from the catalog that match the query or biblical theme.
        
        Return ONLY JSON.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING, description: "A friendly message from the DJ." },
            songIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of matching song IDs."
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      message: "Desculpe, irmão. A conexão caiu aqui no monte. Tente de novo!",
      songIds: []
    };
  }
};
