import React, { useRef, useEffect } from 'react';
import { Send, Square, RotateCcw, Mic, Paperclip } from 'lucide-react';

export default function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  onStop, 
  onRegenerate,
  isSending,
  disabled 
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isSending) {
        onSend();
      }
    }
  };

  return (
    <div className="border-t border-slate-800/80 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3 bg-slate-900/80 border border-slate-700/60 rounded-2xl p-2 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all">
          {/* Left actions */}
          <div className="flex items-center gap-1 pb-1">
            <button
              type="button"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors"
              title="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask GlyphBot about security, code, blockchain..."
            disabled={disabled}
            className="flex-1 resize-none bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none text-sm leading-relaxed max-h-[150px] py-2"
            style={{ fontSize: '16px' }}
          />

          {/* Right actions */}
          <div className="flex items-center gap-1 pb-1">
            {!isSending && (
              <button
                type="button"
                onClick={onRegenerate}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors"
                title="Regenerate last response"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {isSending ? (
              <button
                type="button"
                onClick={onStop}
                className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-400 hover:bg-rose-500/30 transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                title="Stop generation"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSend}
                disabled={!value.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:shadow-none"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Hints */}
        <div className="flex items-center justify-between mt-2 px-2 text-[10px] text-slate-600">
          <span>Enter to send · Shift+Enter for new line</span>
          {isSending && (
            <span className="text-cyan-500 animate-pulse">Processing chain response...</span>
          )}
        </div>
      </div>
    </div>
  );
}