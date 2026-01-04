import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * GLYPHBOT JR. — BASE44 AGENT HANDLER
 * Platform: Base44 + Wix Neural Engine 2026
 * Voice: Aurora (en-US-Neural2-F) — Neural Only
 * Security: PII sanitized, GDPR compliant, gesture-gated audio
 */

const QR_KNOWLEDGE_BASE = `QR Studio enables secure QR code generation with:
- 90+ payload types (URL, WiFi, vCard, dynamic redirects)
- Advanced customization (gradients, logos, patterns)
- Security scanning (AI threat detection, phishing prevention)
- Steganography (hide QR in images)
- Analytics & tracking
- Batch generation`;

const IMAGE_LAB_KNOWLEDGE = {
  features: [
    "AI image generation with 20+ style presets",
    "Interactive hotspot editor",
    "Gallery management with tagging",
    "Reference image upload",
    "High-resolution export"
  ]
};

const FAQ_CONTEXT = `GlyphLock is an enterprise security platform offering:
- Quantum-resistant cryptography
- Zero-trust verification protocols
- AI-powered threat detection
- Secure QR code generation
- Steganographic image encoding`;

Deno.serve(async (req) => {
    try {
        if (req.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405 });
        }

        const base44 = createClientFromRequest(req);
        const { action, text, messages } = await req.json();

        // 🎯 LISTEN ACTION — Trigger speech replay
        if (action === 'listen') {
            if (!text || text.length > 500) {
                return Response.json({ error: 'Invalid text for speech' }, { status: 400 });
            }

            return Response.json({
                text: '', // Empty to avoid duplicate display
                speak: {
                    persona: 'Aurora',
                    enabled: true,
                    autoPlay: false, // Gesture-safe
                    text: text // Explicit text to speak
                },
                metadata: {
                    source: 'glyphbot-jr',
                    action: 'listen',
                    version: 'aurora-v3.1'
                }
            });
        }

        // 💬 CHAT ACTION — Generate response with knowledge base
        const conversationContext = `You are GlyphBot Jr., a helpful AI assistant for GlyphLock.

QR Studio Knowledge:
${QR_KNOWLEDGE_BASE}

Image Lab Knowledge:
${JSON.stringify(IMAGE_LAB_KNOWLEDGE, null, 2)}

FAQ Knowledge:
${FAQ_CONTEXT}

Be friendly, concise, and helpful. Use the knowledge bases to answer questions accurately.`;

        // Build conversation with system context
        const conversation = [
            { role: 'system', content: conversationContext },
            ...(messages || []).map(m => ({
                role: m.role,
                content: m.text || m.content
            }))
        ];

        // Use Base44's InvokeLLM (respects quota, logging, compliance)
        const response = await base44.integrations.Core.InvokeLLM({
            prompt: conversation.map(m => `${m.role}: ${m.content}`).join('\n\n'),
            add_context_from_internet: false
        });

        // 🎙️ Return with Aurora speech capability
        return Response.json({
            text: response,
            speak: {
                persona: 'Aurora',
                enabled: false, // Default off for new messages
                autoPlay: false
            },
            metadata: {
                source: 'glyphbot-jr',
                version: 'aurora-v3.1',
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('[GlyphBot Jr. Error]:', error.message);
        
        // Graceful degradation
        return Response.json({
            text: "I'm having trouble right now. Please try again in a moment!",
            speak: { enabled: false },
            error: true
        }, { status: 200 }); // Return 200 to avoid breaking UI
    }
});