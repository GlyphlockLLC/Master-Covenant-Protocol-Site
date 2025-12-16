import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

/**
 * GLYPHLOCK VERIFICATION TOKEN GENERATOR
 * 
 * Generates one-time submission tokens for Verification Gate
 * Server-side validation only - no client exposure
 * 
 * Security measures:
 * - Origin validation
 * - Timestamp validation (5 minute window)
 * - Token expiry (10 minutes)
 * - Replay prevention via database tracking
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Validate authenticated user
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { origin, timestamp } = await req.json();

    // Validate origin
    const allowedOrigins = [
      "https://glyphlock.io",
      "http://localhost:3000",
      Deno.env.get("APP_URL")
    ].filter(Boolean);

    if (!allowedOrigins.includes(origin)) {
      return Response.json({ error: "Invalid origin" }, { status: 403 });
    }

    // Validate timestamp (5 minute window)
    const now = Date.now();
    const timeDiff = Math.abs(now - timestamp);
    if (timeDiff > 300000) { // 5 minutes
      return Response.json({ error: "Invalid timestamp" }, { status: 403 });
    }

    // Generate cryptographically secure token
    const tokenData = {
      userId: user.id,
      email: user.email,
      origin,
      timestamp: now,
      expiresAt: now + 600000, // 10 minutes
      nonce: crypto.randomUUID()
    };

    // Create token signature
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(tokenData));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const token = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Store token for validation (with expiry)
    await base44.asServiceRole.entities.VerificationToken.create({
      token,
      user_id: user.id,
      email: user.email,
      origin,
      expires_at: new Date(tokenData.expiresAt).toISOString(),
      used: false
    });

    return Response.json({ 
      token,
      expiresAt: tokenData.expiresAt
    });
  } catch (error) {
    console.error("Verification token generation failed:", error);
    return Response.json({ error: "Verification failed" }, { status: 500 });
  }
});