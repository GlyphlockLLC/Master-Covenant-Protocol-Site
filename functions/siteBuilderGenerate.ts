import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Site Builder Generate - Creates boilerplate code for artifacts
 */

const TEMPLATES = {
  // Page template
  page: (name, description) => `import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ${name}() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // TODO: Load your data here
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">${name}</h1>
      {/* ${description || 'Add your content here'} */}
      <Card className="bg-white/5 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-white">Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Your content goes here</p>
        </CardContent>
      </Card>
    </div>
  );
}
`,

  // Component template
  component: (name, description) => `import React from 'react';
import { cn } from '@/lib/utils';

/**
 * ${name} Component
 * ${description || 'Add description here'}
 */
export default function ${name}({ className, children, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children || <p>Component content</p>}
    </div>
  );
}
`,

  // Entity template
  entity: (name, description) => JSON.stringify({
    name: name,
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Title field'
      },
      description: {
        type: 'string',
        description: description || 'Description field'
      },
      status: {
        type: 'string',
        enum: ['draft', 'active', 'archived'],
        default: 'draft'
      },
      metadata: {
        type: 'object',
        description: 'Additional metadata'
      }
    },
    required: ['title']
  }, null, 2),

  // Function template
  function: (name, description) => `import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * ${name}
 * ${description || 'Backend function'}
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    // TODO: Implement your logic here
    const result = {
      success: true,
      message: '${name} executed successfully',
      data: body
    };

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
`,

  // Agent template
  agent: (name, description) => JSON.stringify({
    description: description || `${name} AI Agent`,
    instructions: `You are ${name}. Help users with their tasks.`,
    tool_configs: [],
    whatsapp_greeting: `Hello! I'm ${name}. How can I help you today?`
  }, null, 2)
};

