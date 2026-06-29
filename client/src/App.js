import React, { useState } from 'react';
import { FaCar, FaChartBar } from 'react-icons/fa';
import Login from './Login';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import './colors.css';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('driver');

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => { setUser(null); setRole('driver'); };

  if (!user) return <Login onLogin={handleLogin} />;

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
    </div>
  );
}

export default App;
