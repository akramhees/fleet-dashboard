import React, { useState } from 'react';
import { FaCar, FaUserPlus } from 'react-icons/fa';
import './colors.css';
import './App.css';

function Login({ onLogin, onSignUp }) {
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
          <FaCar size={28} color="#8a5c66" />
          <h2 style={{ margin: 0, padding: 0, fontSize: '28px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #8a5c66, #644f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>FleetMate</h2>
        </div>
        <p className="subtitle" style={{ textAlign: 'center' }}>Sign in to access your dashboard</p>

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
              style={{ width: '100%', boxSizing: 'border-box' }}
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
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {message && (
          <div className="message-box" style={{
            marginTop: '16px',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: message.includes('successful') ? 'rgba(40,167,69,0.12)' : 'rgba(220,53,69,0.12)',
            color: message.includes('successful') ? '#5cb85c' : '#e06b6b',
            border: message.includes('successful') ? '1px solid rgba(40,167,69,0.15)' : '1px solid rgba(220,53,69,0.15)',
            fontSize: '14px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {message}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button onClick={onSignUp} style={{ background: 'none', border: 'none', color: '#8a5c66', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 auto' }}>
            <FaUserPlus size={14} /> New driver? Sign up here
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;
