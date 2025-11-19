import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const tones = [
  { value: 'professional', label: 'Professional', desc: 'Formal and business-like' },
  { value: 'casual', label: 'Casual', desc: 'Friendly and conversational' },
  { value: 'enthusiastic', label: 'Enthusiastic', desc: 'Energetic and exciting' },
  { value: 'informative', label: 'Informative', desc: 'Educational and factual' },
  { value: 'persuasive', label: 'Persuasive', desc: 'Convincing and motivating' },
  { value: 'humorous', label: 'Humorous', desc: 'Light and entertaining' },
  { value: 'empathetic', label: 'Empathetic', desc: 'Understanding and caring' },
  { value: 'authoritative', label: 'Authoritative', desc: 'Expert and confident' },
  { value: 'inspirational', label: 'Inspirational', desc: 'Uplifting and motivating' },
  { value: 'conversational', label: 'Conversational', desc: 'Natural and relatable' }
];

export default function ToneSelector({ selected, onSelect }) {
  return (
    <Select value={selected} onValueChange={onSelect}>
      <SelectTrigger className="glass-dark border-blue-500/30 text-white mt-2">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="glass-dark border-blue-500/30">
        {tones.map((tone) => (
          <SelectItem key={tone.value} value={tone.value}>
            <div className="flex flex-col">
              <span className="text-white font-medium">{tone.label}</span>
              <span className="text-white/60 text-xs">{tone.desc}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}