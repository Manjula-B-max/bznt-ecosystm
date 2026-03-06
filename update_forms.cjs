const fs = require('fs');
let code = fs.readFileSync('client/app.js', 'utf8');

// Update getLeadRegistration
code = code.replace(
    /getLeadRegistration\(\) \{/,
    'getLeadRegistration(leadData = null) {\n        const esc = (v) => String(v ?? "").replace(/</g, "&lt;");'
).replace(
    /<button data-action="lead:register" class="(.*?)">Save Lead<\/button>/,
    `<button data-action="\${leadData ? \`lead:update:\${leadData.id}\` : 'lead:register'}" class="$1">\${leadData ? 'Update Lead' : 'Save Lead'}</button>`
).replace(
    /<select id="leadSource" class="(.*?)">\s*<option>Exhibition<\/option>\s*<option>IndiaMART<\/option>\s*<option selected>LinkedIn<\/option>\s*<option>Field Visit<\/option>\s*<option>Referral<\/option>\s*<\/select>/,
    `<select id="leadSource" class="$1">
                                <option \${leadData?.source === 'Exhibition' ? 'selected' : ''}>Exhibition</option>
                                <option \${leadData?.source === 'IndiaMART' ? 'selected' : ''}>IndiaMART</option>
                                <option \${(!leadData || leadData?.source === 'LinkedIn') ? 'selected' : ''}>LinkedIn</option>
                                <option \${leadData?.source === 'Field Visit' ? 'selected' : ''}>Field Visit</option>
                                <option \${leadData?.source === 'Referral' ? 'selected' : ''}>Referral</option>
                            </select>`
).replace(
    /id="leadAssignedTo" type="text" class="(.*?)" placeholder="e.g., Team Member" \/>/,
    `id="leadAssignedTo" type="text" class="$1" placeholder="e.g., Team Member" value="\${esc(leadData?.assignedTo || '')}" />`
).replace(
    /id="leadCompany" type="text" class="(.*?)" placeholder="e.g., Acme Corp" \/>/,
    `id="leadCompany" type="text" class="$1" placeholder="e.g., Acme Corp" value="\${esc(leadData?.company || '')}" />`
).replace(
    /id="leadContact" type="text" class="(.*?)" placeholder="Phone \/ Email" \/>/,
    `id="leadContact" type="text" class="$1" placeholder="Phone / Email" value="\${esc(leadData?.contact || '')}" />`
);


// Update getLeadsRegistration (which is Client Registration)
code = code.replace(
    /getLeadsRegistration\(\) \{/,
    'getLeadsRegistration(clientData = null) {\n        const esc = (v) => String(v ?? "").replace(/</g, "&lt;");'
).replace(
    /<button data-action="client:register" class="(.*?)">Save Client<\/button>/,
    `<button data-action="\${clientData ? \`client:update:\${clientData.name.replace(/\\"/g,'&quot;')}\` : 'client:register'}" class="$1">\${clientData ? 'Update Client' : 'Save Client'}</button>`
).replace(
    /id="clientName" type="text" class="(.*?)" placeholder="e.g., Acme Corp" \/>/,
    `id="clientName" type="text" class="$1" placeholder="e.g., Acme Corp" value="\${esc(clientData?.name || '')}" \${clientData ? 'disabled style="background:#f1f5f9;cursor:not-allowed;"' : ''} />`
).replace(
    /id="clientPhone" type="text" class="(.*?)" placeholder="\\+1 234 567 8900" \/>/,
    `id="clientPhone" type="text" class="$1" placeholder="+1 234 567 8900" value="\${esc(clientData?.phone || '')}" />`
).replace(
    /id="clientEmail" type="text" class="(.*?)" placeholder="contact@acme.com" \/>/,
    `id="clientEmail" type="text" class="$1" placeholder="contact@acme.com" value="\${esc(clientData?.email || '')}" />`
).replace(
    /id="clientCity" type="text" class="(.*?)" placeholder="e.g., New York" \/>/,
    `id="clientCity" type="text" class="$1" placeholder="e.g., New York" value="\${esc(clientData?.city || '')}" />`
).replace(
    /id="clientIndustry" type="text" class="(.*?)" placeholder="e.g., Manufacturing" \/>/,
    `id="clientIndustry" type="text" class="$1" placeholder="e.g., Manufacturing" value="\${esc(clientData?.industry || '')}" />`
).replace(
    /id="clientOwner" type="text" class="(.*?)" placeholder="e.g., John Doe" \/>/,
    `id="clientOwner" type="text" class="$1" placeholder="e.g., John Doe" value="\${esc(clientData?.owner || '')}" />`
).replace(
    /id="clientGstin" type="text" class="(.*?)" placeholder="29XXXXX0000X1Z5" \/>/,
    `id="clientGstin" type="text" class="$1" placeholder="29XXXXX0000X1Z5" value="\${esc(clientData?.gstin || '')}" />`
).replace(
    /id="clientAddress" name="clientAddress" rows="3" class="(.*?)"><\/textarea>/,
    `id="clientAddress" name="clientAddress" rows="3" class="$1">\${esc(clientData?.address || '')}</textarea>`
);


// Now inject the new handlers for lead:edit, lead:delete, client:edit into app.js handleAction...
// Let's do it using multi_replace_file_content afterwards. For now, save just the UI updates.

fs.writeFileSync('client/app.js', code, 'utf8');
