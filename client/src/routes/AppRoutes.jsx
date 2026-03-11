/**
 * client/src/routes/AppRoutes.jsx
 *
 * Application route configuration.
 * Add new pages here — keeps routing out of App.jsx.
 */
import React from 'react';
import LoginPage from '../pages/LoginPage.jsx';

// When you add react-router-dom, swap this out for <Routes>/<Route> declarations.
// For now it mirrors the existing conditional render pattern.
export default function AppRoutes({ isLoggedIn, onLoginSuccess }) {
    if (!isLoggedIn) {
        return <LoginPage onLoginSuccess={onLoginSuccess} />;
    }

    // The full CRM app is loaded via the vanilla app.js / script.js bundle.
    // Future: replace this with a proper React-based dashboard page.
    return null;
}
