
export const VOICE_PROFILES = {
  // Google Cloud Neural2 Premium Voices
  aurora: { id: 'aurora', label: '🌟 Aurora (Premium Female)', voice: 'aurora', description: 'Warm, expressive, best quality' },
  nova: { id: 'neutral_female', label: '💎 Nova (Clear Female)', voice: 'nova', description: 'Professional, balanced' },
  shimmer: { id: 'warm_female', label: '✨ Shimmer (Friendly Female)', voice: 'shimmer', description: 'Energetic, dynamic' },
  onyx: { id: 'neutral_male', label: '🎙️ Onyx (Deep Male)', voice: 'onyx', description: 'Authoritative, confident' },
  echo: { id: 'warm_male', label: '🔊 Echo (Smooth Male)', voice: 'echo', description: 'Conversational, engaging' },
  fable: { id: 'professional_male', label: '📖 Fable (Storyteller)', voice: 'fable', description: 'Expressive narrative' },
  
  // Legacy mappings (kept for compatibility)
  neutral_female: { id: 'neutral_female', label: '💎 Nova (Clear Female)', voice: 'nova', description: 'Professional, balanced' },
  neutral_male: { id: 'neutral_male', label: '🎙️ Onyx (Deep Male)', voice: 'onyx', description: 'Authoritative, confident' },
  warm_female: { id: 'warm_female', label: '✨ Shimmer (Friendly Female)', voice: 'shimmer', description: 'Energetic, dynamic' },
  warm_male: { id: 'warm_male', label: '🔊 Echo (Smooth Male)', voice: 'echo', description: 'Conversational, engaging' },
  professional_female: { id: 'professional_female', label: '🌟 Aurora (Premium Female)', voice: 'aurora', description: 'Best quality' },
  professional_male: { id: 'professional_male', label: '📖 Fable (Storyteller)', voice: 'fable', description: 'Expressive narrative' }
};

export default VOICE_PROFILES;
