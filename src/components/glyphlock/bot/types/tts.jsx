/**
 * @typedef {Object} TTSRequest
 * @property {string} text - Text to synthesize
 * @property {string} [provider] - TTS provider (openai, google, etc)
 * @property {string} [voice] - Voice ID
 * @property {number} [speed] - Speech rate (0.5-2.0)
 * @property {number} [pitch] - Voice pitch (0.5-2.0)
 * @property {number} [volume] - Volume level (0-1.0)
 * @property {number} [bass] - Bass enhancement (-12 to 12 dB)
 * @property {number} [treble] - Treble enhancement (-12 to 12 dB)
 * @property {number} [mid] - Mid enhancement (-12 to 12 dB)
 * @property {number} [warmth] - Warmth setting (0-1.0)
 * @property {number} [stability] - Stability setting (0-1.0)
 * @property {number} [similarity] - Similarity boost (0-1.0)
 * @property {number} [style] - Style exaggeration (0-1.0)
 * @property {boolean} [useSpeakerBoost] - Enable speaker boost
 * @property {boolean} [echo] - Enable echo effect
 * @property {boolean} [delay] - Enable delay effect
 * @property {boolean} [noiseGate] - Enable noise gate
 * @property {boolean} [enhancement] - Enable enhancement
 * @property {boolean} [humanize] - Enable humanization
 */

/**
 * @typedef {Object} TTSResponse
 * @property {boolean} success - Whether generation succeeded
 * @property {string} [audioUrl] - URL to generated audio file
 * @property {string} [provider] - Provider used
 * @property {boolean} [fallback] - Whether fallback was used
 * @property {string} [error] - Error message if failed
 */

/**
 * @typedef {Object} TTSSettings
 * @property {string} provider - TTS provider
 * @property {string} voice - Voice ID
 * @property {number} speed - Speech rate
 * @property {number} pitch - Voice pitch
 * @property {number} volume - Volume level
 * @property {number} naturalness - Naturalness setting
 * @property {number} bass - Bass EQ
 * @property {number} treble - Treble EQ
 * @property {number} mid - Mid EQ
 * @property {TTSEffects} effects - Audio effects
 */

/**
 * @typedef {Object} TTSEffects
 * @property {boolean} echo - Echo effect
 * @property {boolean} delay - Delay effect
 * @property {boolean} gate - Noise gate
 * @property {boolean} enhance - Audio enhancement
 * @property {boolean} humanize - Humanization
 */

export const TTSRequestType = {};
export const TTSResponseType = {};
export const TTSSettingsType = {};
export const TTSEffectsType = {};