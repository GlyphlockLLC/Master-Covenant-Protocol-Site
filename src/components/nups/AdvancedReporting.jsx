import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, TrendingUp, TrendingDown, ShoppingCart, 
  Package, Users, Calendar, BarChart3 
} from "lucide-react";

export default function AdvancedReporting({ transactions, products, customers, locations }) {
  const [timeRange, setTimeRange] = useState("30");

  const now = new Date();
  const daysAgo = new Date(now.getTime() - parseInt(timeRange) * 24 * 60 * 60 * 1000);

  const filteredTransactions = transactions.filter(t => 
    new Date(t.created_date) >= daysAgo
  );

  // Revenue calculations
  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const totalTransactions = filteredTransactions.length;
  const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  // Calculate previous period for comparison
  const previousPeriodEnd = daysAgo;
  const previousPeriodStart = new Date(previousPeriodEnd.getTime() - parseInt(timeRange) * 24 * 60 * 60 * 1000);
  const previousTransactions = transactions.filter(t => {
    const date = new Date(t.created_date);
    return date >= previousPeriodStart && date < previousPeriodEnd;
  });
  const previousRevenue = previousTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

  // Payment methods breakdown
  const paymentMethods = {};
  filteredTransactions.forEach(t => {
    paymentMethods[t.payment_method] = (paymentMethods[t.payment_method] || 0) + 1;
  });

  // Top selling products
  const productSales = {};
  filteredTransactions.forEach(transaction => {
    transaction.items?.forEach(item => {
      if (!productSales[item.product_name]) {
        productSales[item.product_name] = { quantity: 0, revenue: 0 };
      }
      productSales[item.product_name].quantity += item.quantity;
      productSales[item.product_name].revenue += item.total;
    });
  });

  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5);

  // Location performance
  const locationSales = {};
  filteredTransactions.forEach(t => {
    if (t.location_id) {
      locationSales[t.location_id] = (locationSales[t.location_id] || 0) + (t.total || 0);
    }
  });

  // Hourly sales distribution
  const hourlySales = Array(24).fill(0);
  filteredTransactions.forEach(t => {
    const hour = new Date(t.created_date).getHours();
    hourlySales[hour] += t.total || 0;
  });
  const peakHour = hourlySales.indexOf(Math.max(...hourlySales));

  // Customer insights
  const newCustomers = customers.filter(c => new Date(c.created_date) >= daysAgo).length;
  const returningCustomers = filteredTransactions.filter(t => {
    const customer = customers.find(c => c.customer_id === t.customer_id);
    return customer && customer.visit_count > 1;
  }).length;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Performance Analytics</CardTitle>
            <Select value={timeRange || "30"} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-700/10 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-400" />
              {revenueGrowth >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="text-3xl font-bold text-white mb-1">${totalRevenue.toFixed(2)}</div>
            <div className="text-sm text-gray-400">Total Revenue</div>
            <Badge className={`mt-2 ${revenueGrowth >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}% vs previous
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalTransactions}</div>
            <div className="text-sm text-gray-400">Transactions</div>
            <div className="text-xs text-gray-500 mt-2">
              Avg: ${averageTransaction.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{newCustomers}</div>
            <div className="text-sm text-gray-400">New Customers</div>
            <div className="text-xs text-gray-500 mt-2">
              {returningCustomers} returning
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{peakHour}:00</div>
            <div className="text-sm text-gray-400">Peak Sales Hour</div>
            <div className="text-xs text-gray-500 mt-2">
              ${hourlySales[peakHour].toFixed(2)} revenue
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topProducts.map(([name, data], index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{name}</div>
                      <div className="text-sm text-gray-400">{data.quantity} units sold</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-400">${data.revenue.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">revenue</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(paymentMethods).map(([method, count]) => (
              <div key={method} className="bg-gray-800 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white mb-1">{count}</div>
                <div className="text-sm text-gray-400">{method}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {((count / totalTransactions) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location Performance */}
      {locations.length > 0 && Object.keys(locationSales).length > 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Location Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(locationSales)
                .sort((a, b) => b[1] - a[1])
                .map(([locationId, revenue]) => {
                  const location = locations.find(l => l.location_id === locationId);
                  return (
                    <div key={locationId} className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <BarChart3 className="w-5 h-5 text-blue-400" />
                          <span className="font-semibold text-white">
                            {location?.name || locationId}
                          </span>
                        </div>
                        <div className="text-xl font-bold text-green-400">
                          ${revenue.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}