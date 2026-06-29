import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('driver'); // 'driver' or 'admin'

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setRole('driver');
  };

  const switchToAdmin = () => setRole('admin');
  const switchToDriver = () => setRole('driver');

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto', 
        padding: '0 20px',
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        marginTop: '20px'
      }}>
        <button 
          onClick={switchToDriver}
          style={{
            padding: '10px 20px',
            backgroundColor: role === 'driver' ? '#007bff' : '#e9ecef',
            color: role === 'driver' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🚗 Driver View
        </button>
        <button 
          onClick={switchToAdmin}
          style={{
            padding: '10px 20px',
            backgroundColor: role === 'admin' ? '#007bff' : '#e9ecef',
            color: role === 'admin' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📊 Admin View
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
