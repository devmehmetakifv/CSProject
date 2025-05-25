// src/components/Chatbot.tsx
import { useState } from 'react';

function Chatbot() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = input;
    setMessages((prev) => [...prev, "Sen: " + userMessage]);
    setInput("");

    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + import.meta.env.VITE_GEMINI_API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
      })
    });

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Cevap alınamadı.";
    setMessages((prev) => [...prev, "Bot: " + reply]);
  };

  return (
    <div className="chat">
      <div className="chat-box">
        {messages.map((msg, i) => <div key={i}>{msg}</div>)}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Gönder</button>
    </div>
  );
}

export default Chatbot;
