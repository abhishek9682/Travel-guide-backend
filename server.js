const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/guides', require('./routes/guideRoutes'));
app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Travel Guide API' });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});