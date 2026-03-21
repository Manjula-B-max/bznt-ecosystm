import fs from 'fs';

let code = fs.readFileSync('client/app.js', 'utf8');

const regexes = [
  {
    regex: /}\)\(\);\s*\/\/\s*MarketFlow CRM Dashboard Application/g,
    repl: `})();

window.addContactRow = function(type) {
    const list = document.getElementById(type + 'ContactPersonsList');
    if (!list) return;
    const div = document.createElement('div');
    div.className = 'grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 contact-person-row mt-2 items-center';
    div.innerHTML = \`
        <input type="text" class="cp-name border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Name" />
        <input type="email" class="cp-email border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Email" />
        <input type="text" class="cp-dept border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Dept" />
        <button type="button" onclick="this.parentElement.remove()" class="px-2 py-2 flex text-sm text-rose-500 hover:bg-rose-50 rounded-lg font-medium" title="Remove">✕</button>\`;
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
        return \`<div class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 contact-person-row mt-2 items-center">
            <input type="text" class="cp-name border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Name" value="\${esc(n)}" />
            <input type="email" class="cp-email border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Email" value="\${esc(e)}" />
            <input type="text" class="cp-dept border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Dept" value="\${esc(d)}" />
            <button type="button" onclick="this.parentElement.remove()" class="px-2 py-2 flex text-sm text-rose-500 hover:bg-rose-50 rounded-lg font-medium" title="Remove">✕</button>
        </div>\`;
    }).join('');
};

window.extractAddress = function(type) {
    const l1 = document.getElementById(type + 'AddressLine1')?.value?.trim() || '';
    const l2 = document.getElementById(type + 'AddressLine2')?.value?.trim() || '';
    const l3 = document.getElementById(type + 'AddressLine3')?.value?.trim() || '';
    if (!l1 && !l2 && !l3) return '';
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
            <input id="\${type}AddressLine3" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="State & Pincode" value="\${esc(lines[2] || '')}" />
        </div>\`;
};

// MarketFlow CRM Dashboard Application`
  },
  {
    regex: /const indSizeEl[\s\S]*?const cpmEl = document\.getElementById\('clientContactPersonMultiple'\);/g,
    repl: `const indSizeEl = document.getElementById('clientIndustrySize');
                const gstNumEl = document.getElementById('clientGstNumber');
                const gstStateEl = document.getElementById('clientGstStateCode');
                const locUrlEl = document.getElementById('clientLocationUrl');`
  },
  {
    regex: /city:\s*'—',[\s\S]*?contactPersonMultiple:\s*cpmEl\?\.value\?\.trim\(\)\s*\|\|\s*''/g,
    repl: `city: '—',
                    industrySize: indSizeEl?.value?.trim() || '',
                    gstNumber: gstNumEl?.value?.trim() || '',
                    gstStateCode: gstStateEl?.value?.trim() || '',
                    address: window.extractAddress('client'),
                    locationUrl: locUrlEl?.value?.trim() || '',
                    contactPersonMultiple: window.extractContacts('client')`
  },
  {
    regex: /const nextAction\s*=\s*document\.getElementById\('leadNextAction'\)\?\.value\?\.trim\(\)\s*\|\|\s*'Follow-up';[\s\S]*?const cpmEl = document\.getElementById\('leadContactPersonMultiple'\);/g,
    repl: `const nextAction = document.getElementById('leadNextAction')?.value?.trim() || 'Follow-up';
                const emailEl = document.getElementById('leadEmail');
                const locUrlEl = document.getElementById('leadLocationUrl');`
  },
  {
    regex: /stage:\s*'New Lead',\s*feedbackStatus:\s*'Pending',\s*email:\s*emailEl\?\.value[\s\S]*?contactPersonMultiple:\s*cpmEl\?\.value\?\.trim\(\)\s*\|\|\s*''\s*}\);/g,
    repl: `stage: 'New Lead', feedbackStatus: 'Pending', email: emailEl?.value?.trim() || '', address: window.extractAddress('lead'), locationUrl: locUrlEl?.value?.trim() || '', contactPersonMultiple: window.extractContacts('lead') });`
  },
  {
    regex: /<div class="col-span-1 sm:col-span-2">\s*<label class="block text-sm font-medium text-slate-700">Address<\/label>\s*<textarea id="leadAddress".*?><\/textarea>\s*<\/div>/g,
    repl: `<div class="col-span-1 sm:col-span-2">
                            <label class="block text-sm font-medium text-slate-700">Address (3 lines)</label>
                            \${window.renderAddressLines('lead', leadData)}
                        </div>`
  },
  {
    regex: /<div class="col-span-1 sm:col-span-2">\s*<label class="block text-sm font-medium text-slate-700">Contact Persons \(Name, Email, Dept\)<\/label>\s*<textarea id="leadContactPersonMultiple".*?><\/textarea>\s*<\/div>/g,
    repl: `<div class="col-span-1 sm:col-span-2">
                            <label class="block text-sm font-medium text-slate-700">Contact Persons (Name, Email, Dept)</label>
                            <div id="leadContactPersonsList">
                                \${window.renderContactsRows(leadData?.contactPersonMultiple)}
                            </div>
                            <button type="button" onclick="window.addContactRow('lead')" class="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">+ Add Contact</button>
                        </div>`
  },
  {
    regex: /<div class="col-span-1 sm:col-span-2">\s*<label class="text-xs font-medium text-slate-600">Address \(3 lines\)<\/label>\s*<textarea id="clientAddress".*?><\/textarea>\s*<\/div>/g,
    repl: `<div class="col-span-1 sm:col-span-2">
                        <label class="text-xs font-medium text-slate-600">Address (3 lines)</label>
                        \${window.renderAddressLines('client', clientData)}
                    </div>`
  },
  {
    regex: /<div>\s*<label class="text-xs font-medium text-slate-600">Contact Persons \(Name, Email\)<\/label>\s*<textarea id="clientContactPersonMultiple".*?><\/textarea>\s*<\/div>/g,
    repl: `<div class="col-span-1 sm:col-span-2">
                        <label class="text-xs font-medium text-slate-600">Contact Persons (Name, Email, Dept)</label>
                        <div id="clientContactPersonsList">
                            \${window.renderContactsRows(clientData?.contactPersonMultiple)}
                        </div>
                        <button type="button" onclick="window.addContactRow('client')" class="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">+ Add Contact</button>
                    </div>`
  },
  {
    regex: /<div>\s*<label class="text-xs font-medium text-slate-600">GST State Code<\/label>\s*<input id="clientGstStateCode".*?readonly.*?><\/div>/g,
    repl: `<div>
                        <label class="text-xs font-medium text-slate-600">GST State Code Selection</label>
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
  },
  {
    regex: /oninput="document\.getElementById\('clientGstStateCode'\)\.value\s*=\s*this\.value\.substring\((.*)\);"/g,
    repl: `oninput="const st = document.getElementById('clientGstStateCode'); const val = this.value.substring(0, 2); if(st && !isNaN(val) && val.length === 2 && [...st.options].some(o => o.value===val)) { st.value = val; }"`
  }
];

let replaced = 0;
for (const r of regexes) {
  const match = code.match(r.regex);
  if (match) {
    code = code.replace(r.regex, r.repl);
    replaced++;
  } else {
    console.error('FAILED TO MATCH:', r.regex);
  }
}

fs.writeFileSync('client/app.js', code, 'utf8');
console.log('Total successful replacements:', replaced);

const checks = [
  { item: 'addContactRow = function', found: code.includes('addContactRow = function') },
  { item: 'extractAddress = function', found: code.includes('extractAddress = function') },
  { item: 'leadContactPersonsList', found: code.includes('leadContactPersonsList') },
  { item: 'clientContactPersonsList', found: code.includes('clientContactPersonsList') },
  { item: 'clientGstStateCode', found: code.includes('<select id="clientGstStateCode"') },
  { item: 'extractAddress("lead")', found: code.includes('extractAddress(\'lead\')') }
];
console.log(JSON.stringify(checks, null, 2));

