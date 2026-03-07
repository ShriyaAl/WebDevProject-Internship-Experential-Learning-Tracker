const express = require('express');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./middlewares/errorHandler');
const supabase = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const requestRoutes = require('./routes/requestRoutes');
const inchargeRoutes = require('./routes/inchargeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/incharge', inchargeRoutes);

// Base Route
app.get('/', (req, res) => {
    res.send('Welcome to the Express Backend API!');
});

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
