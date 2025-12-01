/**
 * GlyphLock Webhook Event Types & Utilities
 * Frontend SDK integration for webhook event handling
 */

// ═══════════════════════════════════════════════════════════════════════════
// EVENT TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export const WEBHOOK_EVENTS = {
  // Chain Events
  CHAIN_COMPLETED: 'chain.completed',
  CHAIN_FAILED: 'chain.failed',
  
  // QR Events
  QR_ENCODED: 'qr.encoded',
  QR_DECODED: 'qr.decoded',
  QR_SCANNED: 'qr.scanned',
  
  // Covenant Events
  COVENANT_VERIFIED: 'covenant.verified',
  COVENANT_DENIED: 'covenant.denied',
  COVENANT_BINDING_CREATED: 'covenant.binding_created',
  
  // Security Events
  SECURITY_THREAT_DETECTED: 'security.threat_detected',
  SECURITY_RATE_LIMIT_EXCEEDED: 'security.rate_limit_exceeded',
  
  // Payment Events
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed'
};

// Event severity levels
export const EVENT_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
};

// ═══════════════════════════════════════════════════════════════════════════
// EVENT SCHEMAS (for validation)
// ═══════════════════════════════════════════════════════════════════════════

export const EVENT_SCHEMAS = {
  [WEBHOOK_EVENTS.CHAIN_COMPLETED]: {
    required: ['trace_id', 'provider'],
    optional: ['latency_ms', 'tokens_used', 'model']
  },
  [WEBHOOK_EVENTS.CHAIN_FAILED]: {
    required: ['error_message', 'providers_attempted'],
    optional: ['trace_id', 'fallback_used']
  },
  [WEBHOOK_EVENTS.QR_ENCODED]: {
    required: ['code_id'],
    optional: ['payload_size_bytes', 'format', 'error_correction']
  },
  [WEBHOOK_EVENTS.QR_DECODED]: {
    required: ['code_id', 'integrity_verified'],
    optional: ['payload_preview', 'user_agent', 'ip_hash']
  },
  [WEBHOOK_EVENTS.COVENANT_VERIFIED]: {
    required: ['covenant_id'],
    optional: ['ai_model', 'binding_type', 'verified_at']
  },
  [WEBHOOK_EVENTS.COVENANT_DENIED]: {
    required: ['denial_reason', 'denial_code'],
    optional: ['covenant_id', 'ai_model']
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// WEBHOOK CLIENT UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a webhook event payload
 */
export function createWebhookEvent(type, data) {
  return {
    type,
    data,
    event_id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    api_version: '2025-01-01'
  };
}

/**
 * Validate event structure against schema
 */
export function validateEvent(event) {
  if (!event.type || !event.data) {
    return { valid: false, error: 'Missing type or data' };
  }

  const schema = EVENT_SCHEMAS[event.type];
  if (!schema) {
    return { valid: true, warning: 'Unknown event type' };
  }

  const missingFields = schema.required.filter(field => !(field in event.data));
  if (missingFields.length > 0) {
    return { valid: false, error: `Missing required fields: ${missingFields.join(', ')}` };
  }

  return { valid: true };
}

/**
 * Get event severity based on type
 */
export function getEventSeverity(eventType) {
  const severityMap = {
    [WEBHOOK_EVENTS.CHAIN_COMPLETED]: EVENT_SEVERITY.INFO,
    [WEBHOOK_EVENTS.CHAIN_FAILED]: EVENT_SEVERITY.ERROR,
    [WEBHOOK_EVENTS.QR_ENCODED]: EVENT_SEVERITY.INFO,
    [WEBHOOK_EVENTS.QR_DECODED]: EVENT_SEVERITY.INFO,
    [WEBHOOK_EVENTS.COVENANT_VERIFIED]: EVENT_SEVERITY.INFO,
    [WEBHOOK_EVENTS.COVENANT_DENIED]: EVENT_SEVERITY.CRITICAL,
    [WEBHOOK_EVENTS.SECURITY_THREAT_DETECTED]: EVENT_SEVERITY.WARNING,
    [WEBHOOK_EVENTS.SECURITY_RATE_LIMIT_EXCEEDED]: EVENT_SEVERITY.WARNING,
    [WEBHOOK_EVENTS.PAYMENT_COMPLETED]: EVENT_SEVERITY.INFO,
    [WEBHOOK_EVENTS.PAYMENT_FAILED]: EVENT_SEVERITY.ERROR
  };
  return severityMap[eventType] || EVENT_SEVERITY.INFO;
}

/**
 * Format event for display
 */
export function formatEventForDisplay(event) {
  const severity = getEventSeverity(event.type);
  const typeLabel = event.type.replace(/\./g, ' → ').toUpperCase();
  
  return {
    id: event.event_id,
    type: event.type,
    typeLabel,
    severity,
    data: event.data,
    timestamp: new Date(event.timestamp),
    formattedTime: new Date(event.timestamp).toLocaleString()
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// WEBHOOK ENDPOINT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export const WEBHOOK_ENDPOINT = '/api/glyphlockWebhook';

export const WEBHOOK_HEADERS = {
  SIGNATURE: 'x-glyphlock-signature',
  TIMESTAMP: 'x-glyphlock-timestamp',
  EVENT_TYPE: 'x-glyphlock-event-type'
};

export default {
  WEBHOOK_EVENTS,
  EVENT_SEVERITY,
  EVENT_SCHEMAS,
  createWebhookEvent,
  validateEvent,
  getEventSeverity,
  formatEventForDisplay,
  WEBHOOK_ENDPOINT,
  WEBHOOK_HEADERS
};