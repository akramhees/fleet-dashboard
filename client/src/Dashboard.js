import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 39.7392,
  lng: -104.9903
};

function Dashboard({ user, onLogout }) {
  const [isDriving, setIsDriving] = useState(false);
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('Not started');
  const [mapCenter, setMapCenter] = useState(center);

  const startTracking = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        async (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(newLocation);
          setMapCenter(newLocation);
          setStatus('✅ Driving - Location tracking active');
          
          try {
            await fetch('http://localhost:5001/api/location', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                driver_id: user.id,
                lat: newLocation.lat,
                lng: newLocation.lng
              })
            });
          } catch (error) {
            console.error('Error saving location:', error);
          }
        },
        (error) => {
          setStatus('❌ Error getting location: ' + error.message);
        }
      );
      setIsDriving(true);
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
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
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

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
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

        {/* Google Map */}
        <LoadScript googleMapsApiKey="<<api key>>">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={14}
          >
            {location && <Marker position={location} />}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}

export default Dashboard;
