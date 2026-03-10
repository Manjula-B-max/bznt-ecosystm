const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf8');

// 1. Wrap canvas tags securely inside a flex container or anything
// Make sure not to double wrap just in case
content = content.replace(/<div class="relative w-full h-full" style="min-height: 250px;">\s*<canvas id="([^"]+)"><\/canvas>\s*<\/div>/g, '<canvas id="$1"></canvas>');
content = content.replace(/<canvas\s+id="([^"]+Chart)"\s*><\/canvas>/g,
    '<div class="relative w-full h-full" style="min-height: 250px;"><canvas id="$1"></canvas></div>');

// 2. Fix layouts: h-64, h-60, h-80 with flex
content = content.replace(/class="([^"]*?)(h-64|h-60|h-80)([^"]*?)flex items-center justify-center([^"]*?)"/g,
    'class="$1 $2 relative w-full $3 $4"');

// 3. Add min-w-0 to grid children (the dashboard cards)
content = content.replace(/class="([^"]*?)bg-white rounded-lg border border-slate-200([^"]*?)shadow-lg([^"]*?)"/g, (m, p1, p2, p3) => {
    if (!m.includes('min-w-0')) return `class="${p1}bg-white rounded-lg border border-slate-200${p2}shadow-lg min-w-0${p3}"`.replace(/\s{2,}/g, ' ');
    return m;
});
content = content.replace(/class="([^"]*?)bg-white rounded-xl border border-slate-200([^"]*?)shadow-sm([^"]*?)"/g, (m, p1, p2, p3) => {
    if (!m.includes('min-w-0')) return `class="${p1}bg-white rounded-xl border border-slate-200${p2}shadow-sm min-w-0${p3}"`.replace(/\s{2,}/g, ' ');
    return m;
});

fs.writeFileSync('app.js', content, 'utf8');
console.log("Safe canvas + grid fixes applied.");
