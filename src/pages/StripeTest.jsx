import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const TEST_PRODUCTS = [
  { name: 'Pro Plan', priceId: 'price_1SUlImAOe9xXPv0na5BmMKKY', mode: 'subscription', price: '$200/month' },
  { name: 'Enterprise Plan', priceId: 'price_1SUlRKAOe9xXPv0nW0uH1IQl', mode: 'subscription', price: '$2,000/month' },
  { name: 'Voucher', priceId: 'price_1S1DLyAOe9xXPv0nuUfZTu9S', mode: 'payment', price: '$1.00' }
];

export default function StripeTest() {
  const [loading, setLoading] = useState(null);
  const [testResults, setTestResults] = useState([]);

  const testCheckout = async (product) => {
    setLoading(product.priceId);
    try {
      const response = await base44.functions.invoke('stripeCheckout', {
        productId: product.name,
        priceId: product.priceId,
        mode: product.mode
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setTestResults(prev => [...prev, {
        product: product.name,
        status: 'success',
        url: response.data.checkoutUrl,
        sessionId: response.data.sessionId
      }]);

      toast.success(`Checkout URL created for ${product.name}`);
      
      // Open checkout in new tab
      window.open(response.data.checkoutUrl, '_blank');

    } catch (error) {
      console.error('Checkout error:', error);
      setTestResults(prev => [...prev, {
        product: product.name,
        status: 'error',
        error: error.message
      }]);
      toast.error(`Failed: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  const testPoll = async (sessionId) => {
    try {
      const response = await base44.functions.invoke('stripePoll', { sessionId });
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      toast.success(`Session Status: ${response.data.status}`);
      console.log('Poll result:', response.data);
      
    } catch (error) {
      console.error('Poll error:', error);
      toast.error(`Poll failed: ${error.message}`);
    }
  };

  return (
    <>
      <SEOHead title="Stripe Integration Test - GlyphLock" />
      
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="glass-card border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-cyan-400 flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                Stripe Integration Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-400 text-sm">
                  ⚠️ This is a test page. Use Stripe test card: 4242 4242 4242 4242 (any future date, any CVC)
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-white font-semibold">Test Products</h3>
                {TEST_PRODUCTS.map((product) => (
                  <div
                    key={product.priceId}
                    className="flex items-center justify-between p-4 glass-card border-white/10 rounded-lg"
                  >
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-white/60 text-sm">{product.price} - {product.mode}</p>
                    </div>
                    <Button
                      onClick={() => testCheckout(product)}
                      disabled={loading === product.priceId}
                      className="bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] hover:opacity-90"
                    >
                      {loading === product.priceId ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Test Checkout'
                      )}
                    </Button>
                  </div>
                ))}
              </div>

              {testResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Test Results</h3>
                  {testResults.map((result, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border ${
                        result.status === 'success'
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-red-500/10 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {result.status === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-400 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-white font-medium">{result.product}</p>
                          {result.status === 'success' ? (
                            <>
                              <p className="text-white/60 text-sm">Session ID: {result.sessionId}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => testPoll(result.sessionId)}
                                className="text-cyan-400 hover:text-cyan-300 mt-2"
                              >
                                Test Poll Status
                              </Button>
                            </>
                          ) : (
                            <p className="text-red-400 text-sm">{result.error}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}