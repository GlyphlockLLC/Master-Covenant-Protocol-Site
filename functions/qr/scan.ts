import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import * as ed25519 from 'npm:@noble/ed25519@2.0.0';
import canonicalize from 'npm:canonicalize@1.0.8';

const QR_SIGNATURE_CONTEXT = 'GlyphLock QR v1';

async function verifyQRSignature(payload, publicKeyBase64) {
  const { sig, ...unsignedPayload } = payload;
  const canonical = canonicalize(unsignedPayload);
  
  const contextBytes = new TextEncoder().encode(QR_SIGNATURE_CONTEXT);
  const payloadBytes = new TextEncoder().encode(canonical);
  
  const combined = new Uint8Array(contextBytes.length + payloadBytes.length);
  combined.set(contextBytes, 0);
  combined.set(payloadBytes, contextBytes.length);
  
  const signatureBytes = Buffer.from(sig, 'base64url');
  const publicKeyBytes = Buffer.from(publicKeyBase64, 'base64url');
  
  return await ed25519.verify(signatureBytes, combined, publicKeyBytes);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { qrData, qrId: inputQrId } = await req.json(); // Accept raw string or object
    
    let payload;
    try {
        payload = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
    } catch (e) {
        return Response.json({ error: 'Invalid QR data format' }, { status: 400 });
    }

    // 1. Version Check
    if (payload.ver !== '1') {
      return Response.json({ error: 'Unsupported QR version' }, { status: 400 });
    }

    // 2. Fetch Public Key (Trust Anchor)
    const keyRecords = await base44.asServiceRole.entities.QRKeyRegistry.filter({ kid: payload.kid });
    const keyRecord = keyRecords[0];

    if (!keyRecord) {
      await logScan(base44, payload.qrId, user.email, false, 'Untrusted signing key', req);
      return Response.json({ error: 'Untrusted signing key' }, { status: 403 });
    }

    if (keyRecord.revokedAt) {
      await logScan(base44, payload.qrId, user.email, false, 'Signing key revoked', req);
      return Response.json({ error: 'Signing key revoked', revokedAt: keyRecord.revokedAt }, { status: 403 });
    }

    // 3. Verify Signature
    const isValidSig = await verifyQRSignature(payload, keyRecord.publicKey);
    if (!isValidSig) {
      await logScan(base44, payload.qrId, user.email, false, 'Invalid signature', req);
      return Response.json({ error: 'Invalid signature - Tampering detected' }, { status: 400 });
    }

    // 4. Check Expiration
    const now = Math.floor(Date.now() / 1000);
    if (now > payload.exp) {
      await logScan(base44, payload.qrId, user.email, false, 'Expired', req);
      return Response.json({ error: 'QR code expired' }, { status: 410 });
    }

    // 5. Get DB Record & Enforce Mode
    const qrRecords = await base44.entities.QRCode.filter({ qrId: payload.qrId });
    const qrRecord = qrRecords[0];

    if (!qrRecord) {
      return Response.json({ error: 'QR code not found in registry' }, { status: 404 });
    }

    if (qrRecord.scanMode === 'single_use') {
      if (qrRecord.redeemedAt) {
        await logScan(base44, payload.qrId, user.email, false, 'Already redeemed', req);
        return Response.json({ error: 'QR already redeemed' }, { status: 409 });
      }
      
      // Redeem
      await base44.entities.QRCode.update(qrRecord.id, {
        redeemedAt: new Date().toISOString(),
        redeemedBy: user.email
      });
    }

    // 7. Log Success
    await logScan(base44, payload.qrId, user.email, true, 'Valid scan', req);

    return Response.json({ success: true, payload });

  } catch (error) {
    console.error('QR Scan Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function logScan(base44, qrId, email, valid, reason, req) {
    await base44.entities.QRScanLog.create({
        qrId: qrId || 'unknown',
        scannedBy: email,
        scannedAt: new Date().toISOString(),
        signatureValid: valid,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent'),
        // Store reason in metadata? Schema doesn't have it, but useful context
    });
    
    // Also system log for alerts
    if (!valid) {
        await base44.entities.SystemAuditLog.create({
            event_type: 'QR_SCAN_FAILURE',
            description: `QR Scan failed: ${reason}`,
            actor_email: email,
            severity: 'medium',
            status: 'failure',
            resource_id: qrId
        });
    }
}