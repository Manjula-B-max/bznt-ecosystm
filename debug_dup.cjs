const fs = require('fs');
let content = fs.readFileSync('client/app.js', 'utf8');

// Find and remove the duplicate/leftover openQuotationPrintWindow block
// The issue: after our replacement, there's:
// 1. A new clean openQuotationPrintWindow (line 8606)
// 2. A DUPLICATE broken openQuotationPrintWindow header at line 8607
// 3. Leftover old style CSS from old code (lines 8665-8728)

// We need to:
// 1. Remove the duplicate function signature at line 8607
// 2. Remove the old CSS/HTML remnants from lines 8665-8728

// Strategy: find the region between the closing } of the new function (which ends with w.document.close();\n    }\n)
// and the start of getProjectRegistration

const newFuncPattern = /w\.document\.write\(fullDoc\);\r?\n\s*w\.document\.close\(\);\r?\n\s*\}\r?\n([\s\S]*?)getProjectRegistration\(\)/;
const match = content.match(newFuncPattern);
if (match) {
    const between = match[1];
    console.log('Content between end of new Quotation function and getProjectRegistration:');
    console.log(JSON.stringify(between).substring(0, 500));
} else {
    console.log('Pattern not found');
}
