const fs = require('fs');
let c = fs.readFileSync('client/app.js', 'utf8');

// 1. Inject inside getLeadsDirectory
const target1 = `        const latestInvoices = selectedInvoices.slice(0, 3);`;
const insert1 = `
        const selectedQuotes = selected ? this.readStore('bezent_quotations', []).filter(q => String(q?.client || '').trim().toLowerCase() === String(selected.name || '').trim().toLowerCase()) : [];
        const selectedRfps = selected ? this.readStore('bezent_rfps', []).filter(r => String(r?.clientName || '').trim().toLowerCase() === String(selected.name || '').trim().toLowerCase()) : [];
`;
if (c.includes(target1) && !c.includes('const selectedQuotes = selected ?')) {
    c = c.replace(target1, target1 + insert1);
}

const htmlTarget1 = `<div class="mt-4 space-y-3">
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Client Name</div>`;
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
if (c.includes(htmlTarget1) && !c.includes('Quotations & RFPs')) {
    c = c.replace(htmlTarget1, htmlInsert1 + '\n' + htmlTarget1);
}

// 2. Inject inside getProjectDirectory (renderProfile)
const target2 = `        const renderProfile = (p) => {
            if (!p) {
                return \`<div class="text-sm text-slate-500" > Select a project to view details.</div> \`;
            }
            const key = this.getProjectKey(p);`;

const insert2 = `
            const clientMatch = String(p.identification?.companyName || p.client || '').trim().toLowerCase();
            const selectedQuotes = p ? this.readStore('bezent_quotations', []).filter(q => String(q?.client || '').trim().toLowerCase() === clientMatch) : [];
            const selectedRfps = p ? this.readStore('bezent_rfps', []).filter(r => String(r?.clientName || '').trim().toLowerCase() === clientMatch) : [];
`;
if (c.includes(target2) && !c.includes('const selectedQuotes = p ? this.readStore(')) {
    c = c.replace(target2, target2 + insert2);
}

const htmlTarget2 = `                    <div class="mt-6 flex gap-2">
                        <button data-action="project:save:\${String(key).replace(/"/g, '&quot;')}" class="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700">Save</button>`;

const htmlInsert2 = `
                    <div class="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
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

if (c.includes(htmlTarget2) && !c.includes('border-l-purple-500')) {
    c = c.replace(htmlTarget2, htmlInsert2 + '\n' + htmlTarget2);
}

fs.writeFileSync('client/app.js', c, 'utf8');
console.log('Injected Quotations and RFPs into Client and Project details.');
