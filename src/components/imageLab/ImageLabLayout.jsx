import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ImageLabLayout({ children }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0A0F24] to-[#1a0033] opacity-90"></div>
        
        {/* Animated Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] opacity-30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Nebula Gradient Overlays */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#8C4BFF] rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#00E4FF] rounded-full blur-[150px] opacity-15 animate-pulse delay-1000"></div>
        
        {/* GlyphLock Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="text-[800px] font-bold text-[#8C4BFF]">◈</div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Scan Line Effect */}
      <motion.div
        className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00E4FF] to-transparent opacity-50 pointer-events-none z-50"
        animate={{
          y: [0, window.innerHeight, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}