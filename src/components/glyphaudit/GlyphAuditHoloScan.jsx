import React from 'react';
import { motion } from 'framer-motion';

export default function GlyphAuditHoloScan({ active = true }) {
  if (!active) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      <motion.div
        className="absolute h-[2px] w-full"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(0, 228, 255, 0.6) 20%, rgba(0, 228, 255, 0.9) 50%, rgba(0, 228, 255, 0.6) 80%, transparent 100%)',
          boxShadow: '0 0 20px rgba(0, 228, 255, 0.5), 0 0 40px rgba(0, 228, 255, 0.3)'
        }}
        initial={{ top: '-2px' }}
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0, 228, 255, 0.02) 50%, transparent 100%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      <motion.div
        className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-400/50"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyan-400/50"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyan-400/50"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-400/50"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
      />
    </div>
  );
}