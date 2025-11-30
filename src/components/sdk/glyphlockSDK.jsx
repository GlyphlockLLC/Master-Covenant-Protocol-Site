/**
 * @glyphlock/sdk - Browser-compatible SDK stub for Base44
 * 
 * This is a lightweight client-side implementation that calls
 * GlyphLock backend functions. For full Node.js SDK, use npm install @glyphlock/sdk
 */

import { base44 } from "@/api/base44Client";

class GlyphLockError extends Error {
  constructor(message, code, status, details) {
    super(message);
    this.name = "GlyphLockError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

class GlyphLockClient {
  constructor(config = {}) {
    this.config = {
      chainMode: config.chainMode || "openai-first",
      environment: config.environment || "production",
      timeoutMs: config.timeoutMs || 30000,
      ...config
    };
  }

  /**
   * Run AI chain with fallback support
   * @param {Object} options
   * @param {string} options.input - The prompt/input text
   * @param {string} [options.model] - Primary model (e.g., "openai:gpt-4.1")
   * @param {string[]} [options.fallback] - Fallback models
   * @param {number} [options.temperature] - Temperature (0-1)
   * @param {number} [options.maxTokens] - Max output tokens
   * @param {Object} [options.metadata] - Additional metadata
   * @returns {Promise<ChainRunResult>}
   */
  async chainRun(options) {
    const { input, model, fallback, temperature, maxTokens, metadata } = options;

    try {
      const response = await base44.functions.invoke('glyphbotLLM', {
        messages: [{ role: 'user', content: input }],
        persona: 'GENERAL',
        provider: this._mapModelToProvider(model),
        autoProvider: !model || model === 'auto'
      });

      return {
        output: response.data?.text || '',
        modelUsed: response.data?.model || 'unknown',
        provider: response.data?.providerUsed || 'unknown',
        latencyMs: response.data?.latencyMs,
        traceId: crypto.randomUUID()
      };
    } catch (error) {
      throw new GlyphLockError(
        error.message || 'Chain run failed',
        'CHAIN_ERROR',
        500,
        error
      );
    }
  }

  /**
   * Encode data into a steganographic QR code
   * @param {Object} options
   * @param {string} options.data - Data to encode
   * @param {string} [options.mode] - "stego" or "raw"
   * @param {string} [options.level] - Error correction level
   * @param {string} [options.format] - Output format (png/svg)
   * @param {Object} [options.metadata] - Additional metadata
   * @returns {Promise<QREncodeResult>}
   */
  async qrEncode(options) {
    const { data, mode = 'stego', level = 'high', format = 'png', metadata } = options;

    try {
      const response = await base44.functions.invoke('generateQrAsset', {
        payload: data,
        format,
        errorCorrection: level.toUpperCase(),
        stegoMode: mode === 'stego',
        metadata
      });

      return {
        imageUrl: response.data?.qrUrl,
        format,
        checksum: response.data?.checksum || this._generateChecksum(data)
      };
    } catch (error) {
      throw new GlyphLockError(
        error.message || 'QR encode failed',
        'QR_ENCODE_ERROR',
        500,
        error
      );
    }
  }

  /**
   * Decode a QR code
   * @param {string} imageUrl - URL of the QR image
   * @returns {Promise<QRDecodeResult>}
   */
  async qrDecode(imageUrl) {
    try {
      const response = await base44.functions.invoke('extractStegoPayload', {
        imageUrl
      });

      return {
        data: response.data?.payload || '',
        mode: response.data?.stegoDetected ? 'stego' : 'raw',
        metadata: response.data?.metadata
      };
    } catch (error) {
      throw new GlyphLockError(
        error.message || 'QR decode failed',
        'QR_DECODE_ERROR',
        500,
        error
      );
    }
  }

  /**
   * Verify covenant access decision
   * @param {Object} options
   * @param {string} options.token - Auth token
   * @param {string} options.action - Action to verify
   * @param {string} options.resource - Resource path
   * @param {Object} [options.context] - Additional context
   * @returns {Promise<CovenantResult>}
   */
  async covenantVerify(options) {
    const { token, action, resource, context } = options;

    // For now, this is a client-side stub
    // In production, this would call a backend covenant verification service
    return {
      allowed: true,
      reason: null,
      policyId: 'default-allow',
      traceId: crypto.randomUUID()
    };
  }

  /**
   * Send a message to GlyphBot with full options
   * @param {Object} options
   * @param {string} options.message - User message
   * @param {string} [options.persona] - Bot persona
   * @param {boolean} [options.auditMode] - Enable audit mode
   * @param {string} [options.provider] - Specific provider
   * @returns {Promise<GlyphBotResponse>}
   */
  async chat(options) {
    const { message, persona = 'GENERAL', auditMode = false, provider = 'AUTO' } = options;

    try {
      const response = await base44.functions.invoke('glyphbotLLM', {
        messages: [{ role: 'user', content: message }],
        persona,
        auditMode,
        provider: provider === 'AUTO' ? null : provider,
        autoProvider: provider === 'AUTO'
      });

      return {
        text: response.data?.text || '',
        model: response.data?.model,
        provider: response.data?.providerUsed,
        providerLabel: response.data?.providerLabel,
        latencyMs: response.data?.latencyMs,
        audit: response.data?.audit,
        meta: response.data?.meta
      };
    } catch (error) {
      throw new GlyphLockError(
        error.message || 'Chat failed',
        'CHAT_ERROR',
        500,
        error
      );
    }
  }

  /**
   * Health check / ping
   * @returns {Promise<{status: string, providers: Array}>}
   */
  async ping() {
    try {
      const response = await base44.functions.invoke('glyphbotLLM', {
        messages: [{ role: 'user', content: 'ping' }]
      });

      return {
        status: response.data?.status || 'ok',
        providers: response.data?.providers || []
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  // Private helpers

  _mapModelToProvider(model) {
    if (!model) return null;
    
    const mapping = {
      'openai:gpt-4.1': 'OPENAI',
      'openai:gpt-4o': 'OPENAI',
      'anthropic:opus': 'CLAUDE',
      'anthropic:sonnet': 'CLAUDE',
      'gemini:pro': 'GEMINI',
      'gemini:flash': 'GEMINI'
    };

    return mapping[model] || null;
  }

  _generateChecksum(data) {
    // Simple hash for client-side
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }
}

// Singleton instance
let instance = null;

export function getGlyphLock(config) {
  if (!instance) {
    instance = new GlyphLockClient(config);
  }
  return instance;
}

export { GlyphLockClient, GlyphLockError };
export default GlyphLockClient;