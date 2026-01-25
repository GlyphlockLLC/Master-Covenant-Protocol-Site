import { useEffect } from 'react';

/**
 * Global mobile performance and UX optimizer
 * Auto-applies on all pages
 */
export default function MobileOptimizer() {
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    // 1. Force viewport settings
    let viewport = document.querySelector('meta[name=viewport]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';

    // 2. Fix iOS address bar height bug
    const updateVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    updateVH();
    window.addEventListener('resize', updateVH);
    window.addEventListener('orientationchange', updateVH);

    // 3. Optimize all interactive elements
    const optimizeElements = () => {
      // Cards
      document.querySelectorAll('[class*="card"], .card').forEach(el => {
        if (!el.classList.contains('mobile-optimized')) {
          el.style.minHeight = '80px';
          el.style.padding = Math.max(16, parseInt(getComputedStyle(el).padding) || 16) + 'px';
          el.classList.add('mobile-optimized');
        }
      });

      // Buttons
      document.querySelectorAll('button, [role="button"]').forEach(el => {
        if (!el.classList.contains('mobile-optimized')) {
          const rect = el.getBoundingClientRect();
          if (rect.height < 44 || rect.width < 44) {
            el.style.minHeight = '44px';
            el.style.minWidth = '44px';
            el.style.padding = '12px 16px';
          }
          el.classList.add('mobile-optimized');
        }
      });

      // Inputs
      document.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), textarea, select').forEach(el => {
        if (!el.classList.contains('mobile-optimized')) {
          el.style.minHeight = '48px';
          el.style.fontSize = '16px'; // Prevent iOS zoom
          el.style.padding = '12px 16px';
          el.classList.add('mobile-optimized');
        }
      });
    };

    // Run on load and DOM changes
    optimizeElements();
    const observer = new MutationObserver(() => {
      requestAnimationFrame(optimizeElements);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 4. Add touch feedback to all clickable elements
    document.addEventListener('touchstart', (e) => {
      const target = e.target.closest('button, a, [role="button"], [onclick]');
      if (target) {
        target.style.transition = 'opacity 0.1s, transform 0.1s';
        target.style.opacity = '0.7';
        target.style.transform = 'scale(0.98)';
      }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const target = e.target.closest('button, a, [role="button"], [onclick]');
      if (target) {
        setTimeout(() => {
          target.style.opacity = '';
          target.style.transform = '';
        }, 100);
      }
    }, { passive: true });

    return () => {
      window.removeEventListener('resize', updateVH);
      window.removeEventListener('orientationchange', updateVH);
      observer.disconnect();
    };
  }, []);

  return null;
}