import Income from '../models/Income.js';
import Expense from '../models/Expense.js';
import { callGroqLLM } from '../utils/groqClient.js';

export const getFinancialAdvice = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch all income and expenses for the user
    const incomes = await Income.find({ userId });
    const expenses = await Expense.find({ userId });

    // Aggregate data
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Expense breakdown by category
    const expenseBreakdown = {};
    expenses.forEach(e => {
      expenseBreakdown[e.category] = (expenseBreakdown[e.category] || 0) + e.amount;
    });

    // Income sources
    const incomeSources = {};
    incomes.forEach(i => {
      incomeSources[i.source] = (incomeSources[i.source] || 0) + i.amount;
    });

    const savings = totalIncome - totalExpenses;
    const savingsRatio = totalIncome ? ((savings / totalIncome) * 100).toFixed(1) : 0;

    // Build prompt
    const prompt = `
    You are a personal finance advisor. Analyze this user's data and provide:
    1. Summary
    2. Insights
    3. Recommendations

    Output JSON only with keys: summary, insights[], recommendations[].

    Data:
    ${JSON.stringify({ totalIncome, totalExpenses, expenseBreakdown, incomeSources, savings, savingsRatio }, null, 2)}
    `;

    const aiResponse = await callGroqLLM(prompt);

    // Parse AI JSON output
    let advice;
    try {
      advice = JSON.parse(aiResponse);
    } catch {
      advice = { summary: aiResponse, insights: [], recommendations: [] };
    }

    res.json({ advice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
