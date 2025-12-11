/**
 * NIST Challenge Hero Section
 * Countdown timer + main value proposition
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Hero() {
  const [timeUntilDryRun, setTimeUntilDryRun] = useState(calculateTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilDryRun(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function calculateTimeRemaining() {
    const dryRunDate = new Date('2026-01-28T00:00:00');
    const now = new Date();
    const diff = dryRunDate.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000)
    };
  }

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section relative overflow-hidden bg-gradient-to-br from-[#1a365d] to-[#2c5282] py-20 md:py-32">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* NIST + GlyphLock Branding */}
        <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
          <div className="text-white text-3xl md:text-4xl font-bold">NIST</div>
          <span className="text-3xl md:text-4xl text-white">×</span>
          <div className="text-white text-3xl md:text-4xl font-bold">GLYPHLOCK</div>
        </div>

        {/* Participant Badge */}
        <div className="flex justify-center mb-6">
          <Badge variant="outline" className="text-white border-white px-6 py-2 text-sm">
            NIST GenAI Challenge Participant 2026
          </Badge>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-6">
          Federal Validation in Progress
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl text-gray-200 text-center mb-8 max-w-3xl mx-auto">
          Competing in NIST GenAI Challenge Across Three AI Modalities
        </p>

        {/* Modality Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Badge className="bg-blue-500/20 text-white border-blue-300 px-4 md:px-6 py-2 md:py-3 text-base md:text-lg">
            📝 Text
          </Badge>
          <Badge className="bg-blue-500/20 text-white border-blue-300 px-4 md:px-6 py-2 md:py-3 text-base md:text-lg">
            🖼️ Image
          </Badge>
          <Badge className="bg-blue-500/20 text-white border-blue-300 px-4 md:px-6 py-2 md:py-3 text-base md:text-lg">
            💻 Code
          </Badge>
        </div>

        {/* Value Proposition */}
        <p className="text-base md:text-lg text-gray-200 text-center italic mb-12 max-w-2xl mx-auto px-4">
          "The world's first legal-technical AI accountability platform validated through federal evaluation"
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            size="lg"
            className="bg-white text-blue-900 hover:bg-gray-100"
            onClick={() => scrollToSection('technical')}
          >
            View Technical Approach
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10"
            onClick={() => scrollToSection('timeline')}
          >
            Track Our Progress
          </Button>
        </div>

        {/* Countdown Timer */}
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-white/20">
          <div className="text-center text-white mb-4 text-base md:text-lg">
            Days Until Dry-Run Submission
          </div>
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            <CountdownUnit value={timeUntilDryRun.days} label="Days" />
            <CountdownUnit value={timeUntilDryRun.hours} label="Hours" />
            <CountdownUnit value={timeUntilDryRun.minutes} label="Minutes" />
            <CountdownUnit value={timeUntilDryRun.seconds} label="Seconds" />
          </div>
        </div>
      </div>
    </section>
  );
}

function CountdownUnit({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs md:text-sm text-gray-200 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}