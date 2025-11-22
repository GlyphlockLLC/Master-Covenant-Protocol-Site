import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const STYLE_PRESETS = [
  { id: "photorealistic", name: "Photorealistic", icon: "📸" },
  { id: "illustration", name: "Hyper-illustration", icon: "🎨" },
  { id: "anime", name: "Anime", icon: "🌸" },
  { id: "3d", name: "3D Render", icon: "🎲" },
  { id: "cyberpunk", name: "Neon Cyberpunk", icon: "⚡" },
  { id: "cosmic", name: "Cosmic Fractal", icon: "🌌" },
  { id: "portrait", name: "Studio Portrait", icon: "👤" },
  { id: "watercolor", name: "Watercolor", icon: "💧" },
  { id: "pixar", name: "Pixar-style", icon: "🎬" },
  { id: "lineart", name: "Line Art", icon: "✏️" },
  { id: "vaporwave", name: "Vaporwave", icon: "🌆" },
];

export default function PromptPanel({ prompt, setPrompt, onGenerate, loading, selectedStyle, setSelectedStyle }) {
  const [isFocused, setIsFocused] = useState(false);

  const handleStyleSelect = (styleId) => {
    setSelectedStyle(styleId);
    const style = STYLE_PRESETS.find(s => s.id === styleId);
    if (style) {
      const styleText = `, ${style.name.toLowerCase()} style`;
      if (!prompt.toLowerCase().includes(style.name.toLowerCase())) {
        setPrompt(prompt + styleText);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card border-[#8C4BFF]/30 p-6 rounded-2xl relative overflow-hidden"
    >
      {/* Holographic Glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#8C4BFF]/10 via-[#00E4FF]/10 to-[#8C4BFF]/10 pointer-events-none"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Wand2 className="w-6 h-6 text-[#00E4FF]" />
          <h2 className="text-2xl font-bold text-white">Prompt Input</h2>
        </div>

        {/* Style Presets */}
        <div className="mb-4">
          <p className="text-sm text-white/60 mb-3">Style Preset:</p>
          <div className="flex flex-wrap gap-2">
            {STYLE_PRESETS.map((style) => (
              <button
                key={style.id}
                onClick={() => handleStyleSelect(style.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedStyle === style.id
                    ? 'bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] text-white shadow-lg shadow-[#8C4BFF]/50'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                }`}
              >
                <span className="mr-1.5">{style.icon}</span>
                {style.name}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="relative">
          <motion.div
            className={`absolute inset-0 rounded-xl bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] opacity-0 blur-xl transition-opacity duration-300 ${
              isFocused ? 'opacity-30' : ''
            }`}
          />
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Describe the visual you want to forge..."
            rows={6}
            className="w-full bg-black/50 border-2 border-[#8C4BFF]/30 rounded-xl p-4 text-white placeholder:text-white/40 focus:border-[#00E4FF] focus:outline-none transition-colors duration-300 relative z-10 resize-none"
          />
          {!prompt && (
            <motion.div
              className="absolute top-4 right-4 text-white/20 pointer-events-none"
              animate={{
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          )}
        </div>

        {/* Prompt Hints */}
        <p className="text-xs text-white/40 mt-2">
          💡 Try: "neon biomechanical wolf, 8K, ultra detailed, cosmic background"
        </p>

        {/* Generate Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6"
        >
          <Button
            onClick={onGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full h-14 bg-gradient-to-r from-[#8C4BFF] via-[#00E4FF] to-[#8C4BFF] bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold text-lg rounded-xl shadow-lg shadow-[#8C4BFF]/50 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            {/* Spark Animation */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              animate={{
                background: [
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                ],
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              ⚡ {loading ? "Forging..." : "Ignite Render"}
            </span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}