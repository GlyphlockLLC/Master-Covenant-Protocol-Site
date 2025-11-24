/**
 * GlyphLock Image Lab Design System
 * Unified style tokens for premium cosmic aesthetic
 */

export const GlyphImageColors = {
  ultraviolet: {
    primary: '#8C4BFF',
    glow: 'rgba(140, 75, 255, 0.5)',
    dim: 'rgba(140, 75, 255, 0.2)',
  },
  quantum: {
    cyan: '#00E4FF',
    blue: '#0066FF',
    glow: 'rgba(0, 228, 255, 0.5)',
  },
  carbon: {
    black: '#000000',
    darkest: '#0A0F24',
    darker: '#1a0033',
    dark: '#1F2937',
    medium: '#374151',
  },
  alert: {
    danger: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
  },
};

export const GlyphImageTypography = {
  display: {
    xl: 'text-5xl md:text-7xl font-bold tracking-tight',
    lg: 'text-4xl md:text-5xl font-bold tracking-tight',
    md: 'text-3xl md:text-4xl font-bold tracking-tight',
    sm: 'text-2xl md:text-3xl font-bold tracking-tight',
  },
  heading: {
    lg: 'text-2xl font-bold',
    md: 'text-xl font-bold',
    sm: 'text-lg font-semibold',
  },
  body: {
    lg: 'text-lg leading-relaxed',
    md: 'text-base leading-relaxed',
    sm: 'text-sm',
    xs: 'text-xs',
  },
};

export const GlyphImageCard = {
  glass: 'bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl',
  glow: 'bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/10',
  premium: 'bg-gradient-to-br from-black/80 via-purple-950/20 to-black/80 backdrop-blur-xl border border-purple-500/20 rounded-xl shadow-2xl',
  solid: 'bg-gray-900 border border-gray-800 rounded-xl shadow-xl',
};

export const GlyphImageButton = {
  primary: 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50',
  secondary: 'bg-gray-900 border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 font-semibold rounded-lg transition-all duration-300',
  danger: 'bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-red-500/30',
  ghost: 'bg-transparent hover:bg-white/5 text-white/70 hover:text-white transition-all duration-300',
};

export const GlyphImageInput = {
  base: 'bg-black/60 border border-gray-700 focus:border-cyan-500 text-white placeholder:text-gray-500 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-cyan-500/30 shadow-inner',
  glow: 'bg-black/60 border border-purple-500/30 focus:border-cyan-500 text-white placeholder:text-gray-500 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-cyan-500/50 shadow-inner shadow-purple-500/10',
};

export const GlyphImageShadows = {
  neonCyan: 'shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50',
  neonPurple: 'shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50',
  depth: {
    sm: 'shadow-sm',
    md: 'shadow-md shadow-black/50',
    lg: 'shadow-xl shadow-black/60',
    xl: 'shadow-2xl shadow-black/70',
  },
};

export const GlyphImageGradients = {
  primaryText: 'bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent',
  secondaryText: 'bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent',
  cosmicBg: 'bg-gradient-to-br from-black via-purple-950/20 to-black',
};

export const GlyphImageBadge = {
  success: 'bg-green-500/20 text-green-400 border border-green-500/50 rounded-full px-3 py-1 text-xs font-semibold',
  warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded-full px-3 py-1 text-xs font-semibold',
  danger: 'bg-red-500/20 text-red-400 border border-red-500/50 rounded-full px-3 py-1 text-xs font-semibold',
  info: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-full px-3 py-1 text-xs font-semibold',
  premium: 'bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1',
};

export const GlyphImagePanel = {
  primary: 'p-6 space-y-4',
  compact: 'p-4 space-y-3',
  dense: 'p-3 space-y-2',
};