import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RenderLightbox({ imageUrl, onClose, onDownload }) {
  const [zoom, setZoom] = useState(1);

  if (!imageUrl) return null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          <Button
            onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
          >
            <ZoomOut className="w-5 h-5" />
          </Button>
          <Button
            onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
          >
            <ZoomIn className="w-5 h-5" />
          </Button>
          <Button
            onClick={(e) => { e.stopPropagation(); onDownload(imageUrl); }}
            className="bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF]"
          >
            <Download className="w-5 h-5 mr-2" />
            Download
          </Button>
        </div>

        {/* Image */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative max-w-[90vw] max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.img
            src={imageUrl}
            alt="Fullscreen"
            style={{ scale: zoom }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="rounded-xl shadow-2xl shadow-[#8C4BFF]/50 border-2 border-[#8C4BFF]/30"
          />
        </motion.div>

        {/* Zoom Indicator */}
        <div className="absolute top-4 left-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <span className="text-white text-sm">{Math.round(zoom * 100)}%</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}