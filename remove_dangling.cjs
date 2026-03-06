const fs = require('fs');

let content = fs.readFileSync('client/app.js', 'utf8');

const danglingPattern = /w\.document\.close\(\);\r?\n\s*\}\r?\n\r?\n\s*\*{ box - sizing:[\s\S]*?w\.document\.close\(\);\r?\n\s*\}/;

if (danglingPattern.test(content)) {
    content = content.replace(danglingPattern, 'w.document.close();\r\n    }');
    fs.writeFileSync('client/app.js', content, 'utf8');
    console.log('Successfully removed the dangling CSS/HTML block');
} else {
    console.log('Could not find dangling pattern');
}
