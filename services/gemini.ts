
import { GoogleGenAI } from "@google/genai";

export const generateCareerAdvice = async (skills: string[], goal: string) => {
  try {
    // Initializing Gemini AI with API key from environment variables as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I am a B.Sc graduate web developer with skills in ${skills.join(', ')}. My goal is ${goal}. Please provide a 3-step action plan for my career. Format as clean text with points.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    
    // Direct access to the .text property of GenerateContentResponse (do not use .text())
    return response.text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "I'm currently unable to generate career advice. Please try again later.";
  }
};
