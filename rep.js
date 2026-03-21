import fs from 'fs';
let code = fs.readFileSync('client/app.js', 'utf8');

const strLeadAddress = \`<div class="col-span-1 sm:col-span-2">
                            <label class="block text-sm font-medium text-slate-700">Address</label>
                            <textarea id="leadAddress" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" rows="3" placeholder="Full address">\${esc(leadData?.address || '')}</textarea>
                        </div>\`;

const repLeadAddress = \`<div class="col-span-1 sm:col-span-2">
                            <label class="block text-sm font-medium text-slate-700">Address (3 lines)</label>
                            \${window.renderAddressLines('lead', leadData)}
                        </div>\`;

const strLeadContact = \`<div class="col-span-1 sm:col-span-2">
                            <label class="block text-sm font-medium text-slate-700">Contact Persons (Name, Email, Dept)</label>
                            <textarea id="leadContactPersonMultiple" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" rows="3" placeholder="John, john@acme.com, Marketing&#10;Jane, jane@acme.com, Tech">\${esc(leadData?.contactPersonMultiple || '')}</textarea>
                        </div>\`;

const repLeadContact = \`<div class="col-span-1 sm:col-span-2">
                            <label class="block text-sm font-medium text-slate-700">Contact Persons</label>
                            <div id="leadContactPersonsList">
                                \${window.renderContactsRows(leadData?.contactPersonMultiple)}
                            </div>
                            <button type="button" onclick="window.addContactRow('lead')" class="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">+ Add Contact Person</button>
                        </div>\`;

const strClientAddress = \`<div class="col-span-1 sm:col-span-2">
                        <label class="text-xs font-medium text-slate-600">Address (3 lines)</label>
                        <textarea id="clientAddress" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" rows="3" placeholder="Line 1&#10;Line 2&#10;Line 3">\${esc(clientData?.address || '')}</textarea>
                    </div>\`;

const repClientAddress = \`<div class="col-span-1 sm:col-span-2">
                        <label class="text-xs font-medium text-slate-600">Address (3 lines)</label>
                        \${window.renderAddressLines('client', clientData)}
                    </div>\`;

const strClientContact = \`<div>
                        <label class="text-xs font-medium text-slate-600">Contact Persons (Name, Email)</label>
                        <textarea id="clientContactPersonMultiple" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" rows="2" placeholder="Jane Doe, jane@email.com">\${esc(clientData?.contactPersonMultiple || '')}</textarea>
                    </div>\`;

const repClientContact = \`<div class="col-span-1 sm:col-span-2">
                        <label class="text-xs font-medium text-slate-600">Contact Persons</label>
                        <div id="clientContactPersonsList">
                            \${window.renderContactsRows(clientData?.contactPersonMultiple)}
                        </div>
                        <button type="button" onclick="window.addContactRow('client')" class="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">+ Add Contact Person</button>
                    </div>\`;

const strClientGst = \`<div>
                        <label class="text-xs font-medium text-slate-600">GST State Code</label>
                        <input id="clientGstStateCode" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none" readonly value="\${esc(clientData?.gstStateCode || '')}" placeholder="Auto" />
                    </div>\`;

const repClientGst = \`<div>
                        <label class="text-xs font-medium text-slate-600">GST State Select</label>
                        <select id="clientGstStateCode" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" onchange="const gst = document.getElementById('clientGstNumber'); if(this.value && gst) { if(gst.value.length >= 2 && !isNaN(gst.value.substring(0,2))) { gst.value = this.value + gst.value.substring(2); } else { gst.value = this.value + gst.value; } }">
                            <option value="">Select State</option>
                            <option value="33" \${clientData?.gstStateCode === '33' ? 'selected' : ''}>Tamil Nadu (33)</option>
                            <option value="29" \${clientData?.gstStateCode === '29' ? 'selected' : ''}>Karnataka (29)</option>
                            <option value="27" \${clientData?.gstStateCode === '27' ? 'selected' : ''}>Maharashtra (27)</option>
                            <option value="07" \${clientData?.gstStateCode === '07' ? 'selected' : ''}>Delhi (07)</option>
                        </select>
                    </div>\`;

let oldCode = code;

// Using string replace with literal matching avoiding formatting issues if we use the exact substring approach
// Wait! If the platform changed \r\n to \n we must be careful.
// Let's normalize everything to \n first for consistent matching.
code = code.replace(/\\r\\n/g, '\\n');
// Also normalise my target strings
const normalize = (s) => s.replace(/\\r\\n/g, '\\n');

if (code.includes(normalize(strLeadAddress))) {
    code = code.replace(normalize(strLeadAddress), normalize(repLeadAddress));
    console.log("Success: leadAddress");
} else console.log("Fail: leadAddress");

if (code.includes(normalize(strLeadContact))) {
    code = code.replace(normalize(strLeadContact), normalize(repLeadContact));
    console.log("Success: leadContact");
} else console.log("Fail: leadContact");

if (code.includes(normalize(strClientAddress))) {
    code = code.replace(normalize(strClientAddress), normalize(repClientAddress));
    console.log("Success: clientAddress");
} else console.log("Fail: clientAddress");

if (code.includes(normalize(strClientContact))) {
    code = code.replace(normalize(strClientContact), normalize(repClientContact));
    console.log("Success: clientContact");
} else console.log("Fail: clientContact");

if (code.includes(normalize(strClientGst))) {
    code = code.replace(normalize(strClientGst), normalize(repClientGst));
    console.log("Success: clientGst");
} else console.log("Fail: clientGst");

// Remove the old oninput trick on gst Number
code = code.replace(
    \`oninput="document.getElementById('clientGstStateCode').value = this.value.substring(0, 2);"\`,
    \`oninput="const st = document.getElementById('clientGstStateCode'); const val = this.value.substring(0, 2); if(st && !isNaN(val) && val.length === 2 && [...st.options].some(o => o.value===val)) { st.value = val; }"\`
);

fs.writeFileSync('client/app.js', code, 'utf8');
