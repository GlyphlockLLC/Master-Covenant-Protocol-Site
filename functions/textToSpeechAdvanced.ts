import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

/**
 * GlyphLock Advanced TTS Gateway
 * Supports: Google Cloud, Microsoft Azure, ElevenLabs, OpenAI
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
      provider = 'streamelements',
      voice,
      speed = 1.0,
      pitch = 1.0,
      stability,
      similarity,
      style,
      useSpeakerBoost
    } = body;

    if (!text) {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    let audioUrl = null;

    // Google Cloud TTS
    if (provider === 'google') {
      const apiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY');
      if (!apiKey) {
        throw new Error('Google Cloud API key not configured');
      }

      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text },
            voice: {
              languageCode: 'en-US',
              name: voice || 'en-US-Neural2-A'
            },
            audioConfig: {
              audioEncoding: 'MP3',
              speakingRate: speed,
              pitch: (pitch - 1.0) * 20
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Google TTS failed: ${response.statusText}`);
      }

      const data = await response.json();
      const audioBuffer = Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0));
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mp3' });
      const { file_url } = await base44.integrations.Core.UploadFile({ file: audioBlob });
      audioUrl = file_url;
    }

    // Microsoft Azure TTS
    else if (provider === 'microsoft') {
      const apiKey = Deno.env.get('AZURE_SPEECH_KEY');
      const region = Deno.env.get('AZURE_SPEECH_REGION') || 'eastus';
      
      if (!apiKey) {
        throw new Error('Azure Speech API key not configured');
      }

      const ssml = `
        <speak version='1.0' xml:lang='en-US'>
          <voice name='${voice || 'en-US-JennyNeural'}'>
            <prosody rate='${speed}' pitch='${(pitch - 1.0) * 50}%'>
              ${text}
            </prosody>
          </voice>
        </speak>
      `;

      const response = await fetch(
        `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
        {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': apiKey,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3'
          },
          body: ssml
        }
      );

      if (!response.ok) {
        throw new Error(`Azure TTS failed: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const { file_url } = await base44.integrations.Core.UploadFile({ file: audioBlob });
      audioUrl = file_url;
    }

    // ElevenLabs TTS
    else if (provider === 'elevenlabs') {
      const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
      if (!apiKey) {
        throw new Error('ElevenLabs API key not configured');
      }

      const voiceId = getElevenLabsVoiceId(voice || 'Rachel');

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: stability || 0.5,
              similarity_boost: similarity || 0.75,
              style: style || 0.0,
              use_speaker_boost: useSpeakerBoost !== false
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs TTS failed: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const { file_url } = await base44.integrations.Core.UploadFile({ file: audioBlob });
      audioUrl = file_url;
    }

    // OpenAI TTS
    else if (provider === 'openai') {
      const apiKey = Deno.env.get('OPENAI_API_KEY');
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
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
          voice: voice || 'alloy',
          speed
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI TTS failed: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const { file_url } = await base44.integrations.Core.UploadFile({ file: audioBlob });
      audioUrl = file_url;
    }

    // StreamElements (free fallback)
    else {
      audioUrl = `https://api.streamelements.com/kappa/v2/speech?voice=${voice || 'Joanna'}&text=${encodeURIComponent(text)}`;
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

function getElevenLabsVoiceId(voiceName) {
  const voices = {
    'Rachel': '21m00Tcm4TlvDq8ikWAM',
    'Domi': 'AZnzlk1XvdvUeBnXmlld',
    'Bella': 'EXAVITQu4vr4xnSDxMaL',
    'Antoni': 'ErXwobaYiN019PkySvjV',
    'Elli': 'MF3mGyEYCl7XYWbV9V6O',
    'Josh': 'TxGEqnHWrfWFTfGW9XjX',
    'Arnold': 'VR6AewLTigWG4xSOukaG',
    'Adam': 'pNInz6obpgDQGcFmaJgB'
  };
  return voices[voiceName] || voices['Rachel'];
}