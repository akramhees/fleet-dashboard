import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { FaCar, FaPlay, FaStop, FaSyncAlt } from 'react-icons/fa';
import localforage from 'localforage';
import './colors.css';
import './App.css';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px'
};

const mapOptions = {
  styles: [
    { featureType: 'all', elementType: 'all', stylers: [{ saturation: -100 }, { lightness: -20 }, { gamma: 0.5 }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#3a3a4a' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
    { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#28293e' }] }
  ]
};

const center = { lat: 39.7392, lng: -104.9903 };

function Dashboard({ user, onLogout }) {
  const [isDriving, setIsDriving] = useState(false);
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('Not started');
  const [mapCenter, setMapCenter] = useState(center);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineLocations, setOfflineLocations] = useState([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline && offlineLocations.length > 0) syncOfflineLocations();
  }, [isOnline]);

  const syncOfflineLocations = async () => {
    try {
      const saved = await localforage.getItem('offlineLocations');
      if (saved && saved.length > 0) {
        for (const loc of saved) {
          await fetch('http://localhost:5001/api/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loc)
          });
        }
        await localforage.removeItem('offlineLocations');
        setOfflineLocations([]);
        setStatus('Synced offline locations');
      }
    } catch (error) {
      console.error('Sync error:', error);
    }
  };

  const saveLocation = async (locationData) => {
    if (navigator.onLine) {
      try {
        await fetch('http://localhost:5001/api/location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(locationData)
        });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  };

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

          const locationData = { driver_id: user.id, lat: newLocation.lat, lng: newLocation.lng };
          const saved = await saveLocation(locationData);

          if (!saved) {
            const existing = await localforage.getItem('offlineLocations') || [];
            existing.push(locationData);
            await localforage.setItem('offlineLocations', existing);
            setOfflineLocations(existing);
            setStatus('Offline – saved locally');
          } else {
            setStatus('Driving – location active');
          }
        },
        (error) => setStatus('Error: ' + error.message)
      );
      setIsDriving(true);
    } else {
      setStatus('Geolocation not supported');
    }
  };

  const stopTracking = () => {
    setIsDriving(false);
    setStatus('Shift ended');
    setLocation(null);
  };

  return (
    <div className="dashboard-container">
      <div className="header-modern">
        <h1><FaCar style={{ marginRight: '10px', color: '#8a5c66' }} size={20} /> FleetMate <span>Driver</span></h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{user?.name}</span>
          <span style={{
            fontSize: '12px',
            padding: '4px 12px',
            borderRadius: '20px',
            background: isOnline ? 'rgba(40, 167, 69, 0.12)' : 'rgba(220, 53, 69, 0.12)',
            color: isOnline ? '#5cb85c' : '#e06b6b',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
            {isOnline ? 'Online' : 'Offline'}
          </span>
          <button onClick={onLogout} className="btn-danger" style={{ padding: '8px 20px', fontSize: '14px' }}>
            Logout
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '2px' }}>Driver Dashboard</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Status: <strong style={{ color: 'var(--text-primary)' }}>{status}</strong>
            </p>
            {offlineLocations.length > 0 && (
              <p style={{ color: '#f0ad4e', fontSize: '13px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaSyncAlt size={12} /> {offlineLocations.length} locations waiting to sync
              </p>
            )}
            {location && (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
            <button onClick={startTracking} disabled={isDriving} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaPlay size={14} /> Start Shift
            </button>
            <button onClick={stopTracking} disabled={!isDriving} className="btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaStop size={14} /> End Shift
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '8px' }}>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={14}
            options={mapOptions}
          >
            {location && <Marker position={location} />}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}

export default Dashboard;
