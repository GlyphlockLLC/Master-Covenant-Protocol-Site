
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Plus, Minus, Trash2, DollarSign, User, LogOut, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import AIProductRecommender from "../components/nups/AIProductRecommender";

export default function NUPSStaff() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    full_name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        base44.auth.redirectToLogin('/nups-login');
      }
    };
    checkAuth();
  }, []);

  const { data: products = [] } = useQuery({
    queryKey: ['pos-products'],
    queryFn: () => base44.entities.POSProduct.filter({ is_active: true })
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['pos-customers'],
    queryFn: () => base44.entities.POSCustomer.list()
  });

  const createCustomer = useMutation({
    mutationFn: (data) => base44.entities.POSCustomer.create({
      customer_id: `CUST-${Date.now()}`,
      ...data,
      total_spent: 0,
      visit_count: 0,
      loyalty_points: 0,
      last_visit: null,
      preferences: {
        favorite_categories: [],
        communication_preferences: { email: true, sms: false, phone: false }
      }
    }),
    onSuccess: (customer) => {
      queryClient.invalidateQueries({ queryKey: ['pos-customers'] });
      setSelectedCustomer(customer);
      setShowCustomerDialog(false);
      setNewCustomerForm({ full_name: "", email: "", phone: "" });
    }
  });

  const createTransaction = useMutation({
    mutationFn: (data) => base44.entities.POSTransaction.create(data),
    onSuccess: () => {
      setCart([]);
      alert("Transaction completed successfully!");
      // Optionally re-fetch customer data to show updated stats if needed immediately
      // queryClient.invalidateQueries({ queryKey: ['pos-customers'] });
    }
  });

  const addToCart = (product) => {
    const existing = cart.find(item => item.product_id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setCart([...cart, {
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        price: product.price,
        total: product.price
      }]);
    }
  };

  const updateQuantity = (productId, delta) => {
    setCart(cart.map(item => {
      if (item.product_id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty, total: newQty * item.price };
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08; // 8% tax
    return { subtotal, tax, total: subtotal + tax };
  };

  const completeTransaction = async () => {
    const { subtotal, tax, total } = calculateTotal();
    
    const transactionData = {
      transaction_id: `TXN-${Date.now()}`,
      customer_id: selectedCustomer?.customer_id,
      items: cart,
      subtotal,
      tax,
      total,
      payment_method: paymentMethod,
      cashier: user?.email || 'unknown',
      loyalty_points_earned: selectedCustomer ? Math.floor(total) : 0
    };

    createTransaction.mutate(transactionData);

    // Update customer stats
    if (selectedCustomer) {
      await base44.entities.POSCustomer.update(selectedCustomer.id, {
        total_spent: (selectedCustomer.total_spent || 0) + total,
        visit_count: (selectedCustomer.visit_count || 0) + 1,
        loyalty_points: (selectedCustomer.loyalty_points || 0) + Math.floor(total),
        last_visit: new Date().toISOString()
      });
      // Invalidate customer query to reflect updated stats
      queryClient.invalidateQueries({ queryKey: ['pos-customers'] });
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { subtotal, tax, total } = calculateTotal();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-cyan-500/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-cyan-400" />
            <div>
              <h1 className="text-xl font-bold">N.U.P.S. POS</h1>
              <p className="text-sm text-gray-400">Staff Terminal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{user?.email}</span>
              <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">Staff</Badge>
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
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Products */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <CardTitle>Products</CardTitle>
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-800 border-gray-700 max-w-xs"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="bg-gray-800 border-gray-700 cursor-pointer hover:border-cyan-500/50 transition-all"
                      onClick={() => addToCart(product)}
                    >
                      <CardContent className="p-4">
                        <div className="aspect-square bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                          <ShoppingCart className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="font-semibold mb-1 truncate">{product.name}</h3>
                        <p className="text-sm text-gray-400 mb-2">{product.sku}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-cyan-400">${product.price.toFixed(2)}</span>
                          <Badge variant="outline" className="text-xs">{product.stock_quantity} in stock</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Customer Selection */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select 
                  value={selectedCustomer?.id || ""} 
                  onValueChange={(value) => {
                    if (value === "new") {
                      setShowCustomerDialog(true);
                    } else {
                      const customer = customers.find(c => c.id === value);
                      setSelectedCustomer(customer);
                    }
                  }}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select customer (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="new">+ Add New Customer</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedCustomer && (
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-600/10 border border-purple-500/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-white">{selectedCustomer.full_name}</div>
                      {selectedCustomer.status === 'vip' && (
                        <Badge variant="outline" className="border-purple-500 text-purple-400">
                          VIP
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-gray-400">Total Spent</div>
                        <div className="font-semibold text-cyan-400">${(selectedCustomer.total_spent || 0).toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Loyalty Points</div>
                        <div className="font-semibold text-green-400">{selectedCustomer.loyalty_points || 0}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCustomer(null)}
                      className="w-full mt-2 text-xs"
                    >
                      Clear Selection
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cart */}
            <Card className="bg-gray-900 border-gray-800 sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <span>Cart</span>
                  <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.product_id} className="bg-gray-800 p-3 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-medium text-sm flex-1">{item.product_name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.product_id)}
                              className="h-6 w-6 p-0 text-red-400"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0"
                                onClick={() => updateQuantity(item.product_id, -1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0"
                                onClick={() => updateQuantity(item.product_id, 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <span className="text-cyan-400 font-semibold">${item.total.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-800 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Tax (8%):</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-800">
                        <span>Total:</span>
                        <span className="text-cyan-400">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm text-gray-400 mb-2 block">Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Credit Card">Credit Card</SelectItem>
                          <SelectItem value="Debit Card">Debit Card</SelectItem>
                          <SelectItem value="Digital Wallet">Digital Wallet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={completeTransaction}
                      disabled={createTransaction.isPending}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      {createTransaction.isPending ? "Processing..." : "Complete Sale"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <AIProductRecommender 
              cartItems={cart}
              onAddToCart={addToCart}
              products={products}
            />
          </div>
        </div>
      </div>

      {/* New Customer Dialog */}
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            createCustomer.mutate(newCustomerForm);
          }} className="space-y-4">
            <div>
              <Label htmlFor="customer-full-name">Full Name *</Label>
              <Input
                id="customer-full-name"
                value={newCustomerForm.full_name}
                onChange={(e) => setNewCustomerForm({...newCustomerForm, full_name: e.target.value})}
                className="bg-gray-800 border-gray-700"
                required
              />
            </div>
            <div>
              <Label htmlFor="customer-email">Email</Label>
              <Input
                id="customer-email"
                type="email"
                value={newCustomerForm.email}
                onChange={(e) => setNewCustomerForm({...newCustomerForm, email: e.target.value})}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="customer-phone">Phone</Label>
              <Input
                id="customer-phone"
                value={newCustomerForm.phone}
                onChange={(e) => setNewCustomerForm({...newCustomerForm, phone: e.target.value})}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCustomerDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600"
                disabled={createCustomer.isPending || !newCustomerForm.full_name}
              >
                {createCustomer.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
