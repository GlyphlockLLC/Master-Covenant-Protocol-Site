import React from 'react';

export default function ChatMessage({ msg, isAssistant }) {
  if (!msg || !msg.content) return null;

  return (
    <div
      className={`max-w-[80%] p-5 rounded-2xl mb-4 ${
        isAssistant ? 'mr-auto text-left' : 'ml-auto text-right'
      }`}
      style={{
        background: 'linear-gradient(270deg, #4a00e0, #8e2de2, #4a00e0)',
        backgroundSize: '600% 600%',
        animation: 'shimmer 6s ease infinite',
        position: 'relative',
        zIndex: 99999,
        fontSize: '18px',
        lineHeight: '1.8',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        fontWeight: '800',
        isolation: 'isolate'
      }}
    >
      <div style={{
        color: '#ffffff',
        textShadow: '0 0 15px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.8), 0 2px 4px rgba(0,0,0,0.8)',
        position: 'relative',
        zIndex: 100000,
        fontWeight: '800',
        WebkitTextFillColor: '#ffffff',
        paintOrder: 'stroke fill'
      }}>
        {msg.content}
      </div>
    </div>
  );
}