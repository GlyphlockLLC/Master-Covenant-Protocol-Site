/**
 * Global Scroll Animation System
 * Apply these classes to any element for scroll-triggered animations
 * Uses Intersection Observer for performance
 */

import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

// Slide from left with blur
export function SlideFromLeft({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -100, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Slide from right with blur
export function SlideFromRight({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 100, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Pop up with scale and glow
export function PopUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.8 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.6, 
        delay, 
        type: "spring", 
        stiffness: 150,
        damping: 15 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Fade up with stagger support
export function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Scale reveal with blur
export function ScaleReveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
      animate={isInView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Rotate in from side
export function RotateIn({ children, delay = 0, direction = "left", className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const rotateStart = direction === "left" ? -15 : 15;
  const xStart = direction === "left" ? -50 : 50;
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: xStart, rotate: rotateStart }}
      animate={isInView ? { opacity: 1, x: 0, rotate: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger container for children
export function StaggerContainer({ children, staggerDelay = 0.1, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger item (use inside StaggerContainer)
export function StaggerItem({ children, className = "" }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
        visible: { 
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)",
          transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Flip card reveal
export function FlipReveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, rotateY: 90, transformPerspective: 1000 }}
      animate={isInView ? { opacity: 1, rotateY: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Bounce in
export function BounceIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.3, y: 100 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 200,
        damping: 12
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Glow pulse reveal
export function GlowReveal({ children, delay = 0, glowColor = "rgba(59,130,246,0.5)", className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { 
        opacity: 1, 
        scale: 1,
        boxShadow: [
          `0 0 0px ${glowColor}`,
          `0 0 40px ${glowColor}`,
          `0 0 20px ${glowColor}`
        ]
      } : {}}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Text reveal character by character
export function TextReveal({ text, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const characters = text.split("");
  
  return (
    <motion.span ref={ref} className={className}>
      {characters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: delay + i * 0.03 }}
          style={{ display: 'inline-block' }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Counter animation
export function CounterReveal({ value, duration = 2, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const controls = useAnimation();
  const [displayValue, setDisplayValue] = React.useState(0);
  
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value);
      const incrementTime = (duration * 1000) / end;
      const timer = setInterval(() => {
        start += 1;
        setDisplayValue(start);
        if (start >= end) clearInterval(timer);
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);
  
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {displayValue}
    </motion.span>
  );
}

// Parallax scroll effect
export function ParallaxScroll({ children, speed = 0.5, className = "" }) {
  const ref = useRef(null);
  const [offset, setOffset] = React.useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.innerHeight - rect.top;
        setOffset(scrolled * speed * 0.1);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);
  
  return (
    <motion.div
      ref={ref}
      style={{ transform: `translateY(${offset}px)` }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default {
  SlideFromLeft,
  SlideFromRight,
  PopUp,
  FadeUp,
  ScaleReveal,
  RotateIn,
  StaggerContainer,
  StaggerItem,
  FlipReveal,
  BounceIn,
  GlowReveal,
  TextReveal,
  CounterReveal,
  ParallaxScroll
};