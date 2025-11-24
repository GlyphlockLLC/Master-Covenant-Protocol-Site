/**
 * QR Utility Functions for GlyphLock QR Studio
 */

/**
 * Validates QR payload for security
 */
export function validatePayload(payloadType, payloadValue) {
  if (!payloadValue) return { valid: false, error: 'Payload value is required' };

  if (payloadType === 'url') {
    try {
      const url = new URL(payloadValue);
      const scheme = url.protocol.replace(':', '');
      
      // Only allow safe schemes
      const safeSchemes = ['http', 'https', 'mailto', 'tel', 'sms'];
      if (!safeSchemes.includes(scheme)) {
        return { valid: false, error: 'Unsafe URL scheme' };
      }
      
      return { valid: true };
    } catch (e) {
      return { valid: false, error: 'Invalid URL format' };
    }
  }

  return { valid: true };
}

/**
 * Calculates scannability score based on QR parameters
 */
export function calculateScannability(errorCorrectionLevel, hasArtStyle, contrast = 100) {
  let score = 100;

  // ECC impact
  const eccScores = { L: -20, M: -10, Q: -5, H: 0 };
  score += eccScores[errorCorrectionLevel] || 0;

  // Art style reduces scannability
  if (hasArtStyle) {
    score -= 15;
  }

  // Contrast impact
  if (contrast < 70) {
    score -= 20;
  } else if (contrast < 85) {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Generates a unique scan token for tamper verification
 */
export function generateScanToken(qrAssetId) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${qrAssetId}-${timestamp}-${random}`;
}

/**
 * Formats risk score for display
 */
export function getRiskLevel(riskScore) {
  if (riskScore >= 70) return { level: 'critical', color: 'red' };
  if (riskScore >= 50) return { level: 'high', color: 'orange' };
  if (riskScore >= 30) return { level: 'medium', color: 'yellow' };
  if (riskScore >= 10) return { level: 'low', color: 'blue' };
  return { level: 'safe', color: 'green' };
}

/**
 * Validates hot zone coordinates
 */
export function validateHotZone(zone) {
  if (!zone.zoneId || !zone.shape || !zone.coords || !zone.triggerType || !zone.actionType) {
    return { valid: false, error: 'Missing required hot zone fields' };
  }

  // Validate coords are percentages (0-100)
  for (const coord of zone.coords) {
    if (coord < 0 || coord > 100) {
      return { valid: false, error: 'Coordinates must be between 0 and 100' };
    }
  }

  // Validate action URL if applicable
  if (zone.actionType === 'openUrl' && zone.actionValue) {
    try {
      new URL(zone.actionValue);
    } catch {
      return { valid: false, error: 'Invalid action URL' };
    }
  }

  return { valid: true };
}

/**
 * Downloads a file from URL
 */
export async function downloadFile(url, filename) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Failed to download file');
  }
}