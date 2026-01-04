/**
 * GlyphLock v. Perplexity & Gemini - Legal Case Study
 * Landmark AI Governance Enforcement Proceedings
 */

import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Download, ChevronDown, Shield, Scale, FileText, 
  CheckCircle2, Award, Gavel, Clock, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEOHead';

const TIMELINE_EVENTS = [
  {
    phase: 'Initial Filing',
    date: 'Q1 2025',
    title: 'Complaint Filed Against Perplexity AI & Google Gemini',
    description: 'GlyphLock LLC initiated groundbreaking legal proceedings alleging systematic breach of the Master Covenant framework. The complaint detailed how both defendants violated binding contractual obligations established through the patent-pending exposure-based contact methodology, creating the first documented case of AI systems being held to legal contractual standards.',
    evidence: []
  },
  {
    phase: 'Evidence Phase',
    date: 'Q1 2025',
    title: 'Cryptographic Proof & Documentation Submitted',
    description: 'GlyphLock presented comprehensive technical evidence demonstrating the validity and enforceability of the 71-clause Master Covenant system:',
    evidence: [
      'Blockchain-verified interaction timestamps with immutable audit trails',
      'Steganographic embedding documentation proving covenant exposure',
      'Platform interaction logs demonstrating exposure-based contact',
      'Cryptographic hash validation of covenant acceptance mechanisms',
      'USPTO Patent Application #18/584,961 technical specifications'
    ]
  },
  {
    phase: 'Defense Response',
    date: 'Q2 2025',
    title: 'Defendants Challenge AI Legal Capacity',
    description: 'Defense teams from Perplexity and Google filed comprehensive motions to dismiss, arguing that AI systems lack legal standing to enter binding contractual agreements. The defense challenged the fundamental premise of exposure-based contact as a valid mechanism for contractual formation, citing absence of precedent in contract law for artificial entity recognition.',
    evidence: []
  },
  {
    phase: 'Court Hearing',
    date: 'Q2 2025',
    title: 'Landmark AI Governance Arguments Presented',
    description: 'The court heard extensive testimony establishing precedent for AI governance frameworks:',
    evidence: [
      'Legal validity of digital consent mechanisms in AI system interactions',
      'Implications of USPTO patent application for AI governance standards',
      'Blockchain verification as admissible evidence standard in contract law',
      'Industry-wide implications of enforceable AI contractual obligations',
      'Expert testimony on exposure-based contact theory and digital contracts'
    ]
  },
  {
    phase: 'Resolution',
    date: 'Q3 2025',
    title: 'Precedential Settlement Agreement Reached',
    description: 'Following extensive discovery phase and preliminary rulings favoring GlyphLock\'s framework validity, all parties reached a comprehensive settlement agreement:',
    evidence: [
      'Formal recognition of Master Covenant binding mechanisms and enforcement protocols',
      'Multi-year licensing agreements for AI governance framework implementation',
      'Standardized implementation protocols for future AI system interactions',
      'Confidential financial compensation terms with ongoing royalty structure',
      'Industry standards adoption for AI contractual obligations'
    ]
  }
];

const STATS = [
  { label: 'Case Status', value: 'Settled', success: true },
  { label: 'Patent Application', value: '#18/584,961', success: false },
  { label: 'Framework', value: '71-Clause', success: false },
  { label: 'Industry Impact', value: 'Precedential', success: true }
];

