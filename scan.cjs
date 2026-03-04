const fs = require('fs');
let src = fs.readFileSync('./client/app.js', 'utf8');

function findLine(text) {
    const idx = src.indexOf(text);
    if (idx === -1) return -1;
    return src.slice(0, idx).split('\n').length;
}

// Full inventory of hardcoded strings to find
const searches = [
    'Sarah Kumar', 'getPlaceholderScreen', 'Expected Payments',
    'Priya ', 'Rajesh', 'Client A', 'Client B', 'Client C', 'Client D',
    'Route A', 'Route B', 'Stop 1', '6,40,000', '6.4L', '₹6',
    'kpiTargets', 'ltvData', 'healthAlerts', 'weeklyChartData',
    'revenueData', 'funnelData', 'salesFunnel',
    'notification_1', 'notif_1', '"n1"', "'n1'",
    'paymentList', 'overdueList', 'collectionList',
];
searches.forEach(s => {
    const ln = findLine(s);
    if (ln > 0) console.log(`L${ln}: "${s}"`);
});

// Also find ALL inline array literals that contain { client: or { name: with hard-coded values
const lines = src.split('\n');
const suspicious = [];
lines.forEach((line, i) => {
    if (/client:\s*['"][A-Z]/.test(line) && !/readStore|writeStore|apiCache|localStorage/.test(line)) {
        suspicious.push(`L${i + 1}: ${line.trim().slice(0, 100)}`);
    }
    if (/overdue:\s*\d+/.test(line) || /pending:\s*\d+/.test(line) || /collected:\s*[₹\d]/.test(line)) {
        suspicious.push(`L${i + 1}: ${line.trim().slice(0, 100)}`);
    }
});
if (suspicious.length) {
    console.log('\n--- Hardcoded client data ---');
    suspicious.slice(0, 30).forEach(l => console.log(l));
}
