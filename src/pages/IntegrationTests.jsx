import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, CheckCircle, XCircle, Loader2, Play, Database, CreditCard, Brain, Mail, Upload, Key, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function IntegrationTests() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [user, setUser] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(runTests, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  };

  const runTests = async () => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('testIntegrations', {});
      setResults(response.data);
    } catch (error) {
      console.error('Test execution failed:', error);
      setResults({
        error: error.message || 'Failed to execute tests',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const getTestIcon = (testName) => {
    const icons = {
      'Base44 Authentication': Key,
      'Entity CRUD Operations': Database,
      'Stripe API Connection': CreditCard,
      'Core LLM Integration': Brain,
      'Email Integration': Mail,
      'File Upload Integration': Upload,
      'Service Role Access': Shield
    };
    return icons[testName] || Shield;
  };

  const getStatusColor = (status) => {
    return status === 'PASS' ? 'text-green-400 bg-green-500/10 border-green-500' : 'text-red-400 bg-red-500/10 border-red-500';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">This page requires admin privileges</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                Backend Integration Tests
              </h1>
              <p className="text-gray-400">Comprehensive testing of all backend integrations and services</p>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4 rounded accent-cyan-600"
                />
                Auto-refresh (30s)
              </label>
              
              <Button
                onClick={runTests}
                disabled={loading}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run All Tests
                  </>
                )}
              </Button>
            </div>
          </div>

          {results?.summary && (
            <div className={`p-6 rounded-xl border ${
              results.summary.failed === 0 
                ? 'bg-green-500/10 border-green-500' 
                : 'bg-red-500/10 border-red-500'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {results.summary.overallStatus}
                  </h2>
                  <p className="text-sm text-gray-300">
                    {results.summary.passed} of {results.summary.total} tests passed ({results.summary.successRate})
                  </p>
                </div>
                <div className="text-4xl">
                  {results.summary.failed === 0 ? '✅' : '⚠️'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Test Results */}
        {results?.tests ? (
          <div className="space-y-4">
            {results.tests.map((test, idx) => {
              const TestIcon = getTestIcon(test.name);
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-xl border ${
                    test.status === 'PASS'
                      ? 'bg-gray-900 border-gray-800 hover:border-green-500/50'
                      : 'bg-red-500/5 border-red-500/50'
                  } transition-colors`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <TestIcon className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-lg font-semibold text-white">{test.name}</h3>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(test.status)}`}>
                      {test.status === 'PASS' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span className="font-semibold text-sm">{test.status}</span>
                    </div>
                  </div>

                  {test.details && (
                    <div className="mt-3 p-3 bg-black/30 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Test Details:</p>
                      <pre className="text-xs text-gray-300 overflow-x-auto">
                        {JSON.stringify(test.details, null, 2)}
                      </pre>
                    </div>
                  )}

                  {test.error && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500 rounded-lg">
                      <p className="text-xs text-red-400 font-semibold mb-1">Error:</p>
                      <p className="text-sm text-red-300">{test.error}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : results?.error ? (
          <div className="p-6 bg-red-500/10 border border-red-500 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <XCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold text-red-400">Test Execution Failed</h3>
            </div>
            <p className="text-red-300">{results.error}</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <RefreshCw className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tests run yet</p>
            <p className="text-gray-600 text-sm mt-2">Click "Run All Tests" to begin</p>
          </div>
        )}

        {/* Test Metadata */}
        {results?.timestamp && (
          <div className="mt-6 p-4 bg-gray-900 border border-gray-800 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Last Test Run:</span>
              <span className="text-gray-300">{new Date(results.timestamp).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-500">Executed By:</span>
              <span className="text-gray-300">{results.testExecutor}</span>
            </div>
          </div>
        )}

        {/* Integration Status Panel */}
        <div className="mt-8 p-6 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-800 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Integration Status
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-black/30 rounded-lg text-center">
              <p className="text-xs text-gray-500 mb-1">Stripe</p>
              <p className="text-sm font-semibold text-white">
                {results?.tests?.find(t => t.name === 'Stripe API Connection')?.status === 'PASS' ? '✅ Connected' : '⚠️ Check'}
              </p>
            </div>
            <div className="p-3 bg-black/30 rounded-lg text-center">
              <p className="text-xs text-gray-500 mb-1">Database</p>
              <p className="text-sm font-semibold text-white">
                {results?.tests?.find(t => t.name === 'Entity CRUD Operations')?.status === 'PASS' ? '✅ Operational' : '⚠️ Check'}
              </p>
            </div>
            <div className="p-3 bg-black/30 rounded-lg text-center">
              <p className="text-xs text-gray-500 mb-1">AI/LLM</p>
              <p className="text-sm font-semibold text-white">
                {results?.tests?.find(t => t.name === 'Core LLM Integration')?.status === 'PASS' ? '✅ Active' : '⚠️ Check'}
              </p>
            </div>
            <div className="p-3 bg-black/30 rounded-lg text-center">
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-sm font-semibold text-white">
                {results?.tests?.find(t => t.name === 'Email Integration')?.status === 'PASS' ? '✅ Ready' : '⚠️ Check'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}