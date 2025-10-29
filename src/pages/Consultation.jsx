import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle2, Clock, Shield, Award } from "lucide-react";

export default function Consultation() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    company: "",
    phone: "",
    service_interest: "",
    message: "",
    preferred_date: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const createConsultation = useMutation({
    mutationFn: (data) => base44.entities.Consultation.create(data),
    onSuccess: () => {
      setSubmitted(true);
      setFormData({
        full_name: "",
        email: "",
        company: "",
        phone: "",
        service_interest: "",
        message: "",
        preferred_date: ""
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createConsultation.mutate(formData);
  };

  const benefits = [
    { icon: Shield, text: "Free 60-minute consultation" },
    { icon: Award, text: "Expert cybersecurity analysis" },
    { icon: Clock, text: "Custom solution recommendations" },
    { icon: CheckCircle2, text: "No obligation quote" }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-white">Consultation Booked!</h1>
            <p className="text-xl text-white mb-8">
              Thank you for scheduling a consultation with GlyphLock. We'll contact you within 24 hours to confirm your appointment.
            </p>
            <Button onClick={() => setSubmitted(false)} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
              Book Another Consultation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Book Your <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Consultation</span>
            </h1>
            <p className="text-xl text-white">
              Schedule a free consultation with our cybersecurity experts
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Consultation Request Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="full_name" className="text-white">Full Name *</Label>
                        <Input
                          id="full_name"
                          required
                          value={formData.full_name}
                          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="company" className="text-white">Company</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-white">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="service_interest" className="text-white">Service Interest *</Label>
                        <Select
                          value={formData.service_interest}
                          onValueChange={(value) => setFormData({...formData, service_interest: value})}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="Master Covenant">Master Covenant</SelectItem>
                            <SelectItem value="Security Tools">Security Tools</SelectItem>
                            <SelectItem value="NUPS POS">NUPS POS</SelectItem>
                            <SelectItem value="AI Tools">AI Tools</SelectItem>
                            <SelectItem value="Custom Solution">Custom Solution</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="preferred_date" className="text-white">Preferred Date</Label>
                        <Input
                          id="preferred_date"
                          type="date"
                          value={formData.preferred_date}
                          onChange={(e) => setFormData({...formData, preferred_date: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-white">Message</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Tell us about your security needs..."
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={createConsultation.isPending}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                    >
                      {createConsultation.isPending ? "Booking..." : "Book Consultation"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-700/10 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white">What to Expect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <benefit.icon className="w-5 h-5 text-blue-400 mt-1" />
                      <span className="text-white">{benefit.text}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Quick Facts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white">Response Time:</span>
                    <span className="font-semibold text-white">24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Consultation Fee:</span>
                    <span className="font-semibold text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Duration:</span>
                    <span className="font-semibold text-white">60 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Format:</span>
                    <span className="font-semibold text-white">Video Call</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}