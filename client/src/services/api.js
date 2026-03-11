/**
 * client/src/services/api.js
 *
 * Central API communication layer.
 * All fetch calls to the Express backend go through here.
 * React components should NEVER call fetch() directly.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken() {
    return localStorage.getItem('bezent_jwt');
}

async function request(method, path, body) {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
    sendOtp: (email)       => request('POST', '/auth/send-otp',   { email }),
    verifyOtp: (email, otp) => request('POST', '/auth/verify-otp', { email, otp }),
    getMe: ()              => request('GET',  '/auth/me'),
    updateMe: (data)       => request('PUT',  '/auth/me', data),
};

// ── Generic CRUD helper ───────────────────────────────────────────────────────
const resource = (name) => ({
    list:   ()     => request('GET',    `/${name}`),
    create: (data) => request('POST',   `/${name}`, data),
    update: (id, data) => request('PUT',  `/${name}/${id}`, data),
    remove: (id)   => request('DELETE', `/${name}/${id}`),
});

export const leadsApi      = resource('leads');
export const clientsApi    = resource('clients');
export const invoicesApi   = resource('invoices');
export const projectsApi   = resource('projects');
export const campaignsApi  = resource('campaigns');
export const followupsApi  = resource('followups');
export const quotationsApi = resource('quotations');
export const contractsApi  = resource('contracts');
export const visitsApi     = resource('visits');
export const greetingsApi  = resource('greetings');
export const feedbackApi   = resource('feedback');
export const workflowsApi  = resource('workflow_rules');
export const rfpsApi       = resource('rfps');

// ── KPI Targets ───────────────────────────────────────────────────────────────
export const kpiApi = {
    list:   ()          => request('GET', '/kpi_targets'),
    upsert: (id, target) => request('PUT', `/kpi_targets/${id}`, { target }),
};

// ── SOP Daily ─────────────────────────────────────────────────────────────────
export const sopApi = {
    get:    (date) => request('GET', `/sop/${date}`),
    upsert: (date, data) => request('PUT', `/sop/${date}`, data),
};

// ── KV Store ──────────────────────────────────────────────────────────────────
export const kvApi = {
    get: (key)         => request('GET', `/kv/${key}`),
    set: (key, value)  => request('PUT', `/kv/${key}`, { value }),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardApi = {
    summary: () => request('GET', '/dashboard/summary'),
};
