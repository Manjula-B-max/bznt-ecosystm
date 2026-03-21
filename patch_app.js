import fs from 'fs';

let code = fs.readFileSync('d:/bezent/marketflow/client/app.js', 'utf8');
const results = [];

function doReplace(desc, regex, replacement) {
  if (regex instanceof RegExp) {
    const isGlobal = regex.global;
    regex.lastIndex = 0;
    
    const match = code.match(regex);
    if (!match) {
      results.push('FAIL regex: ' + desc);
    } else {
      let originalCode = code;
      code = code.replace(regex, replacement);
      if (code !== originalCode) {
         results.push('SUCCESS: ' + desc);
      } else {
         results.push('FAIL SAME: ' + desc);
      }
    }
  } else {
    if (!code.includes(regex)) {
      results.push('FAIL string: ' + desc);
    } else {
      let originalCode = code;
      code = code.replace(regex, replacement);
      if (code !== originalCode) {
         results.push('SUCCESS: ' + desc);
      } else {
         results.push('FAIL SAME: ' + desc);
      }
    }
  }
}

doReplace('1 string fallback',
  "contact: String(l.contact || '').trim(),\n            source: String(l.source || 'LinkedIn').trim() || 'LinkedIn',",
  `contact: String(l.contact || '').trim(),
            email: String(l.email || '').trim(),
            address: String(l.address || '').trim(),
            locationUrl: String(l.locationUrl || '').trim(),
            contactPersonMultiple: String(l.contactPersonMultiple || '').trim(),
            source: String(l.source || 'LinkedIn').trim() || 'LinkedIn',`
);

doReplace('2 string fallback',
  "city: String(c.city || '—').trim() || '—',\n            industry: String(c.industry || '—').trim() || '—',",
  `city: String(c.city || '—').trim() || '—',
            contactPersonMultiple: String(c.contactPersonMultiple || '').trim(),
            industrySize: String(c.industrySize || '').trim(),
            gstNumber: String(c.gstNumber || '').trim(),
            gstStateCode: String(c.gstStateCode || '').trim(),
            address: String(c.address || '').trim(),
            locationUrl: String(c.locationUrl || '').trim(),
            industry: String(c.industry || '—').trim() || '—',`
);

doReplace('3. getLeadRegistration fields',
  '<div class="col-span-1 sm:col-span-2">\n                            <label class="block text-sm font-medium text-slate-700">Next Action</label>',
  `<div>
                            <label class="block text-sm font-medium text-slate-700">Email</label>
                            <input id="leadEmail" type="email" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g. john@acme.com" value="\${leadData?.email || ''}" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700">Location URL</label>
                            <input id="leadLocationUrl" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="https://maps.google.com/..." value="\${leadData?.locationUrl || ''}" />
                        </div>
                        <div class="col-span-1 sm:col-span-2">
                            <label class="block text-sm font-medium text-slate-700">Address</label>
                            <textarea id="leadAddress" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" rows="3" placeholder="Full address">\${leadData?.address || ''}</textarea>
                        </div>
                        <div class="col-span-1 sm:col-span-2">
                            <label class="block text-sm font-medium text-slate-700">Contact Persons (Name, Email, Dept)</label>
                            <textarea id="leadContactPersonMultiple" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" rows="3" placeholder="John, john@acme.com, Marketing&#10;Jane, jane@acme.com, Tech">\${leadData?.contactPersonMultiple || ''}</textarea>
                        </div>
                        <div class="col-span-1 sm:col-span-2">
                            <label class="block text-sm font-medium text-slate-700">Next Action</label>`
);

doReplace('4a. actionDispatcher lead:register updates extract',
  "const nextAction = document.getElementById('leadNextAction')?.value?.trim() || 'Follow-up';\n                if (!company) {",
  `const nextAction = document.getElementById('leadNextAction')?.value?.trim() || 'Follow-up';
                const emailEl = document.getElementById('leadEmail');
                const addressEl = document.getElementById('leadAddress');
                const locUrlEl = document.getElementById('leadLocationUrl');
                const cpmEl = document.getElementById('leadContactPersonMultiple');

                if (!company) {`
);

