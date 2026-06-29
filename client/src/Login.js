import React, { useState } from 'react';
import './colors.css';
import './App.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('Login successful');
        onLogin(data.user);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>FleetPulse</h2>
        <p className="subtitle">Sign in to access your dashboard</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label>Email</label>
            <input
              type="email"
              className="input-modern"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="driver@test.com"
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label>Password</label>
            <input
              type="password"
              className="input-modern"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {message && (
          <div className={`message-box ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="demo-hint">
          Demo: <code>driver@test.com</code> / <code>password123</code>
        </div>
      </div>
    </div>
  );
}

export default Login;
