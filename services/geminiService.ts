import { GoogleGenAI } from "@google/genai";

// Ensure the API_KEY is available in the environment variables.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not defined in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const GEMINI_MODEL = 'gemini-2.5-flash';

const systemInstruction = `당신은 수업 시작 전, 어색함을 깨고 대화를 시작할 수 있는 재미있는 랜덤 질문을 만드는 전문가입니다. 질문은 한 문장으로 간결해야 하며, 추가적인 설명 없이 질문 자체만 응답으로 제공해야 합니다. 긍정적이고 모든 연령대가 참여할 수 있는 질문을 만들어주세요.`;

export const generateRandomQuestion = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: "새로운 랜덤 질문을 만들어 주세요.",
      config: {
        systemInstruction: systemInstruction,
        temperature: 1.0, // Be creative
        topP: 0.95,
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("API did not return any text.");
    }
    
    return text.trim();
  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    throw new Error("Failed to generate random question from Gemini API.");
  }
};