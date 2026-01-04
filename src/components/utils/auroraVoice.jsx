// ✨ GLYPHBOT JR. — AURORA NEURAL ENGINE (v3.0)
// Server-Side Neural TTS Only. No Browser Fallback.
// Provider: Base44 Neural Engine (via functions)

import { base44 } from "@/api/base44Client";

let currentAudio = null;
let isLoading = false;

export const speak = async (text) => {
  if (typeof window === 'undefined' || !text) return;

  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  // Cancel any browser TTS if it happened to be running (cleanup)
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  try {
    isLoading = true;
    
    // Call the Neural Engine
    // We use raw fetch here to handle the Blob response correctly if the SDK wrapper expects JSON
    // Or we use the SDK if it supports blob. Let's use the SDK but we need to handle the response type.
    // Actually, base44.functions.invoke returns an axios response. We need 'blob'.
    
    // Using direct fetch to ensure we get the blob cleanly
    const { data } = await base44.functions.invoke('generateAuroraAudio', 
      { text }, 
      { responseType: 'blob' } // Important for audio data
    );

    const audioUrl = URL.createObjectURL(data);
    const audio = new Audio(audioUrl);
    
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      currentAudio = null;
      isLoading = false;
    };

    audio.onerror = (e) => {
      console.error("Audio Playback Error:", e);
      isLoading = false;
    };

    currentAudio = audio;
    await audio.play();

  } catch (error) {
    console.error("Aurora Neural Engine Failed:", error);
    isLoading = false;
    // Silent fail as per directive - NO robotic fallback
  }
};

// Helper to check status (for UI spinners if needed)
export const isSpeaking = () => !!currentAudio;
export const isGenerating = () => isLoading;

// Auto-bind listener
if (typeof window !== 'undefined' && !window.__aurora_neural_attached) {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-glyphbot-jr-listen]');
    if (target) {
      const text = target.getAttribute('data-text') || 
                   target.closest('[data-message]')?.innerText ||
                   'Hello.';
      speak(text);
    }
  });
  window.__aurora_neural_attached = true;
}

export default { speak, isSpeaking, isGenerating };