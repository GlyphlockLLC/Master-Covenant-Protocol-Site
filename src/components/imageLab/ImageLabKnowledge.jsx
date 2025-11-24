/**
 * GlyphLock Image Lab Knowledge Base
 * Comprehensive documentation for AI assistants and users
 */

export const IMAGE_LAB_KNOWLEDGE = {
  overview: {
    name: 'GlyphLock Image Lab',
    description: 'Unified platform for AI image generation, interactive hotspot editing, and cryptographic verification',
    capabilities: [
      'AI-powered image generation with 8+ style presets',
      'Batch generation (up to 4 images)',
      'Interactive hotspot editor with 5 action types',
      'Cryptographic hash locking and verification',
      'Gallery management with search and filters',
    ],
    workflow: 'Generate → Interactive → Finalize → Share',
  },

  generateTab: {
    purpose: 'AI image generation with advanced controls',
    features: {
      promptEngineering: {
        description: 'Large textarea for detailed prompts',
        tips: [
          'Be specific and detailed in descriptions',
          'Use style modifiers for better results',
          'Mention lighting, composition, mood',
        ],
      },
      stylePresets: [
        { id: 'photorealistic', use: 'Realistic photos, portraits, landscapes' },
        { id: 'cyberpunk', use: 'Futuristic, neon, sci-fi scenes' },
        { id: 'watercolor', use: 'Soft, artistic, painterly looks' },
        { id: 'oil-painting', use: 'Classic art, portraits' },
        { id: 'anime', use: 'Manga, animated characters' },
        { id: 'minimalist', use: 'Clean, simple, modern designs' },
        { id: 'surreal', use: 'Abstract, dreamlike, unusual' },
        { id: 'neon', use: 'Glowing, vibrant, electric' },
      ],
      batchGeneration: {
        description: 'Generate 1-4 images simultaneously',
        use: 'Explore variations of same prompt',
      },
      referenceUpload: {
        description: 'Upload reference images for style guidance',
        formats: 'PNG, JPG, JPEG',
      },
      qualityModes: ['Standard', 'HD', 'Ultra'],
    },
    output: {
      storage: 'Saved to InteractiveImage entity',
      metadata: 'Prompt, style, settings, generation timestamp',
    },
  },

  interactiveTab: {
    purpose: 'Add interactive hotspots to images',
    workflow: [
      'Select image from Generate tab or Gallery',
      'Choose Rectangle tool',
      'Draw hotspot on canvas',
      'Configure hotspot properties',
      'Save hotspots',
      'Finalize to lock cryptographically',
    ],
    tools: {
      select: 'Click to select and edit existing hotspots',
      rectangle: 'Draw rectangular hotspots on image',
    },
    hotspotProperties: {
      label: 'Display name for hotspot',
      description: 'Detailed notes (internal)',
      actionType: {
        openUrl: 'Navigate to URL when triggered',
        playAudio: 'Play audio file',
        showModal: 'Display popup content',
        invokeAgent: 'Call AI agent',
        verifyAccess: 'Check user permissions',
      },
      actionValue: 'URL, file path, or configuration',
    },
    finalization: {
      purpose: 'Lock image with cryptographic hash',
      process: [
        'Compute SHA-256 of image file',
        'Compute SHA-256 of hotspots JSON',
        'Combine hashes for immutableHash',
        'Set status to "active"',
        'Lock from further edits',
      ],
      security: 'Any tampering detected on reload',
    },
  },

  galleryTab: {
    purpose: 'Manage all image assets',
    features: {
      search: 'Filter by name or prompt',
      filters: {
        status: ['All', 'Draft', 'Active', 'Revoked'],
        source: ['All', 'Generated', 'Uploaded'],
      },
      actions: {
        edit: 'Open in Interactive tab',
        download: 'Save image locally',
        delete: 'Permanently remove',
      },
    },
    display: {
      desktop: '3-column grid',
      mobile: 'Single column, full-width cards',
    },
  },

  security: {
    authentication: 'Base44 RLS - owner-only access',
    encryption: 'SHA-256 cryptographic hashing',
    integrity: 'Immutable hash prevents tampering',
    verification: 'Backend function validates hashes',
  },

  integration: {
    qrStudio: {
      use: 'Generate QR-safe art covers',
      workflow: 'Create image → Use as QR art layer',
    },
    steganography: {
      use: 'Embed hidden data in generated images',
      workflow: 'Generate → Stego encode → Interactive',
    },
  },

  bestPractices: {
    generation: [
      'Use descriptive prompts with 20+ words',
      'Experiment with style presets',
      'Generate multiple variations',
      'Save high-quality outputs',
    ],
    interactive: [
      'Keep hotspot labels clear',
      'Test action URLs before finalizing',
      'Use percentage coords for responsiveness',
      'Finalize only when complete',
    ],
    security: [
      'Always finalize production images',
      'Verify hash after loading',
      'Never edit finalized images',
      'Use draft status for work-in-progress',
    ],
  },

  technicalSpecs: {
    imageFormats: ['PNG', 'JPG', 'JPEG'],
    maxBatch: 4,
    hotspotShapes: ['rectangle'],
    coordSystem: 'Percentage-based (0-100)',
    hashAlgorithm: 'SHA-256',
    storage: 'InteractiveImage entity',
    api: 'Base44 SDK + Core.GenerateImage',
  },

  troubleshooting: {
    generationFails: [
      'Check internet connection',
      'Verify prompt is not empty',
      'Try simpler prompt',
      'Reduce batch count',
    ],
    hotspotsNotSaving: [
      'Ensure image is not finalized',
      'Check user authentication',
      'Verify at least one hotspot exists',
    ],
    finalizationFails: [
      'Save hotspots first',
      'Check network connection',
      'Verify backend function is deployed',
    ],
  },

  faqs: [
    {
      q: 'What is the difference between Generate and Interactive tabs?',
      a: 'Generate creates AI images. Interactive adds clickable hotspots and locks them cryptographically.',
    },
    {
      q: 'Can I edit a finalized image?',
      a: 'No. Finalization locks the image and hotspots. You must create a new draft to make changes.',
    },
    {
      q: 'What happens if someone tampers with my image?',
      a: 'The hash verification will fail, and a tamper warning badge will appear.',
    },
    {
      q: 'How many hotspots can I add?',
      a: 'Unlimited, but for UX, keep it under 10 per image.',
    },
    {
      q: 'Can I use this for QR code covers?',
      a: 'Yes! Generate high-contrast images and use them in QR Studio art layer.',
    },
  ],
};

export default IMAGE_LAB_KNOWLEDGE;