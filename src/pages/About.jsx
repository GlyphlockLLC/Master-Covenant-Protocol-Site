import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Target, Award, TrendingUp, Users, Zap, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function About() {
  const timeline = [
    {
      period: "The Beginning",
      title: "Revolutionary Insight",
      description: "GlyphLock began with a revolutionary insight: camouflage could carry hidden data—an image could be scanned steganographically to reveal secured information. Built first in a studio and a security office, our early prototypes combined scannable imagery and concealed data, proving that protection could exist invisibly inside creative form."
    },
    {
      period: "Market Validation",
      title: "$340K in 90 Days",
      description: "GlyphLock earned $340,000 in verified revenue within its first 90 days of operation. The figure was confirmed through Dun & Bradstreet verification, establishing market proof of concept long before venture capital became involved."
    },
    {
      period: "AI Binding Innovation",
      title: "Master Covenant System",
      description: "We developed AI Binding—a governance system that connects artificial intelligence behavior to written law through coded agreements called the Master Covenant. Each AI bound within this structure operates under legal and ethical accountability, creating a digital environment where automation is answerable."
    },
    {
      period: "DeepSeek Response",
      title: "Strategic Evolution",
      description: "In 2025, the DeepSeek Escalation exposed global weaknesses in AI and IP protection. GlyphLock used that moment to evolve, pivoting from scannable imagery toward complete IP defense and contractual protection. The redesign positioned GlyphLock as a leader in authentication, verification, and international digital sovereignty."
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Proof Above Persuasion",
      description: "Technology must survive chaos as easily as it performs in theory. We build systems where authenticity is not a statement but evidence that survives inspection."
    },
    {
      icon: Shield,
      title: "Steganographic Innovation",
      description: "From the original insight that camouflage could carry data, we've built technology that embeds verification invisibly within creative form."
    },
    {
      icon: Award,
      title: "Legal Accountability",
      description: "Our Master Covenant System creates a digital environment where automation is answerable, binding AI behavior to written law through coded agreements."
    },
    {
      icon: TrendingUp,
      title: "Market Validation",
      description: "Earned $340K D&B verified revenue in 90 days. First to bind 5 AI systems to contracts. $14M liability coverage. Evidence over claims."
    }
  ];

  const team = [
    {
      name: "Carlo René Earl",
      title: "Chief Executive Officer & Founder",
      subtitle: "DACO¹ and DACO²",
      bio: "Built GlyphLock from the ground up. Over 20 years in music production as a recording engineer (Scottsdale Community College), combined with 10+ years managing nightclub security in Arizona. This unique blend of creativity and protection discipline defines GlyphLock's technology philosophy.",
      focus: "Corporate strategy, patent development, product architecture, and DACO system governance",
      philosophy: "Technology must survive chaos as easily as it performs in theory.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop"
    },
    {
      name: "Angel Rose Sticka",
      title: "Chief Administrative Officer",
      subtitle: "Legal & Documentation Division",
      bio: "Over 10 years of management experience with 5 years as top performer at UnitedHealthCare, Humana, and SelectQuote. Ensures every operation meets legal and procedural standards with precision.",
      focus: "Administrative operations, legal filings, global compliance, and documentation governance",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
    },
    {
      name: "Jacub Lough",
      title: "Chief Financial & Security Officer",
      subtitle: "Owner, ICEVAULT 88",
      bio: "Combines financial strategy with operational defense. Owner of ICEVAULT 88, a precision jewelry business built on trust and craftsmanship. Partnership with Carlo began in the recording industry and evolved into securing information with the rigor used to secure valuables.",
      focus: "Capital strategy, auditing, partner networks, and operational security",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop"
    },
    {
      name: "Collin Vanderginst",
      title: "Chief Technology Officer",
      subtitle: "Surveillance & Network Security",
      bio: "Conceived the original idea: camouflage could carry scannable data. Over 20 years in surveillance and network security, transformed this insight into GlyphLock's steganographic technology. Currently oversees statewide surveillance infrastructure for Jiffy Lube Arizona.",
      focus: "System design, integration architecture, and steganographic technology development",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-blue-900/20 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-400 mb-6 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Established May 2025 • El Mirage, Arizona
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Proof Above Persuasion</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Creativity, structure, finance, and engineering united under one principle. From steganographic camouflage to AI-contract binding, GlyphLock builds technology where authenticity is not a statement—it is evidence that survives inspection.
            </p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-white text-center">Our Vision</h2>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                GlyphLock's purpose is to build a world where reality confirms itself. Every image, document, and identity should carry its own verification, independent of opinion or claim. The company's goal is to replace trust with evidence.
              </p>
              <p>
                We design technology that recognizes truth and keeps it intact. From our pioneering steganographic embedding to blockchain validation, we create self-verifying networks where every scan, file, or transaction carries its own proof.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Evolution Timeline */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-white text-center">Our Evolution</h2>
            <p className="text-gray-400 text-center mb-12">From concept to market leader in AI governance and IP protection</p>
            
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <Card key={index} className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-all">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10 mb-3">
                          {item.period}
                        </Badge>
                        <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                        <p className="text-gray-300 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-white text-center">Our Values</h2>
            <p className="text-gray-400 text-center mb-12">The principles that guide our innovation and client partnerships</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-all">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <value.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                        <p className="text-gray-300 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-white text-center">Leadership</h2>
            <p className="text-gray-400 text-center mb-12">Creativity, structure, finance, and engineering united under one principle: proof above persuasion</p>
            
            <div className="space-y-8">
              {team.map((member, index) => (
                <Card key={index} className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-all overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <CardContent className="md:w-2/3 p-8">
                      <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-blue-400 font-semibold mb-2">{member.title}</p>
                      <Badge variant="outline" className="border-blue-500/50 text-white bg-blue-500/10 mb-4">
                        {member.subtitle}
                      </Badge>
                      <p className="text-gray-300 mb-4 leading-relaxed">{member.bio}</p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-blue-400 mb-1">Focus Areas</p>
                          <p className="text-sm text-gray-400">{member.focus}</p>
                        </div>
                        {member.philosophy && (
                          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
                            <p className="text-sm font-semibold text-blue-400 mb-2">Philosophy</p>
                            <p className="text-white italic">"{member.philosophy}"</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Replace Trust with <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Evidence</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Partner with GlyphLock to build a world where reality confirms itself. Our technology recognizes truth and keeps it intact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Consultation")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                  Book Consultation
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button size="lg" variant="outline" className="border-blue-500/50 hover:bg-blue-500/10 text-white">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}