import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function HomeDreamTeamCTA() {
  return (
    <section className="relative w-full py-24 overflow-hidden rounded-3xl mt-20 select-none">

      {/* BACKGROUND + PARALLAX */}
      <div className="absolute inset-0 animate-pan">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/10b04ca10_3880beef-889a-4dec-9b80-2b561f3c47a31.jpg"
          alt="Dream Team Background"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">

        {/* LOGO FADE-IN */}
        <div className="w-56 h-auto mb-10 opacity-0 animate-fade-in">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/00707b06f_c44b0deb.png"
            alt="GlyphLock Dream Team"
            className="mx-auto drop-shadow-[0_0_30px_rgba(125,80,255,0.9)]"
          />
        </div>

        {/* HEADLINE */}
        <h2 className="text-white text-3xl md:text-4xl font-extrabold mb-4 opacity-0 animate-fade-in-delayed drop-shadow-xl">
          AI didn't understand teamwork…
          <br />
          <span className="text-indigo-300">until we showed it the Dream Team.</span>
        </h2>

        {/* SUBTEXT */}
        <p className="text-gray-200 text-lg md:text-xl max-w-2xl leading-relaxed mb-12 opacity-0 animate-fade-in-long">
          GlyphLock runs five AI systems like a championship lineup—each one covering the
          others, checking every output, and eliminating blind spots in real time.
          <br />
          <span className="text-white font-semibold">One model fails. A team doesn't.</span>
        </p>

        {/* CTA BUTTON WITH 3D HOVER + NEON PULSE */}
        <Link to={createPageUrl("DreamTeam")}>
          <div className="relative group cursor-pointer transform-gpu transition-transform duration-300 hover:scale-[1.15] hover:rotate-[2deg] active:scale-95">

            {/* NEON AURA */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-60 group-hover:opacity-95 transition-all duration-500"
              style={{
                background: "radial-gradient(circle, rgba(130,0,255,0.85), rgba(0,0,0,0))",
              }}
            />

            {/* NEON OUTLINE RING */}
            <div className="absolute inset-0 rounded-full border-4 border-indigo-400 opacity-50 group-hover:opacity-90 animate-pulse"></div>

            {/* BALL LOGO */}
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/a7c736bf1_9dd41410-ffb9-48e2-97bc-b28c9da62b8a.png"
              alt="Enter Dream Team"
              className="relative w-60 h-60 drop-shadow-[0_0_35px_rgba(120,60,255,1)] transition-all duration-300 group-hover:drop-shadow-[0_0_55px_rgba(160,90,255,1)]"
            />

            {/* LABEL */}
            <span className="block mt-5 text-white text-2xl font-semibold tracking-wide group-hover:text-indigo-300 transition-colors">
              ENTER THE DREAM TEAM →
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}