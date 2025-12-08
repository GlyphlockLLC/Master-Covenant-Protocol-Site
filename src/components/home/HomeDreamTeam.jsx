import React, { useState } from "react";
import { dreamTeam } from "@/components/data/dreamTeam";
import { Shield, CheckCircle2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HomeDreamTeam() {
  const [flippedIndex, setFlippedIndex] = useState(null);

  return (
    <section className="w-full py-16 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-indigo-500/30 to-violet-500/30 backdrop-blur-md border-2 border-indigo-400/60 text-white px-6 py-2 shadow-[0_0_30px_rgba(87,61,255,0.6)]">
            <span className="font-black tracking-[0.2em] text-sm">AI OPERATORS</span>
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            The <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">Dream Team</span>
          </h2>
          <p className="text-lg text-violet-100 max-w-2xl mx-auto">
            Five AI operators cryptographically bound to GlyphLock — tap any card to flip.
          </p>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 gap-8 md:grid md:grid-cols-5 md:gap-6 md:justify-center md:overflow-visible">
          {dreamTeam.map((member, i) => (
            <div key={member.id} className="perspective-1000 flex-shrink-0 w-64 md:w-auto snap-start">
              <div
                className={`relative w-full aspect-[2/3] min-h-[480px] cursor-pointer transition-all duration-700 preserve-3d overflow-visible ${
                  flippedIndex === i ? "rotate-y-180" : ""
                }`}
                onClick={() => setFlippedIndex(flippedIndex === i ? null : i)}
              >
                {/* FRONT - Holographic Card */}
                <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden">
                  {/* Metallic border with neon glow */}
                  <div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-blue-500 p-[3px]"
                    style={{
                      boxShadow: '0 0 50px rgba(87,61,255,0.8), 0 0 80px rgba(168,60,255,0.4), inset 0 0 30px rgba(255,255,255,0.15)'
                    }}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-violet-950/40 to-blue-950/60" />
                  </div>

                  {/* Deep space hologram lighting */}
                  <div 
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{
                      background: 'radial-gradient(circle at 50% 80%, rgba(87,61,255,0.6) 0%, transparent 50%)'
                    }}
                  />
                  
                  {/* Bound badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-400/50 backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                    <CheckCircle2 className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-300 font-bold uppercase">Bound</span>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/40 to-violet-500/40 border-2 border-indigo-400/60 flex items-center justify-center shadow-[0_0_35px_rgba(87,61,255,0.6)] mb-4">
                      <Shield className="w-8 h-8 text-indigo-300 drop-shadow-[0_0_15px_rgba(129,140,248,1)]" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">{member.name}</h3>
                    <p className="text-sm text-indigo-200 font-semibold mb-3 uppercase tracking-wider">{member.position}</p>
                    <p className="text-sm text-violet-100 leading-relaxed">{member.frontDesc}</p>
                  </div>

                  {/* Electric pulse animation */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-indigo-400/60 animate-pulse" style={{ animationDuration: '3s' }} />

                  {/* Tap hint */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-violet-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(87,61,255,0.6)]" />
                    Tap to flip
                  </div>
                </div>

                {/* BACK - Binding Details */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden">
                  {/* Neon border */}
                  <div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-blue-500 p-[3px]"
                    style={{
                      boxShadow: '0 0 50px rgba(87,61,255,0.8), 0 0 80px rgba(168,60,255,0.4)'
                    }}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-violet-950/40 to-blue-950/60" />
                  </div>

                  {/* Content wrapper */}
                  <div className="absolute inset-[3px] rounded-2xl bg-gradient-to-br from-indigo-900/40 via-violet-900/30 to-blue-900/40 backdrop-blur-lg p-6 flex flex-col">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-indigo-400/60">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/40 to-violet-500/40 border-2 border-indigo-400/60 flex items-center justify-center shadow-[0_0_25px_rgba(87,61,255,0.5)]">
                          <Shield className="w-5 h-5 text-indigo-300" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-white">{member.name}</h4>
                          <p className="text-xs text-indigo-200">{member.position}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs px-2 py-1 shadow-[0_0_12px_rgba(34,197,94,0.4)]">
                        ✓ VERIFIED
                      </Badge>
                    </div>

                    {/* Binding sections */}
                    <div className="space-y-4 flex-1">
                      {member.backSections.map((section, index) => (
                        <div key={index} className="bg-gradient-to-br from-indigo-900/40 via-violet-900/30 to-blue-900/40 border-2 border-indigo-400/50 rounded-xl p-3 backdrop-blur-sm shadow-[inset_0_0_20px_rgba(87,61,255,0.2)]">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-violet-300 drop-shadow-[0_0_10px_rgba(167,139,250,1)]" />
                            <h5 className="text-sm font-bold text-violet-200 uppercase tracking-wider">{section.title}</h5>
                          </div>
                          <p className="text-xs text-white leading-relaxed">{section.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-indigo-400/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-[0_0_15px_rgba(87,61,255,0.6)]">
                          <span className="text-[10px] font-black text-white">GL</span>
                        </div>
                        <span className="text-xs font-bold text-white">GlyphLock</span>
                      </div>
                      <span className="text-[10px] text-indigo-200 uppercase tracking-wider">BPAA Certified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}