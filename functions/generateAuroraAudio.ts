import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import OpenAI from 'npm:openai';

/**
 * GLYPHBOT JR. - AURORA NEURAL ENGINE
 * Generates high-fidelity neural speech (MP3) from text.
 * Voice: Aurora (Mapped to OpenAI 'Nova' - Calm, Clear, Neural)
 */
Deno.serve(async (req) => {
    try {
        if (req.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405 });
        }

        const base44 = createClientFromRequest(req);
        const { text } = await req.json();

        if (!text) {
            return Response.json({ error: "Text required" }, { status: 400 });
        }

        const openai = new OpenAI({
            apiKey: Deno.env.get("OPENAI_API_KEY"),
        });

        // Generate Neural Audio
        const mp3 = await openai.audio.speech.create({
            model: "tts-1-hd",
            voice: "nova", // Aurora persona mapping
            input: text,
            speed: 0.95 // Slightly slower for clarity
        });

        const buffer = await mp3.arrayBuffer();

        return new Response(buffer, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Length": buffer.byteLength.toString(),
            },
        });

    } catch (error) {
        console.error("Neural TTS Error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});