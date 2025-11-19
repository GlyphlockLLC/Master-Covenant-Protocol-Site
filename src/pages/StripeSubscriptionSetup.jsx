import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StripeSubscriptionSetup() {
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Stripe Subscription Setup Guide
        </h1>

        <Alert className="mb-8 bg-red-500/10 border-red-500/30">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-white">
            <strong>Action Required:</strong> Your Stripe account only has voucher products. You need to create subscription products for Professional and Enterprise plans.
          </AlertDescription>
        </Alert>

        <Card className="glass-card-dark border-blue-500/30 mb-6" style={{background: 'rgba(30, 58, 138, 0.2)', backdropFilter: 'blur(16px)'}}>
          <CardHeader>
            <CardTitle className="text-white">Step 1: Create Professional Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-white" style={{background: 'transparent'}}>
            <ol className="list-decimal list-inside space-y-3">
              <li>Go to <a href="https://dashboard.stripe.com/products" target="_blank" className="text-blue-400 hover:underline inline-flex items-center gap-1">Stripe Dashboard → Products <ExternalLink className="w-3 h-3" /></a></li>
              <li>Click "Add product"</li>
              <li>
                <strong>Product name:</strong> GlyphLock Professional
              </li>
              <li>
                <strong>Description:</strong> Professional-grade cybersecurity tools for individuals and small teams
              </li>
              <li>Add two prices:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li><strong>Monthly:</strong> $299/month - Recurring</li>
                  <li><strong>Annual:</strong> $2,990/year - Recurring</li>
                </ul>
              </li>
              <li>Click "Save product"</li>
              <li className="text-blue-400">Copy the <strong>Price IDs</strong> (starts with "price_")</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="glass-card-dark border-blue-500/30 mb-6" style={{background: 'rgba(30, 58, 138, 0.2)', backdropFilter: 'blur(16px)'}}>
          <CardHeader>
            <CardTitle className="text-white">Step 2: Create Enterprise Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-white" style={{background: 'transparent'}}>
            <ol className="list-decimal list-inside space-y-3">
              <li>In Stripe Dashboard, click "Add product" again</li>
              <li>
                <strong>Product name:</strong> GlyphLock Enterprise
              </li>
              <li>
                <strong>Description:</strong> Enterprise-grade security solutions with premium support
              </li>
              <li>Add two prices:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li><strong>Monthly:</strong> $999/month - Recurring</li>
                  <li><strong>Annual:</strong> $9,990/year - Recurring</li>
                </ul>
              </li>
              <li>Click "Save product"</li>
              <li className="text-blue-400">Copy the <strong>Price IDs</strong> (starts with "price_")</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="glass-card-dark border-blue-500/30 mb-6" style={{background: 'rgba(30, 58, 138, 0.2)', backdropFilter: 'blur(16px)'}}>
          <CardHeader>
            <CardTitle className="text-white">Step 3: Update Pricing Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-white" style={{background: 'transparent'}}>
            <p>Update the <code className="glass-card-dark border-blue-500/20 px-2 py-1 rounded" style={{background: 'rgba(30, 58, 138, 0.3)'}}>pages/Pricing</code> file with your new Price IDs:</p>
            <pre className="glass-card-dark border-blue-500/20 p-4 rounded-lg overflow-x-auto text-sm" style={{background: 'rgba(30, 58, 138, 0.15)', backdropFilter: 'blur(12px)'}}>
{`const plans = [
  {
    name: "Professional",
    priceId: {
      monthly: "price_XXXXX", // Replace with your monthly price ID
      annual: "price_YYYYY"   // Replace with your annual price ID
    },
    // ... rest of config
  },
  {
    name: "Enterprise",
    priceId: {
      monthly: "price_ZZZZZ", // Replace with your monthly price ID
      annual: "price_AAAAA"   // Replace with your annual price ID
    },
    // ... rest of config
  }
];`}
            </pre>
          </CardContent>
        </Card>

        <Card className="glass-card-dark border-green-500/30" style={{background: 'rgba(30, 58, 138, 0.2)', backdropFilter: 'blur(16px)'}}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              What You Currently Have
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-white" style={{background: 'transparent'}}>
            <div className="glass-card-dark border-blue-500/20 p-4 rounded-lg" style={{background: 'rgba(30, 58, 138, 0.15)', backdropFilter: 'blur(12px)'}}>
              <p className="text-sm text-gray-400 mb-2">Existing Products:</p>
              <ul className="space-y-1 text-sm">
                <li>✅ Vouchers ($1 one-time)</li>
                <li>✅ GlyphLock Voucher ($1 one-time)</li>
                <li>✅ Enterprise & Subscription Vouchers ($2000 one-time)</li>
                <li>❌ Professional Subscription (needs to be created)</li>
                <li>❌ Enterprise Subscription (needs to be created)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button
            onClick={() => window.open('https://dashboard.stripe.com/products', '_blank')}
            className="bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Open Stripe Dashboard
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}