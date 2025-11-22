import React, { useState, useEffect } from "react";
import { Users, Shield, Activity, Search, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { glyphLockAPI } from "@/components/api/glyphLockAPI";
import { toast } from "sonner";

export default function AdminUserManagement({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user?.role === "admin") {
      loadUsers();
    }
  }, [user]);

  const loadUsers = async () => {
    try {
      const data = await glyphLockAPI.listUsers();
      setUsers(data.users || []);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (user?.role !== "admin") {
    return (
      <Card className="bg-[#0A0F24] border-[#8C4BFF]/20">
        <CardContent className="p-12 text-center">
          <Shield className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <p className="text-white/70">Admin access required</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-white/70">Manage user accounts and permissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#0A0F24] border-[#8C4BFF]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <Users className="w-10 h-10 text-[#8C4BFF]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0F24] border-[#00E4FF]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Active Users</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.status === 'active').length}</p>
              </div>
              <Activity className="w-10 h-10 text-[#00E4FF]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0F24] border-[#9F00FF]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Admins</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</p>
              </div>
              <Shield className="w-10 h-10 text-[#9F00FF]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="pl-10 bg-[#0A0F24] border-[#8C4BFF]/20 text-white"
        />
      </div>

      {/* Users Table */}
      <Card className="bg-[#0A0F24] border-[#8C4BFF]/20">
        <CardHeader>
          <CardTitle className="text-white">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">User</th>
                  <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Joined</th>
                  <th className="text-right py-3 px-4 text-white/70 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-white/70">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-white/70">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#8C4BFF]/20 flex items-center justify-center">
                            <span className="text-sm font-medium text-[#8C4BFF]">
                              {u.full_name?.[0] || u.email?.[0]?.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-white">{u.full_name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-white/70">{u.email}</td>
                      <td className="py-4 px-4">
                        <Badge className={u.role === 'admin' ? 'bg-[#9F00FF]/20 text-[#9F00FF]' : 'bg-blue-500/20 text-blue-400'}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className="bg-green-500/20 text-green-400">
                          Active
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-white/70">
                        {new Date(u.created_date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button size="sm" variant="ghost" className="text-white/70 hover:text-white">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}