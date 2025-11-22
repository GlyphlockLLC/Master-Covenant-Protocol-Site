import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { MessageCircle, X, Send, Mic, Square, Volume2, Upload, Trash2, Menu } from "lucide-react";
import ReactMarkdown from "react-markdown";


let globalAudioLock = false;

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "🦕 Roar! I'm DinoBot, your prehistoric-powered AI assistant. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() && !selectedFiles.length || loading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    let urls = [];
    if (selectedFiles.length > 0) {
      for (const file of selectedFiles) {
        try {
          const { file_url } = await base44.integrations.Core.UploadFile({ file });
          urls.push(file_url);
        } catch (e) {
          console.error("File upload error:", e);
        }
      }
      setSelectedFiles([]);
    }

    try {
      const prompt = urls.length > 0
        ? `${userMessage}\n\n[Analyzing ${urls.length} attached file(s)]`
        : userMessage;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are DinoBot, a friendly AI assistant with a subtle prehistoric personality. Be helpful, professional, and occasionally use dinosaur references when appropriate (keep it subtle). User question: ${prompt}`,
        add_context_from_internet: false,
        file_urls: urls.length > 0 ? urls : undefined
      });

      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "🦕 Roar... I encountered a connection issue. Please try again!"
      }]);
    }

    setLoading(false);
  };

  const startRecording = () => {
    try {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        alert("Speech recognition not supported on this browser");
        return;
      }

      const rec = new SR();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => setIsRecording(true);
      rec.onresult = (e) => {
        setInput(e.results[0][0].transcript);
        setIsRecording(false);
      };
      rec.onerror = () => setIsRecording(false);
      rec.onend = () => setIsRecording(false);

      rec.start();
      mediaRecorderRef.current = rec;
    } catch (e) {
      console.error("Voice error:", e);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFiles = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const speakMessage = async (text, index) => {
    if (isSpeaking && speakingIndex === index) {
      stopSpeaking();
      return;
    }

    if (globalAudioLock) return;

    globalAudioLock = true;
    setIsSpeaking(true);
    setSpeakingIndex(index);

    try {
      const cleanText = text
        .replace(/[#*`🦕]/g, '')
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const apiUrl = `https://api.streamelements.com/kappa/v2/speech?voice=Joanna&text=${encodeURIComponent(cleanText)}`;
      const response = await fetch(apiUrl);

      if (!response.ok) throw new Error(`TTS failed: ${response.status}`);

      const audioBuffer = await response.arrayBuffer();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const decodedData = await audioContext.decodeAudioData(audioBuffer);

      const source = audioContext.createBufferSource();
      source.buffer = decodedData;
      source.connect(audioContext.destination);

      source.onended = () => {
        stopSpeaking();
      };

      audioRef.current = { stop: () => source.stop(), context: audioContext };
      source.start(0);
    } catch (error) {
      console.error('TTS Error:', error);
      stopSpeaking();
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      try {
        audioRef.current.stop();
        audioRef.current.context.close();
      } catch (e) {
        console.error('Stop error:', e);
      }
      audioRef.current = null;
    }
    setIsSpeaking(false);
    setSpeakingIndex(null);
    globalAudioLock = false;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="dino-fab"
        aria-label="Open chat"
      >
        <div className="dino-fab-inner">
          {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
        </div>
        <div className="dino-footprint"></div>
      </button>

      {isOpen && (
        <div className="dino-chat-container">
          <div className="dino-chat-header">
            <div className="dino-avatar">
              🦕
            </div>
            <div className="dino-header-info">
              <span className="dino-header-title">DinoBot</span>
              <span className="dino-header-subtitle">Prehistoric AI Assistant</span>
            </div>
            <button
              className="dino-menu-btn"
              onClick={() => setMessages([messages[0]])}
              title="Clear Chat"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="dino-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`dino-message ${msg.role === 'user' ? 'dino-message-user' : 'dino-message-bot'}`}
              >
                <div className="dino-message-content">
                  {msg.role === 'user' ? (
                    <p className="dino-message-text">{msg.content}</p>
                  ) : (
                    <>
                      <ReactMarkdown
                        className="dino-markdown"
                        components={{
                          code: ({ inline, children }) => {
                            return inline ? (
                              <code className="dino-code-inline">{children}</code>
                            ) : (
                              <pre className="dino-code-block">
                                <code>{children}</code>
                              </pre>
                            );
                          },
                          p: ({ children }) => <p className="dino-p">{children}</p>,
                          ul: ({ children }) => <ul className="dino-ul">{children}</ul>,
                          li: ({ children }) => <li className="dino-li">{children}</li>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                      <button
                        className={`dino-speak-btn ${isSpeaking && speakingIndex === idx ? 'active' : ''}`}
                        onClick={() => speakMessage(msg.content, idx)}
                        title={isSpeaking && speakingIndex === idx ? "Stop" : "Play"}
                      >
                        {isSpeaking && speakingIndex === idx ? (
                          <Square className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="dino-message dino-message-bot">
                <div className="dino-message-content">
                  <div className="dino-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {selectedFiles.length > 0 && (
            <div className="dino-files">
              <div className="dino-files-header">
                <span>{selectedFiles.length} file(s) attached</span>
                <button
                  className="dino-clear-files"
                  onClick={() => setSelectedFiles([])}
                >
                  Clear
                </button>
              </div>
              <div className="dino-files-list">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="dino-file-item">
                    <span className="dino-file-name">{file.name}</span>
                    <button
                      onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                      className="dino-file-remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form className="dino-input-container" onSubmit={handleSend}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFiles}
              multiple
              className="hidden"
            />
            <button
              type="button"
              className="dino-action-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Upload files"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              type="button"
              className={`dino-action-btn ${isRecording ? 'recording' : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask DinoBot anything..."
              disabled={loading}
              className="dino-input"
            />
            <button
              type="submit"
              disabled={loading || (!input.trim() && !selectedFiles.length)}
              className="dino-send-btn"
              title="Send message"
            >
              <Send className="w-5 h-5" />
              <div className="dino-send-glow"></div>
            </button>
          </form>
        </div>
      )}
    </>
  );
}