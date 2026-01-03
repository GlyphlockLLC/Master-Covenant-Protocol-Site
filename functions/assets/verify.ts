import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import * as ed25519 from 'npm:@noble/ed25519@2.0.0';

const ASSET_SIGNATURE_CONTEXT = 'GlyphLock Asset v1';

async function verifyAssetSignature(hash, signatureBase64, publicKeyBase64) {
  const contextBytes = new TextEncoder().encode(ASSET_SIGNATURE_CONTEXT);
  const hashBytes = new TextEncoder().encode(hash);
  
  const combined = new Uint8Array(contextBytes.length + hashBytes.length);
  combined.set(contextBytes, 0);
  combined.set(hashBytes, contextBytes.length);
  
  const signatureBytes = Buffer.from(signatureBase64, 'base64url');
  const publicKeyBytes = Buffer.from(publicKeyBase64, 'base64url');
  
  return await ed25519.verify(signatureBytes, combined, publicKeyBytes);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me(); // Optional? Public verification might be needed later.

    const { assetHash, signature, kid } = await req.json();

    if (!assetHash || !signature || !kid) {
        return Response.json({ error: 'Missing required verification parameters (assetHash, signature, kid)' }, { status: 400 });
    }

    // 1. Fetch Public Key
    const keyRecords = await base44.asServiceRole.entities.QRKeyRegistry.filter({ kid });
    const keyRecord = keyRecords[0];

    if (!keyRecord) {
        return Response.json({ valid: false, reason: 'Signing key not found' }, { status: 404 });
    }

    if (keyRecord.revokedAt) {
        return Response.json({ valid: false, reason: 'Signing key revoked', revokedAt: keyRecord.revokedAt }, { status: 403 });
    }

    // 2. Verify Signature
    const isValid = await verifyAssetSignature(assetHash, signature, keyRecord.publicKey);

    // 3. Check Ledger (AssetTrace) presence
    const traces = await base44.entities.AssetTrace.filter({ assetHash, signature });
    const isRegistered = traces.length > 0;

    const verificationResult = {
        valid: isValid,
        registered: isRegistered,
        timestamp: new Date().toISOString(),
        kid
    };

    if (isValid && isRegistered) {
        verificationResult.traceId = traces[0].traceId;
        verificationResult.registeredAt = traces[0].created_date;
        verificationResult.owner = traces[0].userId; // Maybe obscure this for privacy?
    }

    return Response.json(verificationResult);

  } catch (error) {
    console.error('Asset Verify Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});