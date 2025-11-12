import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, Settings, Webhook, TestTube, 
  CheckCircle, Copy, ExternalLink, Shield, Info 
} from "lucide-react";

export default function StripeSetupGuide() {
  const [copiedText, setCopiedText] = useState(null);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const steps = [
    {
      id: "keys",
      title: "Get API Keys",
      icon: CreditCard,
      content: (
        <div className="space-y-4">
          <Alert className="bg-blue-500/10 border-blue-500/30">
            <Info className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-white">
              Go to your Stripe Dashboard to get your API keys
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-white mb-2">For Testing:</h4>
              <a 
                href="https://dashboard.stripe.com/test/apikeys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
              >
                https://dashboard.stripe.com/test/apikeys
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg space-y-3">
              <div>
                <div className="text-sm text-gray-400 mb-1">Publishable Key (starts with pk_test_)</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-900 p-2 rounded text-green-400 text-xs">
                    pk_test_your_key_here
                  </code>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard('pk_test_', 'pub')}>
                    {copiedText === 'pub' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Secret Key (starts with sk_test_)</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-900 p-2 rounded text-red-400 text-xs">
                    sk_test_your_secret_key_here
                  </code>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard('sk_test_', 'sec')}>
                    {copiedText === 'sec' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">For Production (Live):</h4>
            <a 
              href="https://dashboard.stripe.com/apikeys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
            >
              https://dashboard.stripe.com/apikeys
              <ExternalLink className="w-4 h-4" />
            </a>
            <p className="text-sm text-gray-400 mt-2">
              Replace pk_test_ with pk_live_ and sk_test_ with sk_live_
            </p>
          </div>
        </div>
      )
    },
    {
      id: "secrets",
      title: "Configure Secrets",
      icon: Settings,
      content: (
        <div className="space-y-4">
          <Alert className="bg-green-500/10 border-green-500/30">
            <Shield className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-white">
              Add these secrets in Dashboard → Settings → Secrets
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {[
              { name: 'STRIPE_SECRET_KEY', desc: 'Your Stripe secret key (sk_test_ or sk_live_)', example: 'sk_test_...' },
              { name: 'STRIPE_PUBLISHABLE_KEY', desc: 'Your Stripe publishable key (pk_test_ or pk_live_)', example: 'pk_test_...' },
              { name: 'STRIPE_WEBHOOK_SECRET', desc: 'Webhook signing secret (get from webhooks page)', example: 'whsec_...' }
            ].map((secret, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-blue-400 font-mono text-sm">{secret.name}</code>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(secret.name, `secret-${index}`)}
                    >
                      {copiedText === `secret-${index}` ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{secret.desc}</p>
                  <code className="text-xs text-gray-500">Example: {secret.example}</code>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert className="bg-yellow-500/10 border-yellow-500/30">
            <Info className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-white">
              Never commit secret keys to git or expose them in frontend code!
            </AlertDescription>
          </Alert>
        </div>
      )
    },
    {
      id: "webhooks",
      title: "Setup Webhooks",
      icon: Webhook,
      content: (
        <div className="space-y-4">
          <Alert className="bg-purple-500/10 border-purple-500/30">
            <Webhook className="h-4 w-4 text-purple-400" />
            <AlertDescription className="text-white">
              Webhooks notify your app when payments succeed or fail
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-white mb-2">1. Go to Stripe Webhooks:</h4>
              <a 
                href="https://dashboard.stripe.com/webhooks" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
              >
                https://dashboard.stripe.com/webhooks
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">2. Add endpoint URL:</h4>
              <div className="bg-gray-800 p-3 rounded-lg flex items-center justify-between">
                <code className="text-green-400 text-sm">
                  https://your-app.com/api/stripe-webhook
                </code>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard('https://your-app.com/api/stripe-webhook', 'webhook')}
                >
                  {copiedText === 'webhook' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">3. Select these events:</h4>
              <div className="bg-gray-800 p-3 rounded-lg space-y-2">
                {[
                  'payment_intent.succeeded',
                  'payment_intent.payment_failed',
                  'charge.succeeded',
                  'charge.refunded'
                ].map((event, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <code className="text-blue-400 text-sm">{event}</code>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">4. Copy webhook secret:</h4>
              <p className="text-sm text-gray-400 mb-2">
                After creating the endpoint, copy the signing secret (whsec_...) and add it to your secrets
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "test",
      title: "Test Payments",
      icon: TestTube,
      content: (
        <div className="space-y-4">
          <Alert className="bg-green-500/10 border-green-500/30">
            <TestTube className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-white">
              Use Stripe test cards to test your integration
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Card className="bg-green-900/20 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white text-sm">✅ Successful Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-gray-400">Card Number:</div>
                    <div className="flex items-center gap-2">
                      <code className="text-green-400">4242 4242 4242 4242</code>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => copyToClipboard('4242424242424242', 'card-success')}
                      >
                        {copiedText === 'card-success' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Expiry:</div>
                    <code className="text-white">12/34</code>
                  </div>
                  <div>
                    <div className="text-gray-400">CVC:</div>
                    <code className="text-white">123</code>
                  </div>
                  <div>
                    <div className="text-gray-400">ZIP:</div>
                    <code className="text-white">12345</code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-900/20 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-white text-sm">❌ Payment Fails</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <div className="text-gray-400 mb-1">Card Number:</div>
                  <div className="flex items-center gap-2">
                    <code className="text-red-400">4000 0000 0000 0002</code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard('4000000000000002', 'card-fail')}
                    >
                      {copiedText === 'card-fail' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-900/20 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white text-sm">🔐 3D Secure Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <div className="text-gray-400 mb-1">Card Number:</div>
                  <div className="flex items-center gap-2">
                    <code className="text-blue-400">4000 0025 0000 3155</code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard('4000002500003155', 'card-3ds')}
                    >
                      {copiedText === 'card-3ds' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <a 
              href="https://stripe.com/docs/testing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center gap-2 text-sm"
            >
              View all test cards on Stripe Docs
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-400 mb-6">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment Setup
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              Stripe Integration <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Setup Guide</span>
            </h1>
            <p className="text-gray-400">
              Follow these steps to configure secure payment processing
            </p>
          </div>

          <Tabs defaultValue="keys" className="space-y-6">
            <TabsList className="bg-gray-900 border border-gray-800 grid grid-cols-4">
              {steps.map((step) => (
                <TabsTrigger 
                  key={step.id} 
                  value={step.id}
                  className="text-white data-[state=active]:text-blue-400"
                >
                  <step.icon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{step.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {steps.map((step) => (
              <TabsContent key={step.id} value={step.id}>
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <step.icon className="w-5 h-5" />
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {step.content}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-700/10 border-green-500/30 mt-8">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Ready to Go Live?</h3>
              <p className="text-gray-300 mb-4">
                Once you've tested thoroughly, switch to live keys and update your webhook endpoint
              </p>
              <div className="flex gap-3 justify-center">
                <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
                    Open Stripe Dashboard
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}