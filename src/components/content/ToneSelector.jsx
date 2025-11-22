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
      <SelectTrigger className="bg-[#0A0F24]/90 border-[#00E4FF]/30 text-white mt-2 hover:border-[#00E4FF]/50">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-[#0A0F24]/98 border-[#00E4FF]/30 backdrop-blur-xl">
        {tones.map((tone) => (
          <SelectItem key={tone.value} value={tone.value} className="text-white hover:bg-[#00E4FF]/10 focus:bg-[#00E4FF]/10 focus:text-[#00E4FF]">
            <div className="flex flex-col">
              <span className="font-medium">{tone.label}</span>
              <span className="text-white/60 text-xs">{tone.desc}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}