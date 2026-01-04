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
        const { action, text, messages, systemPrompt } = await req.json();

        // 🎯 LISTEN ACTION — Fetch TTS and return as base64 (chunked for long text)
        if (action === 'listen') {
            if (!text || text.length > 2000) {
                return Response.json({ error: 'Invalid text' }, { status: 400 });
            }

            // Clean text for natural speech: remove emojis, excessive punctuation, URLs
            let cleanText = text
                .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // emoticons
                .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // symbols & pictographs
                .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // transport & map
                .replace(/[\u{2600}-\u{26FF}]/gu, '')   // misc symbols
                .replace(/[\u{2700}-\u{27BF}]/gu, '')   // dingbats
                .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // supplemental symbols
                .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // chess symbols
                .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // symbols extended
                .replace(/https?:\/\/[^\s]+/g, '')     // URLs
                .replace(/[*_~`#]+/g, '')              // markdown
                .replace(/\.{2,}/g, '.')               // multiple dots
                .replace(/!{2,}/g, '!')                // multiple exclamations
                .replace(/\?{2,}/g, '?')               // multiple questions
                .replace(/\s+/g, ' ')                  // normalize whitespace
                .trim();

            // Fallback if text is empty after cleaning
            if (!cleanText) cleanText = "Here you go!";

            // Split into chunks at sentence boundaries (max ~180 chars each for Google TTS)
            const chunks = [];
            const sentences = cleanText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanText];
            let currentChunk = '';
            
            for (const sentence of sentences) {
                if ((currentChunk + sentence).length <= 180) {
                    currentChunk += sentence;
                } else {
                    if (currentChunk) chunks.push(currentChunk.trim());
                    currentChunk = sentence.length > 180 ? sentence.substring(0, 180) : sentence;
                }
            }
            if (currentChunk) chunks.push(currentChunk.trim());

            // Fetch all chunks in parallel
            const audioChunks = await Promise.all(
                chunks.slice(0, 5).map(async (chunk) => { // Max 5 chunks
                    const encodedText = encodeURIComponent(chunk);
                    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodedText}`;
                    
                    const audioResponse = await fetch(ttsUrl, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    
                    if (!audioResponse.ok) return null;
                    return await audioResponse.arrayBuffer();
                })
            );

            // Combine audio buffers
            const validChunks = audioChunks.filter(Boolean);
            if (validChunks.length === 0) {
                throw new Error('TTS fetch failed');
            }

            const totalLength = validChunks.reduce((sum, buf) => sum + buf.byteLength, 0);
            const combined = new Uint8Array(totalLength);
            let offset = 0;
            for (const buf of validChunks) {
                combined.set(new Uint8Array(buf), offset);
                offset += buf.byteLength;
            }

            const base64Audio = btoa(String.fromCharCode(...combined));

            return Response.json({
                text: text,
                speak: {
                    enabled: true,
                    persona: 'Aurora',
                    audioBase64: base64Audio,
                    mimeType: 'audio/mpeg',
                    chunks: chunks.length
                }
            });
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