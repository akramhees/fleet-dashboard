const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 5001;

console.log('🔥 SERVER STARTING...');

// Database connection - uses Render's DATABASE_URL environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working! 🚀' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  console.log('🔥🔥🔥 LOGIN RECEIVED!');
  console.log('Email:', req.body.email);
  
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const result = await pool.query('SELECT * FROM drivers WHERE email = $1', [email]);
    console.log('Rows found:', result.rows.length);
    
    if (result.rows.length === 0) {
      // Create new user
      console.log('Creating new user...');
      const newUser = await pool.query(
        'INSERT INTO drivers (name, email, password, status) VALUES ($1, $2, $3, $4) RETURNING *',
        ['Test Driver', email, password, 'offline']
      );
      console.log('✅ User created with ID:', newUser.rows[0].id);
      return res.json({ 
        success: true, 
        message: 'Login successful!', 
        user: {
          id: newUser.rows[0].id,
          name: newUser.rows[0].name,
          email: newUser.rows[0].email,
          status: newUser.rows[0].status
        }
      });
    }
    
    // User exists - check password
    const user = result.rows[0];
    if (password === user.password) {
      console.log('✅ User logged in:', user.email);
      return res.json({
        success: true,
        message: 'Login successful!',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          status: user.status
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// Save location endpoint
app.post('/api/location', async (req, res) => {
  const { driver_id, lat, lng } = req.body;
  console.log('📍 Saving location for driver:', driver_id);
  try {
    await pool.query(
      'INSERT INTO locations (driver_id, lat, lng) VALUES ($1, $2, $3)',
      [driver_id, lat, lng]
    );
    await pool.query('UPDATE drivers SET status = $1 WHERE id = $2', ['driving', driver_id]);
    res.json({ success: true, message: 'Location saved' });
  } catch (error) {
    console.error('❌ Location error:', error.message);
    res.status(500).json({ success: false, message: 'Error saving location' });
  }
});

// Get location history
app.get('/api/locations/:driver_id', async (req, res) => {
  const { driver_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM locations WHERE driver_id = $1 ORDER BY timestamp DESC LIMIT 100',
      [driver_id]
    );
    res.json({ success: true, locations: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching locations' });
  }
});

// Get all campaigns
app.get('/api/campaigns', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM campaigns ORDER BY id DESC');
    res.json({ success: true, campaigns: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching campaigns' });
  }
});

// Create campaign
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

// Update campaign
app.put('/api/campaigns/:id', async (req, res) => {
  const { id } = req.params;
  const { name, status, budget } = req.body;
  try {
    const result = await pool.query(
      'UPDATE campaigns SET name = COALESCE($1, name), status = COALESCE($2, status), budget = COALESCE($3, budget) WHERE id = $4 RETURNING *',
      [name, status, budget, id]
    );
    res.json({ success: true, campaign: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating campaign' });
  }
});

// Delete campaign
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
  console.log(`✅ Server running on port ${PORT}`);
});
