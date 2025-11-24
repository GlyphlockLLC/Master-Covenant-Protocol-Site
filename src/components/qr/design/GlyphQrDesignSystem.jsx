/**
 * GlyphLock QR Studio Design System
 * Premium cybersecurity aesthetic tokens and utilities
 */

export const GlyphColors = {
  // Primary Palette
  ultraviolet: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
  quantumBlue: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
  },
  nebulaGlow: '#00E4FF',
  carbonBlack: '#000000',
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
};

export const GlyphGradients = {
  primary: 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600',
  primaryText: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent',
  secondary: 'bg-gradient-to-br from-violet-600 to-indigo-900',
  danger: 'bg-gradient-to-r from-red-500 to-pink-600',
  success: 'bg-gradient-to-r from-green-400 to-emerald-600',
  dark: 'bg-gradient-to-br from-gray-900 via-slate-900 to-black',
  cosmic: 'bg-gradient-to-br from-purple-900 via-blue-900 to-black',
};

export const GlyphShadows = {
  neonCyan: 'shadow-[0_0_20px_rgba(6,182,212,0.5),0_0_40px_rgba(6,182,212,0.3)]',
  neonPurple: 'shadow-[0_0_20px_rgba(139,92,246,0.5),0_0_40px_rgba(139,92,246,0.3)]',
  neonViolet: 'shadow-[0_0_20px_rgba(168,85,247,0.5),0_0_40px_rgba(168,85,247,0.3)]',
  glowCyan: 'shadow-[0_0_10px_rgba(6,182,212,0.3),0_0_20px_rgba(6,182,212,0.2),0_0_30px_rgba(6,182,212,0.1)]',
  glowPurple: 'shadow-[0_0_10px_rgba(168,85,247,0.3),0_0_20px_rgba(168,85,247,0.2),0_0_30px_rgba(168,85,247,0.1)]',
  depth: {
    sm: 'shadow-lg shadow-black/50',
    md: 'shadow-xl shadow-black/60',
    lg: 'shadow-2xl shadow-black/70',
  },
};

export const GlyphTypography = {
  display: {
    xl: 'text-5xl lg:text-6xl font-black tracking-tight',
    lg: 'text-4xl lg:text-5xl font-bold tracking-tight',
    md: 'text-3xl lg:text-4xl font-bold tracking-tight',
    sm: 'text-2xl lg:text-3xl font-bold tracking-tight',
  },
  heading: {
    xl: 'text-2xl lg:text-3xl font-bold',
    lg: 'text-xl lg:text-2xl font-bold',
    md: 'text-lg lg:text-xl font-semibold',
    sm: 'text-base lg:text-lg font-semibold',
  },
  body: {
    lg: 'text-base lg:text-lg',
    md: 'text-sm lg:text-base',
    sm: 'text-xs lg:text-sm',
  },
};

export const GlyphCard = {
  base: 'bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl',
  glass: 'bg-black/80 backdrop-blur-xl border border-gray-800/50 rounded-xl',
  glow: 'bg-gray-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)]',
  premium: 'bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-purple-500/20 rounded-xl shadow-2xl',
};

export const GlyphButton = {
  primary: 'px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold transition-all shadow-lg hover:shadow-cyan-500/50 min-h-[44px] flex items-center justify-center',
  secondary: 'px-6 py-3 rounded-xl border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-semibold transition-all min-h-[44px] flex items-center justify-center',
  danger: 'px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-semibold transition-all shadow-lg hover:shadow-red-500/50 min-h-[44px] flex items-center justify-center',
  ghost: 'px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 font-semibold transition-all min-h-[44px] flex items-center justify-center',
};

export const GlyphPanel = {
  section: 'space-y-6 p-6 lg:p-8 bg-gray-900/30 rounded-xl border border-gray-800/50',
  header: 'border-b border-gray-800 pb-4 mb-6',
  grid: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  gridFull: 'grid grid-cols-1 gap-6',
};

export const GlyphInput = {
  base: 'w-full min-h-[48px] px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all',
  glow: 'w-full min-h-[48px] px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all',
};

export const GlyphBreakpoints = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
};

export const GlyphSpacing = {
  container: 'px-4 sm:px-6 lg:px-8 py-6 lg:py-8',
  section: 'py-12 lg:py-16',
  card: 'p-4 sm:p-6 lg:p-8',
  tight: 'p-3 sm:p-4',
};

export const GlyphAnimations = {
  fadeIn: 'animate-in fade-in duration-500',
  slideUp: 'animate-in slide-in-from-bottom-4 duration-500',
  scaleIn: 'animate-in zoom-in-95 duration-300',
  pulse: 'animate-pulse',
};

// Utility function for combining classes
export const cn = (...classes) => classes.filter(Boolean).join(' ');