const fs = require('fs');
let c = fs.readFileSync('client/app.js', 'utf8');

if (c.includes('Quotations & RFPs')) {
    console.log('Already injected, skipping.');
    process.exit(0);
}

// Target: the closing of the alert block, right before ` : ``}` closing line
// We insert a Quotations & RFPs mini-panel just before the ` : ``}` in the client detail panel
const target = `                                \`}
                            </div>
                        </div>
                    \` : \`\`}
                </div>
            </div>
            \`;
    }

    getLeadsContacts()`;

const replacement = `                                \`}

                                <div class="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <div class="text-xs text-slate-500">Quotations & RFPs</div>
                                            <div class="text-sm font-medium text-slate-900 mt-0.5">\${selectedQuotes.length + selectedRfps.length} total document(s)</div>
                                        </div>
                                        <div class="flex gap-2">
                                            <button data-action="nav:projects/quotation_templates" class="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">+ Quote</button>
                                            <button data-action="nav:projects/rfp_templates" class="px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">+ RFP</button>
                                        </div>
                                    </div>
                                    <div class="mt-3 space-y-2">
                                        \${selectedQuotes.length === 0 && selectedRfps.length === 0
                                            ? '<div class="text-xs text-slate-400 py-1">No saved documents yet</div>'
                                            : ''}
                                        \${selectedQuotes.slice(0, 3).map(q => \`
                                            <div class="flex items-center justify-between gap-2 p-2 bg-white border border-l-2 border-l-purple-500 border-slate-200 rounded-lg">
                                                <div>
                                                    <div class="text-sm font-semibold text-slate-900">\${q.number || '—'}</div>
                                                    <div class="text-xs text-slate-500">Quotation · ₹\${q.amount || '—'} · \${q.date || '—'}</div>
                                                </div>
                                            </div>
                                        \`).join('')}
                                        \${selectedRfps.slice(0, 3).map(r => \`
                                            <div class="flex items-center justify-between gap-2 p-2 bg-white border border-l-2 border-l-emerald-500 border-slate-200 rounded-lg">
                                                <div>
                                                    <div class="text-sm font-semibold text-slate-900">\${r.id || '—'}</div>
                                                    <div class="text-xs text-slate-500">RFP · \${r.clientName || '—'} · \${r.date || '—'}</div>
                                                </div>
                                            </div>
                                        \`).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    \` : \`\`}
                </div>
            </div>
            \`;
    }

    getLeadsContacts()`;

if (c.includes(target)) {
    c = c.replace(target, replacement);
    fs.writeFileSync('client/app.js', c, 'utf8');
    console.log('Client widget injected successfully!');
} else {
    console.log('Target not found — dumping relevant area:');
    const idx = c.indexOf('getLeadsContacts()');
    console.log(c.substring(idx - 400, idx + 50));
}
