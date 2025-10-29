import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert("Message sent! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get in <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-gray-400">
              Have questions? We're here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-8">
                <Mail className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-gray-400 text-sm">contact@glyphlock.com</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-8">
                <Phone className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
                <h3 className="font-bold mb-2">Phone</h3>
                <p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-8">
                <MapPin className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
                <h3 className="font-bold mb-2">Office</h3>
                <p className="text-gray-400 text-sm">San Francisco, CA</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}