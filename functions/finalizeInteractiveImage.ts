import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

async function computeSHA256(data) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hashFileFromUrl(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageId } = await req.json();
    
    if (!imageId) {
      return Response.json({ error: 'No imageId provided' }, { status: 400 });
    }

    const images = await base44.entities.InteractiveImage.filter({ id: imageId });
    if (images.length === 0) {
      return Response.json({ error: 'Image not found' }, { status: 404 });
    }
    const image = images[0];

    const hotspots = await base44.entities.ImageHotspot.filter({ imageId });

    const imageFileHash = await hashFileFromUrl(image.fileUrl);

    const canonicalData = {
      imageId: image.id,
      imageFileHash,
      hotspots: hotspots.map(h => ({
        x: h.x,
        y: h.y,
        width: h.width,
        height: h.height,
        label: h.label,
        description: h.description,
        actionType: h.actionType,
        actionValue: h.actionValue
      }))
    };

    const canonicalJSON = JSON.stringify(canonicalData, null, 0);
    const hash = await computeSHA256(canonicalJSON);

    const hashLog = await base44.entities.ImageHashLog.create({
      imageId,
      hash,
      imageFileHash,
      hotspotsSnapshot: JSON.stringify(canonicalData.hotspots),
      ownerEmail: user.email
    });

    await base44.asServiceRole.entities.InteractiveImage.update(imageId, {
      status: 'finalized'
    });

    return Response.json({
      success: true,
      logId: hashLog.id,
      hash,
      imageFileHash,
      createdAt: hashLog.created_date
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});