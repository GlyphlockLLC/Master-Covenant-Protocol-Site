import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Plus } from "lucide-react";

export default function AIProductRecommender({ cartItems, onAddToCart, products }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateRecommendations = async () => {
    if (cartItems.length === 0 || products.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const cartProducts = cartItems.map(item => ({
        name: item.name,
        category: item.category,
        price: item.price
      }));

      const availableProducts = products
        .filter(p => !cartItems.find(c => c.id === p.id) && p.is_active)
        .map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stock_quantity
        }));

      if (availableProducts.length === 0) {
        setRecommendations([]);
        return;
      }

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an AI sales assistant in a retail store. Analyze the customer's current cart and recommend complementary products.

**Current Cart:**
${JSON.stringify(cartProducts, null, 2)}

**Available Products:**
${JSON.stringify(availableProducts, null, 2)}

Provide intelligent product recommendations in JSON format with:

"recommendations": array of {
  "product_id": string,
  "product_name": string,
  "reason": string (brief explanation why this complements their cart),
  "confidence": number (0-100),
  "category": string,
  "price": number
}

Rules:
- Recommend 3-5 products maximum
- Focus on complementary items (e.g., if they bought electronics, suggest accessories)
- Consider price compatibility
- Prioritize in-stock items
- Be specific about why each product fits their purchase

Only recommend products from the available products list.`,
        response_json_schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  product_id: { type: "string" },
                  product_name: { type: "string" },
                  reason: { type: "string" },
                  confidence: { type: "number" },
                  category: { type: "string" },
                  price: { type: "number" }
                }
              }
            }
          }
        }
      });

      setRecommendations(result.recommendations || []);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      generateRecommendations();
    } else {
      setRecommendations([]);
    }
  }, [cartItems.length]);

  if (cartItems.length === 0 || recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-500/30">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-white">AI Recommendations</h3>
          <Badge variant="outline" className="border-purple-500 text-purple-400 text-xs">
            Smart Suggestions
          </Badge>
        </div>

        <div className="space-y-3">
          {recommendations.slice(0, 3).map((rec, idx) => {
            const product = products.find(p => p.id === rec.product_id);
            if (!product) return null;

            return (
              <div key={idx} className="bg-gray-900 rounded-lg p-3 border border-purple-500/20 hover:border-purple-500/50 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-white text-sm mb-1">{rec.product_name}</div>
                    <div className="text-xs text-gray-400 mb-2">{rec.reason}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
                        {rec.category}
                      </Badge>
                      <span className="text-sm font-bold text-purple-400">${rec.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onAddToCart(product)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <TrendingUp className="w-3 h-3" />
                  <span>{rec.confidence}% match</span>
                </div>
              </div>
            );
          })}
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <div className="text-sm text-purple-400">Generating smart suggestions...</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}