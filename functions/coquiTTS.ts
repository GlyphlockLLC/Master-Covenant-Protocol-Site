import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

/**
 * Coqui Local TTS (Open Source)
 * Fallback to StreamElements if not configured
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      text,
      voice = 'default',
      speed = 1.0,
      pitch = 1.0
    } = body;

    if (!text) {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    // Check if Coqui TTS is configured (local deployment)
    const coquiEndpoint = Deno.env.get('COQUI_TTS_ENDPOINT');
    
    if (coquiEndpoint) {
      try {
        const response = await fetch(`${coquiEndpoint}/api/tts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            speaker_id: voice,
            speed,
            pitch
          })
        });

        if (!response.ok) {
          throw new Error('Coqui TTS failed');
        }

        const audioBlob = await response.blob();
        const { file_url } = await base44.integrations.Core.UploadFile({ file: audioBlob });
        
        return Response.json({
          success: true,
          audioUrl: file_url
        });
      } catch (error) {
        console.error('Coqui TTS error:', error);
        // Fall through to StreamElements fallback
      }
    }

    // Fallback to StreamElements (free, no API key needed)
    const seVoice = voice === 'default' ? 'Joanna' : voice;
    const audioUrl = `https://api.streamelements.com/kappa/v2/speech?voice=${seVoice}&text=${encodeURIComponent(text)}`;

    return Response.json({
      success: true,
      audioUrl
    });

  } catch (error) {
    console.error('TTS error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});