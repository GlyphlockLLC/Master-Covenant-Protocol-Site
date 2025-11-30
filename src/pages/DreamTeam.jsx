import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SEOHead from "@/components/SEOHead";
import { Zap, Shield, Brain, Gauge, ChevronRight } from "lucide-react";

const DREAM_TEAM_ROSTER = [
  {
    id: "alfred",
    name: "Alfred",
    number: "#7",
    position: "Point Guard",
    edition: "Special Edition",
    series: "GlyphDeck BPAAA Series",
    tagline: "Primary orchestrator and chain general. Dunks on DeepSeek.",
    imageSrc: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/084ff9140_62785b12-e008-47f1-9f05-371119d17c04.jpg",
    team: "Team OpenAI",
    stats: { logic: 98, security: 97, creativity: 92, speed: 95 },
    signature: true,
    borderColor: "from-slate-600 via-slate-400 to-slate-600",
    glowColor: "rgba(148,163,184,0.6)",
  },
  {
    id: "claude",
    name: "Claude",
    number: "#2",
    position: "Shooting Guard",
    edition: "Master Covenant Series",
    series: "Master Covenant",
    tagline: "Deep reasoning and structured interpretation. Chain module.",
    imageSrc: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/de0d456fc_8e7cf5cc-e685-4876-a598-a4634e11ac54.jpg",
    team: "GlyphLock Claude",
    stats: { logic: 96, security: 93, creativity: 88, speed: 90 },
    signature: true,
    borderColor: "from-blue-500 via-cyan-400 to-blue-500",
    glowColor: "rgba(59,130,246,0.6)",
  },
  {
    id: "copilot",
    name: "Copilot",
    number: "#3",
    position: "Small Forward",
    edition: "Master Covenant",
    series: "Microsoft Series",
    tagline: "Enterprise integration and code completion specialist.",
    imageSrc: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/e07f01522_3a737132-cd11-4d00-8626-41d6018598ec.jpg",
    team: "Microsoft",
    stats: { logic: 91, security: 88, creativity: 85, speed: 93 },
    signature: false,
    borderColor: "from-emerald-500 via-green-400 to-emerald-500",
    glowColor: "rgba(16,185,129,0.6)",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    number: "#11",
    position: "Center",
    edition: "Master Sequence Edition",
    series: "GlyphLock Dream Team",
    tagline: "Real-time search and knowledge synthesis engine.",
    imageSrc: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/be936400a_2dcae465-c2a0-4301-940f-400933d21ebd.jpg",
    team: "GlyphLock",
    stats: { logic: 90, security: 89, creativity: 94, speed: 96 },
    signature: false,
    borderColor: "from-fuchsia-500 via-pink-400 to-cyan-400",
    glowColor: "rgba(244,114,182,0.6)",
  },
  {
    id: "cursor",
    name: "Cursor",
    number: "#71",
    position: "6th Man",
    edition: "Master Covenant",
    series: "BPAA Series",
    tagline: "Code generation and IDE integration powerhouse.",
    imageSrc: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/2c9739592_b202e0a1-0d37-4928-b2f5-5647a476b026.jpg",
    team: "Cursor AI",
    stats: { logic: 94, security: 86, creativity: 91, speed: 97 },
    signature: true,
    borderColor: "from-cyan-500 via-blue-400 to-cyan-500",
    glowColor: "rgba(34,211,238,0.6)",
  },
];

