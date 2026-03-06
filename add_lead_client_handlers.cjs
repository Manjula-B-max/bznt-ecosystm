const fs = require('fs');
let code = fs.readFileSync('client/app.js', 'utf8');

// Replace client:update stub with working code
const clientUpdateCode = `
            if (a.startsWith('client:update:')) {
                const name = a.slice('client:update:'.length).replace(/&quot;/g, '"');
                // Temporarily store the name parameter so the register logic can pull it, 
                // OR just call client:register, since it uses getElementById.
                const originalRegister = handleAction('client:register');
                if (originalRegister) {
                    this._editingClient = null;
                }
                return originalRegister;
            }
`;
code = code.replace(/if \(a\.startsWith\('client:update:'\)\) \{\s*\/\/.*?\s*\/\/.*?\s*\/\/.*?\s*\}/, clientUpdateCode.trim());

// Add lead:edit and lead:delete under client:delete logic
const leadActions = `
            if (a === 'lead:edit') {
                const btn = this._lastActionButton;
                const leadId = btn?.dataset?.leadId;
                const leads = this.getStoredLeads();
                const l = leads.find(x => String(x.id) === String(leadId));
                this._editingLead = l || null;
                this.switchSection('leads');
                this.switchSubSection('lead_registration');
                this.renderContent();
                this.initializeLucideIcons();
                return true;
            }
            if (a === 'lead:delete') {
                const btn = this._lastActionButton;
                const leadId = btn?.dataset?.leadId;
                if (!leadId) return true;
                const leads = this.getStoredLeads();
                const filtered = leads.filter(x => String(x.id) !== String(leadId));
                this.writeStore('bezent_leads', filtered);
                this.showToast('Lead deleted.');
                this.renderContent();
                this.initializeLucideIcons();
                return true;
            }
            if (a.startsWith('lead:update:')) {
                const id = a.slice('lead:update:'.length);
                const originalRegister = handleAction('lead:register');
                if (originalRegister) {
                    this._editingLead = null;
                }
                return originalRegister;
            }
            if (a.startsWith('project:dir:select:')) { // Project edit alias
                // wait, project edit already uses project:dir:select which switches view. We want to actually edit.
                // Let's modify the new project edit button we added earlier
            }
`;
code = code.replace(/if \(a === 'client:createInvoice'\) \{/, leadActions.trim() + '\n            if (a === \'client:createInvoice\') {');

fs.writeFileSync('client/app.js', code, 'utf8');
