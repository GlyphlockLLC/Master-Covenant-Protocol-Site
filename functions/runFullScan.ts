import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Create ScanRun
        const scanRun = await base44.entities.ScanRun.create({
            scan_id: crypto.randomUUID(),
            started_at: new Date().toISOString(),
            status: "running"
        });
        
        const scan_id = scanRun.scan_id;

        // Run Core Scans
        const [navRes, routeRes, sitemapRes, backendRes] = await Promise.all([
            base44.functions.invoke("scanNavigation", { scan_id }),
            base44.functions.invoke("scanRoutes", { scan_id }),
            base44.functions.invoke("scanSitemaps", { scan_id }),
            base44.functions.invoke("scanBackends", { scan_id })
        ]);

        // Aggregate counts
        const nav = navRes.data || { ok: 0, warning: 0, critical: 0 };
        const route = routeRes.data || { ok: 0, warning: 0, critical: 0 };
        const sitemap = sitemapRes.data || { ok: 0, warning: 0, critical: 0 };
        const backend = backendRes.data || { ok: 0, warning: 0, critical: 0 };

        // Extensions (Placeholder calls - would be similar)
        // const perf = await base44.functions.invoke("scanPerformance", { scan_id });
        
        // Update ScanRun
        const totalCritical = nav.critical + route.critical + sitemap.critical + backend.critical;
        const totalWarning = nav.warning + route.warning + sitemap.warning + backend.warning;
        
        let finalStatus = "success";
        if (totalWarning > 0) finalStatus = "warning";
        if (totalCritical > 0) finalStatus = "critical";

        await base44.entities.ScanRun.update(scanRun.id, {
            completed_at: new Date().toISOString(),
            status: finalStatus,
            nav_ok_count: nav.ok,
            nav_warning_count: nav.warning,
            nav_critical_count: nav.critical,
            route_ok_count: route.ok,
            route_warning_count: route.warning,
            route_critical_count: route.critical,
            sitemap_ok_count: sitemap.ok,
            sitemap_warning_count: sitemap.warning,
            sitemap_critical_count: sitemap.critical,
            backend_ok_count: backend.ok,
            backend_warning_count: backend.warning,
            backend_critical_count: backend.critical
        });

        return Response.json({ scan_id, status: finalStatus });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});