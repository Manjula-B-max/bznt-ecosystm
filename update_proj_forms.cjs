const fs = require('fs');
let code = fs.readFileSync('client/app.js', 'utf8');

// Update getProjectRegistration
code = code.replace(
    /getProjectRegistration\(\) \{/,
    'getProjectRegistration(projectData = null) {\n        const esc = (v) => String(v ?? "").replace(/</g, "&lt;");'
).replace(
    /<button data-action="project:register" class="(.*?)">Create Project<\/button>/,
    `<button data-action="\${projectData ? \`project:update:\${projectData.id || this.getProjectKey(projectData).replace(/\\"/g,'&quot;')}\` : 'project:register'}" class="$1">\${projectData ? 'Update Project' : 'Create Project'}</button>`
).replace(
    /id="projectName" class="(.*?)" placeholder="e.g., Website Redesign" \/>/,
    `id="projectName" class="$1" placeholder="e.g., Website Redesign" value="\${esc(projectData?.name || projectData?.identification?.projectCode || '')}" />`
).replace(
    /id="projectStartDate" type="date" class="(.*?)" \/>/,
    `id="projectStartDate" type="date" class="$1" value="\${esc(projectData?.startDate || '')}" />`
).replace(
    /id="projectBudget" class="(.*?)" placeholder="e.g., 320000" \/>/,
    `id="projectBudget" class="$1" placeholder="e.g., 320000" value="\${esc(projectData?.budget || '')}" />`
).replace(
    /<textarea id="projectDetails" class="(.*?)" rows="4" placeholder="Brief scope \/ objective \/ requirements"><\/textarea>/,
    `<textarea id="projectDetails" class="$1" rows="4" placeholder="Brief scope / objective / requirements">\${esc(projectData?.details || projectData?.identification?.projectDescription || '')}</textarea>`
);

code = code.replace(/<select id="projectClient" class="(.*?)">([\s\S]*?)<\/select>/, (match, cls, inner) => {
    return `<select id="projectClient" class="${cls}">
                                    <option value="">— Select client —</option>
                                    \${this.getStoredClients().map(c => \`<option value="\${c.name || ''}" \${(projectData?.client || '') === c.name ? 'selected' : ''}>\${c.name || ''}</option>\`).join('')}
                                </select>`;
});

fs.writeFileSync('client/app.js', code, 'utf8');
