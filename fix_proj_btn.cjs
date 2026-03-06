const fs = require('fs');
let code = fs.readFileSync('client/app.js', 'utf8');

code = code.replace(
    /<button data-action="project:dir:select:\$\{String\(k\)\.replace\(\/\\?"\/g, '&quot;'\)\}" class="(.*?)" title="Edit Project">/g,
    '<button data-action="project:edit:${String(k).replace(/\\?"/g, \'&quot;\')}" class="$1" title="Edit Project">'
);

fs.writeFileSync('client/app.js', code, 'utf8');
