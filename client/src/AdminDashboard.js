import React, { useState } from 'react';

function AdminDashboard({ onLogout }) {
  const [drivers] = useState([
    { id: 1, name: 'John Driver', status: '🟢 Driving', location: 'Downtown' },
    { id: 2, name: 'Jane Smith', status: '🔴 Offline', location: 'Home' },
    { id: 3, name: 'Bob Johnson', status: '🟢 Driving', location: 'Airport' },
  ]);

  const [campaigns] = useState([
    { id: 1, name: 'Summer Sale', status: 'Active', budget: '$500' },
    { id: 2, name: 'Holiday Promo', status: 'Paused', budget: '$300' },
    { id: 3, name: 'New Driver Bonus', status: 'Active', budget: '$1000' },
  ]);

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #eee',
        paddingBottom: '20px'
      }}>
        <h2>📊 Admin Dashboard</h2>
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
        <h3>🚗 Active Drivers</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Location</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(driver => (
              <tr key={driver.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{driver.name}</td>
                <td style={{ padding: '10px' }}>{driver.status}</td>
                <td style={{ padding: '10px' }}>{driver.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>📢 Marketing Campaigns</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Campaign</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Budget</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(campaign => (
              <tr key={campaign.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{campaign.name}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: campaign.status === 'Active' ? '#d4edda' : '#f8d7da',
                    color: campaign.status === 'Active' ? '#155724' : '#721c24',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {campaign.status}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>{campaign.budget}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
