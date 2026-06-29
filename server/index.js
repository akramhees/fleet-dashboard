const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5001;

console.log('🔥 SERVER STARTING...');

const pool = new Pool({
  connectionString: "postgresql://fleetpulse_db_zbds_user:P9gLHcN3JGAAbxpGJdBvjLJEZ9QSDSkq@dpg-d91322og4nts73c57etg-a.oregon-postgres.render.com/fleetpulse_db_zbds",
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  socket.on('driver-location', (data) => {
    console.log('📍 Location update:', data);
    io.emit('location-update', data);
  });
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

pool.connect((err, client, release) => {
  if (err) {
    console.log('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Database connected!');
    release();
  }
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS drivers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        phone VARCHAR(20),
        password VARCHAR(100),
        status VARCHAR(50) DEFAULT 'offline',
        license_number VARCHAR(50),
        vehicle_model VARCHAR(100),
        vehicle_plate VARCHAR(20),
        onboarding_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        driver_id INTEGER REFERENCES drivers(id),
        lat DECIMAL(10, 8),
        lng DECIMAL(11, 8),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Active',
        budget VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Database tables created');
  } catch (err) {
    console.log('❌ Database init error:', err.message);
  }
};
initDB();

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working! 🚀' });
});

app.post('/api/signup', async (req, res) => {
  const { name, email, phone, password, licenseNumber, vehicleModel, vehiclePlate } = req.body;
  console.log('📝 Sign up attempt:', email);
  
  try {
    const existing = await pool.query('SELECT * FROM drivers WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    
    const result = await pool.query(
      `INSERT INTO drivers (name, email, phone, password, license_number, vehicle_model, vehicle_plate, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, email, phone, password, licenseNumber, vehicleModel, vehiclePlate, 'pending']
    );
    
    console.log('✅ Driver created:', result.rows[0].id);
    res.json({ success: true, message: 'Account created! Please login.', user: result.rows[0] });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);
  
  try {
    const result = await pool.query('SELECT * FROM drivers WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      if (email === 'driver@test.com' && password === 'password123') {
        const newUser = await pool.query(
          'INSERT INTO drivers (name, email, password, status) VALUES ($1, $2, $3, $4) RETURNING *',
          ['Test Driver', email, password, 'offline']
        );
        return res.json({
          success: true,
          message: 'Login successful!',
          user: newUser.rows[0]
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    const user = result.rows[0];
    if (password === user.password) {
      res.json({
        success: true,
        message: 'Login successful!',
        user: user
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/location', async (req, res) => {
  const { driver_id, lat, lng } = req.body;
  try {
    await pool.query(
      'INSERT INTO locations (driver_id, lat, lng) VALUES ($1, $2, $3)',
      [driver_id, lat, lng]
    );
    await pool.query('UPDATE drivers SET status = $1 WHERE id = $2', ['driving', driver_id]);
    res.json({ success: true, message: 'Location saved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error saving location' });
  }
});

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

app.get('/api/campaigns', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM campaigns ORDER BY id DESC');
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

app.delete('/api/campaigns/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM campaigns WHERE id = $1', [id]);
    res.json({ success: true, message: 'Campaign deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting campaign' });
  }
});

server.listen(PORT, () => {
  console.log('✅ Server running on http://localhost:' + PORT);
});
