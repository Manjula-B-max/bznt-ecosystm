import React, { useState } from 'react';
import LoginPage from './pages/LoginPage.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLoginSuccess={(userEmail) => {
          setEmail(userEmail || '');
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ padding: 24 }}>
      <div className="login-details-box" style={{ maxWidth: 520, width: '100%' }}>
        <div className="branding">
          <h1 className="logo">BEZENT</h1>
        </div>
        <div className="form-footer" style={{ marginBottom: 16 }}>
          <span>Logged in{email ? ` as ${email}` : ''}.</span>
        </div>
        <button
          type="button"
          className="login-btn"
          onClick={() => {
            setIsLoggedIn(false);
            setEmail('');
          }}
        >
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
