import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Trash2, Edit2, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function EmployeeManagement({ user }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    role: 'staff',
    phone: '',
    employee_id: ''
  });

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Fetch NUPS users
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['nups-users'],
    queryFn: () => base44.entities.NUPSUser.list(),
    enabled: isAdmin
  });

  // Create employee mutation
  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.NUPSUser.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nups-users'] });
      toast.success('Employee added successfully');
      setFormData({ username: '', full_name: '', role: 'staff', phone: '', employee_id: '' });
      setShowForm(false);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to add employee');
    }
  });

  // Update employee mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.NUPSUser.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nups-users'] });
      toast.success('Employee updated successfully');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update employee');
    }
  });

  // Delete employee mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.NUPSUser.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nups-users'] });
      toast.success('Employee removed');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to remove employee');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username?.trim() || !formData.full_name?.trim()) {
      toast.error('Username and full name are required');
      return;
    }
    createMutation.mutate(formData);
  };

  if (!isAdmin) {
    return (
      <Card className="bg-slate-900/50 border-red-500/30">
        <CardContent className="p-6 text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-3 opacity-50" />
          <p className="text-red-400">🔒 Only administrators can manage employees</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Employee Form */}
      {showForm && (
        <Card className="bg-slate-900/50 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-cyan-300 flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Add New Employee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="e.g., john.doe"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="John Doe"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Employee ID</Label>
                  <Input
                    value={formData.employee_id}
                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                    placeholder="EMP-001"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="entertainer">Entertainer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending} className="bg-cyan-600 hover:bg-cyan-700">
                  {createMutation.isPending ? 'Adding...' : 'Add Employee'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Employees List */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Team Members ({employees.length})
          </CardTitle>
          <Button onClick={() => setShowForm(!showForm)} className="bg-cyan-600 hover:bg-cyan-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6 text-slate-400">Loading employees...</div>
          ) : employees.length === 0 ? (
            <div className="text-center py-6 text-slate-400">No employees yet</div>
          ) : (
            <div className="space-y-2">
              {employees.map((emp) => (
                <div key={emp.id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-between hover:border-slate-600 transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white font-bold">{emp.full_name?.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{emp.full_name}</p>
                        <p className="text-xs text-slate-400">@{emp.username} • {emp.employee_id || '—'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={
                      emp.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                      emp.role === 'manager' ? 'bg-purple-500/20 text-purple-400' :
                      emp.role === 'entertainer' ? 'bg-pink-500/20 text-pink-400' :
                      'bg-blue-500/20 text-blue-400'
                    }>
                      {emp.role}
                    </Badge>
                    <Badge className={emp.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {emp.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => {
                        if (confirm(`Remove ${emp.full_name}?`)) {
                          deleteMutation.mutate(emp.id);
                        }
                      }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}