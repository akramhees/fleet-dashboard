import React, { useState } from 'react';
import { FaUserPlus, FaCar, FaIdCard, FaPhone, FaEnvelope, FaLock } from 'react-icons/fa';
import DocumentUpload from './DocumentUpload';
import './colors.css';
import './App.css';

function SignUp({ onBackToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    vehicleModel: '',
    vehiclePlate: ''
  });
  const [licensePhoto, setLicensePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('${process.env.REACT_APP_API_URL}/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          licenseNumber: formData.licenseNumber,
          vehicleModel: formData.vehicleModel,
          vehiclePlate: formData.vehiclePlate
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessage('✅ Account created! Please login.');
        setTimeout(() => onBackToLogin(), 2000);
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (error) {
      setMessage('❌ Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
          <FaUserPlus size={28} color="#8a5c66" />
          <h2 style={{ margin: 0, padding: 0, fontSize: '28px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #8a5c66, #644f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>FleetMate</h2>
        </div>
        <p className="subtitle" style={{ textAlign: 'center' }}>Driver Onboarding</p>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="input-modern"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="input-modern"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="driver@example.com"
                  required
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="input-modern"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  required
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="input-modern"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  required
                  minLength="6"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="input-modern"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <button type="button" className="btn-primary" onClick={() => setStep(2)} style={{ width: '100%', marginBottom: '12px' }}>
                Next: Vehicle Info →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label>Driver's License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  className="input-modern"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="DL-12345678"
                  required
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label>Vehicle Model</label>
                <input
                  type="text"
                  name="vehicleModel"
                  className="input-modern"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  placeholder="Toyota Camry"
                  required
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label>License Plate</label>
                <input
                  type="text"
                  name="vehiclePlate"
                  className="input-modern"
                  value={formData.vehiclePlate}
                  onChange={handleChange}
                  placeholder="ABC-1234"
                  required
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <DocumentUpload 
                label="Driver's License Photo" 
                onUpload={(file) => setLicensePhoto(file)} 
              />

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" className="btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>
                  ← Back
                </button>
                <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2 }}>
                  {loading ? 'Creating Account...' : 'Complete Sign Up'}
                </button>
              </div>
            </>
          )}
        </form>

        {message && (
          <div className="message-box" style={{
            marginTop: '16px',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: message.includes('✅') ? 'rgba(40,167,69,0.12)' : 'rgba(220,53,69,0.12)',
            color: message.includes('✅') ? '#5cb85c' : '#e06b6b',
            border: message.includes('✅') ? '1px solid rgba(40,167,69,0.15)' : '1px solid rgba(220,53,69,0.15)',
            fontSize: '14px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {message}
          </div>
        )}

        <div className="demo-hint" style={{ textAlign: 'center', marginTop: '16px' }}>
          Already have an account?{' '}
          <button onClick={onBackToLogin} style={{ background: 'none', border: 'none', color: '#8a5c66', cursor: 'pointer', textDecoration: 'underline' }}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
