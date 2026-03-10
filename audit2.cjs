const fs = require('fs');
const c = fs.readFileSync('client/app.js', 'utf8');
const routes = fs.readFileSync('server/routes.js', 'utf8');
const db = fs.readFileSync('server/db.js', 'utf8');

const issues = [];
const ok = [];

// 1. _syncToApi must map bezent_rfps
if (!c.includes("'bezent_rfps'")) {
    issues.push('MISSING: bezent_rfps not in _syncToApi COL map');
} else {
    ok.push('_syncToApi maps bezent_rfps');
}

// 2. loadAllFromApi must have rfps
if (!c.includes("bezent_rfps")) {
    issues.push('MISSING: bezent_rfps not in loadAllFromApi');
} else {
    ok.push('bezent_rfps referenced in frontend');
}
// Check loadAllFromApi specifically
const loadIdx = c.indexOf('loadAllFromApi');
const loadSnippet = c.substring(loadIdx, loadIdx + 1000);
if (!loadSnippet.includes('rfps')) {
    issues.push('MISSING: bezent_rfps not loaded from API on startup (loadAllFromApi)');
} else {
    ok.push('loadAllFromApi loads rfps');
}

// 3. Backend route for rfps
if (!routes.includes("'/rfps'") && !routes.includes('rfps')) {
    issues.push('BACKEND: /api/rfps route missing');
} else {
    ok.push('Backend has rfps reference');
}

// 4. DB schema for rfps
if (!db.includes('rfps')) {
    issues.push('DB: rfps table MISSING from schema (uses kv_store JSON fallback)');
} else {
    ok.push('DB: rfps table exists');
}

// 5. quotations table
if (db.includes('CREATE TABLE IF NOT EXISTS quotations')) {
    ok.push('DB: quotations table exists');
} else {
    issues.push('DB: quotations table MISSING');
}

// 6. quotations backend route
if (routes.includes("'/quotations'")) {
    ok.push('Backend: /api/quotations route exists');
} else {
    issues.push('BACKEND: /api/quotations route missing');
}

// 7. quote save handler sets id
const qSaveIdx = c.indexOf("'quote:save:current'");
const qSnip = c.substring(qSaveIdx, qSaveIdx + 700);
if (qSnip.includes('q.id =')) ok.push('Quote save: id is set before writeStore');
else issues.push('Quote save: id NOT set - _syncToApi will skip this record');

if (qSnip.includes("writeStore('bezent_quotations'")) ok.push('Quote save: writes to bezent_quotations');
else issues.push('Quote save: does not write to bezent_quotations');

// 8. rfp save handler sets id
const rSaveIdx = c.indexOf("'rfp:save:current'");
const rSnip = c.substring(rSaveIdx, rSaveIdx + 700);
if (rSnip.includes('r.id =')) ok.push('RFP save: id is set');
else issues.push('RFP save: id NOT set');

if (rSnip.includes("writeStore('bezent_rfps'")) ok.push('RFP save: writes to bezent_rfps');
else issues.push('RFP save: does not write to bezent_rfps');

// 9. _syncToApi mapping
const syncIdx = c.indexOf('_syncToApi');
const syncSnip = c.substring(syncIdx, syncIdx + 800);
if (syncSnip.includes("'bezent_quotations': 'quotations'")) ok.push('_syncToApi: quotations properly mapped to /api/quotations');
else issues.push('_syncToApi: bezent_quotations NOT mapped to quotations endpoint');

if (syncSnip.includes("'bezent_rfps'")) ok.push('_syncToApi: bezent_rfps mapped');
else issues.push('_syncToApi: bezent_rfps NOT in COL map - falls through to kv_store (works but not structured)');

console.log('\n=== PASSING ===');
ok.forEach(s => console.log('  OK:', s));
console.log('\n=== ISSUES ===');
if (!issues.length) console.log('  None!');
issues.forEach(s => console.log('  FAIL:', s));
