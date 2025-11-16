import React from "react";
import TechStackCarousel from "@/components/TechStackCarousel";
import ComparisonSection from "@/components/ComparisonSection";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ServicesGrid from "@/components/home/ServicesGrid";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <div className="snap-scroll-container">
      <style jsx>{`
        .snap-scroll-container {
          scroll-snap-type: y mandatory;
          height: 100vh;
          width: 100vw;
          overflow-y: scroll;
          overflow-x: hidden;
        }
        
        .snap-section {
          scroll-snap-align: start;
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: 5rem;
          padding-bottom: 2rem;
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