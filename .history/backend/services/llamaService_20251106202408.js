const { queryLlama } = require("../services/llamaService");

exports.getFinancialAdvice = async (req, res) => {
  const { message } = req.body;

  

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await queryLlama(message);
    return res.json({ reply: response });
  } catch (error) {
    console.error("Financial Advice Error:", error.message);
    return res.status(500).json({ reply: "Server error. Try again later." });
  }
};
