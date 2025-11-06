// backend/testGroq.js
require("dotenv").config();
const { callGroqLLM } = require("./utils/groqClient");

(async () => {
  try {
    const prompt = "Say: Hello from Groq Llama 3 (test).";
    const res = await callGroqLLM(prompt);
    console.log("LLM returned:", res);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
})();
