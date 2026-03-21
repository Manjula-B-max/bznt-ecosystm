import fs from 'fs';
const code = fs.readFileSync('d:/bezent/marketflow/client/app.js', 'utf8');

const regex = /^[ \t]*([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{/gm;
let m;
const methods = new Set();
while ((m = regex.exec(code)) !== null) {
    if (m[1].toLowerCase().includes('lead') || m[1].toLowerCase().includes('client') || m[1].startsWith('render')) {
        methods.add(m[1]);
    }
}
fs.writeFileSync('d:/bezent/marketflow/methods8.txt', Array.from(methods).join('\n'), 'utf8');