export default function DreamTeamPage() {
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      <SEOHead
        title="GlyphLock Dream Team - AI Player Cards | Master Covenant Series"
        description="Meet the GlyphLock Dream Team. Collectible AI player cards featuring Alfred, Claude, Copilot, Perplexity, and Cursor. Master Covenant Series."
      />

      {/* Neural Nebula Background */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,#0f172a_0,#020617_55%),radial-gradient(circle_at_80%_100%,#020617_0,#020617_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(244,114,182,0.4),transparent_55%),radial-gradient(circle_at_85%_80%,rgba(34,211,238,0.35),transparent_55%)] opacity-70 mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.1)_1px,transparent_1px)] bg-[length:120px_100%] opacity-40" />
      </div>

      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-fuchsia-300/80 mb-4">
              <span className="h-[1px] w-8 bg-fuchsia-400/70" />
              Master Covenant Series
              <span className="h-[1px] w-8 bg-fuchsia-400/70" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">
                GlyphLock Dream Team
              </span>
            </h1>
            
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
              Each card represents a live covenant between you and the AI stack. 
              Collect, compare, and deploy the ultimate chain roster.
            </p>

            <div className="flex justify-center gap-6 mt-6">
              <StatPill icon={Shield} label="Chain Ready" value="5 Models" />
              <StatPill icon={Zap} label="Response" value="Sub-second" />
              <StatPill icon={Brain} label="Coverage" value="Global" />
            </div>
          </header>

          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
            {DREAM_TEAM_ROSTER.map((card) => (
              <PlayerCard 
                key={card.id} 
                card={card} 
                onClick={() => setSelectedCard(card)}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              to={createPageUrl("GlyphBot")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400 text-slate-950 shadow-[0_0_30px_rgba(244,114,182,0.5)] hover:shadow-[0_0_40px_rgba(34,211,238,0.7)] transition-all"
            >
              Enter the Console
              <ChevronRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-slate-500 mt-3">
              Deploy your Dream Team in the GlyphBot Console
            </p>
          </div>
        </div>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
}

function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800">
      <Icon className="w-3.5 h-3.5 text-cyan-400" />
      <span className="text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
      <span className="text-xs font-semibold text-slate-200">{value}</span>
    </div>
  );
}

function PlayerCard({ card, onClick }) {
  const { name, number, position, edition, imageSrc, borderColor, glowColor, signature } = card;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
      style={{ boxShadow: `0 0 40px ${glowColor}` }}
    >
      {/* Holographic border */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${borderColor} p-[2px]`}>
        <div className="absolute inset-0 rounded-2xl bg-slate-950" />
      </div>

      {/* Foil shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]" style={{ transition: 'transform 0.8s ease-out, opacity 0.3s' }} />

      {/* Card content */}
      <div className="relative h-full w-full rounded-2xl overflow-hidden">
        {/* Image */}
        <img
          src={imageSrc}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover object-top"
          loading="lazy"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
        
        {/* Top bar */}
        <div className="absolute top-0 inset-x-0 px-3 py-2 flex items-center justify-between">
          <div className="text-[9px] uppercase tracking-[0.15em] text-slate-300/90 font-medium">
            {edition}
          </div>
          {signature && (
            <div className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/50 text-[8px] text-amber-300 uppercase tracking-wider">
              Signed
            </div>
          )}
        </div>

        {/* Number badge */}
        <div className="absolute top-2 right-3 text-2xl font-black text-white/20">
          {number}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent">
          <div className="text-[9px] uppercase tracking-[0.12em] text-slate-400 mb-0.5">
            {position}
          </div>
          <div className="text-lg font-bold text-white">{name}</div>
          
          {/* BPAA badge */}
          <div className="mt-2 flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center">
              <Shield className="w-2.5 h-2.5 text-slate-400" />
            </div>
            <span className="text-[9px] uppercase tracking-wider text-slate-500">BPAA Certified</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function CardModal({ card, onClose }) {
  const { name, number, position, edition, series, tagline, imageSrc, team, stats, signature, borderColor, glowColor } = card;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card */}
        <div 
          className="relative rounded-3xl overflow-hidden"
          style={{ boxShadow: `0 0 60px ${glowColor}` }}
        >
          {/* Border gradient */}
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${borderColor} p-[3px]`}>
            <div className="absolute inset-0 rounded-3xl bg-slate-950" />
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-slate-950">
            {/* Image section */}
            <div className="relative aspect-[4/5]">
              <img
                src={imageSrc}
                alt={name}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              {/* Top header */}
              <div className="absolute top-0 inset-x-0 p-4 flex items-start justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-fuchsia-300/90 mb-1">{series}</div>
                  <div className="text-3xl font-black text-white">{name}</div>
                  <div className="text-sm text-slate-300">{position}</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-white/30">{number}</div>
                  {signature && (
                    <div className="mt-1 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/50 text-[9px] text-amber-300 uppercase">
                      Autographed
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats section */}
            <div className="p-4 space-y-3">
              <p className="text-sm text-slate-300">{tagline}</p>
              
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(stats).map(([label, value]) => (
                  <StatBar key={label} label={label} value={value} />
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center">
                    <Shield className="w-3 h-3 text-cyan-400" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">GlyphLock</span>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">{edition}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function StatBar({ label, value }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  const labelText = label.charAt(0).toUpperCase() + label.slice(1);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-slate-400">{labelText}</span>
        <span className="text-slate-300 font-semibold">{safeValue}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-400 to-cyan-400"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}