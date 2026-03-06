const fs = require('fs');

const filePath = 'client/app.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix broken comments
content = content.replace(/-- >/g, '-->');

// 2. Fix broken doctypes
content = content.replace(/<\s*!doctype\s+html\s*>/gi, '<!DOCTYPE html>');

// 3. Fix broken CSS properties (word - word)
// This targets words separated by space-hyphen-space inside patterns looking like CSS
// We can use a regex that looks for (word) - (word) and removes the spaces, if it's before a colon
content = content.replace(/([a-z]+)\s+-\s+([a-z]+)(?=:)/g, '$1-$2');

// 4. Fix -webkit- properties
content = content.replace(/-webkit\s+-\s+([a-z]+)\s+-\s+([a-z]+)/g, '-webkit-$1-$2');
content = content.replace(/-webkit\s+-\s+([a-z]+)\s+-\s+([a-z]+)\s+-\s+([a-z]+)/g, '-webkit-$1-$2-$3');

// 5. Special cases for the buggy lines
content = content.replace(/margin\s+-\s+bottom:/g, 'margin-bottom:');
content = content.replace(/font\s+-\s+size:/g, 'font-size:');
content = content.replace(/font\s+-\s+weight:/g, 'font-weight:');
content = content.replace(/max\s+-\s+width:/g, 'max-width:');
content = content.replace(/border\s+-\s+right:/g, 'border-right:');
content = content.replace(/margin\s+-\s+top:/g, 'margin-top:');
content = content.replace(/padding\s+-\s+left:/g, 'padding-left:');
content = content.replace(/text\s+-\s+align:/g, 'text-align:');
content = content.replace(/box\s+-\s+sizing:/g, 'box-sizing:');

// Catch any remaining combinations like `-webkit - print - color - adjust`
content = content.replace(/-webkit\s*-\s*print\s*-\s*color\s*-\s*adjust/g, '-webkit-print-color-adjust');

// Write it back
fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed app.js successfully!');
