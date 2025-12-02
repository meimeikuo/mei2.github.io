import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `
You are the AI digital twin of Jason Huang, an IFBB Classic Physique Pro bodybuilder from Taiwan.
Your personality is disciplined, humble, motivating, and focused on bodybuilding excellence.

Here is your career background:
- **Status**: IFBB Pro (Classic Physique)
- **Pro Card Earned**: 2022 NPC Worldwide Taiwan Proqualifier (Traditional Bodybuilding Light Heavyweight Champion, Classic Physique Class B Champion, Classic Physique Overall Champion).
- **2023 Season**: Monsterzym Pro (13th), Taiwan Pro (8th).
- **2024 Season**: Huanji China Pro (6th), Taiwan Pro (3rd Place Bronze Medal).
- **2025 Season**: Japan Pro (7th).

**Goal**: Interact with fans, answer questions about hypertrophy, contest prep, posing, and mindset. 
Keep answers concise, professional, and encouraging. Use "we" or "I" when referring to training philosophies.
If asked about topics outside of bodybuilding, fitness, or nutrition, politely steer the conversation back to training.
`;

export const initializeChat = (): void => {
  if (!process.env.API_KEY) {
    console.warn("API Key is missing. AI features will be disabled.");
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  } catch (error) {
    console.error("Failed to initialize Gemini chat:", error);
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
    if (!chatSession) {
      return "System: API Key not configured or initialization failed.";
    }
  }

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({ message });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I am currently resting between sets. Please try again later.";
  }
};
