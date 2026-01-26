import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileUrl, fileName, fileType, fileSize } = await req.json();

    if (!fileUrl) {
      return Response.json({ error: 'File URL required' }, { status: 400 });
    }

    // Download file to sandbox /tmp
    const response = await fetch(fileUrl);
    const fileBuffer = await response.arrayBuffer();
    const filePath = `/tmp/${Date.now()}_${fileName}`;
    await Deno.writeFile(filePath, new Uint8Array(fileBuffer));

    // Compute SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Analyze with AI
    const analysisResult = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze this file for security threats. File: ${fileName}, Type: ${fileType}, Size: ${fileSize} bytes, Hash: ${hash}. 
      
Perform deep analysis:
1. Detect malware signatures or suspicious patterns
2. Check for data exfiltration attempts
3. Identify potentially malicious code
4. Extract embedded payloads
5. Check for obfuscation or packing
6. Assess overall risk level

Return structured JSON analysis.`,
      add_context_from_internet: true,
      file_urls: [fileUrl],
      response_json_schema: {
        type: 'object',
        properties: {
          riskLevel: { 
            type: 'string',
            enum: ['safe', 'low', 'medium', 'high', 'critical']
          },
          securityScore: { type: 'number' },
          threats: { 
            type: 'array',
            items: { type: 'string' }
          },
          malwareSignatures: {
            type: 'array',
            items: { type: 'string' }
          },
          extractedData: { type: 'string' },
          fileType: { type: 'string' },
          recommendations: {
            type: 'array',
            items: { type: 'string' }
          },
          isSandboxSafe: { type: 'boolean' },
          analysisTimestamp: { type: 'string' }
        }
      }
    });

    // Cleanup temp file
    try {
      await Deno.remove(filePath);
    } catch (e) {
      console.error('Cleanup failed:', e);
    }

    // Log analysis to audit trail
    await base44.asServiceRole.entities.SystemAuditLog.create({
      event_type: 'FILE_ANALYSIS',
      description: `File analyzed: ${fileName}`,
      actor_email: user.email,
      resource_id: hash,
      metadata: {
        fileName,
        fileType,
        fileSize,
        riskLevel: analysisResult.riskLevel,
        securityScore: analysisResult.securityScore
      },
      status: analysisResult.riskLevel === 'critical' || analysisResult.riskLevel === 'high' ? 'alert' : 'success',
      severity: analysisResult.riskLevel === 'critical' ? 'critical' : 
                analysisResult.riskLevel === 'high' ? 'high' : 'medium'
    });

    return Response.json({
      success: true,
      ...analysisResult,
      hash,
      fileName,
      fileSize
    });

  } catch (error) {
    console.error('File analysis error:', error);
    return Response.json({ 
      error: error.message,
      success: false
    }, { status: 500 });
  }
});