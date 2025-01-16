const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const classRoutes = require('./src/routes/classRoutes');
const path = require('path');
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/core-path', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'section', 'detailClass.html'));
});

app.get('/aboutUs.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'section', 'aboutUs.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
