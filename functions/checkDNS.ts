import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        let domain = "glyphlock.io";
        try {
            const body = await req.json();
            if (body.domain) domain = body.domain;
        } catch (e) {
            // ignore
        }

        // 1. DNS Resolution (Google DNS)
        const fetchDns = async (name, type) => {
            try {
                const res = await fetch(`https://dns.google/resolve?name=${name}&type=${type}`);
                return await res.json();
            } catch (e) {
                return { Answer: [] };
            }
        };

        const [aData, cnameData, wwwData] = await Promise.all([
            fetchDns(domain, 'A'),
            fetchDns(domain, 'CNAME'),
            fetchDns(`www.${domain}`, 'CNAME')
        ]);

        const aRecords = aData.Answer ? aData.Answer.map(r => r.data) : [];
        const cnameRecords = cnameData.Answer ? cnameData.Answer.map(r => r.data) : [];
        const wwwRecords = wwwData.Answer ? wwwData.Answer.map(r => r.data) : [];

        // 2. Routing / HTTP Status Check
        let routing = {
            root: { status: null, https: false, error: null },
            www: { status: null, https: false, error: null }
        };

        const checkHttp = async (url) => {
            try {
                // Short timeout to not hang
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 4000);
                
                const res = await fetch(url, { 
                    redirect: 'manual', 
                    signal: controller.signal,
                    headers: { 'User-Agent': 'GlyphLock-Monitor/1.0' }
                });
                clearTimeout(timeoutId);
                return { status: res.status, https: true, error: null };
            } catch (e) {
                return { status: null, https: false, error: e.message };
            }
        };

        const [rootRouting, wwwRouting] = await Promise.all([
            checkHttp(`https://${domain}`),
            checkHttp(`https://www.${domain}`)
        ]);
        
        routing.root = rootRouting;
        routing.www = wwwRouting;

        // 3. Propagation Analysis
        const expectedIP = "216.24.57.1";
        const rootPropagated = aRecords.includes(expectedIP);
        
        // For WWW, check if it points to something that looks like render or base44
        const wwwPropagated = wwwRecords.some(r => 
            r.includes("base44.onrender.com") || 
            r.includes("render") || 
            r.includes("glyphlock.io") // In case of loop/weird cname, still technically propagated DNS-wise
        );

        // 4. Legacy/Fix Suggestions
        let suggestedTarget = null;
        let suggestedType = "A";
        const origin = req.headers.get("origin");
        if (origin && origin.includes("base44.app")) {
            suggestedTarget = "base44.onrender.com";
            suggestedType = "CNAME";
        }

        return Response.json({
            domain,
            // Keep flat structure for backward compat where possible, but add structured data
            a_records: aRecords,
            cname_records: cnameRecords,
            www_records: wwwRecords,
            routing,
            propagation: {
                root: rootPropagated,
                www: wwwPropagated
            },
            suggested_target: suggestedTarget,
            suggested_type: suggestedType,
            status: "success",
            timestamp: new Date().toISOString(),
            provider: "Google DNS + Live Probe"
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});