/**
 * CTA Section Component
 * Final conversion section
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CTASection() {
  return (
    <section className="cta-section py-16 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Implement Accountable AI?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            GlyphLock's Master Covenant framework brings federal-grade AI accountability 
            to your enterprise. Request early access to our platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to={createPageUrl('Consultation')}>
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 w-full sm:w-auto">
                <Mail className="w-5 h-5 mr-2" />
                Schedule Consultation
              </Button>
            </Link>
            <Link to={createPageUrl('Contact')}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                <FileText className="w-5 h-5 mr-2" />
                Request Demo
              </Button>
            </Link>
          </div>

          {/* Use Cases */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <UseCaseCard
              icon="⚖️"
              title="Legal & Compliance"
              description="AI governance for law firms and regulatory bodies"
            />
            <UseCaseCard
              icon="📰"
              title="Media & Publishing"
              description="Content authenticity verification"
            />
            <UseCaseCard
              icon="🏦"
              title="Financial Services"
              description="AI-generated report validation"
            />
            <UseCaseCard
              icon="🏥"
              title="Healthcare"
              description="Medical AI accountability"
            />
          </div>

          {/* Social Proof */}
          <div className="border-t border-blue-400/30 pt-8">
            <p className="text-sm text-blue-200 mb-4">
              Validated by NIST • Patent-Pending Technology • Enterprise Ready
            </p>
            <div className="flex justify-center gap-6 flex-wrap">
              <Link to={createPageUrl('About')} className="text-sm text-blue-200 hover:text-white transition-colors">
                Learn More About GlyphLock
              </Link>
              <Link to={createPageUrl('MasterCovenant')} className="text-sm text-blue-200 hover:text-white transition-colors">
                Read Master Covenant Spec
              </Link>
              <Link to={createPageUrl('Pricing')} className="text-sm text-blue-200 hover:text-white transition-colors">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UseCaseCard({ icon, title, description }) {
  return (
    <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="font-bold text-white mb-1">{title}</h4>
      <p className="text-xs text-blue-100">{description}</p>
    </div>
  );
}