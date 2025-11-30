import React from "react";

export default function HeroSection() {
  return (
    <div className="w-full flex justify-center px-4 sm:px-6 py-8">
      <div className="relative w-full max-w-[1200px] group">
        {/* Royal Blue/Purple Glow Effect with Pulse */}
        <div className="absolute -inset-2 bg-gradient-to-r from-[#4169E1] via-[#7B68EE] to-[#9370DB] rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition duration-1000 animate-pulse"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-[#4169E1] to-[#9370DB] rounded-2xl blur opacity-30"></div>
        
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[#7B68EE]/40 shadow-[0_0_60px_rgba(123,104,238,0.4)] hover:shadow-[0_0_80px_rgba(65,105,225,0.5)] transition-all duration-500" style={{ aspectRatio: '16/9' }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(1.1) contrast(1.1)' }}
          >
            <source src="https://i.imgur.com/zs3sPzJ.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-[#4169E1]/10 to-transparent pointer-events-none" />
          
          <div className="absolute z-10 bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 md:bottom-3 md:right-3 lg:bottom-4 lg:right-4 flex items-center gap-2 md:gap-3">
            <span className="text-white font-black tracking-[0.3em] text-[10px] sm:text-xs md:text-sm uppercase hidden sm:block drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse">
              SYSTEM ACTIVE
            </span>
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/08025b614_gl-logo.png"
              alt="GlyphLock"
              className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto drop-shadow-[0_0_20px_rgba(65,105,225,0.8)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}