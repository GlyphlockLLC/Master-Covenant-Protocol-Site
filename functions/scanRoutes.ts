import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

const SITE_URL = "https://glyphlock.io";

const httpProbe = async (path) => {
    const url = path.startsWith('http') ? path : `${SITE_URL}${path}`;
    try {
        const res = await fetch(url, { redirect: 'manual' });
        return { status_code: res.status };
    } catch (e) {
        return { status_code: 0 };
    }
};

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { scan_id } = await req.json();

        // 1. Scan pages/ directory
        const counts = { ok: 0, warning: 0, critical: 0 };
        
        let files = [];
        try {
            for await (const entry of Deno.readDir("pages")) {
                if (entry.isFile && (entry.name.endsWith(".js") || entry.name.endsWith(".jsx"))) {
                    files.push(entry.name);
                }
            }
        } catch(e) {
             return Response.json({ error: "Could not read pages directory" }, { status: 500 });
        }

        for (const file of files) {
            const name = file.replace(/\.jsx?$/, "");
            const path = name === "Home" ? "/" : "/" + name;
            
            // Basic auth check logic could go here by reading file content for "withAuth" etc.
            // For now we just probe.
            
            const probe = await httpProbe(path);
            
            let severity = "ok";
            let violations = [];
            let messages = [];
            let action = "none";

            // Check for 500s
            if (probe.status_code >= 500) {
                severity = "critical";
                violations.push("ROUTE_ERROR");
                messages.push("Page returns 500");
                action = "fix_route";
            }

            if (severity === "ok") counts.ok++;
            else if (severity === "warning") counts.warning++;
            else counts.critical++;

            await base44.entities.RouteAuditRow.create({
                scan_run_id: scan_id,
                route_path: path,
                component_name: file,
                is_public: true, // Default assumption
                http_status: probe.status_code,
                has_auth_guard: false, // Need deeper analysis to know
                violation_ids: JSON.stringify(violations),
                violation_messages: JSON.stringify(messages),
                severity,
                required_action: action
            });
        }

        return Response.json(counts);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});