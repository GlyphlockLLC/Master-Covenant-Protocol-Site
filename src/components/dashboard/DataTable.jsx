import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DataTable({ selectedModel, darkMode }) {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['entity', selectedModel?.entity],
    queryFn: async () => {
      if (!selectedModel?.entity) return [];
      return await base44.entities[selectedModel.entity].list();
    },
    enabled: !!selectedModel?.entity,
    refetchOnWindowFocus: false,
  });

  if (!selectedModel) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div>
          <h2 className={`text-2xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Welcome to the Dashboard
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
            Select a data model from the sidebar to view its contents.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2">
          <Loader2 className={`w-5 h-5 animate-spin ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Loading {selectedModel.label}...
          </p>
        </div>
      </div>
    );
  }

  const records = data || [];
  const columns = records.length > 0 ? Object.keys(records[0]).filter(key => 
    !['__v'].includes(key)
  ) : [];

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {selectedModel.label}
        </h1>
        <Button
          onClick={() => refetch()}
          disabled={isRefetching}
          variant="outline"
          size="sm"
          className={darkMode ? 'border-gray-700 text-gray-300' : ''}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {records.length === 0 ? (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>No records found for {selectedModel.label}.</p>
        </div>
      ) : (
        <div className={`overflow-x-auto rounded-lg shadow ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <table className="min-w-full border-collapse">
            <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className={`py-3 px-4 border-b text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-600 border-gray-200'
                    }`}
                  >
                    {col.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className={darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}
                >
                  {columns.map((col) => (
                    <td
                      key={col}
                      className={`py-3 px-4 border-b text-sm ${
                        darkMode ? 'text-gray-300 border-gray-800' : 'text-gray-700 border-gray-200'
                      }`}
                    >
                      {typeof row[col] === 'object' && row[col] !== null
                        ? JSON.stringify(row[col])
                        : String(row[col] || '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Total records: {records.length}
      </div>
    </div>
  );
}