doReplace('4b. actionDispatcher lead:register saveLead call',
  "const res = this.saveLead({ company, contact, source, assignedTo, nextAction, stage: 'New Lead', feedbackStatus: 'Pending' });",
  `const res = this.saveLead({ company, contact, source, assignedTo, nextAction, stage: 'New Lead', feedbackStatus: 'Pending', email: emailEl?.value?.trim() || '', address: addressEl?.value?.trim() || '', locationUrl: locUrlEl?.value?.trim() || '', contactPersonMultiple: cpmEl?.value?.trim() || '' });`
);

doReplace('5. getLeadsRegistration fields (Clients)',
  '<div class="col-span-1 sm:col-span-2">\n                        <label class="text-xs font-medium text-slate-600">Notes</label>',
  `<div>
                        <label class="text-xs font-medium text-slate-600">Contact Persons (Name, Email)</label>
                        <textarea id="clientContactPersonMultiple" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" rows="2" placeholder="Jane Doe, jane@email.com">\${clientData?.contactPersonMultiple || ''}</textarea>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-slate-600">Industry Size</label>
                        <input id="clientIndustrySize" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g. 50-100" value="\${clientData?.industrySize || ''}" />
                    </div>
                    <div>
                        <label class="text-xs font-medium text-slate-600">GST Number</label>
                        <input id="clientGstNumber" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="22AAAAA0000A1Z5" value="\${clientData?.gstNumber || ''}" oninput="document.getElementById('clientGstStateCode').value = this.value.substring(0, 2);" />
                    </div>
                    <div>
                        <label class="text-xs font-medium text-slate-600">GST State Code</label>
                        <input id="clientGstStateCode" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none" readonly value="\${clientData?.gstStateCode || ''}" placeholder="Auto" />
                    </div>
                    <div>
                        <label class="text-xs font-medium text-slate-600">Documents Upload</label>
                        <input id="clientDocsUpload" type="file" multiple class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                    </div>
                    <div>
                        <label class="text-xs font-medium text-slate-600">Location URL</label>
                        <input id="clientLocationUrl" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="https://maps.google..." value="\${clientData?.locationUrl || ''}" />
                    </div>
                    <div class="col-span-1 sm:col-span-2">
                        <label class="text-xs font-medium text-slate-600">Address (3 lines)</label>
                        <textarea id="clientAddress" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" rows="3" placeholder="Line 1&#10;Line 2&#10;Line 3">\${clientData?.address || ''}</textarea>
                    </div>
                    <div class="col-span-1 sm:col-span-2">
                        <label class="text-xs font-medium text-slate-600">Notes</label>`
);

doReplace('6a. actionDispatcher client register extract',
  "const notesEl = document.getElementById('clientNotes');\n\n                if (!nameEl",
  `const notesEl = document.getElementById('clientNotes');
                const indSizeEl = document.getElementById('clientIndustrySize');
                const gstNumEl = document.getElementById('clientGstNumber');
                const gstStateEl = document.getElementById('clientGstStateCode');
                const addressEl = document.getElementById('clientAddress');
                const locUrlEl = document.getElementById('clientLocationUrl');
                const cpmEl = document.getElementById('clientContactPersonMultiple');

                if (!nameEl`
);

doReplace('6b. actionDispatcher client register updates',
  "city: '—'\n                });",
  `city: '—',
                    industrySize: indSizeEl?.value?.trim() || '',
                    gstNumber: gstNumEl?.value?.trim() || '',
                    gstStateCode: gstStateEl?.value?.trim() || '',
                    address: addressEl?.value?.trim() || '',
                    locationUrl: locUrlEl?.value?.trim() || '',
                    contactPersonMultiple: cpmEl?.value?.trim() || ''
                });`
);

