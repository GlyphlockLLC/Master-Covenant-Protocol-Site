/**
 * @typedef {Object} GlyphBotSettings
 * @property {'GENERAL'|'SECURITY'|'BLOCKCHAIN'|'AUDIT'|'DEBUGGER'|'PERFORMANCE'|'REFACTOR'|'ANALYTICS'} persona
 * @property {'AUTO'|'GEMINI'|'OPENAI'|'CLAUDE'|'OPENROUTER'|'LOCAL_OSS'} provider
 * @property {ModeSettings} modes
 * @property {VoiceSettings} voiceSettings
 */

/**
 * @typedef {Object} ModeSettings
 * @property {boolean} voice - Enable voice output
 * @property {boolean} live - Enable real-time web search
 * @property {boolean} audit - Enable audit mode
 * @property {boolean} test - Enable test mode
 * @property {boolean} json - Force JSON output
 * @property {boolean} struct - Enable structured output
 * @property {boolean} panel - Show provider panel
 */

/**
 * @typedef {Object} VoiceSettings
 * @property {string} voiceProfile - Voice profile ID
 * @property {number} speed - Speech rate (0.5-2.0)
 * @property {number} pitch - Voice pitch (0.5-2.0)
 * @property {number} volume - Volume level (0-1.0)
 * @property {number} bass - Bass enhancement (-1.0 to 1.0)
 * @property {number} clarity - Clarity enhancement (-1.0 to 1.0)
 * @property {string} emotion - Emotion preset ID
 * @property {string} provider - TTS provider
 */

export const GlyphBotSettingsType = {};
export const ModeSettingsType = {};
export const VoiceSettingsType = {};