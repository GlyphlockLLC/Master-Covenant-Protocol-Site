import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

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
      provider = 'elevenlabs',
      voice = 'Rachel',
      speed = 1.0,
      pitch = 1.0,
      stability = 0.5,
      similarity = 0.75,
      style = 0.0,
      useSpeakerBoost = true
    } = body;

    if (!text) {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    let audioUrl = null;

    // ElevenLabs TTS (celebrity voices, high quality)
    if (provider === 'elevenlabs') {
      const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
      if (!apiKey) {
        return Response.json({ error: 'ElevenLabs API key not configured' }, { status: 500 });
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability,
            similarity_boost: similarity,
            style,
            use_speaker_boost: useSpeakerBoost
          }
        })
      });

      if (!response.ok) {
        throw new Error('ElevenLabs TTS failed');
      }

      const audioBlob = await response.blob();
      const { file_url } = await base44.integrations.Core.UploadFile({ file: audioBlob });
      audioUrl = file_url;
    }

    // OpenAI TTS
    else if (provider === 'openai') {
      const apiKey = Deno.env.get('OPENAI_API_KEY');
      if (!apiKey) {
        return Response.json({ error: 'OpenAI API key not configured' }, { status: 500 });
      }

      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: voice,
          speed: speed
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI TTS failed');
      }

      const audioBlob = await response.blob();
      const { file_url } = await base44.integrations.Core.UploadFile({ file: audioBlob });
      audioUrl = file_url;
    }

    // Google Cloud TTS
    else if (provider === 'google') {
      const apiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY');
      if (!apiKey) {
        return Response.json({ error: 'Google Cloud API key not configured' }, { status: 500 });
      }

      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: 'en-US',
            name: voice
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: speed,
            pitch: (pitch - 1) * 20
          }
        })
      });

      if (!response.ok) {
        throw new Error('Google TTS failed');
      }

      const result = await response.json();
      const audioBuffer = Uint8Array.from(atob(result.audioContent), c => c.charCodeAt(0));
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const { file_url } = await base44.integrations.Core.UploadFile({ file: audioBlob });
      audioUrl = file_url;
    }

    // Microsoft Azure TTS
    else if (provider === 'microsoft') {
      const apiKey = Deno.env.get('AZURE_SPEECH_KEY');
      const region = Deno.env.get('AZURE_SPEECH_REGION') || 'eastus';
      
      if (!apiKey) {
        return Response.json({ error: 'Azure Speech key not configured' }, { status: 500 });
      }

      const ssml = `<speak version='1.0' xml:lang='en-US'>
        <voice name='${voice}'>
          <prosody rate='${speed}' pitch='${(pitch - 1) * 50}%'>${text}</prosody>
        </voice>
      </speak>`;

      const response = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
        },
        body: ssml
      });

      if (!response.ok) {
        throw new Error('Azure TTS failed');
      }

      const audioBlob = await response.blob();
      const { file_url } = await base44.integrations.Core.UploadFile({ file: audioBlob });
      audioUrl = file_url;
    }

    // StreamElements (free fallback)
    else if (provider === 'streamelements') {
      audioUrl = `https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=${encodeURIComponent(text)}`;
    }

    return Response.json({
      success: true,
      audioUrl
    });

  } catch (error) {
    console.error('TTS error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});