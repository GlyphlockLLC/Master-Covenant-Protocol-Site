import React from 'react';

export default function ChatMessage({ msg, isAssistant }) {
  if (!msg || !msg.content) return null;

  return (
    <div
      className={`max-w-[80%] p-5 rounded-2xl mb-4 font-bold shadow-2xl ${
        isAssistant ? 'mr-auto text-left' : 'ml-auto text-right'
      }`}
      style={{
        background: 'linear-gradient(270deg, #4a00e0, #8e2de2, #4a00e0)',
        backgroundSize: '600% 600%',
        animation: 'shimmer 6s ease infinite',
        color: '#39ff14 !important',
        position: 'relative',
        zIndex: 9999,
        fontSize: '17px',
        lineHeight: '1.7',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        textShadow: '0 0 10px rgba(57, 255, 20, 0.8), 0 0 20px rgba(57, 255, 20, 0.5)',
        fontWeight: '700'
      }}
    >
      <span style={{ color: '#39ff14 !important', position: 'relative', zIndex: 10000 }}>
        {msg.content}
      </span>
    </div>
  );
}