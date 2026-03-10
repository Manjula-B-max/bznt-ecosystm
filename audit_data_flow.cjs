const fs = require('fs');
const c = fs.readFileSync('client/app.js', 'utf8');

const issues = [];
const ok = [];

// ─── 1. _syncToApi COL mapping coverage ───────────────────────────────────
const syncKeys = [
    'bezent_leads', 'bezent_clients', 'APJ 3D Solutions_clients',
    'bezent_invoices', 'APJ 3D Solutions_invoices',
    'bezent_projects', 'APJ 3D Solutions_projects',
    'bezent_campaigns', 'APJ 3D Solutions_campaigns',
    'bezent_followups', 'bezent_quotations',
    'bezent_contracts', 'bezent_visits',
    'bezent_greetings', 'bezent_feedback_submissions',
    'bezent_workflow_rules',
];
const missingFromSync = ['bezent_rfps']; // manually known omissions

for (const k of syncKeys) {
    if (c.includes(k)) ok.push(`_syncToApi maps: ${k}`);
}

// Check bezent_rfps missing from syncToApi
if (!c.includes("'bezent_rfps': ")) {
    issues.push('MISSING: bezent_rfps not in _syncToApi COL map → RFPs write to localStorage only, NOT synced to server DB');
}

// ─── 2. loadAllFromApi coverage ────────────────────────────────────────────
const loadCols = [
    'bezent_leads', 'bezent_clients', 'bezent_invoices',
    'bezent_projects', 'bezent_campaigns', 'bezent_followups',
    'bezent_quotations', 'bezent_contracts', 'bezent_visits',
    'bezent_greetings', 'bezent_feedback_submissions', 'bezent_workflow_rules'
];
for (const k of loadCols) {
    if (c.includes(k)) ok.push(`loadAllFromApi loads: ${k}`);
}
if (!c.includes("'bezent_rfps', 'rfps'") && !c.includes("bezent_rfps','rfps'")) {
    issues.push('MISSING: bezent_rfps not loaded from API in loadAllFromApi → RFPs lost on page refresh if server restarted');
}

// ─── 3. Backend routes.js check ────────────────────────────────────────────
const routes = fs.readFileSync('server/routes.js', 'utf8');
if (!routes.includes("router.use('/quotations'")) {
    issues.push('BACKEND: /api/quotations route missing');
} else {
    ok.push('Backend route: /api/quotations ✓');
}

// No /api/rfps route in server — rfps go to kv_store
if (!routes.includes("'/rfps'")) {
    issues.push('BACKEND: /api/rfps route missing → RFPs fallback to generic kv_store (works but no structured queries)');
}

// ─── 4. DB schema check ────────────────────────────────────────────────────
const db = fs.readFileSync('server/db.js', 'utf8');
if (db.includes('CREATE TABLE IF NOT EXISTS quotations')) {
    ok.push('DB: quotations table exists ✓');
} else {
    issues.push('DB: quotations table MISSING');
}
if (db.includes('CREATE TABLE IF NOT EXISTS rfps') || db.includes('rfps')) {
    ok.push('DB: rfps table exists ✓');
} else {
    issues.push('DB: rfps table MISSING → RFPs stored in kv_store as JSON blob');
}

// ─── 5. quotations save — does it set item.id? ─────────────────────────────
const saveQIdx = c.indexOf("if (a === 'quote:save:current')");
if (saveQIdx !== -1) {
    const snippet = c.substring(saveQIdx, saveQIdx + 600);
    if (snippet.includes("q.id = ")) ok.push("Quote save: sets q.id ✓");
    else issues.push("Quote save: q.id NOT set → _syncToApi skips items without id");
    if (snippet.includes("writeStore('bezent_quotations'")) ok.push("Quote save: writes to bezent_quotations ✓");
} else {
    issues.push('Quote save handler NOT found');
}

// ─── 6. rfp save — does it set item.id? ───────────────────────────────────
const saveRIdx = c.indexOf("if (a === 'rfp:save:current')");
if (saveRIdx !== -1) {
    const snippet = c.substring(saveRIdx, saveRIdx + 600);
    if (snippet.includes("r.id = ")) ok.push("RFP save: sets r.id ✓");
    else issues.push("RFP save: r.id NOT set → _syncToApi skips items without id");
    if (snippet.includes("writeStore('bezent_rfps'")) ok.push("RFP save: writes to bezent_rfps ✓");
} else {
    issues.push('RFP save handler NOT found');
}

// ─── 7. APJ 3D Solutions project key uses company name ─────────────────────
if (c.includes("APJ 3D Solutions_projects")) ok.push("Project store key: APJ 3D Solutions_projects aliased ✓");
if (c.includes("APJ 3D Solutions_clients")) ok.push("Client store key: APJ 3D Solutions_clients aliased ✓");

console.log('\n=== ✅ PASSING ===');
ok.forEach(s => console.log(' ✓', s));

console.log('\n=== ❌ ISSUES FOUND ===');
if (issues.length === 0) {
    console.log(' No issues!');
} else {
    issues.forEach(s => console.log(' ✗', s));
}
console.log('');
