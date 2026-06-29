const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001;

console.log('Starting server...');

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint called');
  res.json({ message: 'Backend is working! 🚀' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);
  
  // Simple validation (in real app, check against database)
  if (email === 'driver@test.com' && password === 'password123') {
    res.json({ 
      success: true, 
      message: 'Login successful!',
      user: { name: 'Test Driver', email: email }
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid email or password' 
    });
  }
});

app.listen(PORT, () => {
  console.log('✅ Server running on http://localhost:' + PORT);
});
