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

// Serve index.html as default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`App listening to: ${PORT}`);
});