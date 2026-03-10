const fs = require('fs');
let c = fs.readFileSync('client/app.js', 'utf8');

const t2 = '<button class="px-3 py-1 text-xs font-medium bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">Join Call</button>';
c = c.replace(t2, '');

fs.writeFileSync('client/app.js', c);
