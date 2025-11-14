import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, Lock, Key, FileCheck, Eye, AlertTriangle, 
  CheckCircle, Server, Cloud, Database, Zap, Info
} from "lucide-react";

export default function SecurityDocs() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "Post-Quantum Ready (Hybrid)",
      level: "Next-Gen",
      description: "Hybrid cryptographic system using safe transition mode with quantum-resistant algorithms.",
      details: [
        "AES-256 encryption standard",
        "PQC Key Exchange implementation",
        "Perfect Forward Secrecy (PFS) enabled",
        "Quantum-safe algorithm integration",
        "Future-proof security architecture"
      ]
    },
    {
      icon: Key,
      title: "Quantum-Resistant Cryptography",
      level: "Military-Grade",
      description: "Advanced post-quantum cryptography protecting against quantum computing attacks.",
      details: [
        "SHA-256/512 hashing algorithms",
        "RSA-4096 key encryption",
        "ECDSA (Elliptic Curve) signatures",
        "NIST PQC standards compliance",
        "Hybrid encryption protocols"
      ]
    },
    {
      icon: Database,
      title: "Data Protection",
      level: "Enterprise",
      description: "Your data is protected at rest and in transit with multiple layers of encryption and access controls.",
      details: [
        "AES-256 encryption at rest",
        "Encrypted database backups",
        "Zero-knowledge architecture options",
        "Regular security audits",
        "GDPR & CCPA compliant"
      ]
    },
    {
      icon: Shield,
      title: "AI Security Scanning",
      level: "Real-Time",
      description: "Advanced AI-powered threat detection monitors all QR codes, URLs, and user inputs for malicious content.",
      details: [
        "99.97% threat detection accuracy",
        "NLP-based phishing detection",
        "Real-time malware scanning",
        "Behavioral analysis",
        "Automatic threat blocking"
      ]
    },
    {
      icon: Eye,
      title: "Access Control",
      level: "Zero-Trust",
      description: "Multi-layered authentication and authorization systems ensure only authorized users access sensitive data.",
      details: [
        "Multi-factor authentication (MFA)",
        "Role-based access control (RBAC)",
        "Session management and timeout",
        "IP whitelisting options",
        "Audit logging for all access"
      ]
    },
    {
      icon: Server,
      title: "Infrastructure Security",
      level: "Cloud-Native",
      description: "Built on enterprise cloud infrastructure with redundancy, DDoS protection, and 99.99% uptime SLA.",
      details: [
        "AWS/GCP enterprise-grade hosting",
        "Distributed architecture",
        "DDoS protection and WAF",
        "Regular penetration testing",
        "24/7 security monitoring"
      ]
    }
  ];

  const protocols = [
    {
      name: "TLS 1.3",
      description: "Latest Transport Layer Security protocol",
      status: "Active"
    },
    {
      name: "PQC Key Exchange",
      description: "Post-Quantum Cryptography",
      status: "Hybrid Mode"
    },
    {
      name: "HSTS",
      description: "HTTP Strict Transport Security",
      status: "Enforced"
    },
    {
      name: "CSP",
      description: "Content Security Policy",
      status: "Implemented"
    },
    {
      name: "AES-256",
      description: "Advanced Encryption Standard",
      status: "Active"
    },
    {
      name: "CSRF Tokens",
      description: "Cross-Site Request Forgery protection",
      status: "Implemented"
    }
  ];

  const compliance = [
    { standard: "SOC 2 Type II", status: "Certified", icon: CheckCircle },
    { standard: "GDPR", status: "Compliant", icon: CheckCircle },
    { standard: "CCPA", status: "Compliant", icon: CheckCircle },
    { standard: "ISO 27001", status: "In Progress", icon: Zap },
    { standard: "PCI DSS", status: "Compliant", icon: CheckCircle },
    { standard: "HIPAA", status: "Ready", icon: CheckCircle }
  ];

  const httpsExplained = {
    title: "Understanding Post-Quantum Security",
    sections: [
      {
        heading: "Post-Quantum Ready",
        content: "GlyphLock uses hybrid cryptographic systems that combine traditional encryption with quantum-resistant algorithms, ensuring security even against future quantum computers.",
        icon: Lock
      },
      {
        heading: "Hybrid Transition Mode",
        content: "Our safe hybrid transition mode implements both classical and post-quantum cryptography, providing backwards compatibility while preparing for the quantum era.",
        icon: Key
      },
      {
        heading: "AES-256 Standard",
        content: "All data is encrypted using AES-256, the industry-standard encryption algorithm trusted by governments and enterprises worldwide for top-secret information.",
        icon: Shield
      },
      {
        heading: "PQC Key Exchange",
        content: "Post-Quantum Cryptography (PQC) key exchange protocols ensure that even quantum computers cannot decrypt your secure communications.",
        icon: Eye
      }
    ]
  };

  const securityBestPractices = [
    "Always verify the HTTPS padlock icon before entering sensitive data",
    "Use strong, unique passwords for your GlyphLock account",
    "Enable multi-factor authentication (MFA) when available",
    "Keep your browser and operating system updated",
    "Be cautious of phishing emails claiming to be from GlyphLock",
    "Review your security settings regularly",
    "Report any suspicious activity immediately",
    "Use our QR code scanner to verify QR codes before scanning"
  ];

  return (
    <div className="bg-black text-white min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-400 mb-6 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Post-Quantum Ready (Hybrid)
            </Badge>
            <h1 className="text-5xl font-bold mb-4">
              Security <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Architecture</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-4">
              Comprehensive overview of GlyphLock's security infrastructure, encryption protocols, and compliance standards
            </p>
            <div className="flex items-center justify-center gap-3 text-sm text-blue-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span className="font-semibold">AES-256</span>
              </div>
              <span className="text-gray-500">•</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span className="font-semibold">PQC Key Exchange</span>
              </div>
            </div>
          </div>

          {/* Security Score */}
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-700/10 border-green-500/30 mb-12">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div>
                  <div className="text-5xl font-bold text-green-400 mb-2">A+</div>
                  <div className="text-sm text-gray-400">SSL Labs Rating</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-blue-400 mb-2">99.97%</div>
                  <div className="text-sm text-gray-400">Threat Detection</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-purple-400 mb-2">AES-256</div>
                  <div className="text-sm text-gray-400">Encryption</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-orange-400 mb-2">$14M</div>
                  <div className="text-sm text-gray-400">Liability Coverage</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Post-Quantum Explained */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Understanding <span className="text-blue-400">Post-Quantum Security</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {httpsExplained.sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <Card key={index} className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <CardTitle className="text-white">{section.heading}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">{section.content}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Security Features */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">Security Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-all">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-white">{feature.title}</CardTitle>
                            <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs mt-1">
                              {feature.level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Security Protocols */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">Active Security Protocols</h2>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {protocols.map((protocol, index) => (
                    <div key={index} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-white">{protocol.name}</h4>
                        <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs">
                          {protocol.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400">{protocol.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">Compliance & Certifications</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {compliance.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={index} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6 text-center">
                      <Icon className={`w-12 h-12 mx-auto mb-3 ${
                        item.icon === CheckCircle ? 'text-green-400' : 'text-yellow-400'
                      }`} />
                      <h4 className="font-bold text-white mb-2">{item.standard}</h4>
                      <Badge variant="outline" className={
                        item.icon === CheckCircle 
                          ? "border-green-500/50 text-green-400" 
                          : "border-yellow-500/50 text-yellow-400"
                      }>
                        {item.status}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Best Practices */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">Security Best Practices</h2>
            <Alert className="bg-blue-500/10 border-blue-500/30 mb-6">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-white">
                Follow these recommendations to maximize your security while using GlyphLock
              </AlertDescription>
            </Alert>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {securityBestPractices.map((practice, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{practice}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Incident Response */}
          <Alert className="bg-red-500/10 border-red-500/30 mb-8">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-white">
              <strong>Security Incident?</strong> Report immediately to security@glyphlock.com or use our 24/7 incident hotline: +1 (424) 246-6499
            </AlertDescription>
          </Alert>

          {/* CTA */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-blue-500/30">
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Questions About Our Security?
              </h3>
              <p className="text-gray-400 mb-6">
                Our security team is here to answer any questions about our infrastructure, compliance, or protocols.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={createPageUrl("Contact")}>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                    Contact Security Team
                  </Button>
                </Link>
                <Link to={createPageUrl("Consultation")}>
                  <Button variant="outline" className="border-blue-500/50 hover:bg-blue-500/10 text-white">
                    Book Security Audit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}