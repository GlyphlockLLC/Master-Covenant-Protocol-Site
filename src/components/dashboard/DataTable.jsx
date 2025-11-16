import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";

export default function DataTable({ selectedModel }) {
  const { data: records = [], isLoading, refetch } = useQuery({
    queryKey: ['entity-data', selectedModel?.entity],
    queryFn: () => selectedModel ? base44.entities[selectedModel.entity].list() : [],
    enabled: !!selectedModel
  });

  if (!selectedModel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black" style={{ backgroundColor: '#000000' }}>
        <div className="text-center">
          <Database className="w-20 h-20 mx-auto mb-4 text-gray-700" />
          <h3 className="text-2xl font-bold mb-2 text-white">
            Select a Data Model
          </h3>
          <p className="text-gray-400">
            Choose a model from the sidebar to view and manage data
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-8 bg-black" style={{ backgroundColor: '#000000' }}>
        <LoadingSpinner message={`Loading ${selectedModel.label}...`} />
      </div>
    );
  }

  const columns = records.length > 0 ? Object.keys(records[0]) : [];

  return (
    <div className="flex-1 p-8 bg-black overflow-auto" style={{ backgroundColor: '#000000' }}>
      <Card className="glass-card-dark" style={{ backgroundColor: 'rgba(10, 10, 20, 0.85)', border: '1px solid rgba(65, 105, 225, 0.4)' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">
              {selectedModel.label} ({records.length})
            </CardTitle>
            <Button
              onClick={() => refetch()}
              size="sm"
              variant="outline"
              className="border-blue-500/50 text-white hover:bg-blue-500/20"
              style={{ backgroundColor: 'rgba(20, 20, 30, 0.8)', borderColor: 'rgba(65, 105, 225, 0.5)' }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <EmptyState 
              icon={Database}
              title="No records found"
              description={`No ${selectedModel.label} records exist yet`}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" style={{ backgroundColor: 'transparent' }}>
                <thead>
                  <tr className="border-b border-blue-500/30">
                    {columns.map((col) => (
                      <th key={col} className="text-left p-3 font-semibold text-sm text-gray-400">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, idx) => (
                    <tr 
                      key={idx} 
                      className="border-b border-blue-500/20 hover:bg-blue-500/10"
                      style={{ backgroundColor: 'transparent' }}
                    >
                      {columns.map((col) => (
                        <td key={col} className="p-3 text-sm text-gray-300">
                          {typeof record[col] === 'object' 
                            ? JSON.stringify(record[col]) 
                            : String(record[col] || '-')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}