doReplace('7a. table header lead directory',
  `<thead class="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th class="text-left px-4 py-3 font-medium border-b border-r border-slate-100 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">Lead ID</th>
                                        <th class="text-left px-4 py-3 font-medium border-b border-r border-slate-100 bg-white">Company</th>
                                        <th class="text-left px-4 py-3 font-medium border-b border-r border-slate-100 bg-white">Contact</th>
                                        <th class="text-left px-4 py-3 font-medium border-b border-r border-slate-100 bg-white">Source</th>
                                        <th class="text-left px-4 py-3 font-medium border-b border-r border-slate-100 bg-white">Stage</th>
                                        <th class="text-left px-4 py-3 font-medium border-b border-slate-100 bg-white">Feedback</th>
                                        <th class="text-center px-4 py-3 font-medium border-b border-slate-100 bg-white text-xs uppercase w-20">Actions</th>
                                    </tr>
                                </thead>`,
  `<thead class="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th class="text-left px-4 py-2 font-medium w-32 border-b border-r border-slate-100 bg-white">
                                            <div class="mb-1 text-xs text-slate-500 font-semibold uppercase">Lead ID</div>
                                            <input type="text" data-filter="lead-id" class="table-filter-input w-full px-2 py-1 text-xs border border-slate-200 rounded font-normal text-slate-900 bg-slate-50 focus:bg-white transition-colors" placeholder="Filter...">
                                        </th>
                                        <th class="text-left px-4 py-2 font-medium border-b border-r border-slate-100 bg-white">
                                            <div class="mb-1 text-xs text-slate-500 font-semibold uppercase">Company</div>
                                            <input type="text" data-filter="lead-company" class="table-filter-input w-full px-2 py-1 text-xs border border-slate-200 rounded font-normal text-slate-900 bg-slate-50 focus:bg-white transition-colors" placeholder="Filter...">
                                        </th>
                                        <th class="text-left px-4 py-2 font-medium border-b border-r border-slate-100 bg-white">
                                            <div class="mb-1 text-xs text-slate-500 font-semibold uppercase">Contact Details</div>
                                            <input type="text" data-filter="lead-contact" class="table-filter-input w-full px-2 py-1 text-xs border border-slate-200 rounded font-normal text-slate-900 bg-slate-50 focus:bg-white transition-colors" placeholder="Filter...">
                                        </th>
                                        <th class="text-left px-4 py-2 font-medium border-b border-r border-slate-100 bg-white">
                                            <div class="mb-1 text-xs text-slate-500 font-semibold uppercase">Address & Loc</div>
                                            <input type="text" data-filter="lead-address" class="table-filter-input w-full px-2 py-1 text-xs border border-slate-200 rounded font-normal text-slate-900 bg-slate-50 focus:bg-white transition-colors" placeholder="Filter...">
                                        </th>
                                        <th class="text-left px-4 py-2 font-medium w-28 border-b border-r border-slate-100 bg-white">
                                            <div class="mb-1 text-xs text-slate-500 font-semibold uppercase">Source</div>
                                            <input type="text" data-filter="lead-source" class="table-filter-input w-full px-2 py-1 text-xs border border-slate-200 rounded font-normal text-slate-900 bg-slate-50 focus:bg-white transition-colors" placeholder="Filter...">
                                        </th>
                                        <th class="text-left px-4 py-2 font-medium w-32 border-b border-r border-slate-100 bg-white">
                                            <div class="mb-1 text-xs text-slate-500 font-semibold uppercase">Stage</div>
                                            <input type="text" data-filter="lead-stage" class="table-filter-input w-full px-2 py-1 text-xs border border-slate-200 rounded font-normal text-slate-900 bg-slate-50 focus:bg-white transition-colors" placeholder="Filter...">
                                        </th>
                                        <th class="text-center px-4 py-3 font-medium border-b border-slate-100 bg-white text-xs uppercase w-20">Actions</th>
                                    </tr>
                                </thead>`
);

