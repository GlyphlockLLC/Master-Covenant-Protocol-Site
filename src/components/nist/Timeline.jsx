/**
 * NIST Challenge Timeline Component
 * Key milestones and deadlines
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TIMELINE_EVENTS = [
  {
    date: 'Nov 22, 2025',
    title: 'Registration Open',
    description: 'NIST GenAI Challenge registration window begins',
    status: 'completed',
    type: 'milestone'
  },
  {
    date: 'Dec 15, 2025',
    title: 'GlyphLock Registers',
    description: 'Official participation confirmed across Text, Image, Code tracks',
    status: 'completed',
    type: 'glyphlock'
  },
  {
    date: 'Jan 7, 2026',
    title: 'Registration Closes',
    description: 'Final day for new participant entries',
    status: 'completed',
    type: 'milestone'
  },
  {
    date: 'Jan 28, 2026',
    title: 'Dry-Run Submission',
    description: 'Test submission to validate system compatibility',
    status: 'pending',
    type: 'glyphlock'
  },
  {
    date: 'Feb 11, 2026',
    title: 'Dry-Run Feedback',
    description: 'NIST provides technical feedback on submission format',
    status: 'pending',
    type: 'milestone'
  },
  {
    date: 'Apr 22, 2026',
    title: 'Evaluation Submission',
    description: 'Final system submission for official evaluation',
    status: 'pending',
    type: 'glyphlock'
  },
  {
    date: 'Jun 17, 2026',
    title: 'Evaluation Complete',
    description: 'NIST completes all system evaluations',
    status: 'pending',
    type: 'milestone'
  },
  {
    date: 'Summer 2026',
    title: 'Results Published',
    description: 'Official performance metrics and rankings released',
    status: 'pending',
    type: 'milestone'
  }
];

export default function Timeline() {
  return (
    <section id="timeline" className="timeline-section py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Challenge Timeline</h2>
            <p className="text-lg text-gray-600">Track GlyphLock's progress through NIST evaluation</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 -translate-x-1/2" />

            {/* Events */}
            <div className="space-y-8">
              {TIMELINE_EVENTS.map((event, idx) => (
                <TimelineEvent key={idx} event={event} index={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineEvent({ event, index }) {
  const isLeft = index % 2 === 0;
  const StatusIcon = event.status === 'completed' ? CheckCircle : event.status === 'pending' ? Clock : AlertCircle;
  const statusColor = event.status === 'completed' ? 'text-green-500' : 'text-blue-500';
  const isGlyphLock = event.type === 'glyphlock';

  return (
    <div className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}>
      {/* Timeline Node */}
      <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-white border-4 border-blue-500 -translate-x-1/2 z-10 flex items-center justify-center">
        <StatusIcon className={`w-4 h-4 ${statusColor}`} />
      </div>

      {/* Content */}
      <div className={`w-full md:w-5/12 ${isLeft ? 'md:pr-12 pl-16' : 'md:pl-12 pl-16'} md:pl-0`}>
        <div className={`p-4 md:p-6 rounded-lg shadow-md ${isGlyphLock ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-600">{event.date}</span>
            {isGlyphLock && (
              <Badge className="bg-blue-600 text-white text-xs">GlyphLock</Badge>
            )}
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
          <p className="text-sm text-gray-600">{event.description}</p>
        </div>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden md:block w-5/12" />
    </div>
  );
}