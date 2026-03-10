const fs = require('fs');

let file = fs.readFileSync('client/app.js', 'utf8');

const doubleRfpBtn = `                        <button data-action="rfp:save:current" class="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">Save RFP</button>\n                        <button data-action="rfp:save:current" class="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">Save RFP</button>`;
const singleRfpBtn = `                        <button data-action="rfp:save:current" class="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">Save RFP</button>`;

const doubleQuoteBtn = `                        <button data-action="quote:save:current" class="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">Save Quotation</button>\n                        <button data-action="quote:save:current" class="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">Save Quotation</button>`;
const singleQuoteBtn = `                        <button data-action="quote:save:current" class="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">Save Quotation</button>`;

file = file.replace(doubleRfpBtn, singleRfpBtn);
file = file.replace(doubleQuoteBtn, singleQuoteBtn);

// Use Regex to be robust against newline differences
file = file.replace(/(<button data-action="rfp:save:current"([^>]+)>([^<]+)<\/button>\s*)+/g, '<button data-action="rfp:save:current"$2>$3</button>\n');
file = file.replace(/(<button data-action="quote:save:current"([^>]+)>([^<]+)<\/button>\s*)+/g, '<button data-action="quote:save:current"$2>$3</button>\n');

fs.writeFileSync('client/app.js', file, 'utf8');
console.log('Removed duplicate save buttons.');
