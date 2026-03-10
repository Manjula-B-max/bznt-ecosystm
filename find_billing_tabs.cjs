const fs = require('fs');
const lines = fs.readFileSync('client/app.js', 'utf8').split('\n');
lines.forEach((l, i) => {
    if (l.includes("'quotations'") || l.includes("'contracts'") || l.includes("'followup_log'") || l.includes("'rfp'")) {
        console.log(i + 1, l.trim().slice(0, 130));
    }
});
