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

  // Quick question suggestions
  const quickQuestions = [
    "How can I start investing with R1000?",
    "What's the best way to save for retirement?",
    "How to create a monthly budget?",
    "What are good debt management strategies?",
    "Should I pay off debt or invest first?",
    "How much should I save for emergency fund?"
  ];

  return (
    <DashboardLayout activeMenu="Chatbot">
      <div className="h-[calc(100vh-140px)] flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            AI Financial Advisor
          </h1>
          <p className="text-gray-600 mt-1">
            Get personalized financial advice powered by AI
          </p>
        </div>

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
                            ? "bg-primary text-white rounded-br-none shadow-lg shadow-purple-600/20"
                            : "bg-white text-gray-800 rounded-bl-none border border-gray-200/50 shadow-sm"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {msg.sender === "bot" && (
                            <div className="w-6 h-6 bg-linear-to-r from-primary to-purple-400 rounded-full flex items-center justify-center text-xs text-white font-bold mt-1 flex-shrink-0">
                              AI
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                          </div>
                          {msg.sender === "user" && (
                            <div className="w-6 h-6 bg-linear-to-r from-gray-600 to-gray-400 rounded-full flex items-center justify-center text-xs text-white font-bold mt-1 flex-shrink-0">
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
                          <div className="w-6 h-6 bg-linear-to-r from-primary to-purple-400 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
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
                    placeholder="Ask about investments, savings, budgeting..."
                    className="input-box py-3"
                    disabled={loading}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="add-btn-fill px-4 py-3 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2 whitespace-nowrap h-[52px]"
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
              
              <div className="space-y-3 flex-1 overflow-y-auto min-h-0">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="card-btn text-left w-full justify-start p-3 text-sm hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-all duration-200"
                  >
                    <span className="flex-1 text-left">{question}</span>
                  </button>
                ))}
              </div>

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
                    <div className="text-lg font-bold text-primary">{messages.filter(m => m.sender === 'user').length}</div>
                    <div className="text-xs text-gray-600">Questions</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-primary">{messages.filter(m => m.sender === 'bot').length}</div>
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