import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Volume2, Sparkles, Zap, Play, Square, Settings2 } from "lucide-react";
import { toast } from "sonner";

export default function VoiceSettingsUnified({ settings, onChange, compact = false }) {
  const [provider, setProvider] = useState(settings?.provider || "openai");
  const [voice, setVoice] = useState(settings?.voice || "alloy");
  const [speed, setSpeed] = useState(settings?.speed || 1.0);
  const [pitch, setPitch] = useState(settings?.pitch || 1.0);
  const [volume, setVolume] = useState(settings?.volume || 1.0);
  const [bass, setBass] = useState(settings?.bass || 0);
  const [mid, setMid] = useState(settings?.mid || 0);
  const [treble, setTreble] = useState(settings?.treble || 0);

  useEffect(() => {
    onChange?.({
      provider,
      voice,
      speed,
      pitch,
      volume,
      bass,
      mid,
      treble
    });
  }, [provider, voice, speed, pitch, volume, bass, mid, treble]);

  const handlePreview = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Hello! This is a preview of my voice.");
      utterance.rate = speed;
      utterance.pitch = pitch;
      utterance.volume = volume;
      window.speechSynthesis.speak(utterance);
      toast.success("Playing voice preview");
    }
  };

  const content = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Voice Settings
          </h3>
        </div>
        <Button onClick={handlePreview} size="sm" variant="ghost" className="gap-1">
          <Play className="w-3 h-3" />
          Test
        </Button>
      </div>

      <div className="space-y-3">
        <SliderControl
          label="Speed"
          value={speed}
          onChange={setSpeed}
          min={0.5}
          max={2.0}
          step={0.05}
          format={(v) => `${v.toFixed(2)}x`}
        />

        <SliderControl
          label="Pitch"
          value={pitch}
          onChange={setPitch}
          min={0.5}
          max={2.0}
          step={0.05}
          format={(v) => `${v.toFixed(2)}`}
        />

        <SliderControl
          label="Volume"
          value={volume}
          onChange={setVolume}
          min={0}
          max={1}
          step={0.05}
          format={(v) => `${Math.round(v * 100)}%`}
        />
      </div>

      <div className="pt-3 border-t border-cyan-500/20 space-y-3">
        <Label className="text-xs text-cyan-300 font-bold">Equalizer</Label>
        
        <div className="grid grid-cols-3 gap-2">
          <EQSlider label="Bass" value={bass} onChange={setBass} />
          <EQSlider label="Mid" value={mid} onChange={setMid} />
          <EQSlider label="Treble" value={treble} onChange={setTreble} />
        </div>

        <Button
          onClick={() => { setBass(0); setMid(0); setTreble(0); }}
          variant="outline"
          size="sm"
          className="w-full text-xs"
        >
          Reset EQ
        </Button>
      </div>
    </div>
  );

  if (compact) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Settings2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voice</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-slate-950/95 border-purple-500/40" align="end">
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-br from-[#0a0d14] to-[#0f1419] rounded-2xl border border-cyan-500/20">
      {content}
    </div>
  );
}

function SliderControl({ label, value, onChange, min, max, step, format }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <Label className="text-xs text-gray-300">{label}</Label>
        <span className="text-cyan-400 text-xs font-mono">{format(value)}</span>
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

function EQSlider({ label, value, onChange }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] text-cyan-300 mb-1 font-medium">{label}</span>
      <div className="h-20 flex items-center">
        <Slider
          orientation="vertical"
          value={[value]}
          onValueChange={(v) => onChange(v[0])}
          min={-12}
          max={12}
          step={1}
          className="h-16"
        />
      </div>
      <span className={`text-[10px] mt-1 font-mono ${value > 0 ? 'text-cyan-300' : value < 0 ? 'text-rose-300' : 'text-slate-400'}`}>
        {value > 0 ? '+' : ''}{value}dB
      </span>
    </div>
  );
}