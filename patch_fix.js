import fs from 'fs';
let lines = fs.readFileSync('client/app.js', 'utf8').split('\\n');

let changes = 0;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id="leadAddress"')) {
     lines[i] = \`                            <label class="block text-sm font-medium text-slate-700">Address (3 lines)</label>
                            \\\${window.renderAddressLines('lead', leadData)}\`;
     lines[i-1] = '';
     lines[i+1] = '';
     changes++;
  }
  
  if (lines[i].includes('id="leadContactPersonMultiple"')) {
     lines[i] = \`                            <label class="block text-sm font-medium text-slate-700">Contact Persons</label>
                            <div id="leadContactPersonsList">
                                \\\${window.renderContactsRows(leadData?.contactPersonMultiple)}
                            </div>
                            <button type="button" onclick="window.addContactRow('lead')" class="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">+ Add Contact Person</button>\`;
     lines[i-1] = '';
     lines[i+1] = '';
     changes++;
  }

  if (lines[i].includes('id="clientAddress"') && lines[i].includes('textarea')) {
     lines[i] = \`                        <label class="text-xs font-medium text-slate-600">Address (3 lines)</label>
                        \\\${window.renderAddressLines('client', clientData)}\`;
     lines[i-1] = '';
     lines[i+1] = '';
     changes++;
  }

  if (lines[i].includes('id="clientContactPersonMultiple"')) {
     lines[i] = \`                        <label class="text-xs font-medium text-slate-600">Contact Persons</label>
                        <div id="clientContactPersonsList">
                            \\\${window.renderContactsRows(clientData?.contactPersonMultiple)}
                        </div>
                        <button type="button" onclick="window.addContactRow('client')" class="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">+ Add Contact Person</button>\`;
     lines[i-1] = '';
     lines[i+1] = '';
     changes++;
  }

  if (lines[i].includes('id="clientGstStateCode"')) {
     // Ensure we match the readonly state code input
     if (lines[i].includes('readonly')) {
         lines[i] = \`                        <label class="text-xs font-medium text-slate-600">GST State Select</label>
                        <select id="clientGstStateCode" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" onchange="const gst = document.getElementById('clientGstNumber'); if(this.value && gst) { if(gst.value.length >= 2 && !isNaN(gst.value.substring(0,2))) { gst.value = this.value + gst.value.substring(2); } else { gst.value = this.value + gst.value; } }">
                            <option value="">Select State</option>
                            <option value="33" \\\${clientData?.gstStateCode === '33' ? 'selected' : ''}>Tamil Nadu (33)</option>
                            <option value="29" \\\${clientData?.gstStateCode === '29' ? 'selected' : ''}>Karnataka (29)</option>
                            <option value="27" \\\${clientData?.gstStateCode === '27' ? 'selected' : ''}>Maharashtra (27)</option>
                            <option value="07" \\\${clientData?.gstStateCode === '07' ? 'selected' : ''}>Delhi (07)</option>
                            <option value="09" \\\${clientData?.gstStateCode === '09' ? 'selected' : ''}>Uttar Pradesh (09)</option>
                            <option value="24" \\\${clientData?.gstStateCode === '24' ? 'selected' : ''}>Gujarat (24)</option>
                            <option value="06" \\\${clientData?.gstStateCode === '06' ? 'selected' : ''}>Haryana (06)</option>
                            <option value="19" \\\${clientData?.gstStateCode === '19' ? 'selected' : ''}>West Bengal (19)</option>
                            <option value="08" \\\${clientData?.gstStateCode === '08' ? 'selected' : ''}>Rajasthan (08)</option>
                        </select>\`;
         lines[i-1] = '';
         lines[i+1] = '';
         changes++;
     }
  }

  if (lines[i].includes("oninput=\\\"document.getElementById('clientGstStateCode').value = this.value.substring(0, 2);\\\"")) {
     lines[i] = lines[i].replace("oninput=\\\"document.getElementById('clientGstStateCode').value = this.value.substring(0, 2);\\\"", 
     "oninput=\\\"const st = document.getElementById('clientGstStateCode'); const val = this.value.substring(0, 2); if(st && !isNaN(val) && val.length === 2 && [...st.options].some(o => o.value===val)) { st.value = val; }\\\"");
     changes++;
  }
}

fs.writeFileSync('client/app.js', lines.join('\\n'), 'utf8');
console.log('Total UI modifications made:', changes);
