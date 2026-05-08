import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: any = null;

function getAi() {
    if (!aiInstance) {
        aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    }
    return aiInstance;
}

export interface VisualAdjustments {
    particleSpeed: number;
    colorHue: number;
    patternComplexity: number;
}

export async function getVisualAdjustments(audioMood: string, energyLevel: number): Promise<VisualAdjustments> {
    const prompt = `The music mood is: "${audioMood}" and energy level is: ${energyLevel}/10. 
    Provide visual adjustments for an audio visualizer to match the mood and energy. 
    Return a JSON object with particleSpeed (float 0-10), colorHue (int 0-360), and patternComplexity (int 1-5).`;

    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        particleSpeed: { type: Type.NUMBER },
                        colorHue: { type: Type.NUMBER },
                        patternComplexity: { type: Type.INTEGER }
                    },
                    required: ["particleSpeed", "colorHue", "patternComplexity"],
                }
            }
        });
        
        return JSON.parse(response.text || "{}") as VisualAdjustments;
    } catch (error: any) {
        if (error?.message?.includes("RESOURCE_EXHAUSTED") || error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429) {
            console.warn("Gemini API quota exceeded. Using fallback visual adjustments.");
        } else {
            console.error("Gemini API error:", error);
        }
        return { particleSpeed: 5, colorHue: 200, patternComplexity: 3 }; // Fallback
    }
}
