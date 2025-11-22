import React from "react";
import { motion } from "framer-motion";
import { Grid3x3, Image } from "lucide-react";

export default function BatchPanel({ batchCount, setBatchCount }) {
  const batchOptions = [1, 2, 4, 8];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card border-[#8C4BFF]/30 p-4 rounded-xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <Grid3x3 className="w-5 h-5 text-[#8C4BFF]" />
        <h3 className="text-lg font-bold text-white">Batch Generation</h3>
      </div>

      <p className="text-sm text-white/60 mb-4">Generate multiple variations simultaneously</p>

      <div className="grid grid-cols-4 gap-3">
        {batchOptions.map((count) => (
          <motion.button
            key={count}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setBatchCount(count)}
            className={`aspect-square rounded-xl font-bold text-lg transition-all ${
              batchCount === count
                ? 'bg-gradient-to-br from-[#8C4BFF] to-[#00E4FF] text-white shadow-lg shadow-[#8C4BFF]/50'
                : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-1">
              <Image className="w-5 h-5" />
              <span>{count}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}