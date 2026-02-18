// MarketFlow CRM Dashboard Application
class MarketFlowCRM {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentSubSection = 'overview';
        this.selectedClientName = null;
        this.selectedLeadId = null;
        this.isChatOpen = false;
        this.chatMessages = this.getStoredChatMessages();
        this.charts = {};
        this._toastEl = null;
        this._toastTimer = null;
        this._modalEl = null;
        this._chartAnimFrames = {};
        this.init();
    }

    getLeadPipelineStages() {
        return ['New Lead', 'Contacted', 'Missed Call', 'Follow-up', 'Demo', 'Quotation', 'Negotiation', 'Closed', 'PO Received'];
    }

    renderLeadPipelineProgress(currentStage) {
        const stages = this.getLeadPipelineStages();
        const curr = String(currentStage || '').trim().toLowerCase();
        let currentIdx = stages.findIndex(s => String(s).toLowerCase() === curr);
        if (currentIdx < 0) currentIdx = 0;

        return `
            <div class="mt-2">
                <div class="flex items-center justify-between">
                    ${stages.map((s, i) => {
                        const done = i <= currentIdx;
                        const isLast = i === stages.length - 1;
                        const dot = done ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-500 border-slate-300';
                        const line = done ? 'bg-purple-600' : 'bg-slate-200';
                        return `
                            <div class="flex items-center ${isLast ? '' : 'flex-1'}" title="${s}">
                                <div class="w-6 h-6 rounded-full border ${dot} flex items-center justify-center text-[11px] font-semibold">${i + 1}</div>
                                ${isLast ? '' : `<div class="h-0.5 flex-1 mx-2 ${line}"></div>`}
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <div class="font-medium">${stages[0]}</div>
                    <div class="font-medium">${stages[stages.length - 1]}</div>
                </div>
            </div>
        `;
    }

    editClientViaModal(client) {
        const c = client || {};
        const name = String(c.name || '').trim();
        if (!name) {
            this.showToast('Select a client first.');
            return;
        }

        const esc = (v) => String(v ?? '').replace(/</g, '&lt;');

        this.openModal('Edit Client', `
            <div>
                <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Client Name</label>
                <input name="name" required style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${esc(name)}" />
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Owner</label>
                    <input name="owner" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${esc(c.owner || '')}" />
                </div>
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Industry</label>
                    <input name="industry" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${esc(c.industry || '')}" />
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Email</label>
                    <input name="email" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${esc(c.email || '')}" />
                </div>
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Phone</label>
                    <input name="phone" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${esc(c.phone || '')}" />
                </div>
            </div>
            <div>
                <label style="display:block;font-size:12px;font-weight:700;color:#475569;">City</label>
                <input name="city" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${esc(c.city || '')}" />
            </div>
            <div>
                <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Notes</label>
                <textarea name="notes" rows="3" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;">${esc(c.notes || '')}</textarea>
            </div>
        `, {
            submitLabel: 'Save Changes',
            onSubmit: (form) => {
                const data = new FormData(form);
                const nextName = String(data.get('name') || '').trim();
                if (!nextName) {
                    this.showToast('Client name is required.');
                    return;
                }
                // If renamed: delete old, then save new
                if (nextName.toLowerCase() !== name.toLowerCase()) {
                    this.deleteClientByName(name);
                }
                const res = this.saveClient({
                    name: nextName,
                    owner: data.get('owner'),
                    industry: data.get('industry'),
                    email: data.get('email'),
                    phone: data.get('phone'),
                    city: data.get('city') || '—',
                    notes: data.get('notes'),
                    stage: String(c.stage || 'Active')
                });
                if (!res.ok) {
                    this.showToast(res.message || 'Unable to save client.');
                    return;
                }
                this.closeModal();
                this.selectedClientName = nextName;
                this.renderContent();
                this.initializeLucideIcons();
                this.showToast('Client updated.');
            }
        });
    }

    deleteClientViaModal(name) {
        const n = String(name || '').trim();
        if (!n) {
            this.showToast('Select a client first.');
            return;
        }
        this.openModal('Delete Client', `
            <div style="font-size:14px;color:#0f172a;">
                Delete <span style="font-weight:900;">${n.replace(/</g, '&lt;')}</span>?
            </div>
            <div style="font-size:12px;color:#475569;">
                This removes it from your saved client list (defaults remain).
            </div>
        `, {
            submitLabel: 'Delete',
            onSubmit: () => {
                const res = this.deleteClientByName(n);
                if (!res.ok) {
                    this.showToast(res.message || 'Unable to delete client.');
                    return;
                }
                this.closeModal();
                if (String(this.selectedClientName || '').trim().toLowerCase() === n.toLowerCase()) {
                    this.selectedClientName = null;
                }
                this.renderContent();
                this.initializeLucideIcons();
                this.showToast('Client deleted.');
            }
        });
    }

    startChartRotation(chartKey, chart, { speed = 0.003 } = {}) {
        if (!chartKey || !chart) return;
        this.stopChartRotation(chartKey);

        const tick = () => {
            if (!this.charts || this.charts[chartKey] !== chart) return;
            const cur = Number(chart.options?.rotation || 0);
            chart.options.rotation = cur + speed;
            chart.update('none');
            this._chartAnimFrames[chartKey] = requestAnimationFrame(tick);
        };

        this._chartAnimFrames[chartKey] = requestAnimationFrame(tick);
    }

    stopChartRotation(chartKey) {
        const id = this._chartAnimFrames?.[chartKey];
        if (id) {
            cancelAnimationFrame(id);
        }
        if (this._chartAnimFrames) {
            delete this._chartAnimFrames[chartKey];
        }
    }

    getAllContactsData() {
        const clients = this.getClientsData().map(c => {
            const name = String(c?.name || '').trim();
            return {
                type: 'Client',
                name,
                phone: String(c?.phone || '').trim(),
                email: String(c?.email || '').trim(),
                owner: String(c?.owner || '').trim(),
                source: String(c?.leadSource || '').trim(),
                key: `client:${name.toLowerCase()}`
            };
        }).filter(x => x.name);

        const leads = this.getLeadsData().map(l => {
            const name = String(l?.company || '').trim();
            return {
                type: 'Lead',
                name,
                phone: String(l?.contact || '').trim(),
                email: '',
                owner: String(l?.assignedTo || '').trim(),
                source: String(l?.source || '').trim(),
                key: `lead:${String(l?.id || name).toLowerCase()}`
            };
        }).filter(x => x.name);

        const merged = [...clients, ...leads];
        merged.sort((a, b) => String(a.name).localeCompare(String(b.name)));
        return merged;
    }

    setupContactsInteractions() {
        const nameEl = document.getElementById('contactsFilterName');
        const phoneEl = document.getElementById('contactsFilterPhone');
        const emailEl = document.getElementById('contactsFilterEmail');
        const typeEl = document.getElementById('contactsFilterType');
        const ownerEl = document.getElementById('contactsFilterOwner');
        const sourceEl = document.getElementById('contactsFilterSource');
        const rows = Array.from(document.querySelectorAll('tr[data-contact-row="1"]'));

        const apply = () => {
            const nameQ = String(nameEl?.value || '').trim().toLowerCase();
            const phoneQ = String(phoneEl?.value || '').trim().toLowerCase();
            const emailQ = String(emailEl?.value || '').trim().toLowerCase();
            const typeQ = String(typeEl?.value || 'All').trim().toLowerCase();
            const ownerQ = String(ownerEl?.value || 'All').trim().toLowerCase();
            const sourceQ = String(sourceEl?.value || 'All').trim().toLowerCase();

            rows.forEach(r => {
                const n = String(r.dataset.name || '').toLowerCase();
                const p = String(r.dataset.phone || '').toLowerCase();
                const e = String(r.dataset.email || '').toLowerCase();
                const t = String(r.dataset.type || '').toLowerCase();
                const o = String(r.dataset.owner || '').toLowerCase();
                const s = String(r.dataset.source || '').toLowerCase();

                const okType = typeQ === 'all' || t === typeQ;
                const okName = !nameQ || n.includes(nameQ);
                const okPhone = !phoneQ || p.includes(phoneQ);
                const okEmail = !emailQ || e.includes(emailQ);
                const okOwner = ownerQ === 'all' || o === ownerQ;
                const okSource = sourceQ === 'all' || s === sourceQ;

                r.style.display = (okType && okOwner && okSource && okName && okPhone && okEmail) ? '' : 'none';
            });
        };

        [nameEl, phoneEl, emailEl].forEach(el => {
            if (!el) return;
            el.addEventListener('input', apply);
        });
        if (typeEl) typeEl.addEventListener('change', apply);
        if (ownerEl) ownerEl.addEventListener('change', apply);
        if (sourceEl) sourceEl.addEventListener('change', apply);

        apply();
    }

    applyLoggedInUser() {
        const avatarBtn = document.getElementById('profileToggle');
        const nameEl = document.getElementById('profileName');

        let email = '';
        try { email = localStorage.getItem('bezent_user_email') || ''; } catch (_) { email = ''; }

        const cleaned = String(email || '').trim().toLowerCase();
        if (!cleaned) return;

        const localPart = cleaned.split('@')[0] || '';
        const parts = localPart
            .split(/[._+\-\s]+/)
            .map(p => p.trim())
            .filter(Boolean);

        const initials = (parts[0]?.[0] || localPart[0] || 'U').toUpperCase() + (parts[1]?.[0] ? parts[1][0].toUpperCase() : '');
        const displayName = parts.length
            ? parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
            : cleaned;

        if (avatarBtn) avatarBtn.textContent = initials;
        if (nameEl) nameEl.textContent = displayName;
    }

    showToast(message) {
        const msg = String(message || '').trim();
        if (!msg) return;

        if (!this._toastEl) {
            const el = document.createElement('div');
            el.style.position = 'fixed';
            el.style.left = '50%';
            el.style.bottom = '20px';
            el.style.transform = 'translateX(-50%)';
            el.style.maxWidth = 'min(92vw, 520px)';
            el.style.padding = '10px 14px';
            el.style.borderRadius = '12px';
            el.style.background = 'rgba(15, 23, 42, 0.92)';
            el.style.color = '#fff';
            el.style.fontSize = '13px';
            el.style.fontWeight = '600';
            el.style.boxShadow = '0 12px 30px rgba(2, 6, 23, 0.25)';
            el.style.zIndex = '9999';
            el.style.pointerEvents = 'none';
            el.style.opacity = '0';
            el.style.transition = 'opacity 160ms ease';
            document.body.appendChild(el);
            this._toastEl = el;
        }

        this._toastEl.textContent = msg;
        this._toastEl.style.opacity = '1';

        if (this._toastTimer) clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            if (this._toastEl) this._toastEl.style.opacity = '0';
        }, 2400);
    }

    readStore(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return fallback;
            return JSON.parse(raw);
        } catch (_) {
            return fallback;
        }
    }

    writeStore(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
    }

    getStoredChatMessages() {
        const items = this.readStore('bezent_chat_messages', []);
        if (!Array.isArray(items)) return [];
        return items.filter(m => m && typeof m === 'object').slice(-100);
    }

    saveChatMessages(messages) {
        const list = Array.isArray(messages) ? messages.slice(-100) : [];
        this.writeStore('bezent_chat_messages', list);
        this.chatMessages = list;
    }

    addChatMessage(role, text) {
        const msg = String(text || '').trim();
        if (!msg) return;
        const list = Array.isArray(this.chatMessages) ? [...this.chatMessages] : [];
        list.push({ role: role === 'user' ? 'user' : 'assistant', text: msg, at: Date.now() });
        this.saveChatMessages(list);
    }

    getChatAssistantReply(userText) {
        const q = String(userText || '').trim();
        const t = q.toLowerCase();
        if (!t) return "Tell me what you want to know about Bezent (Leads, Clients, Projects, Billing).";

        const includesAny = (arr) => arr.some(w => t.includes(w));

        if (includesAny(['hi', 'hello', 'hey', 'good morning', 'good evening'])) {
            return "Hi! I can help with Bezent basics: Leads/Clients, Projects, Vendor Code, Project Code, Billing.";
        }

        if (includesAny(['what is bezent', 'about bezent', 'product', 'crm'])) {
            return "Bezent is a lightweight CRM dashboard to manage Leads, Clients, Projects/Pipeline and Billing in one place.";
        }

        if (includesAny(['lead', 'leads'])) {
            return "Leads: register a lead, track stage (New Lead -> Contacted -> Missed Call -> Follow-up -> Demo -> Quotation -> Negotiation -> Closed -> PO Received), and convert to a Client when confirmed.";
        }

        if (includesAny(['client', 'clients'])) {
            return "Clients: maintain client details (name, owner, email, phone, industry, lead source, location, vendor code, city, notes) and view them in Client Directory.";
        }

        if (includesAny(['vendor code', 'vendorcode', 'vendor'])) {
            return "Vendor Code is auto-generated from Location + sequence (e.g., CHN001). In Project Registration/Directory you can enter Vendor Code to fetch client/company details automatically.";
        }

        if (includesAny(['project code', 'projectcode', 'apj'])) {
            return "Project Code format: APJ + YY + ServiceCode + sequence (e.g., APJ26RE001). It auto-generates based on Service Code and existing projects in the current year. APJ is fixed prefix, YY is last 2 digits of year.";
        }

        if (includesAny(['service code', 'service'])) {
            return "Service Code identifies the service type (RE, CAD, 2D, 2DI, 3DI, CD, NPD, SPM, STL, FEA). It drives Project Code generation. Selecting a service code auto-generates the project code in registration.";
        }

        if (includesAny(['project', 'projects', 'pipeline', 'directory'])) {
            return "Projects: register projects, track technical statuses (2D/3D Model, 3D Scan, FEA, QC/Inspection, Approval, GL Approval, Revision, Delivery Report, SOP Daily Report), roadmap/progress monitoring, dispatch & delivery details, purchase details, and payment tracking. Use Project Directory for full detailed view.";
        }

        if (includesAny(['tracking', 'status', 'technical', 'model', 'scan', 'fea', 'qc', 'approval'])) {
            return "Technical Tracking includes: 2D Model Status, 3D Model Status, 3D Scan Status, FEA Status, QC/Inspection Status, Approval Status, GL Approval Status, Correction/Revision Status, Delivery Report Status, SOP-Based Daily Report Status. Each can be: Pending, In Progress, Completed, or Blocked.";
        }

        if (includesAny(['monitoring', 'roadmap', 'dashboard', 'daily report', 'photo', 'overall status'])) {
            return "Project Monitoring tracks: Project Roadmap Submitted (Yes/No), Dashboard Updated (Yes/No), Daily Report Updated (Yes/No), Photo Attached (Yes/No), Overall Project Status, Post Completion Status, and Physical Part Status.";
        }

        if (includesAny(['dispatch', 'delivery', 'dc', 'delivery confirmation'])) {
            return "Dispatch & Delivery includes: DC Date, DC Number, Delivery Status (Pending/Completed), Delivery Date, and Delivery Confirmation (Yes/No). These help track when and how projects are delivered to clients.";
        }

        if (includesAny(['purchase', 'quotation', 'po', 'converted by', 'visit conducted'])) {
            return "Purchase Details track: Quotation Date/Number, PO Date/Number/Value, Converted By (who converted lead to project), and Visit Conducted (Yes/No). This helps understand the sales-to-project conversion process.";
        }

        if (includesAny(['invoice', 'billing', 'payment', 'payment terms', 'payment type', 'overdue'])) {
            return "Billing: create invoices, track Invoice Date/Number/Amount, Past Invoice Amount, Payment Terms, Payment Type, Payment Due Date, Payment Received Date/Amount, Balance Payment Due Date/Amount, and Overdue Status (auto-calculated from due dates).";
        }

        if (includesAny(['ratings', 'client rating', 'job rating', 'quality rating', 'service rating', 'performance rating', 'feedback'])) {
            return "Performance & Rating includes: Client Rating (0-10), Job Rating (0-10), Quality Rating (0-10), Service Rating (0-10), Performance Rating (0-10), Feedback/Comments, and Additional Notes. These help evaluate project success and client satisfaction.";
        }

        if (includesAny(['location', 'city', 'bengaluru', 'pune', 'chennai', 'mumbai', 'hyderabad'])) {
            return "Location/City options include: Bengaluru, Pune, Chennai, Mumbai, Hyderabad. Location is used to generate Vendor Codes and helps in regional reporting and client management.";
        }

        if (includesAny(['how', 'help', 'support', 'guide'])) {
            return "Try asking: 'How to generate vendor code?', 'Explain project code', 'How to register a client?', 'How to create an invoice?', 'What are technical tracking statuses?', or 'How does payment tracking work?'";
        }

        return "I can answer simple Bezent product questions. Ask about Leads, Clients, Projects, Vendor Code, Project Code, Billing, Tracking, Monitoring, Dispatch, Purchase, Payments, or Ratings.";
    }

    sendChatMessage(rawText) {
        const text = String(rawText || '').trim();
        if (!text) return;
        this.addChatMessage('user', text);
        const reply = this.getChatAssistantReply(text);
        this.addChatMessage('assistant', reply);
        this.renderChatPanel();
        this.initializeLucideIcons();
    }

    upsertStoredItem(key, predicateFn, newItem) {
        const items = this.readStore(key, []);
        const list = Array.isArray(items) ? items : [];
        const idx = list.findIndex(predicateFn);
        if (idx >= 0) list[idx] = { ...list[idx], ...newItem };
        else list.unshift(newItem);
        this.writeStore(key, list);
        return list;
    }

    getStoredClients() {
        const items = this.readStore('bezent_clients', []);
        return Array.isArray(items) ? items : [];
    }

    getStoredLeads() {
        const items = this.readStore('bezent_leads', []);
        return Array.isArray(items) ? items : [];
    }

    saveLead(lead) {
        const l = lead || {};
        const company = String(l.company || '').trim();
        if (!company) return { ok: false, message: 'Company is required.' };

        const id = String(l.id || '').trim() || `LD-${Date.now()}`;
        const items = this.getStoredLeads();
        const idx = items.findIndex(x => String(x?.id || '').trim().toLowerCase() === id.toLowerCase());

        const normalized = {
            id,
            company,
            contact: String(l.contact || '').trim(),
            source: String(l.source || 'LinkedIn').trim() || 'LinkedIn',
            stage: String(l.stage || 'New Lead').trim() || 'New Lead',
            assignedTo: String(l.assignedTo || '—').trim() || '—',
            nextAction: String(l.nextAction || 'Follow-up').trim() || 'Follow-up',
            feedbackStatus: String(l.feedbackStatus || 'Pending').trim() || 'Pending',
            status: String(l.status || 'Open').trim() || 'Open',
            receivedAt: Number.isFinite(Number(l.receivedAt)) ? Number(l.receivedAt) : Date.now(),
            firstResponseAt: Number.isFinite(Number(l.firstResponseAt)) ? Number(l.firstResponseAt) : null,
            linkedClientName: String(l.linkedClientName || '').trim(),
            history: Array.isArray(l.history) ? l.history : []
        };

        if (idx >= 0) items[idx] = { ...items[idx], ...normalized };
        else items.unshift(normalized);
        this.writeStore('bezent_leads', items);
        return { ok: true, id };
    }

    convertLeadToClient(leadId) {
        const id = String(leadId || '').trim();
        if (!id) return { ok: false, message: 'Lead ID missing.' };

        const leads = this.getStoredLeads();
        const idx = leads.findIndex(l => String(l?.id || '').trim().toLowerCase() === id.toLowerCase());
        if (idx < 0) return { ok: false, message: 'Lead not found.' };

        const lead = leads[idx];
        const clientName = String(lead.company || '').trim();
        if (!clientName) return { ok: false, message: 'Lead company missing.' };

        const res = this.saveClient({
            name: clientName,
            owner: lead.assignedTo || '—',
            phone: lead.contact || '',
            leadSource: lead.source || '',
            stage: 'Active',
            notes: `Converted from lead ${lead.id}`
        });
        if (!res.ok) return res;

        leads[idx] = {
            ...lead,
            status: 'Converted',
            linkedClientName: clientName,
            history: [
                ...(Array.isArray(lead.history) ? lead.history : []),
                { at: Date.now(), type: 'convert', note: `Converted to client: ${clientName}` }
            ]
        };
        this.writeStore('bezent_leads', leads);
        return { ok: true, clientName };
    }

    deleteClientByName(name) {
        const n = String(name || '').trim();
        if (!n) return { ok: false, message: 'Client name missing.' };
        const items = this.getStoredClients();
        const next = items.filter(x => String(x?.name || '').trim().toLowerCase() !== n.toLowerCase());
        this.writeStore('bezent_clients', next);
        return { ok: true };
    }

    saveClient(client) {
        const c = client || {};
        const name = String(c.name || '').trim();
        if (!name) return { ok: false, message: 'Client name is required.' };
        const items = this.getStoredClients();
        const idx = items.findIndex(x => String(x.name || '').toLowerCase() === name.toLowerCase());
        const normalized = {
            name,
            city: String(c.city || '—').trim() || '—',
            industry: String(c.industry || '—').trim() || '—',
            owner: String(c.owner || '—').trim() || '—',
            stage: String(c.stage || 'Active').trim() || 'Active',
            openInvoices: Number.isFinite(Number(c.openInvoices)) ? Number(c.openInvoices) : 0,
            dueAmount: String(c.dueAmount || '₹0').trim() || '₹0',
            email: String(c.email || '').trim(),
            phone: String(c.phone || '').trim(),
            leadSource: String(c.leadSource || '').trim(),
            location: String(c.location || '').trim(),
            vendorCode: String(c.vendorCode || '').trim(),
            notes: String(c.notes || '').trim()
        };
        if (idx >= 0) items[idx] = { ...items[idx], ...normalized };
        else items.unshift(normalized);
        this.writeStore('bezent_clients', items);
        return { ok: true };
    }

    getStoredCampaigns() {
        const items = this.readStore('bezent_campaigns', []);
        return Array.isArray(items) ? items : [];
    }

    saveCampaign(campaign) {
        const c = campaign || {};
        const name = String(c.name || '').trim();
        if (!name) return { ok: false, message: 'Campaign name is required.' };
        const items = this.getStoredCampaigns();
        items.unshift({
            name,
            audience: Number.isFinite(Number(c.audience)) ? Number(c.audience) : 0,
            open: Number.isFinite(Number(c.open)) ? Number(c.open) : 0,
            click: Number.isFinite(Number(c.click)) ? Number(c.click) : 0,
            status: String(c.status || 'Draft').trim() || 'Draft',
            statusColor: String(c.statusColor || 'slate').trim() || 'slate'
        });
        this.writeStore('bezent_campaigns', items);
        return { ok: true };
    }

    upsertCampaign(campaign) {
        const c = campaign || {};
        const name = String(c.name || '').trim();
        if (!name) return { ok: false, message: 'Campaign name is required.' };
        const normalized = {
            name,
            audience: Number.isFinite(Number(c.audience)) ? Number(c.audience) : 0,
            open: Number.isFinite(Number(c.open)) ? Number(c.open) : 0,
            click: Number.isFinite(Number(c.click)) ? Number(c.click) : 0,
            status: String(c.status || 'Draft').trim() || 'Draft',
            statusColor: String(c.statusColor || 'slate').trim() || 'slate'
        };
        this.upsertStoredItem(
            'bezent_campaigns',
            (x) => String(x?.name || '').trim().toLowerCase() === name.toLowerCase(),
            normalized
        );
        return { ok: true };
    }

    deleteCampaignByName(name) {
        const n = String(name || '').trim();
        if (!n) return { ok: false, message: 'Campaign name missing.' };
        const items = this.getStoredCampaigns();
        const next = items.filter(x => String(x?.name || '').trim().toLowerCase() !== n.toLowerCase());
        this.writeStore('bezent_campaigns', next);
        return { ok: true };
    }

    getCampaignByName(name) {
        const n = String(name || '').trim();
        if (!n) return null;
        const defaults = [
            { name: 'CRM Upgrade', audience: 45, open: 31, click: 8, status: 'Sent', statusColor: 'emerald' },
            { name: 'Quarterly Offer', audience: 126, open: 28, click: 7, status: 'Scheduled', statusColor: 'amber' },
            { name: 'New Service Launch', audience: 78, open: 24, click: 6, status: 'Draft', statusColor: 'slate' }
        ];
        const all = [...this.getStoredCampaigns(), ...defaults];
        return all.find(c => String(c?.name || '').trim().toLowerCase() === n.toLowerCase()) || null;
    }

    previewCampaign(campaign) {
        const c = campaign || {};
        const esc = (v) => String(v ?? '').replace(/</g, '&lt;');
        this.openModal(`Campaign: ${esc(c.name || '')}`, `
            <div style="display:grid;gap:10px;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    <div>
                        <div style="font-size:12px;font-weight:700;color:#64748b;">Status</div>
                        <div style="margin-top:4px;font-weight:800;color:#0f172a;">${esc(c.status || 'Draft')}</div>
                    </div>
                    <div>
                        <div style="font-size:12px;font-weight:700;color:#64748b;">Audience</div>
                        <div style="margin-top:4px;font-weight:800;color:#0f172a;">${Number(c.audience || 0)}</div>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    <div>
                        <div style="font-size:12px;font-weight:700;color:#64748b;">Open rate</div>
                        <div style="margin-top:4px;font-weight:800;color:#0f172a;">${Number(c.open || 0)}%</div>
                    </div>
                    <div>
                        <div style="font-size:12px;font-weight:700;color:#64748b;">Click rate</div>
                        <div style="margin-top:4px;font-weight:800;color:#0f172a;">${Number(c.click || 0)}%</div>
                    </div>
                </div>
                <div style="border-top:1px solid #e2e8f0;padding-top:10px;font-size:12px;color:#475569;">
                    Preview is a placeholder. Send/Schedule updates status in your saved data.
                </div>
            </div>
        `, {
            submitLabel: 'Close',
            onSubmit: () => this.closeModal()
        });
    }

    duplicateCampaignByName(name) {
        const c = this.getCampaignByName(name);
        if (!c) return { ok: false, message: 'Campaign not found.' };
        const suffix = `Copy ${new Date().toLocaleDateString()}`;
        const next = { ...c, name: `${c.name} (${suffix})`, status: 'Draft', statusColor: 'slate' };
        return this.saveCampaign(next);
    }

    setCampaignStatus(name, status) {
        const c = this.getCampaignByName(name);
        if (!c) return { ok: false, message: 'Campaign not found.' };
        const s = String(status || 'Draft').trim() || 'Draft';
        const color = s === 'Sent' ? 'emerald' : s === 'Scheduled' ? 'amber' : 'slate';
        return this.upsertCampaign({ ...c, status: s, statusColor: color });
    }

    getStoredInvoices() {
        const items = this.readStore('bezent_invoices', []);
        return Array.isArray(items) ? items : [];
    }

    getAllInvoices() {
        const defaults = [
            { no: 'INV-102', client: 'TechNova Solutions', amount: '₹42,000', due: '3 days overdue', status: 'Overdue', color: 'rose' },
            { no: 'INV-118', client: 'EduSpark', amount: '₹85,000', due: 'Paid', status: 'Paid', color: 'emerald' },
            { no: 'INV-121', client: 'GreenLeaf Industries', amount: '₹58,000', due: 'Due in 5 days', status: 'Pending', color: 'amber' },
            { no: 'INV-123', client: 'Mumbai Retail Chain', amount: '₹37,000', due: 'Due in 2 days', status: 'Pending', color: 'amber' },
            { no: 'INV-124', client: 'BrightFin', amount: '₹25,000', due: 'Paid', status: 'Paid', color: 'emerald' }
        ];
        return [...this.getStoredInvoices(), ...defaults];
    }

    getInvoiceSummaryByClient() {
        const map = new Map();
        const invoices = this.getAllInvoices();
        invoices.forEach(inv => {
            const client = String(inv?.client || '').trim();
            if (!client) return;
            const key = client.toLowerCase();
            const status = String(inv?.status || '').trim().toLowerCase();
            const isOpen = status !== 'paid';
            const amt = this.parseCurrencyToNumber(inv?.amount);
            const cur = map.get(key) || { openInvoices: 0, dueAmount: 0 };
            if (isOpen) {
                cur.openInvoices += 1;
                cur.dueAmount += amt;
            }
            map.set(key, cur);
        });
        return map;
    }

    getStoredProjects() {
        const items = this.readStore('bezent_projects', []);
        const list = Array.isArray(items) ? items : [];
        let mutated = false;

        const currentYear = new Date().getFullYear().toString().slice(-2);
        const prefix = 'APJ';
        const legacyRe = /^PRJ-(\d{3,})$/i;

        const serviceFromName = (name) => {
            const n = String(name || '').trim();
            if (n === 'SEO Revamp') return 'RE';
            if (n === 'CRM Upgrade') return 'CAD';
            if (n === 'Re-engagement Funnel') return '2D';
            if (n === 'Performance Ads') return '2DI';
            return '';
        };

        const migrated = list.map(p => {
            const model = this.ensureProjectModel(p);
            const code = String(model?.identification?.projectCode || '').trim();
            const existingService = String(model?.identification?.serviceCode || '').trim();
            const inferredService = existingService || serviceFromName(model?.name) || 'RE';
            const m = code.match(legacyRe);
            if (m) {
                const seq = String(m[1] || '').padStart(3, '0');
                model.identification.serviceCode = inferredService;
                model.identification.projectCode = `${prefix}${currentYear}${inferredService}${seq}`;
                mutated = true;
            }
            return model;
        });

        if (mutated) {
            this.writeStore('bezent_projects', migrated);
        }

        return migrated;
    }

    getProjectKey(project) {
        const p = project || {};
        return `${String(p?.name || '').trim()}__${String(p?.client || '').trim()}`;
    }

    ensureProjectModel(project) {
        const p = project || {};
        return {
            ...p,
            identification: {
                projectCode: p?.identification?.projectCode ?? p?.projectCode ?? '',
                serviceCode: p?.identification?.serviceCode ?? p?.serviceCode ?? '',
                vendorCode: p?.identification?.vendorCode ?? p?.vendorCode ?? '',
                companyName: p?.identification?.companyName ?? p?.companyName ?? (p?.client ?? ''),
                projectDescription: p?.identification?.projectDescription ?? p?.projectDescription ?? '',
                partDescription: p?.identification?.partDescription ?? p?.partDescription ?? '',
                location: p?.identification?.location ?? p?.location ?? '',
                qty: p?.identification?.qty ?? p?.qty ?? '',
                projectLead: p?.identification?.projectLead ?? p?.lead ?? p?.leadName ?? '',
                assignedBy: p?.identification?.assignedBy ?? p?.assignedBy ?? '',
                assignedTo: p?.identification?.assignedTo ?? p?.assignedTo ?? ''
            },
            tracking: {
                model2dStatus: p?.tracking?.model2dStatus ?? 'Pending',
                model3dStatus: p?.tracking?.model3dStatus ?? 'Pending',
                scan3dStatus: p?.tracking?.scan3dStatus ?? 'Pending',
                feaStatus: p?.tracking?.feaStatus ?? 'Pending',
                qcInspectionStatus: p?.tracking?.qcInspectionStatus ?? 'Pending',
                approvalStatus: p?.tracking?.approvalStatus ?? 'Pending',
                glApprovalStatus: p?.tracking?.glApprovalStatus ?? 'Pending',
                revisionStatus: p?.tracking?.revisionStatus ?? 'Pending',
                deliveryReportStatus: p?.tracking?.deliveryReportStatus ?? 'Pending',
                sopDailyReportStatus: p?.tracking?.sopDailyReportStatus ?? 'Pending'
            },
            monitoring: {
                roadmapSubmitted: p?.monitoring?.roadmapSubmitted ?? 'No',
                dashboardUpdated: p?.monitoring?.dashboardUpdated ?? 'No',
                dailyReportUpdated: p?.monitoring?.dailyReportUpdated ?? 'No',
                overallProjectStatus: p?.monitoring?.overallProjectStatus ?? 'Pending / Delayed',
                postCompletionStatus: p?.monitoring?.postCompletionStatus ?? '',
                physicalPartStatus: p?.monitoring?.physicalPartStatus ?? '',
                photoAttached: p?.monitoring?.photoAttached ?? 'No'
            },
            dispatch: {
                dcDate: p?.dispatch?.dcDate ?? '',
                dcNumber: p?.dispatch?.dcNumber ?? '',
                deliveryStatus: p?.dispatch?.deliveryStatus ?? '',
                deliveryDate: p?.dispatch?.deliveryDate ?? '',
                deliveryConfirmation: p?.dispatch?.deliveryConfirmation ?? ''
            },
            purchase: {
                quotationDate: p?.purchase?.quotationDate ?? '',
                quotationNumber: p?.purchase?.quotationNumber ?? '',
                poDate: p?.purchase?.poDate ?? '',
                poNumber: p?.purchase?.poNumber ?? '',
                poValue: p?.purchase?.poValue ?? '',
                visitConducted: p?.purchase?.visitConducted ?? 'No',
                convertedBy: p?.purchase?.convertedBy ?? ''
            },
            payment: {
                invoiceDate: p?.payment?.invoiceDate ?? '',
                invoiceNumber: p?.payment?.invoiceNumber ?? '',
                invoiceAmount: p?.payment?.invoiceAmount ?? '',
                pastInvoiceAmount: p?.payment?.pastInvoiceAmount ?? '',
                paymentTerms: p?.payment?.paymentTerms ?? '',
                paymentType: p?.payment?.paymentType ?? '',
                paymentDueDate: p?.payment?.paymentDueDate ?? '',
                paymentReceivedDate: p?.payment?.paymentReceivedDate ?? '',
                paymentReceivedAmount: p?.payment?.paymentReceivedAmount ?? '',
                balancePaymentDueDate: p?.payment?.balancePaymentDueDate ?? '',
                balancePaymentAmount: p?.payment?.balancePaymentAmount ?? '',
                overdueStatus: p?.payment?.overdueStatus ?? ''
            },
            ratings: {
                vendorRating: p?.ratings?.vendorRating ?? '',
                clientRating: p?.ratings?.clientRating ?? '',
                internalPerformanceRating: p?.ratings?.internalPerformanceRating ?? ''
            }
        };
    }

    getAllProjectsMerged(defaults) {
        const map = new Map();
        (Array.isArray(defaults) ? defaults : []).forEach(p => {
            const key = this.getProjectKey(p);
            if (!key) return;
            map.set(key, this.ensureProjectModel(p));
        });
        this.getStoredProjects().forEach(p => {
            const key = this.getProjectKey(p);
            if (!key) return;
            map.set(key, this.ensureProjectModel(p));
        });
        return Array.from(map.values());
    }

    updateProjectFieldByKey(projectKey, fieldPath, value) {
        const key = String(projectKey || '').trim();
        const path = String(fieldPath || '').trim();
        if (!key || !path) return { ok: false, message: 'Missing key.' };
        const items = this.getStoredProjects();
        let updated = false;

        const computeOverdueStatus = (payment) => {
            const p = payment || {};
            const receivedDate = String(p.paymentReceivedDate || '').trim();
            const receivedAmt = String(p.paymentReceivedAmount || '').trim();
            if (receivedDate || receivedAmt) return 'Paid';
            const due = String(p.paymentDueDate || '').trim();
            if (!due) return '';
            const dueMs = Date.parse(due);
            if (!Number.isFinite(dueMs)) return '';
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
            const diffDays = Math.floor((startOfToday - dueMs) / (1000 * 60 * 60 * 24));
            if (diffDays <= 0) return 'Pending';
            if (diffDays <= 30) return '30 Days Due';
            if (diffDays <= 60) return '60 Days Overdue';
            return '90+ Days Overdue';
        };

        const next = items.map(p => {
            const curKey = this.getProjectKey(p);
            if (curKey !== key) return p;
            updated = true;
            const model = this.ensureProjectModel(p);
            const parts = path.split('.').filter(Boolean);
            let ref = model;
            for (let i = 0; i < parts.length - 1; i++) {
                const k = parts[i];
                if (!ref[k] || typeof ref[k] !== 'object') ref[k] = {};
                ref = ref[k];
            }
            ref[parts[parts.length - 1]] = value;

            if (path.startsWith('payment.')) {
                model.payment = { ...(model.payment || {}) };
                model.payment.overdueStatus = computeOverdueStatus(model.payment);
            }

            return model;
        });

        if (!updated) return { ok: false, message: 'Project not found in stored list.' };
        this.writeStore('bezent_projects', next);
        return { ok: true };
    }

    saveProject(project) {
        const p = project || {};
        const name = String(p.name || '').trim();
        const client = String(p.client || '').trim();
        if (!name || !client) return { ok: false, message: 'Project name and client are required.' };

        const computeOverdueStatus = (payment) => {
            const pay = payment || {};
            const receivedDate = String(pay.paymentReceivedDate || '').trim();
            const receivedAmt = String(pay.paymentReceivedAmount || '').trim();
            if (receivedDate || receivedAmt) return 'Paid';
            const due = String(pay.paymentDueDate || '').trim();
            if (!due) return '';
            const dueMs = Date.parse(due);
            if (!Number.isFinite(dueMs)) return '';
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
            const diffDays = Math.floor((startOfToday - dueMs) / (1000 * 60 * 60 * 24));
            if (diffDays <= 0) return 'Pending';
            if (diffDays <= 30) return '30 Days Due';
            if (diffDays <= 60) return '60 Days Overdue';
            return '90+ Days Overdue';
        };

        const items = this.getStoredProjects();
        const payment = {
            invoiceDate: String(p?.payment?.invoiceDate ?? '').trim(),
            invoiceNumber: String(p?.payment?.invoiceNumber ?? '').trim(),
            invoiceAmount: String(p?.payment?.invoiceAmount ?? '').trim(),
            pastInvoiceAmount: String(p?.payment?.pastInvoiceAmount ?? '').trim(),
            paymentTerms: String(p?.payment?.paymentTerms ?? '').trim(),
            paymentType: String(p?.payment?.paymentType ?? '').trim(),
            paymentDueDate: String(p?.payment?.paymentDueDate ?? '').trim(),
            paymentReceivedDate: String(p?.payment?.paymentReceivedDate ?? '').trim(),
            paymentReceivedAmount: String(p?.payment?.paymentReceivedAmount ?? '').trim(),
            balancePaymentDueDate: String(p?.payment?.balancePaymentDueDate ?? '').trim(),
            balancePaymentAmount: String(p?.payment?.balancePaymentAmount ?? '').trim(),
            overdueStatus: String(p?.payment?.overdueStatus ?? '').trim()
        };
        payment.overdueStatus = payment.overdueStatus || computeOverdueStatus(payment);

        items.unshift({
            name,
            client,
            startDate: String(p.startDate || '').trim(),
            duration: String(p.duration || '').trim(),
            budget: String(p.budget || '').trim(),
            team: String(p.team || '').trim(),
            status: String(p.status || 'On Track').trim() || 'On Track',
            statusColor: String(p.statusColor || 'emerald').trim() || 'emerald',
            progress: Number.isFinite(Number(p.progress)) ? Number(p.progress) : 0,
            owner: String(p.owner || '—').trim() || '—',
            spent: String(p.spent || '₹0').trim() || '₹0',
            identification: {
                projectCode: String(p?.identification?.projectCode ?? p.projectCode ?? '').trim(),
                serviceCode: String(p?.identification?.serviceCode ?? p.serviceCode ?? '').trim(),
                vendorCode: String(p?.identification?.vendorCode ?? p.vendorCode ?? '').trim(),
                companyName: String(p?.identification?.companyName ?? p.companyName ?? client).trim(),
                projectDescription: String(p?.identification?.projectDescription ?? p.projectDescription ?? '').trim(),
                partDescription: String(p?.identification?.partDescription ?? p.partDescription ?? '').trim(),
                location: String(p?.identification?.location ?? p.location ?? '').trim(),
                qty: String(p?.identification?.qty ?? p.qty ?? '').trim(),
                projectLead: String(p?.identification?.projectLead ?? p.projectLead ?? '').trim(),
                assignedBy: String(p?.identification?.assignedBy ?? p.assignedBy ?? '').trim(),
                assignedTo: String(p?.identification?.assignedTo ?? p.assignedTo ?? '').trim()
            },
            tracking: {
                model2dStatus: String(p?.tracking?.model2dStatus ?? '').trim(),
                model3dStatus: String(p?.tracking?.model3dStatus ?? '').trim(),
                scan3dStatus: String(p?.tracking?.scan3dStatus ?? '').trim(),
                feaStatus: String(p?.tracking?.feaStatus ?? '').trim(),
                qcInspectionStatus: String(p?.tracking?.qcInspectionStatus ?? '').trim(),
                approvalStatus: String(p?.tracking?.approvalStatus ?? '').trim(),
                glApprovalStatus: String(p?.tracking?.glApprovalStatus ?? '').trim(),
                revisionStatus: String(p?.tracking?.revisionStatus ?? '').trim(),
                deliveryReportStatus: String(p?.tracking?.deliveryReportStatus ?? '').trim(),
                sopDailyReportStatus: String(p?.tracking?.sopDailyReportStatus ?? '').trim()
            },
            monitoring: {
                roadmapSubmitted: String(p?.monitoring?.roadmapSubmitted ?? '').trim(),
                dashboardUpdated: String(p?.monitoring?.dashboardUpdated ?? '').trim(),
                dailyReportUpdated: String(p?.monitoring?.dailyReportUpdated ?? '').trim(),
                photoAttached: String(p?.monitoring?.photoAttached ?? '').trim(),
                overallProjectStatus: String(p?.monitoring?.overallProjectStatus ?? '').trim(),
                postCompletionStatus: String(p?.monitoring?.postCompletionStatus ?? '').trim(),
                physicalPartStatus: String(p?.monitoring?.physicalPartStatus ?? '').trim()
            },
            dispatch: {
                dcDate: String(p?.dispatch?.dcDate ?? '').trim(),
                dcNumber: String(p?.dispatch?.dcNumber ?? '').trim(),
                deliveryStatus: String(p?.dispatch?.deliveryStatus ?? '').trim(),
                deliveryDate: String(p?.dispatch?.deliveryDate ?? '').trim(),
                deliveryConfirmation: String(p?.dispatch?.deliveryConfirmation ?? '').trim()
            },
            purchase: {
                quotationDate: String(p?.purchase?.quotationDate ?? '').trim(),
                quotationNumber: String(p?.purchase?.quotationNumber ?? '').trim(),
                poDate: String(p?.purchase?.poDate ?? '').trim(),
                poNumber: String(p?.purchase?.poNumber ?? '').trim(),
                poValue: String(p?.purchase?.poValue ?? '').trim(),
                convertedBy: String(p?.purchase?.convertedBy ?? '').trim(),
                visitConducted: String(p?.purchase?.visitConducted ?? '').trim()
            },
            payment,
            ratings: {
                clientRating: String(p?.ratings?.clientRating ?? '').trim(),
                jobRating: String(p?.ratings?.jobRating ?? '').trim(),
                feedbackComments: String(p?.ratings?.feedbackComments ?? '').trim(),
                qualityRating: String(p?.ratings?.qualityRating ?? '').trim(),
                serviceRating: String(p?.ratings?.serviceRating ?? '').trim(),
                performanceRating: String(p?.ratings?.performanceRating ?? '').trim(),
                additionalNotes: String(p?.ratings?.additionalNotes ?? '').trim()
            }
        });
        this.writeStore('bezent_projects', items);
        return { ok: true };
    }

    saveProjectByKey(key) {
        if (!key) return;
        const inputs = document.querySelectorAll(`input[data-project-key="${key}"], textarea[data-project-key="${key}"], select[data-project-key="${key}"]`);
        const updates = {};
        inputs.forEach(el => {
            const field = el.dataset.projectField;
            if (!field) return;
            const value = el.type === 'checkbox' ? (el.checked ? 'Yes' : 'No') : el.value;
            this.setNestedProperty(updates, field, value);
        });
        const items = this.getStoredProjects();
        const idx = items.findIndex(p => this.getProjectKey(p) === key);
        if (idx !== -1) {
            Object.assign(items[idx], updates);
            this.writeStore('bezent_projects', items);
        }
    }

    deleteProjectByKey(key) {
        if (!key) return;
        const items = this.getStoredProjects();
        const filtered = items.filter(p => this.getProjectKey(p) !== key);
        this.writeStore('bezent_projects', filtered);
    }

    setNestedProperty(obj, path, value) {
        const parts = path.split('.');
        let cur = obj;
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!(part in cur) || typeof cur[part] !== 'object') cur[part] = {};
            cur = cur[part];
        }
        cur[parts[parts.length - 1]] = value;
    }

    getClientVendorCode(clientName) {
        if (!clientName) return '';
        const clients = this.getStoredClients();
        const client = clients.find(c => String(c.name || '').trim().toLowerCase() === clientName.toLowerCase());
        return client?.vendorCode || '';
    }

    generateVendorCode(location) {
        if (!location) return '';
        const clients = this.getStoredClients();
        const locationClients = clients.filter(c => String(c.location || '').trim() === location);
        const nextNumber = (locationClients.length + 1).toString().padStart(3, '0');
        return `${location}${nextNumber}`;
    }

    getClientByVendorCode(vendorCode) {
        if (!vendorCode) return null;
        const clients = this.getStoredClients();
        return clients.find(c => String(c.vendorCode || '').trim() === vendorCode.trim()) || null;
    }

    getLocationName(locationCode) {
        const locationMap = {
            'CHN': 'Chennai',
            'HSR': 'Hosur',
            'OST': 'Other state',
            'KAK': 'Karnataka',
            'OTN': 'Other Tamil Nadu'
        };
        return locationMap[locationCode] || locationCode;
    }

    generateProjectCode(serviceCode) {
        if (!serviceCode) return '';
        const currentYear = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of year
        const prefix = 'APJ';
        const projects = this.getStoredProjects();
        
        // Filter projects by current year and service code
        const yearServiceProjects = projects.filter(p => {
            const projectCode = String(p.identification?.projectCode || '');
            return projectCode.startsWith(prefix + currentYear + serviceCode);
        });
        
        // Get next sequence number
        const nextNumber = (yearServiceProjects.length + 1).toString().padStart(3, '0');
        
        return `${prefix}${currentYear}${serviceCode}${nextNumber}`;
    }

    saveInvoice(inv) {
        const i = inv || {};
        const no = String(i.no || '').trim();
        const client = String(i.client || '').trim();
        const amount = String(i.amount || '').trim();
        if (!no || !client || !amount) return { ok: false, message: 'Invoice no, client and amount are required.' };
        const items = this.getStoredInvoices();
        items.unshift({
            no,
            client,
            amount,
            due: String(i.due || 'Due soon').trim() || 'Due soon',
            status: String(i.status || 'Pending').trim() || 'Pending',
            color: String(i.color || 'amber').trim() || 'amber'
        });
        this.writeStore('bezent_invoices', items);
        return { ok: true };
    }

    setInvoiceStatus(invoice, nextStatus) {
        const no = String(invoice?.no || '').trim();
        if (!no) return { ok: false, message: 'Invoice no missing.' };
        const status = String(nextStatus || '').trim() || 'Pending';
        const color = status === 'Paid' ? 'emerald' : status === 'Overdue' ? 'rose' : 'amber';

        this.upsertStoredItem(
            'bezent_invoices',
            (x) => String(x?.no || '').trim().toLowerCase() === no.toLowerCase(),
            {
                ...invoice,
                no,
                status,
                color,
                due: status === 'Paid' ? 'Paid' : String(invoice?.due || 'Due soon')
            }
        );

        return { ok: true };
    }

    previewInvoice(invoice) {
        const i = invoice || {};
        this.openModal(`Invoice ${String(i.no || '').replace(/</g, '&lt;')}`, `
            <div class="text-sm" style="display:grid;gap:10px;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    <div>
                        <div style="font-size:12px;font-weight:700;color:#64748b;">Client</div>
                        <div style="margin-top:4px;font-weight:800;color:#0f172a;">${String(i.client || '—').replace(/</g, '&lt;')}</div>
                    </div>
                    <div>
                        <div style="font-size:12px;font-weight:700;color:#64748b;">Amount</div>
                        <div style="margin-top:4px;font-weight:800;color:#0f172a;">${String(i.amount || '—').replace(/</g, '&lt;')}</div>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    <div>
                        <div style="font-size:12px;font-weight:700;color:#64748b;">Status</div>
                        <div style="margin-top:4px;font-weight:800;color:#0f172a;">${String(i.status || '—').replace(/</g, '&lt;')}</div>
                    </div>
                    <div>
                        <div style="font-size:12px;font-weight:700;color:#64748b;">Due</div>
                        <div style="margin-top:4px;font-weight:800;color:#0f172a;">${String(i.due || '—').replace(/</g, '&lt;')}</div>
                    </div>
                </div>
                <div style="border-top:1px solid #e2e8f0;padding-top:10px;font-size:12px;color:#475569;">
                    Preview is a lightweight placeholder. Download will generate a text receipt.
                </div>
            </div>
        `, {
            submitLabel: 'Close',
            onSubmit: () => this.closeModal()
        });
    }

    downloadInvoice(invoice) {
        const i = invoice || {};
        const lines = [
            `Invoice: ${i.no || ''}`,
            `Client: ${i.client || ''}`,
            `Amount: ${i.amount || ''}`,
            `Status: ${i.status || ''}`,
            `Due: ${i.due || ''}`,
            '',
            'Generated by Bezent Dashboard'
        ];
        const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${String(i.no || 'invoice').trim() || 'invoice'}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 400);
    }

    parseCurrencyToNumber(value) {
        const raw = String(value || '').trim();
        if (!raw) return 0;
        const cleaned = raw.replace(/[^0-9.]/g, '');
        const n = Number(cleaned);
        return Number.isFinite(n) ? n : 0;
    }

    formatINR(value) {
        const n = Number(value);
        if (!Number.isFinite(n)) return '₹0';
        try {
            return '₹' + Math.round(n).toLocaleString('en-IN');
        } catch (_) {
            return '₹' + Math.round(n);
        }
    }

    downloadInvoicesExport(invoices) {
        const rows = (invoices || []).map(i => [
            i.no,
            i.client,
            i.amount,
            i.due,
            i.status
        ]);
        const lines = [
            ['Invoice', 'Client', 'Amount', 'Due', 'Status'].join(','),
            ...rows.map(r => r.map(x => `"${String(x || '').replace(/"/g, '""')}"`).join(','))
        ];
        const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoices_export.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 400);
    }

    openModal(title, bodyHtml, { onSubmit, submitLabel } = {}) {
        this.closeModal();
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.background = 'rgba(2, 6, 23, 0.55)';
        overlay.style.zIndex = '9998';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.padding = '16px';

        const card = document.createElement('div');
        card.style.width = 'min(92vw, 520px)';
        card.style.background = '#fff';
        card.style.borderRadius = '16px';
        card.style.boxShadow = '0 20px 60px rgba(2, 6, 23, 0.25)';
        card.style.overflow = 'hidden';

        card.innerHTML = `
            <div style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; gap: 12px;">
                <div style="font-size: 14px; font-weight: 800; color: #0f172a;">${String(title || '').replace(/</g, '&lt;')}</div>
                <button type="button" data-modal-close="1" style="appearance:none;border:none;background:#f1f5f9;color:#0f172a;border-radius:10px;padding:6px 10px;font-weight:700;cursor:pointer;">Close</button>
            </div>
            <form data-modal-form="1" style="padding: 16px; display:grid; gap: 12px;">
                ${bodyHtml || ''}
                <button type="submit" style="margin-top: 4px; width: 100%; background: #7c3aed; color: #fff; border: none; border-radius: 12px; padding: 10px 12px; font-weight: 800; cursor: pointer;">
                    ${String(submitLabel || 'Save').replace(/</g, '&lt;')}
                </button>
            </form>
        `;

        overlay.appendChild(card);
        document.body.appendChild(overlay);
        this._modalEl = overlay;

        const closeBtn = overlay.querySelector('button[data-modal-close]');
        closeBtn?.addEventListener('click', () => this.closeModal());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeModal();
        });
        document.addEventListener('keydown', this._modalKeyHandler = (e) => {
            if (e.key === 'Escape') this.closeModal();
        });

        const form = overlay.querySelector('form[data-modal-form]');
        if (form && typeof onSubmit === 'function') {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                onSubmit(form);
            });
        }
    }

    closeModal() {
        if (this._modalEl) {
            try { this._modalEl.remove(); } catch (_) {}
            this._modalEl = null;
        }
        if (this._modalKeyHandler) {
            document.removeEventListener('keydown', this._modalKeyHandler);
            this._modalKeyHandler = null;
        }
    }

    saveClientFromCurrentForm() {
        const name = document.getElementById('clientName')?.value || '';
        const owner = document.getElementById('clientOwner')?.value || '';
        const email = document.getElementById('clientEmail')?.value || '';
        const phone = document.getElementById('clientPhone')?.value || '';
        const industry = document.getElementById('clientIndustry')?.value || '';
        const leadSource = document.getElementById('clientLeadSource')?.value || '';
        const notes = document.getElementById('clientNotes')?.value || '';

        const res = this.saveClient({ name, owner, email, phone, industry, leadSource, notes, stage: 'Active', city: '—' });
        if (!res.ok) {
            this.showToast(res.message || 'Unable to save client.');
            return;
        }
        this.selectedClientName = String(name || '').trim();
        this.switchSection('leads');
        this.switchSubSection('client_directory');
        this.showToast('Client saved.');
    }

    saveProjectFromCurrentForm() {
        const client = document.getElementById('projectClient')?.value || '';
        const name = document.getElementById('projectName')?.value || '';
        const startDate = document.getElementById('projectStartDate')?.value || '';
        const duration = document.getElementById('projectDuration')?.value || '';
        const budget = document.getElementById('projectBudget')?.value || '';
        const team = document.getElementById('projectTeam')?.value || '';

        const res = this.saveProject({
            client,
            name,
            startDate,
            duration,
            budget,
            team,
            progress: 0,
            status: 'On Track',
            statusColor: 'emerald',
            owner: String(client || '').split(' ')[0] || '—',
            spent: '₹0'
        });
        if (!res.ok) {
            this.showToast(res.message || 'Unable to create project.');
            return;
        }
        this.switchSection('projects');
        this.switchSubSection('active');
        this.renderContent();
        this.initializeLucideIcons();
        this.showToast('Project created.');
    }

    createCampaignViaModal() {
        this.openModal('New Campaign', `
            <div>
                <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Campaign Name</label>
                <input name="name" required style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" placeholder="e.g., New Service Launch" />
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Audience</label>
                    <input name="audience" type="number" min="0" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" placeholder="0" />
                </div>
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Status</label>
                    <select name="status" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;">
                        <option>Draft</option>
                        <option>Scheduled</option>
                        <option>Sent</option>
                    </select>
                </div>
            </div>
        `, {
            submitLabel: 'Create Campaign',
            onSubmit: (form) => {
                const data = new FormData(form);
                const status = String(data.get('status') || 'Draft');
                const color = status === 'Sent' ? 'emerald' : status === 'Scheduled' ? 'amber' : 'slate';
                const res = this.saveCampaign({
                    name: data.get('name'),
                    audience: data.get('audience'),
                    open: 0,
                    click: 0,
                    status,
                    statusColor: color
                });
                if (!res.ok) {
                    this.showToast(res.message || 'Unable to create campaign.');
                    return;
                }
                this.closeModal();
                this.switchSection('campaigns');
                this.switchSubSection('email');
                this.renderContent();
                this.initializeLucideIcons();
                this.showToast('Campaign created.');
            }
        });
    }

    createInvoiceViaModal(prefillClient) {
        const client = String(prefillClient || '').trim();
        this.openModal('Create Invoice', `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Invoice No</label>
                    <input name="no" required style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" placeholder="INV-125" />
                </div>
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Amount</label>
                    <input name="amount" required style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" placeholder="₹42,000" />
                </div>
            </div>
            <div>
                <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Client</label>
                <input name="client" required style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" placeholder="Client name" value="${client.replace(/</g, '&lt;')}" />
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Status</label>
                    <select name="status" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;">
                        <option>Pending</option>
                        <option>Paid</option>
                        <option>Overdue</option>
                    </select>
                </div>
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Due</label>
                    <input name="due" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" placeholder="Due in 7 days" />
                </div>
            </div>
        `, {
            submitLabel: 'Create Invoice',
            onSubmit: (form) => {
                const data = new FormData(form);
                const status = String(data.get('status') || 'Pending');
                const color = status === 'Paid' ? 'emerald' : status === 'Overdue' ? 'rose' : 'amber';
                const res = this.saveInvoice({
                    no: data.get('no'),
                    client: data.get('client'),
                    amount: data.get('amount'),
                    due: data.get('due'),
                    status,
                    color
                });
                if (!res.ok) {
                    this.showToast(res.message || 'Unable to create invoice.');
                    return;
                }
                this.closeModal();
                this.switchSection('billing');
                this.switchSubSection('invoices');
                this.renderContent();
                this.initializeLucideIcons();
                this.showToast('Invoice created.');
            }
        });
    }

    setupActionDispatcher() {
        if (this._actionDispatcherAttached) return;
        this._actionDispatcherAttached = true;

        const isNativeHandled = (btn) => {
            if (!btn) return true;
            if (btn.classList.contains('nav-tab')) return true;
            if (btn.hasAttribute('data-subsection')) return true;
            if (btn.hasAttribute('data-target-section')) return true;
            const id = btn.id || '';
            if (
                id === 'sidebarToggle' ||
                id === 'sidebarCollapse' ||
                id === 'notificationToggle' ||
                id === 'profileToggle' ||
                id === 'logoutBtn' ||
                id === 'markAllReadBtn' ||
                id === 'viewAllNotificationsBtn'
            ) return true;
            return false;
        };

        const handleAction = (action) => {
            const a = String(action || '').trim();
            if (!a) return false;
            if (a.startsWith('nav:')) {
                const [section, subsection] = a.slice(4).split('/');
                const clientFilter = this._lastActionButton?.dataset?.invoiceClientFilter;
                if (clientFilter && section === 'billing' && subsection === 'invoices') {
                    this.invoiceClientFilter = String(clientFilter || '').trim() || null;
                }
                if (section) this.switchSection(section);
                if (subsection) this.switchSubSection(subsection);
                return true;
            }

            if (a.startsWith('project:dir:select:')) {
                const key = a.slice('project:dir:select:'.length);
                this.selectedProjectKey = key;

                try {
                    const stored = this.getStoredProjects();
                    const exists = stored.some(p => this.getProjectKey(p) === key);
                    if (!exists) {
                        const cached = this._projectsCacheByKey?.get(key);
                        if (cached) {
                            stored.unshift(this.ensureProjectModel(cached));
                            this.writeStore('bezent_projects', stored);
                        }
                    }
                } catch (_) {}

                this.renderContent();
                this.initializeLucideIcons();
                return true;
            }

            if (a.startsWith('project:save:')) {
                const key = a.slice('project:save:'.length);
                this.saveProjectByKey(key);
                this.showToast('Project saved.');
                return true;
            }

            if (a.startsWith('project:delete:')) {
                const key = a.slice('project:delete:'.length);
                if (confirm('Delete this project? This cannot be undone.')) {
                    this.deleteProjectByKey(key);
                    this.selectedProjectKey = null;
                    this.renderContent();
                    this.initializeLucideIcons();
                    this.showToast('Project deleted.');
                }
                return true;
            }

            if (a.startsWith('project:select:')) {
                const key = a.slice('project:select:'.length);
                this.selectedProjectKey = key;
                this.isProjectDetailOpen = true;

                try {
                    const stored = this.getStoredProjects();
                    const exists = stored.some(p => this.getProjectKey(p) === key);
                    if (!exists) {
                        const cached = this._projectsCacheByKey?.get(key);
                        if (cached) {
                            stored.unshift(this.ensureProjectModel(cached));
                            this.writeStore('bezent_projects', stored);
                        }
                    }
                } catch (_) {}

                this.renderContent();
                this.initializeLucideIcons();
                return true;
            }

            if (a === 'project:detail:close') {
                this.isProjectDetailOpen = false;
                this.renderContent();
                this.initializeLucideIcons();
                return true;
            }

            if (a === 'chat:open') {
                this.openChatPanel(this._lastActionButton);
                return true;
            }

            if (a === 'chat:close') {
                this.closeChatPanel();
                return true;
            }

            if (a === 'chat:toggle') {
                this.toggleChatPanel(this._lastActionButton);
                return true;
            }
            if (a === 'invoice:preview') {
                const btn = this._lastActionButton;
                const inv = {
                    no: btn?.dataset?.invoiceNo,
                    client: btn?.dataset?.invoiceClient,
                    amount: btn?.dataset?.invoiceAmount,
                    due: btn?.dataset?.invoiceDue,
                    status: btn?.dataset?.invoiceStatus,
                    color: btn?.dataset?.invoiceColor
                };
                this.previewInvoice(inv);
                return true;
            }
            if (a === 'invoice:download') {
                const btn = this._lastActionButton;
                const inv = {
                    no: btn?.dataset?.invoiceNo,
                    client: btn?.dataset?.invoiceClient,
                    amount: btn?.dataset?.invoiceAmount,
                    due: btn?.dataset?.invoiceDue,
                    status: btn?.dataset?.invoiceStatus,
                    color: btn?.dataset?.invoiceColor
                };
                this.downloadInvoice(inv);
                this.showToast('Invoice downloaded.');
                return true;
            }
            if (a === 'invoice:export') {
                const btn = this._lastActionButton;
                let invoices = [];
                try {
                    const raw = String(btn?.dataset?.invoicesJson || '[]');
                    const decoded = raw.includes('%') ? decodeURIComponent(raw) : raw;
                    invoices = JSON.parse(decoded || '[]');
                } catch (_) {
                    invoices = [];
                }
                this.downloadInvoicesExport(invoices);
                this.showToast('Invoices exported.');
                return true;
            }
            if (a === 'invoice:markPaid') {
                const btn = this._lastActionButton;
                const inv = {
                    no: btn?.dataset?.invoiceNo,
                    client: btn?.dataset?.invoiceClient,
                    amount: btn?.dataset?.invoiceAmount,
                    due: btn?.dataset?.invoiceDue,
                    status: btn?.dataset?.invoiceStatus,
                    color: btn?.dataset?.invoiceColor
                };
                const res = this.setInvoiceStatus(inv, 'Paid');
                if (!res.ok) {
                    this.showToast(res.message || 'Unable to mark paid.');
                    return true;
                }
                this.renderContent();
                this.initializeLucideIcons();
                this.showToast('Marked as Paid.');
                return true;
            }

            if (a === 'billing:clearInvoiceFilter') {
                this.invoiceClientFilter = null;
                this.renderContent();
                this.initializeLucideIcons();
                this.showToast('Invoice filter cleared.');
                return true;
            }

            if (a === 'task:create') {
                this.showToast('Task creation coming soon.');
                return true;
            }

            if (a === 'client:followup') {
                this.showToast('Follow-up logged.');
                return true;
            }

            if (a === 'client:note') {
                this.showToast('Note saved.');
                return true;
            }

            if (a === 'billing:sendBulkReminders') {
                this.showToast('Bulk reminders queued.');
                return true;
            }

            if (a === 'invoice:create') {
                this.createInvoiceViaModal();
                return true;
            }

            if (a === 'dashboard:scheduleCall') {
                this.showToast('Call scheduled.');
                return true;
            }

            if (a === 'lead:add') {
                this.showToast('Lead added.');
                return true;
            }

            if (a === 'client:register') {
                const registerMode = document.getElementById('registerMode')?.value || 'client';
                const nameEl = document.getElementById('clientName');
                const ownerEl = document.getElementById('clientOwner');
                const emailEl = document.getElementById('clientEmail');
                const phoneEl = document.getElementById('clientPhone');
                const industryEl = document.getElementById('clientIndustry');
                const leadSourceEl = document.getElementById('clientLeadSource');
                const locationEl = document.getElementById('clientLocation');
                const vendorCodeEl = document.getElementById('clientVendorCode');
                const notesEl = document.getElementById('clientNotes');

                if (!nameEl || !nameEl.value.trim()) {
                    this.showToast(registerMode === 'lead' ? 'Company is required.' : 'Client name is required.');
                    return true;
                }

                if (registerMode === 'lead') {
                    const leadRes = this.saveLead({
                        company: nameEl.value.trim(),
                        assignedTo: ownerEl?.value?.trim() || '',
                        contact: phoneEl?.value?.trim() || '',
                        source: leadSourceEl?.value?.trim() || 'LinkedIn',
                        stage: 'New Lead',
                        nextAction: 'Follow-up',
                        feedbackStatus: 'Pending',
                        history: [{ at: Date.now(), type: 'create', note: notesEl?.value?.trim() || '' }]
                    });
                    if (leadRes.ok) {
                        this.showToast('Lead saved.');
                        this.switchSection('leads');
                        this.switchSubSection('lead_directory');
                        this.renderContent();
                        this.initializeLucideIcons();
                    } else {
                        this.showToast(leadRes.message || 'Unable to save lead.');
                    }
                    return true;
                }

                const result = this.saveClient({
                    name: nameEl.value.trim(),
                    owner: ownerEl?.value?.trim() || '',
                    email: emailEl?.value?.trim() || '',
                    phone: phoneEl?.value?.trim() || '',
                    industry: industryEl?.value?.trim() || '',
                    leadSource: leadSourceEl?.value?.trim() || '',
                    location: locationEl?.value?.trim() || '',
                    vendorCode: vendorCodeEl?.value?.trim() || '',
                    notes: notesEl?.value?.trim() || '',
                    stage: 'Active',
                    city: '—'
                });

                if (result.ok) {
                    this.showToast('Client saved.');
                    this.switchSection('leads');
                    this.switchSubSection('client_directory');
                    this.renderContent();
                    this.initializeLucideIcons();
                } else {
                    this.showToast(result.message || 'Unable to save client.');
                }
                return true;
            }

            if (a === 'lead:register') {
                const company = document.getElementById('leadCompany')?.value?.trim() || '';
                const contact = document.getElementById('leadContact')?.value?.trim() || '';
                const source = document.getElementById('leadSource')?.value || 'LinkedIn';
                const assignedTo = document.getElementById('leadAssignedTo')?.value?.trim() || '';
                const nextAction = document.getElementById('leadNextAction')?.value?.trim() || 'Follow-up';
                if (!company) {
                    this.showToast('Company is required.');
                    return true;
                }
                const res = this.saveLead({ company, contact, source, assignedTo, nextAction, stage: 'New Lead', feedbackStatus: 'Pending' });
                if (res.ok) {
                    this.showToast('Lead saved.');
                    this.switchSection('leads');
                    this.switchSubSection('lead_directory');
                    this.renderContent();
                    this.initializeLucideIcons();
                } else {
                    this.showToast(res.message || 'Unable to save lead.');
                }
                return true;
            }

            if (a === 'lead:convert') {
                const btn = this._lastActionButton;
                const leadId = btn?.dataset?.leadId;
                const res = this.convertLeadToClient(leadId);
                if (res.ok) {
                    this.showToast('Lead converted to client.');
                    this.renderContent();
                    this.initializeLucideIcons();
                } else {
                    this.showToast(res.message || 'Unable to convert lead.');
                }
                return true;
            }

            if (a === 'lead:update') {
                const id = String(document.getElementById('leadDetailId')?.value || '').trim();
                if (!id) {
                    this.showToast('Select a lead first.');
                    return true;
                }

                const stage = String(document.getElementById('leadDetailStage')?.value || '').trim();
                const assignedTo = String(document.getElementById('leadDetailAssignedTo')?.value || '').trim();
                const nextAction = String(document.getElementById('leadDetailNextAction')?.value || '').trim();
                const feedbackStatus = String(document.getElementById('leadDetailFeedback')?.value || '').trim();
                const note = String(document.getElementById('leadDetailNote')?.value || '').trim();

                const all = this.getLeadsData();
                const lead = all.find(l => String(l?.id || '').trim().toLowerCase() === id.toLowerCase()) || {};

                const res = this.saveLead({
                    ...lead,
                    id,
                    stage: stage || lead.stage,
                    assignedTo: assignedTo || lead.assignedTo,
                    nextAction: nextAction || lead.nextAction,
                    feedbackStatus: feedbackStatus || lead.feedbackStatus,
                    history: [
                        ...(Array.isArray(lead.history) ? lead.history : []),
                        { at: Date.now(), type: 'update', note }
                    ]
                });

                if (res.ok) {
                    this.showToast('Lead updated.');
                    this.selectedLeadId = id;
                    this.renderContent();
                    this.initializeLucideIcons();
                } else {
                    this.showToast(res.message || 'Unable to update lead.');
                }
                return true;
            }

            if (a === 'project:register') {
                const clientEl = document.getElementById('projectClient');
                const vendorCodeEl = document.getElementById('vendorCode');
                const nameEl = document.getElementById('projectName');
                const startDateEl = document.getElementById('projectStartDate');
                const durationEl = document.getElementById('projectDuration');
                const budgetEl = document.getElementById('projectBudget');
                const teamEl = document.getElementById('projectTeam');
                const projectCodeEl = document.getElementById('projectCode');
                const serviceCodeEl = document.getElementById('serviceCode');
                const companyNameEl = document.getElementById('companyName');
                const projectDescriptionEl = document.getElementById('projectDescription');
                const partDescriptionEl = document.getElementById('partDescription');
                const locationEl = document.getElementById('projectLocation');
                const qtyEl = document.getElementById('projectQty');
                const projectLeadEl = document.getElementById('projectLead');
                const assignedByEl = document.getElementById('assignedBy');
                const assignedToEl = document.getElementById('assignedTo');

                const readVal = (id) => String(document.getElementById(id)?.value || '').trim();

                const trackingKeys = ['model2dStatus','model3dStatus','scan3dStatus','feaStatus','qcInspectionStatus','approvalStatus','glApprovalStatus','revisionStatus','deliveryReportStatus','sopDailyReportStatus'];
                const tracking = Object.fromEntries(trackingKeys.map(k => [k, readVal(`reg_tracking_${k}`) || 'Pending']));

                const monitoring = {
                    roadmapSubmitted: readVal('reg_monitoring_roadmapSubmitted') || 'No',
                    dashboardUpdated: readVal('reg_monitoring_dashboardUpdated') || 'No',
                    dailyReportUpdated: readVal('reg_monitoring_dailyReportUpdated') || 'No',
                    photoAttached: readVal('reg_monitoring_photoAttached') || 'No',
                    overallProjectStatus: readVal('reg_monitoring_overallProjectStatus') || 'Pending / Delayed',
                    postCompletionStatus: readVal('reg_monitoring_postCompletionStatus') || '',
                    physicalPartStatus: readVal('reg_monitoring_physicalPartStatus') || ''
                };

                const dispatch = {
                    dcDate: readVal('reg_dispatch_dcDate') || '',
                    dcNumber: readVal('reg_dispatch_dcNumber') || '',
                    deliveryStatus: readVal('reg_dispatch_deliveryStatus') || 'Pending',
                    deliveryDate: readVal('reg_dispatch_deliveryDate') || '',
                    deliveryConfirmation: readVal('reg_dispatch_deliveryConfirmation') || 'No'
                };

                const purchase = {
                    quotationDate: readVal('reg_purchase_quotationDate') || '',
                    quotationNumber: readVal('reg_purchase_quotationNumber') || '',
                    poDate: readVal('reg_purchase_poDate') || '',
                    poNumber: readVal('reg_purchase_poNumber') || '',
                    poValue: readVal('reg_purchase_poValue') || '',
                    convertedBy: readVal('reg_purchase_convertedBy') || '',
                    visitConducted: readVal('reg_purchase_visitConducted') || 'No'
                };

                const payment = {
                    invoiceDate: readVal('reg_payment_invoiceDate') || '',
                    invoiceNumber: readVal('reg_payment_invoiceNumber') || '',
                    invoiceAmount: readVal('reg_payment_invoiceAmount') || '',
                    pastInvoiceAmount: readVal('reg_payment_pastInvoiceAmount') || '',
                    paymentTerms: readVal('reg_payment_paymentTerms') || '',
                    paymentType: readVal('reg_payment_paymentType') || '',
                    paymentDueDate: readVal('reg_payment_paymentDueDate') || '',
                    paymentReceivedDate: readVal('reg_payment_paymentReceivedDate') || '',
                    paymentReceivedAmount: readVal('reg_payment_paymentReceivedAmount') || '',
                    balancePaymentDueDate: readVal('reg_payment_balancePaymentDueDate') || '',
                    balancePaymentAmount: readVal('reg_payment_balancePaymentAmount') || ''
                };

                const ratings = {
                    clientRating: readVal('reg_ratings_clientRating') || '',
                    jobRating: readVal('reg_ratings_jobRating') || '',
                    feedbackComments: readVal('reg_ratings_feedbackComments') || '',
                    qualityRating: readVal('reg_ratings_qualityRating') || '',
                    serviceRating: readVal('reg_ratings_serviceRating') || '',
                    performanceRating: readVal('reg_ratings_performanceRating') || '',
                    additionalNotes: readVal('reg_ratings_additionalNotes') || ''
                };

                if (!nameEl?.value?.trim()) {
                    this.showToast('Project name is required.');
                    return true;
                }
                const result = this.saveProject({
                    client: clientEl?.value?.trim() || '',
                    name: nameEl.value.trim(),
                    startDate: startDateEl?.value?.trim() || '',
                    duration: durationEl?.value?.trim() || '',
                    budget: budgetEl?.value?.trim() || '',
                    team: teamEl?.value?.trim() || '',
                    identification: {
                        projectCode: projectCodeEl?.value?.trim() || '',
                        serviceCode: serviceCodeEl?.value?.trim() || '',
                        vendorCode: vendorCodeEl?.value?.trim() || this.getClientVendorCode(clientEl?.value?.trim() || ''),
                        companyName: companyNameEl?.value?.trim() || '',
                        projectDescription: projectDescriptionEl?.value?.trim() || '',
                        partDescription: partDescriptionEl?.value?.trim() || '',
                        location: locationEl?.value?.trim() || '',
                        qty: qtyEl?.value?.trim() || '',
                        projectLead: projectLeadEl?.value?.trim() || '',
                        assignedBy: assignedByEl?.value?.trim() || '',
                        assignedTo: assignedToEl?.value?.trim() || ''
                    },
                    tracking,
                    monitoring,
                    dispatch,
                    purchase,
                    payment,
                    ratings
                });
                if (result.ok) {
                    this.showToast('Project created.');
                    this.switchSection('projects');
                    this.switchSubSection('active');
                    this.renderContent();
                    this.initializeLucideIcons();
                } else {
                    this.showToast(result.message || 'Failed to create project.');
                }
                return true;
            }

            if (a.startsWith('pipeline:open:')) {
                const id = a.slice('pipeline:open:'.length);
                this.showToast('Opening item.');
                if (id.startsWith('inv:')) {
                    const no = id.slice(4);
                    this.switchSection('billing');
                    this.switchSubSection('invoices');
                    this.renderContent();
                    this.initializeLucideIcons();
                    this.showToast(`Invoice ${no}`);
                    return true;
                }
                if (id.startsWith('proj:')) {
                    this.switchSection('projects');
                    this.switchSubSection('active');
                    this.renderContent();
                    this.initializeLucideIcons();
                    return true;
                }
                if (id.startsWith('cli:')) {
                    this.switchSection('leads');
                    this.switchSubSection('client_directory');
                    this.renderContent();
                    this.initializeLucideIcons();
                    return true;
                }
                return true;
            }
            if (a === 'client:edit') {
                const btn = this._lastActionButton;
                const clientName = btn?.dataset?.clientName;
                const clients = this.getClientsData();
                const c = clients.find(x => String(x?.name || '').trim() === String(clientName || '').trim());
                this.editClientViaModal(c || { name: clientName });
                return true;
            }
            if (a === 'client:delete') {
                const btn = this._lastActionButton;
                const clientName = btn?.dataset?.clientName;
                this.deleteClientViaModal(clientName);
                return true;
            }
            if (a === 'client:createInvoice') {
                const btn = this._lastActionButton;
                const clientName = btn?.dataset?.clientName;
                this.createInvoiceViaModal(clientName);
                return true;
            }
            if (a === 'campaign:preview') {
                const btn = this._lastActionButton;
                const name = btn?.dataset?.campaignName;
                const c = this.getCampaignByName(name) || { name };
                this.previewCampaign(c);
                return true;
            }
            if (a === 'campaign:send') {
                const btn = this._lastActionButton;
                const name = btn?.dataset?.campaignName;
                const res = this.setCampaignStatus(name, 'Sent');
                if (!res.ok) this.showToast(res.message || 'Unable to send campaign.');
                else this.showToast('Campaign sent.');
                this.renderContent();
                this.initializeLucideIcons();
                return true;
            }
            if (a === 'campaign:schedule') {
                const btn = this._lastActionButton;
                const name = btn?.dataset?.campaignName;
                const res = this.setCampaignStatus(name, 'Scheduled');
                if (!res.ok) this.showToast(res.message || 'Unable to schedule campaign.');
                else this.showToast('Campaign scheduled.');
                this.renderContent();
                this.initializeLucideIcons();
                return true;
            }
            if (a === 'campaign:duplicate') {
                const btn = this._lastActionButton;
                const name = btn?.dataset?.campaignName;
                const res = this.duplicateCampaignByName(name);
                if (!res.ok) this.showToast(res.message || 'Unable to duplicate campaign.');
                else this.showToast('Campaign duplicated.');
                this.renderContent();
                this.initializeLucideIcons();
                return true;
            }
            if (a === 'campaign:delete') {
                const btn = this._lastActionButton;
                const name = btn?.dataset?.campaignName;
                this.openModal('Delete Campaign', `
                    <div style="font-size:14px;color:#0f172a;">Delete <span style="font-weight:900;">${String(name || '').replace(/</g, '&lt;')}</span>?</div>
                    <div style="font-size:12px;color:#475569;">This removes it from your saved campaigns.</div>
                `, {
                    submitLabel: 'Delete',
                    onSubmit: () => {
                        const res = this.deleteCampaignByName(name);
                        if (!res.ok) this.showToast(res.message || 'Unable to delete campaign.');
                        this.closeModal();
                        this.renderContent();
                        this.initializeLucideIcons();
                        this.showToast('Campaign deleted.');
                    }
                });
                return true;
            }

            if (a === 'campaign:create') {
                this.createCampaignViaModal();
                return true;
            }

            if (a === 'toast') {
                return true;
            }
            return false;
        };

        this._handleAction = handleAction;

        if (!this._chatSendDelegated) {
            this._chatSendDelegated = true;

            document.addEventListener('click', (e) => {
                const target = e.target;
                if (!(target instanceof Element)) return;
                
                const sendBtn = target.closest('#bezentChatSend');
                if (sendBtn) {
                    e.stopPropagation();
                    const input = document.getElementById('bezentChatInput');
                    const val = String(input?.value || '');
                    if (input) input.value = '';
                    this.sendChatMessage(val);
                    return;
                }

                const presetBtn = target.closest('.bezent-preset-question');
                if (presetBtn) {
                    e.stopPropagation();
                    const question = presetBtn.getAttribute('data-question') || '';
                    this.sendChatMessage(question);
                    return;
                }
            });

            document.addEventListener('keydown', (e) => {
                const target = e.target;
                if (!(target instanceof HTMLElement)) return;
                if (target.id !== 'bezentChatInput') return;
                if (e.key !== 'Enter') return;
                e.preventDefault();
                const val = String((target).value || '');
                (target).value = '';
                this.sendChatMessage(val);
            });
        }

        if (!this._projectChangeDelegated) {
            this._projectChangeDelegated = true;
            document.addEventListener('change', (e) => {
                const target = e.target;
                if (!(target instanceof Element)) return;
                const el = target.closest('[data-project-key][data-project-field]');
                if (!el) return;
                const projectKey = el.getAttribute('data-project-key') || '';
                const field = el.getAttribute('data-project-field') || '';
                if (!projectKey || !field) return;
                const value = (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement)
                    ? el.value
                    : (el.getAttribute('value') || '');
                this.saveProjectByKey(projectKey);
            });
        }

        if (!this._clientLocationChangeDelegated) {
            this._clientLocationChangeDelegated = true;
            document.addEventListener('change', (e) => {
                const target = e.target;
                if (!(target instanceof HTMLElement)) return;
                if (target.id === 'clientLocation') {
                    const location = target.value;
                    const vendorCodeEl = document.getElementById('clientVendorCode');
                    if (vendorCodeEl) {
                        vendorCodeEl.value = this.generateVendorCode(location);
                    }
                }
            });
        }

        if (!this._vendorCodeAutoFillDelegated) {
            this._vendorCodeAutoFillDelegated = true;
            document.addEventListener('input', (e) => {
                const target = e.target;
                if (!(target instanceof HTMLElement)) return;
                if (target.id === 'vendorCode') {
                    const vendorCode = target.value.trim();
                    if (vendorCode.length >= 3) {
                        const client = this.getClientByVendorCode(vendorCode);
                        if (client) {
                            const clientEl = document.getElementById('projectClient');
                            const companyNameEl = document.getElementById('companyName');
                            const projectLeadEl = document.getElementById('projectLead');
                            const assignedByEl = document.getElementById('assignedBy');
                            
                            if (clientEl && !clientEl.value) {
                                clientEl.value = client.name || '';
                            }
                            if (companyNameEl && !companyNameEl.value) {
                                companyNameEl.value = client.name || '';
                            }
                            if (projectLeadEl && !projectLeadEl.value) {
                                projectLeadEl.value = client.owner || '';
                            }
                            if (assignedByEl && !assignedByEl.value) {
                                assignedByEl.value = client.owner || '';
                            }
                        }
                    }
                }
            });
        }

        if (!this._projectCodeAutoFillDelegated) {
            this._projectCodeAutoFillDelegated = true;
            document.addEventListener('change', (e) => {
                const target = e.target;
                if (!(target instanceof HTMLElement)) return;
                if (target.id === 'serviceCode') {
                    const serviceCode = target.value;
                    const projectCodeEl = document.getElementById('projectCode');
                    if (projectCodeEl) {
                        projectCodeEl.value = this.generateProjectCode(serviceCode);
                    }
                }
            });
        }

        document.addEventListener('click', (e) => {
            const target = e.target;
            if (!(target instanceof Element)) return;

            const btn = target.closest('button');
            if (btn) {
                if (btn.hasAttribute('data-subsection')) {
                    const subSection = btn.getAttribute('data-subsection') || btn.dataset.subsection;
                    if (subSection) {
                        this.switchSubSection(subSection);
                    }
                    return;
                }

                if (isNativeHandled(btn)) return;

                const explicit = btn.getAttribute('data-action');
                if (explicit) {
                    this._lastActionButton = btn;
                    const ok = handleAction(explicit);
                    if (ok) {
                        const msg = btn.getAttribute('data-toast');
                        if (msg) this.showToast(msg);
                        e.preventDefault();
                        return;
                    }
                }

                const label = (btn.textContent || '').replace(/\s+/g, ' ').trim();
                if (!label) return;
                
                // Skip preset question buttons
                if (btn.classList.contains('bezent-preset-question')) return;

                if (label === 'Monthly') {
                    this.switchSection('dashboard');
                    this.switchSubSection('overview');
                    this.showToast('Showing monthly view.');
                    e.preventDefault();
                    return;
                }
                if (label === 'Weekly') {
                    this.switchSection('dashboard');
                    this.switchSubSection('weekly');
                    this.showToast('Showing weekly view.');
                    e.preventDefault();
                    return;
                }
                if (label === 'Daily') {
                    this.switchSection('dashboard');
                    this.switchSubSection('daily');
                    this.showToast('Showing daily view.');
                    e.preventDefault();
                    return;
                }

                if (label === 'Save Client') {
                    this.saveClientFromCurrentForm();
                    e.preventDefault();
                    return;
                }

                if (label === 'Save Project') {
                    this.switchSection('projects');
                    this.switchSubSection('pipeline');
                    this.showToast('Project saved.');
                    e.preventDefault();
                    return;
                }

                if (label === 'Launch Campaign') {
                    this.switchSection('campaigns');
                    this.switchSubSection('email');
                    this.showToast('Campaign queued for launch.');
                    e.preventDefault();
                    return;
                }

                if (label === '+ New Campaign' || label === 'New Campaign' || label === '+ New Client' || label === 'Schedule Message') {
                    if (label.includes('Campaign')) {
                        this.createCampaignViaModal();
                        e.preventDefault();
                        return;
                    }
                    if (label.includes('Client')) {
                        this.switchSection('leads');
                        this.switchSubSection('client_registration');
                        this.showToast('Opening client registration.');
                        e.preventDefault();
                        return;
                    }
                    if (label.includes('Message')) {
                        this.switchSection('campaigns');
                        this.switchSubSection('sms');
                        this.showToast('Opening SMS/WhatsApp schedule.');
                        e.preventDefault();
                        return;
                    }
                }

                if (label === '+ Create Invoice' || label === 'Create Invoice') {
                    this.createInvoiceViaModal();
                    e.preventDefault();
                    return;
                }

                if (label === 'Create Project') {
                    this.saveProjectFromCurrentForm();
                    e.preventDefault();
                    return;
                }

                if (label === 'Generate Invoice' || label === 'Generate invoice') {
                    this.createInvoiceViaModal();
                    e.preventDefault();
                    return;
                }

                if (label === 'Create retention plan') {
                    this.switchSection('engagement');
                    this.switchSubSection('health');
                    this.showToast('Opening client health.');
                    e.preventDefault();
                    return;
                }

                if (label.startsWith('Join Meeting')) {
                    this.showToast('Joining meeting (demo).');
                    e.preventDefault();
                    return;
                }

                this.showToast('This action is not wired yet.');
                e.preventDefault();
                return;
            }

            const card = target.closest('.cursor-pointer');
            if (card) {
                const text = (card.textContent || '').replace(/\s+/g, ' ').trim();
                if (!text) return;

                if (text.includes('Schedule Call')) {
                    this.switchSection('engagement');
                    this.switchSubSection('followups');
                    this.showToast('Opening follow-ups to schedule a call.');
                    e.preventDefault();
                    return;
                }
                if (text.includes('Create Task')) {
                    this.switchSection('dashboard');
                    this.switchSubSection('work');
                    this.showToast("Opening today's work.");
                    e.preventDefault();
                    return;
                }
                if (text.includes('Add Lead')) {
                    this.switchSection('leads');
                    this.switchSubSection('lead_registration');
                    this.showToast('Opening lead registration.');
                    e.preventDefault();
                    return;
                }
            }
        }, true);
    }

    toggleChatPanel(anchorEl) {
        this.isChatOpen = !this.isChatOpen;
        this._chatAnchorEl = anchorEl || this._chatAnchorEl || null;
        this.renderChatPanel();
        this.initializeLucideIcons();
    }

    openChatPanel(anchorEl) {
        this.isChatOpen = true;
        this._chatAnchorEl = anchorEl || this._chatAnchorEl || null;
        this.renderChatPanel();
        this.initializeLucideIcons();
    }

    closeChatPanel() {
        this.isChatOpen = false;
        this.renderChatPanel();
        this.initializeLucideIcons();
    }

    renderChatPanel() {
        let el = document.getElementById('bezentChatPanel');
        if (!el) {
            el = document.createElement('div');
            el.id = 'bezentChatPanel';
            document.body.appendChild(el);
        }

        el.className = `fixed z-[60] w-[380px]`;
        el.style.display = this.isChatOpen ? 'block' : 'none';
        el.style.left = '';
        el.style.right = '';
        el.style.top = '';
        el.style.bottom = '';

        if (!this.isChatOpen) return;

        const sidebar = document.getElementById('appSidebar');
        const gap = 12;
        const width = 380;
        let left = 16;
        if (sidebar && sidebar.getBoundingClientRect) {
            const rect = sidebar.getBoundingClientRect();
            left = rect.right + gap;
        }
        const maxLeft = Math.max(8, window.innerWidth - width - 8);
        left = Math.min(Math.max(8, left), maxLeft);
        el.style.left = `${left}px`;
        el.style.bottom = '16px';

        const messages = Array.isArray(this.chatMessages) ? this.chatMessages : [];
        const bubbles = messages.length
            ? messages.map(m => {
                const role = m?.role === 'user' ? 'user' : 'assistant';
                const text = String(m?.text || '').replace(/</g, '&lt;');
                if (role === 'user') {
                    return `
                        <div class="flex items-start justify-end gap-2">
                            <div class="bg-purple-600 text-white rounded-xl px-3 py-2 text-sm max-w-[75%]">${text}</div>
                        </div>
                    `;
                }
                return `
                    <div class="flex items-start gap-2">
                        <div class="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                            <i data-lucide="sparkles" class="w-4 h-4 text-white"></i>
                        </div>
                        <div class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 max-w-[75%]">${text}</div>
                    </div>
                `;
            }).join('')
            : `
                <div class="flex items-start gap-2">
                    <div class="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                        <i data-lucide="sparkles" class="w-4 h-4 text-white"></i>
                    </div>
                    <div class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800">Hi! Ask me about Bezent (Leads, Clients, Projects, Billing).</div>
                </div>
            `;

        el.innerHTML = `
            <div class="bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden">
                <div class="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                            <i data-lucide="sparkles" class="w-4 h-4 text-white"></i>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-slate-900">Bezent</div>
                            <div class="text-xs text-slate-500">Assistant</div>
                        </div>
                    </div>
                    <button data-action="chat:close" class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>

                <div id="bezentChatMessages" class="p-4 space-y-3 max-h-80 overflow-y-auto">${bubbles}</div>

                <div class="p-3 border-t border-slate-200">
                    <div class="mb-2 flex flex-wrap gap-1">
                        ${[
                            'What is Bezent?',
                            'How to register a client?',
                            'How vendor code works?',
                            'How to create invoice?',
                            'Technical tracking statuses',
                            'Project monitoring fields',
                            'Payment tracking details'
                        ].map(q => `
                            <button class="bezent-preset-question px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors" data-question="${q.replace(/"/g, '&quot;')}">${q}</button>
                        `).join('')}
                    </div>
                    <div class="flex items-center gap-2">
                        <input id="bezentChatInput" class="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Type a message..." />
                        <button id="bezentChatSend" class="px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700">Send</button>
                    </div>
                </div>
            </div>
        `;

        this.initializeLucideIcons();

        const msgEl = document.getElementById('bezentChatMessages');
        if (msgEl) msgEl.scrollTop = msgEl.scrollHeight;

        const inputEl = document.getElementById('bezentChatInput');
        if (inputEl) inputEl.focus();
    }

    initializePredictionsChart() {
        const ctx = document.getElementById('predictionChart');
        if (ctx) {
            this.charts.predictionChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Next 7 days', 'Next 14 days', 'Next 30 days'],
                    datasets: [
                        {
                            label: 'Expected Revenue (₹)',
                            data: [145000, 310000, 620000],
                            backgroundColor: 'rgba(14, 165, 233, 0.65)'
                        },
                        {
                            label: 'Risk Amount (₹)',
                            data: [25000, 68000, 110000],
                            backgroundColor: 'rgba(244, 63, 94, 0.65)'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' }
                    },
                    scales: {
                        x: { grid: { display: false } },
                        y: { beginAtZero: true }
                    }
                }
            });
        }
    }

    initializeCampaignPerformanceChart() {
        const ctx = document.getElementById('campaignChart');
        if (ctx) {
            this.charts.campaignChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [
                        {
                            label: 'Open Rate %',
                            data: [24, 28, 31, 29],
                            borderColor: '#6366f1',
                            backgroundColor: 'rgba(99, 102, 241, 0.12)',
                            tension: 0.35
                        },
                        {
                            label: 'Click Rate %',
                            data: [6, 7, 8, 7],
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.10)',
                            tension: 0.35
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });
        }
    }

    initializeWeeklyChart() {
        const ctx = document.getElementById('weeklyChart');
        if (ctx) {
            this.charts.weeklyChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [
                        {
                            label: 'Leads',
                            data: [6, 5, 15, 4, 9, 2, 1],
                            backgroundColor: 'rgba(99, 102, 241, 0.7)'
                        },
                        {
                            label: 'Deals',
                            data: [1, 1, 4, 0, 5, 0, 0],
                            backgroundColor: 'rgba(16, 185, 129, 0.7)'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' }
                    },
                    scales: {
                        x: { grid: { display: false } },
                        y: { beginAtZero: true }
                    }
                }
            });
        }
    }

    initializeInvoiceStatusChart() {
        const dataAttr = document.getElementById('invoiceStatusChartData');
        let paid = 0, overdue = 0, pending = 0;
        try {
            if (dataAttr) {
                const parsed = JSON.parse(dataAttr.textContent || '{}');
                paid = Number(parsed.paid || 0);
                overdue = Number(parsed.overdue || 0);
                pending = Number(parsed.pending || 0);
            }
        } catch (_) {}

        const ctx = document.getElementById('invoiceStatusChart');
        if (ctx) {
            this.charts.invoiceStatusChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Paid', 'Overdue', 'Pending'],
                    datasets: [{
                        data: [paid, overdue, pending],
                        backgroundColor: ['#10b981', '#f43f5e', '#f59e0b']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    rotation: -90,
                    animation: {
                        duration: 900,
                        animateRotate: true,
                        animateScale: true
                    },
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });

            this.startChartRotation('invoiceStatusChart', this.charts.invoiceStatusChart, { speed: 0.003 });
        }
    }

    initializeRevenuePieChart() {
        const ctx = document.getElementById('revenuePieChart');
        if (ctx) {
            this.charts.revenuePieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Consulting', 'SEO', 'Social Media', 'Content', 'Email'],
                    datasets: [{
                        data: [460000, 450000, 380000, 290000, 220000],
                        backgroundColor: ['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#f43f5e']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });
        }
    }

    init() {
        this.setupNavigation();
        this.renderSidebar();
        this.renderContent();
        this.initializeLucideIcons();
        this.setupEventListeners();
        this.applyLoggedInUser();
    }

    setupNavigation() {
        // Handle top navigation clicks
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.switchSection(section);
            });
        });
    }

    switchSection(section) {
        this.currentSection = section;
        
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('bg-purple-50', 'text-purple-700');
            tab.classList.add('text-slate-600', 'hover:text-slate-900', 'hover:bg-slate-50');
        });
        
        const activeTab = document.querySelector(`[data-section="${section}"]`);
        if (activeTab) {
            activeTab.classList.remove('text-slate-600', 'hover:text-slate-900', 'hover:bg-slate-50');
            activeTab.classList.add('bg-purple-50', 'text-purple-700');
        }
        
        // Reset sub-section to default for each section
        this.currentSubSection = this.getDefaultSubSection(section);
        
        // Update sidebar and content
        this.renderSidebar();
        this.renderContent();
        
        // Re-initialize icons
        this.initializeLucideIcons();
        this.closeMobileSidebar();
    }

    switchSubSection(subSection) {
        if (this.currentSection === 'projects') {
            const removed = new Set(['po_tracker', 'engineering_workflow', 'material_io', 'bom_stock', 'project_code']);
            if (removed.has(subSection)) subSection = 'active';
        }
        this.currentSubSection = subSection;
        this.renderSidebar();
        this.renderContent();
        this.initializeLucideIcons();
        this.closeMobileSidebar();
    }

    closeMobileSidebar() {
        const sidebar = document.getElementById('appSidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (!sidebar || !overlay) return;
        if (window.matchMedia('(min-width: 768px)').matches) return;
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    }

    getDefaultSubSection(section) {
        const defaults = {
            dashboard: 'overview',
            leads: 'registration',
            projects: 'pipeline',
            campaigns: 'email',
            billing: 'invoices',
            engagement: 'followups',
            reports: 'revenue',
            ai: 'insights'
        };
        return defaults[section] || 'overview';
    }

    renderSidebar() {
        const sidebarNav = document.getElementById('sidebar-nav');
        const subNavItems = this.getSubNavigationItems(this.currentSection);

        const icons = {
            dashboard: { overview: 'layout-dashboard', daily: 'calendar-days', weekly: 'bar-chart-3', analytics: 'pie-chart', work: 'check-square', sop: 'list-checks' },
            leads: { registration: 'user-plus', client_registration: 'user-plus', clients: 'users', tracking: 'radar', details: 'file-text', lead_registration: 'user-plus', lead_directory: 'users-round', lead_sources: 'pie-chart', lead_pipeline: 'kanban-square', indiamart: 'clock', categorization: 'tags', smart_feedback: 'messages-square', greetings: 'calendar-heart', lead_sla: 'timer' },
            projects: { registration: 'folder-plus', directory: 'folder', pipeline: 'kanban-square', active: 'gantt-chart', completed: 'badge-check', quotation_templates: 'file-text' },
            campaigns: { email: 'mail', sms: 'message-square', wishes: 'calendar-heart', reengagement: 'refresh-cw', marketing_hub: 'globe', seo: 'search', content_library: 'library', maps_reviews: 'map-pin', linkedin_leads: 'linkedin' },
            billing: { invoices: 'file-text', quotations: 'file-text', contracts: 'file-signature', payments: 'credit-card', followup_log: 'clipboard-list', overdue_risk: 'alert-triangle' },
            engagement: { followups: 'phone-call', surveys: 'clipboard-check', health: 'heart-pulse', reengagement: 'sparkles', field_visits: 'map', route_map: 'route', mobile_sync: 'smartphone', followup_sla: 'timer' },
            reports: { revenue: 'bar-chart', funnel: 'filter', roi: 'line-chart', ltv: 'badge-dollar-sign', sop_monthly: 'calendar', kpi_target: 'target', kri_risk: 'shield-alert', team_scorecard: 'users', project_roadmap: 'milestone' },
            ai: { insights: 'sparkles', workflows: 'workflow', alerts: 'bell-dot', predictions: 'brain', lead_prediction: 'radar', best_email_timing: 'clock', auto_followup: 'calendar-clock', content_generator: 'wand-2' }
        };
        const getIcon = (id) => (icons[this.currentSection] && icons[this.currentSection][id]) ? icons[this.currentSection][id] : 'dot';
        
        sidebarNav.innerHTML = `
            <div class="flex flex-col h-full min-h-[calc(100vh-8rem)]">
                <div>
                    <h2 class="sidebar-title text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        ${this.currentSection.charAt(0).toUpperCase() + this.currentSection.slice(1)}
                    </h2>
                    ${subNavItems.map(item => `
                        <button class="sidebar-item w-full flex items-center gap-3 text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors mb-1
                            ${item.id === this.currentSubSection 
                                ? 'bg-purple-50 text-purple-700' 
                                : 'text-slate-700 hover:bg-slate-50'}"
                            data-subsection="${item.id}">
                            <i data-lucide="${getIcon(item.id)}" class="w-4 h-4"></i>
                            <span class="sidebar-label">${item.label}</span>
                        </button>
                    `).join('')}
                </div>

                <div class="mt-auto pt-3">
                    <button data-action="chat:open" class="sidebar-item w-full flex items-center gap-3 text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors text-slate-700 hover:bg-slate-50">
                        <i data-lucide="message-circle" class="w-4 h-4 text-purple-600"></i>
                        <span class="sidebar-label">Bezent</span>
                    </button>
                </div>
            </div>
        `;

    }

    getSubNavigationItems(section) {
        const navigation = {
            dashboard: [
                { id: 'overview', label: 'Overview' },
                { id: 'daily', label: 'Daily / Weekly ' },
                { id: 'analytics', label: 'Overall Analytics' },
                { id: 'work', label: "Today's Work" }
            ],
            leads: [
                { id: 'registration', label: 'Registration' },
                { id: 'clients', label: 'Directory' },
                { id: 'tracking', label: 'Contacts' }
            ],
            projects: [
                { id: 'registration', label: 'Project Registration' },
                { id: 'directory', label: 'Project Directory' },
                { id: 'pipeline', label: 'Sales Pipeline' },
                { id: 'active', label: 'Active Projects' },
                { id: 'completed', label: 'Completed Projects' },
                { id: 'quotation_templates', label: 'Quotation Templates' }
            ],
            campaigns: [
                { id: 'email', label: 'Email Campaigns' },
                { id: 'sms', label: 'SMS & WhatsApp' },
                { id: 'wishes', label: 'Personalized Wishes' },
                { id: 'reengagement', label: 'Re-engagement' },
                { id: 'marketing_hub', label: 'Digital Marketing Hub' },
                { id: 'seo', label: 'SEO Tracker' },
                { id: 'content_library', label: 'Content Library' },
                { id: 'maps_reviews', label: 'Google Maps Reviews' },
                { id: 'linkedin_leads', label: 'LinkedIn Lead Gen Tracker' }
            ],
            billing: [
                { id: 'invoices', label: 'Invoices' },
                { id: 'quotations', label: 'Quotations' },
                { id: 'contracts', label: 'Contracts' },
                { id: 'payments', label: 'Payment Status' },
                { id: 'followup_log', label: 'Payment Follow-up Log' },
                { id: 'overdue_risk', label: 'Overdue Risk Dashboard' }
            ],
            engagement: [
                { id: 'followups', label: 'Follow-ups' },
                { id: 'surveys', label: 'Feedback & Surveys' },
                { id: 'health', label: 'Client Health' },
                { id: 'reengagement', label: 'Next Projects' },
                { id: 'field_visits', label: 'Field Visits Planner' },
                { id: 'route_map', label: 'Visit Route Map' },
                { id: 'mobile_sync', label: 'Mobile Sync Visits' },
                { id: 'followup_sla', label: 'Follow-up Tracker (SLA)' }
            ],
            reports: [
                { id: 'revenue', label: 'Revenue Reports' },
                { id: 'funnel', label: 'Funnel Reports' },
                { id: 'roi', label: 'Campaign ROI' },
                { id: 'ltv', label: 'Client Lifetime Value' },
                { id: 'sop_monthly', label: 'SOP Monthly Report' },
                { id: 'kpi_target', label: 'KPI vs Target Report' },
                { id: 'kri_risk', label: 'KRI Risk Monitor' },
                { id: 'team_scorecard', label: 'Team Performance Scorecard' },
                { id: 'project_roadmap', label: 'Project Roadmap Report' }
            ],
            ai: [
                { id: 'insights', label: 'AI Insights' },
                { id: 'workflows', label: 'Workflow Automation' },
                { id: 'alerts', label: 'Alerts & Actions' },
                { id: 'predictions', label: 'Predictions' },
                { id: 'lead_prediction', label: 'Lead Prediction Engine' },
                { id: 'best_email_timing', label: 'Best Email Timing AI' },
                { id: 'auto_followup', label: 'Auto Follow-up Scheduler' },
                { id: 'content_generator', label: 'AI Content Generator' }
            ]
        };
        
        return navigation[section] || [];
    }

    renderContent() {
        const mainContent = document.getElementById('main-content');
        
        switch(this.currentSection) {
            case 'dashboard':
                this.renderDashboardContent(mainContent);
                break;
            case 'leads':
                this.renderLeadsContent(mainContent);
                break;
            case 'projects':
                this.renderProjectsContent(mainContent);
                break;
            case 'campaigns':
                this.renderCampaignsContent(mainContent);
                break;
            case 'billing':
                this.renderBillingContent(mainContent);
                break;
            case 'engagement':
                this.renderEngagementContent(mainContent);
                break;
            case 'reports':
                this.renderReportsContent(mainContent);
                break;
            case 'ai':
                this.renderAIContent(mainContent);
                break;
            default:
                mainContent.innerHTML = '<div class="text-center text-slate-500">Section not found</div>';
        }

        this.afterRender();
    }

    afterRender() {
        this.destroyCharts();

        if (this.currentSection === 'dashboard' && this.currentSubSection === 'overview') {
            this.initializeRevenueChart();
        }

        if (this.currentSection === 'dashboard' && this.currentSubSection === 'weekly') {
            this.initializeWeeklyChart();
        }

        if (this.currentSection === 'dashboard' && this.currentSubSection === 'analytics') {
            this.initializeRevenuePieChart();
        }

        if (this.currentSection === 'projects' && this.currentSubSection === 'active') {
            this.initializeBudgetVsSpentChart();
        }

        if (this.currentSection === 'billing' && this.currentSubSection === 'invoices') {
            this.initializeInvoiceStatusChart();
        }

        if (this.currentSection === 'campaigns' && this.currentSubSection === 'email') {
            this.initializeCampaignPerformanceChart();
        }

        if (this.currentSection === 'reports' && this.currentSubSection === 'revenue') {
            this.initializeRevenueReportChart();
        }

        if (this.currentSection === 'ai' && this.currentSubSection === 'predictions') {
            this.initializePredictionsChart();
        }

        if (this.currentSection === 'leads' && this.currentSubSection === 'clients') {
            this.setupClientDirectoryInteractions();
        }

        if (this.currentSection === 'leads' && this.currentSubSection === 'lead_directory') {
            this.setupLeadDirectoryInteractions();
        }

        if (this.currentSection === 'leads' && this.currentSubSection === 'tracking') {
            this.setupContactsInteractions();
        }
    }

    setupClientDirectoryInteractions() {
        const rows = document.querySelectorAll('tr[data-client-name]');
        rows.forEach(row => {
            row.addEventListener('click', () => {
                const name = row.dataset.clientName;
                if (!name) return;
                this.selectedClientName = name;
                this.renderContent();
                this.initializeLucideIcons();
            });
        });
    }

    setupLeadDirectoryInteractions() {
        const rows = document.querySelectorAll('tr[data-lead-id]');
        rows.forEach(row => {
            row.addEventListener('click', (e) => {
                const target = e.target;
                if (target instanceof Element && target.closest('button[data-action="lead:convert"]')) return;
                const id = row.dataset.leadId;
                if (!id) return;
                this.selectedLeadId = id;
                this.renderContent();
                this.initializeLucideIcons();
            });
        });

        const clearBtn = document.getElementById('clearLeadSelection');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.selectedLeadId = null;
                this.renderContent();
                this.initializeLucideIcons();
            });
        }
    }

    destroyCharts() {
        this.stopChartRotation('invoiceStatusChart');
        Object.values(this.charts).forEach(chart => {
            try { chart.destroy(); } catch (_) {}
        });
        this.charts = {};
    }

    renderDashboardContent(container) {
        switch(this.currentSubSection) {
            case 'overview':
                container.innerHTML = this.getDashboardOverview();
                break;
            case 'daily':
                container.innerHTML = this.getDashboardDaily();
                break;
            case 'weekly':
                container.innerHTML = this.getDashboardWeekly();
                break;
            case 'analytics':
                container.innerHTML = this.getDashboardAnalytics();
                break;
            case 'work':
                container.innerHTML = this.getDashboardWork();
                break;
            case 'sop':
                container.innerHTML = this.getDashboardSopChecklist();
                break;
            default:
                this.currentSubSection = 'overview';
                container.innerHTML = this.getDashboardOverview();
                break;
        }
    }

    getPlaceholderScreen(title, subtitle) {
        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">${title}</h2>
                        <p class="text-sm text-slate-500">${subtitle || ''}</p>
                    </div>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Action</button>
                </div>
                <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                    <div class="text-sm text-slate-700">Coming soon.</div>
                </div>
            </div>
        `;
    }

    getLeadsRegistrationHub() {
        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Registration</h2>
                        <p class="text-sm text-slate-500">Choose what you want to register</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button data-action="nav:leads/lead_registration" class="text-left bg-white rounded-lg border border-slate-200 p-6 shadow-lg hover:bg-slate-50 transition-colors">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                <i data-lucide="user-plus" class="w-6 h-6 text-purple-600"></i>
                            </div>
                            <div>
                                <div class="text-lg font-semibold text-slate-900">Leads Registration</div>
                                <div class="text-sm text-slate-600 mt-1">Capture lead source and details</div>
                            </div>
                        </div>
                    </button>

                    <button data-action="nav:leads/client_registration" class="text-left bg-white rounded-lg border border-slate-200 p-6 shadow-lg hover:bg-slate-50 transition-colors">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                                <i data-lucide="users" class="w-6 h-6 text-emerald-600"></i>
                            </div>
                            <div>
                                <div class="text-lg font-semibold text-slate-900">Client Registration</div>
                                <div class="text-sm text-slate-600 mt-1">Create a client profile and capture requirements</div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        `;
    }

    getDashboardSopChecklist() {
        const checklist = [
            { label: 'LinkedIn Post Done (1/day)', done: true },
            { label: 'New Connections (20–30/day)', done: false },
            { label: 'Outreach Messages (25/day)', done: false },
            { label: 'IndiaMART Follow-ups Done', done: true },
            { label: 'CRM Updated', done: false },
            { label: 'Competitor Monitoring Logged', done: false }
        ];
        const completed = checklist.filter(x => x.done).length;
        const pct = Math.round((completed / checklist.length) * 100);
        const cards = [
            { label: 'Leads Captured Today', value: '8' },
            { label: 'Calls Made', value: '22' },
            { label: 'Emails Sent', value: '16' },
            { label: 'Meetings Scheduled', value: '3' },
            { label: 'Quotations Created', value: '2' },
            { label: 'Payment Follow-ups Done', value: '5' }
        ];

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">SOP Daily Checklist</h2>
                        <p class="text-sm text-slate-500">Complete SOP and submit daily report</p>
                    </div>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Submit Daily Report</button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-slate-900">Checklist</h3>
                            <span class="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-full">${pct}%</span>
                        </div>
                        <div class="mt-4 w-full bg-slate-100 rounded-full h-2">
                            <div class="bg-purple-600 h-2 rounded-full" style="width: ${pct}%"></div>
                        </div>
                        <div class="mt-5 space-y-3">
                            ${checklist.map(item => `
                                <label class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <input type="checkbox" ${item.done ? 'checked' : ''} class="w-4 h-4 text-purple-600 rounded focus:ring-purple-500">
                                    <span class="text-sm ${item.done ? 'text-slate-900' : 'text-slate-700'}">${item.label}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900">Daily Output Summary</h3>
                        <div class="mt-4 grid grid-cols-2 gap-4">
                            ${cards.map(c => `
                                <div class="p-4 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">${c.label}</div>
                                    <div class="text-2xl font-semibold text-slate-900 mt-1">${c.value}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getDashboardManagerDashboard() {
        return this.getPlaceholderScreen('Manager Dashboard', 'KPI cards, leaderboard, funnel, top clients and alerts');
    }

    getDashboardDeliveryTracker() {
        const rows = [
            { name: 'SEO Revamp', stage: 'QC', date: 'Feb 28', delay: 2, eng: 'Asha', status: 'At Risk', color: 'amber' },
            { name: 'Lead Nurture Automation', stage: '3D', date: 'Mar 05', delay: 0, eng: 'Rohan', status: 'On Track', color: 'emerald' },
            { name: 'Store Launch Ads', stage: 'Estimation', date: 'Mar 10', delay: 5, eng: 'Sarah', status: 'Delayed', color: 'rose' }
        ];
        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Delivery Tracker</h2>
                        <p class="text-sm text-slate-500">Timeline + delay tracker</p>
                    </div>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Export</button>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-slate-50 text-slate-600">
                                <tr>
                                    <th class="text-left px-4 py-3 font-medium">Project Name</th>
                                    <th class="text-left px-4 py-3 font-medium">Stage</th>
                                    <th class="text-left px-4 py-3 font-medium">Delivery Date</th>
                                    <th class="text-left px-4 py-3 font-medium">Delay Days</th>
                                    <th class="text-left px-4 py-3 font-medium">Assigned Engineer</th>
                                    <th class="text-left px-4 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200">
                                ${rows.map(r => `
                                    <tr class="hover:bg-slate-50">
                                        <td class="px-4 py-3 font-medium text-slate-900">${r.name}</td>
                                        <td class="px-4 py-3 text-slate-700">${r.stage}</td>
                                        <td class="px-4 py-3 text-slate-700">${r.date}</td>
                                        <td class="px-4 py-3 text-slate-700">${r.delay}</td>
                                        <td class="px-4 py-3 text-slate-700">${r.eng}</td>
                                        <td class="px-4 py-3"><span class="px-2 py-1 text-xs font-medium bg-${r.color}-50 text-${r.color}-700 rounded-full">${r.status}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    getDashboardOverview() {
        return `
            <div class="space-y-6 fade-in">
                <!-- KPI Cards -->
                <div class="grid grid-cols-5 gap-4">
                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <i data-lucide="users" class="w-8 h-8 text-sky-600"></i>
                            <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">12%</span>
                        </div>
                        <div class="text-2xl font-semibold text-slate-900 mb-1">8</div>
                        <div class="text-sm text-slate-600">New Leads Today</div>
                        <div class="text-xs text-slate-500 mt-2">vs yesterday</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <i data-lucide="briefcase" class="w-8 h-8 text-indigo-600"></i>
                            <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">3 new</span>
                        </div>
                        <div class="text-2xl font-semibold text-slate-900 mb-1">14</div>
                        <div class="text-sm text-slate-600">Active Projects</div>
                        <div class="text-xs text-slate-500 mt-2">this week</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <i data-lucide="indian-rupee" class="w-8 h-8 text-emerald-600"></i>
                            <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">27%</span>
                        </div>
                        <div class="text-2xl font-semibold text-slate-900 mb-1">₹4,85,000</div>
                        <div class="text-sm text-slate-600">Revenue This Month</div>
                        <div class="text-xs text-slate-500 mt-2">vs last month</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <i data-lucide="credit-card" class="w-8 h-8 text-amber-600"></i>
                            <span class="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">4 overdue</span>
                        </div>
                        <div class="text-2xl font-semibold text-slate-900 mb-1">₹1,25,000</div>
                        <div class="text-sm text-slate-600">Pending Payments</div>
                        <div class="text-xs text-slate-500 mt-2">invoices</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <i data-lucide="target" class="w-8 h-8 text-rose-600"></i>
                            <span class="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">-5%</span>
                        </div>
                        <div class="text-2xl font-semibold text-slate-900 mb-1">74%</div>
                        <div class="text-sm text-slate-600">Client Retention</div>
                        <div class="text-xs text-slate-500 mt-2">vs last quarter</div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="grid grid-cols-3 gap-6">
                    <!-- Revenue Trend Chart -->
                    <div class="col-span-2 bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h3 class="text-lg font-semibold text-slate-900">Revenue Trend</h3>
                                <p class="text-sm text-slate-500">Monthly revenue vs target</p>
                            </div>
                            <div class="flex gap-2">
                                <button class="px-3 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-md">Monthly</button>
                                <button class="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md">Weekly</button>
                                <button class="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md">Daily</button>
                            </div>
                        </div>
                        <div class="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                            <canvas id="revenueChart"></canvas>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
                        <div class="space-y-3 max-h-80 overflow-y-auto">
                            ${this.getRecentActivityItems()}
                        </div>
                    </div>
                </div>

                <!-- Sales Funnel -->
                <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-slate-900">Sales Funnel</h3>
                        <p class="text-sm text-slate-500">Lead conversion through pipeline stages</p>
                    </div>
                    <div class="grid grid-cols-5 gap-4">
                        ${this.getSalesFunnelStages()}
                    </div>
                </div>
            </div>
        `;
    }

    getRecentActivityItems() {
        const activities = [
            { text: "New client registered: TechNova Solutions", time: "5 mins ago", color: "green" },
            { text: "Invoice INV-102 overdue by 3 days", time: "12 mins ago", color: "red" },
            { text: "Meeting scheduled with GreenLeaf Industries", time: "28 mins ago", color: "blue" },
            { text: "Campaign 'CRM Upgrade' sent to 45 clients", time: "1 hour ago", color: "purple" },
            { text: "Payment received from EduSpark: ₹85,000", time: "2 hours ago", color: "green" },
            { text: "New lead: Mumbai Retail Chain", time: "3 hours ago", color: "blue" },
            { text: "Task completed: Quarterly Report", time: "4 hours ago", color: "green" },
            { text: "Proposal accepted by Digital Dreams", time: "5 hours ago", color: "purple" }
        ];

        return activities.map(activity => `
            <div class="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div class="w-2 h-2 bg-${activity.color}-500 rounded-full mt-2 flex-shrink-0"></div>
                <div class="flex-1">
                    <p class="text-sm text-slate-700">${activity.text}</p>
                    <p class="text-xs text-slate-500 mt-1">${activity.time}</p>
                </div>
            </div>
        `).join('');
    }

    getSalesFunnelStages() {
        const stages = [
            { name: "Leads", count: 450, conversion: null },
            { name: "Qualified", count: 280, conversion: "62%" },
            { name: "Proposals", count: 156, conversion: "56%" },
            { name: "Deals", count: 89, conversion: "57%" },
            { name: "Projects", count: 67, conversion: "75%" }
        ];

        const colors = ["sky-500", "indigo-500", "emerald-500", "amber-500", "rose-500"];
        const maxHeight = 100;

        return stages.map((stage, index) => {
            const height = index === 0 ? maxHeight : Math.max((stage.count / 450) * maxHeight, 40);
            return `
                <div class="text-center">
                    <div class="h-32 flex items-end justify-center mb-4">
                        <div class="w-full bg-${colors[index]} rounded-t-lg transition-all hover:opacity-80"
                             style="height: ${height}%"></div>
                    </div>
                    <div class="text-lg font-semibold text-slate-900">${stage.count}</div>
                    <div class="text-sm text-slate-600">${stage.name}</div>
                    ${stage.conversion ? `<div class="text-xs text-slate-700 font-medium">${stage.conversion}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    getDashboardDaily() {
        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Daily View</h2>
                        <p class="text-sm text-slate-500">Today’s schedule, quick actions, and daily summary</p>
                    </div>
                    <div class="flex gap-2">
                        <button data-action="nav:dashboard/daily" class="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg">Daily</button>
                        <button data-action="nav:dashboard/weekly" class="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg">Weekly</button>
                    </div>
                </div>

                <!-- Summary Cards -->
                <div class="grid grid-cols-4 gap-4">
                    <div class="bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg p-6 text-white">
                        <i data-lucide="phone" class="w-8 h-8 mb-3 opacity-80"></i>
                        <div class="text-3xl font-semibold mb-1">4</div>
                        <div class="text-sm opacity-90">Calls Scheduled</div>
                    </div>
                    
                    <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
                        <i data-lucide="calendar" class="w-8 h-8 mb-3 opacity-80"></i>
                        <div class="text-3xl font-semibold mb-1">3</div>
                        <div class="text-sm opacity-90">Meetings Today</div>
                    </div>
                    
                    <div class="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-6 text-white">
                        <i data-lucide="check-square" class="w-8 h-8 mb-3 opacity-80"></i>
                        <div class="text-3xl font-semibold mb-1">6</div>
                        <div class="text-sm opacity-90">Tasks Due Today</div>
                    </div>
                    
                    <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-6 text-white">
                        <i data-lucide="indian-rupee" class="w-8 h-8 mb-3 opacity-80"></i>
                        <div class="text-3xl font-semibold mb-1">₹45,000</div>
                        <div class="text-sm opacity-90">Payments Expected</div>
                    </div>
                </div>

                <!-- Today's Schedule -->
                <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-slate-900">Today's Schedule</h3>
                        <span class="px-3 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-full">Upcoming</span>
                    </div>
                    
                    <div class="space-y-4">
                        ${this.getTodayScheduleItems()}
                    </div>
                    
                    <button data-action="toast" class="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                        Join Meeting →
                    </button>
                </div>

                <!-- Quick Actions -->
                <div class="grid grid-cols-3 gap-4">
                    <div data-action="dashboard:scheduleCall" class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                            <i data-lucide="phone" class="w-6 h-6 text-purple-600"></i>
                        </div>
                        <h4 class="font-medium text-slate-900 mb-2">Schedule Call</h4>
                        <p class="text-sm text-slate-600">Add new call to calendar</p>
                    </div>
                    
                    <div data-action="task:create" class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                            <i data-lucide="plus" class="w-6 h-6 text-purple-600"></i>
                        </div>
                        <h4 class="font-medium text-slate-900 mb-2">Create Task</h4>
                        <p class="text-sm text-slate-600">Add task to today's list</p>
                    </div>
                    
                    <div data-action="lead:add" class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                            <i data-lucide="user-plus" class="w-6 h-6 text-purple-600"></i>
                        </div>
                        <h4 class="font-medium text-slate-900 mb-2">Add Lead</h4>
                        <p class="text-sm text-slate-600">Register new lead</p>
                    </div>
                </div>
            </div>
        `;
    }

    getTodayScheduleItems() {
        const items = [
            { time: '10:00 AM', title: 'Call • GreenLeaf Industries', subtitle: 'Discuss lead nurturing plan', icon: 'phone', color: 'sky' },
            { time: '12:30 PM', title: 'Meeting • TechNova Solutions', subtitle: 'Campaign review + next steps', icon: 'users', color: 'indigo' },
            { time: '03:00 PM', title: 'Follow-up • BrightFin', subtitle: 'Invoice status + renewal', icon: 'badge-dollar-sign', color: 'emerald' },
            { time: '05:15 PM', title: 'Task • Update CRM', subtitle: 'Log today\'s activity and notes', icon: 'check-square', color: 'amber' }
        ];

        return items.map(i => `
            <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div class="w-12 h-12 bg-${i.color}-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i data-lucide="${i.icon}" class="w-5 h-5 text-${i.color}-600"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-3">
                        <div class="font-medium text-slate-900 truncate">${i.title}</div>
                        <div class="text-xs font-semibold text-slate-500 flex-shrink-0">${i.time}</div>
                    </div>
                    <div class="text-sm text-slate-600 mt-1 truncate">${i.subtitle}</div>
                </div>
            </div>
        `).join('');
    }

    getDashboardWeekly() {
        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Weekly View</h2>
                        <p class="text-sm text-slate-500">Weekly metrics and performance highlights</p>
                    </div>
                    <div class="flex gap-2">
                        <button data-action="nav:dashboard/daily" class="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg">Daily</button>
                        <button data-action="nav:dashboard/weekly" class="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg">Weekly</button>
                    </div>
                </div>

                <!-- Weekly Metrics -->
                <div class="grid grid-cols-4 gap-4">
                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <i data-lucide="users" class="w-8 h-8 text-sky-600"></i>
                            <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">↑ 18%</span>
                        </div>
                        <div class="text-3xl font-semibold text-slate-900 mb-1">42</div>
                        <div class="text-sm text-slate-600">Leads This Week</div>
                        <div class="text-xs text-slate-500 mt-2">vs last week</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <i data-lucide="briefcase" class="w-8 h-8 text-indigo-600"></i>
                            <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">↑ 50%</span>
                        </div>
                        <div class="text-3xl font-semibold text-slate-900 mb-1">6</div>
                        <div class="text-sm text-slate-600">Deals Closed</div>
                        <div class="text-xs text-slate-500 mt-2">vs last week</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <i data-lucide="indian-rupee" class="w-8 h-8 text-emerald-600"></i>
                            <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">↑ 24%</span>
                        </div>
                        <div class="text-3xl font-semibold text-slate-900 mb-1">₹2,10,000</div>
                        <div class="text-sm text-slate-600">Revenue Generated</div>
                        <div class="text-xs text-slate-500 mt-2">vs last week</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <i data-lucide="send" class="w-8 h-8 text-amber-600"></i>
                            <span class="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">3</span>
                        </div>
                        <div class="text-3xl font-semibold text-slate-900 mb-1">3</div>
                        <div class="text-sm text-slate-600">Campaigns Run</div>
                        <div class="text-xs text-slate-500 mt-2">Email, SMS, WhatsApp</div>
                    </div>
                </div>

                <!-- Weekly Chart -->
                <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-slate-900">Leads vs Deals - This Week</h3>
                        <p class="text-sm text-slate-500">Daily comparison of leads generated and deals closed</p>
                    </div>
                    <div class="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                        <canvas id="weeklyChart"></canvas>
                    </div>
                </div>

                <!-- Top Performing Days & Highlights -->
                <div class="grid grid-cols-2 gap-6">
                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900 mb-4">Top Performing Days</h3>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <div>
                                    <div class="font-medium text-slate-900">Wednesday</div>
                                    <div class="text-sm text-slate-600">15 leads, 4 deals</div>
                                </div>
                                <i data-lucide="trophy" class="w-5 h-5 text-purple-600"></i>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div>
                                    <div class="font-medium text-slate-900">Friday</div>
                                    <div class="text-sm text-slate-600">9 leads, 5 deals</div>
                                </div>
                                <i data-lucide="medal" class="w-5 h-5 text-slate-400"></i>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div>
                                    <div class="font-medium text-slate-900">Monday</div>
                                    <div class="text-sm text-slate-600">12 leads, 3 deals</div>
                                </div>
                                <i data-lucide="award" class="w-5 h-5 text-slate-400"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900 mb-4">Weekly Highlights</h3>
                        <div class="space-y-3">
                            <div class="flex items-center gap-3">
                                <i data-lucide="check-circle" class="w-5 h-5 text-green-600"></i>
                                <span class="text-sm text-slate-700">Highest revenue week this quarter</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <i data-lucide="check-circle" class="w-5 h-5 text-green-600"></i>
                                <span class="text-sm text-slate-700">3 new enterprise clients onboarded</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <i data-lucide="check-circle" class="w-5 h-5 text-green-600"></i>
                                <span class="text-sm text-slate-700">Campaign conversion rate: 28%</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <i data-lucide="alert-triangle" class="w-5 h-5 text-orange-600"></i>
                                <span class="text-sm text-slate-700">2 proposals pending approval</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getDashboardAnalytics() {
        return `
            <div class="space-y-6 fade-in">
                <!-- Long-term KPIs -->
                <div class="grid grid-cols-4 gap-4">
                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <i data-lucide="users" class="w-8 h-8 text-purple-500"></i>
                            <span class="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">All-time</span>
                        </div>
                        <div class="text-3xl font-semibold text-slate-900 mb-1">126</div>
                        <div class="text-sm text-slate-600">Total Clients</div>
                        <div class="text-xs text-slate-500 mt-2">active</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <i data-lucide="check-square" class="w-8 h-8 text-purple-500"></i>
                            <span class="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">Since inception</span>
                        </div>
                        <div class="text-3xl font-semibold text-slate-900 mb-1">89</div>
                        <div class="text-sm text-slate-600">Projects Completed</div>
                        <div class="text-xs text-slate-500 mt-2">delivered</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <i data-lucide="indian-rupee" class="w-8 h-8 text-purple-500"></i>
                            <span class="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">Lifetime</span>
                        </div>
                        <div class="text-3xl font-semibold text-slate-900 mb-1">₹1.8 Cr</div>
                        <div class="text-sm text-slate-600">Total Revenue</div>
                        <div class="text-xs text-slate-500 mt-2">earned</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <i data-lucide="trending-up" class="w-8 h-8 text-purple-500"></i>
                            <span class="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">Average</span>
                        </div>
                        <div class="text-3xl font-semibold text-slate-900 mb-1">₹3.6 L</div>
                        <div class="text-sm text-slate-600">Avg Project Value</div>
                        <div class="text-xs text-slate-500 mt-2">per project</div>
                    </div>
                </div>

                <!-- Revenue by Service Type -->
                <div class="grid grid-cols-2 gap-6">
                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-slate-900">Revenue by Service Type</h3>
                            <p class="text-sm text-slate-500">Breakdown of revenue sources</p>
                        </div>
                        <div class="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                            <canvas id="revenuePieChart"></canvas>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-slate-900">Service Breakdown</h3>
                            <p class="text-sm text-slate-500">Revenue by service category</p>
                        </div>
                        <div class="space-y-4">
                            ${this.getServiceBreakdownItems()}
                        </div>
                    </div>
                </div>

                <!-- Additional Analytics -->
                <div class="grid grid-cols-3 gap-6">
                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900 mb-4">Client Acquisition</h3>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-slate-600">Referrals</span>
                                <span class="text-sm font-medium text-slate-900">48%</span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-2">
                                <div class="bg-purple-600 h-2 rounded-full" style="width: 48%"></div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-slate-600">Direct Marketing</span>
                                <span class="text-sm font-medium text-slate-900">32%</span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-2">
                                <div class="bg-purple-500 h-2 rounded-full" style="width: 32%"></div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-slate-600">Social Media</span>
                                <span class="text-sm font-medium text-slate-900">15%</span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-2">
                                <div class="bg-purple-400 h-2 rounded-full" style="width: 15%"></div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-slate-600">Other</span>
                                <span class="text-sm font-medium text-slate-900">5%</span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-2">
                                <div class="bg-purple-300 h-2 rounded-full" style="width: 5%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900 mb-4">Project Duration</h3>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-slate-600">1-3 months</span>
                                <span class="text-sm font-medium text-slate-900">42%</span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-2">
                                <div class="bg-purple-600 h-2 rounded-full" style="width: 42%"></div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-slate-600">3-6 months</span>
                                <span class="text-sm font-medium text-slate-900">38%</span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-2">
                                <div class="bg-purple-500 h-2 rounded-full" style="width: 38%"></div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-slate-600">6-12 months</span>
                                <span class="text-sm font-medium text-slate-900">15%</span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-2">
                                <div class="bg-purple-400 h-2 rounded-full" style="width: 15%"></div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-slate-600">12+ months</span>
                                <span class="text-sm font-medium text-slate-900">5%</span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-2">
                                <div class="bg-purple-300 h-2 rounded-full" style="width: 5%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900 mb-4">Client Satisfaction</h3>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-slate-600">Excellent (5★)</span>
                                <span class="text-sm font-medium text-slate-900">64%</span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-2">
                                <div class="bg-green-600 h-2 rounded-full" style="width: 64%"></div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-slate-600">Good (4★)</span>
                                <span class="text-sm font-medium text-slate-900">28%</span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-2">
                                <div class="bg-green-500 h-2 rounded-full" style="width: 28%"></div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-slate-600">Average (3★)</span>
                                <span class="text-sm font-medium text-slate-900">6%</span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-2">
                                <div class="bg-yellow-500 h-2 rounded-full" style="width: 6%"></div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-slate-600">Below Avg (≤2★)</span>
                                <span class="text-sm font-medium text-slate-900">2%</span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-2">
                                <div class="bg-red-500 h-2 rounded-full" style="width: 2%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getDashboardWork() {
        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Today's Work</h2>
                        <p class="text-sm text-slate-500">Tasks, meetings, reminders</p>
                    </div>
                    <div class="flex gap-2">
                        <button data-action="nav:dashboard/sop" class="px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">SOP Checklist</button>
                    </div>
                </div>

                <!-- Tasks for Today -->
                <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-slate-900">Tasks for Today</h3>
                        <button class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                            + Add Task
                        </button>
                    </div>
                    
                    <div class="space-y-3">
                        ${this.getTodayTasks()}
                    </div>
                </div>

                <!-- Meetings -->
                <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-slate-900">Meetings</h3>
                    </div>
                    
                    <div class="space-y-4">
                        ${this.getTodayMeetings()}
                    </div>
                </div>

                <!-- Reminders & Alerts -->
                <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-slate-900">Reminders & Alerts</h3>
                    </div>
                    
                    <div class="space-y-3">
                        ${this.getTodayReminders()}
                    </div>
                </div>
            </div>
        `;
    }

    getServiceBreakdownItems() {
        const services = [
            { name: "Consulting", revenue: "₹4,60,000", percentage: 28, color: "purple" },
            { name: "SEO Services", revenue: "₹4,50,000", percentage: 27, color: "purple-500" },
            { name: "Social Media", revenue: "₹3,80,000", percentage: 23, color: "purple-400" },
            { name: "Content Marketing", revenue: "₹2,90,000", percentage: 18, color: "purple-300" },
            { name: "Email Marketing", revenue: "₹2,20,000", percentage: 13, color: "purple-200" }
        ];

        return services.map(service => `
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-sm font-medium text-slate-900">${service.name}</span>
                        <span class="text-sm text-slate-600">${service.revenue}</span>
                    </div>
                    <div class="w-full bg-slate-100 rounded-full h-2">
                        <div class="bg-${service.color} h-2 rounded-full transition-all" style="width: ${service.percentage}%"></div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getTodayTasks() {
        const tasks = [
            { text: "Send quotation to EduSpark", priority: "High", completed: false },
            { text: "Follow-up overdue invoice (TechNova)", priority: "High", completed: false },
            { text: "Prepare campaign report for Digital Dreams", priority: "Medium", completed: false },
            { text: "Review social media content calendar", priority: "Medium", completed: true },
            { text: "Update CRM with new leads", priority: "Low", completed: false },
            { text: "Schedule next month client check-ins", priority: "Low", completed: true }
        ];

        return tasks.map(task => `
            <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <input type="checkbox" ${task.completed ? 'checked' : ''} class="w-4 h-4 text-purple-600 rounded focus:ring-purple-500">
                <div class="flex-1">
                    <span class="text-sm ${task.completed ? 'line-through text-slate-500' : 'text-slate-700'}">${task.text}</span>
                </div>
                <span class="px-2 py-1 text-xs font-medium rounded-full ${
                    task.priority === 'High' ? 'bg-red-100 text-red-700' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                }">${task.priority}</span>
            </div>
        `).join('');
    }

    getTodayMeetings() {
        const meetings = [
            { time: "10:00 AM", client: "TechNova Solutions", details: "Discovery call for new SEO project", status: "Scheduled" },
            { time: "3:00 PM", client: "GreenLeaf Industries", details: "Product demo and proposal discussion", status: "Scheduled" }
        ];

        return meetings.map(meeting => `
            <div class="flex items-start gap-4 p-4 border border-slate-200 rounded-lg">
                <div class="flex-shrink-0">
                    <div class="text-sm font-medium text-slate-900">${meeting.time}</div>
                </div>
                <div class="w-px h-12 bg-slate-200"></div>
                <div class="flex-1">
                    <div class="font-medium text-slate-900 mb-1">${meeting.client}</div>
                    <div class="text-sm text-slate-600 mb-2">${meeting.details}</div>
                    <div class="flex gap-2">
                        <button class="px-3 py-1 text-xs font-medium bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">Join Call</button>
                        <button class="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors">View Details</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getTodayReminders() {
        const reminders = [
            { time: "9:00 AM", text: "Payment reminder auto-sent to 3 clients" },
            { time: "10:30 AM", text: "Proposal approval pending from GreenLeaf" },
            { time: "2:00 PM", text: "Campaign analytics ready for review" }
        ];

        return reminders.map(reminder => `
            <div class="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <i data-lucide="bell" class="w-4 h-4 text-amber-700"></i>
                <div class="flex-1">
                    <div class="text-sm text-slate-700">${reminder.text}</div>
                    <div class="text-xs text-slate-500 mt-1">${reminder.time}</div>
                </div>
            </div>
        `).join('');
    }

    renderLeadsContent(container) {
        switch (this.currentSubSection) {
            case 'registration':
                container.innerHTML = this.getLeadsRegistrationHub();
                break;
            case 'client_registration':
                container.innerHTML = this.getLeadsRegistration();
                break;
            case 'clients':
                container.innerHTML = this.getLeadsDirectoryHub();
                break;
            case 'client_directory':
                container.innerHTML = this.getLeadsDirectory();
                this.setupClientDirectoryInteractions();
                break;
            case 'tracking':
                container.innerHTML = this.getLeadsContacts();
                break;
            case 'details':
                this.currentSubSection = 'clients';
                container.innerHTML = this.getLeadsDirectoryHub();
                break;
            case 'lead_registration':
                container.innerHTML = this.getLeadRegistration();
                break;
            case 'lead_directory':
                container.innerHTML = this.getLeadDirectory();
                this.setupLeadDirectoryInteractions();
                break;
            case 'lead_sources':
                container.innerHTML = this.getPlaceholderScreen('Lead Sources Dashboard', 'Cards + donut chart by source');
                break;
            case 'lead_pipeline':
                container.innerHTML = this.getPlaceholderScreen('Lead Pipeline Tracker', 'Kanban stages from lead to PO received');
                break;
            case 'indiamart':
                container.innerHTML = this.getPlaceholderScreen('IndiaMART Leads', 'Hourly tracker with SLA alerts');
                break;
            case 'categorization':
                container.innerHTML = this.getPlaceholderScreen('Client Categorization', 'Segment clients by tags and priority');
                break;
            case 'smart_feedback':
                container.innerHTML = this.getPlaceholderScreen('Smart Feedback System', 'Log Call Later / Not Interested / Revisit etc.');
                break;
            case 'greetings':
                container.innerHTML = this.getPlaceholderScreen('Client Greetings & Re-engagement', 'Calendar + scheduled greetings');
                break;
            case 'lead_sla':
                container.innerHTML = this.getPlaceholderScreen('Lead SLA Tracker', 'Aging report and risk badges');
                break;
            default:
                container.innerHTML = this.getLeadsDirectory();
                this.setupClientDirectoryInteractions();
        }
    }

    getLeadsDirectoryHub() {
        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Directory</h2>
                        <p class="text-sm text-slate-500">Open Client Directory or Lead Directory</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button data-action="nav:leads/client_directory" class="text-left bg-white rounded-lg border border-slate-200 p-6 shadow-lg hover:bg-slate-50 transition-colors">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                                <i data-lucide="users" class="w-6 h-6 text-emerald-600"></i>
                            </div>
                            <div>
                                <div class="text-lg font-semibold text-slate-900">Client Directory</div>
                                <div class="text-sm text-slate-600 mt-1">View clients, status, invoices, and notes</div>
                            </div>
                        </div>
                    </button>

                    <button data-action="nav:leads/lead_directory" class="text-left bg-white rounded-lg border border-slate-200 p-6 shadow-lg hover:bg-slate-50 transition-colors">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                <i data-lucide="users-round" class="w-6 h-6 text-purple-600"></i>
                            </div>
                            <div>
                                <div class="text-lg font-semibold text-slate-900">Lead Directory</div>
                                <div class="text-sm text-slate-600 mt-1">Track leads and convert to clients</div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        `;
    }

    getLeadRegistration() {
        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Lead Registration</h2>
                        <p class="text-sm text-slate-500">Capture lead source and details</p>
                    </div>
                    <button data-action="lead:register" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Save Lead</button>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-slate-700">Lead Source</label>
                            <select id="leadSource" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                <option>Exhibition</option>
                                <option>IndiaMART</option>
                                <option selected>LinkedIn</option>
                                <option>Field Visit</option>
                                <option>Referral</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700">Assigned To</label>
                            <input id="leadAssignedTo" type="text" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., Asha" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700">Company</label>
                            <input id="leadCompany" type="text" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., GreenLeaf Industries" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700">Contact</label>
                            <input id="leadContact" type="text" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Phone / Email" />
                        </div>
                        <div class="col-span-2">
                            <label class="block text-sm font-medium text-slate-700">Next Action</label>
                            <input id="leadNextAction" type="text" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., Demo with Technical Team" />
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    formatSlaTimer(receivedAt) {
        const t = Number.isFinite(Number(receivedAt)) ? Number(receivedAt) : Date.now();
        const mins = Math.max(0, Math.floor((Date.now() - t) / 60000));
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${h}h ${m}m`;
    }

    getLeadsData() {
        const defaults = Array.from({ length: 15 }).map((_, i) => {
            const idx = i + 1;
            const sources = ['Exhibition', 'IndiaMART', 'LinkedIn', 'Field Visit', 'Referral'];
            const stages = ['New Lead', 'Contacted', 'Missed Call', 'Follow-up', 'Demo', 'Quotation', 'Negotiation', 'Closed', 'PO Received'];
            const receivedAt = Date.now() - ((i + 1) * 90 * 60 * 1000);
            return {
                id: `LD-${String(idx).padStart(3, '0')}`,
                company: `Lead Company ${idx}`,
                contact: `+91 98${String(70000000 + idx).slice(0, 8)}`,
                source: sources[i % sources.length],
                stage: stages[i % stages.length],
                assignedTo: ['Asha', 'Rohan', 'Sarah'][i % 3],
                nextAction: 'Call',
                feedbackStatus: ['Pending', 'Call Later', 'Demo Scheduled'][i % 3],
                status: 'Open',
                receivedAt
            };
        });

        const stored = this.getStoredLeads();
        const combined = [...stored];
        defaults.forEach(d => {
            if (!combined.some(x => String(x?.id || '').trim().toLowerCase() === String(d.id).toLowerCase())) combined.push(d);
        });
        return combined;
    }

    getLeadDirectory() {
        const leads = this.getLeadsData();
        const selectedId = String(this.selectedLeadId || '').trim();
        const selected = selectedId
            ? (leads.find(l => String(l?.id || '').trim().toLowerCase() === selectedId.toLowerCase()) || null)
            : null;
        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Lead Directory</h2>
                        <p class="text-sm text-slate-500">15 dummy leads with conversion</p>
                    </div>
                    <button data-action="nav:leads/lead_registration" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ New Lead</button>
                </div>

                <div class="grid ${selected ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'} gap-6">
                    <div class="${selected ? 'col-span-1 lg:col-span-2' : 'col-span-1'} bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                            <div class="text-sm font-medium text-slate-900">Leads</div>
                            <div class="text-xs text-slate-500">Showing ${leads.length}</div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead class="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th class="text-left px-4 py-3 font-medium">Lead ID</th>
                                        <th class="text-left px-4 py-3 font-medium">Company</th>
                                        <th class="text-left px-4 py-3 font-medium">Contact</th>
                                        <th class="text-left px-4 py-3 font-medium">Source</th>
                                        <th class="text-left px-4 py-3 font-medium">Stage</th>
                                        <th class="text-left px-4 py-3 font-medium">Feedback Status</th>
                                        <th class="text-left px-4 py-3 font-medium">Convert</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                    ${leads.map(l => {
                                        const converted = String(l.status || '').toLowerCase() === 'converted';
                                        const isSelected = selected && String(selected.id || '').trim().toLowerCase() === String(l.id || '').trim().toLowerCase();
                                        return `
                                            <tr data-lead-id="${l.id}" class="hover:bg-slate-50 cursor-pointer ${isSelected ? 'bg-slate-50' : ''}">
                                                <td class="px-4 py-3 font-medium text-slate-900">${l.id}</td>
                                                <td class="px-4 py-3 text-slate-700">${l.company}</td>
                                                <td class="px-4 py-3 text-slate-700">${l.contact || '—'}</td>
                                                <td class="px-4 py-3 text-slate-700">${l.source || '—'}</td>
                                                <td class="px-4 py-3 text-slate-700">${l.stage || '—'}</td>
                                                <td class="px-4 py-3 text-slate-700">${l.feedbackStatus || '—'}</td>
                                                <td class="px-4 py-3">
                                                    ${converted
                                                        ? `<span class="px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full">Converted</span>`
                                                        : `<button data-action="lead:convert" data-lead-id="${l.id}" class="px-3 py-1.5 text-xs font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Convert to Client</button>`
                                                    }
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    ${selected ? `
                        <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg lg:sticky lg:top-6 h-fit">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-lg font-semibold text-slate-900">Selected Lead</h3>
                                    <div class="text-xs text-slate-500 mt-1">${selected.id}</div>
                                </div>
                                <button id="clearLeadSelection" class="px-3 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Close</button>
                            </div>

                            <div class="mt-4">
                                <div class="text-sm font-medium text-slate-900">${selected.company || '—'}</div>
                                <div class="text-xs text-slate-500">${selected.contact || '—'}</div>
                            </div>

                            <div class="mt-5 grid grid-cols-2 gap-3">
                                <div>
                                    <div class="text-[11px] font-semibold text-slate-500">Source</div>
                                    <div class="text-sm font-medium text-slate-900 mt-1">${selected.source || '—'}</div>
                                </div>
                                <div>
                                    <div class="text-[11px] font-semibold text-slate-500">SLA Timer</div>
                                    <div class="text-sm font-medium text-slate-900 mt-1">${this.formatSlaTimer(selected.receivedAt)}</div>
                                </div>
                            </div>

                            <div class="mt-4 grid gap-3">
                                <input type="hidden" id="leadDetailId" value="${String(selected.id || '').replace(/</g, '&lt;')}" />

                                <div>
                                    <label class="text-xs font-medium text-slate-600">Pipeline Stage</label>
                                    ${this.renderLeadPipelineProgress(selected.stage)}
                                    <select id="leadDetailStage" class="mt-3 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        ${this.getLeadPipelineStages().map(s => `
                                            <option ${String(selected.stage || '').trim().toLowerCase() === String(s).toLowerCase() ? 'selected' : ''}>${s}</option>
                                        `).join('')}
                                    </select>
                                </div>

                                <div>
                                    <label class="text-xs font-medium text-slate-600">Assigned To</label>
                                    <input id="leadDetailAssignedTo" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" value="${String(selected.assignedTo || '').replace(/</g, '&lt;')}" />
                                </div>

                                <div>
                                    <label class="text-xs font-medium text-slate-600">Next Action</label>
                                    <input id="leadDetailNextAction" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" value="${String(selected.nextAction || '').replace(/</g, '&lt;')}" />
                                </div>

                                <div>
                                    <label class="text-xs font-medium text-slate-600">Feedback Status</label>
                                    <input id="leadDetailFeedback" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" value="${String(selected.feedbackStatus || '').replace(/</g, '&lt;')}" />
                                </div>

                                <div>
                                    <label class="text-xs font-medium text-slate-600">Update Note</label>
                                    <textarea id="leadDetailNote" rows="2" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="What changed? (optional)"></textarea>
                                </div>

                                <div class="grid grid-cols-2 gap-2">
                                    <button data-action="lead:update" class="px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Save</button>
                                    ${String(selected.status || '').toLowerCase() === 'converted'
                                        ? `<button data-action="nav:leads/client_directory" class="px-3 py-2 text-sm font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">Open Client</button>`
                                        : `<button data-action="lead:convert" data-lead-id="${selected.id}" class="px-3 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">Convert</button>`
                                    }
                                </div>

                                <div class="mt-2">
                                    <div class="text-xs font-semibold text-slate-600 mb-2">History</div>
                                    <div class="space-y-2">
                                        ${(Array.isArray(selected.history) ? selected.history.slice().reverse() : []).slice(0, 6).map(h => `
                                            <div class="p-3 bg-slate-50 rounded-lg">
                                                <div class="flex items-center justify-between">
                                                    <div class="text-xs font-semibold text-slate-700">${String(h?.type || 'update')}</div>
                                                    <div class="text-[11px] text-slate-500">${h?.at ? new Date(h.at).toLocaleString() : '—'}</div>
                                                </div>
                                                <div class="text-xs text-slate-600 mt-1">${String(h?.note || '').replace(/</g, '&lt;') || '—'}</div>
                                            </div>
                                        `).join('') || '<div class="text-xs text-slate-500">No history yet</div>'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderBadge(stage) {
        const map = {
            Active: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
            Onboarding: { bg: 'bg-amber-50', text: 'text-amber-700' },
            Completed: { bg: 'bg-slate-100', text: 'text-slate-700' }
        };
        const style = map[stage] || { bg: 'bg-slate-100', text: 'text-slate-700' };
        return `<span class="px-2 py-1 text-xs font-medium ${style.bg} ${style.text} rounded-full">${stage}</span>`;
    }

    getClientsData() {
        const defaults = [
            { name: 'TechNova Solutions', city: 'Bengaluru', industry: 'IT Services', owner: 'Sarah', stage: 'Active', openInvoices: 2, dueAmount: '₹42,000', location: 'KAK', vendorCode: 'KAK001' },
            { name: 'GreenLeaf Industries', city: 'Pune', industry: 'Manufacturing', owner: 'Rohan', stage: 'Onboarding', openInvoices: 1, dueAmount: '₹58,000', location: 'OST', vendorCode: 'OST001' },
            { name: 'EduSpark', city: 'Hyderabad', industry: 'Education', owner: 'Meera', stage: 'Active', openInvoices: 0, dueAmount: '₹0', location: 'OTN', vendorCode: 'OTN001' },
            { name: 'Mumbai Retail Chain', city: 'Mumbai', industry: 'Retail', owner: 'Amit', stage: 'At Risk', openInvoices: 3, dueAmount: '₹1,25,000', location: 'CHN', vendorCode: 'CHN001' },
            { name: 'BrightFin', city: 'Delhi', industry: 'Finance', owner: 'Sarah', stage: 'Active', openInvoices: 0, dueAmount: '₹0', location: 'OST', vendorCode: 'OST002' },
            { name: 'Digital Dreams', city: 'Chennai', industry: 'Media', owner: 'Rohan', stage: 'Active', openInvoices: 1, dueAmount: '₹25,000', location: 'CHN', vendorCode: 'CHN002' },
            { name: 'UrbanCafe', city: 'Kolkata', industry: 'Hospitality', owner: 'Meera', stage: 'Onboarding', openInvoices: 0, dueAmount: '₹0', location: 'OTN', vendorCode: 'OTN003' },
            { name: 'CarePlus Clinics', city: 'Ahmedabad', industry: 'Healthcare', owner: 'Amit', stage: 'At Risk', openInvoices: 1, dueAmount: '₹18,000', location: 'OST', vendorCode: 'OST003' },
            { name: 'Zenith Logistics', city: 'Jaipur', industry: 'Logistics', owner: 'Sarah', stage: 'Active', openInvoices: 0, dueAmount: '₹0', location: 'KAK', vendorCode: 'KAK002' },
            { name: 'GreenBite Foods', city: 'Surat', industry: 'FMCG', owner: 'Rohan', stage: 'Active', openInvoices: 0, dueAmount: '₹0', location: 'HSR', vendorCode: 'HSR001' }
        ];

        const stored = this.getStoredClients();
        const seen = new Set();
        const merged = [];

        [...stored, ...defaults].forEach(c => {
            const key = String(c?.name || '').trim().toLowerCase();
            if (!key || seen.has(key)) return;
            seen.add(key);
            merged.push(c);
        });

        // Enrich with invoice-driven counts/amounts (stored invoices override mocked numbers)
        const invByClient = this.getInvoiceSummaryByClient();
        return merged.map(c => {
            const key = String(c?.name || '').trim().toLowerCase();
            const s = invByClient.get(key);
            if (!s) return c;
            return {
                ...c,
                openInvoices: s.openInvoices,
                dueAmount: this.formatINR(s.dueAmount)
            };
        });
    }

    getClientDetailMock(clientName) {
        const clients = this.getClientsData();
        const client = clients.find(c => String(c.name || '').trim() === clientName);
        
        if (!client) {
            return {
                contact: { name: 'Primary Contact', email: 'contact@company.com', phone: '+91 90000 00000' },
                project: { name: 'New Project', progress: 0, eta: '—', color: 'slate' },
                alert: null,
                client: null
            };
        }

        const mockDetails = {
            'TechNova Solutions': {
                contact: { name: 'Aarav Mehta', email: 'aarav@technova.io', phone: '+91 98765 43210' },
                project: { name: 'SEO Revamp', progress: 62, eta: '12 days', color: 'sky' },
                alert: { title: 'Invoice INV-102 overdue', amount: '₹42,000', due: 'Due 3 days ago' }
            },
            'GreenLeaf Industries': {
                contact: { name: 'Riya Kapoor', email: 'riya@greenleaf.in', phone: '+91 99887 66554' },
                project: { name: 'Lead Nurture Automation', progress: 38, eta: '18 days', color: 'indigo' },
                alert: { title: 'Approval pending for QTN-44', amount: '₹58,000', due: 'Waiting 7 days' }
            },
            'EduSpark': {
                contact: { name: 'Sameer Singh', email: 'sameer@eduspark.com', phone: '+91 90011 22334' },
                project: { name: 'Campaign Analytics Setup', progress: 74, eta: '6 days', color: 'emerald' },
                alert: null
            },
            'Digital Dreams': {
                contact: { name: 'Amit Verma', email: 'amit@digitaldreams.in', phone: '+91 91122 33445' },
                project: { name: 'Quarterly Retainer (Closed)', progress: 100, eta: 'Completed', color: 'slate' },
                alert: null
            },
            'Mumbai Retail Chain': {
                contact: { name: 'Nisha Rao', email: 'nisha@mumbai-retail.in', phone: '+91 91234 56780' },
                project: { name: 'Store Launch Ads', progress: 26, eta: '21 days', color: 'amber' },
                alert: { title: 'Low engagement risk', amount: 'Open invoices: ₹37,000', due: '0 opens in last 3 messages' }
            },
            'UrbanCafe': {
                contact: { name: 'Kunal Shah', email: 'kunal@urbancafe.in', phone: '+91 92222 12090' },
                project: { name: 'Local SEO Boost', progress: 44, eta: '15 days', color: 'sky' },
                alert: { title: 'Feedback survey pending', amount: 'NPS not collected', due: 'Send reminder today' }
            },
            'BrightFin': {
                contact: { name: 'Neha Jain', email: 'neha@brightfin.com', phone: '+91 93456 78012' },
                project: { name: 'Landing Page Optimization', progress: 58, eta: '10 days', color: 'indigo' },
                alert: { title: 'Invoice INV-114 pending', amount: '₹25,000', due: 'Due in 2 days' }
            },
            'CarePlus Clinics': {
                contact: { name: 'Dr. Ananya Iyer', email: 'ananya@careplus.in', phone: '+91 98888 11550' },
                project: { name: 'Appointment Campaign', progress: 33, eta: '19 days', color: 'amber' },
                alert: { title: 'Invoice INV-109 overdue', amount: '₹18,000', due: 'Due 1 day ago' }
            },
            'Zenith Logistics': {
                contact: { name: 'Rakesh Kumar', email: 'rakesh@zenithlogistics.in', phone: '+91 96666 44321' },
                project: { name: 'Retainer (Completed)', progress: 100, eta: 'Completed', color: 'slate' },
                alert: null
            }
        };

        const mock = mockDetails[clientName] || {
            contact: { name: 'Primary Contact', email: client.email || 'contact@company.com', phone: client.phone || '+91 90000 00000' },
            project: { name: 'New Project', progress: 0, eta: '—', color: 'slate' },
            alert: null
        };

        return {
            ...mock,
            client: client
        };
    }

    getLeadsRegistration() {
        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Client Registration</h2>
                        <p class="text-sm text-slate-500">Create a client profile and capture requirements</p>
                    </div>
                    <button data-action="client:register" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Save Client</button>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="grid grid-cols-2 gap-4">
                            <input type="hidden" id="registerMode" value="client" />
                            <div>
                                <label class="text-xs font-medium text-slate-600">Client Name</label>
                                <input id="clientName" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., TechNova Solutions" />
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600">Owner</label>
                                <select id="clientOwner" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    <option>Marketing User</option>
                                    <option>Sales User</option>
                                    <option>Accounts User</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600">Email</label>
                                <input id="clientEmail" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="client@company.com" />
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600">Phone</label>
                                <input id="clientPhone" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="+91 9XXXXXXXXX" />
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600">Industry</label>
                                <select id="clientIndustry" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    <option>IT Services</option>
                                    <option>Manufacturing</option>
                                    <option>Education</option>
                                    <option>Retail</option>
                                    <option>Healthcare</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600">Lead Source</label>
                                <select id="clientLeadSource" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    <option>Referral</option>
                                    <option>Inbound</option>
                                    <option>Campaign</option>
                                    <option>Outbound</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600">Location</label>
                                <select id="clientLocation" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    <option value="">Select</option>
                                    <option value="CHN">Chennai</option>
                                    <option value="HSR">Hosur</option>
                                    <option value="OST">Other state</option>
                                    <option value="KAK">Karnataka</option>
                                    <option value="OTN">Other Tamil Nadu</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600">Vendor Code</label>
                                <input id="clientVendorCode" type="text" readonly class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-700" placeholder="Auto-generated based on location" />
                            </div>
                            <div class="col-span-2">
                                <label class="text-xs font-medium text-slate-600">Notes</label>
                                <textarea id="clientNotes" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" rows="3" placeholder="Requirements, expectations, and next steps..."></textarea>
                            </div>
                        </div>
                </div>
            </div>
        `;
    }

    getLeadsDirectory() {
        const clients = this.getClientsData();
        const selectedName = clients.some(c => c.name === this.selectedClientName) ? this.selectedClientName : null;
        const selected = selectedName ? (clients.find(c => c.name === selectedName) || null) : null;
        const detail = selected ? this.getClientDetailMock(selected.name) : null;
        const selectedInvoices = selected
            ? this.getAllInvoices().filter(i => String(i?.client || '').trim().toLowerCase() === String(selected.name || '').trim().toLowerCase())
            : [];
        const latestInvoices = selectedInvoices.slice(0, 3);
        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Client Directory</h2>
                        <p class="text-sm text-slate-500">${clients.length} clients with status badges and quick insights</p>
                    </div>
                    <button data-action="nav:leads/client_registration" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ New Client</button>
                </div>

                <div class="grid ${selected ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'} gap-6">
                    <div class="${selected ? 'col-span-1 lg:col-span-2' : 'col-span-1'} bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                            <div class="text-sm font-medium text-slate-900">Clients</div>
                            <div class="text-xs text-slate-500">Showing ${clients.length}</div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead class="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th class="text-left px-4 py-3 font-medium">Client</th>
                                        <th class="text-left px-4 py-3 font-medium">Owner</th>
                                        <th class="text-left px-4 py-3 font-medium">Status</th>
                                        <th class="text-right px-4 py-3 font-medium">Open Invoices</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                    ${clients.map(c => `
                                        <tr data-client-name="${c.name}" class="hover:bg-slate-50 cursor-pointer ${c.name === selectedName ? 'bg-slate-50' : ''}">
                                            <td class="px-4 py-3">
                                                <div class="font-medium text-slate-900">${c.name}</div>
                                                <div class="text-xs text-slate-500">${c.city} • ${c.industry}</div>
                                            </td>
                                            <td class="px-4 py-3 text-slate-700">${c.owner}</td>
                                            <td class="px-4 py-3">${this.renderBadge(c.stage)}</td>
                                            <td class="px-4 py-3 text-right">
                                                <span class="font-medium text-slate-900">${c.openInvoices}</span>
                                                <span class="text-xs text-slate-500"> (${c.dueAmount})</span>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    ${selected ? `
                        <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg lg:sticky lg:top-6 h-fit">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-lg font-semibold text-slate-900">Selected Client</h3>
                                    <p class="text-sm text-slate-500">${selected.name}</p>
                                </div>
                                <span class="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">${selected.stage}</span>
                            </div>

                            <div class="mt-4 grid grid-cols-2 gap-2">
                                <button data-action="client:edit" data-client-name="${selected.name}" class="px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Edit</button>
                                <button data-action="client:delete" data-client-name="${selected.name}" class="px-3 py-2 text-sm font-medium bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors">Delete</button>
                            </div>

                            <div class="mt-2 grid grid-cols-2 gap-2">
                                <button data-action="client:createInvoice" data-client-name="${selected.name}" class="px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Create Invoice</button>
                                <button data-action="task:create" class="px-3 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Create Task</button>
                            </div>

                            <div class="mt-4 p-3 bg-slate-50 rounded-lg">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="text-xs text-slate-500">Latest invoices</div>
                                        <div class="text-sm font-medium text-slate-900">${latestInvoices.length ? `${latestInvoices.length} shown • ${selectedInvoices.length} total` : 'No invoices yet'}</div>
                                    </div>
                                    <button data-action="nav:billing/invoices" data-invoice-client-filter="${selected.name}" class="px-3 py-2 text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">View in Billing</button>
                                </div>

                                ${latestInvoices.length ? `
                                    <div class="mt-3 space-y-2">
                                        ${latestInvoices.map(i => `
                                            <div class="flex items-center justify-between gap-2 p-2 bg-white border border-slate-200 rounded-lg">
                                                <div>
                                                    <div class="text-sm font-semibold text-slate-900">${i.no || '—'}</div>
                                                    <div class="text-xs text-slate-600">${i.amount || '—'} • ${i.status || '—'}</div>
                                                </div>
                                                <div class="flex items-center gap-2">
                                                    <button
                                                        data-action="invoice:preview"
                                                        data-invoice-no="${i.no}"
                                                        data-invoice-client="${i.client}"
                                                        data-invoice-amount="${i.amount}"
                                                        data-invoice-due="${i.due}"
                                                        data-invoice-status="${i.status}"
                                                        data-invoice-color="${i.color}"
                                                        class="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                                                    >Preview</button>
                                                    ${String(i.status || '').trim().toLowerCase() !== 'paid' ? `
                                                        <button
                                                            data-action="invoice:markPaid"
                                                            data-invoice-no="${i.no}"
                                                            data-invoice-client="${i.client}"
                                                            data-invoice-amount="${i.amount}"
                                                            data-invoice-due="${i.due}"
                                                            data-invoice-status="${i.status}"
                                                            data-invoice-color="${i.color}"
                                                            class="px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
                                                        >Mark Paid</button>
                                                    ` : ``}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ``}
                            </div>

                            <div class="mt-4 space-y-3">
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Client Name</div>
                                    <div class="text-sm font-medium text-slate-900">${selected.name || '—'}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Owner</div>
                                    <div class="text-sm font-medium text-slate-900">${selected.owner || '—'}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Email</div>
                                    <div class="text-sm font-medium text-slate-900">${selected.email || detail?.contact?.email || '—'}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Phone</div>
                                    <div class="text-sm font-medium text-slate-900">${selected.phone || detail?.contact?.phone || '—'}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Industry</div>
                                    <div class="text-sm font-medium text-slate-900">${selected.industry || '—'}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Lead Source</div>
                                    <div class="text-sm font-medium text-slate-900">${selected.leadSource || '—'}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Location</div>
                                    <div class="text-sm font-medium text-slate-900">${this.getLocationName(selected.location) || '—'}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Vendor Code</div>
                                    <div class="text-sm font-medium text-slate-900">${selected.vendorCode || '—'}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">City</div>
                                    <div class="text-sm font-medium text-slate-900">${selected.city || '—'}</div>
                                </div>
                                ${selected.notes ? `
                                    <div class="p-3 bg-slate-50 rounded-lg">
                                        <div class="text-xs text-slate-500">Notes</div>
                                        <div class="text-sm font-medium text-slate-900 whitespace-pre-wrap">${selected.notes}</div>
                                    </div>
                                ` : ''}
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Primary Contact</div>
                                    <div class="text-sm font-medium text-slate-900">${detail?.contact?.name || selected.owner || '—'}</div>
                                    <div class="text-xs text-slate-600">${selected.email || detail?.contact?.email || '—'} • ${selected.phone || detail?.contact?.phone || '—'}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Current Project</div>
                                    <div class="text-sm font-medium text-slate-900">${detail?.project?.name || '—'}</div>
                                    <div class="mt-2 w-full bg-slate-200 rounded-full h-2">
                                        <div class="bg-${detail?.project?.color || 'slate'}-600 h-2 rounded-full" style="width: ${detail?.project?.progress ?? 0}%"></div>
                                    </div>
                                    <div class="text-xs text-slate-600 mt-1">${detail?.project?.progress ?? 0}% complete • ETA: ${detail?.project?.eta || '—'}</div>
                                </div>

                                ${detail?.alert ? `
                                    <div class="p-3 bg-rose-50 rounded-lg border border-rose-100">
                                        <div class="flex items-start gap-3">
                                            <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-700 mt-0.5"></i>
                                            <div>
                                                <div class="text-sm font-medium text-rose-900">${detail.alert.title}</div>
                                                <div class="text-xs text-rose-800">${detail.alert.amount} • ${detail.alert.due}</div>
                                            </div>
                                        </div>
                                        <button data-action="client:followup" class="mt-3 w-full px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Resolve / Follow up</button>
                                    </div>
                                ` : `
                                    <div class="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                        <div class="flex items-start gap-3">
                                            <i data-lucide="check-circle" class="w-4 h-4 text-emerald-700 mt-0.5"></i>
                                            <div>
                                                <div class="text-sm font-medium text-emerald-900">No urgent alerts</div>
                                                <div class="text-xs text-emerald-800">Engagement and billing are stable</div>
                                            </div>
                                        </div>
                                        <button data-action="client:note" class="mt-3 w-full px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Log a note</button>
                                    </div>
                                `}
                            </div>
                        </div>
                    ` : ``}
                </div>
            </div>
        `;
    }

    getLeadsContacts() {
        const contacts = this.getAllContactsData();
        const uniq = (arr) => Array.from(new Set(arr.map(x => String(x || '').trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
        const owners = uniq(contacts.map(c => c.owner));
        const sources = uniq(contacts.map(c => c.source));
        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Contacts</h2>
                        <p class="text-sm text-slate-500">All leads and clients contacts in one place</p>
                    </div>
                    <button class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ Add Contact</button>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                        <div class="text-sm font-medium text-slate-900">All Contacts</div>
                        <div class="text-xs text-slate-500">Showing ${contacts.length}</div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-slate-50 text-slate-600">
                                <tr>
                                    <th class="text-left px-4 py-3 font-medium">Type</th>
                                    <th class="text-left px-4 py-3 font-medium">Name</th>
                                    <th class="text-left px-4 py-3 font-medium">Phone</th>
                                    <th class="text-left px-4 py-3 font-medium">Email</th>
                                    <th class="text-left px-4 py-3 font-medium">Owner</th>
                                    <th class="text-left px-4 py-3 font-medium">Source</th>
                                </tr>
                                <tr class="bg-white">
                                    <th class="px-4 py-3">
                                        <select id="contactsFilterType" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                            <option>All</option>
                                            <option>Client</option>
                                            <option>Lead</option>
                                        </select>
                                    </th>
                                    <th class="px-4 py-3">
                                        <input id="contactsFilterName" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Filter" />
                                    </th>
                                    <th class="px-4 py-3">
                                        <input id="contactsFilterPhone" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Filter" />
                                    </th>
                                    <th class="px-4 py-3">
                                        <input id="contactsFilterEmail" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Filter" />
                                    </th>
                                    <th class="px-4 py-3">
                                        <select id="contactsFilterOwner" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                            <option>All</option>
                                            ${owners.map(o => `<option>${o}</option>`).join('')}
                                        </select>
                                    </th>
                                    <th class="px-4 py-3">
                                        <select id="contactsFilterSource" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                            <option>All</option>
                                            ${sources.map(s => `<option>${s}</option>`).join('')}
                                        </select>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200">
                                ${contacts.map(c => {
                                    const esc = (v) => String(v ?? '').replace(/</g, '&lt;');
                                    const typeChip = String(c.type || '').toLowerCase() === 'client'
                                        ? '<span class="px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full">Client</span>'
                                        : '<span class="px-2 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full">Lead</span>';
                                    return `
                                        <tr data-contact-row="1" data-type="${esc(c.type).toLowerCase()}" data-name="${esc(c.name)}" data-phone="${esc(c.phone)}" data-email="${esc(c.email)}" data-owner="${esc(c.owner).toLowerCase()}" data-source="${esc(c.source).toLowerCase()}" class="hover:bg-slate-50">
                                            <td class="px-4 py-3">${typeChip}</td>
                                            <td class="px-4 py-3">
                                                <div class="font-medium text-slate-900">${esc(c.name)}</div>
                                            </td>
                                            <td class="px-4 py-3 text-slate-700">${esc(c.phone) || '—'}</td>
                                            <td class="px-4 py-3 text-slate-700">${esc(c.email) || '—'}</td>
                                            <td class="px-4 py-3 text-slate-700">${esc(c.owner) || '—'}</td>
                                            <td class="px-4 py-3 text-slate-700">${esc(c.source) || '—'}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    getLeadsOnboarding() {
        const steps = [
            { name: 'Client Registered', done: true },
            { name: 'Project Created', done: true },
            { name: 'Quotation Sent', done: true },
            { name: 'Invoice Generated', done: false },
            { name: 'Payment Received', done: false },
            { name: 'Delivery Completed', done: false },
            { name: 'Feedback Collected', done: false },
            { name: 'Re-engagement Scheduled', done: false }
        ];

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Onboarding Status</h2>
                        <p class="text-sm text-slate-500">Master flow checklist for GreenLeaf Industries</p>
                    </div>
                    <button class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Update Status</button>
                </div>

                <div class="grid grid-cols-3 gap-6">
                    <div class="col-span-2 bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm font-medium text-slate-900">GreenLeaf Industries</div>
                                <div class="text-xs text-slate-500">Onboarding • Owner: Sarah Kumar</div>
                            </div>
                            <span class="px-2 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full">Onboarding</span>
                        </div>

                        <div class="mt-5 grid grid-cols-2 gap-3">
                            ${steps.map(s => `
                                <div class="flex items-center gap-3 p-3 rounded-lg border ${s.done ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'}">
                                    <i data-lucide="${s.done ? 'check-circle' : 'circle'}" class="w-4 h-4 ${s.done ? 'text-emerald-700' : 'text-slate-400'}"></i>
                                    <div class="text-sm ${s.done ? 'text-emerald-900' : 'text-slate-700'}">${s.name}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900">Next Best Actions</h3>
                        <div class="mt-4 space-y-3">
                            <div class="p-3 bg-amber-50 rounded-lg border border-amber-100">
                                <div class="text-sm font-medium text-amber-900">Generate invoice</div>
                                <div class="text-xs text-amber-800">From approved quotation QTN-44</div>
                            </div>
                            <div class="p-3 bg-sky-50 rounded-lg border border-sky-100">
                                <div class="text-sm font-medium text-sky-900">Schedule delivery kickoff</div>
                                <div class="text-xs text-sky-800">Align milestones and owners</div>
                            </div>
                            <div class="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                <div class="text-sm font-medium text-emerald-900">Enable smart alerts</div>
                                <div class="text-xs text-emerald-800">Payment due and engagement reminders</div>
                            </div>
                        </div>
                        <button class="mt-5 w-full px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Apply Actions</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderProjectsContent(container) {
        switch (this.currentSubSection) {
            case 'registration':
                container.innerHTML = this.getProjectRegistration();
                break;
            case 'directory':
                container.innerHTML = this.getProjectDirectory();
                break;
            case 'pipeline':
                container.innerHTML = this.getSalesPipeline();
                break;
            case 'active':
                container.innerHTML = this.getActiveProjects();
                break;
            case 'completed':
                container.innerHTML = this.getCompletedProjects();
                break;
            default:
                container.innerHTML = this.getSalesPipeline();
        }
    }

    getProjectRegistration() {
        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Project Registration</h2>
                        <p class="text-sm text-slate-500">Create a project linked to pipeline + billing</p>
                    </div>
                    <button data-action="project:register" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Create Project</button>
                </div>

                <div class="flex justify-center">
                    <div class="w-full max-w-4xl bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-xs font-medium text-slate-600">Client</label>
                                <select id="projectClient" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    <option>TechNova Solutions</option>
                                    <option>GreenLeaf Industries</option>
                                    <option>EduSpark</option>
                                    <option>Mumbai Retail Chain</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600">Project Name</label>
                                <input id="projectName" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., SEO Revamp" />
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600">Start Date</label>
                                <input id="projectStartDate" type="date" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600">Duration</label>
                                <select id="projectDuration" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    <option>1-3 months</option>
                                    <option>3-6 months</option>
                                    <option>6-12 months</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600">Budget (₹)</label>
                                <input id="projectBudget" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., 320000" />
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600">Assigned Team</label>
                                <input id="projectTeam" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="SEO + Content + Ads" />
                            </div>
                            <div class="col-span-2">
                                <label class="text-xs font-medium text-slate-600">Milestones</label>
                                <div class="mt-2 grid grid-cols-3 gap-3">
                                    <div class="p-3 bg-slate-50 rounded-lg">
                                        <div class="text-sm font-medium text-slate-900">Discovery</div>
                                        <div class="text-xs text-slate-500">Week 1</div>
                                    </div>
                                    <div class="p-3 bg-slate-50 rounded-lg">
                                        <div class="text-sm font-medium text-slate-900">Execution</div>
                                        <div class="text-xs text-slate-500">Weeks 2-6</div>
                                    </div>
                                    <div class="p-3 bg-slate-50 rounded-lg">
                                        <div class="text-sm font-medium text-slate-900">Reporting</div>
                                        <div class="text-xs text-slate-500">Week 7+</div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-span-2 mt-4 space-y-4">
                                <details open class="group">
                                    <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Project Identification Details</summary>
                                    <div class="mt-3 grid grid-cols-2 gap-3">
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Project Code</label>
                                            <input id="projectCode" readonly class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-700" placeholder="Auto-generated based on Service Code" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Service Code</label>
                                            <select id="serviceCode" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                <option value="">Select</option>
                                                <option value="RE">RE</option>
                                                <option value="CAD">CAD</option>
                                                <option value="2D">2D</option>
                                                <option value="2DI">2DI</option>
                                                <option value="3DI">3DI</option>
                                                <option value="CD">CD</option>
                                                <option value="NPD">NPD</option>
                                                <option value="SPM">SPM</option>
                                                <option value="STL">STL</option>
                                                <option value="FEA">FEA</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Vendor Code</label>
                                            <input id="vendorCode" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Company Name</label>
                                            <input id="companyName" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Location</label>
                                            <input id="projectLocation" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Quantity (QTY)</label>
                                            <input id="projectQty" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Project Lead</label>
                                            <input id="projectLead" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Assigned By</label>
                                            <input id="assignedBy" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Assigned To (Employee)</label>
                                            <input id="assignedTo" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div class="col-span-2">
                                            <label class="text-xs font-medium text-slate-600">Project Description</label>
                                            <textarea id="projectDescription" rows="2" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                                        </div>
                                        <div class="col-span-2">
                                            <label class="text-xs font-medium text-slate-600">Part Description</label>
                                            <textarea id="partDescription" rows="2" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                                        </div>
                                    </div>
                                </details>

                                <details class="group">
                                    <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Technical Scope / Stage Tracking</summary>
                                    <div class="mt-3 grid grid-cols-2 gap-3">
                                        ${[
                                            ['model2dStatus','2D Model Status'],
                                            ['model3dStatus','3D Model Status'],
                                            ['scan3dStatus','3D Scan Status'],
                                            ['feaStatus','FEA Status'],
                                            ['qcInspectionStatus','QC / Inspection Status'],
                                            ['approvalStatus','Approval Status'],
                                            ['glApprovalStatus','GL Approval Status'],
                                            ['revisionStatus','Correction / Revision Status'],
                                            ['deliveryReportStatus','Delivery Report Status'],
                                            ['sopDailyReportStatus','SOP-Based Daily Report Status']
                                        ].map(([k,label]) => `
                                            <div>
                                                <label class="text-xs font-medium text-slate-600">${label}</label>
                                                <select id="reg_tracking_${k}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                    ${['Pending','In Progress','Completed','Blocked'].map(opt => `<option>${opt}</option>`).join('')}
                                                </select>
                                            </div>
                                        `).join('')}
                                    </div>
                                </details>

                                <details class="group">
                                    <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Project Roadmap & Progress Monitoring</summary>
                                    <div class="mt-3 grid grid-cols-2 gap-3">
                                        ${[
                                            ['reg_monitoring_roadmapSubmitted','Project Roadmap Submitted'],
                                            ['reg_monitoring_dashboardUpdated','Dashboard Updated'],
                                            ['reg_monitoring_dailyReportUpdated','Daily Report Updated'],
                                            ['reg_monitoring_photoAttached','Photo Attached']
                                        ].map(([id,label]) => `
                                            <div>
                                                <label class="text-xs font-medium text-slate-600">${label} (Yes/No)</label>
                                                <select id="${id}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                    <option>Yes</option>
                                                    <option selected>No</option>
                                                </select>
                                            </div>
                                        `).join('')}
                                        <div class="col-span-2">
                                            <label class="text-xs font-medium text-slate-600">Overall Project Status</label>
                                            <select id="reg_monitoring_overallProjectStatus" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                ${['Completed','Partially Completed','Pending / Delayed'].map(opt => `<option ${opt === 'Pending / Delayed' ? 'selected' : ''}>${opt}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Post Completion Status</label>
                                            <input id="reg_monitoring_postCompletionStatus" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Physical Part Status</label>
                                            <input id="reg_monitoring_physicalPartStatus" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                    </div>
                                </details>

                                <details class="group">
                                    <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Dispatch & Delivery Details</summary>
                                    <div class="mt-3 grid grid-cols-2 gap-3">
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">DC Date</label>
                                            <input id="reg_dispatch_dcDate" type="date" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">DC Number</label>
                                            <input id="reg_dispatch_dcNumber" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Delivery Status</label>
                                            <select id="reg_dispatch_deliveryStatus" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                ${['Pending','In Progress','Completed','Blocked'].map(opt => `<option ${opt === 'Pending' ? 'selected' : ''}>${opt}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Delivery Date</label>
                                            <input id="reg_dispatch_deliveryDate" type="date" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Delivery Confirmation (Yes/No)</label>
                                            <select id="reg_dispatch_deliveryConfirmation" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                <option>Yes</option>
                                                <option selected>No</option>
                                            </select>
                                        </div>
                                    </div>
                                </details>

                                <details class="group">
                                    <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Quotation & Purchase Details</summary>
                                    <div class="mt-3 grid grid-cols-2 gap-3">
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Quotation Date</label>
                                            <input id="reg_purchase_quotationDate" type="date" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Quotation Number</label>
                                            <input id="reg_purchase_quotationNumber" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">PO Date</label>
                                            <input id="reg_purchase_poDate" type="date" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">PO Number</label>
                                            <input id="reg_purchase_poNumber" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">PO Value</label>
                                            <input id="reg_purchase_poValue" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Converted By</label>
                                            <input id="reg_purchase_convertedBy" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Visit Conducted (Yes/No)</label>
                                            <select id="reg_purchase_visitConducted" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                <option>Yes</option>
                                                <option selected>No</option>
                                            </select>
                                        </div>
                                    </div>
                                </details>

                                <details class="group">
                                    <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Invoice & Payment Tracking</summary>
                                    <div class="mt-3 grid grid-cols-2 gap-3">
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Invoice Date</label>
                                            <input id="reg_payment_invoiceDate" type="date" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Invoice Number</label>
                                            <input id="reg_payment_invoiceNumber" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Invoice Amount</label>
                                            <input id="reg_payment_invoiceAmount" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Past Invoice Amount</label>
                                            <input id="reg_payment_pastInvoiceAmount" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Payment Terms</label>
                                            <input id="reg_payment_paymentTerms" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Payment Type</label>
                                            <input id="reg_payment_paymentType" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Payment Due Date</label>
                                            <input id="reg_payment_paymentDueDate" type="date" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Payment Received Date</label>
                                            <input id="reg_payment_paymentReceivedDate" type="date" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Payment Received Amount</label>
                                            <input id="reg_payment_paymentReceivedAmount" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Balance Payment Due Date</label>
                                            <input id="reg_payment_balancePaymentDueDate" type="date" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Balance Payment Amount</label>
                                            <input id="reg_payment_balancePaymentAmount" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                    </div>
                                </details>

                                <details class="group">
                                    <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Performance & Rating</summary>
                                    <div class="mt-3 grid grid-cols-2 gap-3">
                                        ${[
                                            ['reg_ratings_clientRating','Client Rating'],
                                            ['reg_ratings_jobRating','Job Rating'],
                                            ['reg_ratings_qualityRating','Quality Rating'],
                                            ['reg_ratings_serviceRating','Service Rating'],
                                            ['reg_ratings_performanceRating','Performance Rating']
                                        ].map(([id,label]) => `
                                            <div>
                                                <label class="text-xs font-medium text-slate-600">${label} (0-10)</label>
                                                <input id="${id}" type="number" min="0" max="10" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                            </div>
                                        `).join('')}
                                        <div class="col-span-2">
                                            <label class="text-xs font-medium text-slate-600">Feedback / Comments</label>
                                            <textarea id="reg_ratings_feedbackComments" rows="2" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                                        </div>
                                        <div class="col-span-2">
                                            <label class="text-xs font-medium text-slate-600">Additional Notes</label>
                                            <textarea id="reg_ratings_additionalNotes" rows="2" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                                        </div>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getProjectDirectory() {
        const defaults = [
            { 
                name: 'SEO Revamp', 
                client: 'TechNova Solutions', 
                progress: 62, 
                status: 'On Track', 
                statusColor: 'emerald', 
                owner: 'Rohan', 
                budget: '₹3,20,000', 
                spent: '₹2,10,000',
                identification: { 
                    projectCode: 'APJ26RE001', 
                    serviceCode: 'RE',
                    vendorCode: 'KAK001',
                    companyName: 'TechNova Solutions',
                    location: 'Bengaluru',
                    qty: '1',
                    projectLead: 'Rohan',
                    assignedBy: 'Sarah',
                    assignedTo: 'Amit',
                    projectDescription: 'Complete SEO overhaul with focus on technical optimization and content strategy',
                    partDescription: 'Website optimization including meta tags, schema markup, and site speed improvements'
                },
                tracking: {
                    model2dStatus: 'Completed',
                    model3dStatus: 'In Progress',
                    scan3dStatus: 'Pending',
                    feaStatus: 'Pending',
                    qcInspectionStatus: 'Pending',
                    approvalStatus: 'Pending',
                    glApprovalStatus: 'Pending',
                    revisionStatus: 'Pending',
                    deliveryReportStatus: 'Pending',
                    sopDailyReportStatus: 'In Progress'
                },
                monitoring: {
                    roadmapSubmitted: 'Yes',
                    dashboardUpdated: 'Yes',
                    dailyReportUpdated: 'No',
                    photoAttached: 'Yes',
                    overallProjectStatus: 'Partially Completed',
                    postCompletionStatus: 'Awaiting client feedback',
                    physicalPartStatus: 'In production'
                },
                dispatch: {
                    dcDate: '2026-02-15',
                    dcNumber: 'DC/2026/001',
                    deliveryStatus: 'Pending',
                    deliveryDate: '2026-02-20',
                    deliveryConfirmation: 'No'
                },
                purchase: {
                    quotationDate: '2026-01-10',
                    quotationNumber: 'QTN-2026-001',
                    poDate: '2026-01-15',
                    poNumber: 'PO-2026-001',
                    poValue: '₹3,20,000',
                    convertedBy: 'Sarah',
                    visitConducted: 'Yes'
                },
                payment: {
                    invoiceDate: '2026-01-20',
                    invoiceNumber: 'INV-2026-001',
                    invoiceAmount: '₹1,60,000',
                    pastInvoiceAmount: '₹0',
                    paymentTerms: '50% advance, 50% on delivery',
                    paymentType: 'Bank Transfer',
                    paymentDueDate: '2026-02-20',
                    paymentReceivedDate: '2026-01-25',
                    paymentReceivedAmount: '₹1,60,000',
                    balancePaymentDueDate: '2026-02-20',
                    balancePaymentAmount: '₹1,60,000',
                    overdueStatus: 'On Time'
                },
                ratings: {
                    clientRating: '8',
                    jobRating: '7',
                    qualityRating: '8',
                    serviceRating: '9',
                    performanceRating: '8',
                    feedbackComments: 'Good progress so far, looking forward to final delivery',
                    additionalNotes: 'Client very responsive to communications'
                }
            },
            { 
                name: 'CRM Upgrade', 
                client: 'GreenLeaf Industries', 
                progress: 45, 
                status: 'At Risk', 
                statusColor: 'amber', 
                owner: 'Sarah', 
                budget: '₹2,80,000', 
                spent: '₹1,60,000',
                identification: { 
                    projectCode: 'APJ26CAD001', 
                    serviceCode: 'CAD',
                    vendorCode: 'OST001',
                    companyName: 'GreenLeaf Industries',
                    location: 'Pune',
                    qty: '1',
                    projectLead: 'Sarah',
                    assignedBy: 'Rohan',
                    assignedTo: 'Meera',
                    projectDescription: 'CRM system upgrade with custom module development',
                    partDescription: 'Custom dashboard and reporting modules for manufacturing workflow'
                },
                tracking: {
                    model2dStatus: 'Completed',
                    model3dStatus: 'Completed',
                    scan3dStatus: 'Pending',
                    feaStatus: 'In Progress',
                    qcInspectionStatus: 'Pending',
                    approvalStatus: 'Pending',
                    glApprovalStatus: 'Pending',
                    revisionStatus: 'Pending',
                    deliveryReportStatus: 'Pending',
                    sopDailyReportStatus: 'Yes'
                },
                monitoring: {
                    roadmapSubmitted: 'Yes',
                    dashboardUpdated: 'No',
                    dailyReportUpdated: 'Yes',
                    photoAttached: 'No',
                    overallProjectStatus: 'Pending / Delayed',
                    postCompletionStatus: 'Testing phase',
                    physicalPartStatus: 'Assembly required'
                },
                dispatch: {
                    dcDate: '',
                    dcNumber: '',
                    deliveryStatus: 'Pending',
                    deliveryDate: '2026-03-01',
                    deliveryConfirmation: 'No'
                },
                purchase: {
                    quotationDate: '2026-01-05',
                    quotationNumber: 'QTN-2026-002',
                    poDate: '2026-01-12',
                    poNumber: 'PO-2026-002',
                    poValue: '₹2,80,000',
                    convertedBy: 'Rohan',
                    visitConducted: 'Yes'
                },
                payment: {
                    invoiceDate: '2026-01-18',
                    invoiceNumber: 'INV-2026-002',
                    invoiceAmount: '₹1,40,000',
                    pastInvoiceAmount: '₹0',
                    paymentTerms: '50% advance, 50% on delivery',
                    paymentType: 'Bank Transfer',
                    paymentDueDate: '2026-02-18',
                    paymentReceivedDate: '2026-01-22',
                    paymentReceivedAmount: '₹1,40,000',
                    balancePaymentDueDate: '2026-03-01',
                    balancePaymentAmount: '₹1,40,000',
                    overdueStatus: 'On Time'
                },
                ratings: {
                    clientRating: '6',
                    jobRating: '7',
                    qualityRating: '6',
                    serviceRating: '7',
                    performanceRating: '6',
                    feedbackComments: 'Some delays in delivery, but quality is good',
                    additionalNotes: 'Scope expansion requested by client'
                }
            },
            { 
                name: 'Re-engagement Funnel', 
                client: 'EduSpark', 
                progress: 28, 
                status: 'On Track', 
                statusColor: 'sky', 
                owner: 'Meera', 
                budget: '₹1,50,000', 
                spent: '₹98,000',
                identification: { 
                    projectCode: 'APJ262D001', 
                    serviceCode: '2D',
                    vendorCode: 'OTN001',
                    companyName: 'EduSpark',
                    location: 'Hyderabad',
                    qty: '1',
                    projectLead: 'Meera',
                    assignedBy: 'Amit',
                    assignedTo: 'Rohan',
                    projectDescription: 'Customer re-engagement campaign with multi-channel approach',
                    partDescription: 'Email templates, landing pages, and social media content'
                },
                tracking: {
                    model2dStatus: 'In Progress',
                    model3dStatus: 'Pending',
                    scan3dStatus: 'Pending',
                    feaStatus: 'Pending',
                    qcInspectionStatus: 'Pending',
                    approvalStatus: 'Pending',
                    glApprovalStatus: 'Pending',
                    revisionStatus: 'Pending',
                    deliveryReportStatus: 'Pending',
                    sopDailyReportStatus: 'No'
                },
                monitoring: {
                    roadmapSubmitted: 'No',
                    dashboardUpdated: 'Yes',
                    dailyReportUpdated: 'No',
                    photoAttached: 'No',
                    overallProjectStatus: 'Pending / Delayed',
                    postCompletionStatus: '',
                    physicalPartStatus: ''
                },
                dispatch: {
                    dcDate: '',
                    dcNumber: '',
                    deliveryStatus: 'Pending',
                    deliveryDate: '2026-03-15',
                    deliveryConfirmation: 'No'
                },
                purchase: {
                    quotationDate: '2026-01-25',
                    quotationNumber: 'QTN-2026-003',
                    poDate: '2026-02-01',
                    poNumber: 'PO-2026-003',
                    poValue: '₹1,50,000',
                    convertedBy: 'Amit',
                    visitConducted: 'No'
                },
                payment: {
                    invoiceDate: '',
                    invoiceNumber: '',
                    invoiceAmount: '',
                    pastInvoiceAmount: '₹0',
                    paymentTerms: '100% on delivery',
                    paymentType: 'Bank Transfer',
                    paymentDueDate: '2026-03-15',
                    paymentReceivedDate: '',
                    paymentReceivedAmount: '',
                    balancePaymentDueDate: '2026-03-15',
                    balancePaymentAmount: '₹1,50,000',
                    overdueStatus: 'Pending'
                },
                ratings: {
                    clientRating: '',
                    jobRating: '',
                    qualityRating: '',
                    serviceRating: '',
                    performanceRating: '',
                    feedbackComments: '',
                    additionalNotes: ''
                }
            },
            { 
                name: 'Performance Ads', 
                client: 'Mumbai Retail Chain', 
                progress: 71, 
                status: 'On Track', 
                statusColor: 'emerald', 
                owner: 'Amit', 
                budget: '₹1,80,000', 
                spent: '₹1,23,000',
                identification: { 
                    projectCode: 'APJ262DI001', 
                    serviceCode: '2DI',
                    vendorCode: 'CHN001',
                    companyName: 'Mumbai Retail Chain',
                    location: 'Mumbai',
                    qty: '1',
                    projectLead: 'Amit',
                    assignedBy: 'Meera',
                    assignedTo: 'Sarah',
                    projectDescription: 'Performance marketing campaign for festive season',
                    partDescription: 'Google Ads, Facebook Ads, and Instagram campaign setup'
                },
                tracking: {
                    model2dStatus: 'Completed',
                    model3dStatus: 'Completed',
                    scan3dStatus: 'Completed',
                    feaStatus: 'Completed',
                    qcInspectionStatus: 'Completed',
                    approvalStatus: 'Completed',
                    glApprovalStatus: 'Completed',
                    revisionStatus: 'Completed',
                    deliveryReportStatus: 'In Progress',
                    sopDailyReportStatus: 'Yes'
                },
                monitoring: {
                    roadmapSubmitted: 'Yes',
                    dashboardUpdated: 'Yes',
                    dailyReportUpdated: 'Yes',
                    photoAttached: 'Yes',
                    overallProjectStatus: 'Completed',
                    postCompletionStatus: 'Campaign live and performing well',
                    physicalPartStatus: 'N/A'
                },
                dispatch: {
                    dcDate: '2026-02-01',
                    dcNumber: 'DC/2026/002',
                    deliveryStatus: 'Completed',
                    deliveryDate: '2026-02-05',
                    deliveryConfirmation: 'Yes'
                },
                purchase: {
                    quotationDate: '2026-01-08',
                    quotationNumber: 'QTN-2026-004',
                    poDate: '2026-01-10',
                    poNumber: 'PO-2026-004',
                    poValue: '₹1,80,000',
                    convertedBy: 'Meera',
                    visitConducted: 'Yes'
                },
                payment: {
                    invoiceDate: '2026-02-10',
                    invoiceNumber: 'INV-2026-004',
                    invoiceAmount: '₹90,000',
                    pastInvoiceAmount: '₹0',
                    paymentTerms: '50% advance, 50% on completion',
                    paymentType: 'Bank Transfer',
                    paymentDueDate: '2026-02-25',
                    paymentReceivedDate: '2026-02-12',
                    paymentReceivedAmount: '₹90,000',
                    balancePaymentDueDate: '2026-03-10',
                    balancePaymentAmount: '₹90,000',
                    overdueStatus: 'On Time'
                },
                ratings: {
                    clientRating: '9',
                    jobRating: '9',
                    qualityRating: '8',
                    serviceRating: '10',
                    performanceRating: '9',
                    feedbackComments: 'Excellent results! ROI exceeded expectations.',
                    additionalNotes: 'Client wants to continue with monthly retainer'
                }
            }
        ];
        
        const projects = this.getAllProjectsMerged(defaults);
        try {
            this._projectsCacheByKey = new Map(projects.map(p => [this.getProjectKey(p), p]));
        } catch (_) {
            this._projectsCacheByKey = null;
        }

        const selectedKey = this.selectedProjectKey || '';
        const selected = selectedKey ? (projects.find(p => this.getProjectKey(p) === selectedKey) || null) : null;
        const esc = (v) => String(v ?? '').replace(/</g, '&lt;').replace(/"/g, '&quot;');

        const renderStatusSelect = (p, path, current) => {
            const key = this.getProjectKey(p);
            return `
                <select data-project-key="${key}" data-project-field="${path}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    ${['Pending','In Progress','Completed','Blocked'].map(opt => `<option ${opt === (current || 'Pending') ? 'selected' : ''}>${opt}</option>`).join('')}
                </select>
            `;
        };

        const renderProfile = (p) => {
            if (!p) {
                return `<div class="text-sm text-slate-500">Select a project to view details.</div>`;
            }
            const key = this.getProjectKey(p);
            return `
                <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <h3 class="text-lg font-semibold text-slate-900">${esc(p.name)}</h3>
                            <div class="text-sm text-slate-500">${esc(p.client)}</div>
                        </div>
                        <span class="px-2 py-1 text-xs font-medium bg-${p.statusColor || 'sky'}-50 text-${p.statusColor || 'sky'}-700 rounded-full">${esc(p.status || '—')}</span>
                    </div>

                    <div class="mt-5 space-y-4">
                        <details open class="group">
                            <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Project Identification Details</summary>
                            <div class="mt-3 grid grid-cols-2 gap-3">
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Project Code</label>
                                    <input data-project-key="${key}" data-project-field="identification.projectCode" value="${esc(p.identification?.projectCode || '')}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Service Code</label>
                                    <select data-project-key="${key}" data-project-field="identification.serviceCode" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        <option value="">Select</option>
                                        <option value="RE" ${p.identification?.serviceCode === 'RE' ? 'selected' : ''}>RE</option>
                                        <option value="CAD" ${p.identification?.serviceCode === 'CAD' ? 'selected' : ''}>CAD</option>
                                        <option value="2D" ${p.identification?.serviceCode === '2D' ? 'selected' : ''}>2D</option>
                                        <option value="2DI" ${p.identification?.serviceCode === '2DI' ? 'selected' : ''}>2DI</option>
                                        <option value="3DI" ${p.identification?.serviceCode === '3DI' ? 'selected' : ''}>3DI</option>
                                        <option value="CD" ${p.identification?.serviceCode === 'CD' ? 'selected' : ''}>CD</option>
                                        <option value="NPD" ${p.identification?.serviceCode === 'NPD' ? 'selected' : ''}>NPD</option>
                                        <option value="SPM" ${p.identification?.serviceCode === 'SPM' ? 'selected' : ''}>SPM</option>
                                        <option value="STL" ${p.identification?.serviceCode === 'STL' ? 'selected' : ''}>STL</option>
                                        <option value="FEA" ${p.identification?.serviceCode === 'FEA' ? 'selected' : ''}>FEA</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Vendor Code</label>
                                    <input data-project-key="${key}" data-project-field="identification.vendorCode" value="${esc(p.identification?.vendorCode || '')}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Company Name</label>
                                    <input data-project-key="${key}" data-project-field="identification.companyName" value="${esc(p.identification?.companyName || '')}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Location</label>
                                    <input data-project-key="${key}" data-project-field="identification.location" value="${esc(p.identification?.location || '')}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Quantity (QTY)</label>
                                    <input data-project-key="${key}" data-project-field="identification.qty" value="${esc(p.identification?.qty || '')}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Project Lead</label>
                                    <input data-project-key="${key}" data-project-field="identification.projectLead" value="${esc(p.identification?.projectLead || '')}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Assigned By</label>
                                    <input data-project-key="${key}" data-project-field="identification.assignedBy" value="${esc(p.identification?.assignedBy || '')}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Assigned To (Employee)</label>
                                    <input data-project-key="${key}" data-project-field="identification.assignedTo" value="${esc(p.identification?.assignedTo || '')}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div class="col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Project Description</label>
                                    <textarea data-project-key="${key}" data-project-field="identification.projectDescription" rows="2" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">${String(p.identification?.projectDescription || '').replace(/</g, '&lt;')}</textarea>
                                </div>
                                <div class="col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Part Description</label>
                                    <textarea data-project-key="${key}" data-project-field="identification.partDescription" rows="2" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">${String(p.identification?.partDescription || '').replace(/</g, '&lt;')}</textarea>
                                </div>
                            </div>
                        </details>

                        <details class="group">
                            <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Technical Scope / Stage Tracking</summary>
                            <div class="mt-3 grid grid-cols-2 gap-3">
                                ${[
                                    ['model2dStatus','2D Model Status'],
                                    ['model3dStatus','3D Model Status'],
                                    ['scan3dStatus','3D Scan Status'],
                                    ['feaStatus','FEA Status'],
                                    ['qcInspectionStatus','QC / Inspection Status'],
                                    ['approvalStatus','Approval Status'],
                                    ['glApprovalStatus','GL Approval Status'],
                                    ['revisionStatus','Correction / Revision Status'],
                                    ['deliveryReportStatus','Delivery Report Status'],
                                    ['sopDailyReportStatus','SOP-Based Daily Report Status']
                                ].map(([k,label]) => `
                                    <div>
                                        <label class="text-xs font-medium text-slate-600">${label}</label>
                                        ${renderStatusSelect(p, `tracking.${k}`, p.tracking?.[k] || 'Pending')}
                                    </div>
                                `).join('')}
                            </div>
                        </details>

                        <details class="group">
                            <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Project Roadmap & Progress Monitoring</summary>
                            <div class="mt-3 grid grid-cols-2 gap-3">
                                ${[
                                    ['monitoring.roadmapSubmitted','Project Roadmap Submitted'],
                                    ['monitoring.dashboardUpdated','Dashboard Updated'],
                                    ['monitoring.dailyReportUpdated','Daily Report Updated'],
                                    ['monitoring.photoAttached','Photo Attached']
                                ].map(([field,label]) => {
                                    const cur = field.split('.').reduce((acc, part) => acc?.[part], p) || 'No';
                                    return `
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">${label} (Yes/No)</label>
                                            <select data-project-key="${key}" data-project-field="${field}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                <option ${cur === 'Yes' ? 'selected' : ''}>Yes</option>
                                                <option ${cur !== 'Yes' ? 'selected' : ''}>No</option>
                                            </select>
                                        </div>
                                    `;
                                }).join('')}
                                <div class="col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Overall Project Status</label>
                                    <select data-project-key="${key}" data-project-field="monitoring.overallProjectStatus" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        ${['Completed','Partially Completed','Pending / Delayed'].map(opt => `<option ${opt === (p.monitoring?.overallProjectStatus || 'Pending / Delayed') ? 'selected' : ''}>${opt}</option>`).join('')}
                                    </select>
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Post Completion Status</label>
                                    <input data-project-key="${key}" data-project-field="monitoring.postCompletionStatus" value="${esc(p.monitoring?.postCompletionStatus || '')}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Physical Part Status</label>
                                    <input data-project-key="${key}" data-project-field="monitoring.physicalPartStatus" value="${esc(p.monitoring?.physicalPartStatus || '')}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                            </div>
                        </details>

                        <details class="group">
                            <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Dispatch & Delivery Details</summary>
                            <div class="mt-3 grid grid-cols-2 gap-3">
                                <div>
                                    <label class="text-xs font-medium text-slate-600">DC Date</label>
                                    <input data-project-key="${key}" data-project-field="dispatch.dcDate" type="date" value="${esc(p.dispatch?.dcDate || '')}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">DC Number</label>
                                    <input data-project-key="${key}" data-project-field="dispatch.dcNumber" value="${esc(p.dispatch?.dcNumber || '')}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Delivery Status</label>
                                    ${renderStatusSelect(p, 'dispatch.deliveryStatus', p.dispatch?.deliveryStatus || 'Pending')}
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Delivery Date</label>
                                    <input data-project-key="${key}" data-project-field="dispatch.deliveryDate" type="date" value="${esc(p.dispatch?.deliveryDate || '')}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Delivery Confirmation (Yes/No)</label>
                                    <select data-project-key="${key}" data-project-field="dispatch.deliveryConfirmation" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        <option ${String(p.dispatch?.deliveryConfirmation || 'No') === 'Yes' ? 'selected' : ''}>Yes</option>
                                        <option ${String(p.dispatch?.deliveryConfirmation || 'No') !== 'Yes' ? 'selected' : ''}>No</option>
                                    </select>
                                </div>
                            </div>
                        </details>

                        <details class="group">
                            <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Quotation & Purchase Details</summary>
                            <div class="mt-3 grid grid-cols-2 gap-3">
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Quotation Date</label>
                                    <input data-project-key="${key}" data-project-field="purchase.quotationDate" type="date" value="${esc(p.purchase?.quotationDate || '')}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Quotation Number</label>
                                    <input data-project-key="${key}" data-project-field="purchase.quotationNumber" value="${esc(p.purchase?.quotationNumber || '')}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">PO Date</label>
                                    <input data-project-key="${key}" data-project-field="purchase.poDate" type="date" value="${esc(p.purchase?.poDate || '')}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">PO Number</label>
                                    <input data-project-key="${key}" data-project-field="purchase.poNumber" value="${esc(p.purchase?.poNumber || '')}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">PO Value</label>
                                    <input data-project-key="${key}" data-project-field="purchase.poValue" value="${esc(p.purchase?.poValue || '')}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Converted By</label>
                                    <input data-project-key="${key}" data-project-field="purchase.convertedBy" value="${esc(p.purchase?.convertedBy || '')}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Visit Conducted (Yes/No)</label>
                                    <select data-project-key="${key}" data-project-field="purchase.visitConducted" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        <option ${String(p.purchase?.visitConducted || 'No') === 'Yes' ? 'selected' : ''}>Yes</option>
                                        <option ${String(p.purchase?.visitConducted || 'No') !== 'Yes' ? 'selected' : ''}>No</option>
                                    </select>
                                </div>
                            </div>
                        </details>

                        <details class="group">
                            <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Invoice & Payment Tracking</summary>
                            <div class="mt-3 grid grid-cols-2 gap-3">
                                ${[
                                    ['payment.invoiceDate','Invoice Date','date'],
                                    ['payment.invoiceNumber','Invoice Number','text'],
                                    ['payment.invoiceAmount','Invoice Amount','text'],
                                    ['payment.pastInvoiceAmount','Past Invoice Amount','text'],
                                    ['payment.paymentTerms','Payment Terms','text'],
                                    ['payment.paymentType','Payment Type','text'],
                                    ['payment.paymentDueDate','Payment Due Date','date'],
                                    ['payment.paymentReceivedDate','Payment Received Date','date'],
                                    ['payment.paymentReceivedAmount','Payment Received Amount','text'],
                                    ['payment.balancePaymentDueDate','Balance Payment Due Date','date'],
                                    ['payment.balancePaymentAmount','Balance Payment Amount','text']
                                ].map(([field,label,type]) => {
                                    const val = field.split('.').reduce((acc, part) => acc?.[part], p) || '';
                                    return `
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">${label}</label>
                                            <input data-project-key="${key}" data-project-field="${field}" type="${type}" value="${esc(val)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                    `;
                                }).join('')}
                                <div class="col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Overdue Status (auto)</label>
                                    <input value="${esc(p.payment?.overdueStatus || '')}" disabled class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-700" />
                                </div>
                            </div>
                        </details>

                        <details class="group">
                            <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Performance & Rating</summary>
                            <div class="mt-3 grid grid-cols-2 gap-3">
                                ${[
                                    ['ratings.clientRating','Client Rating'],
                                    ['ratings.jobRating','Job Rating'],
                                    ['ratings.qualityRating','Quality Rating'],
                                    ['ratings.serviceRating','Service Rating'],
                                    ['ratings.performanceRating','Performance Rating']
                                ].map(([field,label]) => {
                                    const val = field.split('.').reduce((acc, part) => acc?.[part], p) || '';
                                    return `
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">${label} (0-10)</label>
                                            <input data-project-key="${key}" data-project-field="${field}" type="number" min="0" max="10" value="${esc(val)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                    `;
                                }).join('')}
                                <div class="col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Feedback / Comments</label>
                                    <textarea data-project-key="${key}" data-project-field="ratings.feedbackComments" rows="2" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">${String(p.ratings?.feedbackComments || '').replace(/</g, '&lt;')}</textarea>
                                </div>
                                <div class="col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Additional Notes</label>
                                    <textarea data-project-key="${key}" data-project-field="ratings.additionalNotes" rows="2" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">${String(p.ratings?.additionalNotes || '').replace(/</g, '&lt;')}</textarea>
                                </div>
                            </div>
                        </details>
                    </div>

                    <div class="mt-6 flex gap-2">
                        <button data-action="project:save:${String(key).replace(/"/g, '&quot;')}" class="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700">Save</button>
                        <button data-action="project:delete:${String(key).replace(/"/g, '&quot;')}" class="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                    </div>
                </div>
            `;
        };

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Project Directory</h2>
                        <p class="text-sm text-slate-500">All projects with full profile details</p>
                    </div>
                </div>

                ${selected ? `
                    <div class="grid grid-cols-3 gap-6">
                        <div class="col-span-1 bg-white rounded-lg border border-slate-200 overflow-hidden">
                            <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                                <div class="text-sm font-medium text-slate-900">Projects</div>
                                <div class="text-xs text-slate-500">${projects.length}</div>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm">
                                    <thead class="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th class="text-left px-4 py-3 font-medium text-slate-700">Project Code</th>
                                            <th class="text-left px-4 py-3 font-medium text-slate-700">Company</th>
                                            <th class="text-left px-4 py-3 font-medium text-slate-700">Lead</th>
                                            <th class="text-left px-4 py-3 font-medium text-slate-700">Assigned</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-200">
                                        ${projects.map(p => {
                                            const k = this.getProjectKey(p);
                                            const isActive = selected && this.getProjectKey(selected) === k;
                                            return `
                                                <tr class="${isActive ? 'bg-purple-50' : ''} hover:bg-slate-50">
                                                    <td class="px-4 py-3">
                                                        <button data-action="project:dir:select:${String(k).replace(/"/g, '&quot;')}" class="text-left w-full font-semibold text-slate-900 hover:text-purple-700">
                                                            ${esc(p.identification?.projectCode || '—')}
                                                        </button>
                                                    </td>
                                                    <td class="px-4 py-3 text-slate-700">${esc(p.identification?.companyName || p.client || '—')}</td>
                                                    <td class="px-4 py-3 text-slate-700">${esc(p.identification?.projectLead || p.owner || '—')}</td>
                                                    <td class="px-4 py-3 text-slate-700">${esc(p.identification?.assignedTo || '—')}</td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="col-span-2">
                            ${renderProfile(selected)}
                        </div>
                    </div>
                ` : `
                    <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                            <div class="text-sm font-medium text-slate-900">Projects</div>
                            <div class="text-xs text-slate-500">${projects.length}</div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead class="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th class="text-left px-4 py-3 font-medium text-slate-700">Project Code</th>
                                        <th class="text-left px-4 py-3 font-medium text-slate-700">Company</th>
                                        <th class="text-left px-4 py-3 font-medium text-slate-700">Lead</th>
                                        <th class="text-left px-4 py-3 font-medium text-slate-700">Assigned</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                    ${projects.map(p => {
                                        const k = this.getProjectKey(p);
                                        return `
                                            <tr class="hover:bg-slate-50">
                                                <td class="px-4 py-3">
                                                    <button data-action="project:dir:select:${String(k).replace(/"/g, '&quot;')}" class="text-left w-full font-semibold text-slate-900 hover:text-purple-700">
                                                        ${esc(p.identification?.projectCode || '—')}
                                                    </button>
                                                </td>
                                                <td class="px-4 py-3 text-slate-700">${esc(p.identification?.companyName || p.client || '—')}</td>
                                                <td class="px-4 py-3 text-slate-700">${esc(p.identification?.projectLead || p.owner || '—')}</td>
                                                <td class="px-4 py-3 text-slate-700">${esc(p.identification?.assignedTo || '—')}</td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `}
            </div>
        `;
    }

    getSalesPipeline() {
        const columns = [
            { id: 'lead', name: 'Lead', color: 'sky' },
            { id: 'deal', name: 'Deal', color: 'indigo' },
            { id: 'project', name: 'Project', color: 'emerald' },
            { id: 'payment', name: 'Payment', color: 'amber' }
        ];

        const cards = { lead: [], deal: [], project: [], payment: [] };

        // Leads: use clients (stored + defaults already merged in getClientsData)
        try {
            this.getClientsData().slice(0, 6).forEach(c => {
                cards.lead.push({
                    id: `cli:${String(c.name || '').trim()}`,
                    title: c.name,
                    value: c.dueAmount || '₹0',
                    meta: `Stage: ${c.stage || 'Active'}`
                });
            });
        } catch (_) {}

        // Projects: stored projects should show up here (plus defaults)
        try {
            const projects = [...this.getStoredProjects()];
            projects.slice(0, 6).forEach(p => {
                cards.project.push({
                    id: `proj:${String(p.name || '').trim()}`,
                    title: `${p.client || 'Client'} • ${p.name || 'Project'}`,
                    value: p.budget || '—',
                    meta: p.startDate ? `Start: ${p.startDate}` : (p.duration ? `Duration: ${p.duration}` : 'In progress')
                });
            });
        } catch (_) {}

        // Deals: use a small subset of active projects as "deal" placeholders
        try {
            const active = [...this.getStoredProjects()].slice(0, 3);
            active.forEach(p => {
                cards.deal.push({
                    id: `proj:${String(p.name || '').trim()}`,
                    title: `${p.client || 'Client'} • ${p.name || 'Project'}`,
                    value: p.budget || '—',
                    meta: 'Next: approval / scope'
                });
            });
        } catch (_) {}

        // Payment: invoices (stored + defaults)
        try {
            const defaults = [
                { no: 'INV-102', client: 'TechNova Solutions', amount: '₹42,000', due: '3 days overdue', status: 'Overdue', color: 'rose' },
                { no: 'INV-118', client: 'EduSpark', amount: '₹85,000', due: 'Paid', status: 'Paid', color: 'emerald' },
                { no: 'INV-121', client: 'GreenLeaf Industries', amount: '₹58,000', due: 'Due in 5 days', status: 'Pending', color: 'amber' }
            ];
            const invoices = [...this.getStoredInvoices(), ...defaults].slice(0, 6);
            invoices.forEach(i => {
                cards.payment.push({
                    id: `inv:${String(i.no || '').trim()}`,
                    title: `${i.no} • ${i.client}`,
                    value: i.amount,
                    meta: `${i.status} • ${i.due}`
                });
            });
        } catch (_) {}

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Sales Pipeline</h2>
                        <p class="text-sm text-slate-500">Kanban: Lead → Deal → Project → Payment</p>
                    </div>
                    <button class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ Add Deal</button>
                </div>

                <div class="grid grid-cols-4 gap-4">
                    ${columns.map(col => `
                        <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
                            <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                                <div class="font-medium text-slate-900">${col.name}</div>
                                <span class="text-xs font-medium bg-${col.color}-50 text-${col.color}-700 px-2 py-1 rounded-full">${(cards[col.id] || []).length}</span>
                            </div>
                            <div class="p-4 space-y-3 bg-slate-50">
                                ${(cards[col.id] || []).map(card => `
                                    <div class="bg-white rounded-lg border border-slate-200 p-4 shadow-lg hover:shadow-sm transition-shadow">
                                        <div class="text-sm font-semibold text-slate-900">${card.title}</div>
                                        <div class="text-sm text-slate-700 mt-1">${card.value}</div>
                                        <div class="text-xs text-slate-500 mt-2">${card.meta}</div>
                                        <div class="mt-3 flex items-center justify-between">
                                            <span class="text-[11px] text-slate-500">Updated today</span>
                                            <button data-action="pipeline:open:${card.id}" class="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors">Open</button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getActiveProjects() {
        const defaults = [
            { name: 'SEO Revamp', client: 'TechNova Solutions', progress: 62, status: 'On Track', statusColor: 'emerald', owner: 'Rohan', budget: '₹3,20,000', spent: '₹2,10,000', identification: { projectCode: 'APJ26RE001', serviceCode: 'RE' } },
            { name: 'CRM Upgrade', client: 'GreenLeaf Industries', progress: 45, status: 'At Risk', statusColor: 'amber', owner: 'Sarah', budget: '₹2,80,000', spent: '₹1,60,000', identification: { projectCode: 'APJ26CAD001', serviceCode: 'CAD' } },
            { name: 'Re-engagement Funnel', client: 'EduSpark', progress: 28, status: 'On Track', statusColor: 'sky', owner: 'Meera', budget: '₹1,50,000', spent: '₹98,000', identification: { projectCode: 'APJ262D001', serviceCode: '2D' } },
            { name: 'Performance Ads', client: 'Mumbai Retail Chain', progress: 71, status: 'On Track', statusColor: 'emerald', owner: 'Amit', budget: '₹1,80,000', spent: '₹1,23,000', identification: { projectCode: 'APJ262DI001', serviceCode: '2DI' } }
        ];
        const projects = this.getAllProjectsMerged(defaults);

        try {
            this._projectsCacheByKey = new Map(projects.map(p => [this.getProjectKey(p), p]));
        } catch (_) {
            this._projectsCacheByKey = null;
        }

        const progressStages = ['Brief', 'Planning', 'Execution', 'Review', 'Delivery'];
        const projectKey = (p) => `${String(p?.name || '').trim()}__${String(p?.client || '').trim()}`;
        const selectedKey = this.selectedProjectKey || '';
        const selected = selectedKey ? (projects.find(p => projectKey(p) === selectedKey) || null) : null;
        const stageIdx = selected ? Math.min(progressStages.length - 1, Math.max(0, Math.floor((Number(selected.progress) || 0) / (100 / progressStages.length)))) : 0;
        const stageColor = selected?.statusColor || 'sky';

        const renderVerticalProgress = () => {
            return `
                <div class="space-y-3">
                    ${progressStages.map((s, i) => {
                        const done = i <= stageIdx;
                        const line = done ? `bg-${stageColor}-500` : 'bg-slate-200';
                        const dot = done ? `bg-${stageColor}-600 border-${stageColor}-600` : 'bg-white border-slate-300';
                        const text = done ? 'text-slate-900' : 'text-slate-600';
                        const showLine = i < progressStages.length - 1;
                        return `
                            <div class="flex items-start gap-3">
                                <div class="flex flex-col items-center">
                                    <div class="w-6 h-6 rounded-full border ${dot} flex items-center justify-center">
                                        ${done ? '<i data-lucide="check" class="w-4 h-4 text-white"></i>' : ''}
                                    </div>
                                    ${showLine ? `<div class="w-[2px] h-7 ${line} mt-1"></div>` : ''}
                                </div>
                                <div class="pt-0.5">
                                    <div class="text-sm font-semibold ${text}">${s}</div>
                                    <div class="text-xs text-slate-500">Level ${i + 1}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        };

        const renderHorizontalStageProgress = (p) => {
            const pct = Math.max(0, Math.min(100, Number(p?.progress) || 0));
            const idx = Math.min(progressStages.length - 1, Math.max(0, Math.floor(pct / (100 / progressStages.length))));
            const c = p?.statusColor || 'sky';
            return `
                <div class="flex items-center gap-3">
                    <div class="flex items-center flex-1">
                        ${progressStages.map((_, i) => {
                            const done = i <= idx;
                            const isLast = i === progressStages.length - 1;
                            const dotBg = done ? `bg-${c}-600 border-${c}-600` : 'bg-slate-200 border-slate-200';
                            const lineBg = done ? `bg-${c}-500` : 'bg-slate-200';
                            return `
                                <div class="flex items-center ${isLast ? '' : 'flex-1'}">
                                    <div class="w-9 h-9 rounded-full border ${dotBg} flex items-center justify-center flex-shrink-0">
                                        ${done ? '<i data-lucide="check" class="w-5 h-5 text-white"></i>' : ''}
                                    </div>
                                    ${isLast ? '' : `<div class="h-[3px] ${lineBg} flex-1"></div>`}
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="text-xs font-semibold text-slate-900">${pct}%</div>
                </div>
            `;
        };

        const isSplit = Boolean(this.isProjectDetailOpen && selected);

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Active Projects</h2>
                        <p class="text-sm text-slate-500">Progress, team members, and budget health</p>
                    </div>
                    <button class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ Add Project</button>
                </div>

                <div class="grid grid-cols-3 gap-6">
                    <div class="${isSplit ? 'col-span-2' : 'col-span-3'} bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                            <div class="text-sm font-medium text-slate-900">Project List</div>
                            <div class="text-xs text-slate-500">${projects.length} active</div>
                        </div>
                        <div class="divide-y divide-slate-200">
                            ${projects.map(p => {
                                const key = projectKey(p);
                                const isActive = selected && projectKey(selected) === key;
                                return `
                                    <button data-action="project:select:${key.replace(/"/g, '&quot;')}" class="w-full text-left p-4 hover:bg-slate-50 ${isActive ? 'bg-purple-50' : ''}">
                                        <div class="flex items-start justify-between">
                                            <div>
                                                <div class="text-sm font-semibold text-slate-900">${p.name}</div>
                                                <div class="text-xs text-slate-500">${p.client} • Owner: ${p.owner}</div>
                                            </div>
                                            <span class="px-2 py-1 text-xs font-medium bg-${p.statusColor}-50 text-${p.statusColor}-700 rounded-full">${p.status}</span>
                                        </div>

                                        <div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                                            <div>
                                                ${renderHorizontalStageProgress(p)}
                                            </div>
                                            <div class="grid grid-cols-3 gap-3">
                                                <div class="p-3 bg-slate-50 rounded-lg">
                                                    <div class="text-xs text-slate-500">Budget</div>
                                                    <div class="text-sm font-semibold text-slate-900">${p.budget}</div>
                                                </div>
                                                <div class="p-3 bg-slate-50 rounded-lg">
                                                    <div class="text-xs text-slate-500">Spent</div>
                                                    <div class="text-sm font-semibold text-slate-900">${p.spent}</div>
                                                </div>
                                                <div class="p-3 bg-slate-50 rounded-lg">
                                                    <div class="text-xs text-slate-500">Service Code</div>
                                                    <div class="text-sm font-semibold text-slate-900">${p.identification?.serviceCode || '—'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    ${isSplit ? `
                        <div class="col-span-1 bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <h3 class="text-lg font-semibold text-slate-900">${selected.name}</h3>
                                    <div class="text-sm text-slate-500">${selected.client}</div>
                                </div>
                                <button data-action="project:detail:close" class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg" aria-label="Close">
                                    <i data-lucide="x" class="w-4 h-4"></i>
                                </button>
                            </div>

                            <div class="mt-3 flex items-center justify-between">
                                <span class="px-2 py-1 text-xs font-medium bg-${stageColor}-50 text-${stageColor}-700 rounded-full">${selected.status}</span>
                                <div class="text-xs text-slate-600">Progress: <span class="font-semibold text-slate-900">${selected.progress}%</span></div>
                            </div>

                            <div class="mt-4 grid grid-cols-2 gap-3">
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Owner</div>
                                    <div class="text-sm font-semibold text-slate-900">${selected.owner || '—'}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Lead</div>
                                    <div class="text-sm font-semibold text-slate-900">${selected.lead || selected.leadName || '—'}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Budget</div>
                                    <div class="text-sm font-semibold text-slate-900">${selected.budget || '—'}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Spent</div>
                                    <div class="text-sm font-semibold text-slate-900">${selected.spent || '—'}</div>
                                </div>
                            </div>

                            <div class="mt-5">
                                <button data-action="nav:projects/directory" class="w-full px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Open full details in Project Directory</button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    getCompletedProjects() {
        const items = [
            { name: 'Quarterly SEO Audit', client: 'Digital Dreams', delivered: 'Jan 18', value: '₹1,10,000', rating: 5 },
            { name: 'Website Optimization', client: 'EduSpark', delivered: 'Dec 03', value: '₹85,000', rating: 4 },
            { name: 'Campaign ROI Report', client: 'TechNova Solutions', delivered: 'Nov 22', value: '₹60,000', rating: 5 }
        ];
        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Completed Projects</h2>
                        <p class="text-sm text-slate-500">Delivery, feedback, and next-project signals</p>
                    </div>
                    <button class="px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Download Summary</button>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-slate-50 text-slate-600">
                                <tr>
                                    <th class="text-left px-4 py-3 font-medium">Project</th>
                                    <th class="text-left px-4 py-3 font-medium">Client</th>
                                    <th class="text-left px-4 py-3 font-medium">Delivered</th>
                                    <th class="text-right px-4 py-3 font-medium">Value</th>
                                    <th class="text-left px-4 py-3 font-medium">Feedback</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200">
                                ${items.map(i => `
                                    <tr class="hover:bg-slate-50">
                                        <td class="px-4 py-3 font-medium text-slate-900">${i.name}</td>
                                        <td class="px-4 py-3 text-slate-700">${i.client}</td>
                                        <td class="px-4 py-3 text-slate-700">${i.delivered}</td>
                                        <td class="px-4 py-3 text-right font-medium text-slate-900">${i.value}</td>
                                        <td class="px-4 py-3">
                                            <div class="flex items-center gap-1">
                                                ${Array.from({length: 5}).map((_, idx) => `
                                                    <i data-lucide="star" class="w-4 h-4 ${idx < i.rating ? 'text-amber-500' : 'text-slate-300'}"></i>
                                                `).join('')}
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    initializeBudgetVsSpentChart() {
        const ctx = document.getElementById('budgetSpentChart');
        if (ctx) {
            this.charts.budgetSpentChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['TechNova', 'GreenLeaf', 'EduSpark', 'Mumbai Retail'],
                    datasets: [
                        { label: 'Budget (₹)', data: [320000, 280000, 150000, 180000], backgroundColor: 'rgba(14, 165, 233, 0.65)' },
                        { label: 'Spent (₹)', data: [210000, 160000, 98000, 123000], backgroundColor: 'rgba(244, 63, 94, 0.65)' }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } },
                    scales: {
                        x: { grid: { display: false } },
                        y: { beginAtZero: true }
                    }
                }
            });
        }
    }

    renderCampaignsContent(container) {
        switch (this.currentSubSection) {
            case 'email':
                container.innerHTML = this.getEmailCampaigns();
                break;
            case 'sms':
                container.innerHTML = this.getSmsWhatsappCampaigns();
                break;
            case 'wishes':
                container.innerHTML = this.getWishesCampaigns();
                break;
            case 'reengagement':
                container.innerHTML = this.getReengagementCampaigns();
                break;
            default:
                container.innerHTML = this.getEmailCampaigns();
        }
    }

    getEmailCampaigns() {
        const defaults = [
            { name: 'CRM Upgrade', audience: 45, open: 31, click: 8, status: 'Sent', statusColor: 'emerald' },
            { name: 'Quarterly Offer', audience: 126, open: 28, click: 7, status: 'Scheduled', statusColor: 'amber' },
            { name: 'New Service Launch', audience: 78, open: 24, click: 6, status: 'Draft', statusColor: 'slate' }
        ];
        const campaigns = [...this.getStoredCampaigns(), ...defaults];

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Email Campaigns</h2>
                        <p class="text-sm text-slate-500">Open & click rates with performance trends</p>
                    </div>
                    <button data-action="campaign:create" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ New Campaign</button>
                </div>

                <div class="grid grid-cols-3 gap-6">
                    ${campaigns.map(c => `
                        <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                            <div class="flex items-start justify-between">
                                <div>
                                    <div class="text-lg font-semibold text-slate-900">${c.name}</div>
                                    <div class="text-xs text-slate-500 mt-1">Audience: ${c.audience}</div>
                                </div>
                                <span class="px-2 py-1 text-xs font-medium bg-${c.statusColor}-50 text-${c.statusColor}-700 rounded-full">${c.status}</span>
                            </div>
                            <div class="mt-4 grid grid-cols-2 gap-3">
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Open Rate</div>
                                    <div class="text-lg font-semibold text-slate-900">${c.open}%</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Click Rate</div>
                                    <div class="text-lg font-semibold text-slate-900">${c.click}%</div>
                                </div>
                            </div>
                            <div class="mt-4 grid grid-cols-3 gap-2">
                                <button data-action="campaign:preview" data-campaign-name="${c.name}" class="flex-1 px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Preview</button>
                                ${c.status === 'Sent' ? `
                                    <button data-action="campaign:duplicate" data-campaign-name="${c.name}" class="flex-1 px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Duplicate</button>
                                ` : c.status === 'Scheduled' ? `
                                    <button data-action="campaign:schedule" data-campaign-name="${c.name}" class="flex-1 px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Reschedule</button>
                                ` : `
                                    <button data-action="campaign:send" data-campaign-name="${c.name}" class="flex-1 px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Send</button>
                                `}
                            </div>

                            <div class="mt-2 flex gap-2">
                                <button data-action="campaign:schedule" data-campaign-name="${c.name}" class="flex-1 px-3 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Schedule</button>
                                <button data-action="campaign:delete" data-campaign-name="${c.name}" class="flex-1 px-3 py-2 text-xs font-medium bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors">Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-semibold text-slate-900">Performance (Last 4 Weeks)</h3>
                            <p class="text-sm text-slate-500">Open rate and click rate trend</p>
                        </div>
                        <button data-action="toast" class="px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Export</button>
                    </div>
                    <div class="mt-4 h-72 bg-slate-50 rounded-lg p-3">
                        <canvas id="campaignChart"></canvas>
                    </div>
                </div>
            </div>
        `;
    }

    getSmsWhatsappCampaigns() {
        const schedule = [
            { time: '11:00 AM', title: 'Payment reminder', channel: 'WhatsApp', color: 'emerald' },
            { time: '2:30 PM', title: 'Greetings: Client anniversary', channel: 'SMS', color: 'amber' },
            { time: '5:00 PM', title: 'Re-engagement ping', channel: 'WhatsApp', color: 'indigo' }
        ];

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">SMS / WhatsApp</h2>
                        <p class="text-sm text-slate-500">Scheduled messages timeline + segments</p>
                    </div>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Schedule Message</button>
                </div>

                <div class="grid grid-cols-3 gap-6">
                    <div class="col-span-2 bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900">Today’s Schedule</h3>
                        <div class="mt-4 space-y-3">
                            ${schedule.map(s => `
                                <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-lg bg-${s.color}-50 flex items-center justify-center">
                                            <i data-lucide="message-square" class="w-5 h-5 text-${s.color}-700"></i>
                                        </div>
                                        <div>
                                            <div class="text-sm font-medium text-slate-900">${s.title}</div>
                                            <div class="text-xs text-slate-500">${s.channel}</div>
                                        </div>
                                    </div>
                                    <div class="text-sm font-medium text-slate-900">${s.time}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900">Audience Segments</h3>
                        <div class="mt-4 space-y-3">
                            ${[
                                { name: 'Overdue invoices', count: 4, color: 'rose' },
                                { name: 'Onboarding clients', count: 6, color: 'amber' },
                                { name: 'High LTV clients', count: 12, color: 'emerald' },
                                { name: 'Inactive 30+ days', count: 18, color: 'indigo' }
                            ].map(seg => `
                                <div class="p-3 bg-${seg.color}-50 border border-${seg.color}-100 rounded-lg flex items-center justify-between">
                                    <div class="text-sm font-medium text-slate-900">${seg.name}</div>
                                    <span class="text-sm font-semibold text-slate-900">${seg.count}</span>
                                </div>
                            `).join('')}
                        </div>
                        <button data-action="toast" class="mt-5 w-full px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Build Segment</button>
                    </div>
                </div>
            </div>
        `;
    }

    getWishesCampaigns() {
        const templates = [
            { title: 'Birthday Wish', channel: 'WhatsApp', color: 'emerald' },
            { title: 'Anniversary Wish', channel: 'Email', color: 'indigo' },
            { title: 'Festive Greeting', channel: 'SMS', color: 'amber' }
        ];

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Greetings & Wishes</h2>
                        <p class="text-sm text-slate-500">Personalized templates and scheduling</p>
                    </div>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Create Template</button>
                </div>

                <div class="grid grid-cols-3 gap-6">
                    ${templates.map(t => `
                        <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                            <div class="w-12 h-12 rounded-lg bg-${t.color}-50 flex items-center justify-center">
                                <i data-lucide="sparkles" class="w-6 h-6 text-${t.color}-700"></i>
                            </div>
                            <div class="mt-4 text-sm font-semibold text-slate-900">${t.title}</div>
                            <div class="text-xs text-slate-500">Channel: ${t.channel}</div>
                            <div class="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-600">"Hi {{name}}, wishing you a wonderful day..."</div>
                            <div class="mt-4 flex gap-2">
                                <button data-action="toast" class="px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Edit</button>
                                <button data-action="toast" class="px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Schedule</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getReengagementCampaigns() {
        const actions = [
            { title: 'Clients inactive 30+ days', count: 18, action: 'Send re-activation offer', color: 'indigo' },
            { title: 'Projects completed 60+ days', count: 9, action: 'Suggest next service', color: 'emerald' },
            { title: 'Low engagement on last campaign', count: 24, action: 'Resend with new subject', color: 'amber' }
        ];

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Re-engagement</h2>
                        <p class="text-sm text-slate-500">Win-back sequences and nurture actions</p>
                    </div>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Create Sequence</button>
                </div>

                <div class="grid grid-cols-3 gap-6">
                    ${actions.map(a => `
                        <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-sm font-semibold text-slate-900">${a.title}</div>
                                    <div class="text-xs text-slate-500">${a.count} clients</div>
                                </div>
                                <span class="px-2 py-1 text-xs font-medium bg-${a.color}-50 text-${a.color}-700 rounded-full">${a.action}</span>
                            </div>
                            <div class="mt-4 p-3 bg-${a.color}-50 border border-${a.color}-100 rounded-lg">
                                <div class="text-xs text-slate-500">Suggested Action</div>
                                <div class="text-sm font-medium text-slate-900">${a.action}</div>
                            </div>
                            <button data-action="toast" class="mt-4 w-full px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Run Now</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderBillingContent(container) {
        switch (this.currentSubSection) {
            case 'quotations':
                container.innerHTML = this.getBillingQuotations();
                break;
            case 'contracts':
                container.innerHTML = this.getBillingContracts();
                break;
            case 'invoices':
                container.innerHTML = this.getBillingInvoices();
                break;
            case 'payments':
                container.innerHTML = this.getBillingPayments();
                break;
            default:
                container.innerHTML = this.getBillingInvoices();
        }
    }

    getBillingQuotations() {
        const quotes = [
            { no: 'QTN-44', client: 'GreenLeaf Industries', amount: '₹2,80,000', status: 'Approved', color: 'emerald' },
            { no: 'QTN-51', client: 'Mumbai Retail Chain', amount: '₹1,80,000', status: 'Sent', color: 'sky' },
            { no: 'QTN-57', client: 'UrbanCafe', amount: '₹95,000', status: 'Draft', color: 'slate' },
            { no: 'QTN-61', client: 'TechNova Solutions', amount: '₹3,20,000', status: 'Sent', color: 'sky' }
        ];

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Quotations</h2>
                        <p class="text-sm text-slate-500">Quotes drive invoices and payment collection</p>
                    </div>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ New Quote</button>
                </div>

                <div class="grid grid-cols-4 gap-4">
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Quotes this month</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">18</div>
                        <div class="text-xs text-emerald-700 mt-1">↑ 22% vs last month</div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Approved value</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">₹6.4 L</div>
                        <div class="text-xs text-slate-500 mt-1">4 approved</div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Pending approvals</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">3</div>
                        <div class="text-xs text-amber-700 mt-1">Action needed</div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Avg turnaround</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">2.1 days</div>
                        <div class="text-xs text-slate-500 mt-1">from draft to sent</div>
                    </div>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                        <div class="text-sm font-medium text-slate-900">Quotation Table</div>
                        <button data-action="toast" class="px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Export</button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-slate-50 text-slate-600">
                                <tr>
                                    <th class="text-left px-4 py-3 font-medium">Quote</th>
                                    <th class="text-left px-4 py-3 font-medium">Client</th>
                                    <th class="text-right px-4 py-3 font-medium">Amount</th>
                                    <th class="text-left px-4 py-3 font-medium">Status</th>
                                    <th class="text-left px-4 py-3 font-medium">Next</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200">
                                ${quotes.map(q => `
                                    <tr class="hover:bg-slate-50">
                                        <td class="px-4 py-3 font-medium text-slate-900">${q.no}</td>
                                        <td class="px-4 py-3 text-slate-700">${q.client}</td>
                                        <td class="px-4 py-3 text-right font-medium text-slate-900">${q.amount}</td>
                                        <td class="px-4 py-3">
                                            <span class="px-2 py-1 text-xs font-medium bg-${q.color}-50 text-${q.color}-700 rounded-full">${q.status}</span>
                                        </td>
                                        <td class="px-4 py-3 text-slate-700">${q.status === 'Approved' ? 'Generate invoice' : q.status === 'Sent' ? 'Follow-up' : 'Send for approval'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    getBillingContracts() {
        const contracts = [
            { no: 'CTR-09', client: 'TechNova Solutions', type: 'Annual Retainer', status: 'Active', color: 'emerald', renewal: 'Jun 28', value: '₹9,60,000' },
            { no: 'CTR-11', client: 'EduSpark', type: 'Project-based', status: 'Active', color: 'emerald', renewal: 'Sep 12', value: '₹3,20,000' },
            { no: 'CTR-13', client: 'GreenLeaf Industries', type: 'Retainer', status: 'Pending', color: 'amber', renewal: '—', value: '₹6,80,000' }
        ];

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Contracts</h2>
                        <p class="text-sm text-slate-500">Active coverage, renewals, and terms</p>
                    </div>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ New Contract</button>
                </div>

                <div class="grid grid-cols-3 gap-6">
                    ${contracts.map(c => `
                        <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                            <div class="flex items-start justify-between">
                                <div>
                                    <div class="text-sm font-semibold text-slate-900">${c.no}</div>
                                    <div class="text-xs text-slate-500">${c.client}</div>
                                </div>
                                <span class="px-2 py-1 text-xs font-medium bg-${c.color}-50 text-${c.color}-700 rounded-full">${c.status}</span>
                            </div>
                            <div class="mt-4 grid grid-cols-2 gap-3">
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Type</div>
                                    <div class="text-sm font-medium text-slate-900">${c.type}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Value</div>
                                    <div class="text-sm font-medium text-slate-900">${c.value}</div>
                                </div>
                            </div>
                            <div class="mt-4 p-3 ${c.status === 'Active' ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'} rounded-lg">
                                <div class="text-xs text-slate-500">Renewal</div>
                                <div class="text-sm font-medium text-slate-900">${c.renewal}</div>
                            </div>
                            <div class="mt-4 flex gap-2">
                                <button data-action="toast" class="flex-1 px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">View</button>
                                <button data-action="toast" class="flex-1 px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Actions</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getBillingInvoices() {
        const defaults = [
            { no: 'INV-102', client: 'TechNova Solutions', amount: '₹42,000', due: '3 days overdue', status: 'Overdue', color: 'rose' },
            { no: 'INV-118', client: 'EduSpark', amount: '₹85,000', due: 'Paid', status: 'Paid', color: 'emerald' },
            { no: 'INV-121', client: 'GreenLeaf Industries', amount: '₹58,000', due: 'Due in 5 days', status: 'Pending', color: 'amber' },
            { no: 'INV-123', client: 'Mumbai Retail Chain', amount: '₹37,000', due: 'Due in 2 days', status: 'Pending', color: 'amber' },
            { no: 'INV-124', client: 'BrightFin', amount: '₹25,000', due: 'Paid', status: 'Paid', color: 'emerald' }
        ];
        let invoices = [...this.getStoredInvoices(), ...defaults];

        const filter = String(this.invoiceClientFilter || '').trim();
        if (filter) {
            invoices = invoices.filter(i => String(i?.client || '').trim().toLowerCase() === filter.toLowerCase());
        }

        const paidCount = invoices.filter(x => String(x.status || '').toLowerCase() === 'paid').length;
        const overdueCount = invoices.filter(x => String(x.status || '').toLowerCase() === 'overdue').length;
        const pendingCount = invoices.filter(x => {
            const s = String(x.status || '').toLowerCase();
            return s !== 'paid' && s !== 'overdue';
        }).length;

        const pendingAmount = invoices
            .filter(x => String(x.status || '').toLowerCase() !== 'paid')
            .reduce((sum, x) => sum + this.parseCurrencyToNumber(x.amount), 0);

        const overdueAmount = invoices
            .filter(x => String(x.status || '').toLowerCase() === 'overdue')
            .reduce((sum, x) => sum + this.parseCurrencyToNumber(x.amount), 0);

        const collectedAmount = invoices
            .filter(x => String(x.status || '').toLowerCase() === 'paid')
            .reduce((sum, x) => sum + this.parseCurrencyToNumber(x.amount), 0);

        const exportJson = encodeURIComponent(JSON.stringify(invoices));

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Invoices</h2>
                        <p class="text-sm text-slate-500">Track paid, pending, and overdue invoices</p>
                    </div>
                    <button data-action="invoice:create" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ Create Invoice</button>
                </div>

                ${filter ? `
                    <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <div class="text-sm text-slate-700">Filtered by client: <span class="font-semibold text-slate-900">${filter.replace(/</g, '&lt;')}</span></div>
                        <button data-action="billing:clearInvoiceFilter" class="px-3 py-2 text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">Clear filter</button>
                    </div>
                ` : ``}

                <div class="grid grid-cols-4 gap-4">
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Pending Payments</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">${this.formatINR(pendingAmount)}</div>
                        <div class="text-xs text-amber-700 mt-1">${pendingCount} pending</div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Overdue</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">${this.formatINR(overdueAmount)}</div>
                        <div class="text-xs text-rose-700 mt-1">${overdueCount} invoices</div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Collected (MTD)</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">${this.formatINR(collectedAmount)}</div>
                        <div class="text-xs text-emerald-700 mt-1">${paidCount} paid</div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Avg Days to Pay</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">9.6</div>
                        <div class="text-xs text-slate-500 mt-1">last 30 days</div>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-6">
                    <div class="col-span-2 bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                            <div class="text-sm font-medium text-slate-900">Invoice Table</div>
                            <button data-action="invoice:export" data-invoices-json="${exportJson}" class="px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Download</button>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead class="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th class="text-left px-4 py-3 font-medium">Invoice</th>
                                        <th class="text-left px-4 py-3 font-medium">Client</th>
                                        <th class="text-right px-4 py-3 font-medium">Amount</th>
                                        <th class="text-left px-4 py-3 font-medium">Due</th>
                                        <th class="text-left px-4 py-3 font-medium">Status</th>
                                        <th class="text-left px-4 py-3 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                    ${invoices.map(i => `
                                        <tr class="hover:bg-slate-50">
                                            <td class="px-4 py-3 font-medium text-slate-900">${i.no}</td>
                                            <td class="px-4 py-3 text-slate-700">${i.client}</td>
                                            <td class="px-4 py-3 text-right font-medium text-slate-900">${i.amount}</td>
                                            <td class="px-4 py-3 text-slate-700">${i.due}</td>
                                            <td class="px-4 py-3">
                                                <span class="px-2 py-1 text-xs font-medium bg-${i.color}-50 text-${i.color}-700 rounded-full">${i.status}</span>
                                            </td>
                                            <td class="px-4 py-3">
                                                <div class="flex items-center gap-2">
                                                    <button
                                                        data-action="invoice:preview"
                                                        data-invoice-no="${i.no}"
                                                        data-invoice-client="${i.client}"
                                                        data-invoice-amount="${i.amount}"
                                                        data-invoice-due="${i.due}"
                                                        data-invoice-status="${i.status}"
                                                        data-invoice-color="${i.color}"
                                                        class="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Preview</button>

                                                    <button
                                                        data-action="invoice:download"
                                                        data-invoice-no="${i.no}"
                                                        data-invoice-client="${i.client}"
                                                        data-invoice-amount="${i.amount}"
                                                        data-invoice-due="${i.due}"
                                                        data-invoice-status="${i.status}"
                                                        data-invoice-color="${i.color}"
                                                        class="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Download</button>

                                                    ${i.status === 'Paid' ? '' : `
                                                        <button
                                                            data-action="invoice:markPaid"
                                                            data-invoice-no="${i.no}"
                                                            data-invoice-client="${i.client}"
                                                            data-invoice-amount="${i.amount}"
                                                            data-invoice-due="${i.due}"
                                                            data-invoice-status="${i.status}"
                                                            data-invoice-color="${i.color}"
                                                            class="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">Mark Paid</button>
                                                    `}
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900">Status Split</h3>
                        <p class="text-sm text-slate-500">Paid vs overdue vs pending</p>
                        <div class="mt-4 h-56 bg-slate-50 rounded-lg p-3">
                            <canvas id="invoiceStatusChart"></canvas>
                        </div>
                        <div class="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-lg">
                            <div class="text-sm font-medium text-rose-900">Overdue alerts</div>
                            <div class="text-xs text-rose-800">INV-102 needs immediate follow-up</div>
                        </div>
                        <button data-action="billing:sendBulkReminders" class="mt-5 w-full px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Send Bulk Reminders</button>
                    </div>
                </div>
            </div>
        `;
    }

    getBillingPayments() {
        const expected = [
            { client: 'TechNova Solutions', amount: '₹42,000', when: 'Today', status: 'Overdue', color: 'rose' },
            { client: 'GreenLeaf Industries', amount: '₹58,000', when: 'In 5 days', status: 'Pending', color: 'amber' },
            { client: 'Mumbai Retail Chain', amount: '₹37,000', when: 'In 2 days', status: 'Pending', color: 'amber' },
            { client: 'CarePlus Clinics', amount: '₹18,000', when: 'Tomorrow', status: 'Pending', color: 'sky' }
        ];

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Payment Status</h2>
                        <p class="text-sm text-slate-500">Collections pipeline and overdue risk</p>
                    </div>
                    <button class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Record Payment</button>
                </div>

                <div class="grid grid-cols-3 gap-6">
                    <div class="col-span-2 bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-slate-900">Expected Payments</h3>
                            <span class="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">This week</span>
                        </div>
                        <div class="mt-4 space-y-3">
                            ${expected.map(p => `
                                <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <div class="text-sm font-medium text-slate-900">${p.client}</div>
                                        <div class="text-xs text-slate-500">${p.when}</div>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <div class="text-sm font-semibold text-slate-900">${p.amount}</div>
                                        <span class="px-2 py-1 text-xs font-medium bg-${p.color}-50 text-${p.color}-700 rounded-full">${p.status}</span>
                                        <button data-action="toast" class="px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Notify</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900">Collections Summary</h3>
                        <div class="mt-4 space-y-3">
                            <div class="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                                <div class="text-xs text-slate-500">Collected Today</div>
                                <div class="text-lg font-semibold text-slate-900">₹85,000</div>
                            </div>
                            <div class="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                <div class="text-xs text-slate-500">Pending This Week</div>
                                <div class="text-lg font-semibold text-slate-900">₹1,25,000</div>
                            </div>
                            <div class="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                                <div class="text-xs text-slate-500">Overdue Risk</div>
                                <div class="text-lg font-semibold text-slate-900">₹42,000</div>
                            </div>
                        </div>
                        <button data-action="toast" class="mt-5 w-full px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Open Dunning Rules</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderEngagementContent(container) {
        switch (this.currentSubSection) {
            case 'followups':
                container.innerHTML = this.getEngagementFollowups();
                break;
            case 'surveys':
                container.innerHTML = this.getEngagementSurveys();
                break;
            case 'health':
                container.innerHTML = this.getEngagementHealth();
                break;
            case 'reengagement':
                container.innerHTML = this.getEngagementNextProjects();
                break;
            default:
                container.innerHTML = this.getEngagementFollowups();
        }
    }

    getEngagementFollowups() {
        const followups = [
            { time: '10:30 AM', client: 'TechNova Solutions', topic: 'Overdue invoice INV-102', priority: 'High', color: 'rose' },
            { time: '12:00 PM', client: 'GreenLeaf Industries', topic: 'Proposal approval check-in', priority: 'High', color: 'amber' },
            { time: '3:15 PM', client: 'EduSpark', topic: 'Feedback survey reminder', priority: 'Medium', color: 'indigo' },
            { time: '5:00 PM', client: 'Mumbai Retail Chain', topic: 'Pipeline stage update', priority: 'Medium', color: 'sky' }
        ];

        const week = [
            { day: 'Mon', count: 6 },
            { day: 'Tue', count: 4 },
            { day: 'Wed', count: 7 },
            { day: 'Thu', count: 3 },
            { day: 'Fri', count: 5 }
        ];
        const max = Math.max(...week.map(d => d.count));

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Follow-ups</h2>
                        <p class="text-sm text-slate-500">Daily follow-up calendar and priorities</p>
                    </div>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ New Follow-up</button>
                </div>

                <div class="grid grid-cols-3 gap-6">
                    <div class="col-span-2 bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-slate-900">Today</h3>
                            <span class="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">${followups.length} scheduled</span>
                        </div>
                        <div class="mt-4 space-y-3">
                            ${followups.map(f => `
                                <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div class="flex items-start gap-4">
                                        <div class="w-12">
                                            <div class="text-sm font-semibold text-slate-900">${f.time}</div>
                                        </div>
                                        <div>
                                            <div class="text-sm font-medium text-slate-900">${f.client}</div>
                                            <div class="text-xs text-slate-500 mt-1">${f.topic}</div>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="px-2 py-1 text-xs font-medium bg-${f.color}-50 text-${f.color}-700 rounded-full">${f.priority}</span>
                                        <button data-action="toast" class="px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Mark done</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900">This Week</h3>
                        <p class="text-sm text-slate-500">Load by day</p>
                        <div class="mt-4 space-y-3">
                            ${week.map(d => `
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="flex items-center justify-between">
                                        <div class="text-sm font-medium text-slate-900">${d.day}</div>
                                        <div class="text-sm font-semibold text-slate-900">${d.count}</div>
                                    </div>
                                    <div class="mt-2 w-full bg-slate-200 rounded-full h-2">
                                        <div class="bg-indigo-600 h-2 rounded-full" style="width: ${(d.count / max) * 100}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="mt-5 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                            <div class="text-sm font-medium text-amber-900">Reminder</div>
                            <div class="text-xs text-amber-800">3 follow-ups are tied to pending invoices</div>
                        </div>
                        <button data-action="toast" class="mt-5 w-full px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Auto-schedule reminders</button>
                    </div>
                </div>
            </div>
        `;
    }

    getEngagementSurveys() {
        const surveys = [
            { client: 'TechNova Solutions', score: 4.8, status: 'Collected', color: 'emerald', last: '2 days ago' },
            { client: 'GreenLeaf Industries', score: 4.2, status: 'Collected', color: 'sky', last: '1 week ago' },
            { client: 'Mumbai Retail Chain', score: 3.6, status: 'Needs Attention', color: 'amber', last: 'Today' },
            { client: 'UrbanCafe', score: 0.0, status: 'Pending', color: 'slate', last: '—' }
        ];

        const questions = [
            { q: 'Delivery quality', avg: 4.6, color: 'emerald' },
            { q: 'Communication', avg: 4.1, color: 'indigo' },
            { q: 'Timelines', avg: 3.8, color: 'amber' },
            { q: 'Value for money', avg: 4.2, color: 'sky' }
        ];

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Feedback & Surveys</h2>
                        <p class="text-sm text-slate-500">Ratings, trends, and follow-up actions</p>
                    </div>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Send Survey</button>
                </div>

                <div class="grid grid-cols-3 gap-6">
                    <div class="col-span-2 bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                            <div class="text-sm font-medium text-slate-900">Client Survey Status</div>
                            <span class="text-xs text-slate-500">Last 30 days</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead class="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th class="text-left px-4 py-3 font-medium">Client</th>
                                        <th class="text-left px-4 py-3 font-medium">Score</th>
                                        <th class="text-left px-4 py-3 font-medium">Status</th>
                                        <th class="text-left px-4 py-3 font-medium">Last Updated</th>
                                        <th class="text-left px-4 py-3 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                    ${surveys.map(s => `
                                        <tr class="hover:bg-slate-50">
                                            <td class="px-4 py-3 font-medium text-slate-900">${s.client}</td>
                                            <td class="px-4 py-3 text-slate-700">${s.score ? s.score.toFixed(1) : '—'}</td>
                                            <td class="px-4 py-3"><span class="px-2 py-1 text-xs font-medium bg-${s.color}-50 text-${s.color}-700 rounded-full">${s.status}</span></td>
                                            <td class="px-4 py-3 text-slate-700">${s.last}</td>
                                            <td class="px-4 py-3">
                                                <button data-action="toast" class="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">${s.status === 'Pending' ? 'Remind' : 'View'}</button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900">Question Breakdown</h3>
                        <p class="text-sm text-slate-500">Average scores</p>
                        <div class="mt-4 space-y-4">
                            ${questions.map(q => `
                                <div>
                                    <div class="flex items-center justify-between text-sm">
                                        <span class="text-slate-700">${q.q}</span>
                                        <span class="font-semibold text-slate-900">${q.avg.toFixed(1)}</span>
                                    </div>
                                    <div class="mt-2 w-full bg-slate-200 rounded-full h-2">
                                        <div class="bg-${q.color}-600 h-2 rounded-full" style="width: ${(q.avg / 5) * 100}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="mt-5 p-3 bg-rose-50 border border-rose-100 rounded-lg">
                            <div class="text-sm font-medium text-rose-900">Attention</div>
                            <div class="text-xs text-rose-800">Mumbai Retail is below 4.0 on timelines</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getEngagementHealth() {
        const health = [
            { client: 'TechNova Solutions', score: 86, label: 'Healthy', color: 'emerald', signals: ['On-time payments', 'High engagement', 'Positive feedback'] },
            { client: 'EduSpark', score: 74, label: 'Stable', color: 'sky', signals: ['Good response', 'Project on track', 'Renewal interest'] },
            { client: 'GreenLeaf Industries', score: 62, label: 'Watch', color: 'amber', signals: ['Approval delays', 'Scope questions', 'Payment pending'] },
            { client: 'Mumbai Retail Chain', score: 48, label: 'At Risk', color: 'rose', signals: ['Low engagement', 'Pending invoice', 'Missed meetings'] }
        ];

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Client Health</h2>
                        <p class="text-sm text-slate-500">Health scores and early warning signals</p>
                    </div>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Create Playbook</button>
                </div>

                <div class="grid grid-cols-2 gap-6">
                    ${health.map(h => `
                        <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                            <div class="flex items-start justify-between">
                                <div>
                                    <div class="text-sm font-semibold text-slate-900">${h.client}</div>
                                    <div class="text-xs text-slate-500 mt-1">Signals: ${h.signals.length}</div>
                                </div>
                                <span class="px-2 py-1 text-xs font-medium bg-${h.color}-50 text-${h.color}-700 rounded-full">${h.label}</span>
                            </div>
                            <div class="mt-4">
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-slate-600">Health score</span>
                                    <span class="font-semibold text-slate-900">${h.score}</span>
                                </div>
                                <div class="mt-2 w-full bg-slate-200 rounded-full h-2">
                                    <div class="bg-${h.color}-600 h-2 rounded-full" style="width: ${h.score}%"></div>
                                </div>
                            </div>
                            <div class="mt-4 grid grid-cols-3 gap-2">
                                ${h.signals.map(s => `
                                    <div class="p-2 bg-slate-50 rounded-lg text-xs text-slate-700">${s}</div>
                                `).join('')}
                            </div>
                            <div class="mt-4 flex gap-2">
                                <button data-action="toast" class="flex-1 px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">View</button>
                                <button data-action="toast" class="flex-1 px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Take Action</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getEngagementNextProjects() {
        const suggestions = [
            { client: 'TechNova Solutions', idea: 'Conversion rate optimization', value: '₹1,20,000', reason: 'High traffic + strong retention', color: 'emerald' },
            { client: 'EduSpark', idea: 'WhatsApp nurture automation', value: '₹85,000', reason: 'Good engagement on campaigns', color: 'sky' },
            { client: 'GreenLeaf Industries', idea: 'Quarterly analytics dashboard', value: '₹1,40,000', reason: 'Stakeholders requesting insights', color: 'indigo' }
        ];

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Next Projects</h2>
                        <p class="text-sm text-slate-500">Suggested next services to improve retention</p>
                    </div>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Create Proposal</button>
                </div>

                <div class="grid grid-cols-3 gap-6">
                    ${suggestions.map(s => `
                        <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                            <div class="flex items-start justify-between">
                                <div>
                                    <div class="text-sm font-semibold text-slate-900">${s.client}</div>
                                    <div class="text-xs text-slate-500 mt-1">Recommended</div>
                                </div>
                                <span class="px-2 py-1 text-xs font-medium bg-${s.color}-50 text-${s.color}-700 rounded-full">High fit</span>
                            </div>
                            <div class="mt-4 p-3 bg-slate-50 rounded-lg">
                                <div class="text-sm font-medium text-slate-900">${s.idea}</div>
                                <div class="text-xs text-slate-500 mt-1">${s.reason}</div>
                            </div>
                            <div class="mt-4 flex items-center justify-between">
                                <div class="text-xs text-slate-500">Expected value</div>
                                <div class="text-sm font-semibold text-slate-900">${s.value}</div>
                            </div>
                            <div class="mt-4 flex gap-2">
                                <button data-action="toast" class="flex-1 px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Add to pipeline</button>
                                <button data-action="toast" class="flex-1 px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Send</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderReportsContent(container) {
        switch (this.currentSubSection) {
            case 'revenue':
                container.innerHTML = this.getReportsRevenue();
                break;
            case 'funnel':
                container.innerHTML = this.getReportsFunnel();
                break;
            case 'roi':
                container.innerHTML = this.getReportsRoi();
                break;
            case 'ltv':
                container.innerHTML = this.getReportsLtv();
                break;
            default:
                container.innerHTML = this.getReportsRevenue();
        }
    }

    getReportsRevenue() {
        const rows = [
            { month: 'Jan', revenue: '₹2,85,000', collected: '₹2,40,000', pending: '₹45,000', topClient: 'TechNova' },
            { month: 'Feb', revenue: '₹3,20,000', collected: '₹2,90,000', pending: '₹30,000', topClient: 'EduSpark' },
            { month: 'Mar', revenue: '₹4,15,000', collected: '₹3,80,000', pending: '₹35,000', topClient: 'GreenLeaf' },
            { month: 'Apr', revenue: '₹3,80,000', collected: '₹3,40,000', pending: '₹40,000', topClient: 'TechNova' },
            { month: 'May', revenue: '₹4,85,000', collected: '₹4,55,000', pending: '₹30,000', topClient: 'Mumbai Retail' },
            { month: 'Jun', revenue: '₹5,10,000', collected: '₹4,90,000', pending: '₹20,000', topClient: 'GreenLeaf' }
        ];

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Revenue Reports</h2>
                        <p class="text-sm text-slate-500">Filters, comparisons, and downloadable charts</p>
                    </div>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Download CSV</button>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 p-4 shadow-lg grid grid-cols-5 gap-3">
                    <select class="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>Last 6 months</option>
                        <option>Last 12 months</option>
                        <option>This quarter</option>
                    </select>
                    <select class="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>All Clients</option>
                        <option>TechNova Solutions</option>
                        <option>GreenLeaf Industries</option>
                        <option>EduSpark</option>
                    </select>
                    <select class="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>All Services</option>
                        <option>SEO</option>
                        <option>Consulting</option>
                        <option>Ads</option>
                    </select>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Apply</button>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Reset</button>
                </div>

                <div class="grid grid-cols-4 gap-4">
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Total revenue</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">₹22.0 L</div>
                        <div class="text-xs text-emerald-700 mt-1">↑ 14% growth</div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Collected</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">₹20.0 L</div>
                        <div class="text-xs text-slate-500 mt-1">last 6 months</div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Pending</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">₹2.0 L</div>
                        <div class="text-xs text-amber-700 mt-1">needs follow-up</div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Top client</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">TechNova</div>
                        <div class="text-xs text-slate-500 mt-1">₹6.2 L</div>
                    </div>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-semibold text-slate-900">Revenue vs Collection</h3>
                            <p class="text-sm text-slate-500">Monthly trend</p>
                        </div>
                        <button data-action="toast" class="px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Export chart</button>
                    </div>
                    <div class="mt-4 h-80 bg-slate-50 rounded-lg p-3">
                        <canvas id="revenueReportChart"></canvas>
                    </div>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                        <div class="text-sm font-medium text-slate-900">Monthly Breakdown</div>
                        <div class="text-xs text-slate-500">6 rows</div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-slate-50 text-slate-600">
                                <tr>
                                    <th class="text-left px-4 py-3 font-medium">Month</th>
                                    <th class="text-right px-4 py-3 font-medium">Revenue</th>
                                    <th class="text-right px-4 py-3 font-medium">Collected</th>
                                    <th class="text-right px-4 py-3 font-medium">Pending</th>
                                    <th class="text-left px-4 py-3 font-medium">Top Client</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200">
                                ${rows.map(r => `
                                    <tr class="hover:bg-slate-50">
                                        <td class="px-4 py-3 font-medium text-slate-900">${r.month}</td>
                                        <td class="px-4 py-3 text-right font-medium text-slate-900">${r.revenue}</td>
                                        <td class="px-4 py-3 text-right text-slate-700">${r.collected}</td>
                                        <td class="px-4 py-3 text-right text-slate-700">${r.pending}</td>
                                        <td class="px-4 py-3 text-slate-700">${r.topClient}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    getReportsFunnel() {
        const stages = [
            { name: 'Leads', count: 450, color: 'sky' },
            { name: 'Qualified', count: 280, color: 'indigo' },
            { name: 'Proposals', count: 156, color: 'amber' },
            { name: 'Deals', count: 89, color: 'emerald' },
            { name: 'Projects', count: 67, color: 'rose' }
        ];
        const max = stages[0].count;

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Funnel Reports</h2>
                        <p class="text-sm text-slate-500">Lead → deal → project conversion visibility</p>
                    </div>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Download PDF</button>
                </div>

                <div class="grid grid-cols-3 gap-6">
                    <div class="col-span-2 bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900">Conversion Funnel</h3>
                        <p class="text-sm text-slate-500">Last 30 days</p>
                        <div class="mt-5 space-y-3">
                            ${stages.map((s, idx) => `
                                <div>
                                    <div class="flex items-center justify-between text-sm">
                                        <span class="text-slate-700">${idx + 1}. ${s.name}</span>
                                        <span class="font-semibold text-slate-900">${s.count}</span>
                                    </div>
                                    <div class="mt-2 w-full bg-slate-200 rounded-full h-3">
                                        <div class="bg-${s.color}-600 h-3 rounded-full" style="width: ${(s.count / max) * 100}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900">Insights</h3>
                        <div class="mt-4 space-y-3">
                            <div class="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                                <div class="text-sm font-medium text-emerald-900">Best converting stage</div>
                                <div class="text-xs text-emerald-800">Deals → Projects: 75%</div>
                            </div>
                            <div class="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                <div class="text-sm font-medium text-amber-900">Bottleneck</div>
                                <div class="text-xs text-amber-800">Qualified → Proposals: 56%</div>
                            </div>
                            <div class="p-3 bg-sky-50 border border-sky-100 rounded-lg">
                                <div class="text-sm font-medium text-sky-900">Recommended action</div>
                                <div class="text-xs text-sky-800">Auto-follow-up within 24h on qualified leads</div>
                            </div>
                        </div>
                        <button data-action="toast" class="mt-5 w-full px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Create follow-up rule</button>
                    </div>
                </div>
            </div>
        `;
    }

    getReportsRoi() {
        const campaigns = [
            { name: 'CRM Upgrade', spend: '₹22,000', revenue: '₹1,20,000', roi: '445%', color: 'emerald' },
            { name: 'Quarterly Offer', spend: '₹18,000', revenue: '₹65,000', roi: '261%', color: 'sky' },
            { name: 'Re-engagement Push', spend: '₹12,000', revenue: '₹28,000', roi: '133%', color: 'amber' }
        ];

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Campaign ROI</h2>
                        <p class="text-sm text-slate-500">Spend vs revenue by campaign</p>
                    </div>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Download</button>
                </div>

                <div class="grid grid-cols-3 gap-6">
                    ${campaigns.map(c => `
                        <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                            <div class="flex items-start justify-between">
                                <div class="text-sm font-semibold text-slate-900">${c.name}</div>
                                <span class="px-2 py-1 text-xs font-medium bg-${c.color}-50 text-${c.color}-700 rounded-full">ROI ${c.roi}</span>
                            </div>
                            <div class="mt-4 grid grid-cols-2 gap-3">
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Spend</div>
                                    <div class="text-sm font-semibold text-slate-900">${c.spend}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Revenue</div>
                                    <div class="text-sm font-semibold text-slate-900">${c.revenue}</div>
                                </div>
                            </div>
                            <button data-action="toast" class="mt-4 w-full px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">View attribution</button>
                        </div>
                    `).join('')}
                </div>

                <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                    <h3 class="text-lg font-semibold text-slate-900">Notes</h3>
                    <div class="mt-3 text-sm text-slate-600">
                        CRM Upgrade delivered the highest ROI due to targeted follow-ups and high-fit audience segmentation.
                    </div>
                </div>
            </div>
        `;
    }

    getReportsLtv() {
        const clients = [
            { name: 'TechNova Solutions', ltv: '₹9,60,000', tenure: '14 months', score: 92, color: 'emerald' },
            { name: 'EduSpark', ltv: '₹4,10,000', tenure: '9 months', score: 78, color: 'sky' },
            { name: 'GreenLeaf Industries', ltv: '₹6,80,000', tenure: '7 months', score: 66, color: 'amber' },
            { name: 'Mumbai Retail Chain', ltv: '₹2,20,000', tenure: '4 months', score: 48, color: 'rose' }
        ];

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Client Lifetime Value</h2>
                        <p class="text-sm text-slate-500">LTV, tenure, and renewal readiness</p>
                    </div>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Export</button>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-slate-50 text-slate-600">
                                <tr>
                                    <th class="text-left px-4 py-3 font-medium">Client</th>
                                    <th class="text-right px-4 py-3 font-medium">LTV</th>
                                    <th class="text-left px-4 py-3 font-medium">Tenure</th>
                                    <th class="text-left px-4 py-3 font-medium">Renewal Score</th>
                                    <th class="text-left px-4 py-3 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200">
                                ${clients.map(c => `
                                    <tr class="hover:bg-slate-50">
                                        <td class="px-4 py-3 font-medium text-slate-900">${c.name}</td>
                                        <td class="px-4 py-3 text-right font-medium text-slate-900">${c.ltv}</td>
                                        <td class="px-4 py-3 text-slate-700">${c.tenure}</td>
                                        <td class="px-4 py-3">
                                            <div class="flex items-center gap-3">
                                                <div class="w-28 bg-slate-200 rounded-full h-2">
                                                    <div class="bg-${c.color}-600 h-2 rounded-full" style="width: ${c.score}%"></div>
                                                </div>
                                                <div class="text-sm font-semibold text-slate-900">${c.score}</div>
                                            </div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <button data-action="toast" class="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Create renewal plan</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    initializeRevenueReportChart() {
        const ctx = document.getElementById('revenueReportChart');
        if (ctx) {
            this.charts.revenueReportChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        {
                            label: 'Revenue (₹)',
                            data: [285000, 320000, 415000, 380000, 485000, 510000],
                            borderColor: '#0ea5e9',
                            backgroundColor: 'rgba(14, 165, 233, 0.10)',
                            tension: 0.35
                        },
                        {
                            label: 'Collection (₹)',
                            data: [240000, 290000, 380000, 340000, 455000, 490000],
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.10)',
                            tension: 0.35
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });
        }
    }

    renderAIContent(container) {
        switch (this.currentSubSection) {
            case 'insights':
                container.innerHTML = this.getAIInsights();
                break;
            case 'workflows':
                container.innerHTML = this.getAIWorkflows();
                break;
            case 'alerts':
                container.innerHTML = this.getAISmartAlerts();
                break;
            case 'predictions':
                container.innerHTML = this.getAIPredictions();
                break;
            default:
                container.innerHTML = this.getAIInsights();
        }
    }

    getAIInsights() {
        const insights = [
            { title: 'Highest revenue opportunity', text: 'GreenLeaf CRM Upgrade is likely to close in 10–14 days.', color: 'emerald', icon: 'trending-up' },
            { title: 'Retention risk', text: 'Mumbai Retail health score dropped below 50. Schedule a check-in.', color: 'rose', icon: 'alert-triangle' },
            { title: 'Billing acceleration', text: 'Sending reminders 2 days before due increases on-time payments by ~18%.', color: 'amber', icon: 'credit-card' },
            { title: 'Campaign optimization', text: 'Resend “Quarterly Offer” to non-openers with a new subject line.', color: 'indigo', icon: 'send' }
        ];

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">AI Insights</h2>
                        <p class="text-sm text-slate-500">Actionable suggestions from engagement, billing, and pipeline</p>
                    </div>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Refresh</button>
                </div>

                <div class="grid grid-cols-2 gap-6">
                    ${insights.map(i => `
                        <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                            <div class="flex items-start gap-4">
                                <div class="w-12 h-12 rounded-lg bg-${i.color}-50 flex items-center justify-center">
                                    <i data-lucide="${i.icon}" class="w-6 h-6 text-${i.color}-700"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="text-sm font-semibold text-slate-900">${i.title}</div>
                                    <div class="text-sm text-slate-600 mt-1">${i.text}</div>
                                    <div class="mt-4 flex gap-2">
                                        <button data-action="toast" class="px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">View</button>
                                        <button data-action="toast" class="px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Apply</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-semibold text-slate-900">Suggested Next Actions</h3>
                            <p class="text-sm text-slate-500">Prioritized task list</p>
                        </div>
                        <button data-action="toast" class="px-3 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Assign</button>
                    </div>
                    <div class="mt-4 space-y-3">
                        ${[
                            { t: 'Send reminder for INV-102 (TechNova)', tag: 'Billing', color: 'rose' },
                            { t: 'Schedule renewal call with TechNova', tag: 'Retention', color: 'emerald' },
                            { t: 'Auto-follow-up for qualified leads within 24h', tag: 'Pipeline', color: 'indigo' },
                            { t: 'Resend Quarterly Offer to non-openers', tag: 'Campaign', color: 'amber' }
                        ].map(a => `
                            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div class="text-sm font-medium text-slate-900">${a.t}</div>
                                <span class="px-2 py-1 text-xs font-medium bg-${a.color}-50 text-${a.color}-700 rounded-full">${a.tag}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    getAIWorkflows() {
        const rules = [
            { name: 'Invoice Reminder', desc: 'Send WhatsApp reminder 2 days before due date', enabled: true },
            { name: 'Qualified Lead Follow-up', desc: 'If lead is Qualified, create follow-up within 24h', enabled: true },
            { name: 'Survey After Delivery', desc: 'Send survey 3 days after project completion', enabled: false },
            { name: 'Re-engagement Nudge', desc: 'If no activity for 30 days, send win-back sequence', enabled: true }
        ];

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Workflow Rules</h2>
                        <p class="text-sm text-slate-500">Automation toggles for master flow</p>
                    </div>
                    <button data-action="toast" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ New Rule</button>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                        <div class="text-sm font-medium text-slate-900">Rules</div>
                        <span class="text-xs text-slate-500">${rules.length} total</span>
                    </div>
                    <div class="divide-y divide-slate-200">
                        ${rules.map(r => `
                            <div class="p-4 flex items-start justify-between hover:bg-slate-50">
                                <div>
                                    <div class="text-sm font-semibold text-slate-900">${r.name}</div>
                                    <div class="text-sm text-slate-600 mt-1">${r.desc}</div>
                                </div>
                                <div class="flex items-center gap-3">
                                    <span class="text-xs font-medium ${r.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'} px-2 py-1 rounded-full">${r.enabled ? 'Enabled' : 'Disabled'}</span>
                                    <button data-action="toast" class="px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Edit</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    getAISmartAlerts() {
        const alerts = [
            { title: 'Invoice overdue', text: 'INV-102 is overdue by 3 days (TechNova).', color: 'rose', icon: 'alert-triangle' },
            { title: 'Approval pending', text: 'GreenLeaf proposal awaiting approval for 7 days.', color: 'amber', icon: 'clock' },
            { title: 'Engagement drop', text: 'Mumbai Retail opened 0 of last 3 messages.', color: 'indigo', icon: 'activity' },
            { title: 'Positive signal', text: 'EduSpark clicked the offer link twice in last campaign.', color: 'emerald', icon: 'thumbs-up' }
        ];

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Smart Alerts</h2>
                        <p class="text-sm text-slate-500">Auto-detected risks and opportunities</p>
                    </div>
                    <button class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Mark all read</button>
                </div>

                <div class="grid grid-cols-2 gap-6">
                    ${alerts.map(a => `
                        <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                            <div class="flex items-start gap-4">
                                <div class="w-12 h-12 rounded-lg bg-${a.color}-50 flex items-center justify-center">
                                    <i data-lucide="${a.icon}" class="w-6 h-6 text-${a.color}-700"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="text-sm font-semibold text-slate-900">${a.title}</div>
                                    <div class="text-sm text-slate-600 mt-1">${a.text}</div>
                                    <div class="mt-4 flex gap-2">
                                        <button class="px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Open</button>
                                        <button class="px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Resolve</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getAIPredictions() {
        const risks = [
            { name: 'Mumbai Retail', risk: 'High', reason: 'Low engagement + pending invoice', color: 'rose' },
            { name: 'GreenLeaf', risk: 'Medium', reason: 'Approval delays + scope questions', color: 'amber' },
            { name: 'TechNova', risk: 'Low', reason: 'Healthy engagement + renewal interest', color: 'emerald' }
        ];

        return `
            <div class="space-y-6 fade-in">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-slate-900">Predictions</h2>
                        <p class="text-sm text-slate-500">Revenue forecast and churn risk</p>
                    </div>
                    <button class="px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Export</button>
                </div>

                <div class="grid grid-cols-3 gap-6">
                    <div class="col-span-2 bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-lg font-semibold text-slate-900">Revenue Forecast</h3>
                                <p class="text-sm text-slate-500">Expected vs risk amount</p>
                            </div>
                            <span class="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">Next 30 days</span>
                        </div>
                        <div class="mt-4 h-80 bg-slate-50 rounded-lg p-3">
                            <canvas id="predictionChart"></canvas>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900">Churn Risk</h3>
                        <div class="mt-4 space-y-3">
                            ${risks.map(r => `
                                <div class="p-4 bg-slate-50 rounded-lg">
                                    <div class="flex items-center justify-between">
                                        <div class="text-sm font-semibold text-slate-900">${r.name}</div>
                                        <span class="px-2 py-1 text-xs font-medium bg-${r.color}-50 text-${r.color}-700 rounded-full">${r.risk}</span>
                                    </div>
                                    <div class="text-xs text-slate-500 mt-2">${r.reason}</div>
                                </div>
                            `).join('')}
                        </div>
                        <button class="mt-5 w-full px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Create retention plan</button>
                    </div>
                </div>
            </div>
        `;
    }

    initializeLucideIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    setupEventListeners() {
        this.setupSidebarToggle();
        this.setupSidebarCollapse();
        this.setupProfileMenu();
        this.setupNotifications();
        this.setupActionDispatcher();

        const sidebarNav = document.getElementById('sidebar-nav');
        if (sidebarNav && !this._sidebarNavDelegated) {
            this._sidebarNavDelegated = true;
            sidebarNav.addEventListener('click', (e) => {
                const btn = e.target.closest('button[data-subsection]');
                if (!btn || !sidebarNav.contains(btn)) return;
                const subSection = btn.dataset.subsection;
                if (!subSection) return;
                this.switchSubSection(subSection);
                this.closeMobileSidebar();
            });
        }

        if (!this._sectionNavDelegated) {
            this._sectionNavDelegated = true;
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('button[data-action]');
                if (!btn) return;
                this._lastActionButton = btn;
                const handled = this._handleAction ? this._handleAction(btn.dataset.action) : false;
                if (handled) {
                    this.renderSidebar();
                    this.renderContent();
                    this.initializeLucideIcons();
                    this.renderChatPanel();
                }
            });
        }

        const searchInput = document.getElementById('globalSearch');
        const resultsEl = document.getElementById('globalSearchResults');
        const index = this.getGlobalSearchIndex();
        let activeIndex = -1;
        let lastMatches = [];

        const hideResults = () => {
            if (!resultsEl) return;
            resultsEl.classList.add('hidden');
        };

        const showResults = () => {
            if (!resultsEl) return;
            resultsEl.classList.remove('hidden');
        };

        const render = (query) => {
            if (!resultsEl) return;
            const q = (query || '').trim().toLowerCase();
            const matches = (q ? index.filter(item => item.search.includes(q)) : index).slice(0, 8);
            lastMatches = matches;
            activeIndex = matches.length ? 0 : -1;

            if (matches.length === 0) {
                resultsEl.innerHTML = '<div class="p-3 text-sm text-slate-600">No results found</div>';
                showResults();
                return;
            }

            resultsEl.innerHTML = matches.map((m, i) => `
                <button class="w-full text-left px-3 py-2 transition-colors ${i === activeIndex ? 'bg-slate-50' : 'hover:bg-slate-50'}" data-target-section="${m.section}" data-target-subsection="${m.subsection}">
                    <div class="flex items-center justify-between">
                        <div class="text-sm font-medium text-slate-900">${m.title}</div>
                        <div class="text-[11px] text-slate-500">${m.type}</div>
                    </div>
                    <div class="text-xs text-slate-600 mt-0.5">${m.subtitle}</div>
                </button>
            `).join('');
            showResults();

            resultsEl.querySelectorAll('button[data-target-section]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const section = btn.dataset.targetSection;
                    const subsection = btn.dataset.targetSubsection;
                    if (searchInput) searchInput.value = '';
                    hideResults();
                    this.switchSection(section);
                    this.switchSubSection(subsection);
                });
            });
        };

        if (searchInput) {
            searchInput.addEventListener('input', (e) => render(e.target.value));
            searchInput.addEventListener('focus', (e) => render(e.target.value));
            searchInput.addEventListener('keydown', (e) => {
                if (!resultsEl) return;

                if (e.key === 'Escape') {
                    hideResults();
                    return;
                }

                if (e.key === 'ArrowDown') {
                    if (!lastMatches.length) return;
                    activeIndex = Math.min(lastMatches.length - 1, activeIndex + 1);
                    render(searchInput.value);
                    e.preventDefault();
                    return;
                }

                if (e.key === 'ArrowUp') {
                    if (!lastMatches.length) return;
                    activeIndex = Math.max(0, activeIndex - 1);
                    render(searchInput.value);
                    e.preventDefault();
                    return;
                }

                if (e.key === 'Enter') {
                    if (!lastMatches.length || activeIndex < 0) return;
                    const item = lastMatches[activeIndex];
                    if (!item) return;
                    searchInput.value = '';
                    hideResults();
                    this.switchSection(item.section);
                    this.switchSubSection(item.subsection);
                    e.preventDefault();
                    return;
                }
            });
        }

        document.addEventListener('click', (e) => {
            if (!resultsEl || !searchInput) return;
            const target = e.target;
            if (resultsEl.contains(target) || searchInput.contains(target)) return;
            hideResults();
        });
    }

    setupSidebarCollapse() {
        const btn = document.getElementById('sidebarCollapse');
        if (!btn) return;

        const apply = (collapsed) => {
            document.body.classList.toggle('sidebar-collapsed', collapsed);
            try { localStorage.setItem('mf_sidebar_collapsed', collapsed ? '1' : '0'); } catch (_) {}
            const icon = btn.querySelector('i[data-lucide]');
            if (icon) icon.setAttribute('data-lucide', collapsed ? 'chevrons-right' : 'chevrons-left');
            this.initializeLucideIcons();
            this.renderChatPanel();
        };

        let initial = false;
        try { initial = localStorage.getItem('mf_sidebar_collapsed') === '1'; } catch (_) {}
        apply(initial);

        btn.addEventListener('click', () => {
            const collapsed = document.body.classList.contains('sidebar-collapsed');
            apply(!collapsed);
        });
    }

    getNotificationsData() {
        return [
            {
                id: 'n1',
                title: 'Invoice overdue: INV-102',
                message: 'TechNova • ₹42,000 • Due 3 days ago',
                time: '10m ago',
                type: 'billing',
                unread: true
            },
            {
                id: 'n2',
                title: 'Campaign ready to send',
                message: 'Quarterly Offer • 126 recipients • Scheduled 3:00 PM',
                time: '2h ago',
                type: 'campaigns',
                unread: true
            },
            {
                id: 'n3',
                title: 'Client health alert',
                message: 'Mumbai Retail score dropped to 48 • Create retention plan',
                time: 'Yesterday',
                type: 'engagement',
                unread: true
            },
            {
                id: 'n4',
                title: 'Proposal approved',
                message: 'GreenLeaf • QTN-44 approved • Generate invoice',
                time: '2 days ago',
                type: 'billing',
                unread: false
            }
        ];
    }

    setupNotifications() {
        const toggle = document.getElementById('notificationToggle');
        const menu = document.getElementById('notificationMenu');
        const list = document.getElementById('notificationList');
        const subtitle = document.getElementById('notificationSubtitle');
        const countBadge = document.getElementById('notificationCount');
        const markAllBtn = document.getElementById('markAllReadBtn');

        if (!toggle || !menu || !list || !subtitle || !countBadge) return;

        if (!this.notifications) this.notifications = this.getNotificationsData();

        const close = () => menu.classList.add('hidden');
        const open = () => menu.classList.remove('hidden');
        const isOpen = () => !menu.classList.contains('hidden');

        const sectionLabel = (type) => {
            const map = {
                billing: { label: 'Billing', color: 'rose' },
                campaigns: { label: 'Campaigns', color: 'indigo' },
                engagement: { label: 'Engagement', color: 'amber' },
                projects: { label: 'Projects', color: 'sky' },
                leads: { label: 'Leads', color: 'emerald' }
            };
            return map[type] || { label: 'Update', color: 'slate' };
        };

        const updateBadge = () => {
            const unread = (this.notifications || []).filter(n => n.unread).length;
            if (unread <= 0) {
                countBadge.classList.add('hidden');
                subtitle.textContent = 'No new notifications';
            } else {
                countBadge.classList.remove('hidden');
                countBadge.textContent = String(unread);
                subtitle.textContent = `You have ${unread} unread`;
            }
        };

        const render = () => {
            const items = this.notifications || [];
            list.innerHTML = items.map(n => {
                const meta = sectionLabel(n.type);
                return `
                    <button data-notification-id="${n.id}" class="w-full text-left p-4 border-b border-slate-100 hover:bg-slate-50 transition">
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0">
                                <div class="flex items-center gap-2">
                                    <span class="px-2 py-0.5 text-[11px] font-medium bg-${meta.color}-50 text-${meta.color}-700 rounded-full">${meta.label}</span>
                                    ${n.unread ? '<span class="w-2 h-2 rounded-full bg-red-500"></span>' : ''}
                                </div>
                                <div class="mt-2 text-sm font-semibold text-slate-900 truncate">${n.title}</div>
                                <div class="text-xs text-slate-600 mt-1">${n.message}</div>
                                <div class="text-[11px] text-slate-500 mt-2">${n.time}</div>
                            </div>
                        </div>
                    </button>
                `;
            }).join('');

            updateBadge();

            list.querySelectorAll('button[data-notification-id]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.notificationId;
                    const item = (this.notifications || []).find(x => x.id === id);
                    if (item) item.unread = false;
                    render();
                    close();
                    if (item?.type) this.switchSection(item.type === 'billing' ? 'billing' : item.type);
                });
            });
        };

        render();

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isOpen()) close();
            else open();
        });

        document.addEventListener('click', (e) => {
            const target = e.target;
            if (toggle.contains(target) || menu.contains(target)) return;
            close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });

        if (markAllBtn) {
            markAllBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                (this.notifications || []).forEach(n => { n.unread = false; });
                render();
            });
        }
    }

    setupProfileMenu() {
        const toggle = document.getElementById('profileToggle');
        const menu = document.getElementById('profileMenu');
        const logout = document.getElementById('logoutBtn');
        if (!toggle || !menu) return;

        const close = () => menu.classList.add('hidden');
        const open = () => menu.classList.remove('hidden');
        const isOpen = () => !menu.classList.contains('hidden');

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isOpen()) close();
            else open();
        });

        document.addEventListener('click', (e) => {
            const target = e.target;
            if (toggle.contains(target) || menu.contains(target)) return;
            close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });

        if (logout) {
            logout.addEventListener('click', () => {
                try { localStorage.removeItem('bezent_user_email'); } catch (_) {}
                window.location.href = 'index.html';
            });
        }
    }

    setupSidebarToggle() {
        const toggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('appSidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (!toggle || !sidebar || !overlay) return;

        const open = () => {
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.remove('hidden');
        };

        const close = () => {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        };

        toggle.addEventListener('click', () => {
            const isOpen = !sidebar.classList.contains('-translate-x-full');
            if (isOpen) close();
            else open();
        });

        overlay.addEventListener('click', () => close());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });

        const closeOnDesktop = () => {
            if (window.matchMedia('(min-width: 768px)').matches) {
                overlay.classList.add('hidden');
                sidebar.classList.remove('-translate-x-full');
            } else {
                if (overlay.classList.contains('hidden')) sidebar.classList.add('-translate-x-full');
            }
        };

        window.addEventListener('resize', closeOnDesktop);
        closeOnDesktop();
    }

    getGlobalSearchIndex() {
        const items = [
            { type: 'Client', title: 'TechNova Solutions', subtitle: 'Status: Active', section: 'leads', subsection: 'clients' },
            { type: 'Client', title: 'GreenLeaf Industries', subtitle: 'Status: Onboarding', section: 'leads', subsection: 'clients' },
            { type: 'Project', title: 'SEO Revamp', subtitle: 'Client: TechNova Solutions', section: 'projects', subsection: 'active' },
            { type: 'Project', title: 'CRM Upgrade', subtitle: 'Client: GreenLeaf Industries', section: 'projects', subsection: 'pipeline' },
            { type: 'Invoice', title: 'INV-102', subtitle: 'TechNova • ₹42,000 • Overdue', section: 'billing', subsection: 'invoices' },
            { type: 'Invoice', title: 'INV-121', subtitle: 'GreenLeaf • ₹58,000 • Pending', section: 'billing', subsection: 'invoices' }
        ];

        const dynamic = [];
        try {
            this.getStoredClients().forEach(c => {
                if (!c?.name) return;
                dynamic.push({ type: 'Client', title: c.name, subtitle: `Owner: ${c.owner || '—'}`, section: 'leads', subsection: 'clients' });
            });
        } catch (_) {}

        try {
            this.getStoredProjects().forEach(p => {
                if (!p?.name) return;
                dynamic.push({ type: 'Project', title: p.name, subtitle: `Client: ${p.client || '—'}`, section: 'projects', subsection: 'active' });
            });
        } catch (_) {}

        try {
            this.getStoredInvoices().forEach(i => {
                if (!i?.no) return;
                dynamic.push({ type: 'Invoice', title: i.no, subtitle: `${i.client || '—'} • ${i.amount || ''} • ${i.status || ''}`, section: 'billing', subsection: 'invoices' });
            });
        } catch (_) {}

        try {
            this.getStoredCampaigns().forEach(c => {
                if (!c?.name) return;
                dynamic.push({ type: 'Campaign', title: c.name, subtitle: `Status: ${c.status || 'Draft'}`, section: 'campaigns', subsection: 'email' });
            });
        } catch (_) {}

        return [...dynamic, ...items].map(i => ({
            ...i,
            search: `${i.type} ${i.title} ${i.subtitle}`.toLowerCase()
        }));
    }

    // Initialize charts when needed
    initializeRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (ctx) {
            this.charts.revenueChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                    datasets: [{
                        label: 'Revenue',
                        data: [285000, 320000, 415000, 380000, 485000],
                        borderColor: '#0ea5e9',
                        backgroundColor: 'rgba(14, 165, 233, 0.12)',
                        tension: 0.4
                    }, {
                        label: 'Target',
                        data: [300000, 350000, 400000, 450000, 500000],
                        borderColor: '#10b981',
                        borderDash: [5, 5],
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const renderBootError = (err) => {
        const mc = document.getElementById('main-content');
        if (!mc) return;
        const msg = (err && (err.stack || err.message)) ? (err.stack || err.message) : String(err || 'Unknown error');
        mc.innerHTML = `
            <div style="padding:16px;border:1px solid #fecaca;background:#fff1f2;border-radius:12px;color:#881337;">
                <div style="font-weight:800;">MarketFlow failed to start</div>
                <pre style="margin-top:10px;white-space:pre-wrap;font-size:12px;line-height:1.4;color:#9f1239;">${String(msg).replace(/</g, '&lt;')}</pre>
            </div>
        `;
    };

    window.addEventListener('error', (e) => {
        renderBootError(e?.error || e?.message);
    });

    window.addEventListener('unhandledrejection', (e) => {
        renderBootError(e?.reason);
    });

    try {
        new MarketFlowCRM();
    } catch (err) {
        renderBootError(err);
    }
});
