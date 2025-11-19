import React from 'react';
import { Megaphone, Package, FileText, Share2, Mail, Newspaper } from 'lucide-react';
import { cn } from "@/lib/utils";

const contentTypes = [
  { id: 'marketing', label: 'Marketing Copy', icon: Megaphone, desc: 'Ads, landing pages' },
  { id: 'product', label: 'Product Description', icon: Package, desc: 'E-commerce content' },
  { id: 'blog', label: 'Blog Post', icon: FileText, desc: 'Articles, guides' },
  { id: 'social', label: 'Social Media', icon: Share2, desc: 'Posts, captions' },
  { id: 'email', label: 'Email Campaign', icon: Mail, desc: 'Newsletters, promos' },
  { id: 'press', label: 'Press Release', icon: Newspaper, desc: 'Media announcements' }
];

export default function ContentTypeSelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {contentTypes.map((type) => {
        const Icon = type.icon;
        return (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={cn(
              "glass-dark p-3 rounded-lg transition-all text-left hover:bg-blue-500/20",
              selected === type.id && "bg-blue-500/30 border-blue-500/50 border"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm font-medium">{type.label}</span>
            </div>
            <p className="text-white/60 text-xs">{type.desc}</p>
          </button>
        );
      })}
    </div>
  );
}