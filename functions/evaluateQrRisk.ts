import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        // We allow anonymous checks for public QRs, but rate limiting should apply
        const { payload, qrType } = await req.json();

        // 1. Static Analysis
        const urlFeatures = performStaticAnalysis(payload);

        // 2. AI Threat Detection (Context-Aware)
        const prompt = `
        Analyze this QR code payload for security risks.
        Payload: "${payload}"
        Type: "${qrType}"

        Tasks:
        1. If it's a URL, check for phishing indicators, typosquatting, and reputation.
        2. If it's text/other, check for malicious command injection, social engineering, or scams.
        3. Assign a risk score (0-100, where 100 is safe, 0 is dangerous).
        4. List specific threat types (e.g., "Phishing", "Malware", "Scam").
        
        Return JSON:
        {
            "riskScore": number,
            "riskLevel": "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
            "threatTypes": string[],
            "analysisDetails": string,
            "recommendation": string
        }
        `;

        const aiResponse = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
            add_context_from_internet: true, // Crucial for URL reputation
            response_json_schema: {
                type: "object",
                properties: {
                    riskScore: { type: "number" },
                    riskLevel: { type: "string" },
                    threatTypes: { type: "array", items: { type: "string" } },
                    analysisDetails: { type: "string" },
                    recommendation: { type: "string" }
                }
            }
        });

        // Combine scores (Static + AI)
        // Heuristic: If static analysis fails hard, cap the score.
        let finalScore = aiResponse.riskScore;
        if (urlFeatures.isSuspicious) {
            finalScore = Math.min(finalScore, 40);
        }

        return Response.json({
            ...aiResponse,
            riskScore: finalScore,
            staticAnalysis: urlFeatures
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});

function performStaticAnalysis(payload) {
    const issues = [];
    let isSuspicious = false;

    // Basic URL checks
    if (payload.startsWith('http://')) {
        issues.push("Insecure HTTP protocol");
        // isSuspicious = true; // Not strictly suspicious but bad practice
    }
    
    // IP Address check
    if (/^(http|https):\/\/[\d\.]+(\/|$)/.test(payload)) {
        issues.push("Direct IP address usage");
        isSuspicious = true;
    }

    // Length check (buffer overflow attempts?)
    if (payload.length > 2000) {
        issues.push("Unusually long payload");
        isSuspicious = true;
    }

    return { issues, isSuspicious };
}