const fs = require('fs');
let c = fs.readFileSync('client/app.js', 'utf8');

// 1. Add RFPs tab to billing nav
c = c.replace(
    `                { id: 'overdue_risk', label: 'Overdue Risk Dashboard' }
            ],`,
    `                { id: 'overdue_risk', label: 'Overdue Risk Dashboard' },
                { id: 'rfps', label: 'RFPs' }
            ],`
);

// 2. Add case in renderBillingContent
c = c.replace(
    `            case 'overdue_risk':
                container.innerHTML = this.getBillingOverdueRisk();
                break;
            default:
                container.innerHTML = this.getBillingInvoices();
        }
    }`,
    `            case 'overdue_risk':
                container.innerHTML = this.getBillingOverdueRisk();
                break;
            case 'rfps':
                container.innerHTML = this.getBillingRfps();
                break;
            default:
                container.innerHTML = this.getBillingInvoices();
        }
    }`
);

// 3. Fix getBillingQuotations to read q.number (our saved field) as well as q.no
c = c.replace(
    `                \`<tr class="hover:bg-slate-50">
                                <td class="px-4 py-3 font-semibold text-purple-700">\${esc(q.no || q.id || '—')}</td>
                                <td class="px-4 py-3 text-slate-700">\${esc(q.client)}</td>
                                <td class="px-4 py-3 text-right font-semibold text-slate-900">\${esc(q.amount)}</td>
                                <td class="px-4 py-3"><span class="px-2 py-1 text-xs font-medium bg-\${col}-50 text-\${col}-700 rounded-full">\${esc(q.status)}</span></td>
                                <td class="px-4 py-3 text-slate-600 text-xs">\${next}</td>
                                <td class="px-4 py-3">
                                    \${q.status === 'Approved' ? \`<button data-action="quotation:toInvoice" data-qid="\${esc(q.no || q.id)}" class="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100">→ Invoice</button>\` : ''}
                                </td>
                            </tr>\`;`,
    `\`<tr class="hover:bg-slate-50">
                                <td class="px-4 py-3 font-semibold text-purple-700">\${esc(q.number || q.no || q.id || '—')}</td>
                                <td class="px-4 py-3 text-slate-700">\${esc(q.client || q.buyer?.name || '—')}</td>
                                <td class="px-4 py-3 text-right font-semibold text-slate-900">\${esc(q.amount || q.totals?.grandTotal || '—')}</td>
                                <td class="px-4 py-3"><span class="px-2 py-1 text-xs font-medium bg-\${col}-50 text-\${col}-700 rounded-full">\${esc(q.status || 'Draft')}</span></td>
                                <td class="px-4 py-3 text-slate-700 text-xs">\${esc(q.date || '—')}</td>
                                <td class="px-4 py-3 text-slate-600 text-xs">\${next}</td>
                                <td class="px-4 py-3">
                                    \${(q.status === 'Approved') ? \`<button data-action="quotation:toInvoice" data-qid="\${esc(q.number || q.no || q.id)}" class="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100">→ Invoice</button>\` : ''}
                                </td>
                            </tr>\`;`
);

// Also fix the table header to add Date column
c = c.replace(
    `                            <th class="text-left px-4 py-3 font-medium">Status</th>
                            <th class="text-left px-4 py-3 font-medium">Next Action</th>
                            <th class="text-left px-4 py-3 font-medium">Actions</th>
                        </tr></thead>`,
    `                            <th class="text-left px-4 py-3 font-medium">Status</th>
                            <th class="text-left px-4 py-3 font-medium">Date</th>
                            <th class="text-left px-4 py-3 font-medium">Next Action</th>
                            <th class="text-left px-4 py-3 font-medium">Actions</th>
                        </tr></thead>`
);

// 4. Add getBillingRfps method right after getBillingQuotations ends (before getBillingContracts)
const rfpsMethod = `
    getBillingRfps() {
        const rfps = this.readStore('bezent_rfps', []);
        const esc = v => String(v ?? '').replace(/</g, '&lt;');

        return \`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">RFPs (Request for Proposal)</h2>
                        <p class="text-sm text-slate-500">All saved RFPs linked to clients and projects</p>
                    </div>
                    <button data-action="nav:projects/rfp_templates" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ New RFP</button>
                </div>

                <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <div class="text-xs text-slate-500">Total RFPs</div>
                        <div class="text-2xl font-bold text-slate-900 mt-1">\${rfps.length}</div>
                        <div class="text-xs text-slate-400 mt-1">all time</div>
                    </div>
                    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <div class="text-xs text-slate-500">Unique Clients</div>
                        <div class="text-2xl font-bold text-purple-700 mt-1">\${new Set(rfps.map(r => String(r.clientName || '').trim().toLowerCase()).filter(Boolean)).size}</div>
                    </div>
                    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <div class="text-xs text-slate-500">This Month</div>
                        <div class="text-2xl font-bold text-sky-700 mt-1">\${rfps.filter(r => { const d = new Date(r.date); return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear(); }).length}</div>
                    </div>
                </div>

                \${rfps.length === 0 ? \`
                <div class="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 shadow-sm">
                    <i data-lucide="file-search" class="w-12 h-12 mx-auto mb-3 opacity-20"></i>
                    <p class="font-medium text-slate-600">No RFPs saved yet</p>
                    <p class="text-sm mt-1">Go to <strong>Projects → RFP Templates</strong> and click <strong>Save RFP</strong> to store one here.</p>
                </div>
                \` : \`
                <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div class="p-4 border-b border-slate-100 flex items-center justify-between">
                        <div class="text-sm font-semibold text-slate-900">RFP List</div>
                        <div class="text-xs text-slate-500">\${rfps.length} document(s)</div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm" style="min-width:700px">
                            <thead class="bg-slate-50 text-slate-600">
                                <tr>
                                    <th class="text-left px-4 py-3 font-medium">RFP ID</th>
                                    <th class="text-left px-4 py-3 font-medium">Client</th>
                                    <th class="text-left px-4 py-3 font-medium">Project</th>
                                    <th class="text-left px-4 py-3 font-medium">Date</th>
                                    <th class="text-left px-4 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                \${rfps.map(r => \`
                                <tr class="hover:bg-slate-50">
                                    <td class="px-4 py-3 font-semibold text-emerald-700">\${esc(r.id || '—')}</td>
                                    <td class="px-4 py-3 text-slate-700">\${esc(r.clientName || r.client?.companyName || '—')}</td>
                                    <td class="px-4 py-3 text-slate-700">\${esc(r.projectName || r.client?.projectName || '—')}</td>
                                    <td class="px-4 py-3 text-slate-600">\${esc(r.date || '—')}</td>
                                    <td class="px-4 py-3">
                                        <button data-action="nav:projects/rfp_templates" class="px-3 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">View Template</button>
                                    </td>
                                </tr>
                                \`).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                \`}
            </div>
        \`;
    }

`;

// Insert before getBillingContracts
c = c.replace('    getBillingContracts() {', rfpsMethod + '    getBillingContracts() {');

fs.writeFileSync('client/app.js', c, 'utf8');
console.log('Done. RFPs tab added to billing + Quotations field names fixed.');
