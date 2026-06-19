const TOKEN_KEY = 'bezent_jwt';

export function getToken() {
    return localStorage.getItem(TOKEN_KEY) || '';
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export async function apiClient(path, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Auto-serialize body if it's a plain object
    const fetchOptions = { ...options, headers };
    if (fetchOptions.body && typeof fetchOptions.body === 'object' && !(fetchOptions.body instanceof FormData)) {
        fetchOptions.body = JSON.stringify(fetchOptions.body);
    }

    const res = await fetch('/api' + path, fetchOptions);

    if (res.status === 401) {
        clearToken();
        window.location.href = '/'; // Redirect to landing/login
        throw new Error('Session expired — please log in again.');
    }

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            throw new Error(data.error || `Error ${res.status}`);
        }
        return data;
    }

    if (!res.ok) {
        throw new Error(`Error ${res.status}`);
    }
    
    return res;
}
