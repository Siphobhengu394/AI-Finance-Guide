const fetch = require("node-fetch");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL_NAME = process.env.GROQ_MODEL_NAME;

const callGroqLLM = async (prompt) => {
  const response = await fetch(`https://api.groq.com/v1/models/${GROQ_MODEL_NAME}/completions`, {
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
  });

  const data = await response.json();
  return data.completion || "Sorry, I couldn't generate a response.";
};

module.exports = { callGroqLLM };
