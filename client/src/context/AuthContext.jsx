/**
 * client/src/context/AuthContext.jsx
 *
 * Provides auth state (user, token) across the entire React tree.
 * Wrap your app root with <AuthProvider> and consume with useAuth().
 */
import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser]   = useState(() => {
        try { return JSON.parse(localStorage.getItem('bezent_user')); } catch { return null; }
    });
    const [token, setToken] = useState(() => localStorage.getItem('bezent_jwt'));

    const login = useCallback((tokenVal, userVal) => {
        localStorage.setItem('bezent_jwt',  tokenVal);
        localStorage.setItem('bezent_user', JSON.stringify(userVal));
        setToken(tokenVal);
        setUser(userVal);
    }, []);

    const logout = useCallback(() => {
        localStorage.clear();
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
