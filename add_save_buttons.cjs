const fs = require('fs');
let file = fs.readFileSync('client/app.js', 'utf8');

const rfpButtonTarget = `                        <button data-action="rfp:print:current" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Print RFP</button>`;
const rfpButtonReplace = `                        <button data-action="rfp:save:current" class="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">Save RFP</button>\n                        <button data-action="rfp:print:current" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Print RFP</button>`;

const quoteButtonTarget = `                        <button data-action="quote:print:current" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Print Quotation</button>`;
const quoteButtonReplace = `                        <button data-action="quote:save:current" class="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">Save Quotation</button>\n                        <button data-action="quote:print:current" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Print Quotation</button>`;

const handlerTarget = `            if (a === 'rfp:print:current') {
                const r = this.computeRfp(this._rfpDraft || this.getSampleRfpTemplate());
                this.openRfpPrintWindow(r);
                return true;
            }`;

const handlerReplace = `            if (a === 'quote:save:current') {
                const q = this.computeQuotation(this._quoteDraft || this.getSampleQuotationTemplate());
                const quotes = this.readStore('bezent_quotations', []);
                const qno = q.company?.quoteNumber || 'Q-' + Date.now();
                
                // Add required fields
                q.id = 'Q' + Date.now();
                q.date = q.company?.date || new Date().toISOString().split('T')[0];
                q.number = qno;
                q.client = q.buyer?.name || 'Unknown Client';
                q.project = ''; // You can add project input in the template if needed
                q.amount = q.totals?.grandTotal || '0';
                q.status = 'Draft';
                
                quotes.unshift(q);
                this.writeStore('bezent_quotations', quotes);
                
                // Also trigger an API sync via existing logic if possible (we just write to localStorage via writeStore which syncs)
                this.showToast('Quotation ' + qno + ' saved successfully!');
                return true;
            }

            if (a === 'rfp:save:current') {
                const r = this.computeRfp(this._rfpDraft || this.getSampleRfpTemplate());
                // Using quotations store or a separate RFPs store? 
                // Currently there is no "bezent_rfps" in standard views, so we will create it and store it or keep it accessible.
                const rfps = this.readStore('bezent_rfps', []);
                const rno = 'RFP-' + Date.now();
                
                r.id = rno;
                r.date = r.client?.dateOfRequest || new Date().toISOString().split('T')[0];
                r.clientName = r.client?.companyName || 'Unknown Client';
                r.projectName = r.client?.projectName || '';
                
                rfps.unshift(r);
                this.writeStore('bezent_rfps', rfps);
                this.showToast('RFP saved successfully!');
                return true;
            }

            if (a === 'rfp:print:current') {
                const r = this.computeRfp(this._rfpDraft || this.getSampleRfpTemplate());
                this.openRfpPrintWindow(r);
                return true;
            }`;

// Add a line replacing
file = file.replace(rfpButtonTarget, rfpButtonReplace);
file = file.replace(quoteButtonTarget, quoteButtonReplace);
file = file.replace(handlerTarget, handlerReplace);

fs.writeFileSync('client/app.js', file, 'utf8');
console.log('Added save buttons and handlers for Quotation and RFP.');
