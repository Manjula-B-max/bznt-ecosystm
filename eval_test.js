const fs = require('fs');

const content = fs.readFileSync('client/app.js', 'utf8');

// Find the getEmailCampaigns function source code
const match = content.match(/getEmailCampaigns\(\) \{([\s\S]*?)\n    \}/);

if (!match) {
    console.error("Function not found");
    process.exit(1);
}

// create a dummy class with this method and run it
const code = `
class Dummy {
    getClientsData() { return [{email:'a@b.com', dueAmount: '₹0'}]; }
    getLeadsData() { return []; }
    getStoredProjects() { return []; }
    
    getEmailCampaigns() {
        ${match[1]}
    }
}
const d = new Dummy();
const html = d.getEmailCampaigns();
const lines = html.split('\\n');
const start = lines.findIndex(l => l.includes('Trigger Breakdown'));
console.log(lines.slice(start, start + 25).join('\\n'));
`;

fs.writeFileSync('test_render.cjs', code);
