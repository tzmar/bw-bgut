
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

export const getFinancialAdvice = async (transactions: Transaction[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const summary = transactions.slice(-20).map(t => `${t.date}: ${t.type} ${t.amount} BWP for ${t.category} (${t.title})`).join('\n');
  
  const prompt = `
    Act as a professional financial advisor in Botswana. 
    Analyze the following recent transactions (last 20) and provide 3 short, actionable bullet points for the user.
    Context: All amounts are in Botswana Pula (BWP).
    Keep advice culturally relevant to Botswana (e.g., mention pula, common local expenses like airtime, fuel, or savings).
    
    Transactions:
    ${summary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a friendly, expert Motswana financial advisor. Your advice is encouraging and practical.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Keep tracking your spending in BWP! Regular monitoring is the first step to financial freedom in Botswana.";
  }
};
