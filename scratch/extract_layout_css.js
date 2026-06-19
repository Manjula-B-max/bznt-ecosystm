import fs from 'fs';

const html = fs.readFileSync('client/admin.html', 'utf8');
const lines = html.split('\n');

// Find where <body> starts
const bodyStart = lines.findIndex(line => line.includes('<body'));
console.log('<body> start line:', bodyStart + 1);

for (let i = bodyStart; i < bodyStart + 100; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
}
