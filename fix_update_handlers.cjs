const fs = require('fs');
let code = fs.readFileSync('client/app.js', 'utf8');

// Update lead:update handler
const leadUpdateNew = `
            if (a.startsWith('lead:update:')) {
                const id = a.slice('lead:update:'.length);
                const company = document.getElementById('leadCompany')?.value?.trim();
                const assignedTo = document.getElementById('leadAssignedTo')?.value?.trim();
                const contact = document.getElementById('leadContact')?.value?.trim();
                const source = document.getElementById('leadSource')?.value?.trim() || 'LinkedIn';
                
                if (!company) {
                    this.showToast('Company is required.');
                    return true;
                }
                const res = this.saveLead({ id, company, assignedTo, contact, source });
                if (res.ok) {
                    this.showToast('Lead updated.');
                    this._editingLead = null;
                    this.switchSection('leads');
                    this.switchSubSection('lead_directory');
                    this.renderContent();
                    this.initializeLucideIcons();
                } else {
                    this.showToast(res.message || 'Unable to update lead.');
                }
                return true;
            }
            if (a.startsWith('project:edit:')) {
                const key = a.slice('project:edit:'.length).replace(/&quot;/g, '"');
                const projects = this.getAllProjectsMerged([]);
                const p = projects.find(x => String(this.getProjectKey(x)) === key);
                this._editingProject = p;
                this.switchSection('projects');
                this.switchSubSection('project_registration');
                this.renderContent();
                this.initializeLucideIcons();
                return true;
            }
            // Update old project edit alias
`;
code = code.replace(
    /if \(a\.startsWith\('lead:update:'\)\) \{[\s\S]*?\/\/ Let's modify the new project edit button we added earlier\s*\r?\n\s*\}/,
    leadUpdateNew.trim() + '\n'
);

const clientUpdateNew = `
            if (a.startsWith('client:update:')) {
                const name = a.slice('client:update:'.length).replace(/&quot;/g, '"');
                const owner = document.getElementById('clientOwner')?.value?.trim() || '';
                const email = document.getElementById('clientEmail')?.value?.trim() || '';
                const phone = document.getElementById('clientPhone')?.value?.trim() || '';
                const industry = document.getElementById('clientIndustry')?.value?.trim() || '';
                const city = document.getElementById('clientCity')?.value?.trim() || '';
                const address = document.getElementById('clientAddress')?.value?.trim() || '';
                const gstin = document.getElementById('clientGstin')?.value?.trim() || '';

                const res = this.saveClient({ name, owner, email, phone, industry, city, address, gstin });
                if (res.ok) {
                    this.showToast('Client updated.');
                    this._editingClient = null;
                    this.switchSection('leads');
                    this.switchSubSection('client_directory');
                    this.renderContent();
                    this.initializeLucideIcons();
                } else {
                    this.showToast(res.message || 'Unable to update client.');
                }
                return true;
            }
`;
code = code.replace(
    /if \(a\.startsWith\('client:update:'\)\) \{[\s\S]*?return originalRegister;\s*\r?\n\s*\}/,
    clientUpdateNew.trim() + '\n'
);

fs.writeFileSync('client/app.js', code, 'utf8');
