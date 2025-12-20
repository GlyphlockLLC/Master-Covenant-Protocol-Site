import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        // Public utility, no auth required for DNS check as it's public info
        // But we might want to restrict it to logged in users to prevent abuse
        
        const url = new URL(req.url);
        // Allow passing domain via query param or body, default to glyphlock.io
        let domain = "glyphlock.io";
        
        try {
            const body = await req.json();
            if (body.domain) domain = body.domain;
        } catch (e) {
            // ignore
        }

        // Use Google Public DNS API over HTTPS
        const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
        const data = await response.json();

        const aRecords = data.Answer ? data.Answer.map(r => r.data) : [];
        
        // Also check CNAME for www
        // Check CNAME for root (@) - unusual but possible (e.g. CNAME flattening)
        const cnameResponse = await fetch(`https://dns.google/resolve?name=${domain}&type=CNAME`);
        const cnameData = await cnameResponse.json();
        const cnameRecords = cnameData.Answer ? cnameData.Answer.map(r => r.data) : [];

        // Check CNAME for www
        const wwwResponse = await fetch(`https://dns.google/resolve?name=www.${domain}&type=CNAME`);
        const wwwData = await wwwResponse.json();
        const wwwRecords = wwwData.Answer ? wwwData.Answer.map(r => r.data) : [];

        // Attempt to find correct Target from current Origin
        let suggestedTarget = null;
        let suggestedType = "A";

        const origin = req.headers.get("origin");
        if (origin && origin.includes("base44.app")) {
            // For base44.app domains (Render hosted), we prefer CNAME to base44.onrender.com
            suggestedTarget = "base44.onrender.com";
            suggestedType = "CNAME";
        }

        return Response.json({
            domain,
            a_records: aRecords,
            cname_records: cnameRecords,
            www_records: wwwRecords,
            suggested_target: suggestedTarget,
            suggested_type: suggestedType,
            status: "success",
            timestamp: new Date().toISOString(),
            provider: "Google DNS"
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});