/**
 * GlyphBot TTS Client - Phase 7.1
 * Handles OpenAI TTS API communication via backend proxy
 */

import { base44 } from '@/api/base44Client';

/**
 * Synthesize speech using OpenAI TTS via backend function
 * @param {string} text - Text to synthesize
 * @param {Object} settings - TTS settings (voice, speed, emotion)
 * @returns {Promise<ArrayBuffer>} Audio data
 */
export async function synthesizeTTS(text, settings = {}) {
  if (!text || typeof text !== 'string') {
    throw new Error('[TTS Client] Invalid text provided');
  }

  // Extract settings
  const voice = settings.voice || 'alloy';
  const speed = Math.max(0.25, Math.min(4.0, settings.speed || 1.0));
  const emotion = settings.emotion || 'neutral';

  console.log('[TTS Client] Synthesizing:', { voice, speed, emotion, textLength: text.length });

  try {
    // Call backend function that uses OpenAI TTS
    const response = await base44.functions.invoke('textToSpeechAdvanced', {
      text,
      provider: 'openai',
      voice,
      speed
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.error || 'TTS service failed');
    }

    // Backend returns audioUrl, fetch it and return as ArrayBuffer
    const audioUrl = response.data.audioUrl;
    if (!audioUrl) {
      throw new Error('No audio URL received from TTS service');
    }

    console.log('[TTS Client] Fetching audio from:', audioUrl);

    // Fetch the audio file
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      throw new Error(`Failed to fetch audio: ${audioResponse.status}`);
    }

    const audioData = await audioResponse.arrayBuffer();
    console.log('[TTS Client] Audio fetched successfully:', audioData.byteLength, 'bytes');
    
    return audioData;

  } catch (error) {
    console.error('[TTS Client] Synthesis failed:', error);
    throw new Error(`TTS synthesis failed: ${error.message}`);
  }
}

/**
 * Test if TTS backend is available
 * @returns {Promise<boolean>}
 */
export async function testTTSAvailability() {
  try {
    await synthesizeTTS('Test', { voice: 'nova', speed: 1.0 });
    return true;
  } catch (error) {
    console.warn('[TTS Client] TTS backend not available:', error.message);
    return false;
  }
}