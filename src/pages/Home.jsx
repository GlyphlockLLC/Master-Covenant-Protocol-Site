import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import TechStackCarousel from '@/components/TechStackCarousel';
import ComparisonSection from '@/components/ComparisonSection';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import CTASection from '@/components/home/CTASection';

const useScrollEffect = (ref) => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const { top, height } = ref.current.getBoundingClientRect();
        const screenHeight = window.innerHeight;
        
        const elementCenter = top + height / 2;
        const screenCenter = screenHeight / 2;
        const distance = screenCenter - elementCenter;
        
        const factor = distance / (screenCenter * 1.2);

        const rotation = -factor * 15;
        const scale = 1 - Math.abs(factor) * 0.15;
        const opacity = 1 - Math.abs(factor) * 0.5;

        setStyle({
          transform: `perspective(1000px) rotateX(${rotation}deg) scale(${scale})`,
          opacity: Math.max(0, opacity),
          transition: 'transform 0.1s linear, opacity 0.1s linear',
        });
      }
    };
    
    const scrollContainer = document.getElementById('scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [ref]);

  return style;
};

const ScrollSection = ({ children }) => {
  const ref = useRef(null);
  const style = useScrollEffect(ref);
  return (
    <section ref={ref} className="h-screen w-full flex items-center justify-center relative">
      <div style={style} className="w-full">
        {children}
      </div>
    </section>
  );
};

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
    <div id="scroll-container" className="h-screen w-full overflow-y-scroll overflow-x-hidden">
        
        <ScrollSection>
            <HeroSection />
        </ScrollSection>

        <ScrollSection>
            <ServicesGrid />
        </ScrollSection>
        
        <ScrollSection>
            <div className="w-full max-w-7xl mx-auto px-4">
                <TechStackCarousel />
            </div>
        </ScrollSection>

        <ScrollSection>
            <FeaturesSection />
        </ScrollSection>
        
        <ScrollSection>
            <ComparisonSection />
        </ScrollSection>

        <ScrollSection>
            <CTASection />
        </ScrollSection>
    </div>
  );
}