import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('bezent_jwt');
  });

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    
    // Multi-role redirection logic (matches script.js legacy logic perfectly)
    if (user.role === 'super_admin') {
      window.location.replace('/super-admin.html');
    } else if (user.role === 'admin') {
      window.location.replace('/admin.html');
    } else if (user.marketflow_access && user.projectflow_access) {
      window.location.replace('/marketflow-crm.html'); // default to marketflow if both
    } else if (user.projectflow_access) {
      window.location.replace('/projectflow-crm.html');
    } else if (user.marketflow_access) {
      window.location.replace('/marketflow-crm.html');
    } else {
      window.location.replace('/marketflow-crm.html');
    }
  };

  // Immediate redirect if session is already active on boot
  useEffect(() => {
    if (isLoggedIn) {
      const userStr = localStorage.getItem('bezent_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          handleLoginSuccess(user);
        } catch (_) {
          window.location.replace('/marketflow-crm.html');
        }
      } else {
        window.location.replace('/marketflow-crm.html');
      }
    }
  }, [isLoggedIn]);

  return (
    <BrowserRouter>
      <AppRoutes isLoggedIn={isLoggedIn} onLoginSuccess={handleLoginSuccess} />
    </BrowserRouter>
  );
}
