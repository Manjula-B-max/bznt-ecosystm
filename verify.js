import fs from 'fs';
const code = fs.readFileSync('client/app.js', 'utf8');

const checks = [
  { item: 'addContactRow = function', found: code.includes('addContactRow = function') },
  { item: 'extractAddress = function', found: code.includes('extractAddress = function') },
  { item: 'leadContactPersonsList', found: code.includes('leadContactPersonsList') },
  { item: 'clientContactPersonsList', found: code.includes('clientContactPersonsList') },
  { item: 'clientGstStateCode dropdown', found: code.includes('<select id="clientGstStateCode"') },
  { item: 'extractAddress("lead")', found: code.includes('extractAddress(\'lead\')') }
];

console.log(JSON.stringify(checks, null, 2));
