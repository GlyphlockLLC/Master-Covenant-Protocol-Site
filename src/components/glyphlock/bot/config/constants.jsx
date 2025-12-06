export const STORAGE_KEYS = {
  MESSAGES: 'glyphbot_messages',
  SETTINGS: 'glyphbot_settings',
  CHAT_COUNT: 'glyphbot_chat_count',
  PROVIDER_META: 'glyphbot_provider_meta'
};

export const LIMITS = {
  MAX_MESSAGES: 10,
  SAVE_SETTINGS_THRESHOLD: 20
};

export const PROVIDER_PRIORITY = ['PUTER', 'GEMINI', 'OPENAI', 'CLAUDE', 'OPENROUTER', 'LOCAL_OSS'];

export const WELCOME_MESSAGE = {
  id: 'welcome-1',
  role: 'assistant',
  content: `Welcome to GlyphBot — your elite AI security assistant.

I can help you with:
• **Security audits** — analyze code, URLs, and systems for vulnerabilities
• **Blockchain analysis** — smart contract review and DeFi security
• **Threat detection** — identify and mitigate potential risks
• **Code debugging** — find and fix issues with precision

What would you like to explore today?`,
  audit: null
};

export default { STORAGE_KEYS, LIMITS, PROVIDER_PRIORITY, WELCOME_MESSAGE };