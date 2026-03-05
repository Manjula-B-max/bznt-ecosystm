const fs = require('fs');
let src = fs.readFileSync('./client/app.js', 'utf8');

// The nuclear option: 
// Instead of relying on grid on the WRAPPER div,
// make EACH CARD explicitly sized to 50% using inline styles
// with float as fallback, ensuring side-by-side regardless of any CSS override

// Find the contacts card opening div and make it explicitly 50% wide float left
const contactsCard = `<div class="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl cursor-pointer group" id="emailCampCardContacts">`;
const contactsFixed = `<div class="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl cursor-pointer group" id="emailCampCardContacts" style="width:calc(50% - 0.375rem);float:left;box-sizing:border-box;">`;

// Find the alerts card opening div and make it explicitly 50% wide float right  
const alertsCard = `<div class="relative overflow-hidden bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl p-6 shadow-xl cursor-pointer group" id="emailCampCardAlerts">`;
const alertsFixed = `<div class="relative overflow-hidden bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl p-6 shadow-xl cursor-pointer group" id="emailCampCardAlerts" style="width:calc(50% - 0.375rem);float:right;box-sizing:border-box;">`;

if (src.includes(contactsCard)) {
    src = src.replace(contactsCard, contactsFixed);
    console.log('✅ Contacts card: float left, 50%');
} else {
    console.log('⚠️ contacts card div not found');
    const i = src.indexOf('emailCampCardContacts');
    const lines = src.split('\n');
    const ln = src.slice(0, i).split('\n').length;
    console.log('At L' + ln + ':', lines[ln - 1].trim().slice(0, 130));
}

if (src.includes(alertsCard)) {
    src = src.replace(alertsCard, alertsFixed);
    console.log('✅ Alerts card: float right, 50%');
} else {
    console.log('⚠️ alerts card div not found');
    const i = src.indexOf('emailCampCardAlerts');
    const lines = src.split('\n');
    const ln = src.slice(0, i).split('\n').length;
    console.log('At L' + ln + ':', lines[ln - 1].trim().slice(0, 130));
}

// Change the wrapper div to use clearfix instead of grid
const oldWrapper = `                <style>#campaignCardsRow{display:grid!important;grid-template-columns:1fr 1fr!important;gap:.75rem!important;}</style>
                <div id="campaignCardsRow" style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;">`;
const newWrapper = `                <div id="campaignCardsRow" style="overflow:hidden;width:100%;">`;

if (src.includes(oldWrapper)) {
    src = src.replace(oldWrapper, newWrapper);
    console.log('✅ Wrapper changed to clearfix container');
} else {
    console.log('⚠️ old wrapper not found, trying simpler...');
    if (src.includes('id="campaignCardsRow"')) {
        // Just update the existing tag
        src = src.replace(
            /(<div id="campaignCardsRow"[^>]*>)/,
            '<div id="campaignCardsRow" style="overflow:hidden;width:100%;">'
        );
        console.log('✅ Wrapper replaced via regex');
    }
}

// Add a clearfix div after alerts card closing to contain the floats
// Find end of alertsCard and its closing </div> (cards wrapper closing)
const closingPattern = `                    </div>\r\n\r\n                </div>`;
const closingFixed = `                    </div>\r\n                    <div style="clear:both;"></div>\r\n\r\n                </div>`;
if (src.includes(closingPattern)) {
    // find the one right after alertsCard
    const alertsPos = src.indexOf('emailCampCardAlerts');
    const closingPos = src.indexOf(closingPattern, alertsPos);
    src = src.slice(0, closingPos) + closingFixed + src.slice(closingPos + closingPattern.length);
    console.log('✅ Clearfix div added after alerts card');
}

fs.writeFileSync('./client/app.js', src);

// Bump version
let html = fs.readFileSync('./client/marketflow-crm.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/, 'app.js?v=163');
fs.writeFileSync('./client/marketflow-crm.html', html);
console.log('✅ Version bumped to 163');

const vm = require('vm');
try { new vm.Script(src); console.log('SYNTAX OK'); }
catch (e) { console.log('ERROR:', e.message); }