doReplace('7b. Lead rows data attributes and cols',
  /<td class="px-4 py-4 font-medium text-slate-900 border-r border-slate-50">\$\{l\.id\}<\/td>\s*<td class="px-4 py-4 text-slate-700 border-r border-slate-50">\$\{l\.company\}<\/td>\s*<td class="px-4 py-4 text-slate-700 border-r border-slate-50">\$\{l\.contact \|\| '—'\}<\/td>\s*<td class="px-4 py-4 text-slate-700 border-r border-slate-50">\$\{l\.source \|\| '—'\}<\/td>\s*<td class="px-4 py-4 text-slate-700 border-r border-slate-50">\$\{l\.stage \|\| '—'\}<\/td>\s*<td class="px-4 py-4 text-slate-700 border-r border-slate-50">\$\{l\.feedbackStatus \|\| '—'\}<\/td>\s*<td class="px-4 py-4 text-center">/g,
  `<td class="px-4 py-3 font-medium text-slate-900 border-r border-slate-50" data-f-lead-id="\${String(l.id).toLowerCase()}">\${l.id}</td>
                                                <td class="px-4 py-3 text-slate-700 border-r border-slate-50" data-f-lead-company="\${String(l.company).toLowerCase()}">\${l.company}</td>
                                                <td class="px-4 py-3 text-slate-700 text-sm border-r border-slate-50" data-f-lead-contact="\${String((l.contact||'')+' '+(l.email||'')+' '+(l.contactPersonMultiple||'')).toLowerCase()}">
                                                    <div>Phone: \${l.contact || '—'}</div>
                                                    <div>Email: \${l.email || '—'}</div>
                                                    <div class="text-xs text-slate-500 whitespace-pre-wrap">\${l.contactPersonMultiple || ''}</div>
                                                </td>
                                                <td class="px-4 py-3 text-slate-700 text-xs border-r border-slate-50" data-f-lead-address="\${String((l.address||'')+' '+(l.locationUrl||'')).toLowerCase()}">
                                                    <div class="whitespace-pre-wrap">\${l.address || '—'}</div>
                                                    <div><a href="\${l.locationUrl || '#'}" target="_blank" class="text-purple-600 underline">Location URL</a></div>
                                                </td>
                                                <td class="px-4 py-3 text-slate-700 border-r border-slate-50" data-f-lead-source="\${String(l.source || '').toLowerCase()}">\${l.source || '—'}</td>
                                                <td class="px-4 py-3 text-slate-700 border-r border-slate-50" data-f-lead-stage="\${String(l.stage || '').toLowerCase()}">\${l.stage || '—'}</td>
                                                <td class="px-4 py-3 text-center">`
);

