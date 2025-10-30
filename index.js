const express = require('express');
const scoringRoutes = require('./routes/scoringRoutes');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use('/api', scoringRoutes); // Prefix routes with /api

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
