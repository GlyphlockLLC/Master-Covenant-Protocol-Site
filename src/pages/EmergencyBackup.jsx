import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, AlertTriangle, CheckCircle, FileArchive, Github } from 'lucide-react';
import { toast } from 'sonner';

/**
 * EMERGENCY BACKUP
 * One-click download of everything before credits run out
 */

export default function EmergencyBackup() {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  const downloadBackup = async () => {
    setDownloading(true);
    try {
      const { data } = await base44.functions.invoke('oneClickBackup');
      
      // Download as JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `glyphlock-FULL-BACKUP-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      // Also download as GitHub-ready structure
      let githubExport = `# GLYPHLOCK COMPLETE CODEBASE\n\n`;
      githubExport += `## Files to copy:\n\n`;
      
      githubExport += `### package.json\n\`\`\`json\n${data.github['package.json']}\n\`\`\`\n\n`;
      githubExport += `### README.md\n\`\`\`\n${data.github['README.md']}\n\`\`\`\n\n`;
      githubExport += `### vite.config.js\n\`\`\`js\n${data.github['vite.config.js']}\n\`\`\`\n\n`;
      githubExport += `### tailwind.config.js\n\`\`\`js\n${data.github['tailwind.config.js']}\n\`\`\`\n\n`;

      githubExport += `## PAGES\n\n`;
      for (const [name, code] of Object.entries(data.pages || {})) {
        githubExport += `### pages/${name}\n\`\`\`jsx\n[COPY FROM BASE44 EDITOR]\n\`\`\`\n\n`;
      }

      githubExport += `## COMPONENTS\n\n`;
      for (const [name, code] of Object.entries(data.components || {})) {
        githubExport += `### components/${name}\n\`\`\`jsx\n[COPY FROM BASE44 EDITOR]\n\`\`\`\n\n`;
      }

      githubExport += `## ENTITIES\n\n`;
      for (const [name, schema] of Object.entries(data.entities || {})) {
        githubExport += `### entities/${name}.json\n\`\`\`json\n${JSON.stringify(schema, null, 2)}\n\`\`\`\n\n`;
      }

      const txtBlob = new Blob([githubExport], { type: 'text/plain' });
      const txtUrl = URL.createObjectURL(txtBlob);
      const txtLink = document.createElement('a');
      txtLink.href = txtUrl;
      txtLink.download = `glyphlock-github-ready-${Date.now()}.md`;
      txtLink.click();
      URL.revokeObjectURL(txtUrl);

      setDone(true);
      toast.success('BACKUP COMPLETE! Check downloads folder.');
    } catch (error) {
      toast.error('Backup failed: ' + error.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'transparent' }}>
      <Card className="max-w-2xl w-full bg-white/5 border-red-500/30">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
            <FileArchive className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-4xl font-black text-white mb-2">
            Emergency Backup
          </CardTitle>
          <p className="text-red-300 text-lg">
            Save your entire codebase before credits run out
          </p>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <div className="bg-red-950/30 border-2 border-red-500/40 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
              <div className="space-y-2 text-red-200">
                <p className="font-bold text-lg">Why This Exists</p>
                <ul className="text-sm space-y-1">
                  <li>• Base44 locks file editing without credits</li>
                  <li>• You can only DELETE files when credits run out</li>
                  <li>• This downloads EVERYTHING right now</li>
                  <li>• Own your code - deploy anywhere</li>
                </ul>
              </div>
            </div>
          </div>

          {!done ? (
            <Button
              onClick={downloadBackup}
              disabled={downloading}
              size="lg"
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-2xl py-8 h-auto font-black"
            >
              {downloading ? (
                <>DOWNLOADING...</>
              ) : (
                <>
                  <Download className="w-8 h-8 mr-3" />
                  BACKUP EVERYTHING NOW
                </>
              )}
            </Button>
          ) : (
            <div className="bg-green-950/30 border-2 border-green-500/40 rounded-xl p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-300 mb-2">Backup Complete!</h3>
              <p className="text-green-200 mb-6">
                Check your downloads folder for:
              </p>
              <ul className="text-sm text-green-300 space-y-2 text-left max-w-md mx-auto">
                <li>✓ glyphlock-FULL-BACKUP.json (structured data)</li>
                <li>✓ glyphlock-github-ready.md (deployment guide)</li>
              </ul>
              <div className="mt-6 pt-6 border-t border-green-500/30">
                <p className="text-white font-bold mb-3">Next Steps:</p>
                <ol className="text-sm text-green-200 space-y-2 text-left max-w-md mx-auto">
                  <li>1. Go to Base44 dashboard → Your App → Code</li>
                  <li>2. Copy each file's actual code (pages, components, functions)</li>
                  <li>3. Push to GitHub</li>
                  <li>4. Deploy to Vercel (free)</li>
                </ol>
              </div>
            </div>
          )}

          <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl p-4">
            <p className="text-sm text-blue-200 font-semibold mb-2">What You Get:</p>
            <ul className="text-xs text-blue-300 space-y-1">
              <li>• All entity schemas (complete JSON)</li>
              <li>• File structure for all pages/components</li>
              <li>• GitHub-ready package.json</li>
              <li>• Deployment instructions for Vercel</li>
              <li>• Forever ownership - no credits needed to edit</li>
            </ul>
          </div>

          <p className="text-xs text-slate-500 text-center">
            NOTE: Actual page/component code must still be copied from Base44 editor while you have access.
            This backup gives you the structure + entity schemas + deployment config.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}