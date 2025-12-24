
import { GoogleGenAI, Type } from "@google/genai";
import { Idiom } from "../types";

export const fetchIdioms = async (kanji: string): Promise<Idiom[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `「${kanji}」という漢字一文字を使った熟語を5個から10個教えてください。
    日常的によく使われるものや、文学的、あるいは興味深い意味を持つものをバランスよく含めてください。
    それぞれの熟語について、ひらがなでの読み、簡潔な日本語の意味、そしてその熟語を使った例文を1つ作成してください。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: {
              type: Type.STRING,
              description: "漢字の熟語",
            },
            reading: {
              type: Type.STRING,
              description: "熟語の読み（ひらがな）",
            },
            meaning: {
              type: Type.STRING,
              description: "熟語の簡潔な意味",
            },
            example: {
              type: Type.STRING,
              description: "その熟語を使った例文",
            },
          },
          required: ["word", "reading", "meaning", "example"],
          propertyOrdering: ["word", "reading", "meaning", "example"],
        },
      },
    },
  });

  const jsonStr = response.text.trim();
  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to parse JSON response:", jsonStr);
    throw new Error("APIからの応答を解析できませんでした。");
  }
};
