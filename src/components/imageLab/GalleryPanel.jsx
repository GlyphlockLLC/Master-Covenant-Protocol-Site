import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FolderOpen, Trash2, RotateCw, Calendar, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GalleryPanel({ onImageSelect }) {
  const [savedImages, setSavedImages] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const stored = localStorage.getItem('glyphlock_generated_images');
    if (stored) {
      setSavedImages(JSON.parse(stored));
    }
  }, []);

  const saveImage = (imageData) => {
    const newImages = [...savedImages, { ...imageData, id: Date.now(), timestamp: new Date().toISOString() }];
    setSavedImages(newImages);
    localStorage.setItem('glyphlock_generated_images', JSON.stringify(newImages));
  };

  const removeImage = (id) => {
    const filtered = savedImages.filter(img => img.id !== id);
    setSavedImages(filtered);
    localStorage.setItem('glyphlock_generated_images', JSON.stringify(filtered));
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all saved images?')) {
      setSavedImages([]);
      localStorage.removeItem('glyphlock_generated_images');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card border-[#8C4BFF]/30 p-6 rounded-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FolderOpen className="w-5 h-5 text-[#8C4BFF]" />
          <h3 className="text-xl font-bold text-white">Saved Creations</h3>
        </div>
        {savedImages.length > 0 && (
          <Button
            onClick={clearAll}
            size="sm"
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {['all', 'recent', 'photorealistic', 'anime', '3d'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {savedImages.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3 opacity-20">📁</div>
          <p className="text-white/60 text-sm">No saved images yet</p>
          <p className="text-white/40 text-xs mt-1">Generated images will be saved here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-2">
          {savedImages.map((img, idx) => (
            <motion.div
              key={img.id || idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="relative group cursor-pointer"
              onClick={() => onImageSelect && onImageSelect(img)}
            >
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-[#8C4BFF]/20 hover:border-[#00E4FF]/50 transition-colors">
                <img
                  src={img.url}
                  alt={`Saved ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Actions */}
              <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                  className="flex-1 p-1.5 bg-red-500/80 hover:bg-red-600 rounded text-xs"
                >
                  <Trash2 className="w-3 h-3 mx-auto" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  className="flex-1 p-1.5 bg-[#00E4FF]/80 hover:bg-[#00E4FF] rounded text-xs"
                >
                  <RotateCw className="w-3 h-3 mx-auto" />
                </button>
              </div>

              {/* Date Badge */}
              {img.timestamp && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white/80">
                  {new Date(img.timestamp).toLocaleDateString()}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}