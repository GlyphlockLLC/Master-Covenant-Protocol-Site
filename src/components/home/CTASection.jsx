import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ArrowRight, Zap, Shield, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

export default function CTASection() {
  const [email, setEmail] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.98]);

  const handleGetStarted = () => {
    window.location.href = createPageUrl("Consultation") + `?email=${encodeURIComponent(email)}`;
  };

  const benefits = [
    { text: "Protocol-governed access control", icon: Shield },
    { text: "System-enforced verification", icon: Zap },
    { text: "Credentialed integrity framework", icon: CheckCircle2 },
    { text: "Provisioned support channel", icon: Sparkles }
  ];

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const slideLeftVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const slideRightVariants = {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className="w-full max-w-6xl mx-auto px-4 py-20 relative"
      style={{ background: 'transparent', pointerEvents: 'auto', scale }}
    >
      {/* Animated background orbs */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ y: backgroundY }}
      >
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.3, 0.4]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </motion.div>

      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main card with animated border */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Animated gradient border */}
          <motion.div
            className="absolute inset-0 rounded-3xl p-[2px]"
            style={{
              background: 'linear-gradient(90deg, #00E4FF, #3B82F6, #8B5CF6, #00E4FF)',
              backgroundSize: '300% 100%'
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-[2px] rounded-3xl bg-slate-950/95 backdrop-blur-2xl" />
          </motion.div>

          {/* Pulsing glow overlay */}
          <motion.div
            className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 rounded-3xl blur-2xl"
            style={{ opacity: glowOpacity }}
            animate={{
              opacity: isHovered ? 0.4 : 0.2
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Content container */}
          <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-950/90 backdrop-blur-2xl rounded-3xl p-8 md:p-14 overflow-hidden">
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `
                linear-gradient(rgba(0,228,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }} />

            {/* Top accent line */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px]"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                background: 'linear-gradient(90deg, transparent, #00E4FF 30%, #8B5CF6 70%, transparent)'
              }}
            />
            
            <div className="relative z-10 text-center">
              {/* Badge */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={14} className="text-cyan-400" />
                </motion.div>
                <span className="text-cyan-400 text-sm font-medium tracking-wide">Quantum-Grade Security</span>
              </motion.div>

              {/* Title with slide animations */}
              <motion.h2
                variants={slideLeftVariants}
                className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight"
              >
                READY TO SECURE YOUR{' '}
                <motion.span 
                  className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  style={{
                    backgroundSize: '200% 100%'
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  DIGITAL ASSETS?
                </motion.span>
              </motion.h2>

              <motion.p
                variants={slideRightVariants}
                className="text-base md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-medium"
              >
                Protocol-governed verification for credentialed operators
              </motion.p>

              {/* Email form with animations */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-lg mx-auto mb-10"
              >
                <div className="flex-1 relative group">
                  <Input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 backdrop-blur-md border-2 border-white/10 text-white placeholder:text-white/40 focus:border-cyan-400/50 focus:shadow-[0_0_30px_rgba(0,228,255,0.3)] transition-all h-14 rounded-xl text-base"
                  />
                  {/* Focus glow */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity pointer-events-none" />
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={handleGetStarted}
                    size="lg"
                    className="relative overflow-hidden h-14 px-8 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 hover:from-cyan-400 hover:via-blue-400 hover:to-violet-400 text-white font-bold tracking-wide shadow-[0_0_30px_rgba(0,228,255,0.4)] hover:shadow-[0_0_50px_rgba(0,228,255,0.6)] transition-all duration-300 rounded-xl"
                  >
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                    />
                    <span className="relative flex items-center gap-2">
                      <Zap size={18} />
                      INITIATE VERIFICATION
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight size={18} />
                      </motion.span>
                    </span>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Benefits grid with stagger */}
              <motion.div
                variants={containerVariants}
                className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
              >
                {benefits.map((benefit, idx) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={idx}
                      variants={idx % 2 === 0 ? slideLeftVariants : slideRightVariants}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="flex items-center gap-3 text-white font-medium p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 hover:bg-white/10 transition-all cursor-default"
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center"
                      >
                        <Icon className="w-4 h-4 text-cyan-400" style={{ filter: 'drop-shadow(0 0 6px rgba(0,228,255,0.6))' }} />
                      </motion.div>
                      <span className="text-sm tracking-wide">{benefit.text}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}