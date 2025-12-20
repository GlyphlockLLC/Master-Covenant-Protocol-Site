import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

const SITE_URL = "https://glyphlock.io"; // Canonical

const httpProbe = async (path) => {
    const url = path.startsWith('http') ? path : `${SITE_URL}${path}`;
    const start = Date.now();
    try {
        const res = await fetch(url, { redirect: 'manual' }); // Don't follow redirects to detect chains
        return {
            status_code: res.status,
            response_time: Date.now() - start,
            accessible: res.status >= 200 && res.status < 400
        };
    } catch (e) {
        return {
            status_code: 0,
            response_time: Date.now() - start,
            accessible: false,
            error: e.message
        };
    }
};

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { scan_id } = await req.json();

        // 1. Read Navigation Config
        // We'll attempt to read the file. If complex, we might need a better way, but for now we regex.
        let navContent = "";
        try {
            navContent = await Deno.readTextFile("components/NavigationConfig.js");
        } catch (e) {
            return Response.json({ error: "Could not read NavigationConfig.js" }, { status: 500 });
        }

        // Regex to find "path" or "page" or "href"
        // This is a heuristic. Ideally we'd have a structured data source.
        const matches = [...navContent.matchAll(/(?:page|href|path):\s*["']([^"']+)["']/g)];
        const navItems = matches.map(m => m[1]);
        
        // Also look for label
        // We will simplify and just find unique paths
        const uniquePaths = [...new Set(navItems)];

        let counts = { ok: 0, warning: 0, critical: 0 };

        for (const path of uniquePaths) {
            // Determine visibility (heuristic)
            let visibility = "public";
            if (path.toLowerCase().includes("admin") || path.toLowerCase().includes("dashboard")) visibility = "admin";
            
            // Fix path
            let realPath = path;
            if (!path.startsWith('/') && !path.startsWith('http')) {
                // If it's a page name like "Home", convert to /
                if (path === "Home") realPath = "/";
                else realPath = "/" + path;
            }

            const probe = await httpProbe(realPath);
            
            // Rules
            const violations = [];
            const messages = [];
            let severity = "ok";
            let action = "none";

            // NAV_001
            if (visibility === "public" && probe.status_code === 404) {
                violations.push("NAV_001");
                messages.push(`Public nav item ${realPath} returns 404`);
                severity = "critical";
                action = "fix_route";
            }

            // NAV_004
            if (realPath.includes("/editor/preview") || realPath.includes("/apps/")) {
                violations.push("NAV_004");
                messages.push("Preview URL detected");
                severity = "critical";
                action = "fix_route";
            }

            // NAV_010
            if (probe.status_code >= 500) {
                violations.push("NAV_010");
                messages.push("Server Error");
                severity = "critical";
                action = "fix_route";
            }

            if (severity === "ok") counts.ok++;
            else if (severity === "warning") counts.warning++;
            else counts.critical++;

            await base44.entities.NavAuditRow.create({
                scan_run_id: scan_id,
                label: path,
                path: realPath,
                visibility,
                http_status: probe.status_code,
                page_exists: probe.status_code !== 404, // Approximation
                backend_exists: true, // Placeholder
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