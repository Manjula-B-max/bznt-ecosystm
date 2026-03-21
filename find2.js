import fs from 'fs';
const code = fs.readFileSync('client/app.js', 'utf8');
const lines = code.split('\n');
const results = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('getLeadRegistration') || lines[i].includes('getLeadsRegistration') || lines[i].includes('getLeadDirectory') || lines[i].includes('getLeadsDirectory') || lines[i].includes('setupClientDirectoryInteractions')) {
     results.push((i+1) + ': ' + lines[i].trim());
  }
}
fs.writeFileSync('found2.txt', results.join('\n'));
