import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { payloadType, intent, userPreferences } = await req.json();

        const prompt = `
        Act as a professional graphic designer specializing in functional QR codes.
        Suggest a design configuration for a QR code based on the following:
        
        Payload Type: ${payloadType}
        User Intent/Brand: ${intent || "Modern and clean"}
        Preferences: ${JSON.stringify(userPreferences || {})}

        The output must be a JSON object matching this schema:
        {
            "dotStyle": "square" | "dots" | "rounded" | "extra-rounded" | "classy" | "classy-rounded",
            "eyeStyle": "square" | "circle" | "rounded",
            "foregroundColor": "hex string",
            "backgroundColor": "hex string",
            "gradient": {
                "enabled": boolean,
                "type": "linear" | "radial",
                "color1": "hex string",
                "color2": "hex string",
                "rotation": number
            },
            "explanation": "Short reasoning for this design"
        }
        `;

        const design = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
            response_json_schema: {
                type: "object",
                properties: {
                    dotStyle: { type: "string" },
                    eyeStyle: { type: "string" },
                    foregroundColor: { type: "string" },
                    backgroundColor: { type: "string" },
                    gradient: {
                        type: "object",
                        properties: {
                            enabled: { type: "boolean" },
                            type: { type: "string" },
                            color1: { type: "string" },
                            color2: { type: "string" },
                            rotation: { type: "number" }
                        }
                    },
                    explanation: { type: "string" }
                }
            }
        });

        return Response.json(design);

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});