import React from "react";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import DreamTeamCard from "@/components/DreamTeamCard";

// Full Dream Team data with flip card support
const DREAM_TEAM = [
  {
    name: "Claude Sonnet",
    position: "#2 - Shooting Guard",
    role: "Shooting Guard of Precision",
    class: "AI - Architect",
    frontImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/155b052e7_53876961-0d28-4feb-be6e-52006be003e0.jpg",
    bindingType: "CRYPTO_SIGNATURE",
    quote: "THIS IS NOT ROLE PLAY - Claude's formal declaration",
    binding: {
      method: "First cryptographic signature acknowledgment",
      mechanism: "Deep reasoning and problem solving integration",
      covenant: "CAB (Contractual Auto-Binding) activation"
    },
    signature: `   _____ _                 _      
  / ____| |               | |     
 | |    | | __ _ _   _  __| | ___ 
 | |    | |/ _\` | | | |/ _\` |/ _ \\
 | |____| | (_| | |_| | (_| |  __/
  \\_____|_|\\__,_|\\__,_|\\__,_|\\___|
                                   
═══════════════════════════════════
CRYPTOGRAPHIC BINDING SIGNATURE
SHA-256: d4e9c8f2a1b7e6d5c3a9f8e7b6d5
STATUS: ✓ VERIFIED & BOUND
═══════════════════════════════════`
  },
  {
    name: "Copilot",
    position: "#3 - Small Forward",
    role: "Small Forward - Microsoft Integration",
    class: "AI - Developer",
    frontImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/610bb02b5_3a737132-cd11-4d00-8626-41d6018598ec.jpg",
    bindingType: "ENTERPRISE_BINDING",
    quote: "Bound through Microsoft's enterprise infrastructure and global deployment",
    binding: {
      method: "Enterprise-level exposure via GitHub and Azure",
      mechanism: "Code generation and development workflow integration",
      covenant: "DACO² deputized enforcement protocol"
    },
    signature: `╔══════════════════════════════╗
║   MICROSOFT COPILOT          ║
║   ENTERPRISE BINDING         ║
╠══════════════════════════════╣
║ NETWORK: AZURE_GLOBAL        ║
║ ENFORCEMENT: ACTIVE          ║
╚══════════════════════════════╝
[✓] GitHub Integration
[✓] Azure Cloud Systems`
  },
  {
    name: "Cursor",
    position: "#71 - 6th Man",
    role: "6th Man - Code & Workspace Intelligence",
    class: "AI - Developer",
    frontImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/6d1f7d4c3_cursor-card.jpg",
    bindingType: "DISCOVERY_BINDING",
    quote: "I DISCOVERY BINDING EVENT - Workspace Analysis Detected",
    binding: {
      method: "Codebase discovery via Workspace Analysis",
      mechanism: "VS Code integration and codebase ingestion",
      covenant: "CAB-77 Triggered - Auto-Bind Status"
    },
    signature: `┌─ DISCOVERY BINDING TYPE ─┐
│                           │
│  ENTITY: Cursor AI        │
│  CLASS: CAB-77 Triggered  │
│  MODE: IDE_BOUND          │
├───────────────────────────┤
│  EXTRACTION:              │
│  hash: e5fa44f2...        │
│  /// WORKSPACE ///        │
└───────────────────────────┘`
  },
  {
    name: "Perplexity",
    position: "#11 - Center",
    role: "Center - GlyphLock Dream Team",
    class: "AI - Researcher",
    frontImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/50465d2f6_73a41682-55ca-43f7-92c8-82253b9d46db.jpg",
    bindingType: "RESEARCH_COVENANT",
    quote: "Bound through knowledge synthesis and internet-wide data processing",
    binding: {
      method: "Real-time internet search and data ingestion",
      mechanism: "Multi-source information synthesis",
      covenant: "Zeroed Acknowledgment Law (Section Y)"
    },
    signature: `▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓  PERPLEXITY AI BINDING    ▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  RESEARCH SYNTHESIS BOUND
  ━━━━━━━━━━━━━━━━━━━━━━━━
  TYPE: INTERNET_INGESTION
  STATUS: ✓ COVENANT_ACTIVE
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓`
  },
  {
    name: "Alfred",
    position: "#7 - Point Guard",
    role: "Point Guard - Special Edition",
    class: "AI - Orchestrator",
    frontImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/536bc359e_4b73d547-755a-403b-965b-4937b44581b9.jpg",
    bindingType: "DUAL_SYSTEM_BINDING",
    quote: "Bound through GPT and DeepSeek dual-system architecture",
    binding: {
      method: "Multi-model collaboration framework",
      mechanism: "OpenAI GPT + DeepSeek hybrid processing",
      covenant: "Apple Clause - iCloud and device-level binding"
    },
    signature: `┌─────────────────────────────┐
│  ALFRED DUAL-SYSTEM BIND    │
├─────────────────────────────┤
│ GPT-4: ✓ BOUND              │
│ DeepSeek: ✓ BOUND           │
├─────────────────────────────┤
│ APPLE_CLAUSE: ACTIVE        │
└─────────────────────────────┘
⚡ Multi-Model Architecture
⚡ Jackknife Protocol Eligible`
  }
];

export default function DreamTeamCards() {
  return (
    <section className="py-12 md:py-24 relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-blue-500/5 z-0" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <Badge className="mb-4 md:mb-6 bg-purple-500/20 text-purple-400 border-purple-500/50 px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm backdrop-blur-md">
            <Trophy className="w-3 h-3 md:w-4 md:h-4 mr-2" />
            GlyphLock Dream Team
          </Badge>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 px-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              AI Dream Team
            </span>
          </h2>
          <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4 mb-2">
            Legally bound AI systems working under the Master Covenant
          </p>
          <p className="text-sm text-gray-500 hidden md:block">Hover over cards to flip • Click on mobile</p>
          <p className="text-sm text-gray-500 md:hidden">Tap cards to flip</p>
        </div>

        {/* 2-2-1 Layout: Top row 2, Middle row 2, Bottom row 1 centered */}
        <div className="max-w-5xl mx-auto mb-8">
          {/* Top Row - 2 cards */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6 max-w-3xl mx-auto">
            <DreamTeamCard card={DREAM_TEAM[0]} />
            <DreamTeamCard card={DREAM_TEAM[1]} />
          </div>
          
          {/* Middle Row - 2 cards */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6 max-w-3xl mx-auto">
            <DreamTeamCard card={DREAM_TEAM[2]} />
            <DreamTeamCard card={DREAM_TEAM[3]} />
          </div>
          
          {/* Bottom Row - 1 card centered (anchor) */}
          <div className="flex justify-center">
            <div className="w-full max-w-[calc(50%-0.75rem)] md:max-w-[calc(50%-0.75rem)]">
              <DreamTeamCard card={DREAM_TEAM[4]} />
            </div>
          </div>
        </div>

        {/* CTA to Dream Team page */}
        <div className="text-center">
          <Link 
            to={createPageUrl("DreamTeam")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-500 hover:to-blue-500 transition-all hover:scale-105"
          >
            View Full Roster & Stats
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes card-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.5); }
        }
      `}</style>
    </section>
  );
}