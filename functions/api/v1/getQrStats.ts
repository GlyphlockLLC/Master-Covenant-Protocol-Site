import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

        // 2. Get QR Code ID from params
        const url = new URL(req.url);
        const codeId = url.searchParams.get('code_id');

        if (!codeId) {
            return Response.json({ error: 'Missing code_id parameter' }, { status: 400, headers: CORS_HEADERS });
        }

        // 3. Fetch Data
        const assets = await base44.asServiceRole.entities.QrAsset.filter({ code_id: codeId });
        if (assets.length === 0) {
            return Response.json({ error: 'QR Code not found' }, { status: 404, headers: CORS_HEADERS });
        }
        const asset = assets[0];

        // 4. Fetch Stats
        const scans = await base44.asServiceRole.entities.QrScanEvent.filter({ qrAssetId: asset.id });
        
        // Aggregate
        const stats = {
            total_scans: scans.length,
            unique_devices: new Set(scans.map(s => s.deviceHint)).size,
            top_locations: {}, // Simplified aggregation
            last_scan: scans.length > 0 ? scans[0].scannedAt : null
        };

        return Response.json({
            success: true,
            data: {
                ...asset,
                stats
            }
        }, { headers: CORS_HEADERS });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500, headers: CORS_HEADERS });
    }
});