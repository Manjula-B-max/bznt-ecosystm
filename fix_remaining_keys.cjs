const fs = require('fs');
let code = fs.readFileSync('client/app.js', 'utf8');

code = code.replace(
    /this\.writeStore\('bezent_leads',\s*filtered\);/g,
    "this.writeStore('APJ 3D Solutions_leads', filtered);"
);
code = code.replace(
    /this\.writeStore\('bezent_projects_merged',\s*existing\);/g,
    "this.writeStore('APJ 3D Solutions_projects', existing);"
);

fs.writeFileSync('client/app.js', code, 'utf8');
console.log("Replaced bug strings globally.");
