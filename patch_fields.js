import fs from 'fs';

let code = fs.readFileSync('client/app.js', 'utf8');

// 1. Inject global helpers
code = code.replace(
`})();\n\n// MarketFlow CRM Dashboard Application`,
`})();

window.addContactRow = function(type) {
    const list = document.getElementById(type + 'ContactPersonsList');
    if (!list) return;
    const div = document.createElement('div');
    div.className = 'grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 contact-person-row mt-2 items-center';
    div.innerHTML = \`
        <input type="text" class="cp-name border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Name" />
        <input type="email" class="cp-email border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Email" />
        <input type="text" class="cp-dept border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Dept" />
        <button type="button" onclick="this.parentElement.remove()" class="w-8 h-8 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-lg font-medium" title="Remove">✕</button>
    \`;
    list.appendChild(div);
};

window.extractContacts = function(type) {
    const rows = document.querySelectorAll('#' + type + 'ContactPersonsList .contact-person-row');
    if (!rows.length) return '';
    const res = [];
    rows.forEach(r => {
        const n = r.querySelector('.cp-name')?.value?.trim() || '';
        const e = r.querySelector('.cp-email')?.value?.trim() || '';
        const d = r.querySelector('.cp-dept')?.value?.trim() || '';
        if(n || e || d) res.push(\`\${n} | \${e} | \${d}\`);
    });
    return res.join('\\n');
};

window.renderContactsRows = function(val) {
    if (!val) return '';
    const esc = (v) => String(v ?? "").replace(/</g, "&lt;");
    return String(val).split('\\n').map(line => {
        const parts = line.split('|').map(s => s.trim());
        const n = parts[0] || '';
        const e = parts[1] || '';
        const d = parts[2] || '';
        return \`
            <div class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 contact-person-row mt-2 items-center">
                <input type="text" class="cp-name border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Name" value="\${esc(n)}" />
                <input type="email" class="cp-email border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Email" value="\${esc(e)}" />
                <input type="text" class="cp-dept border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Dept" value="\${esc(d)}" />
                <button type="button" onclick="this.parentElement.remove()" class="w-8 h-8 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-lg font-medium" title="Remove">✕</button>
            </div>
        \`;
    }).join('');
};

window.extractAddress = function(type) {
    const l1 = document.getElementById(type + 'AddressLine1')?.value?.trim() || '';
    const l2 = document.getElementById(type + 'AddressLine2')?.value?.trim() || '';
    const l3 = document.getElementById(type + 'AddressLine3')?.value?.trim() || '';
    return [l1, l2, l3].join('\\n').trim();
};

window.renderAddressLines = function(type, valObj) {
    const esc = (v) => String(v ?? "").replace(/</g, "&lt;");
    const val = valObj?.address || '';
    const lines = val.split('\\n');
    return \`
        <div class="space-y-2 mt-1">
            <input id="\${type}AddressLine1" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Street / Building / Area" value="\${esc(lines[0] || '')}" />
            <input id="\${type}AddressLine2" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="City / District" value="\${esc(lines[1] || '')}" />
            <input id="\${type}AddressLine3" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="State / Pincode" value="\${esc(lines[2] || '')}" />
        </div>
    \`;
};

// MarketFlow CRM Dashboard Application`
);

// 2. Client Register Dispatch logic
code = code.replace(
    /const addressEl = document\.getElementById\('clientAddress'\);[\s\S]*?const locUrlEl = document\.getElementById\('clientLocationUrl'\);[\s\S]*?const cpmEl = document\.getElementById\('clientContactPersonMultiple'\);/g,
    `const locUrlEl = document.getElementById('clientLocationUrl');`
);

code = code.replace(
    /address: addressEl\?\.value\?\.trim\(\) \|\| '',\s*locationUrl: locUrlEl\?\.value\?\.trim\(\) \|\| '',\s*contactPersonMultiple: cpmEl\?\.value\?\.trim\(\) \|\| ''/g,
    `address: window.extractAddress('client'),
                    locationUrl: locUrlEl?.value?.trim() || '',
                    contactPersonMultiple: window.extractContacts('client')`
);

// 3. Lead Register Dispatch logic
code = code.replace(
    /const addressEl = document\.getElementById\('leadAddress'\);[\s\S]*?const locUrlEl = document\.getElementById\('leadLocationUrl'\);[\s\S]*?const cpmEl = document\.getElementById\('leadContactPersonMultiple'\);/g,
    `const locUrlEl = document.getElementById('leadLocationUrl');`
);

code = code.replace(
    /address: addressEl\?\.value\?\.trim\(\) \|\| '', locationUrl: locUrlEl\?\.value\?\.trim\(\) \|\| '', contactPersonMultiple: cpmEl\?\.value\?\.trim\(\) \|\| ''/g,
    `address: window.extractAddress('lead'), locationUrl: locUrlEl?.value?.trim() || '', contactPersonMultiple: window.extractContacts('lead')`
);

