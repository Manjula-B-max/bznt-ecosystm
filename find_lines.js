import fs from 'fs';
const code = fs.readFileSync('d:/bezent/marketflow/client/app.js', 'utf8');

const regex = /^[ \t]*([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{/gm;
let m;
const methodsToFind = ['setupActionDispatcher', '_handleAction'];
const results = {};
let lastMatch = null;
const lines = code.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let m = line.match(/^[ \t]*([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{/);
  if (m) {
     if (lastMatch && methodsToFind.includes(lastMatch.name)) {
        results[lastMatch.name].end = i;
     }
     lastMatch = { name: m[1], start: i + 1 };
     if (methodsToFind.includes(m[1])) {
        results[m[1]] = { start: i + 1 };
     }
  }
}
if (lastMatch && methodsToFind.includes(lastMatch.name)) {
  results[lastMatch.name].end = lines.length;
}

console.log(JSON.stringify(results, null, 2));
