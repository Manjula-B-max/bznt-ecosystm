import { apiClient } from './employee-api.js';

export const employeeState = {
    user: null,
    employee: null,
    activeWorkspace: 'everyday', // default: Everyday Routine Hub
    activePanel: 'dashboard',    // default: Dashboard panel
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

export async function loadEmployeeSession() {
    employeeState.update({ loading: true, error: null });
    try {
        const data = await apiClient('/employee/me');
        employeeState.update({
            user: data.user,
            employee: data.employee,
            loading: false
        });
        return data;
    } catch (err) {
        employeeState.update({
            error: err.message,
            loading: false
        });
        throw err;
    }
}
