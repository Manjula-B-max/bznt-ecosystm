import { apiClient } from './employee-api.js';

export const employeeState = {
    user: null,
    employee: null,
    onboarding_status: null,   // Pending Onboarding | In Progress | Pending HR Verification | Approved
    activeWorkspace: 'everyday',
    activePanel: 'dashboard',
    loading: false,
    error: null,
    listeners: [],

    subscribe(callback) {
        this.listeners.push(callback);
    },

    notify() {
        this.listeners.forEach(cb => cb(this));
    },

    update(fields) {
        Object.assign(this, fields);
        this.notify();
    }
};

export async function refreshNotifications() {
    try {
        const notifications = await apiClient('/employee/notifications');
        employeeState.update({ notifications });
    } catch (e) {
        console.error('Failed to refresh notifications', e);
    }
}

export async function loadEmployeeSession() {
    employeeState.update({ loading: true, error: null });
    try {
        const [data, notifications] = await Promise.all([
            apiClient('/employee/me'),
            apiClient('/employee/notifications').catch(() => [])
        ]);
        const onboardingStatus = data.onboarding_status
            || data.employee?.onboarding_status
            || 'Pending Onboarding';

        employeeState.update({
            user: data.user,
            employee: data.employee,
            onboarding_status: onboardingStatus,
            notifications: notifications || [],
            loading: false
        });
        return { ...data, onboarding_status: onboardingStatus };
    } catch (err) {
        employeeState.update({
            error: err.message,
            loading: false
        });
        throw err;
    }
}
