import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

/**
 * GLYPHLOCK VERIFICATION TOKEN VALIDATOR
 * 
 * Validates submission tokens from Verification Gate
 * Enforces:
 * - Token exists and not expired
 * - Token not previously used (replay prevention)
 * - User matches token
 * 
 * Returns validation status only - no details on failure
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Validate authenticated user
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ valid: false }, { status: 401 });
    }

    const { token } = await req.json();

    if (!token) {
      return Response.json({ valid: false }, { status: 400 });
    }

    // Query token from database
    const tokens = await base44.asServiceRole.entities.VerificationToken.filter({
      token,
      user_id: user.id
    });

    if (tokens.length === 0) {
      return Response.json({ valid: false }, { status: 403 });
    }

    const verificationToken = tokens[0];

    // Check if token already used
    if (verificationToken.used) {
      return Response.json({ valid: false }, { status: 403 });
    }

    // Check if token expired
    const expiresAt = new Date(verificationToken.expires_at).getTime();
    const now = Date.now();
    if (now > expiresAt) {
      return Response.json({ valid: false }, { status: 403 });
    }

    // Mark token as used (replay prevention)
    await base44.asServiceRole.entities.VerificationToken.update(verificationToken.id, {
      used: true,
      used_at: new Date().toISOString()
    });

    return Response.json({ 
      valid: true,
      userId: user.id
    });
  } catch (error) {
    console.error("Token validation failed:", error);
    return Response.json({ valid: false }, { status: 500 });
  }
});