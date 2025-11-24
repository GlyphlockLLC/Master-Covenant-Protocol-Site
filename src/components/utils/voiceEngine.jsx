/**
 * GlyphLock Universal Voice Engine
 * Routes to different TTS providers with advanced audio processing
 */

import { base44 } from '@/api/base44Client';

/**
 * Main voice generation router
 */
export async function generateVoice(provider, text, opts = {}) {
  const cleanText = text.replace(/[#*`🦕💠]/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (!cleanText) {
    throw new Error('No text to speak');
  }

  switch (provider) {
    case 'google':
      return await googleTTS(cleanText, opts);
    case 'microsoft':
      return await azureTTS(cleanText, opts);
    case 'elevenlabs':
      return await elevenLabsTTS(cleanText, opts);
    case 'openai':
      return await openaiTTS(cleanText, opts);
    case 'coqui':
      return await coquiLocalTTS(cleanText, opts);
    case 'streamelements':
    default:
      return await streamElementsTTS(cleanText, opts);
  }
}

/**
 * Google Cloud TTS
 */
async function googleTTS(text, opts) {
  try {
    const response = await base44.functions.invoke('textToSpeechAdvanced', {
      text,
      provider: 'google',
      voice: opts.voice || 'en-US-Neural2-A',
      speed: opts.speed || 1.0,
      pitch: opts.pitch || 1.0
    });

    return response.data?.audioUrl || null;
  } catch (error) {
    console.error('Google TTS error:', error);
    throw error;
  }
}

/**
 * Microsoft Azure TTS
 */
async function azureTTS(text, opts) {
  try {
    const response = await base44.functions.invoke('textToSpeechAdvanced', {
      text,
      provider: 'microsoft',
      voice: opts.voice || 'en-US-JennyNeural',
      speed: opts.speed || 1.0,
      pitch: opts.pitch || 1.0
    });

    return response.data?.audioUrl || null;
  } catch (error) {
    console.error('Azure TTS error:', error);
    throw error;
  }
}

/**
 * ElevenLabs TTS (Celebrity Voices)
 */
async function elevenLabsTTS(text, opts) {
  try {
    const response = await base44.functions.invoke('textToSpeechAdvanced', {
      text,
      provider: 'elevenlabs',
      voice: opts.voice || 'Rachel',
      speed: opts.speed || 1.0,
      pitch: opts.pitch || 1.0,
      stability: opts.stability || 0.5,
      similarity: opts.similarity || 0.75,
      style: opts.style || 0.0,
      useSpeakerBoost: opts.useSpeakerBoost !== false
    });

    return response.data?.audioUrl || null;
  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    throw error;
  }
}

/**
 * OpenAI TTS
 */
async function openaiTTS(text, opts) {
  try {
    const response = await base44.functions.invoke('textToSpeechAdvanced', {
      text,
      provider: 'openai',
      voice: opts.voice || 'alloy',
      speed: opts.speed || 1.0
    });

    return response.data?.audioUrl || null;
  } catch (error) {
    console.error('OpenAI TTS error:', error);
    throw error;
  }
}

/**
 * Coqui Local TTS (Open Source)
 */
async function coquiLocalTTS(text, opts) {
  try {
    const response = await base44.functions.invoke('coquiTTS', {
      text,
      voice: opts.voice || 'default',
      speed: opts.speed || 1.0,
      pitch: opts.pitch || 1.0
    });

    return response.data?.audioUrl || null;
  } catch (error) {
    console.error('Coqui TTS error:', error);
    // Fallback to StreamElements
    return await streamElementsTTS(text, opts);
  }
}

/**
 * StreamElements TTS (Free Fallback)
 */
async function streamElementsTTS(text, opts) {
  const voice = opts.voice || 'Joanna';
  return `https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=${encodeURIComponent(text)}`;
}

/**
 * Apply audio processing effects
 */
export function applyAudioEffects(audioElement, effects = {}) {
  if (!audioElement || !window.AudioContext) return;

  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(audioElement);
    
    // Bass boost
    if (effects.bass) {
      const bassBoost = audioContext.createBiquadFilter();
      bassBoost.type = 'lowshelf';
      bassBoost.frequency.value = 200;
      bassBoost.gain.value = effects.bass;
      source.connect(bassBoost);
      bassBoost.connect(audioContext.destination);
    }
    
    // Treble boost
    if (effects.treble) {
      const trebleBoost = audioContext.createBiquadFilter();
      trebleBoost.type = 'highshelf';
      trebleBoost.frequency.value = 3000;
      trebleBoost.gain.value = effects.treble;
      source.connect(trebleBoost);
      trebleBoost.connect(audioContext.destination);
    }
    
    // Mid range
    if (effects.mid) {
      const midBoost = audioContext.createBiquadFilter();
      midBoost.type = 'peaking';
      midBoost.frequency.value = 1000;
      midBoost.Q.value = 1;
      midBoost.gain.value = effects.mid;
      source.connect(midBoost);
      midBoost.connect(audioContext.destination);
    }
    
    // Delay/Echo
    if (effects.delay) {
      const delay = audioContext.createDelay();
      delay.delayTime.value = effects.delay;
      const feedback = audioContext.createGain();
      feedback.gain.value = 0.5;
      source.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(audioContext.destination);
    }
    
    source.connect(audioContext.destination);
  } catch (error) {
    console.error('Audio effects error:', error);
  }
}

export default {
  generateVoice,
  applyAudioEffects
};