// 4. Lead UI Render (getLeadRegistration)
code = code.replace(
    /<div class="col-span-1 sm:col-span-2">\s*<label class="block text-sm font-medium text-slate-700">Address<\/label>\s*<textarea id="leadAddress".*?><\/textarea>\s*<\/div>/g,
    `<div class="col-span-1 sm:col-span-2">
                            <label class="block text-sm font-medium text-slate-700">Address (3 lines)</label>
                            \${window.renderAddressLines('lead', leadData)}
                        </div>`
);

code = code.replace(
    /<div class="col-span-1 sm:col-span-2">\s*<label class="block text-sm font-medium text-slate-700">Contact Persons \(Name, Email, Dept\)<\/label>\s*<textarea id="leadContactPersonMultiple".*?><\/textarea>\s*<\/div>/g,
    `<div class="col-span-1 sm:col-span-2">
                            <label class="block text-sm font-medium text-slate-700">Contact Persons</label>
                            <div id="leadContactPersonsList">
                                \${window.renderContactsRows(leadData?.contactPersonMultiple)}
                            </div>
                            <button type="button" onclick="window.addContactRow('lead')" class="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">+ Add Contact</button>
                        </div>`
);

// 5. Client UI Render (getLeadsRegistration)
code = code.replace(
    /<div class="col-span-1 sm:col-span-2">\s*<label class="text-xs font-medium text-slate-600">Address \(3 lines\)<\/label>\s*<textarea id="clientAddress".*?><\/textarea>\s*<\/div>/g,
    `<div class="col-span-1 sm:col-span-2">
                        <label class="text-xs font-medium text-slate-600">Address (3 lines)</label>
                        \${window.renderAddressLines('client', clientData)}
                    </div>`
);

code = code.replace(
    /<div>\s*<label class="text-xs font-medium text-slate-600">Contact Persons \(Name, Email\)<\/label>\s*<textarea id="clientContactPersonMultiple".*?><\/textarea>\s*<\/div>/g,
    `<div class="col-span-1 sm:col-span-2">
                        <label class="text-xs font-medium text-slate-600">Contact Persons</label>
                        <div id="clientContactPersonsList">
                            \${window.renderContactsRows(clientData?.contactPersonMultiple)}
                        </div>
                        <button type="button" onclick="window.addContactRow('client')" class="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">+ Add Contact</button>
                    </div>`
);

code = code.replace(
    /<div>\s*<label class="text-xs font-medium text-slate-600">GST State Code<\/label>\s*<input id="clientGstStateCode" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none" readonly value="\$\{esc\(clientData\?\.gstStateCode \|\| ''\)\}" placeholder="Auto" \/>\s*<\/div>/g,
    `<div>
                        <label class="text-xs font-medium text-slate-600">GST State Select</label>
                        <select id="clientGstStateCode" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" onchange="const gst = document.getElementById('clientGstNumber'); if(this.value && gst) { if(gst.value.length >= 2 && !isNaN(gst.value.substring(0,2))) { gst.value = this.value + gst.value.substring(2); } else { gst.value = this.value + gst.value; } }">
                            <option value="">Select State</option>
                            <option value="33" \${clientData?.gstStateCode === '33' ? 'selected' : ''}>Tamil Nadu (33)</option>
                            <option value="29" \${clientData?.gstStateCode === '29' ? 'selected' : ''}>Karnataka (29)</option>
                            <option value="27" \${clientData?.gstStateCode === '27' ? 'selected' : ''}>Maharashtra (27)</option>
                            <option value="07" \${clientData?.gstStateCode === '07' ? 'selected' : ''}>Delhi (07)</option>
                            <option value="09" \${clientData?.gstStateCode === '09' ? 'selected' : ''}>Uttar Pradesh (09)</option>
                            <option value="24" \${clientData?.gstStateCode === '24' ? 'selected' : ''}>Gujarat (24)</option>
                            <option value="06" \${clientData?.gstStateCode === '06' ? 'selected' : ''}>Haryana (06)</option>
                            <option value="19" \${clientData?.gstStateCode === '19' ? 'selected' : ''}>West Bengal (19)</option>
                            <option value="08" \${clientData?.gstStateCode === '08' ? 'selected' : ''}>Rajasthan (08)</option>
                        </select>
                    </div>`
);

// We should also remove the oninput automatically setting the state if user wanted the dropdown approach instead.
code = code.replace(
    /oninput="document\.getElementById\('clientGstStateCode'\)\.value = this\.value\.substring\(0, 2\);"/g,
    `oninput="const st = document.getElementById('clientGstStateCode'); const val = this.value.substring(0, 2); if(st && !isNaN(val) && val.length === 2 && [...st.options].some(o => o.value===val)) { st.value = val; }"`
);

fs.writeFileSync('client/app.js', code, 'utf8');
console.log("Success");
