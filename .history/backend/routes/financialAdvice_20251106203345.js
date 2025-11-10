const express = require("express");
const router = express.Router();
const { callGroqLLM } = require("../utils/groqClient");

router.post("/", async (req, res) => {
  try {
    console.log("Received request for financial advice:", req.body);
    const { messages } = req.body;
    const response = await callGroqLLM(message);
    res.json({ reply: response });
  } catch (err) {
    console.error("Groq call failed:", err);
    res.status(500).json({ error: "Server error. Try again later." });
  }
});

module.exports = router;
