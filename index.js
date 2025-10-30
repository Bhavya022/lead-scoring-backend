const express = require('express');
const scoringRoutes = require('./routes/scoringRoutes');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use('/api', scoringRoutes);

// Base route for health check
app.get('/', (req, res) => {
  res.json({ message: 'Lead Scoring Backend API is running', version: '1.0.0' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
