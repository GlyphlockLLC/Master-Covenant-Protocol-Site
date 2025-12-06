/**
 * 🜂 GlyphBot Holder Module
 * Single import point for entire bot system
 * 
 * Usage:
 * import { UI, Logic, Services, Config, Types } from '@/glyphlock/bot';
 */

// Layer exports
export * as Config from './config';
export * as Types from './types';
export * as Services from './services';

// Convenience re-exports for common items
export { PERSONAS, TTS_PROVIDERS, MODEL_OPTIONS, STORAGE_KEYS, LIMITS, WELCOME_MESSAGE } from './config';