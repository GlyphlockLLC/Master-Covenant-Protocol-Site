import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, RefreshCw, Edit, Check } from 'lucide-react';
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';

export default function GeneratedContent({ content, onCopy, onDownload, onRegenerate, isGenerating }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [wordCount, setWordCount] = useState(content.split(/\s+/).length);

  React.useEffect(() => {
    setEditedContent(content);
    setWordCount(content.split(/\s+/).filter(w => w).length);
  }, [content]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setEditedContent(newContent);
    setWordCount(newContent.split(/\s+/).filter(w => w).length);
  };

  return (
    <Card className="glass-royal border-cyan-500/30" style={{background: 'rgba(30, 58, 138, 0.2)', backdropFilter: 'blur(16px)'}}>
      <CardHeader style={{background: 'transparent'}}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Generated Content</CardTitle>
            <p className="text-white/60 text-sm mt-1">{wordCount} words</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleEdit}
              className="border-cyan-500/50 text-white hover:bg-cyan-500/20"
            >
              {isEditing ? <Check className="w-4 h-4 mr-1" /> : <Edit className="w-4 h-4 mr-1" />}
              {isEditing ? 'Done' : 'Edit'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCopy}
              className="border-cyan-500/50 text-white hover:bg-cyan-500/20"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onDownload}
              className="border-cyan-500/50 text-white hover:bg-cyan-500/20"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onRegenerate}
              disabled={isGenerating}
              className="border-cyan-500/50 text-white hover:bg-cyan-500/20"
            >
              <RefreshCw className={cn("w-4 h-4 mr-1", isGenerating && "animate-spin")} />
              Regenerate
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent style={{background: 'transparent'}}>
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={handleContentChange}
            className="glass-dark border-cyan-500/30 text-white min-h-[400px] font-mono"
          />
        ) : (
          <div className="glass-dark p-6 rounded-lg">
            <ReactMarkdown 
              className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-white prose-strong:text-white prose-ul:text-white prose-ol:text-white prose-li:text-white"
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-white">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-6 text-white">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-4 text-white">{children}</h3>,
                p: ({ children }) => <p className="mb-4 leading-relaxed text-white">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2 text-white">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-white">{children}</ol>,
                li: ({ children }) => <li className="text-white">{children}</li>,
                strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                em: ({ children }) => <em className="italic text-white">{children}</em>,
              }}
            >
              {editedContent}
            </ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}