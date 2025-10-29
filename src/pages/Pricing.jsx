import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small teams and startups",
      features: [
        "QR Code Generator",
        "Basic Blockchain Security",
        "5 AI consultations/month",
        "Email support",
        "Basic analytics"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "For growing businesses with advanced needs",
      features: [
        "All Starter features",
        "Advanced Steganography",
        "Unlimited AI consultations",
        "Master Covenant access",
        "Priority support",
        "Custom integrations",
        "Advanced analytics"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored solutions for large organizations",
      features: [
        "All Professional features",
        "Dedicated account manager",
        "Custom tool development",
        "24/7 phone support",
        "SLA guarantees",
        "On-premise deployment",
        "Compliance certifications"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Transparent</span> Pricing
            </h1>
            <p className="text-xl text-gray-400">
              Choose the perfect plan for your security needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`${
                  plan.popular
                    ? "bg-gradient-to-b from-cyan-500/20 to-blue-600/20 border-cyan-500/50 relative"
                    : "bg-gray-900 border-gray-800"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </div>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                  <Link to={createPageUrl("Contact")}>
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                          : "bg-gray-800 hover:bg-gray-700"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Master Covenant <span className="text-purple-400">Bundle</span>
              </h2>
              <p className="text-xl text-gray-400 mb-6">
                Get complete AI legal framework with all security tools
              </p>
              <div className="text-5xl font-bold mb-2">
                <span className="text-purple-400">$999</span>
                <span className="text-xl text-gray-400">/month</span>
              </div>
              <p className="text-gray-400 mb-8">Includes $14M liability coverage</p>
              <Link to={createPageUrl("MasterCovenant")}>
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                  Learn More
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}