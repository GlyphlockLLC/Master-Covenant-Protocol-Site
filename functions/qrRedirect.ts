import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Dynamic QR Code Redirect Handler
 * Handles redirection based on dynamic rules (Time, Device, etc.)
 */
Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // 1. Extract code ID from request
        const url = new URL(req.url);
        const codeId = url.searchParams.get("id"); // e.g. ?id=qr_123456

        if (!codeId) {
            return Response.json({ error: "Missing code ID" }, { status: 400 });
        }

        // 2. Fetch QR Asset (using service role to bypass RLS if it's public access)
        // Note: For a redirect, we typically want public access, but we should respect 'status'
        const assets = await base44.asServiceRole.entities.QrAsset.filter({ code_id: codeId });
        
        if (!assets || assets.length === 0) {
            return Response.json({ error: "QR Code not found" }, { status: 404 });
        }

        const asset = assets[0];

        if (asset.status !== 'active') {
             return new Response("This QR Code is inactive.", { status: 403 });
        }

        // 3. Process Dynamic Rules
        let targetUrl = asset.payload; // Default to static payload

        if (asset.type === 'url_dynamic' && asset.dynamic_config) {
            targetUrl = asset.dynamic_config.defaultUrl || asset.payload;
            const rules = asset.dynamic_config.rules || [];

            for (const rule of rules) {
                // Rule: Time Window
                if (rule.condition === 'time') {
                    // Value format: "HH:MM-HH:MM" (24h)
                    const [start, end] = rule.value.split('-');
                    const now = new Date();
                    const currentMinutes = now.getHours() * 60 + now.getMinutes();
                    
                    const [startH, startM] = start.split(':').map(Number);
                    const [endH, endM] = end.split(':').map(Number);
                    const startMinutes = startH * 60 + startM;
                    const endMinutes = endH * 60 + endM;

                    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
                        targetUrl = rule.targetUrl;
                        break; // First match wins
                    }
                }
                
                // Rule: Device Type (User Agent)
                if (rule.condition === 'device') {
                    const ua = req.headers.get("user-agent") || "";
                    if (rule.value === 'ios' && /iphone|ipad|ipod/i.test(ua)) {
                        targetUrl = rule.targetUrl;
                        break;
                    }
                    if (rule.value === 'android' && /android/i.test(ua)) {
                        targetUrl = rule.targetUrl;
                        break;
                    }
                }

                // Add more rules here (Location via IP, Scan Count, etc.)
            }
        }

        // 4. Log the scan (Async if possible, but here we just await)
        // We can use QrScanEvent entity if it exists, or just log to console
        try {
             // await base44.entities.QrScanEvent.create(...)
        } catch (e) {
            console.error("Failed to log scan", e);
        }

        // 5. Redirect
        return Response.redirect(targetUrl, 302);

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});