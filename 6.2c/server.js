const express = require('express');
const path = require('path');
const coffeeRoutes = require('./routes/coffeeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files (your public folder)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/coffee', coffeeRoutes);

// Error handling middleware (after all routes)
app.use((err, req, res, next) => {
    // Manually thrown errors (404, etc.) 500 for unhandled errors
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        statusCode: statusCode,
        message: err.message || 'Internal Server Error'
    });
});

// Serve index.html as default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});