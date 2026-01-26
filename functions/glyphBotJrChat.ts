import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * GLYPHBOT JR. — BASE44 AGENT HANDLER
 * Voice: Aurora — Neural TTS (Proxied for CORS)
 */

Deno.serve(async (req) => {
    try {
        if (req.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405 });
        }

        const base44 = createClientFromRequest(req);
        const { action, text, messages, systemPrompt, voiceSettings } = await req.json();

        // 🎯 LISTEN ACTION — Use Premium Google Cloud Neural2 TTS with user voice settings
        if (action === 'listen') {
            if (!text || text.length > 2000) {
                return Response.json({ error: 'Invalid text' }, { status: 400 });
            }

            try {
                // Use user's voice settings or defaults
                const voiceProfile = voiceSettings?.voiceProfile || 'aurora';
                const emotion = voiceSettings?.emotion || 'friendly';
                const speed = voiceSettings?.speed || 1.0;

                // Call premium voice endpoint
                const voiceResponse = await base44.functions.invoke('glyphBotVoice', {
                    text: text,
                    voiceProfile: voiceProfile,
                    emotion: emotion,
                    speed: speed,
                    provider: 'google_cloud'
                });

                if (!voiceResponse?.data) {
                    throw new Error('No audio content from voice service');
                }

                return Response.json({
                    text: text,
                    speak: {
                        enabled: true,
                        voiceProfile: voiceProfile,
                        audioBase64: voiceResponse.data,
                        mimeType: 'audio/mpeg'
                    }
                });
            } catch (ttsError) {
                console.error('[TTS Fallback]:', ttsError.message);
                // Graceful fallback: return text-only response, UI shows retry option
                return Response.json({
                    text: text,
                    speak: {
                        enabled: false,
                        error: true,
                        message: 'Voice service temporarily unavailable'
                    }
                });
            }
        }

        // 💬 CHAT ACTION — Use Base44 InvokeLLM
        const conversationContext = systemPrompt || 'You are GlyphBot Jr., a helpful AI assistant for GlyphLock.';
        
        const fullPrompt = `${conversationContext}

Conversation:
${(messages || []).map(m => `${m.role}: ${m.text || m.content}`).join('\n')}

Respond helpfully and concisely.`;

        const response = await base44.integrations.Core.InvokeLLM({
            prompt: fullPrompt,
            add_context_from_internet: false
        });

        return Response.json({
            text: response,
            speak: {
                enabled: false,
                persona: 'Aurora'
            }
        });

    } catch (error) {
        console.error('[GlyphBot Jr. Error]:', error.message);
        return Response.json({
            text: "Sorry, I'm having trouble right now. Please try again!",
            speak: { enabled: false },
            error: true
        }, { status: 200 });
    }
});