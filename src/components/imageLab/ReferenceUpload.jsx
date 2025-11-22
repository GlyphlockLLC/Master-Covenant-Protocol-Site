import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export default function ReferenceUpload({ referenceImage, setReferenceImage }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReferenceImage(event.target.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReferenceImage(event.target.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const removeImage = () => {
    setReferenceImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card border-[#00E4FF]/30 p-4 rounded-xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <ImageIcon className="w-5 h-5 text-[#00E4FF]" />
        <h3 className="text-lg font-bold text-white">Reference Image</h3>
      </div>

      {!referenceImage ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#00E4FF] bg-[#00E4FF]/10'
              : 'border-[#8C4BFF]/30 hover:border-[#8C4BFF]/60 hover:bg-white/5'
          }`}
        >
          <Upload className="w-12 h-12 text-white/40 mx-auto mb-3" />
          <p className="text-white/60 text-sm mb-1">Drag & drop an image</p>
          <p className="text-white/40 text-xs">or click to browse</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative group">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative rounded-xl overflow-hidden border-2 border-[#00E4FF]/50"
          >
            <img src={referenceImage} alt="Reference" className="w-full h-auto" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 rounded-lg transition-colors z-10"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {referenceImage && (
        <div className="mt-3">
          <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer hover:text-white transition-colors">
            <input type="checkbox" className="w-4 h-4 rounded border-[#8C4BFF]/30 bg-black/50" />
            Use as style reference
          </label>
        </div>
      )}
    </motion.div>
  );
}