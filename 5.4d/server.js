const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bookDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Middleware
app.use(express.json());                      
app.use(express.urlencoded({ extended: true }));  

// Serve Static Files (your public folder)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/books', bookRoutes);

// Error handling middleware (after all routes)
app.use((err, req, res, next) => {
    // Mongoose schema validation → 400
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            statusCode: 400,
            message: err.message
        });
    }

    // Duplicate key (unique constraint) → 409
    if (err.code === 11000) {
        return res.status(409).json({
            statusCode: 409,
            message: `Duplicate key: ${JSON.stringify(err.keyValue)}`
        });
    }

    // Manually thrown errors (404, etc.) 500 for unhandled errors
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        statusCode,
        message: err.message || 'Internal Server Error'
    });
});

// Serve index.html as default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`App listening to: ${PORT}`);
});