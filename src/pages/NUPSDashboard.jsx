import React, { useState, useEffect, lazy, Suspense } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, DollarSign, ShoppingCart, Users, LogOut, 
  Printer, CreditCard, DoorOpen, FileText, UserCheck,
  Package, BarChart3, Settings, Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Lazy load components
const POSCashRegister = lazy(() => import("../components/nups/POSCashRegister.jsx"));
const VIPRoomManagement = lazy(() => import("../components/nups/VIPRoomManagement.jsx"));
const EntertainerCheckIn = lazy(() => import("../components/nups/EntertainerCheckIn.jsx"));
const GuestTracking = lazy(() => import("../components/nups/GuestTracking.jsx"));
const ZReportGenerator = lazy(() => import("../components/nups/ZReportGenerator.jsx"));
const ProductManagement = lazy(() => import("../components/nups/ProductManagement.jsx"));
const VoucherPrinter4Bill = lazy(() => import("../components/nups/VoucherPrinter4Bill.jsx"));
const VoucherPrinter5Sheet = lazy(() => import("../components/nups/VoucherPrinter5Sheet.jsx"));
const BatchManagement = lazy(() => import("../components/nups/BatchManagement.jsx"));
const TransactionHistory = lazy(() => import("../components/nups/TransactionHistory.jsx"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
  </div>
);

export default function NUPSDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          window.location.href = createPageUrl('NUPSLogin');
          return;
        }
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth error:', error);
        window.location.href = createPageUrl('NUPSLogin');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const isAdmin = user?.role === 'admin';

  const { data: transactions = [] } = useQuery({
    queryKey: ['nups-transactions'],
    queryFn: () => base44.entities.POSTransaction.list('-created_date', 100),
    enabled: !!user
  });

  const { data: entertainers = [] } = useQuery({
    queryKey: ['nups-entertainers'],
    queryFn: () => base44.entities.Entertainer.list(),
    enabled: !!user
  });

  const { data: activeShifts = [] } = useQuery({
    queryKey: ['nups-shifts'],
    queryFn: async () => {
      const shifts = await base44.entities.EntertainerShift.list('-created_date', 100);
      return shifts.filter(s => !s.check_out_time);
    },
    enabled: !!user
  });

  const { data: vipRooms = [] } = useQuery({
    queryKey: ['nups-rooms'],
    queryFn: () => base44.entities.VIPRoom.list(),
    enabled: !!user
  });

  const { data: products = [] } = useQuery({
    queryKey: ['nups-products'],
    queryFn: () => base44.entities.POSProduct.list(),
    enabled: !!user
  });

  // Calculate stats
  const today = new Date().toDateString();
  const todayTransactions = transactions.filter(t => 
    new Date(t.created_date).toDateString() === today
  );
  const todayRevenue = todayTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const occupiedRooms = vipRooms.filter(r => r.status === 'occupied').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading N.U.P.S. Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border-b border-purple-500/30 p-4 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                N.U.P.S.
              </h1>
              <p className="text-xs text-gray-400">Nexus Universal Point-of-Sale</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-white">{user?.email}</span>
              <Badge className={isAdmin ? 'bg-purple-500/30 text-purple-400' : 'bg-cyan-500/30 text-cyan-400'}>
                {isAdmin ? 'Owner' : 'Staff'}
              </Badge>
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

      <div className="container mx-auto p-4 md:p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="glass-card-dark border-green-500/30">
            <CardContent className="p-4">
              <DollarSign className="w-6 h-6 text-green-400 mb-2" />
              <div className="text-2xl font-bold text-green-400">${todayRevenue.toFixed(0)}</div>
              <div className="text-xs text-gray-400">Today's Revenue</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card-dark border-cyan-500/30">
            <CardContent className="p-4">
              <ShoppingCart className="w-6 h-6 text-cyan-400 mb-2" />
              <div className="text-2xl font-bold text-cyan-400">{todayTransactions.length}</div>
              <div className="text-xs text-gray-400">Transactions</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card-dark border-purple-500/30">
            <CardContent className="p-4">
              <UserCheck className="w-6 h-6 text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-purple-400">{activeShifts.length}/{entertainers.length}</div>
              <div className="text-xs text-gray-400">Staff Active</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card-dark border-pink-500/30">
            <CardContent className="p-4">
              <DoorOpen className="w-6 h-6 text-pink-400 mb-2" />
              <div className="text-2xl font-bold text-pink-400">{occupiedRooms}/{vipRooms.length}</div>
              <div className="text-xs text-gray-400">VIP Rooms</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card-dark border-amber-500/30">
            <CardContent className="p-4">
              <Package className="w-6 h-6 text-amber-400 mb-2" />
              <div className="text-2xl font-bold text-amber-400">{products.length}</div>
              <div className="text-xs text-gray-400">Products</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap gap-1 bg-gray-900/50 border border-gray-800 p-1 mb-6">
            <TabsTrigger value="overview" className="min-w-[80px]">
              <BarChart3 className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="pos" className="min-w-[80px]">
              <CreditCard className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">POS</span>
            </TabsTrigger>
            <TabsTrigger value="vip" className="min-w-[80px]">
              <DoorOpen className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">VIP</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="min-w-[80px]">
              <UserCheck className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Staff</span>
            </TabsTrigger>
            {isAdmin && (
              <>
                <TabsTrigger value="vouchers" className="min-w-[80px]">
                  <Printer className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Vouchers</span>
                </TabsTrigger>
                <TabsTrigger value="products" className="min-w-[80px]">
                  <Package className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Products</span>
                </TabsTrigger>
                <TabsTrigger value="reports" className="min-w-[80px]">
                  <FileText className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Reports</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <Suspense fallback={<LoadingFallback />}>
            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="glass-card-dark border-cyan-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => setActiveTab('pos')} 
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Open Cash Register
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('vip')} 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      <DoorOpen className="w-4 h-4 mr-2" />
                      Manage VIP Rooms
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('staff')} 
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Check In Staff
                    </Button>
                    {isAdmin && (
                      <Button 
                        onClick={() => setActiveTab('vouchers')} 
                        variant="outline"
                        className="w-full border-amber-500/50 text-amber-400"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print Vouchers
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="glass-card-dark border-purple-500/30 md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {todayTransactions.slice(0, 10).map(tx => (
                        <div key={tx.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                          <div>
                            <div className="text-sm text-white">{tx.transaction_id}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(tx.created_date).toLocaleTimeString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-400 font-bold">${tx.total?.toFixed(2)}</div>
                            <Badge variant="outline" className="text-xs">
                              {tx.payment_method}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {todayTransactions.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No transactions today
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* POS Tab */}
            <TabsContent value="pos">
              <POSCashRegister user={user} />
            </TabsContent>

            {/* VIP Tab */}
            <TabsContent value="vip">
              <div className="space-y-6">
                <VIPRoomManagement />
                <GuestTracking />
              </div>
            </TabsContent>

            {/* Staff Tab */}
            <TabsContent value="staff">
              <EntertainerCheckIn />
            </TabsContent>

            {/* Vouchers Tab (Admin Only) */}
            {isAdmin && (
              <TabsContent value="vouchers">
                <Tabs defaultValue="4bill">
                  <TabsList className="mb-4">
                    <TabsTrigger value="4bill">4-Bill Printer</TabsTrigger>
                    <TabsTrigger value="5sheet">5-Sheet Printer</TabsTrigger>
                  </TabsList>
                  <TabsContent value="4bill">
                    <VoucherPrinter4Bill />
                  </TabsContent>
                  <TabsContent value="5sheet">
                    <VoucherPrinter5Sheet />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            )}

            {/* Products Tab (Admin Only) */}
            {isAdmin && (
              <TabsContent value="products">
                <ProductManagement />
              </TabsContent>
            )}

            {/* Reports Tab (Admin Only) */}
            {isAdmin && (
              <TabsContent value="reports">
                <ZReportGenerator user={user} />
              </TabsContent>
            )}
          </Suspense>
        </Tabs>
      </div>
    </div>
  );
}