import React, { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";

const Chatbot = () => {
  useUserAuth();

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello 👋, I'm your Financial Advisor. How can I assist you today?",
    },
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
      const botMessage = {
        sender: "bot",
        text: data.reply || "Sorry, I couldn’t process that.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error. Try again later." },
      ]);
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

  const quickQuestions = [
    "How can I start investing with R1000?",
    "What's the best way to save for retirement?",
    "How to create a monthly budget?",
    "What are good debt management strategies?",
    "Should I pay off debt or invest first?",
    "How much should I save for an emergency fund?",
  ];

  return (
    <DashboardLayout activeMenu="Chatbot">
      <div className="h-[calc(100vh-140px)] flex flex-col px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            💬 AI Financial Advisor
          </h1>
          <p className="text-gray-600 mt-1">
            Get personalized financial insights powered by AI
          </p>
        </div>

        {/* Main Grid */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-0">
          {/* Chat Section */}
          <div className="xl:col-span-3 flex flex-col min-h-0 bg-white rounded-2xl border border-gray-200 shadow-md p-5">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50 rounded-xl p-4 border border-slate-200 min-h-0">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none shadow-md"
                          : "bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {msg.sender === "bot" && (
                          <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-500 rounded-full flex items-center justify-center text-xs text-white font-bold mt-1 flex-shrink-0">
                            AI
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        {msg.sender === "user" && (
                          <div className="w-7 h-7 bg-gray-600 rounded-full flex items-center justify-center text-xs text-white font-bold mt-1 flex-shrink-0">
                            You
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 rounded-2xl px-4 py-3 border border-gray-200 shadow-sm flex items-center space-x-2">
                      <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                        AI
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Bar */}
            <div className="mt-4 flex gap-3 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about investments, savings, budgeting..."
                className="flex-1 border border-gray-300 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2 transition-all"
              >
                <span>Send</span>
                <svg
                  className="w-5 h-5"
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
              Press <strong>Enter</strong> to send • For educational use only
            </p>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-md p-5">
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">
              💡 Quick Questions
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Get started with these common topics:
            </p>

            <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="w-full text-left border border-gray-100 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2 text-sm">
                📝 Tips for Better Answers
              </h4>
              <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                <li>Be specific about amounts and timelines</li>
                <li>Mention your financial goals</li>
                <li>Include your risk tolerance</li>
                <li>Ask about multiple investment options</li>
              </ul>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2 text-sm">
                📊 Chat Stats
              </h4>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-blue-600">
                    {messages.filter((m) => m.sender === "user").length}
                  </div>
                  <div className="text-xs text-gray-600">Questions</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-purple-600">
                    {messages.filter((m) => m.sender === "bot").length}
                  </div>
                  <div className="text-xs text-gray-600">Responses</div>
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
