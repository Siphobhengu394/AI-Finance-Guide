// pages/api/financial-advice.js
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const financialData = req.body;

    // Construct the prompt for the AI
    const prompt = `
You are an expert personal finance advisor analyzing a user's financial dashboard.

Here are the user's financial details:
${JSON.stringify(financialData, null, 2)}

Please provide:
1. A concise summary of the user's financial situation
2. 2-3 key insights about their spending, saving, or income patterns
3. 3-4 personalized, actionable recommendations to improve their financial health

Format your response as JSON with these keys:
- summary (string)
- insights (array of strings)
- recommendations (array of strings)

Focus on being practical, encouraging, and specific to their data.
`;

    // Call your AI service (OpenAI, local LLM, etc.)
    const aiResponse = await fetch('http://localhost:5000/api/analyze-finances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, financialData }),
    });

    const advice = await aiResponse.json();
    
    res.status(200).json({ advice: advice.response });
  } catch (error) {
    console.error('Financial advice error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}