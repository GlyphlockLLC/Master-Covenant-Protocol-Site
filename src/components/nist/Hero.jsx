/**
 * NIST Challenge Hero Section - Federal Grade
 * Clean, professional federal styling with integrated branding
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import CountdownTimer from '@/components/ui/CountdownTimer';

export default function Hero() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1] py-16 md:py-24">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(15,23,42,0.03) 1px, transparent 1px),
              linear-gradient(rgba(15,23,42,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* NIST x GlyphLock Branding */}
        <div className="max-w-5xl mx-auto mb-12">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/8dfe928b5_600dbe4b-1ef2-48e9-ac08-a02a1f4879e5.png"
            alt="NIST x GlyphLock - GenAI Challenge Participant 2026"
            className="w-full h-auto"
            loading="eager"
          />
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Button
            size="lg"
            className="bg-blue-700 text-white hover:bg-blue-800 font-semibold shadow-lg px-8 py-6 text-lg"
            onClick={() => scrollToSection('technical')}
            aria-label="View Technical Approach section"
          >
            View Technical Approach
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-gray-700 text-gray-900 hover:bg-gray-100 font-semibold shadow-lg px-8 py-6 text-lg"
            onClick={() => scrollToSection('timeline')}
            aria-label="Track progress timeline"
          >
            Track Our Progress
          </Button>
        </div>

        {/* Countdown Timer Container */}
        <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl p-6 md:p-8 border-2 border-gray-300 shadow-xl" role="timer" aria-label="Countdown to dry-run submission">
          <div className="text-center text-gray-900 mb-4 text-base md:text-lg font-bold uppercase tracking-wide">
            Days Until Dry-Run Submission
          </div>
          <CountdownTimer targetDate="2026-01-28T00:00:00" />
        </div>
      </div>
    </section>
  );
}