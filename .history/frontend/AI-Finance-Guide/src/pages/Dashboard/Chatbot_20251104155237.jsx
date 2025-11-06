import React, { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";

const Chatbot = () => {
  useUserAuth();

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello 👋, I'm your Financial Advisor. How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("chat"); // 'chat' or 'advice'

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const endpoint =
        mode === "advice"
          ? "http://localhost:5000/api/financial-advice"
          : "http://localhost:5000/api/chat";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const botMessage = {
        sender: "bot",
        text:
          data.reply ||
          data.advice?.summary ||
          "Sorry, I couldn’t process that.",
      };

      setMessages((prev) => [...prev, botMessage]);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Server error. Try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Chatbot">
      <div className="flex flex-col h-[calc(100vh-140px)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">AI Financial Advisor</h1>
            <p className="text-gray-600 mt-1">
              {mode === "chat"
                ? "Ask general financial questions."
                : "Get personalized advice based on your spending data."}
            </p>
          </div>
          <button
            onClick={() => setMode(mode === "chat" ? "advice" : "chat")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            {mode === "chat" ? "Switch to Advisory Mode" : "Switch to Chat Mode"}
          </button>
        </div>

        {/* Chat messages */}
        <div className="flex-1 bg-slate-50 rounded-xl p-4 mb-4 border border-slate-200 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } mb-3`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.sender === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "chat"
                ? "Ask about budgeting, investments..."
                : "Ask for your spending insights..."
            }
            className="input-box flex-1 py-3"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            className="add-btn-fill px-5 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
            disabled={!input.trim() || loading}
          >
            Send
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chatbot;
