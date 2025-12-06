import { base44 } from '@/api/base44Client';

/**
 * LLM Service - Wrapper around glyphbotLLM and puterLLM backend functions
 */

export async function sendMessage(messages, options = {}) {
  try {
    const response = await base44.functions.invoke('glyphbotLLM', {
      messages,
      persona: options.persona || 'GENERAL',
      auditMode: options.auditMode || false,
      provider: options.provider || 'AUTO'
    });
    return response.data;
  } catch (error) {
    console.error('[LLM Service] Error:', error);
    return {
      text: 'GlyphBot encountered an error. Please try again.',
      error: error.message,
      providerUsed: 'ERROR'
    };
  }
}

export async function ping() {
  try {
    const response = await base44.functions.invoke('glyphbotLLM', {
      messages: [{ role: 'user', content: 'ping' }]
    });
    return response.data;
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}

export async function getProviderStats() {
  const pingResponse = await ping();
  return pingResponse.providers || [];
}

export async function callPuter(messages) {
  try {
    const response = await base44.functions.invoke('puterLLM', { messages });
    return response.data;
  } catch (error) {
    console.error('[Puter Service] Error:', error);
    return { text: 'Puter service unavailable', error: error.message };
  }
}

export default { sendMessage, ping, getProviderStats, callPuter };