const express = require("express");
const router = express.Router();
const { callGroqLLM } = require("../utils/groqClient");

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    console.
    const response = await callGroqLLM(message);
    res.json({ reply: response });
  } catch (err) {
    console.error("Groq call failed:", err);
    res.status(500).json({ error: "Server error. Try again later." });
  }
});

module.exports = router;
