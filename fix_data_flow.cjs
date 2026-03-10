const fs = require('fs');

// ─── Fix server/db.js: add rfps table ──────────────────────────────────────
let db = fs.readFileSync('server/db.js', 'utf8');
if (!db.includes('CREATE TABLE IF NOT EXISTS rfps')) {
    db = db.replace(
        "CREATE TABLE IF NOT EXISTS kv_store (",
        `CREATE TABLE IF NOT EXISTS rfps (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_name TEXT,
  project_name TEXT,
  rfp_date TEXT,
  data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kv_store (`
    );
    fs.writeFileSync('server/db.js', db, 'utf8');
    console.log('DB: rfps table added.');
} else {
    console.log('DB: rfps table already exists.');
}

// ─── Fix server/routes.js: add /api/rfps route ─────────────────────────────
let routes = fs.readFileSync('server/routes.js', 'utf8');
if (!routes.includes("'/rfps'")) {
    routes = routes.replace(
        "router.use('/workflow_rules', crudRoutes('workflow_rules'));",
        "router.use('/workflow_rules', crudRoutes('workflow_rules'));\nrouter.use('/rfps', crudRoutes('rfps'));"
    );
    fs.writeFileSync('server/routes.js', routes, 'utf8');
    console.log('Routes: /api/rfps added.');
} else {
    console.log('Routes: /api/rfps already exists.');
}

// ─── Fix client/app.js: _syncToApi + loadAllFromApi ────────────────────────
let app = fs.readFileSync('client/app.js', 'utf8');

// Add bezent_rfps to _syncToApi COL map
if (!app.includes("'bezent_rfps': 'rfps'")) {
    app = app.replace(
        "'bezent_workflow_rules': 'workflow_rules',",
        "'bezent_workflow_rules': 'workflow_rules',\n                'bezent_rfps': 'rfps',"
    );
    console.log('App: bezent_rfps added to _syncToApi COL map.');
} else {
    console.log('App: bezent_rfps already in _syncToApi.');
}

// Add bezent_rfps to loadAllFromApi COLS
if (!app.includes("['bezent_rfps', 'rfps']")) {
    app = app.replace(
        "['bezent_workflow_rules', 'workflow_rules'],",
        "['bezent_workflow_rules', 'workflow_rules'],\n            ['bezent_rfps', 'rfps'],"
    );
    console.log('App: bezent_rfps added to loadAllFromApi.');
} else {
    console.log('App: bezent_rfps already in loadAllFromApi.');
}

// Verify bezent_quotations is in _syncToApi
if (app.includes("'bezent_quotations': 'quotations'")) {
    console.log('App: bezent_quotations already in _syncToApi COL map. OK.');
} else {
    // Add it
    app = app.replace(
        "'bezent_followups': 'followups', 'bezent_quotations': 'quotations',",
        "'bezent_followups': 'followups', 'bezent_quotations': 'quotations',"
    );
    // Check if it's just missing the mapping
    if (!app.includes("'bezent_quotations'")) {
        app = app.replace(
            "'bezent_workflow_rules': 'workflow_rules',",
            "'bezent_quotations': 'quotations',\n                'bezent_workflow_rules': 'workflow_rules',"
        );
        console.log('App: bezent_quotations added to _syncToApi COL map.');
    }
}

// Fix rfp save to store flat fields for server sync
const rfpSaveTarget = "r.id = rno;\n                r.date = r.client?.dateOfRequest || new Date().toISOString().split('T')[0];\n                r.clientName = r.client?.companyName || 'Unknown Client';\n                r.projectName = r.client?.projectName || '';";
const rfpSaveReplace = "r.id = rno;\n                r.date = r.client?.dateOfRequest || new Date().toISOString().split('T')[0];\n                r.clientName = r.client?.companyName || 'Unknown Client';\n                r.projectName = r.client?.projectName || '';\n                // Server-ready flat fields\n                r.client_name = r.clientName;\n                r.project_name = r.projectName;\n                r.rfp_date = r.date;\n                r.data = JSON.stringify(r);";
if (app.includes(rfpSaveTarget)) {
    app = app.replace(rfpSaveTarget, rfpSaveReplace);
    console.log('App: RFP save enriched with server-ready flat fields.');
}

fs.writeFileSync('client/app.js', app, 'utf8');
console.log('\nAll fixes applied.');
