
import { GoogleGenAI, Type } from "@google/genai";
import { MessageTone } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateRomanticMessage(recipient: string, tone: MessageTone): Promise<string> {
  const prompt = `Write a short, heartfelt Valentine's Day message for someone named "${recipient}". 
  The tone should be ${tone}. 
  Keep it under 150 characters. 
  Do not use quotes around the message.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });

    return response.text?.trim() || "Happy Valentine's Day! 💘";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Happy Valentine's Day! You make my world brighter. 💖";
  }
}
