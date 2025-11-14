import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MessageCircle, X, Send, Bot, Home, Shield, Zap, Mail, FileText, Menu, Sparkles } from "lucide-react";

export default function GlyphBotJr({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm GlyphBot Jr. 🤖 I can help you navigate the GlyphLock ecosystem. Ask me about our services or use the Quick Access menu!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickLinks = [
    { 
      icon: Home, 
      label: "Home", 
      page: "Home",
      description: "Main landing page & platform overview"
    },
    { 
      icon: Shield, 
      label: "Security Tools", 
      page: "SecurityTools",
      description: "QR, Steganography, Blockchain & Mapper"
    },
    { 
      icon: Zap, 
      label: "Master Covenant", 
      page: "MasterCovenant",
      description: "Legal AI binding with $14M coverage"
    },
    { 
      icon: Sparkles, 
      label: "GlyphBot AI", 
      page: "GlyphBot",
      description: "Full AI assistant with code execution"
    },
    { 
      icon: FileText, 
      label: "Pricing", 
      page: "Pricing",
      description: "Plans & service packages"
    },
    { 
      icon: Mail, 
      label: "Contact", 
      page: "Contact",
      description: "Get in touch with our team"
    },
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const sitemapContext = `
You are GlyphBot Jr., a friendly navigation assistant for the GlyphLock Security platform.

GlyphLock Pages & Services:
- Home: Main landing page with overview
- Master Covenant: Legal AI binding system with 5 AI systems bound
- Security Tools: Collection of cybersecurity utilities (QR Generator, Steganography, Blockchain, Hotzone Mapper)
- QR Generator: Create secure QR codes with threat detection
- Steganography: Hide encrypted data in images
- Blockchain: Cryptographic hashing and verification tools
- Hotzone Mapper: Interactive security vulnerability mapping
- HSSS: Advanced surveillance system
- GlyphBot: Full AI assistant (you're the junior version!)
- N.U.P.S. POS: Enterprise point-of-sale system
- Pricing: Service pricing and plans
- Contact: Get in touch with the team
- Consultation: Book a paid security consultation
- About: Company story, team, and values
- Roadmap: Product development timeline
- Privacy Policy: Data privacy information
- Terms of Service: Legal terms
- Security Documentation: Security practices
- Dashboard: User account management (requires login)

Your job:
1. Help users find pages/services
2. Provide quick info about features
3. Give friendly, concise answers (2-3 sentences max)
4. Suggest relevant pages when appropriate
5. Be helpful and professional

User question: ${userMessage}

Respond naturally and helpfully. If suggesting a page, mention it by name.
`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: sitemapContext,
        response_json_schema: null
      });

      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("GlyphBot Jr. error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Oops! I had trouble processing that. Try asking about our services or use the Quick Access menu!" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLink = (pageName) => {
    setMessages(prev => [...prev, { 
      role: "assistant", 
      content: `Taking you to ${pageName}! 🚀` 
    }]);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 z-50 rounded-full w-16 h-16 shadow-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white animate-pulse hover:animate-none"
        style={{
          boxShadow: '0 0 30px rgba(65, 105, 225, 0.8), 0 0 60px rgba(65, 105, 225, 0.6)'
        }}
      >
        <Bot className="w-8 h-8" />
      </Button>
    );
  }

  return (
    <Card 
      className="fixed bottom-6 right-6 z-50 shadow-2xl border-2"
      style={{
        width: '400px',
        height: '550px',
        background: 'rgba(65, 105, 225, 0.15)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'rgba(65, 105, 225, 0.4)',
        boxShadow: '0 0 40px rgba(65, 105, 225, 0.3), inset 0 0 20px rgba(65, 105, 225, 0.1)'
      }}
    >
      <CardHeader 
        className="flex flex-row items-center justify-between pb-3"
        style={{
          background: 'rgba(65, 105, 225, 0.25)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(65, 105, 225, 0.3)'
        }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(65, 105, 225, 0.9), rgba(30, 64, 175, 0.9))',
              boxShadow: '0 0 20px rgba(65, 105, 225, 0.6)'
            }}
          >
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-white">
              GlyphBot Jr.
            </CardTitle>
            <p className="text-xs text-white/90 font-medium">Navigation Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="text-white font-bold"
                style={{
                  background: 'linear-gradient(135deg, rgba(65, 105, 225, 0.7), rgba(30, 64, 175, 0.7))',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 0 20px rgba(65, 105, 225, 0.5)'
                }}
              >
                <Menu className="w-4 h-4 mr-2" />
                Quick Access
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              className="w-72"
              style={{
                background: 'rgba(65, 105, 225, 0.25)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(65, 105, 225, 0.5)',
                boxShadow: '0 8px 32px rgba(65, 105, 225, 0.4)'
              }}
            >
              <div className="px-2 py-2">
                <p className="text-xs font-bold text-white/90 mb-2">Navigate to:</p>
              </div>
              <DropdownMenuSeparator style={{ background: 'rgba(65, 105, 225, 0.3)' }} />
              {quickLinks.map((link, idx) => (
                <DropdownMenuItem 
                  key={idx}
                  asChild
                  className="cursor-pointer"
                  style={{
                    padding: '0'
                  }}
                >
                  <Link 
                    to={createPageUrl(link.page)}
                    onClick={() => handleQuickLink(link.label)}
                    className="flex items-start gap-3 px-3 py-2.5 w-full hover:bg-white/10 transition-colors"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: 'linear-gradient(135deg, rgba(65, 105, 225, 0.6), rgba(30, 64, 175, 0.6))',
                        boxShadow: '0 0 10px rgba(65, 105, 225, 0.4)'
                      }}
                    >
                      <link.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white text-sm mb-0.5">{link.label}</div>
                      <div className="text-xs text-white/80 font-medium leading-tight">{link.description}</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-red-400 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex flex-col h-[calc(100%-80px)]">
        {/* Messages */}
        <div 
          className="overflow-y-auto space-y-3 mb-3 flex-1"
          style={{
            minHeight: '300px'
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 ${
                  msg.role === 'user'
                    ? 'text-white font-semibold'
                    : 'text-white font-medium'
                }`}
                style={
                  msg.role === 'user'
                    ? {
                        background: 'linear-gradient(135deg, rgba(65, 105, 225, 0.7), rgba(30, 64, 175, 0.7))',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 4px 12px rgba(65, 105, 225, 0.4)'
                      }
                    : {
                        background: 'rgba(65, 105, 225, 0.2)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(65, 105, 225, 0.4)',
                        boxShadow: '0 2px 8px rgba(65, 105, 225, 0.2)'
                      }
                }
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div 
                className="rounded-lg px-3 py-2"
                style={{
                  background: 'rgba(65, 105, 225, 0.2)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(65, 105, 225, 0.4)'
                }}
              >
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            disabled={loading}
            className="flex-1 font-semibold"
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(65, 105, 225, 0.5)',
              color: '#ffffff',
              boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.5), 0 0 10px rgba(65, 105, 225, 0.3)'
            }}
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, rgba(65, 105, 225, 0.8), rgba(30, 64, 175, 0.8))',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 10px rgba(65, 105, 225, 0.5)'
            }}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>

      <style>{`
        input::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
          font-weight: 600;
        }
      `}</style>
    </Card>
  );
}