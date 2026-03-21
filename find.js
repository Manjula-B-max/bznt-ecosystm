import fs from 'fs';
const code = fs.readFileSync('client/app.js', 'utf8');
const lines = code.split('\n');
const results = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('saveLead') || lines[i].includes('saveClient') || lines[i].includes('Contact Persons')) {
     results.push((i+1) + ': ' + lines[i].trim());
  }
}
fs.writeFileSync('found.txt', results.join('\n'));
