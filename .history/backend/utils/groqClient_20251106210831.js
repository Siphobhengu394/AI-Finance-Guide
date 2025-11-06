require('dotenv').config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = process.env.GROQ_MODEL_NAME || "openai/gpt-oss-20b";

// Function to call Groq LLM API
const callGroqLLM = async (prompt) => {
  
  try {

    console.log("Calling Groq LLM with prompt:", prompt);

    const response = await fetch("https://api.z.ai/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer c1064d9d222c46abbbafd9095960f8f1.yxOJSZmHPiWySvrh`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "glm-4.5-flash",
        messages: [
          { role: "system", content: "You are a financial advisor assistant. " },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", data);
      throw new Error(data.error?.message || "Groq API call failed");
    }

    return data.choices?.[0]?.message?.content || "No response from Groq.";
  } catch (error) {
    console.error("Groq LLM error:", error.message);
    throw error;
  }
};

module.exports = { callGroqLLM };
