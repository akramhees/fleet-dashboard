const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const PORT = 5001;

console.log('🔥 SERVER STARTING...');

const pool = new Pool({
  user: 'akram',
  host: 'localhost',
  database: 'fleetpulse',
  password: '',
  port: 5432,
});

app.use(cors());
app.use(express.json());

app.post('/api/login', async (req, res) => {
  console.log('🔥🔥🔥 LOGIN RECEIVED!');
  console.log('Email:', req.body.email);
  console.log('Password:', req.body.password);
  
  try {
    const result = await pool.query('SELECT * FROM drivers WHERE email = $1', [req.body.email]);
    console.log('Rows found:', result.rows.length);
    
    if (result.rows.length === 0) {
      console.log('Creating new user...');
      const newUser = await pool.query(
        'INSERT INTO drivers (name, email, password, status) VALUES ($1, $2, $3, $4) RETURNING *',
        ['Test Driver', req.body.email, req.body.password, 'offline']
      );
      console.log('✅ User created with ID:', newUser.rows[0].id);
      return res.json({ 
        success: true, 
        message: 'Login successful!', 
        user: { 
          id: newUser.rows[0].id,
          name: newUser.rows[0].name, 
          email: newUser.rows[0].email 
        } 
      });
    }
    
    console.log('User found, logging in...');
    res.json({ 
      success: true, 
      message: 'Login successful!', 
      user: { 
        id: result.rows[0].id,
        name: result.rows[0].name, 
        email: result.rows[0].email 
      } 
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working! 🚀' });
});

app.post('/api/location', async (req, res) => {
  const { driver_id, lat, lng } = req.body;
  try {
    await pool.query(
      'INSERT INTO locations (driver_id, lat, lng) VALUES ($1, $2, $3)',
      [driver_id, lat, lng]
    );
    res.json({ success: true, message: 'Location saved' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving location' });
  }
});

app.get('/api/campaigns', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM campaigns');
    res.json({ success: true, campaigns: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching campaigns' });
  }
});

app.post('/api/campaigns', async (req, res) => {
  const { name, status, budget } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO campaigns (name, status, budget) VALUES ($1, $2, $3) RETURNING *',
      [name, status || 'Active', budget || '$0']
    );
    res.json({ success: true, campaign: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating campaign' });
  }
});

app.delete('/api/campaigns/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM campaigns WHERE id = $1', [id]);
    res.json({ success: true, message: 'Campaign deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting campaign' });
  }
});

app.listen(PORT, () => {
  console.log('✅ Server running on http://localhost:' + PORT);
});
