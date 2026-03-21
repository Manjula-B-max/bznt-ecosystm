import fs from 'fs';
const code = fs.readFileSync('client/app.js', 'utf8');
const lines = code.split('\n');
const results = [];
let capture = false;
let count = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('getLeadDirectory() {') || lines[i].includes('getLeadsDirectory() {')) {
     capture = true;
     count = 0;
  }
  if (capture && count < 80) {
     results.push((i+1) + ': ' + lines[i].replace(/\r/g,''));
     count++;
     if (count >= 80) capture = false;
  }
}
fs.writeFileSync('found3.txt', results.join('\n'));
