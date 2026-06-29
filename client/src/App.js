import React, { useState } from 'react';
import { FaCar, FaChartBar } from 'react-icons/fa';
import Login from './Login';
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import './colors.css';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('driver');
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => { setUser(null); setRole('driver'); };
  const handleSignUp = () => setShowSignUp(true);
  const handleBackToLogin = () => setShowSignUp(false);

  if (showSignUp) {
    return <SignUp onBackToLogin={handleBackToLogin} />;
  }

  if (!user) return <Login onLogin={handleLogin} onSignUp={handleSignUp} />;

  return (
    <div>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px 24px 0',
        display: 'flex',
        justifyContent: 'center',
        gap: '12px'
      }}>
        <button
          onClick={() => setRole('driver')}
          className={role === 'driver' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '10px 24px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FaCar size={16} /> Driver View
        </button>
        <button
          onClick={() => setRole('admin')}
          className={role === 'admin' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '10px 24px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FaChartBar size={16} /> Admin View
        </button>
      </div>

      {role === 'driver' ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <AdminDashboard onLogout={handleLogout} />
      )}

      {/* Footer */}
      <div style={{
        maxWidth: '1200px',
        margin: '20px auto',
        padding: '20px 24px',
        textAlign: 'center',
        borderTop: '1px solid var(--border-subtle)',
        color: 'var(--text-muted)',
        fontSize: '14px'
      }}>
        <p>
          Built by <strong style={{ color: 'var(--text-secondary)' }}>Akram</strong> &nbsp;|&nbsp;
          <a href="mailto:akramh2454@gmail.com" style={{ color: '#8a5c66', textDecoration: 'none' }}>
            akramh2454@gmail.com
          </a> &nbsp;|&nbsp;
          <a href="https:
            GitHub: @akramhees
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
