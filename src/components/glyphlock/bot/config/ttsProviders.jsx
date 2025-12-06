export const TTS_PROVIDERS = {
  openai: {
    label: 'OpenAI Voice',
    voices: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
    supportsSpeed: true,
    supportsPitch: false,
    supportsEmotion: false
  },
  elevenlabs: {
    label: 'ElevenLabs (Celebrity)',
    voices: ['Rachel', 'Domi', 'Bella', 'Antoni', 'Elli', 'Josh', 'Arnold', 'Adam', 'Sam', 'Charlotte'],
    supportsSpeed: true,
    supportsPitch: false,
    supportsEmotion: true
  },
  google: {
    label: 'Google Cloud TTS',
    voices: [
      'en-US-Neural2-A',
      'en-US-Neural2-C',
      'en-US-Neural2-D',
      'en-US-Neural2-F',
      'en-US-Neural2-J',
      'en-US-Wavenet-A',
      'en-US-Wavenet-B',
      'en-US-Wavenet-C',
      'en-US-Wavenet-D'
    ],
    supportsSpeed: true,
    supportsPitch: true,
    supportsEmotion: false
  },
  microsoft: {
    label: 'Microsoft Azure Neural',
    voices: [
      'en-US-JennyNeural',
      'en-US-GuyNeural',
      'en-US-AriaNeural',
      'en-US-DavisNeural',
      'en-US-JaneNeural',
      'en-US-JasonNeural',
      'en-US-SaraNeural',
      'en-US-TonyNeural'
    ],
    supportsSpeed: true,
    supportsPitch: true,
    supportsEmotion: true
  },
  streamelements: {
    label: 'StreamElements (Free)',
    voices: ['Joanna', 'Matthew', 'Amy', 'Brian', 'Emma', 'Justin', 'Kendra', 'Kimberly'],
    supportsSpeed: false,
    supportsPitch: false,
    supportsEmotion: false
  },
  coqui: {
    label: 'Coqui (Open Source)',
    voices: ['default', 'jenny', 'p273', 'ljspeech'],
    supportsSpeed: true,
    supportsPitch: true,
    supportsEmotion: false
  }
};

export default TTS_PROVIDERS;