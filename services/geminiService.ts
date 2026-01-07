
import { GoogleGenAI } from "@google/genai";
import { BMIResult, UserInput } from "../types";

export const getHealthInsights = async (result: BMIResult, input: UserInput): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';

  const context = `
    BMI Result: ${result.bmi.toFixed(1)}
    Category: ${result.category}
    ${result.isChild ? `Percentile: ${result.percentile?.toFixed(1)}th percentile` : ''}
    Age: ${input.age} years and ${input.months} months
    Gender: ${input.gender === 1 ? 'Male' : 'Female'}
    Weight: ${input.weight} kg
    Height: ${input.height} cm
  `;

  const prompt = `
    Act as a friendly health expert. Analyze the following BMI result and provide 3 concise, supportive points:
    1. A clear explanation of what this result means for this specific age and gender.
    2. One positive encouragement.
    3. One general health tip related to maintaining or reaching a healthy BMI for this demographic.
    Keep the tone professional yet warm. Do not give specific medical advice or prescriptions. Use Markdown formatting.
    ---
    ${context}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text || "Insights currently unavailable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate insights at this moment.";
  }
};
