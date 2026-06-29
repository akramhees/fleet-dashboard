import React, { useState, useEffect } from 'react';
import { FaChartBar, FaUsers, FaBullhorn, FaTrash, FaPlus } from 'react-icons/fa';
import './colors.css';
import './App.css';

function AdminDashboard({ onLogout }) {
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState({ name: '', status: 'Active', budget: '' });
  const [loading, setLoading] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/campaigns');
      const data = await res.json();
      if (data.success) setCampaigns(data.campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const createCampaign = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCampaign)
      });
      const data = await res.json();
      if (data.success) {
        setNewCampaign({ name: '', status: 'Active', budget: '' });
        fetchCampaigns();
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
    setLoading(false);
  };

  const deleteCampaign = async (id) => {
    if (!window.confirm('Delete this campaign?')) return;
    try {
      await fetch(`http://localhost:5001/api/campaigns/${id}`, { method: 'DELETE' });
      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const drivers = [
    { id: 1, name: 'John Driver', status: 'Driving', location: 'Downtown' },
    { id: 2, name: 'Jane Smith', status: 'Offline', location: 'Home' },
    { id: 3, name: 'Bob Johnson', status: 'Driving', location: 'Airport' },
  ];

  return (
    <div className="dashboard-container">
      <div className="header-modern">
        <h1><FaChartBar style={{ marginRight: '10px', color: '#8a5c66' }} size={20} /> FleetMate <span>Admin</span></h1>
        <button onClick={onLogout} className="btn-danger" style={{ padding: '8px 20px', fontSize: '14px' }}>
          Logout
        </button>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>
          <FaUsers style={{ marginRight: '8px' }} /> Active Drivers
        </h3>
        <table className="table-modern">
          <thead><tr><th>Name</th><th>Status</th><th>Location</th></tr></thead>
          <tbody>
            {drivers.map(d => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td><span className={d.status === 'Driving' ? 'badge badge-driving' : 'badge badge-offline'}>{d.status}</span></td>
                <td>{d.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>
          <FaBullhorn style={{ marginRight: '8px' }} /> Marketing Campaigns
        </h3>

        <form onSubmit={createCampaign} className="form-row">
          <input
            type="text" placeholder="Campaign Name"
            className="input-modern"
            value={newCampaign.name}
            onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
            required
          />
          <select
            className="input-modern"
            style={{ width: 'auto', minWidth: '120px' }}
            value={newCampaign.status}
            onChange={(e) => setNewCampaign({...newCampaign, status: e.target.value})}
          >
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
          </select>
          <input
            type="text" placeholder="Budget"
            className="input-modern"
            style={{ width: 'auto', minWidth: '120px' }}
            value={newCampaign.budget}
            onChange={(e) => setNewCampaign({...newCampaign, budget: e.target.value})}
            required
          />
          <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaPlus size={14} /> {loading ? 'Creating...' : 'Add Campaign'}
          </button>
        </form>

        <table className="table-modern">
          <thead><tr><th>Campaign</th><th>Status</th><th>Budget</th><th>Actions</th></tr></thead>
          <tbody>
            {campaigns.map(c => (
              <tr key={c.id}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{c.name}</td>
                <td><span className={c.status === 'Active' ? 'badge badge-active' : 'badge badge-paused'}>{c.status}</span></td>
                <td>{c.budget}</td>
                <td>
                  <button onClick={() => deleteCampaign(c.id)} className="btn-danger" style={{ padding: '4px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaTrash size={12} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
