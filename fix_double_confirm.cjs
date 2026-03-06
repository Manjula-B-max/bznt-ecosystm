const fs = require('fs');
let code = fs.readFileSync('client/app.js', 'utf8');

// Remove redundant double confirm in handleAction
code = code.replace(
    /if \(confirm\('Do you really want to delete this project\?'\)\) \{/,
    "if (true) {"
);

fs.writeFileSync('client/app.js', code, 'utf8');
