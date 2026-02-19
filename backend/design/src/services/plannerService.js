import { GoogleGenAI } from "@google/genai";



export async function generateDesign(userPrompt) {
console.log("Calling Gemini with prompt:", userPrompt);
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

  const systemPrompt = `
You are a senior mobile app architect.

User idea: ${userPrompt}

Create a React Native mobile app design blueprint.

Return ONLY valid JSON.
No explanation.
No markdown.
No text outside JSON.

JSON structure:

{
  "appName": "",
  "platform": "React Native",
  "screens": [
    {
      "name": "",
      "components": []
    }
  ],
  "theme": {
    "primaryColor": "",
    "style": ""
  }
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: systemPrompt,
  });
console.log("Gemini response received");

  let text = response.text;

  // Clean markdown if Gemini adds it
  text = text.replace(/```json/g, "")
             .replace(/```/g, "")
             .trim();

  return JSON.parse(text);
}
