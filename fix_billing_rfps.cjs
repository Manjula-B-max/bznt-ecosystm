const fs = require('fs');
let c = fs.readFileSync('client/app.js', 'utf8');

// Use regex to handle both CRLF and LF
let changed = 0;

// 1. Add RFPs to billing nav tab list
const navRx = /(\{ id: 'overdue_risk', label: 'Overdue Risk Dashboard' \})\s*\n(\s*\],)/;
if (navRx.test(c)) {
    c = c.replace(navRx, "$1,\n                { id: 'rfps', label: 'RFPs' }\n$2");
    changed++;
    console.log('Nav tab added.');
} else {
    console.log('Nav tab NOT found - trying CRLF...');
    const navRx2 = /(\{ id: 'overdue_risk', label: 'Overdue Risk Dashboard' \})\r?\n(\s*\],)/;
    if (navRx2.test(c)) {
        c = c.replace(navRx2, "$1,\r\n                { id: 'rfps', label: 'RFPs' }\r\n$2");
        changed++;
        console.log('Nav tab added (CRLF).');
    } else {
        console.log('Nav tab STILL not found.');
    }
}

// 2. Add case 'rfps' in renderBillingContent
const caseRx = /(case 'overdue_risk':\s*\r?\n\s*container\.innerHTML = this\.getBillingOverdueRisk\(\);\s*\r?\n\s*break;\s*\r?\n)(\s*default:)/;
if (caseRx.test(c)) {
    c = c.replace(caseRx, "$1            case 'rfps':\r\n                container.innerHTML = this.getBillingRfps();\r\n                break;\r\n$2");
    changed++;
    console.log('Case statement added.');
} else {
    console.log('Case statement NOT found.');
}

// 3. Fix q.no -> q.number || q.no in getBillingQuotations
// The table row shows q.no || q.id - fix it to also try q.number
const qnoRx = /esc\(q\.no \|\| q\.id \|\| '—'\)/;
if (qnoRx.test(c)) {
    c = c.replace(qnoRx, "esc(q.number || q.no || q.id || '—')");
    changed++;
    console.log('q.number fix applied.');
} else {
    console.log('q.no pattern not found - may already be fixed or different.');
}

// 4. Fix q.client -> q.client || q.buyer?.name
const qclientRx = /esc\(q\.client\)\}<\/td>\s*\n\s*<td class="px-4 py-3 text-right font-semibold text-slate-900">\$\{esc\(q\.amount\)\}/;
if (qclientRx.test(c)) {
    c = c.replace(qclientRx, (m) => m.replace('esc(q.client)', "esc(q.client || q.buyer?.name || '—')").replace('esc(q.amount)', "esc(q.amount || q.totals?.grandTotal || '—')"));
    changed++;
    console.log('q.client / q.amount fix applied.');
} else {
    // Try simpler approach  
    c = c.replace(/\$\{esc\(q\.no \|\| q\.id \|\| '—'\)\}/g, "${esc(q.number || q.no || q.id || '—')}");
    console.log('Simpler q.number fix applied.');
}

fs.writeFileSync('client/app.js', c, 'utf8');
console.log('Total changes:', changed, '- saved.');
