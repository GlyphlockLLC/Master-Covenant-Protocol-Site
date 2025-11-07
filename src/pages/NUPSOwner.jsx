
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, DollarSign, ShoppingCart, Package, TrendingUp, 
  Users, LogOut, Calendar, BarChart3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NUPSProductManagement from "../components/nups/ProductManagement";
import NUPSTransactionHistory from "../components/nups/TransactionHistory";
import NUPSSalesReport from "../components/nups/SalesReport";
import AIInsights from "../components/nups/AIInsights";
import CustomerManagement from "../components/nups/CustomerManagement";
import CustomerInsights from "../components/nups/CustomerInsights";
import MarketingCampaigns from "../components/nups/MarketingCampaigns";

export default function NUPSOwner() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (currentUser.role !== 'admin') {
          window.location.href = '/nups-staff';
        }
        setUser(currentUser);
      } catch (error) {
        base44.auth.redirectToLogin('/nups-login');
      }
    };
    checkAuth();
  }, []);

  const { data: transactions = [] } = useQuery({
    queryKey: ['pos-transactions'],
    queryFn: () => base44.entities.POSTransaction.list('-created_date')
  });

  const { data: products = [] } = useQuery({
    queryKey: ['pos-products'],
    queryFn: () => base44.entities.POSProduct.list()
  });

  const todayTransactions = transactions.filter(t => {
    const txDate = new Date(t.created_date);
    const today = new Date();
    return txDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const totalRevenue = transactions.reduce((sum, t) => sum + (t.total || 0), 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-purple-500/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-purple-400" />
            <div>
              <h1 className="text-xl font-bold">N.U.P.S. Administration</h1>
              <p className="text-sm text-gray-400">Owner Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{user?.email}</span>
              <Badge variant="outline" className="border-purple-500/50 text-purple-400">Owner</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => base44.auth.logout()}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="dashboard" className="text-white data-[state=active]:text-cyan-400">Dashboard</TabsTrigger>
            <TabsTrigger value="ai-insights" className="text-white data-[state=active]:text-cyan-400">AI Insights</TabsTrigger>
            <TabsTrigger value="customers" className="text-white data-[state=active]:text-cyan-400">Customers</TabsTrigger>
            <TabsTrigger value="customer-insights" className="text-white data-[state=active]:text-cyan-400">Customer Insights</TabsTrigger>
            <TabsTrigger value="campaigns" className="text-white data-[state=active]:text-cyan-400">Campaigns</TabsTrigger>
            <TabsTrigger value="products" className="text-white data-[state=active]:text-cyan-400">Products</TabsTrigger>
            <TabsTrigger value="sales" className="text-white data-[state=active]:text-cyan-400">Sales</TabsTrigger>
            <TabsTrigger value="batches" className="text-white data-[state=active]:text-cyan-400">Batches</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 text-cyan-400" />
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-cyan-400 mb-1">
                    ${todayRevenue.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Today's Revenue</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <ShoppingCart className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-purple-400 mb-1">
                    {todayTransactions.length}
                  </div>
                  <div className="text-sm text-gray-400">Today's Transactions</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    {products.length}
                  </div>
                  <div className="text-sm text-gray-400">Total Products</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border-orange-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="w-8 h-8 text-orange-400" />
                  </div>
                  <div className="text-3xl font-bold text-orange-400 mb-1">
                    ${totalRevenue.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Total Revenue</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-insights">
            <AIInsights />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerManagement />
          </TabsContent>

          <TabsContent value="customer-insights">
            <CustomerInsights />
          </TabsContent>

          <TabsContent value="campaigns">
            <MarketingCampaigns />
          </TabsContent>

          <TabsContent value="products">
            <NUPSProductManagement />
          </TabsContent>

          <TabsContent value="sales">
            <NUPSTransactionHistory transactions={transactions} />
          </TabsContent>

          <TabsContent value="batches">
            <NUPSSalesReport transactions={transactions} products={products} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
