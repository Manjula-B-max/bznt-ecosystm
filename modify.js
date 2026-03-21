import fs from 'fs';
let code = fs.readFileSync('client/app.js', 'utf8');
const lines = code.split('\\n');

function insertAfter(searchStr, injectStr) {
   for(let i=0; i<lines.length; i++) {
      if(lines[i].includes(searchStr)) {
         lines.splice(i+1, 0, injectStr);
         return true;
      }
   }
   return false;
}

function replaceBetween(startStr, endStr, replaceLines) {
   let startIdx = -1;
   let endIdx = -1;
   for(let i=0; i<lines.length; i++) {
      if(lines[i].includes(startStr)) startIdx = i;
      if(startIdx !== -1 && i > startIdx && lines[i].includes(endStr)) {
         endIdx = i;
         break;
      }
   }
   if(startIdx !== -1 && endIdx !== -1) {
      lines.splice(startIdx, endIdx - startIdx + 1, ...replaceLines);
      return true;
   }
   return false;
}

console.log("Replacing globals:", insertAfter('// MarketFlow CRM Dashboard Application', 
\`window.addContactRow = function(type) {
    const list = document.getElementById(type + 'ContactPersonsList');
    if (!list) return;
    const div = document.createElement('div');
    div.className = 'grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 contact-person-row mt-2 items-center';
    div.innerHTML = \\\`<input type="text" class="cp-name border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Name" />
        <input type="email" class="cp-email border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Email" />
        <input type="text" class="cp-dept border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Dept" />
        <button type="button" onclick="this.parentElement.remove()" class="px-2 flex text-sm text-rose-500 hover:bg-rose-50 rounded-lg font-medium" title="Remove">✕</button>\\\`;
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
        if(n || e || d) res.push(\\\`\\$\{n} | \\$\{e} | \\$\{d}\\\`);
    });
    return res.join('\\\\n');
};
window.renderContactsRows = function(val) {
    if (!val) return '';
    const esc = (v) => String(v ?? "").replace(/</g, "&lt;");
    return String(val).split('\\\\n').map(line => {
        const parts = line.split('|').map(s => s.trim());
        const n = parts[0] || '';
        const e = parts[1] || '';
        const d = parts[2] || '';
        return \\\`<div class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 contact-person-row mt-2 items-center">
            <input type="text" class="cp-name border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Name" value="\\\${esc(n)}" />
            <input type="email" class="cp-email border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Email" value="\\\${esc(e)}" />
            <input type="text" class="cp-dept border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Dept" value="\\\${esc(d)}" />
            <button type="button" onclick="this.parentElement.remove()" class="px-2 flex text-sm text-rose-500 hover:bg-rose-50 rounded-lg font-medium" title="Remove">✕</button>
        </div>\\\`;
    }).join('');
};
window.extractAddress = function(type) {
    const l1 = document.getElementById(type + 'AddressLine1')?.value?.trim() || '';
    const l2 = document.getElementById(type + 'AddressLine2')?.value?.trim() || '';
    const l3 = document.getElementById(type + 'AddressLine3')?.value?.trim() || '';
    if (!l1 && !l2 && !l3) return '';
    return [l1, l2, l3].join('\\\\n').trim();
};
window.renderAddressLines = function(type, valObj) {
    const esc = (v) => String(v ?? "").replace(/</g, "&lt;");
    const val = valObj?.address || '';
    const lines = val.split('\\\\n');
    return \\\`<div class="space-y-2 mt-1">
            <input id="\\\${type}AddressLine1" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Street / Building / Area" value="\\\${esc(lines[0] || '')}" />
            <input id="\\\${type}AddressLine2" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="City / District" value="\\\${esc(lines[1] || '')}" />
            <input id="\\\${type}AddressLine3" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="State / Pincode" value="\\\${esc(lines[2] || '')}" />
        </div>\\\`;
};\`.split('\\n')));

// Action dispatcher edits
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("const cpmEl = document.getElementById('clientContactPersonMultiple');")) {
      lines[i] = "                const cpmEl = null;";
  }
  if (lines[i].includes("address: addressEl?.value?.trim() || '',")) {
      lines[i] = lines[i].replace("address: addressEl?.value?.trim() || '',", "address: window.extractAddress('client'),");
  }
  if (lines[i].includes("contactPersonMultiple: cpmEl?.value?.trim() || ''")) {
      lines[i] = lines[i].replace("contactPersonMultiple: cpmEl?.value?.trim() || ''", "contactPersonMultiple: window.extractContacts('client')");
  }

  if (lines[i].includes("const cpmEl = document.getElementById('leadContactPersonMultiple');")) {
      lines[i] = "                const cpmEl = null;";
  }
  if (lines[i].includes("address: addressEl?.value?.trim() || '',")) {
      lines[i] = lines[i].replace("address: addressEl?.value?.trim() || '',", "address: window.extractAddress('lead'),");
  }
  if (lines[i].includes("contactPersonMultiple: cpmEl?.value?.trim() || ''")) {
      lines[i] = lines[i].replace("contactPersonMultiple: cpmEl?.value?.trim() || ''", "contactPersonMultiple: window.extractContacts('lead')");
  }
}

// Client UI Replacements
replaceBetween('<label class="text-xs font-medium text-slate-600">Address (3 lines)</label>', '</textarea>',
[
\`                        <label class="text-xs font-medium text-slate-600">Address (3 lines)</label>
                        \\\${window.renderAddressLines('client', clientData)}\`
]);

replaceBetween('<label class="text-xs font-medium text-slate-600">Contact Persons (Name, Email)</label>', '</textarea>',
[
\`                        <label class="text-xs font-medium text-slate-600">Contact Persons (Name, Email, Dept)</label>
                        <div id="clientContactPersonsList">
                            \\\${window.renderContactsRows(clientData?.contactPersonMultiple)}
                        </div>
                        <button type="button" onclick="window.addContactRow('client')" class="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center">
                            <i data-lucide="plus" style="width:14px;height:14px;" class="mr-1"></i> Add Contact Person
                        </button>\`
]);

replaceBetween('<label class="text-xs font-medium text-slate-600">GST State Code</label>', 'readonly',
[
\`                        <label class="text-xs font-medium text-slate-600">GST State Selection</label>
                        <select id="clientGstStateCode" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" onchange="const gst = document.getElementById('clientGstNumber'); if(this.value && gst) { if(gst.value.length >= 2 && !isNaN(gst.value.substring(0,2))) { gst.value = this.value + gst.value.substring(2); } else { gst.value = this.value + gst.value; } }">
                            <option value="">Select State</option>
                            <option value="33" \\\${clientData?.gstStateCode === '33' ? 'selected' : ''}>Tamil Nadu (33)</option>
                            <option value="29" \\\${clientData?.gstStateCode === '29' ? 'selected' : ''}>Karnataka (29)</option>
                            <option value="27" \\\${clientData?.gstStateCode === '27' ? 'selected' : ''}>Maharashtra (27)</option>
                            <option value="07" \\\${clientData?.gstStateCode === '07' ? 'selected' : ''}>Delhi (07)</option>
                        </select>
                        <input id="clientGstStateHidden" type="hidden" \`
]);

for(let i=0; i<lines.length; i++){
    if(lines[i].includes("oninput=\"document.getElementById('clientGstStateCode').value = this.value.substring(0, 2);\"")) {
       lines[i] = lines[i].replace("oninput=\"document.getElementById('clientGstStateCode').value = this.value.substring(0, 2);\"", 
       "oninput=\"const st = document.getElementById('clientGstStateCode'); const val = this.value.substring(0, 2); if(st && !isNaN(val) && val.length === 2 && [...st.options].some(o => o.value===val)) { st.value = val; }\"");
    }
}

// Lead UI Replacements
replaceBetween('<label class="block text-sm font-medium text-slate-700">Address</label>', '</textarea>',
[
\`                            <label class="block text-sm font-medium text-slate-700">Address (3 lines)</label>
                            \\\${window.renderAddressLines('lead', leadData)}\`
]);

replaceBetween('<label class="block text-sm font-medium text-slate-700">Contact Persons (Name, Email, Dept)</label>', '</textarea>',
[
\`                            <label class="block text-sm font-medium text-slate-700">Contact Persons</label>
                            <div id="leadContactPersonsList">
                                \\\${window.renderContactsRows(leadData?.contactPersonMultiple)}
                            </div>
                            <button type="button" onclick="window.addContactRow('lead')" class="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center">
                                <i data-lucide="plus" style="width:14px;height:14px;" class="mr-1"></i> Add Contact Person
                            </button>\`
]);

fs.writeFileSync('client/app.js', lines.join('\\n'), 'utf8');
console.log('done modifying');
