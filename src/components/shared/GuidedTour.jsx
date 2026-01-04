import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Check, X } from 'lucide-react';
import { GlyphImageButton, GlyphImageCard, GlyphImageTypography } from '@/components/imageLab/design/GlyphImageDesignSystem';

export default function GuidedTour({ isOpen, onComplete, onSkip, steps }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [position, setPosition] = useState(null);

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (!isOpen || !currentStep) return;

    const updatePosition = () => {
      if (currentStep.target) {
        const element = document.querySelector(currentStep.target);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Simple logic: position below if possible, otherwise default behavior or improve later
          // For now, mirroring original logic which seemed to try to position near element
          setPosition({
            top: rect.bottom + 16,
            left: rect.left + rect.width / 2,
            width: rect.width
          });
        } else {
            // If target not found, fallback to center
            setPosition(null);
        }
      } else {
        setPosition(null); // Center
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    // Wait for DOM to settle
    const timer = setTimeout(updatePosition, 100);

    return () => {
      window.removeEventListener('resize', updatePosition);
      clearTimeout(timer);
    };
  }, [currentStepIndex, isOpen, currentStep]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  if (!isOpen || !currentStep) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-auto"
          onClick={onSkip}
        />

        {/* Highlight Spotlight */}
        {position && (
          <motion.div
            layoutId="tour-spotlight"
            className="absolute border-2 border-cyan-400 rounded-lg shadow-[0_0_30px_rgba(34,211,238,0.5)] pointer-events-none transition-all duration-300"
            style={{
              top: document.querySelector(currentStep.target)?.getBoundingClientRect().top - 4,
              left: document.querySelector(currentStep.target)?.getBoundingClientRect().left - 4,
              width: (document.querySelector(currentStep.target)?.getBoundingClientRect().width || 0) + 8,
              height: (document.querySelector(currentStep.target)?.getBoundingClientRect().height || 0) + 8,
            }}
          />
        )}

        {/* Card */}
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute pointer-events-auto"
          style={
            position 
              ? { 
                  top: position.top, 
                  left: position.left,
                  transform: 'translateX(-50%)',
                  maxWidth: '320px',
                  width: '100%'
                } 
              : {
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  maxWidth: '400px',
                  width: '90%'
                }
          }
        >
          <div className={`${GlyphImageCard.premium} border-cyan-500/30 shadow-2xl relative overflow-hidden bg-slate-900`}>
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 h-1 bg-gray-800 w-full">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                initial={{ width: `${((currentStepIndex) / steps.length) * 100}%` }}
                animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className={`${GlyphImageTypography.heading.md} text-white`}>
                  {currentStep.title}
                </h3>
                <button onClick={onSkip} className="text-gray-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                {currentStep.content}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-mono">
                  {currentStepIndex + 1} / {steps.length}
                </span>
                
                <Button 
                  onClick={handleNext}
                  className={`${GlyphImageButton.primary} h-9 px-4 text-sm`}
                >
                  {currentStepIndex === steps.length - 1 ? (
                    <>Get Started <Check className="w-3 h-3 ml-2" /></>
                  ) : (
                    <>Next <ChevronRight className="w-3 h-3 ml-2" /></>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}