import fetch from "node-fetch";

export const callGroqLLM = async (prompt) => {
  const apiKey = process.env.GROQ_API_KEY;
  const modelName = process.env.GROQ_MODEL_NAME || "llama-3";

  const response = await fetch(`https://api.groq.ai/v1/engines/${modelName}/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt,
      max_tokens: 500,
      temperature: 0.7
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.text || "No response from LLM.";
};
