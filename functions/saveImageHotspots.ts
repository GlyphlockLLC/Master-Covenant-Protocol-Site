import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageId, hotspots } = await req.json();
    
    if (!imageId || !Array.isArray(hotspots)) {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }

    const existingHotspots = await base44.entities.ImageHotspot.filter({ imageId });
    
    for (const existing of existingHotspots) {
      await base44.asServiceRole.entities.ImageHotspot.delete(existing.id);
    }

    const savedHotspots = [];
    for (const hotspot of hotspots) {
      const saved = await base44.entities.ImageHotspot.create({
        imageId,
        x: hotspot.x,
        y: hotspot.y,
        width: hotspot.width,
        height: hotspot.height,
        label: hotspot.label,
        description: hotspot.description || '',
        actionType: hotspot.actionType || 'none',
        actionValue: hotspot.actionValue || ''
      });
      savedHotspots.push(saved);
    }

    return Response.json({ 
      success: true, 
      hotspots: savedHotspots,
      count: savedHotspots.length
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});