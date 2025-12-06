export const DEFAULT_PERSONA = 'GENERAL';
export const DEFAULT_PROVIDER = 'AUTO';

export const DEFAULT_VOICE_SETTINGS = {
  voiceProfile: 'neutral_female',
  speed: 1.0,
  pitch: 1.0,
  volume: 1.0,
  bass: 0,
  clarity: 0,
  emotion: 'neutral',
  provider: 'auto'
};

export const DEFAULT_MODES = {
  voice: false,
  live: false,
  audit: false,
  test: false,
  json: false,
  struct: false,
  panel: false
};

export const DEFAULT_AUDIT_MODE = 'SURFACE';

export default {
  DEFAULT_PERSONA,
  DEFAULT_PROVIDER,
  DEFAULT_VOICE_SETTINGS,
  DEFAULT_MODES,
  DEFAULT_AUDIT_MODE
};