import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export const callGroqLLM = async (prompt) => {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3-70b",   // Llama 3 via Groq Cloud
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    })
  });

  const json = await res.json();
  return json.choices[0].message.content;
};
