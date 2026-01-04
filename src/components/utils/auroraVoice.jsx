// ✨ AURORA VOICE — v2.1 (Robot-Voice Proof)
// Forces natural-sounding voice. Skips Microsoft David/Zira. No robotic BS.

if (typeof window !== 'undefined') {
  window.GlyphbotJr = (function() {
    const AURORA_CONFIG = {
      rate: 0.92,
      pitch: 1.05,
      volume: 1.0,
      lang: 'en-US'
    };

    // List of KNOWN robotic voices to AVOID
    const ROBOTIC_VOICES = [
      'Microsoft David',
      'Microsoft Zira',
      'Microsoft Mark',
      'Microsoft Paul',
      'Microsoft George',
      'Google US English (deprecated)',
      'Generic male',
      'Generic female'
    ];

    function isRobotic(voice) {
      return ROBOTIC_VOICES.some(robot => voice.name.includes(robot));
    }

    function getBestVoice() {
      const voices = speechSynthesis.getVoices() || [];
      
      // 1. PREFER: Google/Wavenet/Neural voices (high quality)
      let best = voices.find(v => 
        v.lang === 'en-US' && 
        v.name.includes('Google') &&
        !v.name.includes('deprecated')
      );
      
      // 2. FALLBACK: Any non-robotic English neural voice
      if (!best) {
        best = voices.find(v => 
          v.lang.startsWith('en') && 
          v.localService && 
          !isRobotic(v)
        );
      }
      
      // 3. LAST RESORT: Any English voice that's NOT Microsoft David/Zira
      if (!best) {
        best = voices.find(v => 
          v.lang.startsWith('en') && 
          !isRobotic(v)
        );
      }
      
      // 4. If only robotic voices exist → stay silent (better than robot BS)
      if (!best || isRobotic(best)) {
        console.warn('Aurora: Only robotic voices available. Skipping TTS.');
        return null;
      }
      
      return best;
    }

    function speak(text) {
      if (!text || typeof text !== 'string') return;
      if (!('speechSynthesis' in window)) return;

      let clean = text.trim().replace(/<[^>]*>/g, '');
      if (clean && !/[.!?…]$/.test(clean)) clean += '.';

      // Force voice load (critical on Chrome)
      speechSynthesis.getVoices();

      const voice = getBestVoice();
      if (!voice) return; // no good voice → stay silent

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = AURORA_CONFIG.rate;
      utterance.pitch = AURORA_CONFIG.pitch;
      utterance.volume = AURORA_CONFIG.volume;
      utterance.lang = AURORA_CONFIG.lang;
      utterance.voice = voice;

      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
      
      console.log('Aurora speaking with:', voice.name);
    }

    // Auto-bind to listen buttons - only attach once
    if (!window.__aurora_listener_attached) {
      document.addEventListener('click', (e) => {
        // Handle button or icon inside button
        const target = e.target.closest('[data-glyphbot-jr-listen]');
        if (target) {
          const text = target.getAttribute('data-text') || 
                       target.closest('[data-message]')?.innerText ||
                       // Fallback for React markdown containers
                       target.parentElement?.innerText?.replace('Listen', '').trim() || 
                       'Hello. How can I help?';
          speak(text);
        }
      });
      window.__aurora_listener_attached = true;
    }

    // Load voices on init (async-safe)
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.addEventListener('voiceschanged', () => {
        // Voices loaded — ready for next speak()
      });
    }

    return { speak, getBestVoice };
  })();
}

export const speak = (text) => {
  if (typeof window !== 'undefined' && window.GlyphbotJr) {
    window.GlyphbotJr.speak(text);
  }
};

export default { speak };