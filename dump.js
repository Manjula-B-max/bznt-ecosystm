import fs from 'fs';
const code = fs.readFileSync('client/app.js', 'utf8');
const lines = code.split('\n');
fs.writeFileSync('head.utf8.txt', lines.slice(0, 150).join('\n'), 'utf8');
