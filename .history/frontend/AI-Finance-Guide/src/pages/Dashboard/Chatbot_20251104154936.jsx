import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from '../../hooks/useUserAuth';

const Chatbot = () => {
  useUserAuth();
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello 👋, I'm your Financial Advisor. How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [financialData, setFinancialData] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);

  // Fetch user's financial data for advisory layer
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const res = await fetch("/api/user/financial-data");
        const data = await res.json();
        setFinancialData(data);
        
        // Get AI insights based on financial data
        if (data) {
          const insightsRes = await fetch("/api/financial-advice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const insights = await insightsRes.json();
          setAiInsights(insights.advice);
        }
      } catch (error) {
        console.error("Error fetching financial data:", error);
      }
    };

    fetchFinancialData();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Include financial data for context-aware responses
      const requestBody = { 
        message: input,
        financialData: financialData 
      };

      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      const data = await res.json();
      const botMessage = { 
        sender: "bot", 
        text: data.reply || "Sorry, I couldn't process that.",
        type: data.type || "general" // 'insight', 'advice', 'general'
      };
      setMessages((prev) => [...prev, botMessage]);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setMessages((prev) => [...prev, { 
        sender: "bot", 
        text: "Server error. Try again later." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick question suggestions
  const quickQuestions = [
    "How can I start investing with R1000?",
    "What's the best way to save for retirement?",
    "How to create a monthly budget?",
    "What are good debt management strategies?",
    "Should I pay off debt or invest first?",
    "How much should I save for emergency fund?",
    "Analyze my spending patterns",
    "Give me financial insights based on my data"
  ];

  // Financial advisory questions
  const advisoryQuestions = [
    "What's my savings rate?",
    "Where am I overspending?",
    "How can I improve my budget?",
    "Analyze my income vs expenses"
  ];

  return (
    <DashboardLayout activeMenu="Chatbot">
      <div className="h-[calc(100vh-140px)] flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            AI Financial Advisor
          </h1>
          <p className="text-gray-600 mt-1">
            Get personalized financial advice powered by AI with real-time data analysis
          </p>
        </div>

        {/* AI Insights Banner */}
        {aiInsights && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                AI
              </div>
              <h3 className="font-semibold text-gray-800">Financial Insights</h3>
            </div>
            <div className="text-sm text-gray-700 ml-11">
              {typeof aiInsights === 'string' ? aiInsights : (
                <div className="space-y-2">
                  {aiInsights.summary && (
                    <p><strong>Summary:</strong> {aiInsights.summary}</p>
                  )}
                  {aiInsights.insights && aiInsights.insights.length > 0 && (
                    <div>
                      <strong>Key Insights:</strong>
                      <ul className="list-disc list-inside ml-4">
                        {aiInsights.insights.map((insight, index) => (
                          <li key={index}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {aiInsights.recommendations && aiInsights.recommendations.length > 0 && (
                    <div>
                      <strong>Recommendations:</strong>
                      <ul className="list-disc list-inside ml-4">
                        {aiInsights.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-0">
          {/* Chat Container - Takes 3/4 width on desktop */}
          <div className="xl:col-span-3 flex flex-col min-h-0">
            <div className="card h-full flex flex-col min-h-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto bg-slate-50 rounded-xl p-4 mb-4 border border-slate-200 min-h-0">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none shadow-lg shadow-purple-600/20"
                            : msg.type === 'insight' 
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 text-gray-800 rounded-bl-none border border-green-200 shadow-sm"
                            : msg.type === 'advice'
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 rounded-bl-none border border-blue-200 shadow-sm"
                            : "bg-white text-gray-800 rounded-bl-none border border-gray-200/50 shadow-sm"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {msg.sender === "bot" && (
                            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-400 rounded-full flex items-center justify-center text-xs text-white font-bold mt-1 flex-shrink-0">
                              AI
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                            {msg.type && (
                              <div className="mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  msg.type === 'insight' 
                                    ? 'bg-green-100 text-green-800'
                                    : msg.type === 'advice'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {msg.type}
                                </span>
                              </div>
                            )}
                          </div>
                          {msg.sender === "user" && (
                            <div className="w-6 h-6 bg-gradient-to-r from-gray-600 to-gray-400 rounded-full flex items-center justify-center text-xs text-white font-bold mt-1 flex-shrink-0">
                              You
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 border border-gray-200/50 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-400 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                            AI
                          </div>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input Area */}
              <div className="flex gap-3 items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about investments, savings, budgeting, or analyze your financial data..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={loading}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2 whitespace-nowrap h-[52px]"
                >
                  <span>Send</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                Press Enter to send • Financial advice for educational purposes
              </p>
            </div>
          </div>

          {/* Quick Questions Sidebar - Takes 1/4 width on desktop */}
          <div className="xl:col-span-1 flex flex-col min-h-0">
            <div className="card h-full flex flex-col min-h-0">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">💡 Quick Questions</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get started with these common financial questions
              </p>
              
              {/* Advisory Questions */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2 text-sm">📊 Data Analysis</h4>
                <div className="space-y-2">
                  {advisoryQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="w-full text-left p-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              <Divider className="my-3" />

              {/* General Questions */}
              <div className="space-y-3 flex-1 overflow-y-auto min-h-0">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="w-full text-left p-3 text-sm bg-white hover:bg-purple-50 text-gray-700 hover:text-purple-600 rounded-lg border border-gray-200 hover:border-purple-200 transition-all duration-200 flex items-start"
                  >
                    <span className="flex-1 text-left">{question}</span>
                  </button>
                ))}
              </div>

              {/* Financial Data Summary */}
              {financialData && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-3">📈 Your Financial Snapshot</h4>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-green-600">
                        R{financialData.totalIncome?.toLocaleString() || '0'}
                      </div>
                      <div className="text-xs text-gray-600">Monthly Income</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-red-600">
                        R{financialData.totalExpenses?.toLocaleString() || '0'}
                      </div>
                      <div className="text-xs text-gray-600">Monthly Expenses</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-blue-600">
                        {financialData.savingsRatio?.toFixed(1) || '0'}%
                      </div>
                      <div className="text-xs text-gray-600">Savings Rate</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-purple-600">
                        R{financialData.savings?.toLocaleString() || '0'}
                      </div>
                      <div className="text-xs text-gray-600">Monthly Savings</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tips Section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">📝 Tips for Better Answers</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Be specific about amounts and timelines</li>
                  <li>• Mention your financial goals</li>
                  <li>• Include your risk tolerance</li>
                  <li>• Ask about different investment options</li>
                </ul>
              </div>

              {/* Statistics */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-800 mb-3">📊 Chat Stats</h4>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-purple-600">
                      {messages.filter(m => m.sender === 'user').length}
                    </div>
                    <div className="text-xs text-gray-600">Questions</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-purple-600">
                      {messages.filter(m => m.sender === 'bot').length}
                    </div>
                    <div className="text-xs text-gray-600">Responses</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chatbot;