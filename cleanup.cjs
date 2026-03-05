const fs = require('fs');
let src = fs.readFileSync('./client/app.js', 'utf8');
const orig = src;

// 1. Fix all broken < div, < !-- (space after <) HTML tags
// These were caused by bad template literal formatting
let count = 0;

// Fix "< div" -> "<div", "< !--" -> "<!--", "< select" -> "<select", etc.
src = src.replace(/< (div|span|p |button|a |section|ul|li|h[1-6]|table|thead|tbody|tr|td|th|form|input|select|option|label|svg|path|circle|img|canvas|nav|aside|main|header|footer)/g, (m, tag) => {
    count++;
    return '<' + tag;
});
src = src.replace(/< !--/g, () => { count++; return '<!--'; });
src = src.replace(/<\/select >/g, () => { count++; return '</select>'; });
src = src.replace(/<\/div >/g, () => { count++; return '</div>'; });
src = src.replace(/< select /g, () => { count++; return '<select '; });
// Fix "< div " style with trailing space before tag name
src = src.replace(/\< ([\w])/g, (m, c) => { count++; return '<' + c; });

console.log(`✅ Fixed ${count} broken HTML tag(s)`);

// 2. Fix bg-white/8 -> bg-white/10 (invalid Tailwind opacity)
const bgCount = (src.match(/bg-white\/8\b/g) || []).length;
src = src.replace(/bg-white\/8\b/g, 'bg-white/10');
console.log(`✅ Fixed ${bgCount} bg-white/8 -> bg-white/10`);

// 3. Fix broken < select id = "..." with spaces around =
// Already checked for </select > above, but also fix select with spaces:
const selCount = (src.match(/\< select id = /g) || []).length;
src = src.replace(/\< select id = /g, '<select id=');
console.log(`✅ Fixed ${selCount} broken <select id = ...`);

fs.writeFileSync('./client/app.js', src);
console.log('Saved.');

// Verify syntax
const vm = require('vm');
try { new vm.Script(src); console.log('SYNTAX OK'); }
catch (e) { console.log('ERROR:', e.message); }
