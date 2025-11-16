import React from 'react';
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import TechStackCarousel from '@/components/TechStackCarousel';
import ComparisonSection from '@/components/ComparisonSection';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      navigate(createPageUrl("Consultation") + `?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="scroll-snap-y scroll-snap-mandatory h-screen w-full overflow-y-scroll overflow-x-hidden">
      
      <style jsx>{`
        .snap-section {
          scroll-snap-align: start;
          min-height: 100vh;
          width: 100%;
          padding-top: 5rem;
          padding-bottom: 5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <section className="snap-section">
        <HeroSection />
      </section>

      <section className="snap-section">
        <ServicesGrid />
      </section>
      
      <section className="snap-section">
        <div className="w-full max-w-7xl mx-auto px-4">
            <TechStackCarousel />
        </div>
      </section>

      <section className="snap-section">
        <FeaturesSection />
      </section>
      
      <section className="snap-section">
        <ComparisonSection />
      </section>

      <section className="snap-section">
        <CTASection />
      </section>

    </div>
  );
}