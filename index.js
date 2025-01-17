const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'pages', 'LoginPage.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'SignUp.html'));
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
