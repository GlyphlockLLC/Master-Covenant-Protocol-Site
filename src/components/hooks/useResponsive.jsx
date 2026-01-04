import { useState, useEffect } from 'react';

/**
 * useResponsive Hook
 * Provides real-time device detection and responsive breakpoints
 */
export function useResponsive() {
  const [state, setState] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    orientation: 'landscape',
    breakpoint: 'lg',
    isTouchDevice: false,
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const userAgent = navigator.userAgent;
      const isMobileUA = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

      // Breakpoints matching Tailwind
      const isMobile = width < 768 || isMobileUA;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      let breakpoint = 'xs';
      if (width >= 640) breakpoint = 'sm';
      if (width >= 768) breakpoint = 'md';
      if (width >= 1024) breakpoint = 'lg';
      if (width >= 1280) breakpoint = 'xl';
      if (width >= 1536) breakpoint = '2xl';

      setState({
        isMobile,
        isTablet,
        isDesktop,
        width,
        height,
        orientation: width > height ? 'landscape' : 'portrait',
        breakpoint,
        isTouchDevice,
      });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return state;
}

/**
 * useMobileDetect - Simple mobile detection
 */
export function useMobileDetect() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
}

export default useResponsive;