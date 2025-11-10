import express from "express";
import { OpenAI } from "openai";
import Income from "../models/Income.js";
import Expense from "../models/Expense.js";

const router = express.Router();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", async (req, res) => {
  try {
    const userId = req.body.userId;

    // Get income & expenses for the user
    const incomes = await Income.find({ userId });
    const expenses = await Expense.find({ userId });

    if (!incomes.length && !expenses.length)
      return res.json({ advice: "No financial records found." });

    const totalIncome = incomes.reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

    const expenseBreakdown = {};
    expenses.forEach((e) => {
      expenseBreakdown[e.category] = (expenseBreakdown[e.category] || 0) + e.amount;
    });

    const incomeSources = {};
    incomes.forEach((i) => {
      incomeSources[i.source] = (incomeSources[i.source] || 0) + i.amount;
    });

    const savings = totalIncome - totalExpenses;
    const savingsRatio = ((savings / totalIncome) * 100).toFixed(1);

    const financeData = {
      totalIncome,
      totalExpenses,
      expenseBreakdown,
      incomeSources,
      savings,
      savingsRatio,
    };

    const prompt = `
You are a financial advisor AI. Analyze the user's financial data below and return:
- summary
- insights
- 3 personalized recommendations
Return it in JSON format.

Data:
${JSON.stringify(financeData, null, 2)}
`;

    const response = await client.chat.completions.create({
      model: "gpt-5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    res.json({ advice: JSON.parse(response.choices[0].message.content) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate financial advice." });
  }
});

export default router;
