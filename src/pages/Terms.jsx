import React from "react";
import { FileText, Shield, AlertTriangle, Scale, CreditCard, UserX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Terms() {
  const sections = [
    {
      icon: FileText,
      title: "1. Acceptance of Terms",
      content: `By accessing and using GlyphLock's platform and services, you agree to be bound by these Terms of Service. 
      If you do not agree to these terms, you may not use our services. These terms constitute a legally binding agreement 
      between you and GlyphLock Inc.`
    },
    {
      icon: Shield,
      title: "2. Services Description",
      content: `GlyphLock provides cybersecurity services including but not limited to: Master Covenant AI binding system, 
      QR code security generation, steganography tools, blockchain security, GlyphBot AI assistant, and N.U.P.S. POS system. 
      Services are provided "as is" with continuous improvements and updates.`
    },
    {
      icon: UserX,
      title: "3. User Accounts",
      subsections: [
        "You must provide accurate and complete registration information",
        "You are responsible for maintaining the security of your account credentials",
        "You must notify us immediately of any unauthorized access",
        "One person or entity may not maintain multiple accounts",
        "We reserve the right to suspend or terminate accounts that violate these terms",
        "You must be at least 18 years old to create an account"
      ]
    },
    {
      icon: Scale,
      title: "4. Acceptable Use Policy",
      subsections: [
        "You may not use our services for illegal activities",
        "You may not attempt to breach or compromise our security systems",
        "You may not reverse engineer or decompile our software",
        "You may not use our platform to distribute malware or conduct attacks",
        "You may not scrape, copy, or redistribute our content without permission",
        "You may not impersonate others or provide false information"
      ]
    },
    {
      icon: CreditCard,
      title: "5. Payment Terms",
      subsections: [
        "Subscription fees are billed in advance on a monthly or annual basis",
        "All fees are non-refundable except as required by law",
        "We reserve the right to change pricing with 30 days notice",
        "Failed payments may result in service suspension",
        "Enterprise contracts are subject to separate agreements",
        "Taxes are calculated based on your billing address"
      ]
    },
    {
      icon: AlertTriangle,
      title: "6. Liability Limitations",
      content: `GlyphLock provides services with $14M liability coverage as specified in service agreements. 
      We are not liable for indirect, incidental, or consequential damages. Our total liability is limited to 
      the amount paid by you in the 12 months preceding the claim. Some jurisdictions do not allow these 
      limitations, so they may not apply to you.`
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Terms of <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Service</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Last updated: January 2025
            </p>
            <p className="text-gray-300 mt-4">
              Please read these terms carefully before using GlyphLock's services.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8 mb-16">
            {sections.map((section, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-4 text-white">{section.title}</h2>
                      {section.content && (
                        <p className="text-gray-300 leading-relaxed">{section.content}</p>
                      )}
                      {section.subsections && (
                        <ul className="space-y-2">
                          {section.subsections.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-300">
                              <span className="text-blue-400 mt-1.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Terms */}
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">7. Intellectual Property</h2>
              <p className="text-gray-300 mb-4">
                All content, features, and functionality of GlyphLock services are owned by GlyphLock Inc. and 
                protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>You retain ownership of data you upload to our platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>You grant us a license to process your data to provide services</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>Our Master Covenant technology is proprietary and patent-pending</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>Unauthorized use of our trademarks is prohibited</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">8. Data Security & Privacy</h2>
              <p className="text-gray-300 mb-4">
                We implement industry-leading security measures to protect your data:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>AES-256 encryption for data at rest</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>TLS 1.3 for data in transit</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>SOC 2 Type II certified infrastructure</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>Regular security audits and penetration testing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>See our Privacy Policy for complete details</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">9. Termination</h2>
              <p className="text-gray-300 mb-4">
                Either party may terminate the service agreement:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span><strong>You:</strong> Cancel your subscription at any time from your account dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span><strong>Us:</strong> Suspend or terminate accounts that violate these terms</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>Upon termination, your access to services will cease</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>You may export your data within 30 days of termination</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>No refunds for unused subscription periods unless required by law</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">10. Master Covenant Specific Terms</h2>
              <p className="text-gray-300 mb-4">
                For services utilizing our Master Covenant AI binding system:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>AI systems are bound to legally enforceable contracts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>$14M liability coverage applies to AI-related incidents</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>Cryptographic proof of compliance is maintained on blockchain</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>Enterprise clients receive dedicated covenant documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>Claims must be filed within 90 days of incident</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">11. Governing Law & Disputes</h2>
              <p className="text-gray-300 mb-4">
                These Terms are governed by the laws of the State of California, USA:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>Disputes will be resolved through binding arbitration</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>Arbitration will be conducted in San Francisco, CA</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>You waive the right to participate in class-action lawsuits</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>Small claims court remains available for qualifying disputes</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-700/10 border-blue-500/30">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 text-white">Questions About These Terms?</h2>
              <p className="text-gray-300 mb-6">
                If you have any questions about these Terms of Service, please contact our legal team:
              </p>
              <div className="space-y-2 text-gray-300">
                <p><strong>Email:</strong> legal@glyphlock.com</p>
                <p><strong>Address:</strong> GlyphLock Inc., San Francisco, CA</p>
                <p><strong>Response Time:</strong> Within 48 hours</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}