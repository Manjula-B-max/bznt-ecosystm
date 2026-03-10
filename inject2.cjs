const fs = require('fs');
let c = fs.readFileSync('client/app.js', 'utf8');

// 1. Inject inside getLeadsDirectory
// Target: <div class="p-3 bg-slate-50 rounded-lg">
//        <div class="text-xs text-slate-500">Client Name</div>
const t1_idx = c.indexOf('<div class="p-3 bg-slate-50 rounded-lg">\n                                    <div class="text-xs text-slate-500">Client Name</div>');
if (t1_idx !== -1 && !c.includes('Quotations & RFPs')) {
    const htmlInsert1 = `
                            <div class="mt-4 p-3 bg-slate-50 rounded-lg">
                                <div class="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <div class="text-xs text-slate-500">Quotations & RFPs</div>
                                        <div class="text-sm font-medium text-slate-900">\${selectedQuotes.length + selectedRfps.length} total docs</div>
                                    </div>
                                    <div class="flex gap-2">
                                        <button data-action="nav:projects/quotation_templates" class="px-2 py-1 text-xs font-medium bg-white border border-slate-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors">+ Quote</button>
                                        <button data-action="nav:projects/rfp_templates" class="px-2 py-1 text-xs font-medium bg-white border border-slate-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors">+ RFP</button>
                                    </div>
                                </div>
                                <div class="mt-3 space-y-2">
                                   \${selectedQuotes.length === 0 && selectedRfps.length === 0 ? '<div class="text-xs text-slate-500">No documents yet</div>' : ''}
                                   \${selectedQuotes.slice(0, 3).map(q => \`
                                       <div class="flex items-center justify-between gap-2 p-2 bg-white border border-slate-200 rounded-lg">
                                           <div><div class="text-sm font-semibold text-slate-900">\${esc(q.number)}</div><div class="text-xs text-slate-600">Quote • ₹\${esc(q.amount)}</div></div>
                                       </div>
                                   \`).join('')}
                                   \${selectedRfps.slice(0, 3).map(r => \`
                                       <div class="flex items-center justify-between gap-2 p-2 bg-white border border-slate-200 rounded-lg">
                                           <div><div class="text-sm font-semibold text-slate-900">\${esc(r.id)}</div><div class="text-xs text-slate-600">RFP • \${esc(r.date)}</div></div>
                                       </div>
                                   \`).join('')}
                                </div>
                            </div>
`;
    // Also inject variables
    const insertVars = `
        const selectedQuotes = selected ? this.readStore('bezent_quotations', []).filter(q => String(q?.client || '').trim().toLowerCase() === String(selected.name || '').trim().toLowerCase()) : [];
        const selectedRfps = selected ? this.readStore('bezent_rfps', []).filter(r => String(r?.clientName || '').trim().toLowerCase() === String(selected.name || '').trim().toLowerCase()) : [];
`;

    // insert variables near latestInvoices
    c = c.replace(/const latestInvoices\s*=\s*[^\n]+;/, match => match + insertVars);
    c = c.substring(0, t1_idx) + htmlInsert1 + c.substring(t1_idx);
} else {
    console.log('Failed to find client target');
}

// 2. Inject inside getProjectDirectory (renderProfile)
const t2 = `const key = this.getProjectKey(p);`;
if (c.includes(t2)) {
    const vars2 = `
            const clientMatch = String(p.identification?.companyName || p.client || '').trim().toLowerCase();
            const selectedQuotes = p ? this.readStore('bezent_quotations', []).filter(q => String(q?.client || '').trim().toLowerCase() === clientMatch) : [];
            const selectedRfps = p ? this.readStore('bezent_rfps', []).filter(r => String(r?.clientName || '').trim().toLowerCase() === clientMatch) : [];
`;
    const idx2 = c.indexOf(t2);
    if (idx2 > -1 && !c.includes('border-l-purple-500')) {
        c = c.substring(0, idx2 + t2.length) + vars2 + c.substring(idx2 + t2.length);

        // Find the save button area and prepend
        const saveRx = /<div class="mt-6 flex gap-2">\s*<button data-action="project:save:\$\{String\(key\)/;
        const matchInfo = saveRx.exec(c);
        if (matchInfo) {
            const htmlInsert2 = `
                    <div class="mt-5 mb-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div class="flex items-center justify-between">
                            <div class="text-sm font-semibold text-slate-900">Quotations & RFPs</div>
                            <div class="flex gap-2">
                                <button data-action="nav:projects/quotation_templates" class="px-2 py-1 text-xs font-medium bg-white border border-slate-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors">+ Quote</button>
                                <button data-action="nav:projects/rfp_templates" class="px-2 py-1 text-xs font-medium bg-white border border-slate-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors">+ RFP</button>
                            </div>
                        </div>
                        <div class="mt-3 space-y-2">
                            \${selectedQuotes.length === 0 && selectedRfps.length === 0 ? '<div class="text-xs text-slate-500">No documents yet</div>' : ''}
                            \${selectedQuotes.slice(0, 3).map(q => \`
                                <div class="flex items-center justify-between gap-2 p-2 bg-white border border-slate-200 rounded-lg border-l-2 border-l-purple-500">
                                    <div><div class="text-sm font-semibold text-slate-900">\${esc(q.number)}</div><div class="text-xs text-slate-600">Quote • ₹\${esc(q.amount)}</div></div>
                                </div>
                            \`).join('')}
                            \${selectedRfps.slice(0, 3).map(r => \`
                                <div class="flex items-center justify-between gap-2 p-2 bg-white border border-slate-200 rounded-lg border-l-2 border-l-emerald-500">
                                    <div><div class="text-sm font-semibold text-slate-900">\${esc(r.id)}</div><div class="text-xs text-slate-600">RFP • \${esc(r.date)}</div></div>
                                </div>
                            \`).join('')}
                        </div>
                    </div>
`;
            c = c.substring(0, matchInfo.index) + htmlInsert2 + c.substring(matchInfo.index);
        } else {
            console.log("Failed to find save button in Project modal");
        }
    }
}

fs.writeFileSync('client/app.js', c, 'utf8');
console.log('Done!');
