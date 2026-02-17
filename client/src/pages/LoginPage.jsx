import CrmPane from '../components/CrmPane.jsx';
import LoginPane from '../components/LoginPane.jsx';

export default function LoginPage({ onLoginSuccess }) {
  return (
    <main className="login-container">
      <div className="login-card">
        <CrmPane />
        <LoginPane onLoginSuccess={onLoginSuccess} />
      </div>
    </main>
  );
}
