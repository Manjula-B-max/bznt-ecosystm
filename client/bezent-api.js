/**
 * bezent-api.js — thin API client that wraps all fetch() calls to /api/*
 * Stores the JWT token in localStorage (only the token, not the data).
 * All actual data lives on the server / SQLite.
 */

const API = '/api';
const TOKEN_KEY = 'bezent_jwt';

// ── Token helpers ────────────────────────────────────────────────────────────
export function getToken() { return localStorage.getItem(TOKEN_KEY) || ''; }
export function setToken(t) { localStorage.setItem(TOKEN_KEY, t); }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); }
export function isLoggedIn() { return Boolean(getToken()); }

// ── Base fetch wrapper ───────────────────────────────────────────────────────
async function apiFetch(path, opts = {}) {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(API + path, { ...opts, headers });
    if (res.status === 401) {
        clearToken();
        window.dispatchEvent(new CustomEvent('bezent:unauthorized'));
        throw new Error('Session expired — please log in again');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
}

const get = (path) => apiFetch(path, { method: 'GET' });
const post = (path, body) => apiFetch(path, { method: 'POST', body: JSON.stringify(body) });
const put = (path, body) => apiFetch(path, { method: 'PUT', body: JSON.stringify(body) });
const del = (path) => apiFetch(path, { method: 'DELETE' });

// ── Auth ─────────────────────────────────────────────────────────────────────
export const Auth = {
    register: (body) => post('/auth/register', body),
    login: (body) => post('/auth/login', body),
    me: () => get('/auth/me'),
    update: (body) => put('/auth/me', body),
};

// ── CRUD collections ─────────────────────────────────────────────────────────
function collection(name) {
    return {
        list: () => get(`/${name}`),
        create: (body) => post(`/${name}`, body),
        update: (id, body) => put(`/${name}/${id}`, body),
        remove: (id) => del(`/${name}/${id}`),
    };
}

export const Leads = collection('leads');
export const Clients = collection('clients');
export const Invoices = collection('invoices');
export const Projects = collection('projects');
export const Campaigns = collection('campaigns');
export const Followups = collection('followups');
export const Quotations = collection('quotations');
export const Contracts = collection('contracts');
export const Visits = collection('visits');
export const Greetings = collection('greetings');
export const Feedback = collection('feedback');
export const Workflows = collection('workflow_rules');

// ── KPI Targets ──────────────────────────────────────────────────────────────
export const KpiTargets = {
    list: () => get('/kpi_targets'),
    set: (id, val) => put(`/kpi_targets/${id}`, { target: val }),
};

// ── SOP Daily ────────────────────────────────────────────────────────────────
export const Sop = {
    get: (date) => get(`/sop/${date}`),
    save: (date, items, submitted) => put(`/sop/${date}`, { items, submitted }),
};

// ── Generic KV (renewal plans, playbooks, reminders, etc.) ──────────────────
export const KV = {
    get: (key) => get(`/kv/${encodeURIComponent(key)}`),
    set: (key, val) => put(`/kv/${encodeURIComponent(key)}`, { value: val }),
};

// ── Dashboard Summary ────────────────────────────────────────────────────────
export const Dashboard = {
    summary: () => get('/dashboard/summary'),
};

// ── Store Map — maps bezent_* localStorage keys → API collection ─────────────
// Used by the compatibility shim in app.js
export const STORE_MAP = {
    'bezent_leads': Leads,
    'bezent_clients': Clients,
    'APJ 3D Solutions_clients': Clients,
    'bezent_invoices': Invoices,
    'APJ 3D Solutions_invoices': Invoices,
    'bezent_projects': Projects,
    'APJ 3D Solutions_projects': Projects,
    'bezent_campaigns': Campaigns,
    'APJ 3D Solutions_campaigns': Campaigns,
    'bezent_followups': Followups,
    'bezent_quotations': Quotations,
    'bezent_contracts': Contracts,
    'bezent_visits': Visits,
    'bezent_greetings': Greetings,
    'bezent_feedback_submissions': Feedback,
    'bezent_workflow_rules': Workflows,
};
