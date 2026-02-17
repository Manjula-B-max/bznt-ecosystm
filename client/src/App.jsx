import React, { useState } from 'react';
import LoginPage from './pages/LoginPage.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
  };

  const handleLoginSuccess = (userEmail) => {
    setEmail(userEmail || '');
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Simple logged-in view
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome Back!</h1>
        <p className="text-gray-600 mb-6">You are logged in as: {email}</p>
        <button
          onClick={handleLogout}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
