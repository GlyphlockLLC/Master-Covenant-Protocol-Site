import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

export default async function sieOps(req) {
    const base44 = createClientFromRequest(req);
    const adminBase44 = base44.asServiceRole;

    try {
        const user = await base44.auth.me();
        if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { action, payload } = body;

        // MIDDLEWARE LAYER: Orchestrates data access bypassing strict RLS for auth'd users
        
        if (action === "get_dashboard") {
            // Fetch history and config in parallel
            const [historyRes, configRes] = await Promise.all([
                adminBase44.entities.ScanRun.list({ sort: { started_at: -1 }, limit: 20 }),
                adminBase44.entities.ScanConfig.list({ limit: 1 })
            ]);

            let config = configRes.data?.[0] || {
                schedule_type: "manual",
                trigger_on_deploy: false,
                trigger_on_sitemap: false,
                webhook_secret: crypto.randomUUID(),
                is_active: true
            };

            return Response.json({
                history: historyRes.data || [],
                config: config
            });
        }

        if (action === "get_scan_details") {
            const { scan_id } = payload;
            if (!scan_id) return Response.json({ error: "Missing scan_id" }, { status: 400 });

            // Fetch all audit rows for this scan
            const [nav, routes, sitemaps, backend] = await Promise.all([
                adminBase44.entities.NavAuditRow.list({ filter: { scan_run_id: scan_id } }),
                adminBase44.entities.RouteAuditRow.list({ filter: { scan_run_id: scan_id } }),
                adminBase44.entities.SitemapAuditRow.list({ filter: { scan_run_id: scan_id } }),
                adminBase44.entities.BackendAuditRow.list({ filter: { scan_run_id: scan_id } })
            ]);

            return Response.json({
                nav: nav.data || [],
                routes: routes.data || [],
                sitemaps: sitemaps.data || [],
                backend: backend.data || []
            });
        }

        if (action === "save_config") {
            const { config } = payload;
            let result;
            if (config.id) {
                result = await adminBase44.entities.ScanConfig.update(config.id, config);
            } else {
                result = await adminBase44.entities.ScanConfig.create(config);
            }
            return Response.json(result);
        }

        return Response.json({ error: "Invalid action" }, { status: 400 });

    } catch (e) {
        console.error("SIE Ops Error:", e);
        return Response.json({ error: e.message }, { status: 500 });
    }
}

Deno.serve(sieOps);