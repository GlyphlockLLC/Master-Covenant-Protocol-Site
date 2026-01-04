/**
 * PageHeader - Unified header with back button, title, and help guidance
 * Use on all interactive/tool pages for consistent UX
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, HelpCircle, X, Lightbulb, Keyboard, 
  AlertCircle, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageHeader({ 
  title, 
  subtitle,
  backTo = 'Home',
  backLabel,
  helpSteps = [],
  shortcuts = [],
  tips = [],
  icon: Icon,
  badge,
  children 
}) {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(createPageUrl(backTo));
    }
  };

  return (
    <>
      {/* Header Bar */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left - Back + Title */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-gray-400 hover:text-white hover:bg-white/10 gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{backLabel || 'Back'}</span>
              </Button>

              <div className="h-6 w-px bg-white/10 hidden sm:block" />

              <div className="flex items-center gap-3">
                {Icon && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                )}
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    {title}
                    {badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {badge}
                      </span>
                    )}
                  </h1>
                  {subtitle && (
                    <p className="text-xs text-gray-400 hidden sm:block">{subtitle}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right - Help + Custom Actions */}
            <div className="flex items-center gap-2">
              {children}
              
              {(helpSteps.length > 0 || shortcuts.length > 0 || tips.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelp(true)}
                  className="text-cyan-400 hover:text-white hover:bg-cyan-500/20 gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Help</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Help Drawer */}
      <AnimatePresence>
        {showHelp && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-950 border-l border-cyan-500/30 z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-cyan-400" />
                    Help & Guidance
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowHelp(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* How To Use */}
                {helpSteps.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      How to Use
                    </h3>
                    <div className="space-y-3">
                      {helpSteps.map((step, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20"
                        >
                          <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{step.title}</p>
                            {step.description && (
                              <p className="text-gray-400 text-xs mt-1">{step.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keyboard Shortcuts */}
                {shortcuts.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Keyboard className="w-4 h-4" />
                      Keyboard Shortcuts
                    </h3>
                    <div className="space-y-2">
                      {shortcuts.map((shortcut, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-purple-500/5 border border-purple-500/20"
                        >
                          <span className="text-gray-300 text-sm">{shortcut.action}</span>
                          <kbd className="px-2 py-1 rounded bg-slate-800 text-purple-300 text-xs font-mono border border-purple-500/30">
                            {shortcut.keys}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                {tips.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Pro Tips
                    </h3>
                    <div className="space-y-2">
                      {tips.map((tip, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20"
                        >
                          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-300 text-sm">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Links */}
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                    Quick Links
                  </h3>
                  <div className="space-y-2">
                    {[
                      { label: 'FAQ', page: 'FAQ' },
                      { label: 'Documentation', page: 'SecurityDocs' },
                      { label: 'Contact Support', page: 'Contact' },
                    ].map((link) => (
                      <Link
                        key={link.page}
                        to={createPageUrl(link.page)}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <span className="text-sm">{link.label}</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}