import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Volume2, Check, Bot, User } from 'lucide-react';
import GlyphAuditCard from '@/components/glyphaudit/GlyphAuditCard';
import FeedbackWidget from './FeedbackWidget';

export default function ChatMessage({ 
  msg, 
  isAssistant, 
  providerLabel, 
  ttsAvailable = true, 
  isSpeaking = false,
  onPlayTTS,
  showFeedback = true,
  persona,
  onReplayWithSettings
}) {
  const [copied, setCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const hasAudit = msg.audit && (msg.audit.json || msg.audit.report);

  const handleTTS = () => {
    if (onPlayTTS) {
      onPlayTTS(msg.id);
    }
  };

  const handleReplayWithSettings = () => {
    if (onReplayWithSettings && msg.ttsMetadata) {
      onReplayWithSettings(msg.id, msg.ttsMetadata);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
      style={{ 
        position: 'relative', 
        zIndex: 100,
        color: '#ffffff'
      }}
    >
      {isAssistant && (
        <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.3)]">
          <Bot className="w-4 h-4 text-cyan-400" />
        </div>
      )}

      <div className={`space-y-2 ${hasAudit ? 'max-w-[90%] w-full' : 'max-w-[80%]'}`} style={{ position: 'relative', zIndex: 101 }}>
        <div 
          className={`rounded-2xl px-4 py-3 shadow-lg border backdrop-blur-sm`}
          style={{
            position: 'relative',
            zIndex: 102,
            backgroundColor: isAssistant ? 'rgba(15, 23, 42, 0.95)' : 'rgba(6, 182, 212, 0.15)',
            borderColor: isAssistant ? 'rgba(51, 65, 85, 0.6)' : 'rgba(6, 182, 212, 0.5)',
            color: '#ffffff'
          }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between mb-2 pb-2 border-b border-slate-700/30"
            style={{ color: '#ffffff', position: 'relative', zIndex: 103 }}
          >
            <div className="flex items-center gap-2">
              <span 
                className="text-[10px] uppercase tracking-[0.15em] font-semibold"
                style={{ color: isAssistant ? '#06b6d4' : '#94a3b8' }}
              >
                {isAssistant ? 'GlyphBot' : 'You'}
              </span>
              {providerLabel && (
                <span 
                  className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50"
                  style={{ color: '#64748b' }}
                >
                  {providerLabel}
                </span>
              )}
              {msg.latencyMs && (
                <span className="text-[9px]" style={{ color: '#475569' }}>
                  {msg.latencyMs}ms
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1.5" style={{ position: 'relative', zIndex: 104 }}>
              {isAssistant && (
                <button
                  onClick={handleCopy}
                  className="p-1 rounded-md hover:bg-slate-700/50 transition-colors"
                  style={{ color: '#64748b' }}
                  title="Copy message"
                >
                  {copied ? <Check className="w-3.5 h-3.5" style={{ color: '#4ade80' }} /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
              {isAssistant && (
                <>
                  <button
                    onClick={handleTTS}
                    className={`p-1 rounded-md hover:bg-slate-700/50 transition-colors ${isSpeaking ? 'animate-pulse' : ''}`}
                    style={{ color: isSpeaking ? '#06b6d4' : '#64748b' }}
                    title={isSpeaking ? "Speaking..." : "Play voice"}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  {msg.ttsMetadata && onReplayWithSettings && (
                    <button
                      onClick={handleReplayWithSettings}
                      className="p-1 rounded-md hover:bg-slate-700/50 transition-colors"
                      style={{ color: '#64748b' }}
                      title={`Replay with ${msg.ttsMetadata.emotion || 'custom'} voice`}
                    >
                      <Volume2 className="w-3.5 h-3.5" strokeWidth={3} />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Content - FORCED WHITE TEXT */}
          <div style={{ position: 'relative', zIndex: 105, color: '#ffffff' }}>
            {isAssistant ? (
              <div style={{ color: '#ffffff' }}>
                <ReactMarkdown
                  components={{
                    code: ({ inline, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      if (!inline && match) {
                        return (
                          <div className="relative group my-3" style={{ position: 'relative', zIndex: 106 }}>
                            <div className="absolute top-2 right-2 flex items-center gap-2">
                              <span className="text-[9px] uppercase" style={{ color: '#475569' }}>{match[1]}</span>
                              <button
                                onClick={() => navigator.clipboard.writeText(String(children))}
                                className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: '#64748b' }}
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                            <pre style={{ 
                              backgroundColor: 'rgba(2, 6, 23, 0.9)', 
                              border: '1px solid rgba(51, 65, 85, 0.5)',
                              borderRadius: '8px',
                              padding: '12px',
                              overflowX: 'auto',
                              color: '#ffffff'
                            }}>
                              <code className={className} {...props} style={{ color: '#ffffff' }}>{children}</code>
                            </pre>
                          </div>
                        );
                      }
                      return (
                        <code 
                          className={className} 
                          {...props}
                          style={{ 
                            backgroundColor: 'rgba(30, 41, 59, 0.8)',
                            color: '#d946ef',
                            padding: '2px 4px',
                            borderRadius: '4px'
                          }}
                        >
                          {children}
                        </code>
                      );
                    },
                    p: ({ children }) => (
                      <p style={{ 
                        marginTop: '8px', 
                        marginBottom: '8px',
                        lineHeight: '1.6',
                        color: '#ffffff',
                        fontWeight: '400'
                      }}>
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul style={{ marginTop: '8px', marginBottom: '8px', color: '#ffffff' }}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol style={{ marginTop: '8px', marginBottom: '8px', color: '#ffffff' }}>
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li style={{ color: '#ffffff', marginBottom: '4px' }}>
                        {children}
                      </li>
                    ),
                    a: ({ children, href }) => (
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          color: '#06b6d4',
                          textDecoration: 'underline',
                          textUnderlineOffset: '2px'
                        }}
                      >
                        {children}
                      </a>
                    ),
                    strong: ({ children }) => (
                      <strong style={{ color: '#ffffff', fontWeight: '700' }}>
                        {children}
                      </strong>
                    ),
                    h1: ({ children }) => (
                      <h1 style={{ color: '#06b6d4', fontSize: '1.5em', fontWeight: '700', marginTop: '16px', marginBottom: '8px' }}>
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 style={{ color: '#06b6d4', fontSize: '1.3em', fontWeight: '700', marginTop: '12px', marginBottom: '6px' }}>
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 style={{ color: '#06b6d4', fontSize: '1.1em', fontWeight: '700', marginTop: '10px', marginBottom: '4px' }}>
                        {children}
                      </h3>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div style={{ 
                whiteSpace: 'pre-wrap', 
                lineHeight: '1.6',
                fontSize: '14px',
                color: '#ffffff',
                fontWeight: '400'
              }}>
                {msg.content}
              </div>
            )}
          </div>
        </div>
        
        {hasAudit && <GlyphAuditCard audit={msg.audit} />}
        
        {/* Feedback Widget for assistant messages */}
        {isAssistant && showFeedback && !feedbackGiven && (
          <div className="mt-2">
            <FeedbackWidget
              messageId={msg.id}
              providerId={msg.providerId}
              model={providerLabel}
              persona={persona}
              latencyMs={msg.latencyMs}
              promptSnippet={msg.promptSnippet}
              responseSnippet={msg.content}
              onFeedbackSubmitted={() => setFeedbackGiven(true)}
            />
          </div>
        )}
      </div>

      {!isAssistant && (
        <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-800 border border-slate-600/50 flex items-center justify-center">
          <User className="w-4 h-4 text-slate-400" />
        </div>
      )}
    </div>
  );
}