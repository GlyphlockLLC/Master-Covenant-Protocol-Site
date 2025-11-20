import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const name = formData.get('name') || 'Untitled Image';
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const uploadResult = await base44.asServiceRole.integrations.Core.UploadFile({ file });
    
    const image = await base44.entities.InteractiveImage.create({
      name,
      fileUrl: uploadResult.file_url,
      width: 0,
      height: 0,
      status: 'draft',
      ownerEmail: user.email
    });

    return Response.json({ 
      success: true, 
      imageId: image.id,
      fileUrl: uploadResult.file_url
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});