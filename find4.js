import fs from 'fs';
const code = fs.readFileSync('client/app.js', 'utf8');
const lines = code.split('\n');
const results = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('leadContactPersonMultiple') || lines[i].includes('clientContactPersonMultiple') || lines[i].includes('leadAddress') || lines[i].includes('clientAddress')) {
     results.push((i+1) + ': ' + lines[i].trim());
  }
}
fs.writeFileSync('found4.txt', results.join('\n'));
