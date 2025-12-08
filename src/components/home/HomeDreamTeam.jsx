// GLYPHLOCK DREAM TEAM HARD-LOCK
// This file is the canonical implementation of the Dream Team legendary panel.
// Do not replace this with archetype cards, shadcn defaults, or placeholder cards.
// Any change to this file MUST be explicitly requested by Carlo Rene Earl.

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function HomeDreamTeam() {
  const navigate = useNavigate();

  useEffect(() => {
    const panel = document.getElementById("dream-team-panel");
    if (!panel) return;

    function handleMove(e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      panel.style.transform = `rotateX(${y * -1}deg) rotateY(${x}deg) scale(1.02)`;
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div 
      id="dream-team-panel"
      className="
        relative w-full flex flex-col items-center 
        mt-16 mb-28 px-6 py-16
        rounded-3xl 
        overflow-hidden
        backdrop-blur-3xl
        bg-gradient-to-br from-indigo-950/50 via-violet-900/30 to-blue-900/40
        border border-indigo-500/40 
        shadow-[0_0_80px_rgba(60,80,255,0.65)]
        transform-gpu transition-transform duration-300
        hover:scale-[1.015]
        cursor-default
      "
    >
      {/* HOLOGRAPHIC SIGIL BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="
            absolute w-[600px] h-[600px] 
            rounded-full 
            bg-gradient-to-r from-indigo-600/40 via-violet-500/20 to-blue-600/40
            blur-[120px] 
            opacity-30 
            animate-sigilPulse
            left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          "
        />
      </div>

      {/* PULSE BEAMS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="beam"></div>
        <div className="beam delay-700"></div>
        <div className="beam delay-1500"></div>
      </div>

      {/* FLOAT PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(22)].map((_, i) => (
          <div 
            key={i}
            className="glyph-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* TITLE */}
      <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-[0_0_12px_rgba(120,150,255,0.9)] relative z-10">
        The Dream Team
      </h2>

      {/* DESCRIPTION */}
      <p className="text-xl text-indigo-200 max-w-4xl text-center leading-relaxed mb-6 relative z-10">
        AI is a roster not a religion.  
        When one model stumbles another picks up the ball.  
        This is synergy. This is intelligence with teammates.
      </p>

      <p className="text-indigo-200 max-w-4xl text-center leading-relaxed mb-10 relative z-10">
        GlyphLock runs every operator like a championship lineup.  
        Precision from one. Creativity from another. Stability from a third.  
        Their overlap forms the backbone of our truth infrastructure.
      </p>

      {/* CTA BUTTON */}
      <button
        onClick={() => navigate(createPageUrl('DreamTeam'))}
        className="
          px-14 py-4 rounded-full 
          text-xl font-bold 
          text-white 
          bg-gradient-to-r from-indigo-500 to-blue-600 
          hover:from-indigo-400 hover:to-blue-500 
          shadow-[0_0_30px_rgba(90,90,255,0.8)]
          hover:shadow-[0_0_50px_rgba(120,120,255,1)]
          transition-all duration-300 
          backdrop-blur-xl 
          border border-indigo-300/40 
          active:scale-95
          relative z-10
        "
      >
        Enter the Dream Team
      </button>

      {/* STATS TICKER */}
      <div className="mt-10 flex gap-10 text-indigo-300 font-semibold tracking-wide text-lg animate-ticker relative z-10 overflow-hidden max-w-full">
        <span className="inline-block">Claude — Deep Reasoning</span>
        <span className="inline-block">Alfred — System Orchestration</span>
        <span className="inline-block">GPT — Creative Intelligence</span>
        <span className="inline-block">Perplexity — Real-time Recall</span>
        <span className="inline-block">Cursor — Code Precision</span>
        <span className="inline-block">Claude — Deep Reasoning</span>
        <span className="inline-block">Alfred — System Orchestration</span>
        <span className="inline-block">GPT — Creative Intelligence</span>
        <span className="inline-block">Perplexity — Real-time Recall</span>
        <span className="inline-block">Cursor — Code Precision</span>
      </div>
    </div>
  );
}