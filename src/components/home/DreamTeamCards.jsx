import React from "react";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Static basketball trading card images for homepage display
const CARD_IMAGES = [
  {
    name: "Claude",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/155b052e7_53876961-0d28-4feb-be6e-52006be003e0.jpg"
  },
  {
    name: "Copilot",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/610bb02b5_3a737132-cd11-4d00-8626-41d6018598ec.jpg"
  },
  {
    name: "Cursor",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/6d1f7d4c3_cursor-card.jpg"
  },
  {
    name: "Perplexity",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/50465d2f6_73a41682-55ca-43f7-92c8-82253b9d46db.jpg"
  },
  {
    name: "Alfred",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/536bc359e_4b73d547-755a-403b-965b-4937b44581b9.jpg"
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
          <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
            Legally bound AI systems working under the Master Covenant
          </p>
        </div>

        {/* Card Grid - 2x2 on mobile, 2x3 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 max-w-5xl mx-auto mb-8">
          {CARD_IMAGES.map((card, idx) => (
            <div 
              key={idx} 
              className="relative group rounded-xl overflow-hidden border-2 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]"
            >
              <img 
                src={card.image} 
                alt={`${card.name} - GlyphLock Dream Team`}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
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
    </section>
  );
}