doReplace('8a. table header client directory',
  `<thead class="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th class="text-left px-4 py-3 font-medium border-b border-r border-slate-100 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">Client</th>
                                        <th class="text-left px-4 py-3 font-medium border-b border-r border-slate-100 bg-white">Owner</th>
                                        <th class="text-left px-4 py-3 font-medium border-b border-r border-slate-100 bg-white">Status</th>
                                        <th class="text-right px-4 py-3 font-medium border-b border-slate-100 bg-white">Bal/Due</th>
                                        <th class="text-center px-4 py-3 font-medium text-xs text-slate-500 uppercase border-b border-slate-100 bg-white w-20">Actions</th>
                                    </tr>
                                </thead>`,
  `<thead class="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th class="text-left px-4 py-2 font-medium border-b border-r border-slate-100 bg-white">
                                            <div class="mb-1 text-xs text-slate-500 font-semibold uppercase">Client</div>
                                            <input type="text" data-filter="client-name" class="table-filter-input w-full px-2 py-1 text-xs border border-slate-200 rounded font-normal text-slate-900 bg-slate-50 focus:bg-white transition-colors" placeholder="Filter...">
                                        </th>
                                        <th class="text-left px-4 py-2 font-medium border-b border-r border-slate-100 bg-white">
                                            <div class="mb-1 text-xs text-slate-500 font-semibold uppercase">Contact Details</div>
                                            <input type="text" data-filter="client-contact" class="table-filter-input w-full px-2 py-1 text-xs border border-slate-200 rounded font-normal text-slate-900 bg-slate-50 focus:bg-white transition-colors" placeholder="Filter...">
                                        </th>
                                        <th class="text-left px-4 py-2 font-medium border-b border-r border-slate-100 bg-white">
                                            <div class="mb-1 text-xs text-slate-500 font-semibold uppercase">GST & Size</div>
                                            <input type="text" data-filter="client-gst" class="table-filter-input w-full px-2 py-1 text-xs border border-slate-200 rounded font-normal text-slate-900 bg-slate-50 focus:bg-white transition-colors" placeholder="Filter...">
                                        </th>
                                        <th class="text-left px-4 py-2 font-medium border-b border-r border-slate-100 bg-white">
                                            <div class="mb-1 text-xs text-slate-500 font-semibold uppercase">Address & Loc</div>
                                            <input type="text" data-filter="client-loc" class="table-filter-input w-full px-2 py-1 text-xs border border-slate-200 rounded font-normal text-slate-900 bg-slate-50 focus:bg-white transition-colors" placeholder="Filter...">
                                        </th>
                                        <th class="text-left px-4 py-2 font-medium w-28 border-b border-r border-slate-100 bg-white">
                                            <div class="mb-1 text-xs text-slate-500 font-semibold uppercase">Owner</div>
                                            <input type="text" data-filter="client-owner" class="table-filter-input w-full px-2 py-1 text-xs border border-slate-200 rounded font-normal text-slate-900 bg-slate-50 focus:bg-white transition-colors" placeholder="Filter...">
                                        </th>
                                        <th class="text-left px-4 py-2 font-medium w-32 border-b border-r border-slate-100 bg-white">
                                            <div class="mb-1 text-xs text-slate-500 font-semibold uppercase">Status</div>
                                            <input type="text" data-filter="client-stage" class="table-filter-input w-full px-2 py-1 text-xs border border-slate-200 rounded font-normal text-slate-900 bg-slate-50 focus:bg-white transition-colors" placeholder="Filter...">
                                        </th>
                                        <th class="text-center px-4 py-3 font-medium text-xs text-slate-500 uppercase border-b border-slate-100 bg-white w-20">Actions</th>
                                    </tr>
                                </thead>`
);

