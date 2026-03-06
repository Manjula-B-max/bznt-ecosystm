const fs = require('fs');
const content = fs.readFileSync('client/app.js', 'utf8');

let out = '';
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.includes('-- >')) {
        out += `Broken comment at line ${i + 1}: ${line.trim()}\n`;
    }
    if (line.match(/<\s*!doctype/i)) {
        out += `Broken doctype at line ${i + 1}: ${line.trim()}\n`;
    }
    if (line.match(/[a-z]+\s+-\s+[a-z]+:/i)) {
        out += `Broken CSS prop at line ${i + 1}: ${line.trim()}\n`;
    }
    if (line.includes('\\${')) {
        out += `Escaped template literal at line ${i + 1}: ${line.trim()}\n`;
    }
    // Also let's check what's up with Trigger Breakdown card.
    // If lines[9904] has an actual problem, let's print it.
    if (i === 9903) { // 0-indexed
        out += `DEBUG line 9904: ${line.trim()}\n`;
    }
});
fs.writeFileSync('validation_results.txt', out);
