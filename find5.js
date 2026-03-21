import fs from 'fs';
const lines = fs.readFileSync('client/app.js', 'utf8').split('\\n');
const results = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const locUrlEl = document.getElementById(\\'clientLocationUrl\\');') || 
      lines[i].includes('city: \\'—\\',') || 
      lines[i].includes('const addressEl = document.getElementById(\\'leadAddress\\');') ||
      lines[i].includes('stage: \\'New Lead\\', feedbackStatus: \\'Pending\\',')) {
     results.push((i+1) + ': ' + lines[i].trim());
  }
}
fs.writeFileSync('found5.txt', results.join('\\n'));
