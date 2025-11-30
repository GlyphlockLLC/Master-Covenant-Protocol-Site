import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';

const SEVERITY_CONFIG = {
  low: {
    color: 'from-emerald-500 to-green-400',
    glow: 'rgba(16, 185, 129, 0.6)',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/50',
    text: 'text-emerald-400',
    label: 'LOW RISK',
    icon: Shield,
    pulseSpeed: 3
  },
  moderate: {
    color: 'from-yellow-500 to-amber-400',
    glow: 'rgba(245, 158, 11, 0.6)',
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/50',
    text: 'text-yellow-400',
    label: 'MODERATE',
    icon: AlertTriangle,
    pulseSpeed: 2
  },
  high: {
    color: 'from-orange-500 to-red-400',
    glow: 'rgba(249, 115, 22, 0.6)',
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/50',
    text: 'text-orange-400',
    label: 'HIGH RISK',
    icon: AlertCircle,
    pulseSpeed: 1.5
  },
  critical: {
    color: 'from-red-600 to-rose-500',
    glow: 'rgba(220, 38, 38, 0.8)',
    bg: 'bg-red-500/20',
    border: 'border-red-500/50',
    text: 'text-red-400',
    label: 'CRITICAL',
    icon: XCircle,
    pulseSpeed: 0.8
  }
};

export default function GlyphAuditSeverity({ severity = 'low', riskScore = 0 }) {
  const normalizedSeverity = severity?.toLowerCase() || 'low';
  const config = SEVERITY_CONFIG[normalizedSeverity] || SEVERITY_CONFIG.low;
  const IconComponent = config.icon;

  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <motion.div
        className={`w-3 h-24 rounded-full bg-gradient-to-b ${config.color} relative overflow-hidden`}
        style={{ boxShadow: `0 0 20px ${config.glow}` }}
        animate={{
          boxShadow: [
            `0 0 10px ${config.glow}`,
            `0 0 30px ${config.glow}`,
            `0 0 10px ${config.glow}`
          ]
        }}
        transition={{
          duration: config.pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <motion.div
          className="absolute inset-0 bg-white/30"
          animate={{ y: ['-100%', '100%'] }}
          transition={{
            duration: config.pulseSpeed * 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </motion.div>
      
      <motion.div
        className={`p-2 rounded-lg ${config.bg} ${config.border} border`}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{
          duration: config.pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <IconComponent className={`w-5 h-5 ${config.text}`} />
      </motion.div>
      
      <div className="text-center">
        <div className={`text-[10px] font-bold tracking-wider ${config.text}`}>
          {config.label}
        </div>
        <div className="text-[9px] text-slate-500 font-mono">
          SCORE: {riskScore}
        </div>
      </div>
    </div>
  );
}