import React, { useEffect, useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';

export default function SecurityMonitor() {
  const [threats, setThreats] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const failCountRef = useRef(0);
  const maxFailures = 3;

  useEffect(() => {
    // Initial delay to let app fully load
    const initialDelay = setTimeout(() => {
      checkSecurity();
    }, 5000);
    
    // Check every 60 seconds (reduced frequency)
    const interval = setInterval(() => {
      // Only check if we haven't had too many failures
      if (failCountRef.current < maxFailures) {
        checkSecurity();
      }
    }, 60000);
    
    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  const checkSecurity = async () => {
    // Skip if already monitoring or too many failures
    if (isMonitoring || failCountRef.current >= maxFailures) return;
    
    try {
      setIsMonitoring(true);
      const response = await base44.functions.invoke('botSecurityCheck');
      
      // Reset fail count on success
      failCountRef.current = 0;
      
      if (response.data?.threats?.length > 0) {
        setThreats(prev => [...response.data.threats, ...prev].slice(0, 10));
      }
    } catch (error) {
      // Silently increment fail count - don't spam console
      failCountRef.current += 1;
      // Only log on first failure
      if (failCountRef.current === 1) {
        console.warn('Security monitoring unavailable - will retry');
      }
    } finally {
      setIsMonitoring(false);
    }
  };

  // Silent monitoring - no UI for regular users
  return null;
}