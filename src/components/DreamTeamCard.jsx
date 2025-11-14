import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export default function DreamTeamCard({ card }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative h-[600px] w-full max-w-[450px] mx-auto cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front of Card */}
        <div className="absolute inset-0 backface-hidden">
          <img 
            src={card.frontImage} 
            alt={card.name}
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>

        {/* Back of Card */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl border-2 border-blue-500/50 p-8 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 px-4 py-2">
                {card.position}
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50 px-3 py-1.5">
                BOUND
              </Badge>
            </div>

            <h3 className="text-3xl font-bold text-white mb-2">{card.name}</h3>
            <p className="text-blue-400 font-semibold mb-4">{card.role}</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">{card.binding.method}</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">{card.binding.mechanism}</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">{card.binding.covenant}</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">{card.binding.enforcement}</p>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h4 className="text-sm font-bold text-blue-400 mb-2">BINDING TYPE</h4>
              <p className="text-xs text-gray-400 mb-3">{card.bindingType}</p>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                <p className="text-xs italic text-blue-300">{card.quote}</p>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Class: {card.class}</span>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                  BPAA
                </Badge>
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="inline-block bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg px-6 py-2">
                <p className="text-xs font-bold text-blue-400">GLYPHLOCK MASTER COVENANT</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}