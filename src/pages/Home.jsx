import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import TechStackCarousel from '@/components/TechStackCarousel';
import ComparisonSection from '@/components/ComparisonSection';
import HeroSection from '@/components/home/HeroSection';
import HeroContent from '@/components/home/HeroContent';
import FeaturesSection from '@/components/home/FeaturesSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import BoundAICards from '@/components/home/BoundAICards';
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
    <div className="w-full">
        <div className="w-full py-8">
            <HeroSection />
        </div>

        <div className="w-full py-8">
            <HeroContent />
        </div>

        <div className="w-full py-8">
            <ServicesGrid />
        </div>

        <div className="w-full py-8">
            <BoundAICards />
        </div>

        <div className="w-full py-8">
            <FeaturesSection />
        </div>
        
        <div className="w-full py-8">
            <ComparisonSection />
        </div>
        
        <div className="w-full py-8">
            <TechStackCarousel />
        </div>

        <div className="w-full py-8">
            <CTASection />
        </div>
    </div>
  );
}