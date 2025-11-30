/**
 * GlyphBot TTS Hook - Natural Voice Edition
 * Uses high-quality browser voices (Google, Microsoft, Apple)
 * 
 * Usage:
 * const { speak, stop, isSpeaking, ttsAvailable } = useTTS();
 * await speak("Hello world");
 */

import { useState, useRef, useCallback, useEffect } from 'react';

export default function useTTS(options = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ttsAvailable, setTtsAvailable] = useState(false);
  const [lastError, setLastError] = useState(null);
  const [voices, setVoices] = useState([]);
  
  const utteranceRef = useRef(null);

  // Default settings
  const defaultSettings = {
    speed: options.speed || 0.95,  // Slightly slower = more natural
    pitch: options.pitch || 1.0,
    volume: options.volume || 1.0,
    preferredVoice: options.voice || null
  };

  // Load voices (they load async in some browsers)
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setTtsAvailable(false);
      return;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setTtsAvailable(true);
        console.log('[TTS] Loaded', availableVoices.length, 'voices');
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Find the best natural-sounding voice
  const getBestVoice = useCallback(() => {
    if (voices.length === 0) return null;

    // Priority order for natural voices (most natural first)
    const preferredVoices = [
      // Google Neural voices (best quality)
      'Google US English',
      'Google UK English Female',
      'Google UK English Male',
      // Microsoft Neural voices (very good)
      'Microsoft Zira',
      'Microsoft David',
      'Microsoft Mark',
      'Microsoft Guy Online',
      'Microsoft Aria Online',
      // Apple voices (macOS/iOS - excellent)
      'Samantha',
      'Alex',
      'Karen',
      'Daniel',
      // Edge/Windows 11 neural
      'Microsoft Jenny',
      'Microsoft Ryan',
      // Fallback quality voices
      'Fiona',
      'Moira',
      'Tessa'
    ];

    // Try to find a preferred voice
    for (const name of preferredVoices) {
      const found = voices.find(v => v.name.includes(name));
      if (found) {
        console.log('[TTS] Using voice:', found.name);
        return found;
      }
    }

    // Fallback: find any English voice that's not "compact" or "enhanced" 
    const englishVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      !v.name.toLowerCase().includes('compact') &&
      (v.name.includes('Google') || v.name.includes('Microsoft') || v.localService === false)
    );

    if (englishVoice) {
      console.log('[TTS] Using fallback voice:', englishVoice.name);
      return englishVoice;
    }

    // Last resort: first English voice
    const anyEnglish = voices.find(v => v.lang.startsWith('en'));
    console.log('[TTS] Using any English voice:', anyEnglish?.name);
    return anyEnglish || voices[0];
  }, [voices]);

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
      .replace(/[#*`🦕💠🦖🌟✨🔒⚡️💡🛡️]/g, '')
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/\[.*?\]/g, '') // Remove markdown links
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 500); // StreamElements limit
    
    if (!cleanText || cleanText.length < 2) return false;

    stop(); // Stop any current playback
    setIsLoading(true);
    setLastError(null);

    const settings = { ...defaultSettings, ...customSettings };

    // PRIMARY: StreamElements (FREE, reliable, no API key)
    try {
      console.log('[TTS] Using StreamElements...');
      const voice = settings.voice || 'Brian'; // Brian is clearer than Matthew
      const seUrl = `https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=${encodeURIComponent(cleanText)}`;
      
      const audio = new Audio();
      audioRef.current = audio;
      
      // Set up event handlers BEFORE setting src
      audio.oncanplaythrough = async () => {
        try {
          setIsLoading(false);
          setIsSpeaking(true);
          await audio.play();
        } catch (playError) {
          console.warn('[TTS] Autoplay blocked:', playError);
          setIsLoading(false);
          setIsSpeaking(false);
        }
      };

      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };

      audio.onerror = (e) => {
        console.warn('[TTS] StreamElements failed:', e);
        setIsSpeaking(false);
        audioRef.current = null;
        // Fallback to browser TTS
        if (settings.useBrowserFallback) {
          speakWithBrowser(cleanText, settings);
        }
      };

      audio.src = seUrl;
      audio.load();
      return true;
      
    } catch (error) {
      console.warn('[TTS] StreamElements error:', error);
    }

    // FALLBACK: Browser Speech Synthesis
    if (settings.useBrowserFallback && 'speechSynthesis' in window) {
      console.log('[TTS] Falling back to browser TTS...');
      setIsLoading(false);
      return speakWithBrowser(cleanText, settings);
    }

    setIsLoading(false);
    setLastError('TTS unavailable');
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