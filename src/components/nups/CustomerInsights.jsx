import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Users, Target, Loader2, RefreshCw, ShoppingBag } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function CustomerInsights() {
  const [insights, setInsights] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: customers = [] } = useQuery({
    queryKey: ['pos-customers'],
    queryFn: () => base44.entities.POSCustomer.list()
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['pos-transactions'],
    queryFn: () => base44.entities.POSTransaction.list('-created_date', 200)
  });

  const generateInsights = async () => {
    setIsGenerating(true);
    
    try {
      const customerData = customers.map(c => ({
        id: c.customer_id,
        name: c.full_name,
        total_spent: c.total_spent || 0,
        visit_count: c.visit_count || 0,
        loyalty_points: c.loyalty_points || 0,
        status: c.status,
        favorite_categories: c.preferences?.favorite_categories || []
      }));

      const transactionData = transactions.map(t => ({
        date: new Date(t.created_date).toLocaleDateString(),
        customer_id: t.customer_id,
        total: t.total,
        items: t.items
      }));

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an AI customer relationship management analyst. Analyze the following customer and transaction data to provide comprehensive behavioral insights.

**Customer Data:**
${JSON.stringify(customerData, null, 2)}

**Transaction Data (last 200 transactions):**
${JSON.stringify(transactionData, null, 2)}

Provide a detailed analysis in JSON format with:

1. "customer_segments": array of objects with {
   "segment_name": string,
   "description": string,
   "customer_count": number,
   "avg_spend": number,
   "characteristics": array of strings
}

2. "purchase_patterns": array of objects with {
   "pattern": string,
   "frequency": string,
   "impact": "high"|"medium"|"low",
   "recommendation": string
}

3. "at_risk_customers": array of objects with {
   "customer_id": string,
   "customer_name": string,
   "risk_level": "high"|"medium"|"low",
   "reason": string,
   "retention_strategy": string
}

4. "high_value_customers": array of objects with {
   "customer_id": string,
   "customer_name": string,
   "lifetime_value": number,
   "key_behaviors": array of strings,
   "engagement_tips": array of strings
}

5. "product_affinity": array of objects with {
   "customer_segment": string,
   "preferred_categories": array of strings,
   "cross_sell_opportunities": array of strings
}

6. "engagement_recommendations": array of strings with specific, actionable strategies

7. "churn_prediction": object with {
   "predicted_churn_rate": number,
   "high_risk_count": number,
   "preventive_actions": array of strings
}

8. "personalization_opportunities": array of objects with {
   "opportunity_type": string,
   "target_segment": string,
   "expected_impact": string,
   "implementation": string
}

9. "customer_journey_insights": array of strings describing typical customer paths

10. "loyalty_program_optimization": array of strings with recommendations

Be specific and data-driven in your analysis.`,
        response_json_schema: {
          type: "object",
          properties: {
            customer_segments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  segment_name: { type: "string" },
                  description: { type: "string" },
                  customer_count: { type: "number" },
                  avg_spend: { type: "number" },
                  characteristics: { type: "array", items: { type: "string" } }
                }
              }
            },
            purchase_patterns: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  pattern: { type: "string" },
                  frequency: { type: "string" },
                  impact: { type: "string" },
                  recommendation: { type: "string" }
                }
              }
            },
            at_risk_customers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  customer_id: { type: "string" },
                  customer_name: { type: "string" },
                  risk_level: { type: "string" },
                  reason: { type: "string" },
                  retention_strategy: { type: "string" }
                }
              }
            },
            high_value_customers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  customer_id: { type: "string" },
                  customer_name: { type: "string" },
                  lifetime_value: { type: "number" },
                  key_behaviors: { type: "array", items: { type: "string" } },
                  engagement_tips: { type: "array", items: { type: "string" } }
                }
              }
            },
            product_affinity: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  customer_segment: { type: "string" },
                  preferred_categories: { type: "array", items: { type: "string" } },
                  cross_sell_opportunities: { type: "array", items: { type: "string" } }
                }
              }
            },
            engagement_recommendations: {
              type: "array",
              items: { type: "string" }
            },
            churn_prediction: {
              type: "object",
              properties: {
                predicted_churn_rate: { type: "number" },
                high_risk_count: { type: "number" },
                preventive_actions: { type: "array", items: { type: "string" } }
              }
            },
            personalization_opportunities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  opportunity_type: { type: "string" },
                  target_segment: { type: "string" },
                  expected_impact: { type: "string" },
                  implementation: { type: "string" }
                }
              }
            },
            customer_journey_insights: {
              type: "array",
              items: { type: "string" }
            },
            loyalty_program_optimization: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setInsights(result);
    } catch (error) {
      console.error("Error generating insights:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (customers.length > 0 && !insights) {
      generateInsights();
    }
  }, [customers]);

  const getRiskColor = (risk) => {
    const colors = {
      high: "red",
      medium: "orange",
      low: "yellow"
    };
    return colors[risk] || "gray";
  };

  const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#6366f1'];

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-white">AI is analyzing customer behavior...</p>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-12 text-center">
          <Brain className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 text-white">AI Customer Insights</h3>
          <p className="text-gray-400 mb-6">Generate AI-powered customer behavioral analysis</p>
          <Button onClick={generateInsights} className="bg-gradient-to-r from-cyan-600 to-blue-700">
            <Brain className="w-4 h-4 mr-2" />
            Generate Insights
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Customer Insights</h2>
            <p className="text-sm text-gray-400">Behavioral analysis & personalization strategies</p>
          </div>
        </div>
        <Button onClick={generateInsights} variant="outline" className="border-gray-700">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Analysis
        </Button>
      </div>

      {/* Customer Segments */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Customer Segments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {insights.customer_segments?.map((segment, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-white mb-1">{segment.segment_name}</h4>
                    <p className="text-sm text-gray-400">{segment.description}</p>
                  </div>
                  <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                    {segment.customer_count}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-400">Avg. Spend</div>
                    <div className="text-lg font-bold text-green-400">${segment.avg_spend.toFixed(2)}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-2">Characteristics:</div>
                  <div className="flex flex-wrap gap-1">
                    {segment.characteristics.map((char, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-gray-700 text-gray-400">
                        {char}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Churn Prediction */}
      <Card className="bg-gradient-to-br from-red-500/10 to-orange-600/10 border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="w-5 h-5 text-red-400" />
            Churn Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-400 mb-2">Predicted Churn Rate</div>
              <div className="text-4xl font-bold text-red-400 mb-1">
                {insights.churn_prediction?.predicted_churn_rate}%
              </div>
              <div className="text-sm text-gray-400">
                {insights.churn_prediction?.high_risk_count} customers at high risk
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-3">Preventive Actions:</div>
              <ul className="space-y-2">
                {insights.churn_prediction?.preventive_actions.map((action, idx) => (
                  <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* At Risk & High Value Customers */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* At Risk */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">At-Risk Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {insights.at_risk_customers?.map((customer, idx) => (
                <div key={idx} className={`bg-${getRiskColor(customer.risk_level)}-500/10 border border-${getRiskColor(customer.risk_level)}-500/30 rounded-lg p-3`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-white">{customer.customer_name}</div>
                    <Badge variant="outline" className={`border-${getRiskColor(customer.risk_level)}-500 text-${getRiskColor(customer.risk_level)}-400 text-xs`}>
                      {customer.risk_level} risk
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{customer.reason}</p>
                  <div className="bg-gray-800 rounded p-2">
                    <div className="text-xs text-cyan-400 font-semibold mb-1">Strategy:</div>
                    <p className="text-xs text-gray-300">{customer.retention_strategy}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* High Value */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">High-Value Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {insights.high_value_customers?.map((customer, idx) => (
                <div key={idx} className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/30 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-white">{customer.customer_name}</div>
                    <div className="text-lg font-bold text-purple-400">${customer.lifetime_value.toFixed(2)}</div>
                  </div>
                  <div className="mb-2">
                    <div className="text-xs text-gray-400 mb-1">Key Behaviors:</div>
                    <div className="flex flex-wrap gap-1">
                      {customer.key_behaviors.map((behavior, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-purple-500/50 text-purple-400">
                          {behavior}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded p-2">
                    <div className="text-xs text-purple-400 font-semibold mb-1">Engagement Tips:</div>
                    {customer.engagement_tips.map((tip, i) => (
                      <p key={i} className="text-xs text-gray-300 mb-1">• {tip}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Affinity */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Product Affinity by Segment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {insights.product_affinity?.map((affinity, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h4 className="font-semibold text-white mb-3">{affinity.customer_segment}</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-2">Preferred Categories:</div>
                    <div className="flex flex-wrap gap-1">
                      {affinity.preferred_categories.map((cat, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-cyan-500/50 text-cyan-400">
                          <ShoppingBag className="w-3 h-3 mr-1" />
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-2">Cross-Sell Opportunities:</div>
                    {affinity.cross_sell_opportunities.map((opp, i) => (
                      <p key={i} className="text-xs text-gray-300 mb-1">• {opp}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personalization Opportunities */}
      <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white">Personalization Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.personalization_opportunities?.map((opp, idx) => (
              <div key={idx} className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-cyan-400 mb-1">{opp.opportunity_type}</h4>
                    <p className="text-sm text-gray-400">Target: {opp.target_segment}</p>
                  </div>
                  <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                    {opp.expected_impact}
                  </Badge>
                </div>
                <p className="text-sm text-gray-300">{opp.implementation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Recommendations */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Strategic Engagement Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {insights.engagement_recommendations?.map((rec, idx) => (
              <li key={idx} className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-lg p-3 flex gap-3">
                <span className="text-cyan-400 font-bold">{idx + 1}.</span>
                <span className="text-gray-300">{rec}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}