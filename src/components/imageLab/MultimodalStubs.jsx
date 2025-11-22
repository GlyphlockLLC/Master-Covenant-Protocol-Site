import React from "react";
import { motion } from "framer-motion";
import { Video, Image, Box, Music, Lock } from "lucide-react";

const FUTURE_FEATURES = [
  {
    id: 'img-to-video',
    name: 'Image → Video',
    icon: Video,
    description: 'Transform static images into animated sequences',
    status: 'Coming Soon',
  },
  {
    id: 'video-style',
    name: 'Video Style Transfer',
    icon: Image,
    description: 'Apply artistic styles to video footage',
    status: 'Roadmap Q3',
  },
  {
    id: 'img-to-3d',
    name: 'Image → 3D Object',
    icon: Box,
    description: 'Generate 3D models from 2D images',
    status: 'Beta Access',
  },
  {
    id: 'audio-visual',
    name: 'Audio → Visual',
    icon: Music,
    description: 'Create visuals from audio input',
    status: 'Research',
  },
];

export default function MultimodalStubs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card border-[#8C4BFF]/30 p-6 rounded-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <Box className="w-5 h-5 text-[#8C4BFF]" />
        <h3 className="text-xl font-bold text-white">Multimodal Expansion</h3>
        <span className="text-xs px-2 py-1 bg-[#00E4FF]/20 text-[#00E4FF] rounded-full">Preview</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FUTURE_FEATURES.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative p-4 bg-white/5 border border-[#8C4BFF]/20 rounded-xl hover:border-[#00E4FF]/40 transition-colors cursor-not-allowed group"
            >
              {/* Lock Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-center">
                  <Lock className="w-8 h-8 text-[#00E4FF] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">{feature.status}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-to-br from-[#8C4BFF]/20 to-[#00E4FF]/20 rounded-lg">
                  <Icon className="w-5 h-5 text-[#00E4FF]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{feature.name}</h4>
                  <p className="text-xs text-white/60">{feature.description}</p>
                  <div className="mt-2">
                    <span className="text-xs px-2 py-1 bg-[#8C4BFF]/20 text-[#8C4BFF] rounded-full">
                      {feature.status}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-[#8C4BFF]/10 to-[#00E4FF]/10 rounded-lg border border-[#8C4BFF]/20">
        <p className="text-xs text-white/70 text-center">
          🚀 Enterprise customers get priority access to new features. <span className="text-[#00E4FF] cursor-pointer hover:underline">Contact Sales</span>
        </p>
      </div>
    </motion.div>
  );
}