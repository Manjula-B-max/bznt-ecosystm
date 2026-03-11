/**
 * client/src/layouts/MainLayout.jsx
 *
 * Wraps authenticated pages with sidebar + topbar.
 * Currently a placeholder — the real layout is rendered by app.js / index.html.
 * When migrating to full React, move the sidebar and header JSX here.
 */
import React from 'react';

export default function MainLayout({ children }) {
    return (
        <div className="main-layout">
            {/* Sidebar and topbar will move here during the full React migration */}
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
