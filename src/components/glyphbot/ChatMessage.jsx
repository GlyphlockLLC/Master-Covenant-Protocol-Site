import React from 'react';

export default function ChatMessage({ msg, isAssistant }) {
  if (!msg || !msg.content) return null;

  return (
    <div
      className={`max-w-[80%] p-5 rounded-2xl mb-4 font-semibold shadow-lg ${
        isAssistant ? 'mr-auto text-left' : 'ml-auto text-right'
      }`}
      style={{
        background: 'linear-gradient(270deg, #4a00e0, #8e2de2, #4a00e0)',
        backgroundSize: '600% 600%',
        animation: 'shimmer 6s ease infinite',
        color: '#39ff14',
        position: 'relative',
        zIndex: 500,
        fontSize: '16px',
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}
    >
      {msg.content}
    </div>
  );
}