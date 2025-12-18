import { useRef } from "react";
import { useInView } from "framer-motion";

// Reusable scroll animation hook with dramatic timing
export function useScrollAnimation(options = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    amount: options.amount || 0.4,
    ...options 
  });
  
  return { ref, isInView };
}

// Animation presets for consistent dramatic effects
export const animations = {
  // Slide from left - titles
  slideLeft: {
    initial: { opacity: 0, x: -100 },
    animate: (isInView) => isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 },
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
  },
  
  // Slide from right - subtitles
  slideRight: {
    initial: { opacity: 0, x: 100 },
    animate: (isInView) => isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 },
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
  },
  
  // Fade up - general content
  fadeUp: {
    initial: { opacity: 0, y: 60 },
    animate: (isInView) => isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 },
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  },
  
  // Scale pop - badges and icons
  scalePop: {
    initial: { opacity: 0, scale: 0.7, y: 30 },
    animate: (isInView) => isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.7, y: 30 },
    transition: { duration: 0.9, type: "spring", stiffness: 120, damping: 14 }
  },
  
  // Staggered cards
  staggerCard: (index) => ({
    initial: { opacity: 0, y: 60, scale: 0.85 },
    animate: (isInView) => isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.85 },
    transition: { 
      duration: 1, 
      delay: 0.15 + (index * 0.12),
      type: "spring",
      stiffness: 100,
      damping: 14
    }
  }),
  
  // Alternating left/right for benefit items
  alternateSlide: (index) => ({
    initial: { opacity: 0, x: index % 2 === 0 ? -80 : 80, scale: 0.9 },
    animate: (isInView) => isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: index % 2 === 0 ? -80 : 80, scale: 0.9 },
    transition: { 
      duration: 1, 
      delay: 0.3 + (index * 0.12), 
      ease: [0.16, 1, 0.3, 1] 
    }
  }),
  
  // Hero entrance - dramatic
  heroEntrance: {
    initial: { opacity: 0, y: 80, scale: 0.9 },
    animate: (isInView) => isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 80, scale: 0.9 },
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  },
  
  // CTA section entrance
  ctaEntrance: {
    initial: { opacity: 0, y: 70, scale: 0.92 },
    animate: (isInView) => isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 70, scale: 0.92 },
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
  }
};

// Helper to get animation props
export function getAnimationProps(preset, isInView, index = 0) {
  if (typeof preset === 'function') {
    const anim = preset(index);
    return {
      initial: anim.initial,
      animate: anim.animate(isInView),
      transition: anim.transition
    };
  }
  
  return {
    initial: preset.initial,
    animate: preset.animate(isInView),
    transition: preset.transition
  };
}