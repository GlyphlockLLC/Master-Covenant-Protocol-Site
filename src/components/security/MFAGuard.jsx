/**
 * MFAGuard - Higher-order component for protecting routes with MFA
 * Usage: wrap any component that requires MFA verification
 */

import React from 'react';
import RequireMFA from './RequireMFA';

export default function MFAGuard({ children }) {
  return (
    <RequireMFA>
      {children}
    </RequireMFA>
  );
}

// Export convenience wrapper
export function withMFA(Component) {
  return function MFAProtectedComponent(props) {
    return (
      <RequireMFA>
        <Component {...props} />
      </RequireMFA>
    );
  };
}