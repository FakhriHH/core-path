const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const scheduleRoutes = require('./src/routes/scheduleRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const classRoutes = require('./src/routes/classRoutes');
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/classes', classRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});