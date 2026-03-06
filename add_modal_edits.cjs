const fs = require('fs');
let code = fs.readFileSync('client/app.js', 'utf8');

const additionalModals = `
    editLeadViaModal(lead) {
        const l = lead || {};
        const id = String(l.id || '').trim();
        if (!id) {
            this.showToast('Select a lead first.');
            return;
        }

        const esc = (v) => String(v ?? '').replace(/</g, '&lt;');

        this.openModal('Edit Lead', \`
            <div>
                <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Company Name</label>
                <input name="company" required style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="\${esc(l.company || '')}" />
            </div>
            <div style="display:grid;grid-template-columns:1fr;gap:10px;" class="sm-grid-2col">
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Contact</label>
                    <input name="contact" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="\${esc(l.contact || '')}" />
                </div>
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Assigned To</label>
                    <input name="assignedTo" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="\${esc(l.assignedTo || '')}" />
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr;gap:10px;" class="sm-grid-2col">
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Source</label>
                    <select name="source" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;">
                        <option value="Exhibition" \${(l.source==='Exhibition')?'selected':''}>Exhibition</option>
                        <option value="IndiaMART" \${(l.source==='IndiaMART')?'selected':''}>IndiaMART</option>
                        <option value="LinkedIn" \${(l.source==='LinkedIn')?'selected':''}>LinkedIn</option>
                        <option value="Field Visit" \${(l.source==='Field Visit')?'selected':''}>Field Visit</option>
                        <option value="Referral" \${(l.source==='Referral')?'selected':''}>Referral</option>
                    </select>
                </div>
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Stage</label>
                    <input name="stage" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="\${esc(l.stage || 'New Lead')}" />
                </div>
            </div>
            <input type="hidden" name="id" value="\${esc(id)}" />
        \`, {
            submitLabel: 'Save Changes',
            onSubmit: (form) => {
                const data = new FormData(form);
                const nextCompany = String(data.get('company') || '').trim();
                if (!nextCompany) {
                    this.showToast('Company name is required.');
                    return;
                }
                const res = this.saveLead({
                    id: data.get('id'),
                    company: nextCompany,
                    contact: data.get('contact'),
                    assignedTo: data.get('assignedTo'),
                    source: data.get('source'),
                    stage: data.get('stage')
                });
                if (!res.ok) {
                    this.showToast(res.message || 'Unable to update lead.');
                    return;
                }
                this.closeModal();
                this.renderContent();
                this.initializeLucideIcons();
                this.showToast('Lead updated.');
            }
        });
    }

    editProjectViaModal(project) {
        const p = project || {};
        const key = this.getProjectKey(p);
        if (!key) {
            this.showToast('Select a project first.');
            return;
        }

        const esc = (v) => String(v ?? '').replace(/</g, '&lt;');

        this.openModal('Edit Project', \`
            <div>
                <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Project Name / Code</label>
                <input name="name" required style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="\${esc(p.name || p.identification?.projectCode || '')}" />
            </div>
            <div style="display:grid;grid-template-columns:1fr;gap:10px;" class="sm-grid-2col">
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Client</label>
                    <input name="client" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="\${esc(p.client || '')}" />
                </div>
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Start Date</label>
                    <input name="startDate" type="date" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="\${esc(p.startDate || '')}" />
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr;gap:10px;" class="sm-grid-2col">
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Budget</label>
                    <input name="budget" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="\${esc(p.budget || '')}" />
                </div>
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Owner</label>
                    <input name="owner" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="\${esc(p.owner || '')}" />
                </div>
            </div>
            <div>
                <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Details</label>
                <textarea name="details" rows="3" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;">\${esc(p.details || '')}</textarea>
            </div>
            <input type="hidden" name="key" value="\${esc(key)}" />
        \`, {
            submitLabel: 'Save Changes',
            onSubmit: (form) => {
                const data = new FormData(form);
                const nextName = String(data.get('name') || '').trim();
                if (!nextName) {
                    this.showToast('Project name is required.');
                    return;
                }
                
                const oldKey = data.get('key');
                let existing = this.getAllProjectsMerged([]);
                let projIndex = existing.findIndex(x => this.getProjectKey(x) === oldKey);
                
                if (projIndex !== -1) {
                    existing[projIndex] = {
                        ...existing[projIndex],
                        name: nextName,
                        client: data.get('client'),
                        startDate: data.get('startDate'),
                        budget: data.get('budget'),
                        owner: data.get('owner'),
                        details: data.get('details')
                    };
                    if (existing[projIndex].identification) {
                       existing[projIndex].identification.projectCode = nextName;
                    }
                    this.writeStore('bezent_projects_merged', existing);
                }
                
                this.closeModal();
                this.renderContent();
                this.initializeLucideIcons();
                this.showToast('Project updated.');
            }
        });
    }
`;

code = code.replace(
    /deleteClientViaModal\(name\) {/,
    additionalModals + '\n\n    deleteClientViaModal(name) {'
);

// Now rewrite the handlers in handleAction
const editActionHandlers = `
            if (a === 'client:edit') {
                const btn = this._lastActionButton;
                const clientName = btn?.dataset?.clientName;
                const clients = this.getClientsData();
                const c = clients.find(x => String(x?.name || '').trim() === String(clientName || '').trim());
                this.editClientViaModal(c || { name: clientName });
                return true;
            }

            if (a === 'lead:edit') {
                const btn = this._lastActionButton;
                const leadId = btn?.dataset?.leadId;
                const leads = this.getStoredLeads();
                const l = leads.find(x => String(x.id) === String(leadId));
                this.editLeadViaModal(l);
                return true;
            }

            if (a.startsWith('project:edit:')) {
                const key = a.slice('project:edit:'.length).replace(/&quot;/g, '"');
                const projects = this.getAllProjectsMerged([]);
                const p = projects.find(x => String(this.getProjectKey(x)) === key);
                this.editProjectViaModal(p);
                return true;
            }
`;

// Remove existing lead:edit block
code = code.replace(/if \(a === 'lead:edit'\) \{[\s\S]*?return true;\s*\r?\n\s*\}/, '');

// Remove existing client:edit block
code = code.replace(/if \(a === 'client:edit'\) \{[\s\S]*?return true;\s*\r?\n\s*\}/, '');

// Remove existing project:edit block
code = code.replace(/if \(a\.startsWith\('project:edit:'\)\) \{[\s\S]*?return true;\s*\r?\n\s*\}/, '');

// Inject the new merged blocks above client:delete
code = code.replace(/if \(a === 'client:delete'\) \{/, editActionHandlers.trim() + '\n            if (a === \'client:delete\') {');

fs.writeFileSync('client/app.js', code, 'utf8');
