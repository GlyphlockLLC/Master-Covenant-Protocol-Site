import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

const voiceProfiles = {
  professional: { lang: 'en-US', name: 'en-US-Neural2-A', speed: 1.0, pitch: 0 },
  friendly: { lang: 'en-US', name: 'en-US-Neural2-C', speed: 1.1, pitch: 2 },
  calm: { lang: 'en-GB', name: 'en-GB-Neural2-A', speed: 0.85, pitch: -2 },
  energetic: { lang: 'en-AU', name: 'en-AU-Neural2-B', speed: 1.2, pitch: 3 },
  thoughtful: { lang: 'en-GB', name: 'en-GB-Neural2-B', speed: 0.9, pitch: -1 },
  authoritative: { lang: 'en-US', name: 'en-US-Neural2-D', speed: 0.95, pitch: -3 },
  warm: { lang: 'en-US', name: 'en-US-Neural2-F', speed: 1.0, pitch: 1 },
  confident: { lang: 'en-AU', name: 'en-AU-Neural2-D', speed: 1.05, pitch: 0 },
  soothing: { lang: 'en-GB', name: 'en-GB-Neural2-F', speed: 0.88, pitch: -1 },
  dynamic: { lang: 'en-US', name: 'en-US-Neural2-G', speed: 1.15, pitch: 2 }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const isAuth = await base44.auth.isAuthenticated();
    
    if (!isAuth) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, voice = 'professional' } = await req.json();
    
    if (!text) {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    const profile = voiceProfiles[voice] || voiceProfiles.professional;
    
    // Use Google Translate TTS (free, no API key needed)
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${profile.lang.slice(0, 2)}&client=tw-ob&q=${encodeURIComponent(text)}`;
    
    const audioResponse = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!audioResponse.ok) {
      throw new Error('TTS service unavailable');
    }

    const audioData = await audioResponse.arrayBuffer();
    
    return new Response(audioData, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
        'X-Voice-Profile': voice
      }
    });

  } catch (error) {
    console.error('TTS Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});