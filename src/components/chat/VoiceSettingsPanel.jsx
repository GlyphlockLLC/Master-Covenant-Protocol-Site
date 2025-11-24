import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Volume2, Sparkles, Zap } from 'lucide-react';

export default function VoiceSettingsPanel({ settings, onSettingsChange }) {
  const updateSetting = (key, value) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const voiceOptions = {
    elevenlabs: [
      { value: 'Rachel', label: 'Rachel (Natural)' },
      { value: 'Domi', label: 'Domi (Warm)' },
      { value: 'Bella', label: 'Bella (Soft)' },
      { value: 'Antoni', label: 'Antoni (Deep)' },
      { value: 'Elli', label: 'Elli (Energetic)' },
      { value: 'Josh', label: 'Josh (Professional)' },
      { value: 'Arnold', label: 'Arnold (Celebrity)' },
      { value: 'Adam', label: 'Adam (Narrative)' }
    ],
    openai: [
      { value: 'alloy', label: 'Alloy' },
      { value: 'echo', label: 'Echo' },
      { value: 'fable', label: 'Fable' },
      { value: 'onyx', label: 'Onyx' },
      { value: 'nova', label: 'Nova' },
      { value: 'shimmer', label: 'Shimmer' }
    ],
    google: [
      { value: 'en-US-Neural2-A', label: 'Neural2 A (Female)' },
      { value: 'en-US-Neural2-C', label: 'Neural2 C (Female)' },
      { value: 'en-US-Neural2-D', label: 'Neural2 D (Male)' },
      { value: 'en-US-Neural2-F', label: 'Neural2 F (Female)' },
      { value: 'en-US-Neural2-J', label: 'Neural2 J (Male)' }
    ],
    microsoft: [
      { value: 'en-US-JennyNeural', label: 'Jenny (Female)' },
      { value: 'en-US-GuyNeural', label: 'Guy (Male)' },
      { value: 'en-US-AriaNeural', label: 'Aria (Female)' },
      { value: 'en-US-DavisNeural', label: 'Davis (Male)' },
      { value: 'en-US-JaneNeural', label: 'Jane (Female)' }
    ],
    streamelements: [
      { value: 'Joanna', label: 'Joanna' },
      { value: 'Matthew', label: 'Matthew' },
      { value: 'Amy', label: 'Amy' },
      { value: 'Brian', label: 'Brian' }
    ],
    coqui: [
      { value: 'default', label: 'Default Voice' },
      { value: 'jenny', label: 'Jenny' },
      { value: 'p273', label: 'P273 (British Male)' }
    ]
  };

  return (
    <Card className="bg-black/90 border-cyan-500/30 backdrop-blur-xl">
      <CardHeader className="border-b border-cyan-500/20">
        <CardTitle className="flex items-center gap-2 text-white">
          <Volume2 className="w-5 h-5 text-cyan-400" />
          Voice Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Provider Selection */}
        <div className="space-y-2">
          <Label className="text-gray-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            TTS Provider
          </Label>
          <Select value={settings.provider} onValueChange={(v) => updateSetting('provider', v)}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="elevenlabs">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  ElevenLabs (Celebrity Voices)
                </span>
              </SelectItem>
              <SelectItem value="openai">OpenAI TTS</SelectItem>
              <SelectItem value="google">Google Cloud TTS</SelectItem>
              <SelectItem value="microsoft">Microsoft Azure TTS</SelectItem>
              <SelectItem value="streamelements">StreamElements (Free)</SelectItem>
              <SelectItem value="coqui">Coqui Local (Open Source)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Voice Selection */}
        <div className="space-y-2">
          <Label className="text-gray-300">Voice</Label>
          <Select value={settings.voice} onValueChange={(v) => updateSetting('voice', v)}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(voiceOptions[settings.provider] || []).map((voice) => (
                <SelectItem key={voice.value} value={voice.value}>
                  {voice.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Basic Controls */}
        <VoiceSlider
          label="Speed"
          value={settings.speed}
          onChange={(v) => updateSetting('speed', v)}
          min={0.5}
          max={2.0}
          step={0.1}
          unit="x"
        />

        <VoiceSlider
          label="Pitch"
          value={settings.pitch}
          onChange={(v) => updateSetting('pitch', v)}
          min={0.5}
          max={2.0}
          step={0.1}
          unit=""
        />

        {/* Audio Processing */}
        <div className="pt-4 border-t border-gray-800">
          <Label className="text-gray-300 flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-cyan-400" />
            Audio Processing
          </Label>

          <div className="space-y-4">
            <VoiceSlider
              label="Bass"
              value={settings.bass}
              onChange={(v) => updateSetting('bass', v)}
              min={-10}
              max={10}
              step={1}
              unit="dB"
            />

            <VoiceSlider
              label="Treble"
              value={settings.treble}
              onChange={(v) => updateSetting('treble', v)}
              min={-10}
              max={10}
              step={1}
              unit="dB"
            />

            <VoiceSlider
              label="Mid"
              value={settings.mid}
              onChange={(v) => updateSetting('mid', v)}
              min={-10}
              max={10}
              step={1}
              unit="dB"
            />

            <VoiceSlider
              label="Depth (Delay)"
              value={settings.depth}
              onChange={(v) => updateSetting('depth', v)}
              min={0}
              max={1}
              step={0.1}
              unit="s"
            />

            <VoiceSlider
              label="Accent Strength"
              value={settings.accent}
              onChange={(v) => updateSetting('accent', v)}
              min={0}
              max={10}
              step={1}
              unit=""
            />
          </div>
        </div>

        {/* ElevenLabs Advanced Settings */}
        {settings.provider === 'elevenlabs' && (
          <div className="pt-4 border-t border-gray-800">
            <Label className="text-gray-300 mb-4 block">ElevenLabs Advanced</Label>
            
            <div className="space-y-4">
              <VoiceSlider
                label="Stability"
                value={settings.stability}
                onChange={(v) => updateSetting('stability', v)}
                min={0}
                max={1}
                step={0.05}
                unit=""
              />

              <VoiceSlider
                label="Similarity"
                value={settings.similarity}
                onChange={(v) => updateSetting('similarity', v)}
                min={0}
                max={1}
                step={0.05}
                unit=""
              />

              <VoiceSlider
                label="Style"
                value={settings.style}
                onChange={(v) => updateSetting('style', v)}
                min={0}
                max={1}
                step={0.05}
                unit=""
              />

              <div className="flex items-center justify-between py-2">
                <Label className="text-gray-300">Speaker Boost</Label>
                <Switch
                  checked={settings.useSpeakerBoost}
                  onCheckedChange={(v) => updateSetting('useSpeakerBoost', v)}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function VoiceSlider({ label, value, onChange, min, max, step, unit }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-gray-300">{label}</Label>
        <span className="text-cyan-400 text-sm font-mono">
          {value.toFixed(step < 0.1 ? 2 : 1)}{unit}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
}