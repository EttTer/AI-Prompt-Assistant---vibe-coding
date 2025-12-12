import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
} else {
    console.error("VITE_GEMINI_API_KEY is not set!");
}

export const generatePrompts = async (topic, purpose, tone, options = {}) => {
    if (!genAI) {
        throw new Error("API key is missing.");
    }

    const {
        targetAudience = 'obecné publikum',
        length = 'standardní',
        duration = 'neurčeno',
        product = topic,
        platform = 'sociální sítě'
    } = options;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `
You are an expert Czech Prompt Engineer. Your task is to generate 3 distinct, high-quality AI prompts (in Czech) for a user based on their specific requirements.
    
**User Requirements:**
- **Topic:** ${topic}
- **Product/Service:** ${product}
- **Purpose:** ${purpose}
- **Tone:** ${tone}
- **Target Audience:** ${targetAudience}
- **Length Constraint:** ${length}
- **Platform:** ${platform}
- **Duration (if workshop):** ${duration}

**Output Format:**
Return valid JSON array of strings only. Do not inlcude markdown code blocks.
Example:
[
  "Prompt 1 text...",
  "Prompt 2 text...",
  "Prompt 3 text..."
]

**Instructions:**
1. Create 3 DIFFERENT variations of the prompt that the user can use with an LLM (like ChatGPT or Gemini).
2. The prompts itself should be in CZECH.
3. The prompts should be structured, detailed, and ready to copy-paste.
4. Respect the tone and audience.
`;

    try {
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present (Gemini sometimes adds them)
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating prompts with Gemini:", error);
        // Fallback or re-throw
        return [
            `Omlouváme se, nastala chyba při generování: ${error.message}. Zkuste to prosím znovu.`,
            "...",
            "..."
        ];
    }
};
