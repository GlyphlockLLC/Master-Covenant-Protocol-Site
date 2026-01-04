import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key'
};

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: CORS_HEADERS });
    }

    try {
        const base44 = createClientFromRequest(req);
        
        // 1. Verify API Key
        const apiKey = req.headers.get('x-api-key');
        if (!apiKey) {
            return Response.json({ error: 'Missing x-api-key header' }, { status: 401, headers: CORS_HEADERS });
        }

        const keys = await base44.asServiceRole.entities.APIKey.filter({ public_key: apiKey, status: 'active' });
        if (keys.length === 0) {
            return Response.json({ error: 'Invalid API Key' }, { status: 403, headers: CORS_HEADERS });
        }
        const keyRecord = keys[0];

        // 2. Parse Body
        const { payload, type, design, name } = await req.json();

        // 3. Create QR Asset
        const newCodeId = `api_qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const asset = await base44.asServiceRole.entities.QrAsset.create({
            code_id: newCodeId,
            name: name || `API Generated QR ${newCodeId}`,
            payload: payload || 'https://glyphlock.io',
            type: type || 'url',
            created_by_api_key: keyRecord.id,
            status: 'active',
            design_config: design || {}
        });

        // 4. Update Key Usage
        await base44.asServiceRole.entities.APIKey.update(keyRecord.id, {
            last_used: new Date().toISOString()
        });

        return Response.json({
            success: true,
            data: {
                id: asset.id,
                code_id: asset.code_id,
                url: `https://glyphlock.io/r/${asset.code_id}`,
                payload: asset.payload
            }
        }, { headers: CORS_HEADERS });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500, headers: CORS_HEADERS });
    }
});