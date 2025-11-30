/**
 * GlyphLock Webhook Events v2.0
 * 
 * Defines all webhook event types and their payload structures
 * for the GlyphLock security platform.
 */

// Webhook Event Types
export const WEBHOOK_EVENTS = {
  // Chain Events
  'chain.completed': {
    description: 'AI chain request completed successfully',
    category: 'chain',
    severity: 'info'
  },
  'chain.failed': {
    description: 'AI chain request failed after all provider attempts',
    category: 'chain',
    severity: 'error'
  },
  'chain.fallback': {
    description: 'Primary provider failed, fallback provider used',
    category: 'chain',
    severity: 'warning'
  },
  'chain.provider_degraded': {
    description: 'Provider health degraded below threshold',
    category: 'chain',
    severity: 'warning'
  },

  // QR Code Events
  'qr.generated': {
    description: 'QR code generated successfully',
    category: 'qr',
    severity: 'info'
  },
  'qr.encoded': {
    description: 'Data encoded into QR code with steganography',
    category: 'qr',
    severity: 'info'
  },
  'qr.decoded': {
    description: 'QR code decoded and data extracted',
    category: 'qr',
    severity: 'info'
  },
  'qr.scanned': {
    description: 'QR code scanned by end user',
    category: 'qr',
    severity: 'info'
  },
  'qr.threat_detected': {
    description: 'Malicious content detected in QR code',
    category: 'qr',
    severity: 'critical'
  },
  'qr.tamper_detected': {
    description: 'QR code integrity check failed',
    category: 'qr',
    severity: 'critical'
  },

  // Covenant Events
  'covenant.verified': {
    description: 'Covenant verification passed',
    category: 'covenant',
    severity: 'info'
  },
  'covenant.denied': {
    description: 'Covenant verification failed - access denied',
    category: 'covenant',
    severity: 'error'
  },
  'covenant.expired': {
    description: 'Covenant has expired',
    category: 'covenant',
    severity: 'warning'
  },
  'covenant.revoked': {
    description: 'Covenant was revoked by owner',
    category: 'covenant',
    severity: 'warning'
  },

  // Security Events
  'security.threat_blocked': {
    description: 'Security threat blocked',
    category: 'security',
    severity: 'critical'
  },
  'security.rate_limit': {
    description: 'Rate limit exceeded',
    category: 'security',
    severity: 'warning'
  },
  'security.audit_completed': {
    description: 'Security audit completed',
    category: 'security',
    severity: 'info'
  },

  // Image Events
  'image.generated': {
    description: 'Image generated via Imagen/DALL-E',
    category: 'image',
    severity: 'info'
  },
  'image.finalized': {
    description: 'Interactive image finalized with hash',
    category: 'image',
    severity: 'info'
  }
};

// Payload builders for each event type
export const buildWebhookPayload = (eventType, data, context = {}) => {
  const eventConfig = WEBHOOK_EVENTS[eventType];
  if (!eventConfig) {
    throw new Error(`Unknown webhook event type: ${eventType}`);
  }

  const basePayload = {
    id: `evt_${crypto.randomUUID().replace(/-/g, '')}`,
    type: eventType,
    category: eventConfig.category,
    severity: eventConfig.severity,
    timestamp: new Date().toISOString(),
    api_version: '2.0',
    environment: context.environment || 'production'
  };

  // Build event-specific payload
  const eventPayload = buildEventData(eventType, data);

  return {
    ...basePayload,
    data: eventPayload,
    metadata: {
      user_id: context.userId,
      org_id: context.orgId,
      request_id: context.requestId,
      ip_address: context.ipAddress,
      user_agent: context.userAgent
    }
  };
};

