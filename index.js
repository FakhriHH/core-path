const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const classRoutes = require('./src/routes/classRoutes');
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/detail_class', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'section', 'detailClass.html'));
});

app.get('/aboutUs', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'section', 'aboutUs.html'));
});

// Routing
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'section', 'LoginPage.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'home.html'));
});

app.get('/contact_us', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'Contact_us.html'));
});

app.get('/prising', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'prising.html'));
});

app.get('/payment', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'payment.html'));
});
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes); 

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
