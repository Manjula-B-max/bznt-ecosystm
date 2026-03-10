const fs = require('fs');

let c = fs.readFileSync('client/app.js', 'utf8');

// 1. Replace RFP Print button with Save + Print
c = c.replace(
    '<button data-action="rfp:print:current" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Print RFP</button>',
    '<button data-action="rfp:save:current" class="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">Save RFP</button>\n                        <button data-action="rfp:print:current" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Print RFP</button>'
);

// 2. Replace Quote Print button with Save + Print
c = c.replace(
    '<button data-action="quote:print:current" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Print Quotation</button>',
    '<button data-action="quote:save:current" class="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">Save Quotation</button>\n                        <button data-action="quote:print:current" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Print Quotation</button>'
);

// 3. Add handlers
const searchHandler = `            if (a === 'quote:print:current') {
                const q = this.computeQuotation(this._quoteDraft || this.getSampleQuotationTemplate());
                this.openQuotationPrintWindow(q);
                return true;
            }`;

const newHandlers = `            if (a === 'quote:save:current') {
                const q = this.computeQuotation(this._quoteDraft || this.getSampleQuotationTemplate());
                const quotes = this.readStore('bezent_quotations', []);
                const qno = q.company?.quoteNumber || 'Q-' + Date.now();
                q.id = 'Q-' + Date.now();
                q.date = q.company?.date || new Date().toISOString().split('T')[0];
                q.number = qno;
                q.client = q.buyer?.name || 'Unknown Client';
                q.amount = q.totals?.grandTotal || '0';
                q.status = 'Draft';
                quotes.unshift(q);
                this.writeStore('bezent_quotations', quotes);
                this.showToast('Quotation ' + qno + ' saved to database!');
                return true;
            }

            if (a === 'rfp:save:current') {
                const r = this.computeRfp(this._rfpDraft || this.getSampleRfpTemplate());
                const rfps = this.readStore('bezent_rfps', []);
                const rno = 'RFP-' + Date.now();
                r.id = rno;
                r.date = r.client?.dateOfRequest || new Date().toISOString().split('T')[0];
                r.clientName = r.client?.companyName || 'Unknown Client';
                r.projectName = r.client?.projectName || '';
                rfps.unshift(r);
                this.writeStore('bezent_rfps', rfps);
                this.showToast('RFP saved to database!');
                return true;
            }

`;

// Handle spaces and line endings safely using regex
if (c.includes('quote:print:current')) {
    const rx = /if\s*\(a\s*===\s*'quote:print:current'\)\s*\{\s*const[^}]*openQuotationPrintWindow[^}]*return true;\s*\}/s;
    c = c.replace(rx, (match) => { return newHandlers + match; });
} else {
    console.log('Could not find quote:print:current handler to inject');
}

fs.writeFileSync('client/app.js', c, 'utf8');
console.log('App.js modified safely.');
