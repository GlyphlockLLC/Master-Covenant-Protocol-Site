import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, AlertTriangle, CheckCircle2, Send } from 'lucide-react';

/**
 * AI Console Component
 * Handles file analysis and change proposals
 */
export default function AIConsole({ selectedFile, analysis, onAnalyze, onPropose }) {
  const [proposalInput, setProposalInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [proposing, setProposing] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      await onAnalyze();
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePropose = async () => {
    if (!proposalInput.trim()) return;
    
    setProposing(true);
    try {
      await onPropose(proposalInput);
      setProposalInput('');
    } finally {
      setProposing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePropose();
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          AI Console
        </h3>
        {selectedFile ? (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {selectedFile.name}
            </Badge>
            <Button
              onClick={handleAnalyze}
              disabled={analyzing}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze File'
              )}
            </Button>
          </div>
        ) : (
          <p className="text-xs text-gray-400">Select a file to begin</p>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <Card className="mb-4 bg-white/5 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">Summary</p>
              <p className="text-xs text-white">{analysis.summary}</p>
            </div>

            {analysis.issues && analysis.issues.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-2">Issues Found</p>
                <div className="space-y-2">
                  {analysis.issues.map((issue, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <AlertTriangle className="w-3 h-3 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-white">{issue.description}</p>
                        <p className="text-gray-500">Line {issue.line} • {issue.severity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.quality_score && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Quality Score</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                      style={{ width: `${analysis.quality_score}%` }}
                    />
                  </div>
                  <span className="text-xs text-white">{analysis.quality_score}%</span>
                </div>
              </div>
            )}

            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-2">Suggestions</p>
                <ul className="space-y-1">
                  {analysis.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-3 h-3 text-green-400 mt-0.5" />
                      <span className="text-white">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Proposal Input */}
      <div className="flex-1 flex flex-col">
        <p className="text-xs text-gray-400 mb-2">Describe the change you want to make:</p>
        <Textarea
          value={proposalInput}
          onChange={(e) => setProposalInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., Add error handling to the submit function..."
          className="flex-1 bg-white/5 border-blue-500/20 text-white text-xs resize-none"
          disabled={!selectedFile || proposing}
        />
        <div className="mt-2 flex justify-end">
          <Button
            onClick={handlePropose}
            disabled={!selectedFile || !proposalInput.trim() || proposing}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
          >
            {proposing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Generate Proposal
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}