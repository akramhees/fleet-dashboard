import React, { useState } from 'react';

function Dashboard({ user, onLogout }) {
  const [isDriving, setIsDriving] = useState(false);
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('Not started');

  // Get user's location
  const startTracking = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setStatus('📍 Tracking location...');
        },
        (error) => {
          setStatus('❌ Error getting location: ' + error.message);
        }
      );
      setIsDriving(true);
      setStatus('✅ Driving - Location tracking active');
    } else {
      setStatus('❌ Geolocation not supported');
    }
  };

  const stopTracking = () => {
    setIsDriving(false);
    setStatus('⏹️ Shift ended');
    setLocation(null);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #eee',
        paddingBottom: '20px'
      }}>
        <div>
          <h2>🚗 Driver Dashboard</h2>
          <p>Welcome, {user?.name || 'Driver'}!</p>
        </div>
        <button 
          onClick={onLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <div style={{ 
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>Status</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{status}</p>
          {location && (
            <p style={{ fontSize: '14px', color: '#666' }}>
              📍 Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={startTracking}
            disabled={isDriving}
            style={{
              flex: 1,
              padding: '15px',
              backgroundColor: isDriving ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              cursor: isDriving ? 'not-allowed' : 'pointer'
            }}
          >
            🟢 Start Shift
          </button>

          <button 
            onClick={stopTracking}
            disabled={!isDriving}
            style={{
              flex: 1,
              padding: '15px',
              backgroundColor: !isDriving ? '#ccc' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              cursor: !isDriving ? 'not-allowed' : 'pointer'
            }}
          >
            🔴 End Shift
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
