import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DataTable from '@/components/dashboard/DataTable';
import { navItems } from '@/components/dashboard/DashboardData';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(navItems[0].items[0]);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    checkAuth();
    const savedTheme = localStorage.getItem('glyphlock_theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      setLoading(false);
    } catch (err) {
      base44.auth.redirectToLogin();
    }
  };

  const handleSelectItem = (item) => {
    setSelectedModel(item);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-3">
          <Loader2 className={`w-6 h-6 animate-spin ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
      <DashboardSidebar 
        onSelectItem={handleSelectItem} 
        selectedModel={selectedModel}
        darkMode={darkMode}
      />
      <main className="flex-1 overflow-hidden">
        <DataTable selectedModel={selectedModel} darkMode={darkMode} />
      </main>
    </div>
  );
}