
export const VOICE_PROFILES = {
  // 🎙️ UNIFIED VOICE SYSTEM - All bots use same voice
  // DEFAULT: echo (warm, conversational, human-like)
  
  // Google Cloud Neural2 Premium Voices
  aurora: { id: 'aurora', label: '✨ Aurora (Warm Female)', voice: 'aurora', description: 'Expressive, warm, premium quality' },
  nova: { id: 'neutral_female', label: '💎 Nova (Professional Female)', voice: 'nova', description: 'Clear, balanced, professional' },
  shimmer: { id: 'warm_female', label: '🌟 Shimmer (Friendly Female)', voice: 'shimmer', description: 'Energetic, dynamic, engaging' },
  onyx: { id: 'neutral_male', label: '🎭 Onyx (Deep Male)', voice: 'onyx', description: 'Authoritative, confident, commanding' },
  echo: { id: 'warm_male', label: '🎙️ Echo (Conversational Male - DEFAULT)', voice: 'echo', description: '👈 RECOMMENDED: Warm, engaging, human-like, conversational' },
  fable: { id: 'professional_male', label: '📖 Fable (Storyteller)', voice: 'fable', description: 'Expressive, narrative, engaging' },
  
  // Legacy mappings (kept for compatibility)
  neutral_female: { id: 'neutral_female', label: '💎 Nova (Clear Female)', voice: 'nova', description: 'Professional, balanced' },
  neutral_male: { id: 'neutral_male', label: '🎙️ Onyx (Deep Male)', voice: 'onyx', description: 'Authoritative, confident' },
  warm_female: { id: 'warm_female', label: '✨ Shimmer (Friendly Female)', voice: 'shimmer', description: 'Energetic, dynamic' },
  warm_male: { id: 'warm_male', label: '🔊 Echo (Smooth Male)', voice: 'echo', description: 'Conversational, engaging' },
  professional_female: { id: 'professional_female', label: '🌟 Aurora (Premium Female)', voice: 'aurora', description: 'Best quality' },
  professional_male: { id: 'professional_male', label: '📖 Fable (Storyteller)', voice: 'fable', description: 'Expressive narrative' }
};

export default VOICE_PROFILES;
