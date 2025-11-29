/**
 * GlyphBot TTS Hook
 * Provides text-to-speech with browser fallback
 * 
 * Usage:
 * const { speak, stop, isSpeaking, ttsAvailable } = useTTS();
 * await speak("Hello world");
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export default function useTTS(options = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ttsAvailable, setTtsAvailable] = useState(true);
  const [lastError, setLastError] = useState(null);
  
  const audioRef = useRef(null);
  const utteranceRef = useRef(null);

  // Default settings
  const defaultSettings = {
    provider: options.provider || 'streamelements',
    voice: options.voice || 'Matthew',
    speed: options.speed || 1.0,
    pitch: options.pitch || 1.0,
    volume: options.volume || 1.0,
    useBrowserFallback: options.useBrowserFallback !== false
  };

  // Check browser TTS availability
  useEffect(() => {
    const browserTTSAvailable = 'speechSynthesis' in window;
    // We consider TTS available if either browser or external works
    setTtsAvailable(browserTTSAvailable || true);
  }, []);

  /**
   * Stop any currently playing audio
   */
  const stop = useCallback(() => {
    // Stop external audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    
    // Stop browser speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  /**
   * Speak text using external TTS with browser fallback
   */
  const speak = useCallback(async (text, customSettings = {}) => {
    if (!text || typeof text !== 'string') return false;
    
    const cleanText = text
      .replace(/[#*`🦕💠🦖🌟✨]/g, '')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (!cleanText) return false;

    stop(); // Stop any current playback
    setIsLoading(true);
    setLastError(null);

    const settings = { ...defaultSettings, ...customSettings };

    // Try 1: External TTS API
    try {
      const response = await base44.functions.invoke('textToSpeechAdvanced', {
        text: cleanText,
        provider: settings.provider,
        voice: settings.voice,
        speed: settings.speed,
        pitch: settings.pitch,
        volume: settings.volume
      });

      const audioUrl = response.data?.audioUrl;
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.playbackRate = settings.speed;
        audio.volume = settings.volume;

        audio.onended = () => {
          setIsSpeaking(false);
          audioRef.current = null;
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          audioRef.current = null;
        };

        setIsLoading(false);
        setIsSpeaking(true);
        await audio.play();
        return true;
      }
    } catch (error) {
      console.warn('External TTS failed:', error);
    }

    // Try 2: StreamElements direct (free fallback)
    try {
      const seUrl = `https://api.streamelements.com/kappa/v2/speech?voice=${settings.voice || 'Matthew'}&text=${encodeURIComponent(cleanText.slice(0, 500))}`;
      const audio = new Audio(seUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        audioRef.current = null;
        // Fall through to browser TTS
        if (settings.useBrowserFallback) {
          speakWithBrowser(cleanText, settings);
        }
      };

      setIsLoading(false);
      setIsSpeaking(true);
      await audio.play();
      return true;
    } catch (error) {
      console.warn('StreamElements TTS failed:', error);
    }

    // Try 3: Browser Speech Synthesis (final fallback)
    if (settings.useBrowserFallback && 'speechSynthesis' in window) {
      return speakWithBrowser(cleanText, settings);
    }

    setIsLoading(false);
    setLastError('All TTS providers failed');
    setTtsAvailable(false);
    return false;
  }, [stop, defaultSettings]);

  /**
   * Browser-native speech synthesis fallback
   */
  const speakWithBrowser = useCallback((text, settings) => {
    try {
      if (!('speechSynthesis' in window)) {
        setLastError('Browser TTS not supported');
        return false;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      
      utterance.rate = settings.speed || 1.0;
      utterance.pitch = settings.pitch || 1.0;
      utterance.volume = settings.volume || 1.0;

      // Try to find a good voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.name.includes('Google') || 
        v.name.includes('Microsoft') ||
        v.lang === 'en-US'
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsLoading(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (e) => {
        console.error('Browser TTS error:', e);
        setIsSpeaking(false);
        setLastError('Browser TTS error');
        utteranceRef.current = null;
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('Browser TTS failed:', error);
      setLastError('Browser TTS failed');
      setIsLoading(false);
      return false;
    }
  }, []);

  /**
   * Test TTS functionality
   */
  const testTTS = useCallback(async () => {
    return speak('Hello! This is a test of the GlyphBot voice system.');
  }, [speak]);

  return {
    speak,
    stop,
    testTTS,
    isSpeaking,
    isLoading,
    ttsAvailable,
    lastError
  };
}