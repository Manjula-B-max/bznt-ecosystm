const fs = require('fs');
const c = fs.readFileSync('client/app.js', 'utf8');
console.log('RFPs nav tab:', c.includes("{ id: 'rfps', label: 'RFPs' }"));
console.log('RFPs case:', c.includes("case 'rfps':"));
console.log('getBillingRfps method:', c.includes('getBillingRfps()'));
console.log('q.number fix:', c.includes('q.number || q.no || q.id'));
