import React, { useState } from 'react';
import LoginPage from './pages/LoginPage.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Restore session from localStorage on page refresh
    return !!localStorage.getItem('bezent_jwt');
  });

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    // Redirect to the main CRM dashboard
    window.location.href = '/marketflow-crm.html';
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // If already logged in (e.g. after a refresh on this page), redirect immediately
  window.location.href = '/marketflow-crm.html';
  return null;
}
