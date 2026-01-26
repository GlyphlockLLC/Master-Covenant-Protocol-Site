import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FileText, DollarSign, ShoppingCart, Printer, Calendar, Filter, Loader2, Download, Brain } from "lucide-react";
import { toast } from "sonner";

export default function AdvancedZReport({ user = {} }) {
  const queryClient = useQueryClient();
  const [openingCash, setOpeningCash] = useState(0);
  const [closingCash, setClosingCash] = useState(0);
  const [filters, setFilters] = useState({
    dateFrom: new Date().toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    paymentMethod: 'all',
    cashier: 'all',
    includeVIP: true,
    includeBar: true
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [forecast, setForecast] = useState(null);

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions-zreport', filters],
    queryFn: async () => {
      const all = await base44.entities.POSTransaction.list('-created_date', 1000);
      return all.filter(t => {
        const date = new Date(t.created_date).toISOString().split('T')[0];
        const matchDate = date >= filters.dateFrom && date <= filters.dateTo;
        const matchPayment = filters.paymentMethod === 'all' || t.payment_method === filters.paymentMethod;
        const matchCashier = filters.cashier === 'all' || t.cashier === filters.cashier;
        return matchDate && matchPayment && matchCashier;
      });
    }
  });

  const { data: vipSessions = [] } = useQuery({
    queryKey: ['vip-sessions-zreport', filters],
    queryFn: async () => {
      if (!filters.includeVIP) return [];
      const all = await base44.entities.VIPRoom.list('-created_date', 500);
      return all.filter(r => {
        const date = new Date(r.start_time).toISOString().split('T')[0];
        return date >= filters.dateFrom && date <= filters.dateTo;
      });
    }
  });

  const cashiers = ['all', ...new Set(transactions.map(t => t.cashier).filter(Boolean))];

  const generateForecast = async () => {
    setAiLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this POS data and generate a 7-day sales forecast with confidence intervals:

Transactions: ${transactions.length}
Total Revenue: $${calculateTotal()}
Avg Ticket: $${(calculateTotal() / transactions.length || 0).toFixed(2)}
Payment Methods: ${JSON.stringify(getPaymentBreakdown())}
Top Products: ${JSON.stringify(getTopProducts().slice(0, 5))}

Provide actionable forecast with expected revenue range (low/mid/high), key drivers, and risk factors.`,
        response_json_schema: {
          type: "object",
          properties: {
            next_7_days: {
              type: "object",
              properties: {
                low: { type: "number" },
                mid: { type: "number" },
                high: { type: "number" }
              }
            },
            confidence: { type: "number" },
            key_drivers: { type: "array", items: { type: "string" } },
            risks: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } }
          }
        }
      });
      setForecast(response);
      toast.success('Forecast generated');
    } catch (err) {
      toast.error('Forecast failed');
    } finally {
      setAiLoading(false);
    }
  };

  const generateZReport = useMutation({
    mutationFn: () => {
      const cashSales = transactions
        .filter(t => t.payment_method === 'Cash')
        .reduce((sum, t) => sum + (t.total || 0), 0);

      const cardSales = transactions
        .filter(t => t.payment_method !== 'Cash')
        .reduce((sum, t) => sum + (t.total || 0), 0);

      const vipRevenue = vipSessions
        .reduce((sum, s) => sum + (s.total_charge || 0), 0);

      const totalSales = cashSales + cardSales + vipRevenue;

      const productSales = {};
      transactions.forEach(t => {
        t.items?.forEach(item => {
          if (!productSales[item.product_name]) {
            productSales[item.product_name] = { quantity: 0, total: 0 };
          }
          productSales[item.product_name].quantity += item.quantity;
          productSales[item.product_name].total += item.total;
        });
      });

      const products_sold = Object.entries(productSales).map(([name, data]) => ({
        product_name: name,
        quantity: data.quantity,
        total: data.total
      }));

      return base44.entities.POSZReport.create({
        report_id: `Z-${Date.now()}`,
        report_date: filters.dateFrom === filters.dateTo ? filters.dateFrom : `${filters.dateFrom} to ${filters.dateTo}`,
        start_time: new Date(filters.dateFrom).toISOString(),
        end_time: new Date(filters.dateTo + 'T23:59:59').toISOString(),
        cashier_name: user?.email || 'Admin',
        opening_cash: Number(openingCash),
        closing_cash: Number(closingCash),
        cash_sales: cashSales,
        card_sales: cardSales,
        total_sales: totalSales,
        transaction_count: transactions.length,
        vip_room_revenue: vipRevenue,
        bar_revenue: 0,
        merchandise_revenue: totalSales - vipRevenue,
        discrepancy: Number(closingCash) - Number(openingCash) - cashSales,
        products_sold,
        filters: filters
      });
    },
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: ['z-reports'] });
      toast.success(`Z-Report ${report.report_id} generated`);
      printReport(report);
    }
  });

  const calculateTotal = () => {
    const txTotal = transactions.reduce((sum, t) => sum + (t.total || 0), 0);
    const vipTotal = vipSessions.reduce((sum, s) => sum + (s.total_charge || 0), 0);
    return txTotal + vipTotal;
  };

  const getPaymentBreakdown = () => {
    const breakdown = {};
    transactions.forEach(t => {
      breakdown[t.payment_method] = (breakdown[t.payment_method] || 0) + t.total;
    });
    return breakdown;
  };

  const getTopProducts = () => {
    const products = {};
    transactions.forEach(t => {
      t.items?.forEach(item => {
        if (!products[item.product_name]) {
          products[item.product_name] = { name: item.product_name, quantity: 0, revenue: 0 };
        }
        products[item.product_name].quantity += item.quantity;
        products[item.product_name].revenue += item.total;
      });
    });
    return Object.values(products).sort((a, b) => b.revenue - a.revenue);
  };

  const printReport = (report) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Z-Report ${report.report_id}</title>
          <style>
            body { font-family: monospace; padding: 20px; }
            h1 { text-align: center; border-bottom: 2px solid #000; }
            .section { margin: 20px 0; }
            .row { display: flex; justify-between; margin: 5px 0; }
            .total { font-weight: bold; font-size: 1.2em; border-top: 2px solid #000; padding-top: 10px; }
            .filters { background: #f0f0f0; padding: 10px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>N.U.P.S. ADVANCED Z-REPORT</h1>
          <div class="filters">
            <strong>Filters Applied:</strong><br/>
            Date Range: ${report.filters.dateFrom} to ${report.filters.dateTo}<br/>
            Payment Method: ${report.filters.paymentMethod}<br/>
            Cashier: ${report.filters.cashier}<br/>
            VIP Included: ${report.filters.includeVIP ? 'Yes' : 'No'}
          </div>
          <div class="section">
            <div class="row"><span>Report ID:</span><span>${report.report_id}</span></div>
            <div class="row"><span>Generated By:</span><span>${report.cashier_name}</span></div>
            <div class="row"><span>Generated At:</span><span>${new Date().toLocaleString()}</span></div>
          </div>
          <div class="section">
            <h3>CASH DRAWER</h3>
            <div class="row"><span>Opening Cash:</span><span>$${report.opening_cash.toFixed(2)}</span></div>
            <div class="row"><span>Closing Cash:</span><span>$${report.closing_cash.toFixed(2)}</span></div>
            <div class="row"><span>Discrepancy:</span><span>$${report.discrepancy.toFixed(2)}</span></div>
          </div>
          <div class="section">
            <h3>SALES BREAKDOWN</h3>
            <div class="row"><span>Cash Sales:</span><span>$${report.cash_sales.toFixed(2)}</span></div>
            <div class="row"><span>Card Sales:</span><span>$${report.card_sales.toFixed(2)}</span></div>
            <div class="row"><span>VIP Room Revenue:</span><span>$${report.vip_room_revenue.toFixed(2)}</span></div>
          </div>
          <div class="section">
            <h3>PRODUCTS SOLD</h3>
            ${report.products_sold.map(p => `<div class="row"><span>${p.product_name} (x${p.quantity})</span><span>$${p.total.toFixed(2)}</span></div>`).join('')}
          </div>
          <div class="section total">
            <div class="row"><span>Total Transactions:</span><span>${report.transaction_count}</span></div>
            <div class="row"><span>TOTAL SALES:</span><span>$${report.total_sales.toFixed(2)}</span></div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const exportJSON = () => {
    const data = {
      filters,
      transactions,
      vipSessions,
      summary: {
        total: calculateTotal(),
        paymentBreakdown: getPaymentBreakdown(),
        topProducts: getTopProducts()
      },
      forecast
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `z-report-advanced-${filters.dateFrom}-${filters.dateTo}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Advanced Filters */}
      <Card className="bg-slate-900/50 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-cyan-400" />
            Advanced Filtering
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Label className="text-slate-300">From Date</Label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-300">To Date</Label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-300">Payment Method</Label>
              <Select value={filters.paymentMethod} onValueChange={(val) => setFilters({...filters, paymentMethod: val})}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Debit Card">Debit Card</SelectItem>
                  <SelectItem value="Digital Wallet">Digital Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-300">Cashier</Label>
              <Select value={filters.cashier} onValueChange={(val) => setFilters({...filters, cashier: val})}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cashiers.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox 
                checked={filters.includeVIP} 
                onCheckedChange={(val) => setFilters({...filters, includeVIP: val})}
                id="includeVIP"
              />
              <Label htmlFor="includeVIP" className="text-slate-300 cursor-pointer">Include VIP Revenue</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                checked={filters.includeBar} 
                onCheckedChange={(val) => setFilters({...filters, includeBar: val})}
                id="includeBar"
              />
              <Label htmlFor="includeBar" className="text-slate-300 cursor-pointer">Include Bar Sales</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400">${calculateTotal().toFixed(2)}</div>
            <div className="text-sm text-slate-400">Total Revenue</div>
            <div className="text-xs text-slate-500 mt-1">{transactions.length} transactions</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-cyan-400">${(calculateTotal() / transactions.length || 0).toFixed(2)}</div>
            <div className="text-sm text-slate-400">Avg Transaction</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-purple-400">{vipSessions.length}</div>
            <div className="text-sm text-slate-400">VIP Sessions</div>
            <div className="text-xs text-slate-500 mt-1">${vipSessions.reduce((s, v) => s + (v.total_charge || 0), 0).toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-amber-400">
              {Math.ceil((new Date(filters.dateTo) - new Date(filters.dateFrom)) / (1000 * 60 * 60 * 24)) + 1}
            </div>
            <div className="text-sm text-slate-400">Days in Range</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Forecast */}
      {forecast && (
        <Card className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              7-Day Sales Forecast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                <div className="text-xs text-slate-400 mb-1">Low Estimate</div>
                <div className="text-2xl font-bold text-red-400">${forecast.next_7_days?.low?.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-cyan-500/50 text-center">
                <div className="text-xs text-slate-400 mb-1">Expected</div>
                <div className="text-3xl font-bold text-cyan-400">${forecast.next_7_days?.mid?.toFixed(2)}</div>
                <Badge className="mt-2 bg-cyan-500/20 text-cyan-400">{(forecast.confidence * 100).toFixed(0)}% confidence</Badge>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                <div className="text-xs text-slate-400 mb-1">High Estimate</div>
                <div className="text-2xl font-bold text-green-400">${forecast.next_7_days?.high?.toFixed(2)}</div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-purple-400 mb-2">Key Drivers</h4>
                <ul className="space-y-1">
                  {forecast.key_drivers?.map((d, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-purple-400">•</span>{d}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-400 mb-2">Risks</h4>
                <ul className="space-y-1">
                  {forecast.risks?.map((r, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-red-400">•</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-cyan-400 mb-2">AI Recommendations</h4>
              <div className="space-y-2">
                {forecast.recommendations?.map((rec, i) => (
                  <div key={i} className="p-2 bg-slate-800/50 rounded text-sm text-slate-300">{i+1}. {rec}</div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Generation */}
      <Card className="bg-slate-900/50 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Generate Z-Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Opening Cash</Label>
              <Input
                type="number"
                step="0.01"
                value={openingCash}
                onChange={(e) => setOpeningCash(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
                placeholder="0.00"
              />
            </div>
            <div>
              <Label className="text-slate-300">Closing Cash</Label>
              <Input
                type="number"
                step="0.01"
                value={closingCash}
                onChange={(e) => setClosingCash(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => generateZReport.mutate()}
              disabled={generateZReport.isPending}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600"
            >
              <Printer className="w-4 h-4 mr-2" />
              {generateZReport.isPending ? 'Generating...' : 'Generate & Print'}
            </Button>
            <Button
              onClick={generateForecast}
              disabled={aiLoading || transactions.length === 0}
              variant="outline"
              className="border-purple-500/50 hover:bg-purple-500/10"
            >
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Brain className="w-4 h-4 mr-2" />}
              AI Forecast
            </Button>
            <Button onClick={exportJSON} variant="outline" className="border-slate-600">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}