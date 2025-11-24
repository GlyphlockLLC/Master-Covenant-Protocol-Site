import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles, Send, Loader2, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { generateAudio, applyAudioEffects } from "@/components/utils/ttsEngine";
import { PERSONAS } from "@/components/glyphbot/personas";

export default function GlyphBotJr() {
  const jrPersona = PERSONAS.find(p => p.id === "glyphbot_jr") || PERSONAS[4];
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi there! I'm GlyphBot Junior! 🌟 How can I help you today?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const playVoice = async (text) => {
    try {
      const audioUrl = await generateAudio(
        jrPersona.voice.provider,
        jrPersona.voice.model,
        text,
        {
          speed: jrPersona.voice.speed,
          pitch: jrPersona.voice.pitch,
          volume: 1.0
        }
      );

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.playbackRate = jrPersona.voice.speed;
        
        applyAudioEffects(audio, {
          volume: 1.0,
          enhance: jrPersona.voice.effects.enhance,
          gate: jrPersona.voice.effects.gate
        });

        audio.play().catch(() => {});
      }
    } catch (err) {
      console.error("Voice error:", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage, timestamp: Date.now() }]);
    setLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.text
      })).concat([{ role: "user", content: userMessage }]);

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${jrPersona.system}

Conversation history:
${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}

Remember to be friendly, helpful, and explain things simply!`,
        add_context_from_internet: false
      });

      const assistantMessage = { 
        role: "assistant", 
        text: response, 
        timestamp: Date.now() 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Auto-play voice response
      setTimeout(() => playVoice(response), 300);
      
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "Oops! Something went wrong. Can you try asking again? 😊",
        timestamp: Date.now()
      }]);
    }

    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110"
        aria-label="Open GlyphBot Junior"
      >
        <Sparkles className="w-8 h-8" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-[400px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)] bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex flex-col relative overflow-hidden rounded-2xl shadow-2xl border border-white/20">
      {/* Playful background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30 pointer-events-none"></div>
      
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg relative z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-pink-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">GlyphBot Jr</h1>
                <p className="text-xs text-white/80">24/7 Helper 🌈</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4 relative z-10">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-lg ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                  : "bg-white/95 backdrop-blur text-gray-800"
              }`}
            >
              <ReactMarkdown
                className={`prose ${msg.role === "assistant" ? "prose-gray" : "prose-invert"} prose-sm max-w-none`}
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                  code: ({ inline, children }) =>
                    inline ? (
                      <code className="bg-gray-200 px-1.5 py-0.5 rounded text-sm">{children}</code>
                    ) : (
                      <code className="block bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">{children}</code>
                    )
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/95 backdrop-blur rounded-2xl px-5 py-3 shadow-lg flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              <span className="text-gray-600 text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="bg-white/10 backdrop-blur-xl border-t border-white/20 px-4 py-4 relative z-10">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything! 🌟"
            disabled={loading}
            className="flex-1 bg-white/90 border-2 border-white/30 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent min-h-[52px]"
            style={{ fontSize: "16px" }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-white rounded-xl px-6 py-3 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[52px] min-w-[80px] flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-white/60 text-xs mt-2">Press Enter to send</p>
      </footer>
    </div>
  );
}