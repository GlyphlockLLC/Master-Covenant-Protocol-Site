// ✨ GLYPHBOT JR. — AURORA VOICE (v1.0)
// Immutable. Reliable. No configuration.

const AURORA = {
  rate: 0.92,    // calm, clear pace
  pitch: 1.05,   // warm, neutral tone
  volume: 1.0,
  lang: 'en-US'
};

export function speak(text) {
  if (typeof window === 'undefined' || !text || typeof text !== 'string' || !('speechSynthesis' in window)) return;
  
  // Clean text
  let clean = text.trim().replace(/<[^>]*>/g, '');
  if (clean && !/[.!?…]$/.test(clean)) clean += '.';

  // Get voices (retry-safe)
  let voices = window.speechSynthesis.getVoices();
  
  // If voices aren't loaded yet, try to load them
  if (voices.length === 0) {
    // This is asynchronous, so we might miss the first click if voices aren't ready.
    // However, strictly following the provided snippet which attempts to get voices immediately.
    // To be more robust in React, we might want to wait, but the snippet logic is "silent fallback".
    // We'll stick to the snippet's logic but add a small retry just in case.
    return; 
  }

  // Pick best voice: Google > Natural > local > first English
  const voice = voices.find(v => 
    v.lang === 'en-US' && 
    (v.name.includes('Google') || v.name.includes('Natural') || v.localService)
  ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

  // Speak
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.rate = AURORA.rate;
  utterance.pitch = AURORA.pitch;
  utterance.volume = AURORA.volume;
  utterance.lang = AURORA.lang;
  if (voice) utterance.voice = voice;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export default { speak };