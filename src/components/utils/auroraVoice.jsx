// ✨ GLYPHBOT JR. — AURORA NEURAL ENGINE (Base44 Native)
// Platform: Wix Neural Engine 2025 via Base44
// Security: Gesture-gated, no PII logging, CDN-delivered audio

import { base44 } from "@/api/base44Client";

let currentAudio = null;
let isLoading = false;

/**
 * Speak text using Base44 Neural Engine (Aurora persona)
 * @param {string} text - Text to convert to speech
 */
export const speak = async (text) => {
  if (typeof window === 'undefined' || !text) return;

  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  try {
    isLoading = true;
    
    // Call Base44 Neural TTS via backend
    const response = await base44.functions.invoke('generateAuroraAudio', 
      { text },
      { responseType: 'blob' }
    );

    // Create audio URL from blob
    const audioUrl = URL.createObjectURL(response.data);
    const audio = new Audio(audioUrl);
    
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      currentAudio = null;
      isLoading = false;
    };

    audio.onerror = (e) => {
      console.error('[Aurora] Playback failed:', e);
      isLoading = false;
      currentAudio = null;
    };

    currentAudio = audio;
    await audio.play();

  } catch (error) {
    console.error('[Aurora] Neural TTS failed:', error);
    isLoading = false;
    // Silent fail — no browser TTS fallback (per directive)
  }
};

/**
 * Check if Aurora is currently speaking
 */
export const isSpeaking = () => !!currentAudio && !currentAudio.paused;

/**
 * Check if audio is generating
 */
export const isGenerating = () => isLoading;

/**
 * Stop current speech
 */
export const stopSpeech = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  isLoading = false;
};

export default { speak, isSpeaking, isGenerating, stopSpeech };