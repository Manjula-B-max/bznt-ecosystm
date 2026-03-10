const fs = require('fs');
const c = fs.readFileSync('client/app.js', 'utf8');
const routes = fs.readFileSync('server/routes.js', 'utf8');
const db = fs.readFileSync('server/db.js', 'utf8');

const issues = [];
const ok = [];

// 1. loadAllFromApi snippet
const loadIdx = c.indexOf('loadAllFromApi');
const loadSnippet = c.substring(loadIdx, loadIdx + 1000);
if (loadSnippet.includes('rfps')) ok.push('loadAllFromApi loads rfps');
else issues.push('loadAllFromApi does NOT load rfps from server on startup');

// 2. DB schema for rfps table
if (db.includes("CREATE TABLE IF NOT EXISTS rfps")) ok.push('DB: rfps table exists');
else issues.push('DB: rfps table MISSING from schema');

// 3. DB schema for quotations table
if (db.includes("CREATE TABLE IF NOT EXISTS quotations")) ok.push('DB: quotations table exists');
else issues.push('DB: quotations table MISSING');

// 4. Backend quotations route
if (routes.includes("'/quotations'")) ok.push("Backend: /api/quotations route exists");
else issues.push("BACKEND: /api/quotations route missing");

// 5. Backend rfps route
if (routes.includes("'/rfps'")) ok.push("Backend: /api/rfps route exists");
else issues.push("BACKEND: /api/rfps route MISSING");

// 6. _syncToApi COL mapping
const syncStart = c.indexOf("const COL = {");
const syncEnd = c.indexOf("};", syncStart) + 2;
const syncBlock = c.substring(syncStart, syncEnd);
if (syncBlock.includes("bezent_quotations")) ok.push("_syncToApi: bezent_quotations -> quotations");
else issues.push("_syncToApi: bezent_quotations NOT in COL map");
if (syncBlock.includes("bezent_rfps")) ok.push("_syncToApi: bezent_rfps mapped");
else issues.push("_syncToApi: bezent_rfps NOT in COL map (falls to kv_store)");

// 7. quote save id
const qi = c.indexOf("'quote:save:current'");
const qs = c.substring(qi, qi + 800);
if (qs.includes('q.id =')) ok.push('Quote save: sets id');
else issues.push('Quote save: id NOT set - server sync will skip it');

// 8. rfp save id  
const ri = c.indexOf("'rfp:save:current'");
const rs = c.substring(ri, ri + 800);
if (rs.includes('r.id =')) ok.push('RFP save: sets id');
else issues.push('RFP save: id NOT set');

// Print results
console.log("=== PASSING ===");
ok.forEach(x => console.log("  OK:", x));
console.log("=== ISSUES ===");
if (!issues.length) console.log("  None!");
issues.forEach(x => console.log("  FAIL:", x));
