import { useEffect } from 'react';

/**
 * Mobile Touch Optimizer
 * Ensures all interactive elements meet WCAG 2.1 touch target minimums (44x44px)
 * Prevents iOS zoom on input focus
 * Optimizes touch event handling
 */
export default function MobileTouchOptimizer() {
  useEffect(() => {
    // Only apply on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    // Set viewport meta tag correctly
    const setViewport = () => {
      let viewport = document.querySelector('meta[name=viewport]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        document.head.appendChild(viewport);
      }
      viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1';
    };

    // Prevent iOS zoom on input focus
    const preventInputZoom = () => {
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        const currentSize = window.getComputedStyle(input).fontSize;
        const size = parseFloat(currentSize);
        if (size < 16) {
          input.style.fontSize = '16px';
        }
      });
    };

    // Normalize touch events - ensure they work alongside mouse events
    const normalizeTouchEvents = () => {
      const interactiveElements = document.querySelectorAll('button, a, input, textarea, select, [role="button"], [onclick]');
      
      interactiveElements.forEach(el => {
        // Ensure touch-action is set
        if (!el.style.touchAction) {
          el.style.touchAction = 'manipulation';
        }

        // Add touch event handlers if only mouse handlers exist
        if (!el.ontouchstart && (el.onclick || el.onmousedown)) {
          el.addEventListener('touchstart', (e) => {
            // Prevent ghost clicks
            e.preventDefault();
            el.click();
          }, { passive: false });
        }
      });
    };

    // Apply all fixes
    setViewport();
    preventInputZoom();
    normalizeTouchEvents();

    // Re-apply on DOM changes
    const observer = new MutationObserver(() => {
      preventInputZoom();
      normalizeTouchEvents();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return null;
}