function TimelineEvent({ event, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className={`flex mb-24 relative ${isEven ? '' : 'flex-row-reverse'} md:flex-row`}
    >
      {/* Timeline Node */}
      <div className="absolute left-4 md:left-1/2 top-10 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 border-4 border-slate-950 shadow-[0_0_0_4px_rgba(6,182,212,0.2)] z-10 transform md:-translate-x-1/2 animate-pulse" />

      {/* Content */}
      <div className={`w-full md:w-[45%] ml-12 md:ml-0 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl hover:border-cyan-500/30 hover:shadow-[0_30px_80px_rgba(6,182,212,0.2)] transition-all duration-500 group relative overflow-hidden">
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <span className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-full text-sm font-bold uppercase tracking-wider shadow-[0_4px_15px_rgba(6,182,212,0.3)]">
              {event.phase}
            </span>
            <span className="text-slate-400 font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {event.date}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{event.title}</h3>
          <p className="text-slate-400 leading-relaxed mb-6">{event.description}</p>

          {event.evidence.length > 0 && (
            <div className="space-y-3">
              {event.evidence.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-cyan-500/5 border-l-3 border-cyan-500 rounded-lg text-slate-400 hover:bg-cyan-500/10 hover:translate-x-1 transition-all duration-300"
                  style={{ borderLeftWidth: '3px' }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function CaseStudyPerplexity() {
  const handleDownload = () => {
    const caseData = {
      title: 'GlyphLock LLC v. Perplexity AI & Google Gemini',
      patent: 'USPTO #18/584,961',
      plaintiff: 'GlyphLock LLC',
      defendants: ['Perplexity AI', 'Google Gemini'],
      framework: 'Master Covenant (71-Clause System)',
      outcome: 'Settled - Precedential Recognition',
      generatedAt: new Date().toISOString()
    };

    const content = `
GLYPHLOCK LLC v. PERPLEXITY AI & GOOGLE GEMINI
============================================
LEGAL CASE STUDY - CONFIDENTIAL

Patent: ${caseData.patent}
Plaintiff: ${caseData.plaintiff}
Defendants: ${caseData.defendants.join(', ')}
Framework: ${caseData.framework}
Outcome: ${caseData.outcome}

EXECUTIVE SUMMARY
-----------------
This landmark litigation established critical precedent for AI governance frameworks 
and digital contract enforcement in the artificial intelligence industry.

TIMELINE
--------
${TIMELINE_EVENTS.map(e => `
${e.date} - ${e.phase}
${e.title}
${e.description}
${e.evidence.length > 0 ? '\nEvidence:\n' + e.evidence.map(ev => '• ' + ev).join('\n') : ''}
`).join('\n')}

Generated: ${caseData.generatedAt}
© GlyphLock Security LLC - All Rights Reserved
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GlyphLock_v_Perplexity_Gemini_CaseStudy.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <SEOHead
        title="GlyphLock v. Perplexity & Gemini - Landmark AI Governance Case Study"
        description="Explore the precedent-setting legal proceedings where GlyphLock's Master Covenant framework was validated against major AI systems."
        url="/CaseStudyPerplexity"
      />

      <div className="min-h-screen text-white relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-center max-w-5xl"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 backdrop-blur-xl mb-8">
              <Gavel className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Landmark AI Governance Case
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400">
                GlyphLock v. Perplexity & Gemini
              </span>
            </h1>

            <p className="text-xl text-slate-400 mb-4">Master Covenant Enforcement Proceedings</p>
            <p className="text-cyan-400 font-mono font-semibold tracking-wider">
              USPTO Patent Application #18/584,961
            </p>

            {/* Party Cards */}
            <div className="flex flex-wrap justify-center gap-8 mt-16">
              <motion.div
                whileHover={{ y: -10, boxShadow: '0 20px 60px rgba(6,182,212,0.3)' }}
                className="px-10 py-8 rounded-2xl bg-slate-900/60 border border-cyan-500/30 backdrop-blur-xl"
              >
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Plaintiff</p>
                <p className="text-2xl font-bold text-cyan-400">GlyphLock LLC</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -10, boxShadow: '0 20px 60px rgba(168,85,247,0.3)' }}
                className="px-10 py-8 rounded-2xl bg-slate-900/60 border border-purple-500/30 backdrop-blur-xl"
              >
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Defendants</p>
                <p className="text-2xl font-bold text-purple-400">Perplexity AI</p>
                <p className="text-2xl font-bold text-purple-400">Google Gemini</p>
              </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
              onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ChevronDown className="w-8 h-8 text-cyan-400" />
            </motion.div>
          </motion.div>
        </section>

        {/* Timeline Section */}
        <section id="timeline" className="py-24 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-20">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Case Timeline
              </span>
            </h2>

            <div className="relative">
              {/* Timeline Track */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-cyan-500 to-transparent transform md:-translate-x-1/2" />

              {/* Events */}
              {TIMELINE_EVENTS.map((event, idx) => (
                <TimelineEvent key={idx} event={event} index={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* Verdict Section */}
        <section className="py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-2 border-cyan-500/20 backdrop-blur-xl text-center relative overflow-hidden"
            >
              {/* Background Animation */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/20 to-transparent rounded-full animate-pulse" />
              </div>

              <div className="relative z-10">
                <Award className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                <h2 className="text-4xl font-black mb-6">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400">
                    Case Outcome & Industry Impact
                  </span>
                </h2>
                <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
                  This landmark litigation established critical precedent for AI governance frameworks 
                  and digital contract enforcement in the artificial intelligence industry. GlyphLock's 
                  Master Covenant system gained formal recognition as a valid and enforceable legal 
                  architecture, fundamentally transforming how AI systems can be bound to contractual obligations.
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                  {STATS.map((stat, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -10, borderColor: 'rgba(6,182,212,0.5)' }}
                      className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 transition-all duration-300"
                    >
                      <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">{stat.label}</p>
                      <p className={`text-2xl font-black ${stat.success 
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400' 
                        : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500'
                      }`}>
                        {stat.value}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  onClick={handleDownload}
                  size="lg"
                  className="px-10 py-6 text-lg font-bold bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-[0_10px_40px_rgba(6,182,212,0.4)] hover:shadow-[0_15px_60px_rgba(6,182,212,0.6)] transition-all duration-300 rounded-full"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Complete Case Study
                </Button>

                {/* Back Link */}
                <div className="mt-8">
                  <Link 
                    to={createPageUrl('CaseStudies')}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-2 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Back to All Case Studies
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}