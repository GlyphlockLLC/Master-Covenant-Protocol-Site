import React from "react";
import { Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Privacy() {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Account information (name, email, company details)",
        "Usage data and analytics",
        "Payment and billing information",
        "Security logs and threat detection data",
        "API usage and integration data",
        "Communication history and support tickets"
      ]
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        "Provide and improve our security services",
        "Process payments and manage subscriptions",
        "Send important security updates and notifications",
        "Analyze usage patterns to enhance features",
        "Comply with legal and regulatory requirements",
        "Prevent fraud and unauthorized access"
      ]
    },
    {
      icon: Shield,
      title: "Data Security",
      content: [
        "AES-256 encryption for data at rest",
        "TLS 1.3 for data in transit",
        "Multi-factor authentication required",
        "Regular security audits and penetration testing",
        "SOC 2 Type II certified infrastructure",
        "Zero-knowledge encryption for sensitive data"
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Access your personal data at any time",
        "Request deletion of your account and data",
        "Export your data in portable format",
        "Opt-out of marketing communications",
        "Update or correct your information",
        "Object to certain data processing activities"
      ]
    },
    {
      icon: Eye,
      title: "Data Sharing",
      content: [
        "We never sell your personal data to third parties",
        "Service providers under strict confidentiality agreements",
        "Law enforcement when legally required",
        "Business transfers (mergers/acquisitions) with notice",
        "With your explicit consent for specific purposes",
        "Anonymized data for research and analytics"
      ]
    },
    {
      icon: FileText,
      title: "Cookies & Tracking",
      content: [
        "Essential cookies for platform functionality",
        "Analytics cookies to improve user experience",
        "Security cookies for threat detection",
        "Preference cookies to remember your settings",
        "You can disable non-essential cookies in settings",
        "Third-party cookies only from trusted partners"
      ]
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Privacy <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Last updated: January 2025
            </p>
            <p className="text-gray-300 mt-4">
              Your privacy is critically important to us. GlyphLock is committed to protecting 
              your personal information with the same quantum-level security we provide to enterprises.
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
                      <ul className="space-y-2">
                        {section.content.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-300">
                            <span className="text-blue-400 mt-1.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Information */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-blue-500/30 mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">International Data Transfers</h2>
              <p className="text-gray-300 mb-4">
                GlyphLock operates globally and may transfer your data to servers located in different countries. 
                We ensure all international data transfers comply with:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>GDPR (General Data Protection Regulation)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>CCPA (California Consumer Privacy Act)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>Standard Contractual Clauses (SCCs)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>Privacy Shield principles where applicable</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/30 mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">Data Retention</h2>
              <p className="text-gray-300 mb-4">
                We retain your personal data only as long as necessary to provide our services and comply with legal obligations:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1.5">•</span>
                  <span><strong>Active accounts:</strong> Data retained while account is active</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1.5">•</span>
                  <span><strong>Inactive accounts:</strong> Deleted after 2 years of inactivity</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1.5">•</span>
                  <span><strong>Deleted accounts:</strong> Permanently removed within 30 days</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1.5">•</span>
                  <span><strong>Legal requirements:</strong> May retain certain data for up to 7 years</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1.5">•</span>
                  <span><strong>Backup systems:</strong> Removed from backups within 90 days</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card className="bg-gray-900 border-gray-800 mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">Children's Privacy</h2>
              <p className="text-gray-300">
                GlyphLock's services are not intended for individuals under the age of 18. We do not knowingly 
                collect personal information from children. If we become aware that a child has provided us with 
                personal data, we will take steps to delete such information immediately.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card className="bg-gray-900 border-gray-800 mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">Changes to This Policy</h2>
              <p className="text-gray-300 mb-4">
                We may update this Privacy Policy from time to time. When we do, we will:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>Update the "Last updated" date at the top</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>Notify you via email for material changes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>Display a prominent notice on our platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">•</span>
                  <span>Maintain previous versions for your reference</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-700/10 border-blue-500/30">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 text-white">Questions or Concerns?</h2>
              <p className="text-gray-300 mb-6">
                If you have any questions about this Privacy Policy or how we handle your data, 
                please contact our Data Protection Officer:
              </p>
              <div className="space-y-2 text-gray-300">
                <p><strong>Email:</strong> privacy@glyphlock.com</p>
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