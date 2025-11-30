import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Database, Copy, Check } from 'lucide-react';

const JsonValue = ({ value, depth = 0 }) => {
  if (value === null) return <span className="text-slate-500">null</span>;
  if (value === undefined) return <span className="text-slate-500">undefined</span>;
  if (typeof value === 'boolean') return <span className="text-purple-400">{value.toString()}</span>;
  if (typeof value === 'number') return <span className="text-cyan-400">{value}</span>;
  if (typeof value === 'string') return <span className="text-emerald-400">"{value}"</span>;
  
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-slate-500">[]</span>;
    return (
      <span>
        <span className="text-slate-500">[</span>
        <div className="ml-4">
          {value.map((item, i) => (
            <div key={i} className="flex">
              <JsonValue value={item} depth={depth + 1} />
              {i < value.length - 1 && <span className="text-slate-500">,</span>}
            </div>
          ))}
        </div>
        <span className="text-slate-500">]</span>
      </span>
    );
  }
  
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return <span className="text-slate-500">{'{}'}</span>;
    return (
      <span>
        <span className="text-slate-500">{'{'}</span>
        <div className="ml-4">
          {keys.map((key, i) => (
            <div key={key} className="flex flex-wrap">
              <span className="text-amber-400">"{key}"</span>
              <span className="text-slate-500 mx-1">:</span>
              <JsonValue value={value[key]} depth={depth + 1} />
              {i < keys.length - 1 && <span className="text-slate-500">,</span>}
            </div>
          ))}
        </div>
        <span className="text-slate-500">{'}'}</span>
      </span>
    );
  }
  
  return <span className="text-slate-400">{String(value)}</span>;
};

export default function GlyphAuditJSONPanel({ auditJson }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!auditJson) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(auditJson, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="mt-3">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-t-xl bg-slate-950 border border-cyan-500/30 hover:border-cyan-400/50 transition-colors"
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Database className="w-4 h-4 text-cyan-400" />
          </motion.div>
          <span className="text-xs font-bold tracking-widest text-cyan-300 uppercase">
            Deep System Trace
          </span>
          <span className="px-2 py-0.5 text-[10px] bg-cyan-500/20 text-cyan-400 rounded font-mono">
            JSON
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3 text-slate-400" />
            )}
          </motion.button>
          
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-cyan-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-cyan-400" />
          )}
        </div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div
              className="relative px-4 py-4 bg-slate-950/95 border-x border-b border-cyan-500/30 rounded-b-xl overflow-x-auto"
              style={{
                background: 'linear-gradient(135deg, rgba(2, 6, 23, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)'
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at top left, rgba(0, 228, 255, 0.03) 0%, transparent 50%)'
                }}
              />
              
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              
              <div className="relative font-mono text-xs leading-relaxed max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
                <JsonValue value={auditJson} />
              </div>
              
              <div className="absolute bottom-2 right-3 flex items-center gap-1.5 opacity-50">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[9px] text-cyan-400/70 font-mono tracking-wider">TRACE COMPLETE</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}