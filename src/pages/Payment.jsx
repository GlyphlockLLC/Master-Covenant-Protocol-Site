import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, Lock, CheckCircle, AlertCircle, 
  Shield, Calendar, DollarSign, Info 
} from "lucide-react";

export default function Payment() {
  const navigate = useNavigate();
  const [consultationId, setConsultationId] = useState(null);
  const [consultation, setConsultation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    billingZip: ""
  });

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
      setError("Failed to load consultation details");
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardDetails({ ...cardDetails, cardNumber: formatted });
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setCardDetails({ ...cardDetails, expiryDate: formatted });
    }
  };

  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 4) {
      setCardDetails({ ...cardDetails, cvv: value });
    }
  };

  const processPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    // Validate card details
    if (cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
      setError("Please enter a valid 16-digit card number");
      setIsProcessing(false);
      return;
    }

    if (cardDetails.cvv.length < 3) {
      setError("Please enter a valid CVV");
      setIsProcessing(false);
      return;
    }

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update consultation payment status
      if (consultationId && consultation) {
        await base44.entities.Consultation.update(consultationId, {
          payment_status: "paid",
          status: "confirmed"
        });
      }

      setPaymentSuccess(true);
      
      // Redirect to success page after 2 seconds
      setTimeout(() => {
        navigate(createPageUrl("PaymentSuccess") + `?consultation_id=${consultationId}`);
      }, 2000);

    } catch (err) {
      setError("Payment processing failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-black text-white py-20 flex items-center justify-center">
        <Card className="bg-gray-900 border-green-500/30 max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
            <p className="text-gray-400 mb-4">Your consultation has been confirmed</p>
            <div className="animate-pulse text-blue-400 text-sm">Redirecting...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-400 mb-6">
              <Lock className="w-4 h-4 mr-2" />
              Secure Payment
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              Complete Your <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Booking</span>
            </h1>
            <p className="text-gray-400">256-bit SSL encryption • PCI DSS compliant</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert className="bg-red-500/10 border-red-500/30 mb-6">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-white">{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={processPayment} className="space-y-6">
                    <div>
                      <Label htmlFor="cardNumber" className="text-white">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        required
                        className="bg-gray-800 border-gray-700 text-white text-lg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardName" className="text-white">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        value={cardDetails.cardName}
                        onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                        placeholder="John Doe"
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="expiryDate" className="text-white">Expiry</Label>
                        <Input
                          id="expiryDate"
                          value={cardDetails.expiryDate}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          required
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-white">CVV</Label>
                        <Input
                          id="cvv"
                          type="password"
                          value={cardDetails.cvv}
                          onChange={handleCVVChange}
                          placeholder="123"
                          required
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingZip" className="text-white">ZIP Code</Label>
                        <Input
                          id="billingZip"
                          value={cardDetails.billingZip}
                          onChange={(e) => setCardDetails({ ...cardDetails, billingZip: e.target.value })}
                          placeholder="12345"
                          required
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </div>

                    <Alert className="bg-blue-500/10 border-blue-500/30">
                      <Info className="h-4 w-4 text-blue-400" />
                      <AlertDescription className="text-white text-sm">
                        Your payment information is encrypted and secure. We never store your full card details.
                      </AlertDescription>
                    </Alert>

                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-12 text-lg"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 mr-2" />
                          Pay $299.00
                        </>
                      )}
                    </Button>

                    <p className="text-center text-xs text-gray-500 mt-4">
                      By completing this payment, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </form>
                </CardContent>
              </Card>

              {/* Security Badges */}
              <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Shield className="w-5 h-5 text-green-400" />
                  256-bit SSL
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Lock className="w-5 h-5 text-blue-400" />
                  PCI DSS Level 1
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                  GDPR Compliant
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {consultation ? (
                    <>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Service</div>
                        <div className="font-semibold text-white">{consultation.service_interest}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Client</div>
                        <div className="text-white">{consultation.full_name}</div>
                        <div className="text-sm text-gray-400">{consultation.email}</div>
                      </div>
                      {consultation.preferred_date && (
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Preferred Date</div>
                          <div className="flex items-center gap-2 text-white">
                            <Calendar className="w-4 h-4" />
                            {new Date(consultation.preferred_date).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-sm text-gray-400">Loading consultation details...</div>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Consultation Fee</span>
                      <span className="text-white">$299.00</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Processing Fee</span>
                      <span className="text-white">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-700">
                      <span className="text-white">Total</span>
                      <span className="text-blue-400">$299.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-700/10 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-sm">What's Included</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    60-minute expert consultation
                  </div>
                  <div className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    Comprehensive security analysis
                  </div>
                  <div className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    Custom solution recommendations
                  </div>
                  <div className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    Detailed proposal document
                  </div>
                  <div className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    30-day follow-up support
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Money-Back Guarantee</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm">
                    If you're not satisfied with your consultation, we offer a full refund within 48 hours. No questions asked.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}