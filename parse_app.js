import fs from 'fs';
const code = fs.readFileSync('d:/bezent/marketflow/client/app.js', 'utf8');

// Match class methods simply
const extract = () => {
  const methodNames = new Set();
  const lines = code.split('\n');
  for (let line of lines) {
    let m = line.match(/^[ \t]*([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{/);
    if (m && m[1] !== 'catch' && m[1] !== 'if' && m[1] !== 'for' && m[1] !== 'while' && m[1] !== 'switch' && m[1] !== 'function') {
      methodNames.add(m[1]);
    }
  }
  console.log(Array.from(methodNames).join('\n'));
};
extract();
