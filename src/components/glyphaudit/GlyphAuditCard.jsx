import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Fingerprint } from 'lucide-react';
import GlyphAuditGrid from './GlyphAuditGrid';
import GlyphAuditHoloScan from './GlyphAuditHoloScan';
import GlyphAuditSeverity from './GlyphAuditSeverity';
import GlyphAuditJSONPanel from './GlyphAuditJSONPanel';

export default function GlyphAuditCard({ audit }) {
  if (!audit) return null;

  const { json: auditJson, report } = audit;
  const severity = auditJson?.severity || 'low';
  const riskScore = auditJson?.risk_score || 0;
  const subject = auditJson?.subject || 'Unknown Subject';
  const auditType = auditJson?.type || 'general';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.005 }}
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(2, 6, 23, 0.98) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(2, 6, 23, 0.98) 100%)'
      }}
    >
      <div className="absolute inset-0 rounded-2xl border border-cyan-500/30" />
      <div className="absolute inset-[1px] rounded-2xl border border-cyan-400/10" />
      
      <GlyphAuditGrid />
      <GlyphAuditHoloScan active={true} />
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      
      <div className="relative z-20 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30"
              animate={{ 
                boxShadow: [
                  '0 0 10px rgba(0, 228, 255, 0.2)',
                  '0 0 20px rgba(0, 228, 255, 0.4)',
                  '0 0 10px rgba(0, 228, 255, 0.2)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield className="w-5 h-5 text-cyan-400" />
            </motion.div>
            
            <div>
              <h3 className="text-sm font-bold tracking-widest text-cyan-300 uppercase flex items-center gap-2">
                GlyphLock Audit Engine
                <motion.span
                  className="w-2 h-2 rounded-full bg-cyan-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                  {auditType}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {subject}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/50">
              <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[10px] text-slate-400 font-mono tracking-wider">VERIFIED</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            {report && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative p-4 rounded-xl bg-slate-900/50 border border-slate-700/50"
              >
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] text-emerald-400/70 font-mono tracking-wider">LIVE</span>
                </div>
                
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap pr-16">
                  {report}
                </div>
              </motion.div>
            )}
            
            <GlyphAuditJSONPanel auditJson={auditJson} />
          </div>
          
          <div className="hidden sm:block">
            <GlyphAuditSeverity severity={severity} riskScore={riskScore} />
          </div>
        </div>
        
        <div className="sm:hidden mt-4 flex justify-center">
          <GlyphAuditSeverity severity={severity} riskScore={riskScore} />
        </div>
        
        <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[9px] text-slate-600 font-mono tracking-wider">
              GLYPHLOCK SECURITY v4.0
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-600 font-mono">
              {new Date().toISOString().slice(0, 19).replace('T', ' ')}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}