/**
 * @typedef {Object} GlyphBotMessage
 * @property {string} id - Unique message ID
 * @property {'user'|'assistant'|'system'} role - Message role
 * @property {string} content - Message text
 * @property {Object|null} [audit] - Audit data if audit mode
 * @property {string} [providerId] - LLM provider used
 * @property {number} [latencyMs] - Response latency in milliseconds
 * @property {Object|null} [ttsMetadata] - TTS settings used for this message
 */

export const GlyphBotMessageType = {};