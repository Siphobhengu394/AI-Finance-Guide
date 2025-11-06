// utils/groqClient.js
import fetch from 'node-fetch'; // <-- updated

const GROQ_API_KEY = process.env.GROQ_API_KEY.trim();
const GROQ_MODEL_NAME = process.env.GROQ_MODEL_NAME.trim();

export const callGroqLLM = async (prompt) => {
  try {
    const response = await fetch(
      `https://api.groq.com/v1/models/${GROQ_MODEL_NAME}/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          max_output_tokens: 300,
          temperature: 0.7
        }),
      }
    );

    const data = await response.json();
    console.log("Groq response:", data);

    if (data.error) throw new Error(data.error);
    return data.completion || "Sorry, I couldn't generate a response.";
  } catch (err) {
    console.error("Groq LLM error:", err.message);
    throw err;
  }
};
