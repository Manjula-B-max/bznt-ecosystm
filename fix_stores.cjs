const fs = require('fs');
let code = fs.readFileSync('client/app.js', 'utf8');

// Fix lead:delete writeStore
code = code.replace(
    /this\.writeStore\('bezent_leads',\s*filtered\);/g,
    "this.writeStore('APJ 3D Solutions_leads', filtered);"
);

// Fix project edit modal writeStore
// Originally:
//                 let existing = this.getAllProjectsMerged([]);
//                 let projIndex = existing.findIndex(x => this.getProjectKey(x) === oldKey);
// ...
//                     this.writeStore('bezent_projects_merged', existing);
code = code.replace(
    /let existing = this\.getAllProjectsMerged\(\[\]\);([\s\S]*?)this\.writeStore\('bezent_projects_merged',\s*existing\);/,
    `let existing = this.getStoredProjects();
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
                    this.writeStore('APJ 3D Solutions_projects', existing);`
);

fs.writeFileSync('client/app.js', code, 'utf8');
console.log("Fixed!");