doReplace('8b. Client rows',
  /<td class="px-4 py-4 border-r border-slate-50">\s*<div class="font-medium text-slate-900">\$\{c\.name\}<\/div>\s*<div class="text-xs text-slate-500 mt-1">\$\{c\.city\} • \$\{c\.industry\}<\/div>\s*<\/td>\s*<td class="px-4 py-4 text-slate-700 border-r border-slate-50">\$\{c\.owner\}<\/td>\s*<td class="px-4 py-4 border-r border-slate-50">\$\{this\.renderBadge\(c\.stage\)\}<\/td>\s*<td class="px-4 py-4 text-right border-r border-slate-50">/g,
  `<td class="px-4 py-4 border-r border-slate-50" data-f-client-name="\${String(c.name).toLowerCase()}">
                                                <div class="font-medium text-slate-900">\${c.name}</div>
                                                <div class="text-xs text-slate-500 mt-1">\${c.city} • \${c.industry}</div>
                                            </td>
                                            <td class="px-4 py-3 text-xs border-r border-slate-50" data-f-client-contact="\${String((c.email||'')+' '+(c.phone||'')+' '+(c.contactPersonMultiple||'')+' '+(c.gstNumber||'')+' '+(c.gstStateCode||'')+' '+(c.industrySize||'')).toLowerCase()}">
                                                <div>\${c.phone || '—'}</div>
                                                <div>\${c.email || '—'}</div>
                                                <div class="text-slate-500 whitespace-pre-wrap">\${c.contactPersonMultiple || ''}</div>
                                                <div class="mt-1">GST: \${c.gstNumber || '—'} [\${c.gstStateCode || '—'}]</div>
                                            </td>
                                            <td class="px-4 py-3 text-xs text-slate-700 border-r border-slate-50" data-f-client-loc="\${String((c.address||'')+' '+(c.locationUrl||'')).toLowerCase()}">
                                                <div class="whitespace-pre-wrap">\${c.address || '—'}</div>
                                                <div><a href="\${c.locationUrl || '#'}" target="_blank" class="text-purple-600 underline">Location</a></div>
                                            </td>
                                            <td class="px-4 py-4 text-slate-700 border-r border-slate-50" data-f-client-owner="\${String(c.owner||'').toLowerCase()}">\${c.owner}</td>
                                            <td class="px-4 py-4 border-r border-slate-50" data-f-client-stage="\${String(c.stage||'').toLowerCase()}">\${this.renderBadge(c.stage)}</td>
                                            <td class="px-4 py-4 text-right border-r border-slate-50">`
);

doReplace('9a. Filter handlers 1',
  "this.setupLeadDirectoryInteractions();\n        }",
  `this.setupLeadDirectoryInteractions();
            this.setupTableFilters();
        }`
);

doReplace('9b. Filter handlers 2',
  "this.setupClientDirectoryInteractions();\n        }",
  `this.setupClientDirectoryInteractions();
            this.setupTableFilters();
        }`
);

// We should only insert this once if it's missing
if (!code.includes("setupTableFilters() {")) {
  doReplace('10. setupTableFilters function',
    "setupClientDirectoryInteractions() {",
    `setupTableFilters() {
        const inputs = document.querySelectorAll('.table-filter-input');
        inputs.forEach(input => {            
            // Remove previous listeners if we are re-rendering
            const clone = input.cloneNode(true);
            if(input.parentNode) {
                input.parentNode.replaceChild(clone, input);
                clone.addEventListener('input', (e) => {
                    const table = clone.closest('table');
                    if(table) {
                        const trs = table.querySelectorAll('tbody tr');
                        const filterKey = clone.dataset.filter;
                        const attrKey = 'data-f-' + filterKey;
                        const query = e.target.value.toLowerCase().trim();
                        trs.forEach(tr => {
                            const cell = tr.querySelector('[' + attrKey + ']');
                            if(tr.closest('thead')) return;
                            if (cell) {
                                const content = cell.getAttribute(attrKey) || '';
                                if (content.includes(query)) {
                                    cell.dataset[filterKey + 'Hidden'] = 'false';
                                } else {
                                    cell.dataset[filterKey + 'Hidden'] = 'true';
                                }
                            }
                        });
                        trs.forEach(tr => {
                             if(tr.closest('thead')) return; // do not hide thead
                             let shouldHide = false;
                             for(let i=0; i<tr.cells.length; i++){
                                  const cell = tr.cells[i];
                                  for (const key in cell.dataset) {
                                      if (key.endsWith('Hidden') && cell.dataset[key] === 'true') {
                                          shouldHide = true;
                                      }
                                  }
                             }
                             tr.style.display = shouldHide ? 'none' : '';
                        });
                    }
                });
                clone.addEventListener('click', e => e.stopPropagation());
            }
        });
    }

    setupClientDirectoryInteractions() {`
  );
}

fs.writeFileSync('d:/bezent/marketflow/client/app.js', code, 'utf8');
fs.writeFileSync('output.log', results.join('\n'), 'utf8');
