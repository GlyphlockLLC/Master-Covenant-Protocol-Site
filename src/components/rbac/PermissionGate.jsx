import React from 'react';
import { Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * RBAC Permission System
 * Roles: admin, manager, staff, entertainer, user
 * 
 * Permission Hierarchy:
 * - admin: Full access to everything
 * - manager: Access to all NUPS operations except admin-only tools
 * - staff: Access to POS, VIP tracking, basic operations
 * - entertainer: Access to time clock, own profile
 * - user: Public access only
 */

export const PERMISSIONS = {
  // Console Permissions
  'console.access': ['admin'],
  'console.api_keys': ['admin'],
  'console.security': ['admin'],
  'console.users': ['admin'],
  'console.logs': ['admin'],
  'console.analytics': ['admin'],
  
  // NUPS Permissions
  'nups.timeclock': ['admin', 'manager', 'staff', 'entertainer'],
  'nups.pos': ['admin', 'manager', 'staff'],
  'nups.vouchers': ['admin', 'manager'],
  'nups.contracts': ['admin', 'manager'],
  'nups.vip': ['admin', 'manager', 'staff'],
  'nups.rooms': ['admin', 'manager', 'staff'],
  'nups.entertainers': ['admin', 'manager', 'staff'],
  'nups.inventory': ['admin', 'manager'],
  'nups.products': ['admin', 'manager'],
  'nups.users': ['admin', 'manager'],
  'nups.reports': ['admin', 'manager'],
  'nups.ai_insights': ['admin'],
  'nups.zreport': ['admin', 'manager'],
  
  // Data Operations
  'data.delete': ['admin'],
  'data.export': ['admin', 'manager'],
  'data.import': ['admin', 'manager'],
  
  // Security Operations
  'security.threat_response': ['admin'],
  'security.key_rotation': ['admin'],
  'security.audit_logs': ['admin', 'manager'],
};

export function hasPermission(userRole, permission) {
  if (!userRole || !permission) return false;
  const allowedRoles = PERMISSIONS[permission];
  if (!allowedRoles) return false;
  return allowedRoles.includes(userRole.toLowerCase());
}

export function PermissionGate({ permission, userRole, children, fallback = null }) {
  if (!hasPermission(userRole, permission)) {
    return fallback || (
      <Card className="bg-slate-900/50 border-red-500/30">
        <CardContent className="p-12 text-center">
          <Lock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Access Denied</h3>
          <p className="text-slate-400">You don't have permission to access this feature.</p>
          <p className="text-xs text-slate-500 mt-2">Required: {permission}</p>
        </CardContent>
      </Card>
    );
  }
  
  return <>{children}</>;
}

export function usePermission(userRole) {
  return {
    can: (permission) => hasPermission(userRole, permission),
    cannot: (permission) => !hasPermission(userRole, permission),
    isAdmin: userRole?.toLowerCase() === 'admin',
    isManager: userRole?.toLowerCase() === 'manager',
    isStaff: userRole?.toLowerCase() === 'staff',
    isEntertainer: userRole?.toLowerCase() === 'entertainer'
  };
}