import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Check, X } from 'lucide-react';
import { GlyphImageButton, GlyphImageCard, GlyphImageTypography } from './design/GlyphImageDesignSystem';

const TOUR_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Image Lab',
    content: 'Create stunning AI art, secure it with steganography, and make it interactive with hotspots.',
    target: null, // Centered modal
  },
  {
    id: 'generate',
    title: 'Generate',
    content: 'Start here. Describe your vision, choose a style, and let our AI engine create it.',
    target: '[data-tour="generate-tab"]',
    position: 'bottom'
  },
  {
    id: 'interactive',
    title: 'Interactive',
    content: 'Add clickable hotspots to your images to link products, info, or other media.',
    target: '[data-tour="interactive-tab"]',
    position: 'bottom'
  },
  {
    id: 'gallery',
    title: 'Gallery',
    content: 'Manage your creations and secured assets in your personal vault.',
    target: '[data-tour="gallery-tab"]',
    position: 'bottom'
  },
  {
    id: 'shortcuts',
    title: 'Pro Tip: Shortcuts',
    content: 'Use Cmd/Ctrl + G to generate instantly, and Cmd/Ctrl + 1-3 to switch tabs.',
    target: null,
  }
];

export default function OnboardingTour({ isOpen, onComplete, onSkip }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [position, setPosition] = useState(null);

  const currentStep = TOUR_STEPS[currentStepIndex];

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (currentStep.target) {
        const element = document.querySelector(currentStep.target);
        if (element) {
          const rect = element.getBoundingClientRect();
          setPosition({
            top: rect.bottom + 16,
            left: rect.left + rect.width / 2,
            width: rect.width
          });
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
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] pointer-events-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-auto"
          onClick={onSkip}
        />

        {/* Highlight Spotlight (optional enhancement, skipping for simplicity/performance or implementing simple highlight) */}
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
          <div className={`${GlyphImageCard.premium} border-cyan-500/30 shadow-2xl relative overflow-hidden`}>
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 h-1 bg-gray-800 w-full">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                initial={{ width: `${((currentStepIndex) / TOUR_STEPS.length) * 100}%` }}
                animate={{ width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
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
                  {currentStepIndex + 1} / {TOUR_STEPS.length}
                </span>
                
                <Button 
                  onClick={handleNext}
                  className={`${GlyphImageButton.primary} h-9 px-4 text-sm`}
                >
                  {currentStepIndex === TOUR_STEPS.length - 1 ? (
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