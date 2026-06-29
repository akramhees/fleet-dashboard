import React from 'react';
import { FaDollarSign, FaUsers, FaBullhorn, FaChartLine } from 'react-icons/fa';
import './colors.css';
import './App.css';

function CampaignAnalytics({ campaigns }) {
  const totalBudget = campaigns.reduce((sum, c) => {
    const num = parseInt(c.budget.replace(/[$,]/g, '')) || 0;
    return sum + num;
  }, 0);

  const activeCount = campaigns.filter(c => c.status === 'Active').length;
  const totalCount = campaigns.length;

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '16px',
      marginBottom: '24px'
    }}>
      <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
        <FaBullhorn size={24} color="#8a5c66" />
        <h4 style={{ margin: '8px 0 4px 0', fontSize: '24px', color: 'var(--text-primary)' }}>{totalCount}</h4>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Campaigns</p>
      </div>
      
      <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
        <FaChartLine size={24} color="#5cb85c" />
        <h4 style={{ margin: '8px 0 4px 0', fontSize: '24px', color: 'var(--text-primary)' }}>{activeCount}</h4>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Active Campaigns</p>
      </div>
      
      <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
        <FaDollarSign size={24} color="#f0ad4e" />
        <h4 style={{ margin: '8px 0 4px 0', fontSize: '24px', color: 'var(--text-primary)' }}>${totalBudget.toLocaleString()}</h4>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Budget</p>
      </div>
      
      <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
        <FaUsers size={24} color="#5b9bd5" />
        <h4 style={{ margin: '8px 0 4px 0', fontSize: '24px', color: 'var(--text-primary)' }}>{totalCount > 0 ? Math.round(activeCount/totalCount * 100) : 0}%</h4>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Active Rate</p>
      </div>
    </div>
  );
}

export default CampaignAnalytics;
