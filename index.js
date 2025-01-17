const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const classRoutes = require('./src/routes/classRoutes');
const meetingRoutes = require('./src/routes/meetingRoutes');
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ 
  extended: true 
}));


app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/meeting', meetingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