// Full boilerplate templates
const BOILERPLATE_GENERATORS = {
  'landing-page': () => ({
    artifacts: [
      {
        id: `landing-${Date.now()}`,
        name: 'Landing.jsx',
        path: 'pages/Landing.jsx',
        type: 'page',
        content: `import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import CTA from '@/components/landing/CTA';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950/20 to-black">
      <Hero />
      <Features />
      <CTA />
    </div>
  );
}`,
        status: 'generated'
      },
      {
        id: `hero-${Date.now()}`,
        name: 'Hero.jsx',
        path: 'components/landing/Hero.jsx',
        type: 'component',
        content: `import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Your App</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Build amazing experiences with our powerful platform.
        </p>
        <div className="flex gap-4 justify-center">
          <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-6 text-lg">
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="outline" className="border-white/20 text-white px-8 py-6 text-lg">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}`,
        status: 'generated'
      },
      {
        id: `features-${Date.now()}`,
        name: 'Features.jsx',
        path: 'components/landing/Features.jsx',
        type: 'component',
        content: `import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Shield, Globe } from 'lucide-react';

const FEATURES = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for speed and performance' },
  { icon: Shield, title: 'Secure', desc: 'Enterprise-grade security built-in' },
  { icon: Globe, title: 'Global Scale', desc: 'Deploy worldwide with ease' }
];

export default function Features() {
  return (
    <section className="py-20 px-4 bg-white/5">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <Card key={i} className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <f.icon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}`,
        status: 'generated'
      },
      {
        id: `cta-${Date.now()}`,
        name: 'CTA.jsx',
        path: 'components/landing/CTA.jsx',
        type: 'component',
        content: `import React from 'react';
import { Button } from '@/components/ui/button';

export default function CTA() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl p-12 border border-cyan-500/30">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-8">Join thousands of users building amazing products.</p>
          <Button className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg font-bold">
            Start Free Trial
          </Button>
        </div>
      </div>
    </section>
  );
}`,
        status: 'generated'
      }
    ]
  }),

  'dashboard': () => ({
    artifacts: [
      {
        id: `dash-${Date.now()}`,
        name: 'Dashboard.jsx',
        path: 'pages/Dashboard.jsx',
        type: 'page',
        content: `import React from 'react';
import StatCards from '@/components/dashboard/StatCards';
import Charts from '@/components/dashboard/Charts';
import RecentActivity from '@/components/dashboard/RecentActivity';

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
      <StatCards />
      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <Charts />
        <RecentActivity />
      </div>
    </div>
  );
}`,
        status: 'generated'
      },
      {
        id: `stats-${Date.now()}`,
        name: 'StatCards.jsx',
        path: 'components/dashboard/StatCards.jsx',
        type: 'component',
        content: `import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react';

const STATS = [
  { icon: Users, label: 'Total Users', value: '12,345', change: '+12%' },
  { icon: DollarSign, label: 'Revenue', value: '$54,321', change: '+8%' },
  { icon: Activity, label: 'Active Now', value: '1,234', change: '+3%' },
  { icon: TrendingUp, label: 'Growth', value: '23%', change: '+5%' }
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((s, i) => (
        <Card key={i} className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <s.icon className="w-8 h-8 text-cyan-400 mb-3" />
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-gray-400 text-sm">{s.label}</p>
            <p className="text-green-400 text-xs mt-1">{s.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}`,
        status: 'generated'
      }
    ]
  }),

  'crud-module': () => ({
    artifacts: [
      {
        id: `entity-${Date.now()}`,
        name: 'Item.json',
        path: 'entities/Item.json',
        type: 'entity',
        content: JSON.stringify({
          name: 'Item',
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Item title' },
            description: { type: 'string', description: 'Item description' },
            status: { type: 'string', enum: ['draft', 'active', 'archived'], default: 'draft' },
            price: { type: 'number', description: 'Price in cents' },
            metadata: { type: 'object' }
          },
          required: ['title']
        }, null, 2),
        status: 'generated'
      },
      {
        id: `items-page-${Date.now()}`,
        name: 'Items.jsx',
        path: 'pages/Items.jsx',
        type: 'page',
        content: `import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import ItemList from '@/components/items/ItemList';
import ItemForm from '@/components/items/ItemForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function Items() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    const data = await base44.entities.Item.list();
    setItems(data);
  };

  const handleSave = async (item) => {
    if (editItem) {
      await base44.entities.Item.update(editItem.id, item);
    } else {
      await base44.entities.Item.create(item);
    }
    loadItems();
    setShowForm(false);
    setEditItem(null);
    toast.success('Item saved');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Items</h1>
        <Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-2" />Add Item</Button>
      </div>
      {showForm && <ItemForm item={editItem} onSave={handleSave} onCancel={() => { setShowForm(false); setEditItem(null); }} />}
      <ItemList items={items} onEdit={(item) => { setEditItem(item); setShowForm(true); }} onRefresh={loadItems} />
    </div>
  );
}`,
        status: 'generated'
      }
    ]
  })
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can generate
    if (user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { type, templateId, artifactType, name, description, files } = body;

    // Generate from boilerplate template
    if (templateId && BOILERPLATE_GENERATORS[templateId]) {
      const result = BOILERPLATE_GENERATORS[templateId]();
      return Response.json(result);
    }

    // Generate blank artifact
    if (type === 'blank' && artifactType && name) {
      const template = TEMPLATES[artifactType];
      if (!template) {
        return Response.json({ error: 'Unknown artifact type' }, { status: 400 });
      }

      const cleanName = name.replace(/[^a-zA-Z0-9]/g, '');
      const folder = artifactType === 'page' ? 'pages' : artifactType === 'entity' ? 'entities' : artifactType === 'function' ? 'functions' : artifactType === 'agent' ? 'agents' : 'components';
      const ext = artifactType === 'entity' || artifactType === 'agent' ? 'json' : artifactType === 'function' ? 'js' : 'jsx';

      const artifact = {
        id: `${artifactType}-${Date.now()}`,
        name: `${cleanName}.${ext}`,
        path: `${folder}/${cleanName}.${ext}`,
        type: artifactType,
        content: template(cleanName, description),
        status: 'generated'
      };

      return Response.json({ artifact });
    }

    return Response.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});