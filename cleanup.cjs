const fs = require('fs');

// Read the file as a buffer to preserve exact bytes
let content = fs.readFileSync('client/app.js', 'utf8');

// First normalize all line endings to LF
content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

// Then convert all to CRLF for Windows compatibility
content = content.replace(/\n/g, '\r\n');

fs.writeFileSync('client/app.js', content, 'utf8');
console.log('Normalized line endings to CRLF throughout app.js');
