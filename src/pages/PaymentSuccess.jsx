import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, Calendar, Mail, Clock, 
  FileText, Download, Shield, ArrowRight 
} from "lucide-react";

export default function PaymentSuccess() {
  const [consultation, setConsultation] = useState(null);
  const [consultationId, setConsultationId] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('consultation_id');
    if (id) {
      setConsultationId(id);
      loadConsultation(id);
    }
  }, []);

  const loadConsultation = async (id) => {
    try {
      const consultations = await base44.entities.Consultation.filter({ id });
      if (consultations.length > 0) {
        setConsultation(consultations[0]);
      }
    } catch (err) {
      console.error("Failed to load consultation:", err);
    }
  };

  const nextSteps = [
    {
      icon: Mail,
      title: "Confirmation Email",
      description: "Check your inbox for booking confirmation and meeting details",
      time: "Within 5 minutes"
    },
    {
      icon: Calendar,
      title: "Calendar Invite",
      description: "You'll receive a calendar invite with video call link",
      time: "Within 1 hour"
    },
    {
      icon: FileText,
      title: "Pre-Consultation Survey",
      description: "Complete a brief questionnaire to help us prepare",
      time: "24 hours before meeting"
    },
    {
      icon: Clock,
      title: "Expert Consultation",
      description: "60-minute video call with our security experts",
      time: "Scheduled date"
    }
  ];

  const downloadReceipt = () => {
    const receipt = {
      transaction_id: `TX${Date.now()}`,
      date: new Date().toISOString(),
      consultation_id: consultationId,
      amount: "$299.00",
      service: consultation?.service_interest || "Security Consultation",
      customer: consultation?.full_name || "Customer",
      email: consultation?.email || "",
      status: "Paid"
    };

    const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `glyphlock-receipt-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Payment <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">Successful!</span>
            </h1>
            <p className="text-xl text-gray-400 mb-6">
              Your consultation has been confirmed
            </p>
            {consultation && (
              <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-400">
                Order ID: {consultationId?.slice(0, 8).toUpperCase()}
              </Badge>
            )}
          </div>

          {/* Consultation Details */}
          {consultation && (
            <Card className="bg-gray-900 border-gray-800 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Booking Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Service</div>
                    <div className="font-semibold text-white mb-4">{consultation.service_interest}</div>
                    
                    <div className="text-sm text-gray-400 mb-1">Client Name</div>
                    <div className="text-white mb-4">{consultation.full_name}</div>
                    
                    <div className="text-sm text-gray-400 mb-1">Email</div>
                    <div className="text-white mb-4">{consultation.email}</div>
                  </div>
                  <div>
                    {consultation.preferred_date && (
                      <>
                        <div className="text-sm text-gray-400 mb-1">Preferred Date</div>
                        <div className="flex items-center gap-2 text-white mb-4">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          {new Date(consultation.preferred_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </>
                    )}
                    
                    <div className="text-sm text-gray-400 mb-1">Payment Status</div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50 mb-4">
                      Paid - $299.00
                    </Badge>
                    
                    <div className="text-sm text-gray-400 mb-1">Confirmation Status</div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                      Confirmed
                    </Badge>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-700">
                  <Button
                    onClick={downloadReceipt}
                    variant="outline"
                    className="border-blue-500/50 hover:bg-blue-500/10 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">What Happens Next</h2>
            <div className="space-y-4">
              {nextSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index} className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-white">{step.title}</h3>
                            <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                              {step.time}
                            </Badge>
                          </div>
                          <p className="text-gray-400">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* What's Included */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-blue-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Your Consultation Includes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "60-minute expert video consultation",
                  "Comprehensive security assessment",
                  "Custom solution recommendations",
                  "Detailed proposal document",
                  "30-day follow-up support",
                  "Access to exclusive resources"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Note */}
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-white mb-2">Secure Payment Processed</h3>
                  <p className="text-gray-400 text-sm">
                    Your payment was processed securely through our PCI DSS Level 1 compliant payment system. 
                    All transaction data is encrypted with 256-bit SSL encryption.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Home")}>
              <Button size="lg" variant="outline" className="border-gray-600 hover:bg-gray-800 text-white">
                Return Home
              </Button>
            </Link>
            <Link to={createPageUrl("SecurityTools")}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                Explore Security Tools
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm mb-2">
              Questions about your consultation?
            </p>
            <Link to={createPageUrl("Contact")}>
              <Button variant="link" className="text-blue-400 hover:text-blue-300">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}