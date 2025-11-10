import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from '../../hooks/useUserAuth';

const Chatbot = () => {
  useUserAuth();

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello 👋, I'm your Financial Advisor. How can I assist you today?", ts: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("advice"); // later you can toggle modes
  const messagesRef = useRef(null);
  const textareaRef = useRef(null);

  // Quick question suggestions
  const quickQuestions = [
    "How can I start investing with R1000?",
    "What's the best way to save for retirement?",
    "How to create a monthly budget?",
    "What are good debt management strategies?",
    "Should I pay off debt or invest first?",
    "How much should I save for emergency fund?"
  ];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (!messagesRef.current) return;
    // smooth scroll to bottom
    messagesRef.current.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Send message
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input.trim(), ts: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Call your backend (we'll wire this server later)
      const endpoint = mode === "advice" ? "/api/financial-advice" : "/api/chat";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });
      const data = await res.json();

      // If your advice route returns structured JSON, prefer summary or a reply field
      const replyText = (data?.advice?.summary) || data?.reply || data?.message || "Sorry, I couldn't process that.";
      const botMessage = { sender: "bot", text: replyText, ts: Date.now() };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [...prev, { sender: "bot", text: "Server error. Try again later.", ts: Date.now() }]);
    } finally {
      setLoading(false);
      // Focus input after response
      textareaRef.current?.focus();
    }
  };

  // Press Enter to send (Shift+Enter for newline)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick question click
  const useQuickQuestion = (q) => {
    setInput(q);
    // focus textarea so user can modify or send quickly
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  return (
    <DashboardLayout activeMenu="Chatbot">
      <div className="h-[calc(100vh-140px)] flex flex-col gap-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">AI Financial Advisor</h1>
          <p className="text-gray-600 mt-1">Get personalized financial advice powered by AI.</p>
        </div>

        {/* Main Grid */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-0">
          {/* Chat area - 3/4 */}
          <div className="xl:col-span-3 flex flex-col min-h-0">
            <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-0">
              {/* Messages container */}
              <div
                ref={messagesRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 min-h-0"
                aria-live="polite"
              >
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[84%] px-4 py-3 rounded-2xl break-words ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-br-none shadow-lg"
                          : "bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm"
                      }`}
                      role="article"
                      aria-label={msg.sender === "user" ? "Your message" : "AI response"}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      <div className="text-xs text-slate-400 mt-1 text-right">
                        {new Date(msg.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 border border-gray-200/50 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                          AI
                        </div>
                        <div className="flex items-center space-x-1" aria-hidden>
                          <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                          <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                          <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                        </div>
                        <div className="text-sm text-gray-500 italic">Analyzing your data...</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input area */}
              <div className="px-6 py-4 border-t border-slate-100 bg-white">
                <div className="flex items-start gap-3">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={mode === "advice" ? "Ask for insights about your spending (e.g., 'Where am I overspending?')" : "Ask general finance questions..."}
                    rows={1}
                    maxLength={1000}
                    className="flex-1 resize-none min-h-[44px] max-h-36 px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                    disabled={loading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="h-[44px] px-4 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                    Send
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-gray-500">Press Enter to send • Financial advice for educational purposes</div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setMode(mode === "advice" ? "chat" : "advice")}
                      className="text-xs px-3 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      {mode === "advice" ? "Advisory Mode" : "Chat Mode"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Quick Questions & Stats (1/4) */}
          <div className="xl:col-span-1 flex flex-col min-h-0">
            <div className="flex-1 flex flex-col bg-white rounded-2xl p-6 border border-slate-200 shadow-sm min-h-0">
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">💡 Quick Questions</h3>
              <p className="text-sm text-gray-600 mb-4">Get started with these common financial questions</p>

              <div className="flex-1 overflow-y-auto space-y-3 min-h-0 mb-4">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    
                    onClick={() => useQuickQuestion(q)}
                    className="w-full text-left p-3 rounded-lg border border-slate-100 hover:bg-purple-50 transition text-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="mt-2 pt-4 border-t border-slate-100">
                <h4 className="font-medium text-gray-800 mb-2">📝 Tips for Better Answers</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Be specific about amounts and timelines</li>
                  <li>• Mention your financial goals</li>
                  <li>• Include your risk tolerance</li>
                  <li>• Ask about different investment options</li>
                </ul>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="font-medium text-gray-800 mb-3">📊 Chat Stats</h4>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-purple-600">{messages.filter(m => m.sender === 'user').length}</div>
                    <div className="text-xs text-gray-600">Questions</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-purple-600">{messages.filter(m => m.sender === 'bot').length}</div>
                    <div className="text-xs text-gray-600">Responses</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> {/* end grid */}
      </div>
    </DashboardLayout>
  );
};

export default Chatbot;
