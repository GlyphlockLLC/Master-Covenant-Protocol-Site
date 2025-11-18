import React from "react";
import { CheckCircle2, X } from "lucide-react";

export default function ComparisonSection() {
  const features = [
    { name: "Post-Quantum Encryption", glyphlock: true, traditional: false },
    { name: "AI Threat Detection", glyphlock: true, traditional: false },
    { name: "Blockchain Verification", glyphlock: true, traditional: false },
    { name: "Zero-Trust Architecture", glyphlock: true, traditional: "Partial" },
    { name: "Real-Time Response", glyphlock: "<1ms", traditional: "Minutes" },
    { name: "Smart Contract Integration", glyphlock: true, traditional: false },
    { name: "Biometric Authentication", glyphlock: true, traditional: "Limited" },
    { name: "24/7 AI Monitoring", glyphlock: true, traditional: false }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          GlyphLock vs Traditional Security
        </h2>
        <p className="text-lg text-white/70">
          See why enterprises choose GlyphLock
        </p>
      </div>

      <div className="glass-card-dark border-blue-500/30 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-3 bg-blue-500/20 border-b border-blue-500/30 p-4">
          <div className="text-white/70">Feature</div>
          <div className="text-center font-bold text-blue-400">GlyphLock</div>
          <div className="text-center text-white/70">Traditional</div>
        </div>

        {features.map((feature, idx) => (
          <div key={idx} className="grid grid-cols-3 border-b border-blue-500/20 p-4 hover:bg-blue-500/10 transition-colors">
            <div className="text-white">{feature.name}</div>
            <div className="flex justify-center">
              {typeof feature.glyphlock === "boolean" ? (
                feature.glyphlock ? (
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                ) : (
                  <X className="w-6 h-6 text-red-400" />
                )
              ) : (
                <span className="text-blue-400 font-semibold">{feature.glyphlock}</span>
              )}
            </div>
            <div className="flex justify-center">
              {typeof feature.traditional === "boolean" ? (
                feature.traditional ? (
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                ) : (
                  <X className="w-6 h-6 text-red-400" />
                )
              ) : (
                <span className="text-white/70">{feature.traditional}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}