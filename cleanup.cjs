const fs = require('fs');
let src = fs.readFileSync('./client/app.js', 'utf8');

function rep(old, neo, label) {
    if (src.includes(old)) { src = src.replace(old, neo); console.log('✅', label); return; }
    const lf = old.replace(/\r\n/g, '\n');
    if (src.includes(lf)) { src = src.replace(lf, neo.replace(/\r\n/g, '\n')); console.log('✅', label, '(LF)'); return; }
    console.log('⚠️  NOT FOUND:', label);
}

// Fix the tableRows in getReportsFunnel()
rep(
    `        const tableRows = [\r\n            { source: 'IndiaMart', leads: 180, qualified: 110, proposals: 62, deals: 36, projects: 28, convRate: '20.0%' },\r\n            { source: 'Website', leads: 95, qualified: 70, proposals: 44, deals: 28, projects: 22, convRate: '29.5%' },\r\n            { source: 'Referral', leads: 75, qualified: 58, proposals: 34, deals: 18, projects: 13, convRate: '24.0%' },\r\n            { source: 'Cold Call', leads: 60, qualified: 25, proposals: 10, deals: 4, projects: 2, convRate: '6.7%' },\r\n            { source: 'LinkedIn', leads: 40, qualified: 17, proposals: 6, deals: 3, projects: 2, convRate: '7.5%' }\r\n        ];`,
    `        // Build source breakdown from real leads
        const _funnelLeads = this.getStoredLeads ? this.getStoredLeads() : [];
        const _srcMap = new Map();
        _funnelLeads.forEach(l => {
            const src2 = String(l.source||'Other').trim() || 'Other';
            if (!_srcMap.has(src2)) _srcMap.set(src2, { leads:0, qualified:0, proposals:0, deals:0, projects:0 });
            const r = _srcMap.get(src2);
            r.leads++;
            const st = String(l.stage||'').toLowerCase();
            if (!['new lead','missed call'].includes(st)) r.qualified++;
            if (['quotation','negotiation','closed','po received'].includes(st)) r.proposals++;
            if (['closed','po received'].includes(st)) r.deals++;
        });
        const tableRows = [..._srcMap.entries()].map(([source, d]) => ({
            source,
            leads: d.leads, qualified: d.qualified, proposals: d.proposals,
            deals: d.deals, projects: d.projects,
            convRate: d.leads > 0 ? (d.deals/d.leads*100).toFixed(1)+'%' : '0%'
        }));`,
    'funnel tableRows hardcoded'
);

fs.writeFileSync('./client/app.js', src);
console.log('Done.');