const buildEventData = (eventType, data) => {
  switch (eventType) {
    // Chain Events
    case 'chain.completed':
      return {
        trace_id: data.traceId,
        provider: data.provider,
        provider_label: data.providerLabel,
        model: data.model,
        latency_ms: data.latencyMs,
        tokens_in: data.tokensIn,
        tokens_out: data.tokensOut,
        persona: data.persona,
        json_mode: data.jsonMode || false,
        attempt_count: data.attemptCount || 1
      };

    case 'chain.failed':
      return {
        trace_id: data.traceId,
        error_code: data.errorCode,
        error_message: data.errorMessage,
        providers_attempted: data.providersAttempted || [],
        total_attempts: data.totalAttempts,
        total_latency_ms: data.totalLatencyMs,
        last_provider: data.lastProvider,
        last_error: data.lastError,
        persona: data.persona,
        fallback_exhausted: true
      };

    case 'chain.fallback':
      return {
        trace_id: data.traceId,
        primary_provider: data.primaryProvider,
        primary_error: data.primaryError,
        fallback_provider: data.fallbackProvider,
        attempt_number: data.attemptNumber,
        recovery_latency_ms: data.recoveryLatencyMs
      };

    case 'chain.provider_degraded':
      return {
        provider: data.provider,
        health_score: data.healthScore,
        failure_rate: data.failureRate,
        avg_latency_ms: data.avgLatencyMs,
        consecutive_failures: data.consecutiveFailures,
        status: data.status,
        cooldown_until: data.cooldownUntil
      };

    // QR Events
    case 'qr.generated':
      return {
        code_id: data.codeId,
        payload_type: data.payloadType,
        payload_hash: data.payloadHash,
        size: data.size,
        error_correction: data.errorCorrection,
        has_logo: data.hasLogo || false,
        format: data.format || 'png'
      };

    case 'qr.encoded':
      return {
        code_id: data.codeId,
        carrier_image_hash: data.carrierImageHash,
        payload_size_bytes: data.payloadSizeBytes,
        encoding_method: data.encodingMethod || 'LSB',
        encryption_algorithm: data.encryptionAlgorithm,
        steganography_capacity_used: data.capacityUsed,
        output_hash: data.outputHash
      };

    case 'qr.decoded':
      return {
        code_id: data.codeId,
        payload_type: data.payloadType,
        payload_hash: data.payloadHash,
        extraction_method: data.extractionMethod,
        integrity_verified: data.integrityVerified,
        decryption_successful: data.decryptionSuccessful,
        decode_latency_ms: data.decodeLatencyMs
      };

    case 'qr.scanned':
      return {
        code_id: data.codeId,
        scan_location: data.scanLocation,
        device_type: data.deviceType,
        referrer: data.referrer,
        scan_count: data.scanCount
      };

    case 'qr.threat_detected':
      return {
        code_id: data.codeId,
        threat_type: data.threatType,
        threat_score: data.threatScore,
        payload_snippet: data.payloadSnippet,
        indicators: data.indicators || [],
        action_taken: data.actionTaken,
        blocked: data.blocked || true
      };

    case 'qr.tamper_detected':
      return {
        code_id: data.codeId,
        original_hash: data.originalHash,
        current_hash: data.currentHash,
        tamper_type: data.tamperType,
        confidence: data.confidence,
        detection_method: data.detectionMethod
      };

    // Covenant Events
    case 'covenant.verified':
      return {
        covenant_id: data.covenantId,
        asset_id: data.assetId,
        asset_type: data.assetType,
        verification_method: data.verificationMethod,
        signature_valid: data.signatureValid,
        timestamp_valid: data.timestampValid,
        binding_intact: data.bindingIntact,
        verification_latency_ms: data.verificationLatencyMs
      };

    case 'covenant.denied':
      return {
        covenant_id: data.covenantId,
        asset_id: data.assetId,
        asset_type: data.assetType,
        denial_reason: data.denialReason,
        denial_code: data.denialCode,
        signature_mismatch: data.signatureMismatch || false,
        timestamp_expired: data.timestampExpired || false,
        binding_broken: data.bindingBroken || false,
        attempted_action: data.attemptedAction,
        requester_id: data.requesterId
      };

    case 'covenant.expired':
      return {
        covenant_id: data.covenantId,
        asset_id: data.assetId,
        expiration_time: data.expirationTime,
        expired_since_ms: data.expiredSinceMs,
        renewal_available: data.renewalAvailable || false
      };

    case 'covenant.revoked':
      return {
        covenant_id: data.covenantId,
        asset_id: data.assetId,
        revoked_by: data.revokedBy,
        revocation_reason: data.revocationReason,
        revocation_time: data.revocationTime
      };

    // Security Events
    case 'security.threat_blocked':
      return {
        threat_id: data.threatId,
        threat_type: data.threatType,
        severity: data.severity,
        source_ip: data.sourceIp,
        target_resource: data.targetResource,
        action_taken: data.actionTaken,
        rule_triggered: data.ruleTriggered
      };

    case 'security.rate_limit':
      return {
        limit_type: data.limitType,
        limit_value: data.limitValue,
        current_value: data.currentValue,
        window_seconds: data.windowSeconds,
        retry_after_seconds: data.retryAfterSeconds,
        endpoint: data.endpoint
      };

    case 'security.audit_completed':
      return {
        audit_id: data.auditId,
        target: data.target,
        target_type: data.targetType,
        risk_score: data.riskScore,
        severity: data.severity,
        issues_found: data.issuesFound,
        recommendations_count: data.recommendationsCount,
        audit_duration_ms: data.auditDurationMs
      };

    // Image Events
    case 'image.generated':
      return {
        image_id: data.imageId,
        provider: data.provider,
        model: data.model,
        prompt_hash: data.promptHash,
        aspect_ratio: data.aspectRatio,
        image_count: data.imageCount,
        generation_latency_ms: data.generationLatencyMs
      };

    case 'image.finalized':
      return {
        image_id: data.imageId,
        immutable_hash: data.immutableHash,
        hotspot_count: data.hotspotCount,
        status: data.status,
        finalization_time: data.finalizationTime
      };

    default:
      return data;
  }
};

// Webhook signature generation
export const signWebhookPayload = (payload, secret) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const payloadString = JSON.stringify(payload);
  const signatureBase = `${timestamp}.${payloadString}`;
  
  // Simple HMAC-like signature (in production, use crypto.subtle.sign)
  let hash = 0;
  const combined = `${signatureBase}${secret}`;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const signature = `v1=${Math.abs(hash).toString(16).padStart(16, '0')}`;
  
  return {
    signature,
    timestamp,
    headers: {
      'X-GlyphLock-Signature': signature,
      'X-GlyphLock-Timestamp': timestamp.toString(),
      'X-GlyphLock-Event': payload.type
    }
  };
};

// Event categories for filtering
export const EVENT_CATEGORIES = {
  chain: ['chain.completed', 'chain.failed', 'chain.fallback', 'chain.provider_degraded'],
  qr: ['qr.generated', 'qr.encoded', 'qr.decoded', 'qr.scanned', 'qr.threat_detected', 'qr.tamper_detected'],
  covenant: ['covenant.verified', 'covenant.denied', 'covenant.expired', 'covenant.revoked'],
  security: ['security.threat_blocked', 'security.rate_limit', 'security.audit_completed'],
  image: ['image.generated', 'image.finalized']
};

export default {
  WEBHOOK_EVENTS,
  EVENT_CATEGORIES,
  buildWebhookPayload,
  signWebhookPayload
};