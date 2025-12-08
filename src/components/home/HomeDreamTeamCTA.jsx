import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function HomeDreamTeamCTA() {
  return (
    <section className="relative w-full py-32 overflow-hidden mt-20">

      {/* BACKGROUND COURT */}
      <div className="absolute inset-0">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/03ba5648e_3880beef-889a-4dec-9b80-2b561f3c47a31.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">

        {/* DREAM TEAM STAMP LOGO */}
        <div className="mb-8 opacity-0 animate-fade-in">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/48ca17dba_c44b0deb.png"
            alt="Dream Team GlyphLock"
            className="w-64 h-auto mx-auto drop-shadow-[0_0_40px_rgba(168,85,247,0.8)]"
          />
        </div>

        {/* HEADLINE */}
        <h2 className="text-white text-4xl md:text-5xl font-black mb-6 opacity-0 animate-fade-in-delayed leading-tight" style={{ textShadow: '0 0 20px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.9)' }}>
          AI didn't understand teamwork…
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            until we showed it the Dream Team.
          </span>
        </h2>

        {/* SUBTEXT */}
        <p className="text-white text-xl md:text-2xl max-w-3xl leading-relaxed mb-12 opacity-0 animate-fade-in-long font-semibold" style={{ textShadow: '0 0 15px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,1)' }}>
          GlyphLock runs five AI systems like a championship lineup—each one covering the others, checking every output, and eliminating blind spots in real time.
        </p>

        <p className="text-cyan-300 text-2xl md:text-3xl font-black mb-16 opacity-0 animate-fade-in-long" style={{ textShadow: '0 0 20px rgba(0,0,0,1), 0 2px 4px rgba(0,0,0,1)' }}>
          One model fails. A team doesn't.
        </p>

        {/* CLICKABLE BALL BUTTON */}
        <Link to={createPageUrl("DreamTeam")} className="opacity-0 animate-fade-in-long">
          <div className="relative group cursor-pointer transition-all duration-500 hover:scale-110 active:scale-95">
            
            {/* OUTER GLOW RING */}
            <div className="absolute inset-0 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.9), rgba(99,102,241,0.6), transparent)' }}></div>
            
            {/* PULSING RING */}
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/50 group-hover:border-purple-400/80 animate-pulse transition-all"></div>

            {/* GL BALL */}
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/cad061e3b_6a408ca0.png"
              alt="Enter Dream Team"
              className="relative w-72 h-72 drop-shadow-[0_0_50px_rgba(168,85,247,1)] group-hover:drop-shadow-[0_0_80px_rgba(168,85,247,1)] transition-all duration-500"
            />

            {/* BUTTON LABEL */}
            <div className="mt-6">
              <span className="block text-white text-3xl font-black tracking-wider group-hover:text-purple-300 transition-colors duration-300" style={{ textShadow: '0 0 20px rgba(0,0,0,1), 0 2px 4px rgba(0,0,0,1)' }}>
                ENTER THE DREAM TEAM
              </span>
              <span className="block text-cyan-400 text-xl font-bold mt-2 group-hover:text-cyan-300 transition-colors" style={{ textShadow: '0 0 15px rgba(0,0,0,1)' }}>
                →
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}