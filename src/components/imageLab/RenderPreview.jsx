import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, RotateCw, Maximize2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RenderPreview({ 
  images, 
  loading, 
  onRegenerate, 
  onDownload, 
  onViewFullscreen,
  metadata 
}) {
  const copyPrompt = (prompt) => {
    navigator.clipboard.writeText(prompt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card border-[#00E4FF]/30 p-6 rounded-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Render Output</h3>
        {images.length > 0 && (
          <span className="text-sm text-white/60">{images.length} image{images.length > 1 ? 's' : ''} generated</span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="text-8xl mb-6"
            >
              ◈
            </motion.div>
            <p className="text-xl text-white/80 mb-2">Forging your creation...</p>
            <div className="flex gap-1 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 rounded-full bg-[#00E4FF]"
                />
              ))}
            </div>
          </motion.div>
        ) : images.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="text-6xl mb-4 opacity-20">🖼️</div>
            <p className="text-white/60">Your generated images will appear here</p>
          </motion.div>
        ) : (
          <motion.div
            key="images"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className={`grid gap-4 ${
              images.length === 1 ? 'grid-cols-1' :
              images.length === 2 ? 'grid-cols-2' :
              'grid-cols-2'
            }`}>
              {images.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  <div className="relative overflow-hidden rounded-xl border-2 border-[#8C4BFF]/30 group-hover:border-[#00E4FF]/60 transition-colors">
                    <img src={img.url} alt={`Generated ${idx + 1}`} className="w-full h-auto" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Action Buttons */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => onDownload(img.url, idx)}
                          className="flex-1 bg-[#00E4FF]/20 hover:bg-[#00E4FF]/40 backdrop-blur-sm border border-[#00E4FF]/50"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onViewFullscreen(img.url)}
                          className="bg-[#8C4BFF]/20 hover:bg-[#8C4BFF]/40 backdrop-blur-sm border border-[#8C4BFF]/50"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  {metadata && (
                    <div className="mt-3 p-3 bg-black/30 rounded-lg border border-white/10">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-white/40">Model:</span>
                          <span className="text-white/80 ml-2">{metadata.model || 'DALL-E 3'}</span>
                        </div>
                        <div>
                          <span className="text-white/40">Quality:</span>
                          <span className="text-white/80 ml-2">{metadata.quality || 'HD'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Global Actions */}
            <div className="flex gap-3">
              <Button
                onClick={onRegenerate}
                className="flex-1 bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] hover:opacity-90"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Regenerate All
              </Button>
              {metadata?.prompt && (
                <Button
                  onClick={() => copyPrompt(metadata.prompt)}
                  variant="outline"
                  className="border-[#8C4BFF]/50 text-white hover:bg-[#8C4BFF]/20"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Prompt
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}