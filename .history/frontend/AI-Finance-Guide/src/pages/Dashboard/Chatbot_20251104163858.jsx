import React, { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from '../../hooks/useUserAuth';

const Chatbot = () => {
  useUserAuth();

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello 👋, I'm your Financial Advisor. How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const botMessage = { sender: "bot", text: data.reply || "Sorry, I couldn't process that." };
      setMessages((prev) => [...prev, botMessage]);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Server error. Try again later." }]);
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

  const useQuickQuestion = (question) => {
    setInput(question);
  };

  // Quick question suggestions
  const quickQuestions = [
    "What's the best way to save for retirement?",
    "How to create a monthly budget?",
    "What are good debt management strategies?",
  
  ];

  return (
    <DashboardLayout activeMenu="Chatbot">
      <div className="h-[calc(100vh-140px)] flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">AI Financial Advisor</h1>
          <p className="text-gray-600 mt-1">
            Get personalized financial advice powered by AI
          </p>
        </div>

        {/* Main Grid */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-0">
          {/* Chat Area */}
          <div className="xl:col-span-3 flex flex-col min-h-0">
            <div className="flex flex-col bg-white rounded-2xl p-4 shadow-sm h-full min-h-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.sender === "user"
                          ? "bg-purple-600 text-white rounded-br-none shadow-lg shadow-purple-400/20"
                          : "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200/50 shadow-sm"
                      }`}>
                        <div className="flex items-start space-x-2">
                          {msg.sender === "bot" && (
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs text-white font-bold mt-1 flex-shrink-0">
                              AI
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                          </div>
                          {msg.sender === "user" && (
                            <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-xs text-white font-bold mt-1 flex-shrink-0">
                              You
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 border border-gray-200/50 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
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

              {/* Input */}
              <div className="flex gap-3 mt-4 items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about investments, savings, budgeting..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <span>Send</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Press Enter to send • Financial advice for educational purposes
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 flex flex-col min-h-0">
            <div className="flex flex-col bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full min-h-0">
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">💡 Quick Questions</h3>
              <p className="text-sm text-gray-600 mb-4">Get started with these common financial questions</p>

              {/* Quick Questions */}
              <div className="space-y-3">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    onClick={() => useQuickQuestion(q)}
                    className="w-full text-left p-3 rounded-lg border border-gray-100 hover:bg-purple-50 transition text-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Tips & Stats at bottom */}
              <div className="mt-auto pt-4 border-t border-gray-100">
                <h4 className="font-medium text-gray-800 mb-2">📝 Tips for Better Answers</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Be specific about amounts and timelines</li>
                  <li>• Mention your financial goals</li>
                  <li>• Include your risk tolerance</li>
                  <li>• Ask about different investment options</li>
                </ul>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-800 mb-3">📊 Chat Stats</h4>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-purple-600">{messages.filter(m => m.sender === 'user').length}</div>
                      <div className="text-xs text-gray-600">Questions</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-purple-600">{messages.filter(m => m.sender === 'bot').length}</div>
                      <div className="text-xs text-gray-600">Responses</div>
                    </div>
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
