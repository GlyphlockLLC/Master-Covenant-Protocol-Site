import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Site Builder Extract ZIP - Extracts and analyzes ZIP file contents
 * Note: Full ZIP extraction requires external service or manual processing
 * This provides a simulation for the UI flow
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { fileUrl, fileName } = body;

    if (!fileUrl) {
      return Response.json({ error: 'No file URL provided' }, { status: 400 });
    }

    // Fetch the ZIP file
    const response = await fetch(fileUrl);
    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch ZIP file' }, { status: 400 });
    }

    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Simple ZIP parsing - extract file entries from central directory
    // ZIP files have a central directory at the end
    const files = [];
    
    // Look for local file headers (signature: 0x04034b50)
    let offset = 0;
    while (offset < bytes.length - 30) {
      // Check for local file header signature
      if (bytes[offset] === 0x50 && bytes[offset + 1] === 0x4b && 
          bytes[offset + 2] === 0x03 && bytes[offset + 3] === 0x04) {
        
        // Read file name length (offset 26-27)
        const fileNameLength = bytes[offset + 26] | (bytes[offset + 27] << 8);
        // Read extra field length (offset 28-29)
        const extraLength = bytes[offset + 28] | (bytes[offset + 29] << 8);
        // Read compressed size (offset 18-21)
        const compressedSize = bytes[offset + 18] | (bytes[offset + 19] << 8) | 
                               (bytes[offset + 20] << 16) | (bytes[offset + 21] << 24);
        
        // Read filename
        const fileNameBytes = bytes.slice(offset + 30, offset + 30 + fileNameLength);
        const name = new TextDecoder().decode(fileNameBytes);
        
        // Skip directories
        if (!name.endsWith('/')) {
          // Try to read content for text files
          let content = '';
          const dataOffset = offset + 30 + fileNameLength + extraLength;
          
          // Only try to extract uncompressed files (compression method 0)
          const compressionMethod = bytes[offset + 8] | (bytes[offset + 9] << 8);
          if (compressionMethod === 0 && compressedSize < 100000) {
            // Store method - uncompressed
            const contentBytes = bytes.slice(dataOffset, dataOffset + compressedSize);
            try {
              content = new TextDecoder().decode(contentBytes);
            } catch {
              content = '// Binary or compressed content';
            }
          } else {
            content = '// Compressed content - cannot preview';
          }
          
          files.push({
            name: name.split('/').pop(),
            path: name,
            size: compressedSize,
            content: content.substring(0, 10000) // Limit content size
          });
        }
        
        offset = dataOffset + compressedSize;
      } else {
        offset++;
      }
      
      // Safety limit
      if (files.length >= 100) break;
    }

    if (files.length === 0) {
      // If no files found, it might be a compressed ZIP - provide guidance
      return Response.json({
        files: [],
        message: 'ZIP file may use compression. Please extract locally and upload individual files.',
        fileName
      });
    }

    return Response.json({
      files,
      totalFiles: files.length,
      fileName
    });

  } catch (error) {
    console.error('ZIP extraction error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});